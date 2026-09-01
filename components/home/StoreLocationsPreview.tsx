'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ArrowRight, Navigation } from 'lucide-react';
import { stores } from '@/data/stores';

export default function StoreLocationsPreview() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
              Shop Online or Visit Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950 mt-1">
              Our Stores in the Overberg
            </h2>
            <p className="text-xs sm:text-sm text-driftwood-600 mt-2 max-w-2xl">
              Explore our full collection online, or drop in at Gansbaai or Struisbaai for styling tips, meet our team, and discover the latest arrivals.
            </p>
          </div>
          <Link
            href="/stores"
            className="text-xs sm:text-sm font-semibold text-coastal-800 hover:text-coastal-950 flex items-center gap-1.5"
          >
            <span>View Full Details & Directions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-sand-50 rounded-3xl overflow-hidden border border-sand-200/80 shadow-soft grid grid-cols-1 sm:grid-cols-12 gap-0"
            >
              <div className="sm:col-span-5 relative min-h-[220px] bg-sand-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-coastal-900/90 backdrop-blur-sm text-sand-100 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                  {store.town}
                </div>
              </div>

              <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-driftwood-950">
                    {store.name}
                  </h3>
                  <p className="text-xs text-driftwood-500">
                    {store.address} • {store.town}
                  </p>

                  <div className="grid grid-cols-1 gap-2 text-xs text-driftwood-700">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                      <span>Mon–Fri: {store.hours.weekdays} · Sat: {store.hours.saturday}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                      <span>{store.complex}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <a
                    href={store.mapEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold rounded-xl transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>
                  <a
                    href={`https://wa.me/${store.whatsapp}?text=Hi%20${encodeURIComponent(store.name)},%20I'm%20planning%20a%20visit.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
