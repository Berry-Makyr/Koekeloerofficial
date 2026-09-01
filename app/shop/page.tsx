import { Suspense } from 'react';
import ShopContent from '@/components/shop/ShopContent';

export const metadata = {
  title: 'Shop All Collections | Koekeloer',
  description: 'Explore furniture, textiles, nauticals, paintings, mirrors, lamps, décor, kitchenware, gifts, and boutique apparel from Koekeloer.',
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand-50">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-coastal-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-driftwood-800 text-sm">Loading Koekeloer Collection...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
