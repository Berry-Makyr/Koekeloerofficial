import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';
import { UserRole, UserStatus } from '@prisma/client';

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'koekeloer_admin_secure_secret_key_2026'
);

const ADMIN_SESSION_COOKIE_NAME = 'kkl_admin_session';
const ADMIN_SESSION_DURATION = 60 * 60 * 12; // 12 hours for admin sessions

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  role: 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  name: string;
}

// Fallback seed admin credentials for initial setup before DB connection is configured
export const DEFAULT_ADMIN_CONFIG = {
  email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@koekeloer.co.za',
  // Password hash for: KoekeloerAdmin2026!
  passwordHash: '$2a$12$Nq/V9qYjN4mR76pFnSg68.o3g8Tj7i17U4Cg7L7Yh0mS7Zp8qM4uW',
  name: 'Koekeloer Administrator',
  role: 'SUPER_ADMIN' as const,
};

export async function signAdminSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyAdminSessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      role: payload.role as 'STAFF' | 'ADMIN' | 'SUPER_ADMIN',
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await verifyAdminSessionToken(token);
    if (!session || !session.adminId) return null;

    // Check database if available
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.adminId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
        },
      });

      if (user && user.status === UserStatus.ACTIVE && (user.role === UserRole.STAFF || user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      }
    } catch {
      // If DB is unreachable, validate session token payload
    }

    // If session matches fallback admin or valid JWT payload
    if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' || session.role === 'STAFF') {
      return {
        id: session.adminId,
        email: session.email,
        name: session.name,
        role: session.role,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching current admin:', error);
    return null;
  }
}

export async function requireAdminAuth(minimumRole: 'STAFF' | 'ADMIN' | 'SUPER_ADMIN' = 'STAFF') {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('UNAUTHORIZED: Admin authentication required');
  }

  const roleWeights = { STAFF: 1, ADMIN: 2, SUPER_ADMIN: 3 };
  if ((roleWeights[admin.role] || 0) < (roleWeights[minimumRole] || 0)) {
    throw new Error('FORBIDDEN: Insufficient administrative privileges');
  }

  return admin;
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_DURATION,
    path: '/',
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
