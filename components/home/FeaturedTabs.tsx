'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

type TabType = 'all' | 'best-sellers' | 'new-arrivals' | 'bali' | 'sale';

export default function FeaturedTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'best-sellers') return p.badges?.includes('Best Seller');
    if (activeTab === 'new-arrivals') return p.isNewArrival;
    if (activeTab === 'bali') return p.badges?.includes('Bali Import') || p.tags.includes('bali');
    if (activeTab === 'sale') return p.isSale || (p.originalPrice && p.originalPrice > p.price);
    return true;
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All Highlights' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'bali', label: 'Bali Direct Imports' },
    { id: 'sale', label: 'Winter Sale Deals' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-coastal-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sand-500" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950">
              Featured In Our Gansbaai Showroom
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-coastal-800 hover:text-coastal-950 transition"
          >
            <span>View Full Catalog ({products.length}+ items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200",
                activeTab === tab.id
                  ? "bg-coastal-900 text-sand-50 shadow-sm"
                  : "bg-sand-100 text-driftwood-700 hover:bg-sand-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-sand-100 hover:bg-sand-200 text-driftwood-900 font-semibold px-8 py-3.5 rounded-xl text-sm border border-sand-300 transition"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
