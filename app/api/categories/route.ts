import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/admin-auth';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdminAuth('STAFF');
    const body = await req.json();

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Category name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
        slug: body.slug.trim().toLowerCase(),
        description: body.description?.trim() || null,
        image: body.image || null,
        sortOrder: body.sortOrder || 0,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: 'CATEGORY_CREATED',
      entityType: 'Category',
      entityId: category.id,
      newValue: category,
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error.message.startsWith('UNAUTHORIZED') || error.message.startsWith('FORBIDDEN')) {
      return NextResponse.json({ error: error.message }, { status: error.message.startsWith('UNAUTHORIZED') ? 401 : 403 });
    }
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
