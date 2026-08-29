'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Mail, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        router.push(data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN' || data.user.role === 'STAFF' ? '/admin' : '/account');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setSuccessMsg('Account registered successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        router.push('/account');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sand-50/70 min-h-[80vh] py-12 sm:py-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand-600">
            Koekeloer Gansbaai
          </span>
          <h1 className="font-serif text-3xl font-bold text-driftwood-950">
            {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-driftwood-600">
            {tab === 'login'
              ? 'Sign in to track orders, save shipping addresses, and manage your wishlist.'
              : 'Join Koekeloer to enjoy seamless checkout and order status updates.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft">
          
          {/* Tabs */}
          <div className="flex bg-sand-100 p-1 rounded-2xl mb-6">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition",
                tab === 'login' ? "bg-white text-driftwood-950 shadow-sm" : "text-driftwood-600 hover:text-driftwood-900"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition",
                tab === 'register' ? "bg-white text-driftwood-950 shadow-sm" : "text-driftwood-600 hover:text-driftwood-900"
              )}
            >
              Register
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-driftwood-800 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.co.za"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-driftwood-800 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-coastal-700 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-coastal-800 hover:bg-coastal-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-6"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-driftwood-800 uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Nelia"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-driftwood-800 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Koekemoer"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-driftwood-800 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.co.za"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-driftwood-800 uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+27 78 703 0250"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-driftwood-800 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 chars with 1 number & 1 capital"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-coastal-800 hover:bg-coastal-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-6"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        {/* Security badge */}
        <div className="mt-6 text-center text-[11px] text-driftwood-500">
          Protected by server-side encryption & secure HTTPS session cookies.
        </div>

      </div>
    </div>
  );
}
