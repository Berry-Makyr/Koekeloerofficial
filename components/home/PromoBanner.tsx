'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function PromoBanner() {
  const { applyCoupon, siteContent } = useShop();
  const banner = siteContent.promoBanner;
  const [copied, setCopied] = useState(false);

  if (!banner) return null;

  const handleApply = () => {
    applyCoupon(banner.couponCode || 'WINTER20');
    navigator.clipboard?.writeText(banner.couponCode || 'WINTER20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 bg-sand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-coastal-950 via-coastal-900 to-driftwood-950 text-white p-8 sm:p-12 lg:p-16 shadow-lift border border-coastal-800">
          
          {/* Subtle Background Pattern / Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          <div className="relative z-10 max-w-3xl space-y-6">
            
            {banner.tag && (
              <div className="inline-flex items-center gap-2 bg-terracotta-600/90 text-sand-50 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{banner.tag}</span>
              </div>
            )}

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              {banner.title} <br className="hidden sm:inline" />
              {banner.highlightText && (
                <span className="text-sand-300">{banner.highlightText}</span>
              )}
            </h2>

            <p className="text-sm sm:text-base text-sand-200 leading-relaxed max-w-xl">
              {banner.description}
            </p>

            {/* Coupon Box */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl">
                <Tag className="w-4 h-4 text-sand-300" />
                <span className="text-xs text-sand-200 font-medium">Use Coupon:</span>
                <span className="font-mono font-bold text-base text-white tracking-widest pl-1">
                  {banner.couponCode}
                </span>
                <button
                  onClick={handleApply}
                  className="ml-2 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition flex items-center gap-1 text-xs font-semibold"
                  title="Copy and apply code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-[11px] text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                href={banner.ctaLink || '/shop?filter=sale'}
                className="bg-sand-100 hover:bg-white text-driftwood-950 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
              >
                <span>{banner.ctaText || 'Shop Sale Items'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {banner.footerNote && (
              <p className="text-[11px] text-sand-400">
                {banner.footerNote}
              </p>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
