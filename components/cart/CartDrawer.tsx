'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Sparkles, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { formatZAR, FREE_SHIPPING_THRESHOLD, cn } from '@/lib/utils';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    freeShippingRemaining,
    freeShippingProgress,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-sand-200 bg-sand-50/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-coastal-800" />
              <h2 className="font-serif text-lg font-semibold text-driftwood-950">
                Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-driftwood-500 hover:text-driftwood-800 hover:bg-sand-200/60 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-coastal-50/60 border-b border-coastal-100">
            <div className="flex items-center justify-between text-xs font-semibold text-coastal-950 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-coastal-600" />
                {freeShippingRemaining > 0 ? (
                  <span>
                    Add <strong>{formatZAR(freeShippingRemaining)}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> You qualify for FREE Nationwide Delivery!
                  </span>
                )}
              </div>
              <span className="text-[11px] text-coastal-700">{freeShippingProgress}%</span>
            </div>

            <div className="w-full bg-coastal-200 h-2 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-coastal-600"
                )}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-sand-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-driftwood-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-driftwood-900">Your cart is empty</h3>
                  <p className="text-xs text-driftwood-500 mt-1 max-w-xs">
                    Explore our curated collection of coastal home decor, handcrafted furniture, and boutique fashion.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const variantKey = item.selectedVariant
                  ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}:${v}`).join('|')
                  : 'default';

                return (
                  <div key={`${item.product.id}-${index}`} className="pt-4 first:pt-0 flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand-100 border border-sand-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/shop/${item.product.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-semibold text-sm text-driftwood-950 hover:text-coastal-700 line-clamp-1 transition"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id, variantKey)}
                            className="text-driftwood-400 hover:text-terracotta-600 p-0.5 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.selectedVariant && (
                          <div className="flex flex-wrap gap-1 text-[11px] text-driftwood-500 mt-0.5">
                            {Object.entries(item.selectedVariant).map(([key, val]) => (
                              <span key={key} className="bg-sand-100 px-1.5 py-0.5 rounded capitalize">
                                {key}: {val}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs font-bold text-coastal-900 mt-1">
                          {formatZAR(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-sand-300 rounded-lg overflow-hidden bg-sand-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, variantKey)}
                            className="p-1 hover:bg-sand-200 text-driftwood-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-driftwood-900 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, variantKey)}
                            className="p-1 hover:bg-sand-200 text-driftwood-600"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-driftwood-900">
                          {formatZAR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer / Checkout summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-sand-200 bg-sand-50/80 space-y-3">
              
              {/* Coupon Form */}
              <div>
                {activeCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon applied: <strong>{activeCoupon}</strong> (-{formatZAR(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. KOEKELOER10)"
                      className="text-xs px-3 py-2 bg-white border border-sand-300 rounded-lg flex-1 text-driftwood-900 uppercase focus:outline-none focus:border-coastal-600"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-driftwood-800 hover:bg-driftwood-900 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-driftwood-600 pt-2 border-t border-sand-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-driftwood-900">{formatZAR(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatZAR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-driftwood-900">
                    {freeShippingRemaining === 0 ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-driftwood-950 pt-2 border-t border-sand-200">
                  <span>Total</span>
                  <span className="text-coastal-900">{formatZAR(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 px-4 bg-coastal-800 hover:bg-coastal-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Safe & secure note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-driftwood-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bank-grade 256-bit SSL encrypted checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
