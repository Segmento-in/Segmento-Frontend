'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { apiClient, ProfileStatsResponse } from '@/lib/apiClient';
import { supabase } from '@/lib/supabaseClient';
import StatsBar from '@/components/profile/StatsBar';
import PiiDonut from '@/components/profile/PiiDonut';
import ConnectorsRanking from '@/components/profile/ConnectorsRanking';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import ScanFeed from '@/components/profile/ScanFeed';
import RiskScore from '@/components/profile/RiskScore';
import TopPiiBar from '@/components/profile/TopPiiBar';

const OAUTH_INTENT_KEY = 'sense_oauth_intent';

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
  const { user, isLoggedIn, login, commitSession, register, logout, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stats, setStats] = useState<ProfileStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && token) {
      setStatsLoading(true);
      apiClient.getProfileStats(token)
        .then(setStats)
        .catch(err => {
          console.error('Failed to load profile stats:', err);
          if (err.message && err.message.toLowerCase().includes('token')) {
            fireToast('Session Expired', 'error', 'Please log in again.');
            logout();
          }
        })
        .finally(() => setStatsLoading(false));
    }
  }, [isLoggedIn, token, logout]);

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail]             = useState('');
  const [loginPassword, setLoginPassword]       = useState('');
  const [loginLoading, setLoginLoading]         = useState(false);
  const [loginError, setLoginError]             = useState('');
  const [loginAccountType, setLoginAccountType] = useState<'individual' | 'organization'>('individual');

  // Register form state
  const [regName, setRegName]           = useState('');
  const [regEmail, setRegEmail]         = useState('');
  const [regPassword, setRegPassword]   = useState('');
  const [regConfirm, setRegConfirm]     = useState('');
  const [regError, setRegError]         = useState('');
  const [regLoading, setRegLoading]     = useState(false);

  // Organization Account toggle
  const [accountType, setAccountType]   = useState<'individual' | 'organization'>('individual');
  const [regOrgName, setRegOrgName]     = useState('');

  // Sign-In org name (needed when loginAccountType=organization + Google OAuth)
  const [loginOrgName, setLoginOrgName] = useState('');

  // Logout state
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const result = await login(loginEmail, loginPassword);
      const { access_token, user: loggedInUser } = result;

      // ── Account Mode Mismatch check ─────────────────────────────────────────
      // Individual selected  → loggedInUser must have org_id null/undefined
      // Organization selected → loggedInUser must have a non-null org_id
      const accountIsOrg = Boolean(loggedInUser.org_id);
      if (loginAccountType === 'individual' && accountIsOrg) {
        setLoginError(
          'This account is an Organization account, not Individual — flip the toggle and try again.'
        );
        return; // do NOT persist anything
      }
      if (loginAccountType === 'organization' && !accountIsOrg) {
        setLoginError(
          'This account is an Individual account, not Organization — flip the toggle and try again.'
        );
        return; // do NOT persist anything
      }

      // ── Match: persist session via AuthProvider ───────────────────────────────
      commitSession(access_token, loggedInUser);

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
      if (accountType === 'organization') {
        await register(regName, regEmail, regPassword, regOrgName);
      } else {
        await register(regName, regEmail, regPassword);
      }
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

  // ── Shared Google OAuth handler ───────────────────────────────────────────────
  // Called by both tabs' "Continue with Google" buttons.
  // Reads the active tab's mode + org name, guards, stashes intent, redirects.

  async function handleGoogleSignIn() {
    const activeMode    = tab === 'register' ? accountType : loginAccountType;
    const activeOrgName = (tab === 'register' ? regOrgName : loginOrgName).trim();

    // Guard: org mode requires an org name before we stash intent
    if (activeMode === 'organization' && !activeOrgName) {
      if (tab === 'register') {
        setRegError('Organization Name is required to continue with Google.');
      } else {
        setLoginError('Organization Name is required to continue with Google.');
      }
      return;
    }

    // Stash intent — single-use, consumed by the callback page
    localStorage.setItem(
      OAUTH_INTENT_KEY,
      JSON.stringify({ mode: activeMode, organization_name: activeOrgName || undefined }),
    );

    // Redirect to Google via Supabase PKCE flow
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/sense/auth/callback`,
      },
    });
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
      <div className="min-h-screen bg-[#020617] flex overflow-x-hidden">
        {/* Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-slate-800 bg-[#020617] flex-col fixed inset-y-0 pt-16 z-20">
          <div className="p-6 flex-1 overflow-y-auto scrollbar-thin">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white text-3xl font-black select-none">
                {initial}
              </div>
              <div className="text-center">
                <h1 className="text-xl font-black text-white tracking-tight">{user.name}</h1>
                <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Credits Info */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Usage & Limits</h3>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Credits</span>
                {statsLoading ? (
                  <span className="text-sm text-slate-400 animate-pulse">...</span>
                ) : (
                  <span className="text-sm text-blue-400 font-semibold">
                    {stats?.remaining_credits ?? '—'} <span className="text-slate-500 font-medium">/ {stats?.total_credits ?? 100}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Meta info */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Account Info</h3>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Member since</span>
                <span className="text-sm text-white font-medium">{formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">User ID</span>
                <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]" title={user.id}>{user.id}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-800 bg-slate-900/50 mt-auto">
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full rounded-xl bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.05] hover:border-red-500/30 text-white/70 hover:text-red-400 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logoutLoading ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-0 md:ml-72 p-4 md:p-8 pt-20 md:pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Mobile profile header — hidden on desktop */}
            <div className="md:hidden mb-6 p-4 rounded-2xl border border-slate-800 bg-[#020617]">
              {/* Row 1: avatar + info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-black select-none shrink-0">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white tracking-tight truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <p className="text-xs text-blue-400 font-semibold mt-0.5">
                    {statsLoading ? '…' : `${stats?.remaining_credits ?? '—'} / ${stats?.total_credits ?? 100} credits`}
                  </p>
                </div>
              </div>
              {/* Row 2: sign out — always full width */}
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full rounded-xl bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.05] hover:border-red-500/30 text-white/60 hover:text-red-400 py-2.5 text-xs font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {logoutLoading ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>

            <header className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Security Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your Segmento Sense activities</p>
            </header>

            {statsLoading || !stats ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  <p className="text-sm text-slate-500 font-medium">Loading analytics...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <StatsBar stats={stats} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <RiskScore stats={stats} />
                  </div>
                  <div className="lg:col-span-1">
                    <PiiDonut stats={stats} />
                  </div>
                  <div className="lg:col-span-1">
                    <ConnectorsRanking stats={stats} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TopPiiBar stats={stats} />
                  <ScanFeed stats={stats} />
                </div>

                <ActivityHeatmap stats={stats} />
              </div>
            )}
          </div>
        </main>
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
                {/* Account Mode Selector — same pattern as Register tab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Account Type</label>
                  <div className="flex rounded-xl overflow-hidden border border-white/10">
                    <button
                      type="button"
                      onClick={() => { setLoginAccountType('individual'); setLoginError(''); }}
                      className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                        loginAccountType === 'individual'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLoginAccountType('organization'); setLoginError(''); }}
                      className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                        loginAccountType === 'organization'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Organization
                    </button>
                  </div>
                </div>

                {/* Account Mode Mismatch / OAuth error */}
                {loginError && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {loginError}
                  </p>
                )}

                {/* Organization Name — shown when Organization mode selected (needed for new Google OAuth org registrations) */}
                {loginAccountType === 'organization' && (
                  <div>
                    <label
                      htmlFor="login-org-name"
                      className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider"
                    >
                      Organization Name
                    </label>
                    <input
                      id="login-org-name"
                      type="text"
                      value={loginOrgName}
                      onChange={(e) => setLoginOrgName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                )}

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

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-xs text-slate-600">or</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* Google Sign-In button — Sign-In tab */}
                <button
                  id="login-google"
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 text-white py-3 text-sm font-semibold transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
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
                {/* Account type toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Account Type</label>
                  <div className="flex rounded-xl overflow-hidden border border-white/10">
                    <button
                      type="button"
                      onClick={() => setAccountType('individual')}
                      className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                        accountType === 'individual'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('organization')}
                      className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                        accountType === 'organization'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Organization
                    </button>
                  </div>
                </div>

                {/* Organization Name — only visible when Organization selected */}
                {accountType === 'organization' && (
                  <div>
                    <label
                      htmlFor="reg-org-name"
                      className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider"
                    >
                      Organization Name
                    </label>
                    <input
                      id="reg-org-name"
                      type="text"
                      required
                      value={regOrgName}
                      onChange={(e) => setRegOrgName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                )}

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

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-xs text-slate-600">or</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* Google Sign-In button — Register tab */}
                <button
                  id="reg-google"
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 text-white py-3 text-sm font-semibold transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
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
