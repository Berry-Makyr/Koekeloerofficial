'use client';

import React from 'react';
import { FacebookIcon, InstagramIcon } from '@/components/common/SocialIcons';
import { Heart } from 'lucide-react';

const lookbookImages = [
  {
    id: 1,
    image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
    title: 'Gansbaai Winkel Vertoonlokaal',
    tag: '#KoekeloerGansbaai',
  },
  {
    id: 2,
    image: '/fb-images/615156136_25021772044168282_5150259627999386532_n.jpg',
    title: 'Somer Linne Boetiekdrag',
    tag: '#BoutiqueStyle',
  },
  {
    id: 3,
    image: '/fb-images/618282172_25073502085661944_8993232252802069912_n.jpg',
    title: 'Esthé Handgemaakte Leerskoene',
    tag: '#EstheShoes',
  },
  {
    id: 4,
    image: '/fb-images/481994294_8815936081845136_1726978424915024681_n.jpg',
    title: 'Marine Tou & Dryfhout Spieëls',
    tag: '#CoastalLiving',
  },
  {
    id: 5,
    image: '/fb-images/616021815_25039359379076215_1756254157454596129_n.jpg',
    title: 'Bali Invoere & Teakhout Kaste',
    tag: '#BaliImports',
  },
  {
    id: 6,
    image: '/fb-images/508550909_9526457524126318_8639517097577902135_n.jpg',
    title: 'Fynbos & Seebries Kerse & Geskenke',
    tag: '#GansbaaiGifts',
  },
];

export default function InstagramLookbook() {
  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
            Sosiale Lookbook & Inspirasie
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950 mt-1">
            Volg @koekeloer.winkel
          </h2>
          <p className="text-xs sm:text-sm text-driftwood-600 mt-2">
            Sluit aan by duisende dekor- en mode-liefhebbers regoor die Overberg en Suid-Afrika.
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <a
              href="https://www.facebook.com/koekeloer.winkel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              <span>Volg op Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Volg op Instagram</span>
            </a>
          </div>
        </div>

        {/* 6-Grid Lookbook */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {lookbookImages.map((item) => (
            <a
              key={item.id}
              href="https://www.facebook.com/koekeloer.winkel/photos"
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
