import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/admin-auth';

export async function POST() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ message: 'Admin signed out successfully' });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}
