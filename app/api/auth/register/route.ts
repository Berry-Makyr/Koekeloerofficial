import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RegisterSchema } from '@/lib/validators';
import { hashPassword, signSessionToken, setSessionCookie } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { UserRole, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = RegisterSchema.parse(body);

    // Check if user already exists (avoid leaking details, return standard response)
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(validatedData.password);

    // First user can optionally be promoted, else default CUSTOMER
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? UserRole.SUPER_ADMIN : UserRole.CUSTOMER;

    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        passwordHash,
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        phone: validatedData.phone?.trim(),
        role,
        status: UserStatus.ACTIVE,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Create session token and set HTTP-only cookie
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
    });

    await setSessionCookie(token);

    // Audit log
    await createAuditLog({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      newValue: { email: user.email, role: user.role },
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid registration data' }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}
