import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/admin-auth';
import { InventoryAdjustmentSchema } from '@/lib/validators';
import { createAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdminAuth('STAFF');
    const body = await req.json();
    const { productId, variantId, newQuantity, reason } = InventoryAdjustmentSchema.parse(body);

    if (!productId && !variantId) {
      return NextResponse.json({ error: 'Either productId or variantId must be provided' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      let previousQuantity = 0;
      let quantityChanged = 0;

      if (variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
        if (!variant) throw new Error('Variant not found');
        previousQuantity = variant.stockQuantity;
        quantityChanged = newQuantity - previousQuantity;

        await tx.productVariant.update({
          where: { id: variantId },
          data: { stockQuantity: newQuantity },
        });

        // Recalculate total product stock
        const allVariants = await tx.productVariant.findMany({
          where: { productId: variant.productId, isActive: true },
        });
        const total = allVariants.reduce((sum, v) => sum + (v.id === variantId ? newQuantity : v.stockQuantity), 0);
        await tx.product.update({
          where: { id: variant.productId },
          data: { totalStock: total },
        });
      } else if (productId) {
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');
        previousQuantity = product.totalStock;
        quantityChanged = newQuantity - previousQuantity;

        await tx.product.update({
          where: { id: productId },
          data: { totalStock: newQuantity },
        });
      }

      const adjustment = await tx.inventoryAdjustment.create({
        data: {
          productId: productId || null,
          variantId: variantId || null,
          previousQuantity,
          newQuantity,
          quantityChanged,
          reason,
          adjustedByUserId: user.id,
        },
      });

      return adjustment;
    });

    await createAuditLog({
      userId: user.id,
      action: 'INVENTORY_ADJUSTED',
      entityType: 'Inventory',
      entityId: result.id,
      newValue: { productId, variantId, newQuantity, reason },
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({ message: 'Stock adjusted successfully', adjustment: result });
  } catch (error: any) {
    if (error.message.startsWith('UNAUTHORIZED') || error.message.startsWith('FORBIDDEN')) {
      return NextResponse.json({ error: error.message }, { status: error.message.startsWith('UNAUTHORIZED') ? 401 : 403 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid adjustment data' }, { status: 400 });
    }
    console.error('Inventory adjust error:', error);
    return NextResponse.json({ error: error.message || 'Failed to adjust stock' }, { status: 500 });
  }
}
