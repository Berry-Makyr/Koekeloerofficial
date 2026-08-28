'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { formatZAR } from '@/lib/utils';

export default function SearchDialog() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, products } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ''
    ? products.slice(0, 4)
    : products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      });

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    router.push(`/shop/${slug}`);
  };

  const handleSelectCategory = (categorySlug: string) => {
    setIsSearchOpen(false);
    router.push(`/shop?category=${categorySlug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200">
      
      {/* Backdrop click */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true" 
      />

      {/* Search Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden z-10">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-sand-200 bg-sand-50">
          <Search className="w-5 h-5 text-driftwood-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decor, teak furniture, linen dresses, Esthé shoes, brass gifts..."
            className="w-full bg-transparent text-sm sm:text-base text-driftwood-900 placeholder-driftwood-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-driftwood-400 hover:text-driftwood-700 mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-driftwood-500 hover:text-driftwood-800 rounded-lg hover:bg-sand-200/60"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Quick Filter Tags */}
        <div className="px-4 py-2.5 bg-sand-100/60 border-b border-sand-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-driftwood-500 flex-shrink-0 font-medium">Browse:</span>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.slug)}
              className="px-2.5 py-1 bg-white hover:bg-coastal-800 hover:text-white text-driftwood-700 rounded-full border border-sand-300 flex-shrink-0 transition"
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 divide-y divide-sand-100">
          <div className="flex items-center justify-between pb-1 text-xs text-driftwood-500 font-semibold uppercase tracking-wider">
            <span>{query ? `Results (${filteredProducts.length})` : 'Popular Searches & Recommendations'}</span>
            {!query && <span className="flex items-center gap-1 text-sand-600"><Sparkles className="w-3 h-3" /> Featured</span>}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-driftwood-600 font-medium text-sm">No items matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-driftwood-400 mt-1">Try searching for &ldquo;cushion&rdquo;, &ldquo;teak&rdquo;, &ldquo;linen&rdquo;, &ldquo;sandals&rdquo;, or &ldquo;brass&rdquo;</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectProduct(p.slug)}
                className="pt-2 group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-sand-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-sand-100 overflow-hidden flex-shrink-0 border border-sand-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-driftwood-900 group-hover:text-coastal-700 transition">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-driftwood-500 mt-0.5">
                      <span>{p.category}</span>
                      {p.origin && <span>• {p.origin}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-coastal-900">
                    {formatZAR(p.price)}
                  </p>
                  {p.originalPrice && (
                    <p className="text-[11px] text-driftwood-400 line-through">
                      {formatZAR(p.originalPrice)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer View All */}
        <div className="p-3 bg-sand-50 border-t border-sand-200 flex items-center justify-between text-xs text-driftwood-600">
          <span>Press <kbd className="bg-white px-1.5 py-0.5 rounded border text-[10px]">Esc</kbd> to close</span>
          <Link
            href={`/shop${query ? `?search=${encodeURIComponent(query)}` : ''}`}
            onClick={() => setIsSearchOpen(false)}
            className="font-semibold text-coastal-700 hover:text-coastal-900 flex items-center gap-1"
          >
            <span>View all items in Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
