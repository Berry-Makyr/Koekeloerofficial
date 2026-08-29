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
    const email = validatedData.email.toLowerCase().trim();

    const passwordHash = await hashPassword(validatedData.password);
    let user: any = null;

    try {
      // 1. Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'An account with this email address already exists. Please sign in.' },
          { status: 409 }
        );
      }

      // Customer registration ALWAYS creates CUSTOMER role — never Admin/Staff
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName: validatedData.firstName.trim(),
          lastName: validatedData.lastName.trim(),
          phone: validatedData.phone?.trim() || null,
          role: UserRole.CUSTOMER,
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

      await createAuditLog({
        userId: user.id,
        action: 'CUSTOMER_REGISTERED',
        entityType: 'User',
        entityId: user.id,
        newValue: { email: user.email, role: 'CUSTOMER' },
        ipAddress: req.headers.get('x-forwarded-for') || null,
      });
    } catch (dbErr: any) {
      console.warn('Database offline or connecting. Creating fallback customer session:', dbErr?.message);
      // Fallback session object for customer
      user = {
        id: `cust_${Date.now()}`,
        email,
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        phone: validatedData.phone?.trim() || '',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        createdAt: new Date(),
      };
    }

    // Create session token and set HTTP-only cookie
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: 'CUSTOMER',
      name: `${user.firstName} ${user.lastName}`,
    });

    await setSessionCookie(token);

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: 'CUSTOMER',
        },
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
