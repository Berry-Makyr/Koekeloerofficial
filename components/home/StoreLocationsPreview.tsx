'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ArrowRight, Navigation } from 'lucide-react';
import { stores } from '@/data/stores';

export default function StoreLocationsPreview() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
              Gansbaai • Great White Junction
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950 mt-1">
              Shop Online or Visit Our Gansbaai Showrooms
            </h2>
          </div>
          <Link
            href="/stores"
            className="text-xs sm:text-sm font-semibold text-coastal-800 hover:text-coastal-950 flex items-center gap-1.5"
          >
            <span>View Trading Hours & Directions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gansbaai Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {stores.map((store) => (
            <div
              key={store.id}
              className="group bg-sand-50 rounded-2xl overflow-hidden border border-sand-200/80 shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-coastal-900/90 backdrop-blur-sm text-sand-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {store.town}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-driftwood-950 leading-snug">
                    {store.name}
                  </h3>
                  
                  <div className="mt-3 space-y-2 text-xs text-driftwood-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sand-600 flex-shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-sand-600 flex-shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-sand-600 flex-shrink-0 mt-0.5" />
                      <span>{store.hours.weekdays} | Sat: {store.hours.saturday}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${store.whatsapp}?text=Hi%20${encodeURIComponent(store.name)},%20I%20have%20an%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    WhatsApp Store
                  </a>
                  <Link
                    href={`/stores#${store.id}`}
                    className="text-xs font-semibold text-coastal-700 hover:text-coastal-900 flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
