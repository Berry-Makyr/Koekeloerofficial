import { NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentUser } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      await createAuditLog({
        userId: user.id,
        action: 'USER_LOGOUT',
        entityType: 'User',
        entityId: user.id,
      });
    }

    await clearSessionCookie();
    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}
