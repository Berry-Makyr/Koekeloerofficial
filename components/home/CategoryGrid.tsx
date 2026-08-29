'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function CategoryGrid() {
  const { categories } = useShop();

  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
            Curated Departments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-driftwood-950 mt-2">
            Interiors for Coastal & Boho Living
          </h2>
          <div className="w-16 h-0.5 bg-coastal-600 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-driftwood-600 leading-relaxed">
            From handcrafted solid wood furniture and coastal décor to genuine South African leather and boutique resort wear.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition-all duration-500 flex flex-col justify-end p-6 border border-sand-200/60"
            >
              {/* Category Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url(${category.image})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-driftwood-950/90 via-driftwood-950/40 to-transparent group-hover:from-driftwood-950/95 transition-colors duration-300" />

              {/* Card Content */}
              <div className="relative z-10 text-white space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-sand-300">
                  {category.itemCount || 20}+ Items
                </span>
                
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-sand-200 transition">
                  {category.name}
                </h3>
                
                <p className="text-xs text-sand-300/90 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {category.description}
                </p>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-sand-100 group-hover:text-white transition">
                  <span className="underline underline-offset-4">Shop Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
