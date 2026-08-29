import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/admin-auth';
import { ProductCreateSchema } from '@/lib/validators';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const filter = searchParams.get('filter'); // sale, new, featured
    const inStock = searchParams.get('inStock') === 'true';

    const where: any = { isActive: true };

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    if (filter === 'sale') {
      where.isSale = true;
    } else if (filter === 'new') {
      where.isNewArrival = true;
    } else if (filter === 'featured') {
      where.isFeatured = true;
    }

    if (inStock) {
      where.totalStock = { gt: 0 };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        variants: {
          where: { isActive: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only Staff, Admin, or Super Admin can create products
    const user = await requireAdminAuth('STAFF');

    const body = await req.json();
    const validatedData = ProductCreateSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: validatedData.name.trim(),
        slug: validatedData.slug.trim().toLowerCase(),
        sku: validatedData.sku?.trim() || null,
        description: validatedData.description.trim(),
        shortDescription: validatedData.shortDescription?.trim() || null,
        categoryId: validatedData.categoryId,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice || null,
        images: validatedData.images,
        badges: validatedData.badges,
        tags: validatedData.tags.map((t) => t.toLowerCase().trim()),
        dimensions: validatedData.dimensions?.trim() || null,
        materials: validatedData.materials?.trim() || null,
        careInstructions: validatedData.careInstructions?.trim() || null,
        origin: validatedData.origin?.trim() || null,
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
        isNewArrival: validatedData.isNewArrival,
        isSale: validatedData.isSale,
        trackInventory: validatedData.trackInventory,
        totalStock: validatedData.totalStock,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: 'PRODUCT_CREATED',
      entityType: 'Product',
      entityId: product.id,
      newValue: product,
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
  } catch (error: any) {
    if (error.message.startsWith('UNAUTHORIZED') || error.message.startsWith('FORBIDDEN')) {
      return NextResponse.json({ error: error.message }, { status: error.message.startsWith('UNAUTHORIZED') ? 401 : 403 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid product data' }, { status: 400 });
    }
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
