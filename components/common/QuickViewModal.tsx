'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Star, 
  Check, 
  ShoppingBag, 
  Heart, 
  Phone, 
  Truck, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { formatZAR, cn } from '@/lib/utils';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, isInWishlist, toggleWishlist } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(0);
      setQuantity(1);
      // Initialize default variants
      const initialVariants: Record<string, string> = {};
      quickViewProduct.variants?.forEach((v) => {
        if (v.options.length > 0) {
          initialVariants[v.type] = v.options[0];
        }
      });
      setSelectedVariants(initialVariants);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorite = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedVariants);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setQuickViewProduct(null);
    }, 700);
  };

  const whatsAppMessage = encodeURIComponent(
    `Hi Koekeloer! I'm interested in the "${quickViewProduct.name}" (${formatZAR(quickViewProduct.price)}) shown on your website. Is this available at your Gansbaai store?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setQuickViewProduct(null)}
        aria-hidden="true" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-driftwood-700 hover:text-driftwood-950 shadow-sm transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="bg-sand-100/50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-sand-200 overflow-y-auto">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            {quickViewProduct.badges && quickViewProduct.badges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {quickViewProduct.badges.map((b) => (
                  <span
                    key={b}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm",
                      b === 'Handmade' ? 'bg-coastal-800 text-sand-100' :
                      b === 'New' ? 'bg-sage-700 text-white' : 'bg-driftwood-800 text-white'
                    )}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition",
                    selectedImage === idx ? "border-coastal-700 scale-105" : "border-sand-200 opacity-70 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <div>
            {/* Category and Rating */}
            <div className="flex items-center justify-between text-xs text-driftwood-500 mb-2">
              <span className="uppercase tracking-wider font-semibold text-sand-600">
                {quickViewProduct.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-driftwood-800">{quickViewProduct.rating}</span>
                <span className="text-driftwood-400">({quickViewProduct.reviewCount})</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl font-semibold text-driftwood-950 mb-2">
              {quickViewProduct.name}
            </h3>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-coastal-900">
                {formatZAR(quickViewProduct.price)}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-driftwood-600 leading-relaxed mb-5">
              {quickViewProduct.description}
            </p>

            {/* Variants selection */}
            {quickViewProduct.variants && quickViewProduct.variants.map((v) => (
              <div key={v.type} className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-driftwood-700 mb-2">
                  Select {v.type}: <span className="text-coastal-800 capitalize font-normal">{selectedVariants[v.type]}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {v.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [v.type]: opt }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                        selectedVariants[v.type] === opt
                          ? "bg-coastal-900 text-white border-coastal-900 shadow-sm"
                          : "bg-white text-driftwood-700 border-sand-300 hover:border-driftwood-500"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Stock status indicator */}
            <div className="flex items-center gap-2 text-xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-800 font-medium">
                In Stock at Gansbaai Showroom ({quickViewProduct.stockCount} available)
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-sand-200 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-sand-300 rounded-xl overflow-hidden bg-sand-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-driftwood-700 hover:bg-sand-200 transition"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold text-driftwood-900 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-driftwood-700 hover:bg-sand-200 transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition",
                  addedAnimation
                    ? "bg-emerald-600 text-white"
                    : "bg-coastal-800 hover:bg-coastal-900 text-white"
                )}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • {formatZAR(quickViewProduct.price * quantity)}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className="p-3 rounded-xl border border-sand-300 hover:bg-sand-100 text-driftwood-700 transition"
                aria-label="Toggle Wishlist"
              >
                <Heart className={cn("w-5 h-5", isFavorite && "fill-terracotta-500 text-terracotta-500")} />
              </button>
            </div>

            {/* Direct WhatsApp and Full Page Links */}
            <div className="flex items-center justify-between text-xs pt-1">
              <a
                href={`https://wa.me/27787030250?text=${whatsAppMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ask about this item on WhatsApp</span>
              </a>

              <Link
                href={`/shop/${quickViewProduct.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="text-coastal-700 hover:text-coastal-900 font-semibold flex items-center gap-1"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
