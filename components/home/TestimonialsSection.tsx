'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { customerReviews } from '@/data/stores';

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
            Loved By Decorators & Homemakers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950 mt-1">
            Words from Our Customers
          </h2>
          <div className="w-12 h-0.5 bg-coastal-600 mx-auto mt-3" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-sand-50 rounded-2xl p-6 sm:p-8 border border-sand-200/80 shadow-soft flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-sand-300 absolute top-6 right-6" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <h3 className="font-serif text-base font-bold text-driftwood-950 mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-driftwood-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-driftwood-900">{rev.author}</h4>
                  <p className="text-[11px] text-driftwood-500">{rev.location}</p>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
