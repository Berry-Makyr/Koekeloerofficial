import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LoginSchema } from '@/lib/validators';
import { verifyPassword, signSessionToken, setSessionCookie } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status !== UserStatus.ACTIVE) {
      return NextResponse.json({ error: 'Your account is suspended. Please contact support.' }, { status: 403 });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      await createAuditLog({
        userId: user.id,
        action: 'FAILED_LOGIN_ATTEMPT',
        entityType: 'User',
        entityId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      });

      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
    });

    await setSessionCookie(token);

    await createAuditLog({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid login details' }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to sign in. Please try again.' }, { status: 500 });
  }
}
