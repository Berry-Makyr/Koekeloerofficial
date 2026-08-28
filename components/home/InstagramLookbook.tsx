'use client';

import React from 'react';
import { FacebookIcon, InstagramIcon } from '@/components/common/SocialIcons';
import { Heart } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function InstagramLookbook() {
  const { siteContent } = useShop();
  const items = siteContent.lookbookItems || [];

  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
            Social Lookbook & Inspiration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950 mt-1">
            {siteContent.lookbookTitle || 'Follow @koekeloer.winkel'}
          </h2>
          <p className="text-xs sm:text-sm text-driftwood-600 mt-2">
            {siteContent.lookbookSubtitle || 'Join thousands of home decorators and fashion lovers across the Overberg and South Africa.'}
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <a
              href="https://www.facebook.com/koekeloer.winkel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              <span>Follow on Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>

        {/* 6-Grid Lookbook */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.link || 'https://www.facebook.com/koekeloer.winkel/photos'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-sand-200 shadow-soft block"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-driftwood-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                <Heart className="w-6 h-6 text-terracotta-400 fill-terracotta-400 mb-2 transform scale-75 group-hover:scale-100 transition-transform" />
                <p className="text-[11px] font-semibold line-clamp-2">{item.title}</p>
                <span className="text-[10px] text-sand-300 mt-1">{item.tag}</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
