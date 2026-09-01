'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

type TabType = 'all' | 'best-sellers' | 'new-arrivals' | 'furniture' | 'sale';

export default function FeaturedTabs() {
  const { products } = useShop();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'best-sellers') return p.badges?.includes('Best Seller') || p.isFeatured;
    if (activeTab === 'new-arrivals') return p.isNewArrival;
    if (activeTab === 'furniture') return p.categorySlug === 'furniture';
    if (activeTab === 'sale') return p.isSale || (p.originalPrice && p.originalPrice > p.price);
    return true;
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All Highlights' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'furniture', label: 'Signature Furniture' },
    { id: 'sale', label: 'Special Offers' },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white border-y border-sand-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-coastal-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sand-500 flex-shrink-0" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-driftwood-950 leading-tight">
              Featured In Our Gansbaai Showroom
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-coastal-800 hover:text-coastal-950 transition flex-shrink-0"
          >
            <span className="whitespace-nowrap">View Full Catalog ({products.length}+ items)</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </Link>
        </div>

        {/* Filter Tabs Pills - horizontal scroll on mobile */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0",
                activeTab === tab.id
                  ? "bg-coastal-900 text-sand-50 shadow-sm"
                  : "bg-sand-100 text-driftwood-700 hover:bg-sand-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-sand-50 rounded-3xl p-12 text-center border border-sand-200 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center mx-auto text-driftwood-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-driftwood-900">
              New Coastal Arrivals Coming Soon
            </h3>
            <p className="text-xs text-driftwood-600 leading-relaxed">
              We are currently updating our online catalog with fresh coastal homeware, solid wood furniture, and boutique fashion. Visit our store at Shop 2, Great White Junction or browse all collections.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                <span>Browse Collections</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-sand-100 hover:bg-sand-200 text-driftwood-900 font-semibold px-8 py-3.5 rounded-xl text-sm border border-sand-300 transition"
            >
              <span>Explore All {products.length} Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
