'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function CategoryGrid() {
  const { categories } = useShop();

  return (
    <section className="py-16 sm:py-24 bg-sand-50/70 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-coastal-700">
            Curated Departments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-driftwood-950 mt-2">
            Interiors &amp; Lifestyle Collections
          </h2>
          <div className="w-16 h-0.5 bg-coastal-600 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-driftwood-600 leading-relaxed">
            From handcrafted wooden furniture and coastal décor to genuine leather bags and boutique apparel.
          </p>
        </div>

        {/* Category Grid - Clean, High-Contrast Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition-all duration-300 border border-sand-200 flex flex-col"
            >
              {/* Product Image Container */}
              <div className="relative h-56 bg-sand-100/50 overflow-hidden flex items-center justify-center p-4 border-b border-sand-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-driftwood-700 border border-sand-200 shadow-sm">
                  {category.itemCount || 20}+ Items
                </span>
              </div>

              {/* High Contrast Text Section Below Image */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div>
                  <h3 className="font-serif text-lg font-bold text-driftwood-950 group-hover:text-coastal-700 transition">
                    {category.name}
                  </h3>
                  <p className="text-xs text-driftwood-600 line-clamp-2 mt-1 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-coastal-800 group-hover:text-coastal-950 group-hover:translate-x-1 transition-all">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
