'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';
  const errorCode = searchParams.get('error') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({ email, password }),
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
    <div className="bg-driftwood-950 min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-coastal-900 border border-coastal-700 text-white flex items-center justify-center mx-auto shadow-lg">
            <KeyRound className="w-7 h-7 text-sand-300" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Koekeloer Control Center
          </h1>
          <p className="text-xs text-sand-400 max-w-sm mx-auto">
            Authorized staff and administrator access only. All actions are securely logged.
          </p>
        </div>

        {/* Card */}
        <div className="bg-driftwood-900/90 border border-driftwood-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-sand-300 uppercase tracking-widest mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@koekeloer.co.za"
                  className="w-full bg-driftwood-950/80 border border-driftwood-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-sand-600 focus:outline-none focus:border-coastal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-sand-300 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-driftwood-950/80 border border-driftwood-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-sand-600 focus:outline-none focus:border-coastal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-coastal-700 hover:bg-coastal-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-6"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Control Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-driftwood-800/80 text-center">
            <p className="text-[11px] text-sand-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sand-400" />
              <span>Encrypted Session • Rate-limited Authentication</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-driftwood-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-sand-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
