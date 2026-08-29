import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { CheckoutOrderSchema } from '@/lib/validators';
import { createAuditLog } from '@/lib/audit';
import { PaymentStatus, FulfillmentStatus, DeliveryMethod } from '@prisma/client';

const FREE_SHIPPING_THRESHOLD = 1200;
const STANDARD_SHIPPING_FEE = 150;
const EXPRESS_SHIPPING_FEE = 220;

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const customer = await getCurrentUser();

    if (!admin && !customer) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Please sign in' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (!admin) {
      // Ordinary customers can only view their own orders
      where.userId = customer?.id;
    }

    if (status && admin) {
      where.fulfillmentStatus = status as FulfillmentStatus;
    }

    try {
      const orders = await prisma.order.findMany({
        where,
        include: {
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ orders });
    } catch {
      // Database not connected yet
      return NextResponse.json({ orders: [] });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const validatedData = CheckoutOrderSchema.parse(body);

    const productIds = validatedData.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: {
        variants: { where: { isActive: true } },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Transaction to atomically verify, deduct stock, and create Order
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of validatedData.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`Product ID ${item.productId} is not available.`);
        }

        let unitPrice = product.price;
        let variantTitle: string | null = null;
        let sku = product.sku || null;

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant) {
            throw new Error(`Variant for "${product.name}" is no longer available.`);
          }
          unitPrice += variant.priceAdjustment;
          variantTitle = variant.title;
          sku = variant.sku;

          if (product.trackInventory) {
            if (variant.stockQuantity < item.quantity) {
              throw new Error(`Insufficient stock for "${product.name} (${variant.title})". Only ${variant.stockQuantity} remaining.`);
            }

            // Atomically decrement variant stock
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stockQuantity: { decrement: item.quantity },
              },
            });
          }
        }

        if (product.trackInventory) {
          if (product.totalStock < item.quantity) {
            throw new Error(`Insufficient total stock for "${product.name}". Only ${product.totalStock} remaining.`);
          }

          // Atomically decrement product total stock
          await tx.product.update({
            where: { id: product.id },
            data: {
              totalStock: { decrement: item.quantity },
            },
          });
        }

        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: product.id,
          variantId: item.variantId || null,
          sku,
          productNameSnapshot: product.name,
          variantTitleSnapshot: variantTitle,
          unitPriceSnapshot: unitPrice,
          quantity: item.quantity,
          totalPriceSnapshot: itemTotal,
          imageUrlSnapshot: product.images[0] || null,
        });
      }

      // Server-side discount calculation
      let discountAmount = 0;
      if (validatedData.couponCode) {
        const code = validatedData.couponCode.trim().toUpperCase();
        if (code === 'KOEKELOER10') {
          discountAmount = Math.round(subtotal * 0.1);
        } else if (code === 'WINTER20') {
          discountAmount = Math.round(subtotal * 0.2);
        }
      }

      // Shipping calculation
      let shippingAmount = 0;
      if (validatedData.deliveryMethod === DeliveryMethod.PICKUP_GANSBAAI) {
        shippingAmount = 0;
      } else if (validatedData.deliveryMethod === DeliveryMethod.COURIER_EXPRESS) {
        shippingAmount = EXPRESS_SHIPPING_FEE;
      } else {
        shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      }

      const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount);
      const randomOrderSuffix = Math.floor(100000 + Math.random() * 900000);
      const orderNumber = `KKL-${new Date().getFullYear()}-${randomOrderSuffix}`;

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id || null,
          customerEmail: validatedData.customerEmail.toLowerCase().trim(),
          customerPhone: validatedData.customerPhone.trim(),
          customerName: validatedData.customerName.trim(),
          subtotal,
          discountAmount,
          shippingAmount,
          totalAmount,
          couponCode: validatedData.couponCode || null,
          paymentStatus: PaymentStatus.PAID, // Simulated payment success for verified order
          fulfillmentStatus: FulfillmentStatus.PROCESSING,
          deliveryMethod: validatedData.deliveryMethod,
          shippingAddressSnapshot: validatedData.shippingAddress,
          billingAddressSnapshot: validatedData.billingAddress || validatedData.shippingAddress,
          customerNotes: validatedData.customerNotes?.trim() || null,
          paidAt: new Date(),
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              provider: 'PAYFAST',
              transactionReference: `pf_${Date.now()}_${randomOrderSuffix}`,
              amountExpected: totalAmount,
              amountConfirmed: totalAmount,
              currency: 'ZAR',
              status: PaymentStatus.PAID,
              confirmedAt: new Date(),
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      return newOrder;
    });

    await createAuditLog({
      userId: user?.id || null,
      action: 'ORDER_PLACED',
      entityType: 'Order',
      entityId: order.id,
      newValue: { orderNumber: order.orderNumber, totalAmount: order.totalAmount, itemsCount: order.items.length },
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({ message: 'Order created successfully', order }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid order data' }, { status: 400 });
    }
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
