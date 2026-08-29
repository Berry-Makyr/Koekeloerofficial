import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/admin-auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdminAuth('STAFF');
    const { id } = await params;
    const body = await req.json();

    const previousProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!previousProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        slug: body.slug !== undefined ? body.slug : undefined,
        sku: body.sku !== undefined ? body.sku : undefined,
        description: body.description !== undefined ? body.description : undefined,
        shortDescription: body.shortDescription !== undefined ? body.shortDescription : undefined,
        categoryId: body.categoryId !== undefined ? body.categoryId : undefined,
        price: body.price !== undefined ? Number(body.price) : undefined,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : null) : undefined,
        images: body.images !== undefined ? body.images : undefined,
        badges: body.badges !== undefined ? body.badges : undefined,
        tags: body.tags !== undefined ? body.tags : undefined,
        dimensions: body.dimensions !== undefined ? body.dimensions : undefined,
        materials: body.materials !== undefined ? body.materials : undefined,
        careInstructions: body.careInstructions !== undefined ? body.careInstructions : undefined,
        origin: body.origin !== undefined ? body.origin : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : undefined,
        isNewArrival: body.isNewArrival !== undefined ? body.isNewArrival : undefined,
        isSale: body.isSale !== undefined ? body.isSale : undefined,
        totalStock: body.totalStock !== undefined ? Number(body.totalStock) : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: 'PRODUCT_UPDATED',
      entityType: 'Product',
      entityId: id,
      previousValue: previousProduct,
      newValue: updatedProduct,
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error: any) {
    if (error.message.startsWith('UNAUTHORIZED') || error.message.startsWith('FORBIDDEN')) {
      return NextResponse.json({ error: error.message }, { status: error.message.startsWith('UNAUTHORIZED') ? 401 : 403 });
    }
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdminAuth('ADMIN');
    const { id } = await params;

    const previousProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!previousProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Soft-delete or hard-delete
    await prisma.product.delete({
      where: { id },
    });

    await createAuditLog({
      userId: user.id,
      action: 'PRODUCT_DELETED',
      entityType: 'Product',
      entityId: id,
      previousValue: previousProduct,
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    if (error.message.startsWith('UNAUTHORIZED') || error.message.startsWith('FORBIDDEN')) {
      return NextResponse.json({ error: error.message }, { status: error.message.startsWith('UNAUTHORIZED') ? 401 : 403 });
    }
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
