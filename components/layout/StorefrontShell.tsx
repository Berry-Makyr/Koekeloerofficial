'use client';

import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchDialog from '@/components/common/SearchDialog';
import QuickViewModal from '@/components/common/QuickViewModal';
import CartDrawer from '@/components/cart/CartDrawer';

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <main className="flex-1 w-full min-w-0 overflow-x-clip">
        {children}
      </main>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1 w-full min-w-0 overflow-x-clip">
        {children}
      </main>
      <Footer />
      <SearchDialog />
      <QuickViewModal />
      <CartDrawer />
    </>
  );
}
