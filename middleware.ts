import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const CUSTOMER_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'koekeloer_production_secret_key_change_in_env_2026'
);

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'koekeloer_admin_secure_secret_key_2026'
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Admin Routes (/admin, /admin/*)
  if (pathname.startsWith('/admin')) {
    // Allow public access to the dedicated admin login page
    if (pathname === '/admin/login') {
      const adminToken = req.cookies.get('kkl_admin_session')?.value;
      if (adminToken) {
        try {
          await jwtVerify(adminToken, ADMIN_JWT_SECRET);
          // If already authenticated as admin, redirect to admin dashboard
          return NextResponse.redirect(new URL('/admin', req.url));
        } catch {
          // Invalid token, allow viewing login page
        }
      }
      return NextResponse.next();
    }

    // Protected Admin Routes: Check dedicated kkl_admin_session cookie
    const adminToken = req.cookies.get('kkl_admin_session')?.value;

    if (!adminToken) {
      const adminLoginUrl = new URL('/admin/login', req.url);
      adminLoginUrl.searchParams.set('redirect', pathname);
      adminLoginUrl.searchParams.set('error', 'admin_auth_required');
      return NextResponse.redirect(adminLoginUrl);
    }

    try {
      const { payload } = await jwtVerify(adminToken, ADMIN_JWT_SECRET);
      const role = (payload.role as string) || '';

      if (role !== 'STAFF' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        const adminLoginUrl = new URL('/admin/login', req.url);
        adminLoginUrl.searchParams.set('error', 'insufficient_permissions');
        return NextResponse.redirect(adminLoginUrl);
      }
    } catch {
      const adminLoginUrl = new URL('/admin/login', req.url);
      adminLoginUrl.searchParams.set('redirect', pathname);
      adminLoginUrl.searchParams.set('error', 'session_expired');
      return NextResponse.redirect(adminLoginUrl);
    }

    return NextResponse.next();
  }

  // 2. Customer Account Routes (/account, /account/*)
  if (pathname.startsWith('/account')) {
    if (pathname === '/account/login') {
      const customerToken = req.cookies.get('kkl_session')?.value;
      if (customerToken) {
        try {
          await jwtVerify(customerToken, CUSTOMER_JWT_SECRET);
          return NextResponse.redirect(new URL('/account', req.url));
        } catch {
          // Token expired, allow customer login page
        }
      }
      return NextResponse.next();
    }

    // Protected Customer Account: Check kkl_session
    const customerToken = req.cookies.get('kkl_session')?.value;
    if (!customerToken) {
      const loginUrl = new URL('/account/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(customerToken, CUSTOMER_JWT_SECRET);
    } catch {
      const loginUrl = new URL('/account/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'session_expired');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
