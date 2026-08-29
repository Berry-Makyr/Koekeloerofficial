'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { stores } from '@/data/stores';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="bg-sand-50/60 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sand-600">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-driftwood-950">
            Contact Koekeloer
          </h1>
          <p className="text-xs sm:text-sm text-driftwood-600 max-w-xl mx-auto leading-relaxed">
            Have a question about product dimensions, Bali furniture arrivals, clothing sizes, or your delivery? We are here to help.
          </p>
        </div>

        {/* Form and Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-soft">
            <h2 className="font-serif text-xl font-bold text-driftwood-950 mb-4">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-emerald-950">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-800">
                  Thank you very much for reaching out. Our team at Great White Junction Gansbaai will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mariaan Louw"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-driftwood-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. mariaan@example.co.za"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 082 345 6789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-driftwood-700 mb-1">Inquiry Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Availability">Product Availability / Stock</option>
                      <option value="Bali Furniture Sourcing">Bali Furniture Sourcing</option>
                      <option value="Esthe Shoes Sizing">Esthé Shoes / Boutique Sizing</option>
                      <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what you are looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-coastal-800 hover:bg-coastal-900 text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm flex items-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Quick Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Card */}
            <div className="bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold">Instant WhatsApp Support</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Want a fast response with live photos or video walk-arounds of furniture & clothing items in our Gansbaai store?
              </p>
              <a
                href="https://wa.me/27787030250?text=Hi%20Koekeloer%20Team!%20I'm%20reaching%20out%20via%20your%20website%20contact%20page."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-950 font-bold text-xs px-5 py-3 rounded-xl shadow-sm hover:bg-emerald-50 transition"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Chat on WhatsApp (+27 78 703 0250)</span>
              </a>
            </div>

            {/* Main Office Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-4 text-xs text-driftwood-700">
              <h3 className="font-serif text-base font-bold text-driftwood-950 pb-2 border-b border-sand-100">
                Gansbaai Headquarters & Flagship
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-driftwood-950 block">Address:</strong>
                    <span>Shop 2 & Shop 5, Great White Junction, Main Road, Gansbaai, 7220</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-driftwood-950 block">Telephone:</strong>
                    <span>+27 (0)78 703 0250</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-driftwood-950 block">Email:</strong>
                    <span>info@koekeloer.co.za</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-coastal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-driftwood-950 block">Operating Hours:</strong>
                    <p>Mon - Fri: 08:30 – 17:00</p>
                    <p>Sat: 08:30 – 14:00 | Sun: 09:00 – 13:00</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-sand-100">
                <Link
                  href="/stores"
                  className="text-xs text-coastal-700 hover:text-coastal-950 font-semibold"
                >
                  View Gansbaai showroom details & directions →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
