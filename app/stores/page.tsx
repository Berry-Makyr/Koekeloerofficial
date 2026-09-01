import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  Navigation, 
  CheckCircle2 
} from 'lucide-react';
import { stores } from '@/data/stores';

export const metadata = {
  title: 'Our Store Locations | Gansbaai & Struisbaai | Koekeloer',
  description: 'Visit Koekeloer in Gansbaai (Great White Junction) or Struisbaai (Main Road). Trading hours, directions, and showroom details.',
};

export default function StoresPage() {
  return (
    <div className="bg-sand-50/60 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
            Gansbaai & Struisbaai • Western Cape
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-driftwood-950">
            Our Stores
          </h1>
          <p className="text-xs sm:text-sm text-driftwood-600 max-w-2xl mx-auto leading-relaxed">
            Visit us in person — browse solid wood furniture, coastal décor, nautical accents, boutique apparel, and meet our warm team at either location.
          </p>
        </div>

        {/* Stores Detailed Grid */}
        <div className="space-y-12">
          {stores.map((store, index) => (
            <div
              key={store.id}
              id={store.id}
              className={`bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-0 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Section */}
              <div className="lg:col-span-5 relative h-72 lg:h-auto min-h-[280px] bg-sand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-coastal-950/90 text-sand-50 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {store.town}
                </div>
              </div>

              {/* Info Section */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-sand-600 uppercase tracking-widest mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-sand-500" />
                    <span>{store.complex || store.town}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-driftwood-950 mb-3">
                    {store.name}
                  </h2>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {store.features.map((feat, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs bg-sand-100 text-driftwood-800 px-3 py-1 rounded-full font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-coastal-700" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>

                  {/* Contact Info & Hours Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-driftwood-700 pt-4 border-t border-sand-100">
                    <div className="space-y-3">
                      <h4 className="font-bold text-driftwood-950 uppercase tracking-wider text-[11px]">Address & Contact</h4>
                      
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-driftwood-900">{store.address}</p>
                          <p className="text-driftwood-500">{store.town}, Western Cape, South Africa</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-coastal-700 flex-shrink-0" />
                        <span>{store.phone}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-coastal-700 flex-shrink-0" />
                        <span>{store.email}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-driftwood-950 uppercase tracking-wider text-[11px]">Trading Hours</h4>
                      
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p><strong className="text-driftwood-900">Monday – Friday:</strong> {store.hours.weekdays}</p>
                          <p><strong className="text-driftwood-900">Saturday:</strong> {store.hours.saturday}</p>
                          <p><strong className="text-driftwood-900">Sunday:</strong> {store.hours.sunday}</p>
                          <p><strong className="text-driftwood-900">Public Holidays:</strong> {store.hours.publicHolidays}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-sand-100 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${store.whatsapp}?text=Hi%20${encodeURIComponent(store.name)},%20I'm%20planning%20a%20visit.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp this Store</span>
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sand-100 hover:bg-sand-200 text-driftwood-900 text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 border border-sand-300 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions in Google Maps</span>
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
