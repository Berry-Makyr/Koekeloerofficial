'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Truck, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const { siteContent } = useShop();

  const announcement = siteContent.announcement;

  if (!isVisible || !announcement) return null;

  return (
    <aside aria-label="Announcement" className="bg-coastal-900 text-sand-100 text-[11px] sm:text-xs py-2 px-3 sm:px-4 border-b border-coastal-800 transition-all w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-sand-200 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0 justify-center sm:justify-start">
            <Truck className="w-3.5 h-3.5 text-sand-300 flex-shrink-0" />
            <span className="truncate">
              {announcement.message || 'Nationwide courier available'}
            </span>
          </div>
          <span className="hidden md:inline text-coastal-600">•</span>
          <Link href="/stores" className="hidden md:flex items-center gap-1 hover:text-white transition">
            <MapPin className="w-3.5 h-3.5 text-sand-300" />
            <span>Showroom at Great White Junction, Gansbaai</span>
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-sand-400 hover:text-white p-0.5 rounded transition flex-shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
