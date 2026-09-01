'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert, KeyRound, Eye, EyeOff } from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';
  const errorCode = searchParams.get('error') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorCode === 'admin_auth_required'
      ? 'Administrative authentication required. Please sign in.'
      : errorCode === 'session_expired'
      ? 'Admin session expired. Please re-authenticate.'
      : null
  );

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your staff credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sand-100/80 min-h-screen py-8 sm:py-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-coastal-900 text-white flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-7 h-7 text-sand-300" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-coastal-800 block">
            Koekeloer Gansbaai
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-driftwood-950 tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs text-driftwood-600 max-w-sm mx-auto">
            Authorized staff and administrator access only. All actions are securely logged.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-sand-300 rounded-3xl p-6 sm:p-8 shadow-lift space-y-5">
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-driftwood-900 uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@koekeloer.co.za"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-3 text-xs text-driftwood-950 placeholder-driftwood-400 focus:outline-none focus:border-coastal-800 focus:bg-white font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-driftwood-900 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-10 py-3 text-xs text-driftwood-950 placeholder-driftwood-400 focus:outline-none focus:border-coastal-800 focus:bg-white font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-driftwood-400 hover:text-driftwood-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-coastal-800 hover:bg-coastal-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Control Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Security badge */}
        <div className="text-center text-[11px] text-driftwood-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Server-side RBAC • HTTP-only Encrypted Session</span>
        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-sand-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-coastal-800 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
