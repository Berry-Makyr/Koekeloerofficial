'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Lock,
  Phone,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '@/context/ShopContext';
import { formatZAR, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, cn } from '@/lib/utils';

const SA_PROVINCES = [
  'Western Cape',
  'Gauteng',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
];

export default function CheckoutFlow() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    discountAmount,
    activeCoupon,
    clearCart,
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: 'Jan',
    lastName: 'de Villiers',
    email: 'jan.devilliers@example.co.za',
    phone: '082 123 4567',
    address: '14 Marine Drive',
    suburb: 'De Kelders',
    city: 'Gansbaai',
    province: 'Western Cape',
    postalCode: '7220',
    notes: 'Please leave with reception if not home.',
    shippingMethod: cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 'courier-free' : 'courier-standard',
    paymentMethod: 'payfast',
  });

  const shippingCost = (() => {
    if (formData.shippingMethod === 'pickup-gansbaai' || formData.shippingMethod === 'pickup-bredasdorp') {
      return 0;
    }
    if (cartSubtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    if (formData.shippingMethod === 'courier-express') {
      return 220;
    }
    return STANDARD_SHIPPING_FEE;
  })();

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = `KKL-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3C819F', '#B0886C', '#D55C3E', '#2E6680'],
        });
      } catch (e) {
        console.error(e);
      }
    }, 1800);
  };

  const copyOrderDetails = () => {
    const text = `*Koekeloer Order Confirmation*\nOrder ID: ${orderId}\nCustomer: ${formData.firstName} ${formData.lastName}\nTotal: ${formatZAR(grandTotal)}\nDelivery: ${formData.address}, ${formData.city}`;
    navigator.clipboard?.writeText(text);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2500);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-driftwood-400 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-driftwood-900">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-driftwood-500 mt-2 max-w-sm">
          Add some lovely decor or boutique items before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 bg-coastal-800 hover:bg-coastal-900 text-white font-semibold text-xs px-6 py-3 rounded-xl transition"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="py-12 sm:py-20 bg-sand-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand-200 shadow-lift text-center space-y-6">
            
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment & Order Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950">
                Thank You, {formData.firstName}!
              </h1>
              <p className="text-xs sm:text-sm text-driftwood-600 max-w-md mx-auto">
                We have received your order <strong>#{orderId}</strong>. A confirmation email has been dispatched to <strong>{formData.email}</strong>.
              </p>
            </div>

            {/* Order Summary Receipt Box */}
            <div className="bg-sand-50 rounded-2xl p-6 text-left border border-sand-200 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-sand-200">
                <div>
                  <span className="text-driftwood-500 block">Order Reference:</span>
                  <span className="font-mono font-bold text-sm text-coastal-900">#{orderId}</span>
                </div>
                <div className="text-right">
                  <span className="text-driftwood-500 block">Date:</span>
                  <span className="font-semibold text-driftwood-800">{new Date().toLocaleDateString('en-ZA')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-driftwood-500 block font-semibold mb-1">Delivery Destination:</span>
                  <p className="text-driftwood-800 font-medium">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}, {formData.suburb}<br />
                    {formData.city}, {formData.province}, {formData.postalCode}<br />
                    Tel: {formData.phone}
                  </p>
                </div>
                <div>
                  <span className="text-driftwood-500 block font-semibold mb-1">Dispatch Method:</span>
                  <p className="text-driftwood-800 font-medium capitalize">
                    {formData.shippingMethod.replace('-', ' ')}
                  </p>
                  <span className="text-driftwood-500 block font-semibold mt-2 mb-1">Payment Method:</span>
                  <p className="text-driftwood-800 font-medium uppercase">
                    {formData.paymentMethod} (Verified)
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-sand-200 flex justify-between items-center text-sm font-bold">
                <span className="text-driftwood-900">Total Paid:</span>
                <span className="text-coastal-900 text-base">{formatZAR(grandTotal)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={copyOrderDetails}
                className="px-5 py-2.5 rounded-xl border border-sand-300 text-driftwood-800 text-xs font-semibold hover:bg-sand-100 flex items-center gap-1.5 transition"
              >
                {copiedOrder ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedOrder ? 'Copied to clipboard' : 'Copy Summary'}</span>
              </button>

              <a
                href={`https://wa.me/27787030250?text=Hi%20Koekeloer,%20I've%20just%20placed%20order%20%23${orderId}%20and%20wanted%20to%20say%20thanks!`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Notify Shop on WhatsApp</span>
              </a>

              <Link
                href="/shop"
                className="px-5 py-2.5 rounded-xl bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold transition"
              >
                Continue Browsing
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-14 bg-sand-50/70 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center gap-1 text-xs text-driftwood-600 hover:text-coastal-800 mb-2 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shop</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950">
            Secure Checkout
          </h1>
        </div>

        {/* 3 Step Indicator */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          {[
            { num: 1, label: '1. Customer & Address' },
            { num: 2, label: '2. Shipping Option' },
            { num: 3, label: '3. Payment & Review' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as any)}
              className={cn(
                "p-3 sm:p-4 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center text-center",
                step === s.num
                  ? "bg-coastal-900 text-white border-coastal-900 shadow-sm"
                  : step > s.num
                  ? "bg-white text-coastal-800 border-coastal-300 cursor-pointer hover:bg-coastal-50"
                  : "bg-white text-driftwood-400 border-sand-200"
              )}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Grid: Form + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Step Forms */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft">
            
            {/* STEP 1: Address & Contact */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-driftwood-950 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-coastal-700" />
                  <span>Customer & Delivery Details</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-driftwood-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-driftwood-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-driftwood-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-driftwood-700 mb-1">South African Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-driftwood-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="e.g. 14 Marine Drive"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-driftwood-700 mb-1">Suburb / Area *</label>
                    <input
                      type="text"
                      name="suburb"
                      required
                      value={formData.suburb}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-driftwood-700 mb-1">Town / City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-driftwood-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-driftwood-700 mb-1">Province *</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  >
                    {SA_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-driftwood-700 mb-1">Special Delivery Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-coastal-800 hover:bg-coastal-900 text-white font-semibold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Shipping Options */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-sand-100">
                  <h2 className="font-serif text-xl font-bold text-driftwood-950 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-coastal-700" />
                    <span>Select Courier / Collection Option</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-coastal-700 underline font-semibold"
                  >
                    Edit Address
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Courier Guy standard/free */}
                  <label className={cn(
                    "flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition",
                    formData.shippingMethod.startsWith('courier')
                      ? "border-coastal-700 bg-coastal-50/40 shadow-sm"
                      : "border-sand-200 hover:bg-sand-50"
                  )}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 'courier-free' : 'courier-standard'}
                        checked={formData.shippingMethod.startsWith('courier')}
                        onChange={handleInputChange}
                        className="mt-0.5 accent-coastal-700"
                      />
                      <div>
                        <p className="font-bold text-driftwood-950 text-sm">The Courier Guy (Door-to-Door)</p>
                        <p className="text-driftwood-500 mt-0.5">Tracked express road courier across South Africa (2-4 business days)</p>
                        {cartSubtotal >= FREE_SHIPPING_THRESHOLD && (
                          <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            FREE SHIPPING QUALIFIED
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-sm text-driftwood-900">
                      {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : formatZAR(STANDARD_SHIPPING_FEE)}
                    </span>
                  </label>

                  {/* Gansbaai Collection */}
                  <label className={cn(
                    "flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition",
                    formData.shippingMethod === 'pickup-gansbaai'
                      ? "border-coastal-700 bg-coastal-50/40 shadow-sm"
                      : "border-sand-200 hover:bg-sand-50"
                  )}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pickup-gansbaai"
                        checked={formData.shippingMethod === 'pickup-gansbaai'}
                        onChange={handleInputChange}
                        className="mt-0.5 accent-coastal-700"
                      />
                      <div>
                        <p className="font-bold text-driftwood-950 text-sm">Free Pick-up: Gansbaai Showroom</p>
                        <p className="text-driftwood-500 mt-0.5">Shop 2, Great White Junction, Main Road, Gansbaai</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-emerald-700">FREE</span>
                  </label>

                  {/* Bredasdorp Collection */}
                  <label className={cn(
                    "flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition",
                    formData.shippingMethod === 'pickup-bredasdorp'
                      ? "border-coastal-700 bg-coastal-50/40 shadow-sm"
                      : "border-sand-200 hover:bg-sand-50"
                  )}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pickup-bredasdorp"
                        checked={formData.shippingMethod === 'pickup-bredasdorp'}
                        onChange={handleInputChange}
                        className="mt-0.5 accent-coastal-700"
                      />
                      <div>
                        <p className="font-bold text-driftwood-950 text-sm">Free Pick-up: Bredasdorp Store</p>
                        <p className="text-driftwood-500 mt-0.5">24 Dirkie Uys Street, Bredasdorp</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-emerald-700">FREE</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-driftwood-600 hover:text-driftwood-900"
                  >
                    ← Back to Details
                  </button>
                  <button
                    type="submit"
                    className="bg-coastal-800 hover:bg-coastal-900 text-white font-semibold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Payment Gateway & Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-sand-100">
                  <h2 className="font-serif text-xl font-bold text-driftwood-950 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-coastal-700" />
                    <span>Select Payment Option</span>
                  </h2>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-coastal-700 underline font-semibold"
                  >
                    Change Shipping
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* PayFast */}
                  <label className={cn(
                    "flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition",
                    formData.paymentMethod === 'payfast'
                      ? "border-coastal-700 bg-coastal-50/40 shadow-sm"
                      : "border-sand-200 hover:bg-sand-50"
                  )}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payfast"
                        checked={formData.paymentMethod === 'payfast'}
                        onChange={handleInputChange}
                        className="mt-0.5 accent-coastal-700"
                      />
                      <div>
                        <p className="font-bold text-driftwood-950 text-sm">PayFast (Credit / Debit Card)</p>
                        <p className="text-driftwood-500 mt-0.5">Visa, Mastercard, Maestro, RCS store cards</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold bg-sand-200/80 px-2 py-0.5 rounded text-driftwood-800">
                      SECURE
                    </span>
                  </label>

                  {/* Ozow Instant EFT */}
                  <label className={cn(
                    "flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition",
                    formData.paymentMethod === 'ozow'
                      ? "border-coastal-700 bg-coastal-50/40 shadow-sm"
                      : "border-sand-200 hover:bg-sand-50"
                  )}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ozow"
                        checked={formData.paymentMethod === 'ozow'}
                        onChange={handleInputChange}
                        className="mt-0.5 accent-coastal-700"
                      />
                      <div>
                        <p className="font-bold text-driftwood-950 text-sm">Ozow Instant EFT</p>
                        <p className="text-driftwood-500 mt-0.5">FNB, Capitec, Standard Bank, Absa, Nedbank, TymeBank</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold bg-sand-200/80 px-2 py-0.5 rounded text-driftwood-800">
                      ZERO FEES
                    </span>
                  </label>

                  {/* SnapScan */}
                  <label className={cn(
                    "flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition",
                    formData.paymentMethod === 'snapscan'
                      ? "border-coastal-700 bg-coastal-50/40 shadow-sm"
                      : "border-sand-200 hover:bg-sand-50"
                  )}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="snapscan"
                        checked={formData.paymentMethod === 'snapscan'}
                        onChange={handleInputChange}
                        className="mt-0.5 accent-coastal-700"
                      />
                      <div>
                        <p className="font-bold text-driftwood-950 text-sm">SnapScan QR Pay</p>
                        <p className="text-driftwood-500 mt-0.5">Scan with SnapScan app on your mobile phone</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Final Order summary trigger */}
                <div className="pt-4 border-t border-sand-200">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleCompleteOrder}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-lift flex items-center justify-center gap-2 transition"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Secure Payment ({formatZAR(grandTotal)})...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirm & Pay {formatZAR(grandTotal)}</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-driftwood-500 mt-2">
                    By confirming, you agree to Koekeloer&apos;s terms & conditions and courier dispatch timeline.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right: Cart Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                <h3 className="font-serif text-lg font-bold text-driftwood-950">
                  Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h3>
                <Link href="/shop" className="text-xs text-coastal-700 hover:underline font-semibold">
                  Edit Items
                </Link>
              </div>

              {/* Items Mini List */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-sand-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-sand-100 border border-sand-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-driftwood-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-driftwood-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-coastal-900">
                        {formatZAR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-4 border-t border-sand-200 space-y-2 text-xs text-driftwood-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-driftwood-900">{formatZAR(cartSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({activeCoupon})</span>
                    <span>-{formatZAR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-driftwood-900">
                    {shippingCost === 0 ? 'FREE' : formatZAR(shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-driftwood-950 pt-3 border-t border-sand-200">
                  <span>Grand Total (ZAR)</span>
                  <span className="text-coastal-950">{formatZAR(grandTotal)}</span>
                </div>
              </div>

              {/* Trust Badge Box */}
              <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 flex items-center gap-2 text-[11px] text-driftwood-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>PayFast PCI-DSS Level 1 Encrypted Gateway with 3D Secure OTP</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
