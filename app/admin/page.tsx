import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/admin-auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Control Center | Koekeloer Gansbaai',
  description: 'Manage and update Koekeloer product listings, photo galleries, stock status, orders, and pricing.',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const currentAdmin = await getCurrentAdmin();

  // Strict Server-Side Verification — Unauthenticated requests redirect to dedicated /admin/login
  if (!currentAdmin) {
    redirect('/admin/login?redirect=/admin&error=admin_auth_required');
  }

  return <AdminDashboard currentUser={currentAdmin} />;
}
