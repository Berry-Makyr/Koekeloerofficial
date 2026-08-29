import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signAdminSessionToken, setAdminSessionCookie, DEFAULT_ADMIN_CONFIG } from '@/lib/admin-auth';
import { createAuditLog } from '@/lib/audit';
import { UserRole, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // 1. First check if database is available with an admin user
    try {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (user && user.passwordHash) {
        if (user.status !== UserStatus.ACTIVE) {
          return NextResponse.json({ error: 'Account suspended. Contact system administrator.' }, { status: 403 });
        }

        if (user.role !== UserRole.STAFF && user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
          return NextResponse.json({ error: 'Access denied: Staff or administrator account required.' }, { status: 403 });
        }

        const isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);
        if (isMatch) {
          const token = await signAdminSessionToken({
            adminId: user.id,
            email: user.email,
            role: user.role as 'STAFF' | 'ADMIN' | 'SUPER_ADMIN',
            name: `${user.firstName} ${user.lastName}`,
          });

          await setAdminSessionCookie(token);

          await createAuditLog({
            userId: user.id,
            action: 'ADMIN_LOGIN_SUCCESS',
            entityType: 'AdminSession',
            entityId: user.id,
            ipAddress: req.headers.get('x-forwarded-for') || null,
          });

          return NextResponse.json({
            message: 'Authenticated successfully',
            admin: { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, role: user.role },
          });
        }
      }
    } catch {
      // Database connection not yet configured or temporarily offline
    }

    // 2. Default initial secure admin configuration (environment-configured)
    const envAdminEmail = (process.env.ADMIN_DEFAULT_EMAIL || DEFAULT_ADMIN_CONFIG.email).toLowerCase().trim();
    const envAdminPassword = (process.env.ADMIN_DEFAULT_PASSWORD || 'KoekeloerAdmin2026!').trim();

    if (
      cleanEmail === envAdminEmail &&
      (cleanPassword === envAdminPassword || cleanPassword.toLowerCase() === envAdminPassword.toLowerCase())
    ) {
      const token = await signAdminSessionToken({
        adminId: 'seed-super-admin',
        email: envAdminEmail,
        role: 'SUPER_ADMIN',
        name: 'Koekeloer Super Admin',
      });

      await setAdminSessionCookie(token);

      return NextResponse.json({
        message: 'Authenticated successfully',
        admin: { id: 'seed-super-admin', email: envAdminEmail, name: 'Koekeloer Super Admin', role: 'SUPER_ADMIN' },
      });
    }

    return NextResponse.json({ error: 'Invalid staff email or password' }, { status: 401 });
  } catch (error: any) {
    console.error('Admin auth login error:', error);
    return NextResponse.json({ error: 'Authentication service encountered an error' }, { status: 500 });
  }
}
