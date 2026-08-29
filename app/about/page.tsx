import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Award, 
  Compass, 
  Truck, 
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Our Story & Heritage | Koekeloer Gansbaai',
  description: 'Learn how Nelia Koekemoer founded Koekeloer in 2012 in Gansbaai, growing into a beloved Western Cape decor emporium and fashion boutique with 40 years of retail experience.',
};

export default function AboutPage() {
  return (
    <div className="bg-sand-50/60 py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-sand-600">
            Heritage & Passion • Since 2012
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-driftwood-950 leading-tight">
            The Story Behind Koekeloer
          </h1>
          <p className="text-sm sm:text-base text-driftwood-700 leading-relaxed">
            From a humble passion project to Gansbaai's favourite coastal décor and lifestyle showroom at Great White Junction.
          </p>
        </div>

        {/* Feature Image Banner */}
        <div className="rounded-3xl overflow-hidden shadow-lift border border-sand-200 aspect-[16/9] sm:aspect-[21/9] bg-sand-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fb-images/616021815_25039359379076215_1756254157454596129_n.jpg"
            alt="Koekeloer coastal decor aesthetic"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story Section in English */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand-200 shadow-soft space-y-8">
          
          <div className="prose prose-sand max-w-none text-xs sm:text-sm text-driftwood-700 space-y-4 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-driftwood-950 not-prose mb-4">
              40 Years of Retail Mastery & Curated Lifestyle Collections
            </h2>
            
            <p>
              In <strong>2012</strong>, Koekeloer first opened its welcoming doors in Gansbaai at the <em>Great White Junction</em>. Today, it stands as a landmark coastal gift, décor, and lifestyle store at Shop 2, Great White Junction in Gansbaai.
            </p>

            <p>
              Founder <strong>Nelia Koekemoer</strong> brings more than forty years of invaluable retail mastery and passion. Connected to leading suppliers and specialized artisans, she curates fresh and exciting local and imported collections that give customers a shopping experience they won&apos;t find anywhere else.
            </p>

            <blockquote className="p-4 sm:p-6 bg-sand-50 rounded-2xl border-l-4 border-coastal-700 my-6 not-italic font-serif text-sm sm:text-base text-driftwood-900 font-medium leading-relaxed">
              &ldquo;The magic of our store lies in its vibrant variety. Alongside catering to the most discerning interior decorator, we warmly welcome every homemaker, ensuring there is a timeless piece to enrich every taste, budget, and lifestyle.&rdquo;
            </blockquote>

            <p>
              Koekeloer is a destination store that invites you on an inspiring journey through artisan gifts, coastal home accents, handcrafted solid wood furniture, nautical statement pieces, boutique linen apparel, Savoy &amp; Julz footwear, organic ceramics, and fine art canvases.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-sand-100">
            <div className="p-5 bg-sand-50 rounded-2xl border border-sand-200 space-y-2">
              <div className="flex items-center gap-2 text-coastal-800 font-bold text-sm">
                <Compass className="w-4 h-4 text-coastal-700" />
                <span>Curated &amp; Handpicked Imports</span>
              </div>
              <p className="text-xs text-driftwood-600 leading-relaxed">
                We select unique solid wood furniture, carved cabinets, and natural woven decor to bring character and warmth to your living space.
              </p>
            </div>

            <div className="p-5 bg-sand-50 rounded-2xl border border-sand-200 space-y-2">
              <div className="flex items-center gap-2 text-coastal-800 font-bold text-sm">
                <Heart className="w-4 h-4 text-terracotta-600" />
                <span>Giving Back to Our Community</span>
              </div>
              <p className="text-xs text-driftwood-600 leading-relaxed">
                We believe beauty begins with kindness. Koekeloer regularly donates shoes and essentials to elderly residents at Herberg aan See in Gansbaai.
              </p>
            </div>

            <div className="p-5 bg-sand-50 rounded-2xl border border-sand-200 space-y-2">
              <div className="flex items-center gap-2 text-coastal-800 font-bold text-sm">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Savoy Comfort Footwear</span>
              </div>
              <p className="text-xs text-driftwood-600 leading-relaxed">
                Stocking premium cushioned orthopaedic leather sandals and walking shoes, where supreme comfort meets enduring coastal style.
              </p>
            </div>

            <div className="p-5 bg-sand-50 rounded-2xl border border-sand-200 space-y-2">
              <div className="flex items-center gap-2 text-coastal-800 font-bold text-sm">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Nationwide Courier Delivery</span>
              </div>
              <p className="text-xs text-driftwood-600 leading-relaxed">
                Now bringing the treasures of the Overberg straight to your doorstep across South Africa via tracked couriers.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-driftwood-950">Ready to transform your living space?</h3>
              <p className="text-xs text-driftwood-500">Explore our new season arrivals or visit us in Gansbaai.</p>
            </div>
            <Link
              href="/shop"
              className="bg-coastal-800 hover:bg-coastal-900 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
