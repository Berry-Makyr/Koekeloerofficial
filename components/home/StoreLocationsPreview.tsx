'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ArrowRight, Navigation, Sparkles } from 'lucide-react';
import { stores } from '@/data/stores';

export default function StoreLocationsPreview() {
  const store = stores[0];
  if (!store) return null;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
              Gansbaai • Great White Junction
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950 mt-1">
              Visit Our Gansbaai Store
            </h2>
          </div>
          <Link
            href="/stores"
            className="text-xs sm:text-sm font-semibold text-coastal-800 hover:text-coastal-950 flex items-center gap-1.5"
          >
            <span>View Full Details & Directions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Single Gansbaai Store Banner */}
        <div className="bg-sand-50 rounded-3xl overflow-hidden border border-sand-200/80 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-0 max-w-5xl mx-auto">
          {/* Image */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:h-auto bg-sand-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-coastal-900/90 backdrop-blur-sm text-sand-100 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {store.town} • Shop 2
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-driftwood-950">
                  {store.name}
                </h3>
                <p className="text-xs text-driftwood-500 mt-1">
                  {store.complex} • Main Road, Gansbaai, 7220
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-driftwood-700 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-driftwood-950">Address</strong>
                    <span>{store.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-driftwood-950">Trading Hours</strong>
                    <span>Mon–Fri: {store.hours.weekdays}</span><br />
                    <span>Sat: {store.hours.saturday}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-driftwood-950">Phone / WhatsApp</strong>
                    <span>{store.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-driftwood-950">Specialties</strong>
                    <span>Coastal Décor & Bali Teak</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200/80 flex flex-wrap items-center gap-3">
              <a
                href={store.mapEmbedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (Google Maps)</span>
              </a>

              <a
                href={`https://wa.me/${store.whatsapp}?text=Hi%20Koekeloer%20Team,%20I'm%20asking%20about%20your%20Gansbaai%20store.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
