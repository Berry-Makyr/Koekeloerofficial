'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Compass, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BrandStorySection() {
  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image Collage */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-[4/5] bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop"
                  alt="Koekeloer Gansbaai Store Display"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-square bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
                  alt="Esthe Leather Shoes at Koekeloer"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-square bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop"
                  alt="Bali Teak Furniture"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-soft aspect-[4/5] bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
                  alt="Koekeloer Boutique Resort Dress"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* Experience badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-coastal-900 text-sand-100 p-5 rounded-2xl shadow-xl text-center border-4 border-sand-50">
              <span className="block font-serif text-3xl font-bold text-white">40+</span>
              <span className="block text-[11px] uppercase tracking-wider font-semibold text-sand-300">
                Years of Retail Heritage
              </span>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
                Ons Storie • Since 2012
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-driftwood-950 leading-tight">
                A Journey of Discovery in the Overberg
              </h2>
            </div>

            <p className="text-sm sm:text-base text-driftwood-700 leading-relaxed">
              In 2012, <strong>Koekeloer</strong> opened its doors at the Great White Junction in Gansbaai. Founded by Nelia Koekemoer with four decades of retail passion, we set out to create an emporium where every corner reveals something extraordinary.
            </p>

            <p className="text-sm sm:text-base text-driftwood-700 leading-relaxed">
              Die uniekheid van ons winkel is die wye verskeidenheid van produkte. Behalwe dat ons voorsien aan die gesofistikeerde koper, bedien ons ook <em>Jan Alleman</em> met items wat warmte, elegansie en karakter na elke tuiste bring.
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">Direct Bali Imports</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Teakwood, paras stone, and rattan sourced personally from artisan studios.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">4 Physical Locations</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Stores across Gansbaai, Bredasdorp, Struisbaai & Pearly Beach.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">Esthé Footwear & Boutique</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Full ladies boutique with pure linen resort wear and leather sandals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coastal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-driftwood-950">Community Giving</h4>
                  <p className="text-xs text-driftwood-600 mt-0.5">Dedicated to supporting local Overberg charities and elderly homes.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="bg-coastal-800 hover:bg-coastal-900 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2 transition"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/stores"
                className="bg-white hover:bg-sand-100 text-driftwood-900 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-sand-300 transition"
              >
                <span>Visit Our Stores</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
