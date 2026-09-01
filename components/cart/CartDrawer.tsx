'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { formatZAR, STANDARD_SHIPPING_FEE } from '@/lib/utils';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartTotal,
  } = useShop();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-full max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
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

          {/* Courier note */}
          <div className="px-4 py-3 bg-sand-50 border-b border-sand-200 text-[11px] text-driftwood-600 flex items-center gap-2">
            <Truck className="w-4 h-4 text-coastal-600 flex-shrink-0" />
            <span>Nationwide courier available — delivery cost at client&apos;s expense</span>
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
                    Explore our curated collection of coastal home décor, handcrafted furniture, and artisan gifts.
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
              <div className="space-y-1.5 text-xs text-driftwood-600 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-driftwood-900">{formatZAR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Courier</span>
                  <span className="font-semibold text-driftwood-900">
                    From {formatZAR(STANDARD_SHIPPING_FEE)} at checkout
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-driftwood-950 pt-2 border-t border-sand-200">
                  <span>Total (excl. courier)</span>
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
