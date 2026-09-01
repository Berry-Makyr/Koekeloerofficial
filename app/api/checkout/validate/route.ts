import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CheckoutCartItemSchema } from '@/lib/validators';
import { z } from 'zod';
import { DiscountType, DeliveryMethod } from '@prisma/client';

const ValidateCartRequestSchema = z.object({
  items: z.array(CheckoutCartItemSchema).min(1, 'Cart is empty'),
  couponCode: z.string().optional(),
  deliveryMethod: z.nativeEnum(DeliveryMethod).default(DeliveryMethod.COURIER_STANDARD),
});

const STANDARD_SHIPPING_FEE = 150;
const EXPRESS_SHIPPING_FEE = 220;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, couponCode, deliveryMethod } = ValidateCartRequestSchema.parse(body);

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: {
        variants: { where: { isActive: true } },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const validatedItems: any[] = [];
    let subtotal = 0;
    const errors: string[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        errors.push(`Item ID ${item.productId} is no longer available.`);
        continue;
      }

      let unitPrice = product.price;
      let variantTitle = '';
      let availableStock = product.totalStock;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          errors.push(`Selected option for "${product.name}" is no longer available.`);
          continue;
        }
        unitPrice += variant.priceAdjustment;
        variantTitle = variant.title;
        availableStock = variant.stockQuantity;
      }

      // Check stock
      if (product.trackInventory && availableStock < item.quantity) {
        errors.push(`Insufficient stock for "${product.name}". Only ${availableStock} left in stock.`);
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        name: product.name,
        variantTitle: variantTitle || null,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
        image: product.images[0] || null,
        availableStock,
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ isValid: false, errors }, { status: 400 });
    }

    // Server-side Promo Code Evaluation
    let discountAmount = 0;
    let appliedCoupon: any = null;

    if (couponCode && couponCode.trim()) {
      const promo = await prisma.promotion.findUnique({
        where: { code: couponCode.trim().toUpperCase(), isActive: true },
      });

      if (!promo) {
        // Fallback for default built-in promo codes
        if (couponCode.trim().toUpperCase() === 'KOEKELOER10') {
          discountAmount = Math.round(subtotal * 0.1);
          appliedCoupon = { code: 'KOEKELOER10', discountPercent: 10 };
        } else if (couponCode.trim().toUpperCase() === 'WINTER20') {
          discountAmount = Math.round(subtotal * 0.2);
          appliedCoupon = { code: 'WINTER20', discountPercent: 20 };
        }
      } else {
        const now = new Date();
        const isStarted = !promo.startDate || promo.startDate <= now;
        const isNotExpired = !promo.endDate || promo.endDate >= now;
        const hasUsesLeft = promo.maxUses === null || promo.usedCount < promo.maxUses;
        const meetsMinAmount = subtotal >= promo.minOrderAmount;

        if (isStarted && isNotExpired && hasUsesLeft && meetsMinAmount) {
          if (promo.type === DiscountType.PERCENTAGE) {
            discountAmount = Math.round((subtotal * promo.value) / 100);
          } else {
            discountAmount = Math.min(subtotal, promo.value);
          }
          appliedCoupon = { code: promo.code, value: promo.value, type: promo.type };
        }
      }
    }

    // Shipping fee calculation
    let shippingFee = 0;
    if (deliveryMethod === DeliveryMethod.PICKUP_GANSBAAI) {
      shippingFee = 0;
    } else if (deliveryMethod === DeliveryMethod.COURIER_EXPRESS) {
      shippingFee = EXPRESS_SHIPPING_FEE;
    } else {
      shippingFee = STANDARD_SHIPPING_FEE;
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    return NextResponse.json({
      isValid: true,
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      appliedCoupon,
      items: validatedItems,
    });
  } catch (error: any) {
    console.error('Cart validation error:', error);
    return NextResponse.json({ error: 'Failed to validate cart totals' }, { status: 500 });
  }
}
