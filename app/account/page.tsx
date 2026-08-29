'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Truck, 
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { formatZAR, cn } from '@/lib/utils';

export default function AccountDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Address modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    suburb: '',
    city: 'Gansbaai',
    province: 'Western Cape',
    postalCode: '7220',
    country: 'South Africa',
    isDefault: true,
  });

  useEffect(() => {
    async function loadAccountData() {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();

        if (!authData.user) {
          router.push('/account/login');
          return;
        }

        setUser(authData.user);

        // Fetch user orders
        const ordersRes = await fetch('/api/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }

        // Fetch addresses
        const addrRes = await fetch('/api/addresses');
        if (addrRes.ok) {
          const addrData = await addrRes.json();
          setAddresses(addrData.addresses || []);
        }
      } catch (e) {
        console.error('Account load error:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadAccountData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/account/login');
    router.refresh();
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses((prev) => [data.address, ...prev]);
        setIsAddressModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-sand-50/60">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-coastal-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-driftwood-600 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand-50/60 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-coastal-900 text-sand-50 flex items-center justify-center text-xl font-bold font-serif">
              {user?.firstName?.[0] || 'K'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-driftwood-950">
                  {user?.firstName} {user?.lastName}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-sand-200 text-driftwood-800 px-2.5 py-0.5 rounded-full">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-driftwood-600 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'STAFF') && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Admin Control Center →
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-sand-200 shadow-soft mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition",
              activeTab === 'orders' ? "bg-coastal-900 text-white shadow-sm" : "text-driftwood-600 hover:bg-sand-50"
            )}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition",
              activeTab === 'addresses' ? "bg-coastal-900 text-white shadow-sm" : "text-driftwood-600 hover:bg-sand-50"
            )}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition",
              activeTab === 'profile' ? "bg-coastal-900 text-white shadow-sm" : "text-driftwood-600 hover:bg-sand-50"
            )}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 shadow-soft space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-driftwood-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-driftwood-950">No orders yet</h3>
                <p className="text-xs text-driftwood-600">
                  When you make a purchase on Koekeloer, your verified orders and courier tracking updates will appear right here.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold px-6 py-3 rounded-xl transition shadow-sm"
                >
                  Explore Collections
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-driftwood-950">{order.orderNumber}</span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                          {order.paymentStatus}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-coastal-50 text-coastal-900 border border-coastal-300">
                          {order.fulfillmentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-driftwood-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-driftwood-500 block">Total Paid</span>
                      <span className="font-serif text-xl font-bold text-coastal-950">{formatZAR(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-sand-100">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrlSnapshot && (
                            <div className="w-12 h-12 rounded-xl bg-sand-100 overflow-hidden flex-shrink-0 border border-sand-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.imageUrlSnapshot} alt={item.productNameSnapshot} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-driftwood-900">{item.productNameSnapshot}</h4>
                            {item.variantTitleSnapshot && (
                              <p className="text-[11px] text-driftwood-500">{item.variantTitleSnapshot}</p>
                            )}
                            <span className="text-[11px] text-driftwood-400">Qty: {item.quantity} × {formatZAR(item.unitPriceSnapshot)}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-driftwood-900">{formatZAR(item.totalPriceSnapshot)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info */}
                  {order.trackingNumber && (
                    <div className="p-4 bg-coastal-50/60 rounded-2xl border border-coastal-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-coastal-950 font-semibold">
                        <Truck className="w-4 h-4 text-coastal-700" />
                        <span>Tracking: {order.courierName || 'The Courier Guy'} — <strong>{order.trackingNumber}</strong></span>
                      </div>
                      {order.trackingUrl && (
                        <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-coastal-800 underline font-bold">
                          Track Parcel →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
              <div>
                <h3 className="font-serif text-base font-bold text-driftwood-950">Saved Delivery Addresses</h3>
                <p className="text-xs text-driftwood-500">Manage addresses for fast 1-click checkout.</p>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="px-4 py-2 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl p-6 border border-sand-200 shadow-soft space-y-3 relative">
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-driftwood-950">{addr.recipientName}</h4>
                  <p className="text-xs text-driftwood-600 leading-relaxed">
                    {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}<br />
                    {addr.suburb && `${addr.suburb}, `}{addr.city}, {addr.province}, {addr.postalCode}<br />
                    {addr.country}
                  </p>
                  <p className="text-xs text-driftwood-500 font-mono">Tel: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-soft max-w-2xl space-y-6">
            <h3 className="font-serif text-xl font-bold text-driftwood-950 pb-2 border-b border-sand-100">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-driftwood-500 block mb-1">First Name</span>
                <p className="text-driftwood-950 font-semibold">{user?.firstName}</p>
              </div>
              <div>
                <span className="font-bold text-driftwood-500 block mb-1">Last Name</span>
                <p className="text-driftwood-950 font-semibold">{user?.lastName}</p>
              </div>
              <div>
                <span className="font-bold text-driftwood-500 block mb-1">Email</span>
                <p className="text-driftwood-950 font-semibold">{user?.email}</p>
              </div>
              <div>
                <span className="font-bold text-driftwood-500 block mb-1">Role & Permissions</span>
                <p className="text-driftwood-950 font-semibold">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-sand-200">
            <h3 className="font-serif text-xl font-bold text-driftwood-950">Add Shipping Address</h3>
            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-driftwood-800 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={addressForm.recipientName}
                  onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  placeholder="Nelia Koekemoer"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="font-bold text-driftwood-800 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="+27 78 703 0250"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="font-bold text-driftwood-800 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="Shop 2, Great White Junction, Main Road"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-driftwood-800 block mb-1">City / Town</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-driftwood-800 block mb-1">Province</label>
                  <input
                    type="text"
                    required
                    value={addressForm.province}
                    onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-driftwood-800 block mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 bg-sand-100 text-driftwood-800 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-coastal-800 hover:bg-coastal-900 text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
