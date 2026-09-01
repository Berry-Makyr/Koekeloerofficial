'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function HeroSlider() {
  const { siteContent } = useShop();
  const slides = siteContent.heroSlides || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[380px] sm:h-[520px] lg:h-[680px] overflow-hidden bg-driftwood-900">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark & Warm Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-driftwood-950/90 via-driftwood-950/60 to-driftwood-950/30 sm:via-driftwood-950/50 sm:to-transparent" />
            <div className="absolute inset-0 bg-black/20 sm:bg-black/25" />

            {/* Content Box */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="w-full max-w-xl sm:max-w-2xl text-white space-y-3 sm:space-y-6 pt-4 sm:pt-8">
                
                {/* Tag */}
                {slide.tag && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-coastal-800/80 backdrop-blur-md border border-coastal-600/50 text-sand-100 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sand-300 flex-shrink-0" />
                    <span className="truncate">{slide.tag}</span>
                  </div>
                )}

                {/* Headline */}
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight sm:leading-[1.15] text-white break-words">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                {slide.subtitle && (
                  <p className="text-xs sm:text-base lg:text-lg text-sand-200 leading-relaxed font-normal max-w-full sm:max-w-xl">
                    {slide.subtitle}
                  </p>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
                  {slide.ctaText && (
                    <Link
                      href={slide.ctaLink || '/shop'}
                      className="bg-sand-100 hover:bg-white text-coastal-950 font-semibold px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl shadow-lift text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200"
                    >
                      <span className="truncate">{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0" />
                    </Link>
                  )}

                  {slide.secondaryText && (
                    <Link
                      href={slide.secondaryLink || '/stores'}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-medium px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition duration-200 text-center"
                    >
                      {slide.secondaryText}
                    </Link>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-6 sm:w-8 bg-sand-100' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
