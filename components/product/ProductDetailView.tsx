'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Phone, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  RotateCcw, 
  MapPin, 
  Share2,
  ChevronRight,
  PackageSearch
} from 'lucide-react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/product/ProductCard';
import { formatZAR, cn } from '@/lib/utils';

export default function ProductDetailView({ 
  product: directProduct,
  initialProduct,
  slug 
}: { 
  product?: Product;
  initialProduct?: Product;
  slug?: string;
}) {
  const { addToCart, isInWishlist, toggleWishlist, products } = useShop();

  // Find product either from directProduct / initialProduct or from useShop()
  const product = directProduct || initialProduct || products.find((p) => p.slug === slug || p.id === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product?.variants?.forEach((v) => {
      if (v.options.length > 0) initial[v.type] = v.options[0];
    });
    return initial;
  });
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care' | 'shipping'>('details');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) {
    return (
      <div className="bg-sand-50/50 py-16 sm:py-24">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-sand-200 text-driftwood-600 flex items-center justify-center mx-auto">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-driftwood-950">
            Product Not Found
          </h1>
          <p className="text-xs sm:text-sm text-driftwood-600 leading-relaxed">
            This item might be unavailable or out of stock. Browse our full online catalog or visit our Gansbaai showroom.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-sm transition"
            >
              Browse Catalog
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-sand-100 text-driftwood-900 text-xs font-semibold px-6 py-3 rounded-xl border border-sand-300 shadow-sm transition"
            >
              Contact Showroom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const whatsAppMessage = encodeURIComponent(
    `Hi Koekeloer Gansbaai! I have a question regarding the ${product.name} (R${product.price}) on your online store. Can you share more details/pictures?`
  );

  return (
    <div className="bg-sand-50/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-driftwood-500 mb-6 flex-wrap gap-1.5">
          <Link href="/" className="hover:text-coastal-800 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-coastal-800 transition">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-coastal-800 transition">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-driftwood-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-soft">
          
          {/* Left: Product Images Gallery */}
          <div className="space-y-4">
            {/* Big Feature Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand-100 border border-sand-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badges?.map((badge) => (
                  <span
                    key={badge}
                    className={cn(
                      "px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm",
                      badge === 'Sale' ? 'bg-terracotta-600 text-white' :
                      badge === 'Handmade' ? 'bg-coastal-900 text-sand-100' :
                      badge === 'New' ? 'bg-sage-700 text-white' : 'bg-driftwood-800 text-white'
                    )}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Share & Favorite buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/90 hover:bg-white text-driftwood-700 shadow-sm transition"
                  title="Copy link to product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2.5 rounded-full bg-white/90 hover:bg-white text-driftwood-700 shadow-sm transition"
                  title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={cn("w-4 h-4", isFavorite && "fill-terracotta-500 text-terracotta-500")} />
                </button>
              </div>

              {copiedLink && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-coastal-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                  Link copied to clipboard!
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border-2 transition",
                      selectedImage === idx ? "border-coastal-800 shadow-sm" : "border-sand-200 opacity-70 hover:opacity-100"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.name} angle`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Purchase Info & Specifications */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-driftwood-500 mb-2">
                <span className="uppercase tracking-widest font-semibold text-sand-600">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-driftwood-800">{product.rating}</span>
                  <span className="text-driftwood-400">({product.reviewCount} customer reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-driftwood-950 leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="text-3xl font-bold text-coastal-950">
                  {formatZAR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-driftwood-400 line-through">
                    {formatZAR(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-bold text-terracotta-700 bg-terracotta-50 px-2.5 py-1 rounded-md border border-terracotta-200">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Short Summary */}
              <p className="text-xs sm:text-sm text-driftwood-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variants (Sizes / Colors) */}
              {product.variants?.map((v) => (
                <div key={v.type} className="mb-5">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-driftwood-800 mb-2">
                    <span>Select {v.type}:</span>
                    <span className="text-coastal-800 font-bold capitalize">{selectedVariants[v.type]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [v.type]: option }))}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-semibold border transition",
                          selectedVariants[v.type] === option
                            ? "bg-coastal-900 text-white border-coastal-900 shadow-sm"
                            : "bg-white text-driftwood-700 border-sand-300 hover:border-driftwood-500"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* In-Store Availability Card */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 mb-6 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-900">
                    Available in Gansbaai Flagship ({product.stockCount} in stock)
                  </p>
                  <p className="text-emerald-700 mt-0.5">
                    Order online for door-to-door courier or free in-store collection at Great White Junction.
                  </p>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-sand-300 rounded-xl overflow-hidden bg-sand-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-driftwood-700 hover:bg-sand-200 transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-3 text-sm font-bold text-driftwood-900 min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-driftwood-700 hover:bg-sand-200 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition duration-200",
                      addedAnimation
                        ? "bg-emerald-600 text-white"
                        : "bg-coastal-800 hover:bg-coastal-900 text-white hover:shadow-lg"
                    )}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added to Your Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart • {formatZAR(product.price * quantity)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct WhatsApp Ordering */}
                <a
                  href={`https://wa.me/27787030250?text=${whatsAppMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Enquire / Order via WhatsApp (+27 78 703 0250)</span>
                </a>
              </div>
            </div>

            {/* Value Badges */}
            <div className="pt-6 border-t border-sand-200 grid grid-cols-2 gap-4 text-xs text-driftwood-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-coastal-700 flex-shrink-0" />
                <span>Fast Nationwide Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-coastal-700 flex-shrink-0" />
                <span>Secure SA PayFast Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-coastal-700 flex-shrink-0" />
                <span>Direct Import Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-coastal-700 flex-shrink-0" />
                <span>Hassle-Free Returns</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specifications & Care */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-soft">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-sand-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={cn(
                "font-serif text-sm sm:text-base font-bold pb-2 transition relative whitespace-nowrap",
                activeTab === 'details'
                  ? "text-coastal-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-800"
                  : "text-driftwood-500 hover:text-driftwood-800"
              )}
            >
              Artisan Features & Story
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={cn(
                "font-serif text-sm sm:text-base font-bold pb-2 transition relative whitespace-nowrap",
                activeTab === 'specs'
                  ? "text-coastal-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-800"
                  : "text-driftwood-500 hover:text-driftwood-800"
              )}
            >
              Dimensions & Materials
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={cn(
                "font-serif text-sm sm:text-base font-bold pb-2 transition relative whitespace-nowrap",
                activeTab === 'care'
                  ? "text-coastal-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-800"
                  : "text-driftwood-500 hover:text-driftwood-800"
              )}
            >
              Care Instructions
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={cn(
                "font-serif text-sm sm:text-base font-bold pb-2 transition relative whitespace-nowrap",
                activeTab === 'shipping'
                  ? "text-coastal-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-800"
                  : "text-driftwood-500 hover:text-driftwood-800"
              )}
            >
              Delivery & In-Store Pick-up
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6 text-xs sm:text-sm text-driftwood-700 leading-relaxed">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                {product.features && (
                  <div className="pt-2">
                    <h4 className="font-bold text-driftwood-950 mb-2">Key Highlights:</h4>
                    <ul className="list-disc list-inside space-y-1 text-driftwood-600">
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.origin && (
                  <p className="text-xs text-sand-700 font-semibold pt-2">
                    Provenance: {product.origin}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                {product.dimensions && (
                  <div className="p-3 bg-sand-50 rounded-xl">
                    <span className="font-semibold block text-driftwood-900">Dimensions:</span>
                    <span className="text-driftwood-600">{product.dimensions}</span>
                  </div>
                )}
                {product.materials && (
                  <div className="p-3 bg-sand-50 rounded-xl">
                    <span className="font-semibold block text-driftwood-900">Materials:</span>
                    <span className="text-driftwood-600">{product.materials}</span>
                  </div>
                )}
                {product.origin && (
                  <div className="p-3 bg-sand-50 rounded-xl">
                    <span className="font-semibold block text-driftwood-900">Origin:</span>
                    <span className="text-driftwood-600">{product.origin}</span>
                  </div>
                )}
                <div className="p-3 bg-sand-50 rounded-xl">
                  <span className="font-semibold block text-driftwood-900">SKU Code:</span>
                  <span className="text-driftwood-600 uppercase font-mono">{product.id}</span>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-2">
                <p>{product.careInstructions || 'Wipe gently with a soft dry cloth. Avoid abrasive detergents, excessive water exposure, and harsh direct sunlight to maintain the natural finish.'}</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p><strong>Courier Delivery:</strong> Nationwide tracked shipping via The Courier Guy (2–4 business days). Courier cost at client&apos;s expense.</p>
                <p><strong>Store Collection:</strong> Free collection available from Koekeloer Gift Shop or Boutique at Great White Junction, Gansbaai.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-sand-600">You May Also Love</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-driftwood-950">Complete the Look</h2>
              </div>
              <Link href={`/shop?category=${product.categorySlug}`} className="text-xs sm:text-sm font-semibold text-coastal-800 hover:text-coastal-950">
                View More in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
