import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'koekeloer_production_secret_key_change_in_env_2026'
);

const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  STAFF: 2,
  CUSTOMER: 1,
};

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Protect Admin Panel routes (/admin, /admin/*)
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('kkl_session')?.value;

    if (!token) {
      const loginUrl = new URL('/account/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'admin_auth_required');
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const userRole = (payload.role as string) || 'CUSTOMER';

      if (!hasRequiredRole(userRole, 'STAFF')) {
        const accountUrl = new URL('/account', req.url);
        accountUrl.searchParams.set('error', 'insufficient_permissions');
        return NextResponse.redirect(accountUrl);
      }
    } catch {
      const loginUrl = new URL('/account/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'session_expired');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Customer Account routes (/account, but allow /account/login)
  if (pathname.startsWith('/account') && !pathname.startsWith('/account/login')) {
    const token = req.cookies.get('kkl_session')?.value;

    if (!token) {
      const loginUrl = new URL('/account/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      const loginUrl = new URL('/account/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'session_expired');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
