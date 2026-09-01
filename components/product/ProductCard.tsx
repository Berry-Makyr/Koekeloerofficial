'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  ShoppingBag, 
  Heart, 
  Star, 
  Check, 
  Phone 
} from 'lucide-react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { formatZAR, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setQuickViewProduct, addToCart, isInWishlist, toggleWishlist } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has size variants, open quick view so they choose size
    if (product.variants && product.variants.length > 0) {
      setQuickViewProduct(product);
      return;
    }

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-sand-200/80 shadow-soft hover:shadow-lift transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-square w-full bg-sand-100/60 overflow-hidden">
        
        {/* Main Product Image with hover transition */}
        <Link href={`/shop/${product.slug}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover object-center transition-all duration-700 ease-out",
              isHovered && product.images[1] ? "opacity-0 scale-105" : "opacity-100 scale-100"
            )}
          />
          {product.images[1] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out",
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              )}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm",
                badge === 'Handmade' ? 'bg-coastal-900 text-sand-100' :
                badge === 'New' ? 'bg-sage-700 text-white' :
                badge === 'Best Seller' ? 'bg-amber-600 text-white' : 'bg-driftwood-800 text-white'
              )}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-driftwood-700 shadow-sm transition-all duration-200",
            isFavorite ? "text-terracotta-500 fill-terracotta-500" : "opacity-0 group-hover:opacity-100"
          )}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-terracotta-500 text-terracotta-500")} />
        </button>

        {/* Quick Action Overlay on Desktop */}
        <div className={cn(
          "absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        )}>
          <button
            onClick={handleQuickView}
            className="flex-1 bg-white/95 hover:bg-white text-driftwood-900 font-semibold text-xs py-2.5 px-3 rounded-xl shadow-md border border-sand-200 flex items-center justify-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          
          <button
            onClick={handleQuickAdd}
            className={cn(
              "p-2.5 rounded-xl text-white font-semibold text-xs shadow-md flex items-center justify-center transition",
              added ? "bg-emerald-600" : "bg-coastal-800 hover:bg-coastal-900"
            )}
            title="Quick Add to Cart"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Content Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Origin */}
          <div className="flex items-center justify-between text-[11px] text-driftwood-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-sand-600">
              {product.category}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="font-semibold text-driftwood-700">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/shop/${product.slug}`} className="block group/title">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-driftwood-950 group-hover/title:text-coastal-700 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-driftwood-500 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="pt-3 mt-3 border-t border-sand-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-coastal-950">
              {formatZAR(product.price)}
            </span>
          </div>

          {/* Mobile Quick Add / WhatsApp button */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={handleQuickAdd}
              className={cn(
                "p-2 rounded-lg text-white text-xs font-semibold shadow-sm transition",
                added ? "bg-emerald-600" : "bg-coastal-800"
              )}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
