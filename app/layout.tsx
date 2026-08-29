import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchDialog from '@/components/common/SearchDialog';
import QuickViewModal from '@/components/common/QuickViewModal';
import CartDrawer from '@/components/cart/CartDrawer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Koekeloer | Coastal Décor, Solid Wood Furniture & Boutique Gansbaai',
  description: 'Gansbaai lifestyle emporium at Great White Junction. Discover artisan home decor, handcrafted wooden furniture, coastal mirrors, genuine leather footwear, and resort fashion.',
  keywords: ['Koekeloer', 'Gansbaai decor', 'Great White Junction Gansbaai', 'Gansbaai gift shop', 'coastal furniture South Africa', 'coastal living decor', 'leather footwear Gansbaai'],
  authors: [{ name: 'Koekeloer Gansbaai' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-coastal-100 selection:text-coastal-900">
        <ShopProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <SearchDialog />
          <QuickViewModal />
          <CartDrawer />
        </ShopProvider>
      </body>
    </html>
  );
}
