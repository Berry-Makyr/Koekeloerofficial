import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import StorefrontShell from '@/components/layout/StorefrontShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Koekeloer | Coastal Décor, Solid Wood Furniture & Gifts Gansbaai',
  description: 'Gansbaai lifestyle emporium at Great White Junction. Discover artisan home décor, handcrafted wooden furniture, coastal mirrors, genuine leather bags, and curated gifts.',
  keywords: ['Koekeloer', 'Gansbaai decor', 'Great White Junction Gansbaai', 'Gansbaai gift shop', 'coastal furniture South Africa', 'coastal living decor', 'leather bags Gansbaai'],
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
      <body className="min-h-screen w-full max-w-full flex flex-col antialiased overflow-x-clip selection:bg-coastal-100 selection:text-coastal-900">
        <ShopProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </ShopProvider>
      </body>
    </html>
  );
}
