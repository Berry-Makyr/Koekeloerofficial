'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Heart,
  Send,
  CheckCircle2
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/common/SocialIcons';
import { categories } from '@/data/categories';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-driftwood-900 text-sand-200 pt-16 pb-12 border-t border-driftwood-800">
      
      {/* Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-driftwood-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-driftwood-800/80 rounded-xl text-sand-300 flex-shrink-0 border border-driftwood-700">
              <Truck className="w-6 h-6 text-sand-200" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base mb-1">Nationwide Courier</h4>
              <p className="text-xs text-sand-400 leading-relaxed">
                Tracked door-to-door delivery across South Africa via The Courier Guy. Free on orders over R1,200.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-driftwood-800/80 rounded-xl text-sand-300 flex-shrink-0 border border-driftwood-700">
              <ShieldCheck className="w-6 h-6 text-sand-200" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base mb-1">40 Years in Retail</h4>
              <p className="text-xs text-sand-400 leading-relaxed">
                Founded by Nelia Koekemoer in Gansbaai. Dedicated to serving both sophisticated buyers and Jan Alleman.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-driftwood-800/80 rounded-xl text-sand-300 flex-shrink-0 border border-driftwood-700">
              <RefreshCw className="w-6 h-6 text-sand-200" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base mb-1">Direct Bali Imports</h4>
              <p className="text-xs text-sand-400 leading-relaxed">
                Handpicked teak furniture, stone carvings, and natural woven decor imported straight from artisan studios.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-driftwood-800/80 rounded-xl text-sand-300 flex-shrink-0 border border-driftwood-700">
              <Heart className="w-6 h-6 text-terracotta-400" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-base mb-1">Personal Service</h4>
              <p className="text-xs text-sand-400 leading-relaxed">
                WhatsApp our in-store team directly for live videos, styling recommendations, or custom orders.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-widest text-white uppercase font-semibold">
                KOEKELOER
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-sand-400 uppercase font-medium">
                Gansbaai • Bredasdorp • Struisbaai
              </span>
            </Link>
            <p className="text-xs text-sand-400 leading-relaxed max-w-sm">
              ‘n Unieke winkel wat jou op ‘n verkenningstog neem van geskenke, dekor, meubels, nautical items, boetiekklere, Esthé leerskoene en kombuisware. Kom snuffel en ontdek iets besonders vir jou tuiste.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-sand-200 uppercase tracking-wider mb-2">
                Join the Koekeloer Club
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-driftwood-800 border border-driftwood-700 text-sand-100 placeholder-sand-500 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-sand-400 flex-1"
                />
                <button
                  type="submit"
                  className="bg-coastal-600 hover:bg-coastal-500 text-white px-4 py-2.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Baie dankie! You are subscribed to new arrivals and specials.</span>
                </p>
              )}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/koekeloer.winkel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-driftwood-800 hover:bg-coastal-700 flex items-center justify-center text-sand-300 hover:text-white transition"
                aria-label="Koekeloer Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-driftwood-800 hover:bg-terracotta-700 flex items-center justify-center text-sand-300 hover:text-white transition"
                aria-label="Koekeloer Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Department Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-sm tracking-wide">Shop Collections</h4>
            <ul className="space-y-2 text-xs text-sand-400">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?category=${c.slug}`} className="hover:text-white transition">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-sm tracking-wide">Store & Service</h4>
            <ul className="space-y-2 text-xs text-sand-400">
              <li>
                <Link href="/stores" className="hover:text-white transition">
                  Store Locations & Hours
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Nelia & Koekeloer Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-white transition">
                  Fresh Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=sale" className="hover:text-white transition text-terracotta-400">
                  Sale & Promotions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition text-sand-300 font-medium">
                  Catalog Manager & Listings (Admin)
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/27787030250" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition text-emerald-400 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp In-Store Help</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-sm tracking-wide">Gansbaai Flagship</h4>
            <div className="space-y-2.5 text-xs text-sand-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sand-300 flex-shrink-0 mt-0.5" />
                <span>Shop 2 & 5, Great White Junction, Main Road, Gansbaai, 7220</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sand-300 flex-shrink-0" />
                <span>+27 (0)78 703 0250</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sand-300 flex-shrink-0" />
                <span>info@koekeloer.co.za</span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-driftwood-800">
                <Clock className="w-4 h-4 text-sand-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Fri: 08:30 – 17:00</p>
                  <p>Saturday: 08:30 – 14:00</p>
                  <p>Sunday: 09:00 – 13:00</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar with South African Payment Gateways & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-driftwood-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-500">
          <div>
            <p>© {new Date().getFullYear()} Koekeloer Geskenk & Dekor Winkel. All rights reserved.</p>
            <p className="text-[11px] text-sand-600 mt-0.5">
              Great White Junction, Gansbaai • Bredasdorp • Struisbaai • Pearly Beach
            </p>
          </div>

          {/* Payment & Security Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-sand-400 mr-1">Secure SA Payments:</span>
            <span className="px-2 py-1 bg-driftwood-800 rounded border border-driftwood-700 text-sand-200 font-semibold text-[10px]">
              PayFast
            </span>
            <span className="px-2 py-1 bg-driftwood-800 rounded border border-driftwood-700 text-sand-200 font-semibold text-[10px]">
              Ozow Instant EFT
            </span>
            <span className="px-2 py-1 bg-driftwood-800 rounded border border-driftwood-700 text-sand-200 font-semibold text-[10px]">
              Visa / Mastercard
            </span>
            <span className="px-2 py-1 bg-driftwood-800 rounded border border-driftwood-700 text-sand-200 font-semibold text-[10px]">
              SnapScan
            </span>
            <span className="px-2 py-1 bg-driftwood-800 rounded border border-driftwood-700 text-sand-200 font-semibold text-[10px]">
              Courier Guy
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
