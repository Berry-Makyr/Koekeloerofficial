import { redirect } from 'next/navigation';
import { getCurrentUser, hasRequiredRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Control Center & Secure Admin | Koekeloer Gansbaai',
  description: 'Manage and update Koekeloer product listings, photo galleries, stock status, orders, and pricing.',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Strict Server-Side Authentication & RBAC Check
  if (!user || !hasRequiredRole(user.role, UserRole.STAFF)) {
    redirect('/account/login?redirect=/admin&error=admin_auth_required');
  }

  return <AdminDashboard currentUser={user} />;
}
