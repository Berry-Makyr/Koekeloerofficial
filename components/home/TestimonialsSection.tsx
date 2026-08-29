'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { customerReviews } from '@/data/stores';

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <Star className="w-3.5 h-3.5 fill-amber-500/40" />
            </div>
            <span>4.3 / 5 on Google Reviews</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950">
            Real Words from Real Customers
          </h2>
          <p className="text-xs sm:text-sm text-driftwood-600 max-w-xl mx-auto">
            From interior decorators to visiting holidaymakers, discover what our wonderful Gansbaai community has to say.
          </p>
          <div className="w-12 h-0.5 bg-coastal-600 mx-auto mt-3" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-sand-50 rounded-2xl p-6 border border-sand-200/80 shadow-soft flex flex-col justify-between relative"
            >
              <Quote className="w-7 h-7 text-sand-300 absolute top-5 right-5" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <h3 className="font-serif text-sm font-bold text-driftwood-950 mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs text-driftwood-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-sand-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-driftwood-900">{rev.author}</h4>
                  <p className="text-[10px] text-driftwood-500">{rev.location}</p>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-2.5 h-2.5" /> Google Review
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
