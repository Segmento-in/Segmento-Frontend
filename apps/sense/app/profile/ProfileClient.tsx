'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { apiClient, ProfileStatsResponse } from '@/lib/apiClient';

// ── Toast helper — fires the segmento:toast custom event consumed by ToastProvider ──
type ToastType = 'info' | 'success' | 'error' | 'warning';

function fireToast(title: string, type: ToastType = 'info', message?: string) {
  window.dispatchEvent(
    new CustomEvent('segmento:toast', {
      detail: { type, title, message },
    }),
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileClient() {
  const { user, isLoggedIn, login, register, logout, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stats, setStats] = useState<ProfileStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && token) {
      setStatsLoading(true);
      apiClient.getProfileStats(token)
        .then(setStats)
        .catch(err => console.error('Failed to load profile stats:', err))
        .finally(() => setStatsLoading(false));
    }
  }, [isLoggedIn, token]);

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading]   = useState(false);

  // Register form state
  const [regName, setRegName]           = useState('');
  const [regEmail, setRegEmail]         = useState('');
  const [regPassword, setRegPassword]   = useState('');
  const [regConfirm, setRegConfirm]     = useState('');
  const [regError, setRegError]         = useState('');
  const [regLoading, setRegLoading]     = useState(false);

  // Logout state
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      fireToast('Signed in', 'success', `Welcome back!`);
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
          router.push(returnUrl);
      }
    } catch (err: any) {
      fireToast('Login failed', 'error', err?.message ?? 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }

    setRegLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      // If we get here with no access_token, it means email confirmation is pending
      // authContext handles that case — check isLoggedIn
      if (!isLoggedIn) {
        fireToast('Check your email', 'info', 'A confirmation link has been sent. Verify your email before logging in.');
      } else {
        fireToast('Account created', 'success', `Welcome, ${regName}!`);
      }
    } catch (err: any) {
      // Handle 202 "email confirmation" response surfaced as an error
      const msg: string = err?.message ?? '';
      if (msg.toLowerCase().includes('confirmation') || msg.includes('202')) {
        fireToast('Check your email', 'info', 'A confirmation link has been sent. Verify your email before logging in.');
      } else {
        fireToast('Registration failed', 'error', msg || 'Something went wrong');
      }
    } finally {
      setRegLoading(false);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await logout();
      fireToast('Signed out', 'info', 'You have been logged out.');
    } catch {
      fireToast('Signed out', 'info', 'Session cleared locally.');
    } finally {
      setLogoutLoading(false);
    }
  }

  // ── Format date ──────────────────────────────────────────────────────────────

  function formatDate(iso: string) {
    try {
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  // ── Authenticated dashboard ──────────────────────────────────────────────────

  if (isLoggedIn && user) {
    const initial = user.name?.[0]?.toUpperCase() ?? '?';
    const firstName = user.name?.split(' ')[0] ?? user.email;

    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 shadow-2xl shadow-black/60 overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 mb-8 relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white text-3xl font-black select-none">
                {initial}
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-black text-white tracking-tight">{user.name}</h1>
                <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Usage & Limits */}
            <div className="space-y-3 mb-8 relative z-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Usage & Limits</h3>
              
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Credits Remaining</span>
                {statsLoading ? (
                  <span className="text-sm text-slate-400 animate-pulse">Loading...</span>
                ) : (
                  <span className="text-sm text-blue-400 font-semibold">
                    {stats?.credits?.credits_remaining ?? '—'} <span className="text-slate-500 font-medium">/ {stats?.credits?.weekly_allowance ?? 100}</span>
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Scans</span>
                {statsLoading ? (
                  <span className="text-sm text-slate-400 animate-pulse">Loading...</span>
                ) : (
                  <span className="text-sm text-white font-medium">{stats?.total_scans ?? 0}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">PII Found</span>
                {statsLoading ? (
                  <span className="text-sm text-slate-400 animate-pulse">Loading...</span>
                ) : (
                  <span className="text-sm text-emerald-400 font-medium">{stats?.total_pii_found ?? 0}</span>
                )}
              </div>
            </div>

            {/* Meta info */}
            <div className="space-y-3 mb-8 relative z-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Account Info</h3>

              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Member since</span>
                <span className="text-sm text-white font-medium">{formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">User ID</span>
                <span className="text-xs text-slate-400 font-mono truncate max-w-[180px]">{user.id}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Auth Provider</span>
                <span className="text-sm text-emerald-400 font-semibold">Supabase GoTrue</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="relative z-10 w-full rounded-xl bg-white/[0.06] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/70 hover:text-red-400 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logoutLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing out…
                </span>
              ) : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Login / Register tabs ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Segmento Sense</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Your Account</h1>
          <p className="text-slate-400 text-sm mt-2">Sign in or create a new Sense account</p>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

          {/* Tabs */}
          <div className="flex border-b border-white/[0.07]">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
                  tab === t
                    ? 'text-white border-b-2 border-blue-500 -mb-px'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="p-8 relative z-10">
            {/* ── LOGIN ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 text-sm font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
                >
                  {loginLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Signing in…
                    </span>
                  ) : 'Sign In'}
                </button>
                <p className="text-center text-xs text-slate-600 mt-2">
                  No account?{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Register here
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                  <input
                    id="reg-confirm"
                    type="password"
                    required
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                  />
                </div>

                {/* Inline validation error */}
                {regError && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {regError}
                  </p>
                )}

                <button
                  id="reg-submit"
                  type="submit"
                  disabled={regLoading}
                  className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 text-sm font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
                >
                  {regLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Creating account…
                    </span>
                  ) : 'Create Account'}
                </button>
                <p className="text-center text-xs text-slate-600 mt-2">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          Secured by Supabase GoTrue · Zero PII stored client-side
        </p>
      </div>
    </div>
  );
}
