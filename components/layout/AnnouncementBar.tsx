'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Truck, X, Sparkles } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const { applyCoupon, siteContent } = useShop();
  const [copied, setCopied] = useState(false);

  const announcement = siteContent.announcement;

  if (!isVisible || !announcement) return null;

  const handleCopyCode = () => {
    applyCoupon(announcement.couponCode || 'KOEKELOER10');
    navigator.clipboard?.writeText(announcement.couponCode || 'KOEKELOER10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <aside aria-label="Announcement" className="bg-coastal-900 text-sand-100 text-xs py-2 px-4 border-b border-coastal-800 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: Free shipping & stores */}
        <div className="flex items-center gap-4 text-sand-200">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-sand-300 flex-shrink-0" />
            <span>{announcement.message || 'Free Nationwide Delivery on orders over R1,200'}</span>
          </div>
          <span className="hidden md:inline text-coastal-600">•</span>
          <Link href="/stores" className="hidden md:flex items-center gap-1 hover:text-white transition">
            <MapPin className="w-3.5 h-3.5 text-sand-300" />
            <span>Showroom at Great White Junction, Gansbaai</span>
          </Link>
        </div>

        {/* Center / Right: Coupon Promo */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 bg-coastal-800/80 px-2.5 py-0.5 rounded-full border border-coastal-700">
            <Sparkles className="w-3 h-3 text-sand-300" />
            <span>{announcement.couponPrompt || 'Get 10% off with code:'}</span>
            <button
              onClick={handleCopyCode}
              className="font-bold tracking-wider text-sand-100 hover:text-white underline underline-offset-2 ml-1 cursor-pointer"
              title="Click to copy and apply"
            >
              {announcement.couponCode || 'KOEKELOER10'}
            </button>
            {copied && <span className="text-[10px] text-green-300 ml-1 font-semibold">Applied!</span>}
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-sand-400 hover:text-white p-0.5 rounded transition"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
