'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { apiClient, ProfileStatsResponse } from '@/lib/apiClient';
import StatsBar from '@/components/profile/StatsBar';
import PiiDonut from '@/components/profile/PiiDonut';
import ConnectorsRanking from '@/components/profile/ConnectorsRanking';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import ScanFeed from '@/components/profile/ScanFeed';
import RiskScore from '@/components/profile/RiskScore';
import TopPiiBar from '@/components/profile/TopPiiBar';
import AdminPanel from '@/components/profile/AdminPanel';
import AuthCard from '@/components/auth/AuthCard';

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
  const { user, isLoggedIn, logout, token } = useAuth();

  const [stats, setStats] = useState<ProfileStatsResponse | null>(null);
  const [credits, setCredits] = useState<{ remaining: number; total: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Organization Role Gating (positive capability pattern: fail-closed for non-admin org roles)
  const canViewStats = !user?.role || user.role === 'admin';

  useEffect(() => {
    if (isLoggedIn && token) {
      setStatsLoading(true);
      if (canViewStats) {
        apiClient.getProfileStats(token)
          .then(data => {
            setStats(data);
            setCredits({ remaining: data.remaining_credits, total: data.total_credits });
          })
          .catch(err => {
            console.error('Failed to load profile stats:', err);
            if (err.message && err.message.toLowerCase().includes('token')) {
              fireToast('Session Expired', 'error', 'Please log in again.');
              logout();
            }
          })
          .finally(() => setStatsLoading(false));
      } else {
        apiClient.getCredits(token)
          .then(data => {
            setCredits({ remaining: data.credits_remaining, total: data.weekly_allowance });
          })
          .catch(err => {
            console.error('Failed to load credits:', err);
            if (err.message && err.message.toLowerCase().includes('token')) {
              fireToast('Session Expired', 'error', 'Please log in again.');
              logout();
            }
          })
          .finally(() => setStatsLoading(false));
      }
    }
  }, [isLoggedIn, token, logout, canViewStats]);

  // Logout state
  const [logoutLoading, setLogoutLoading] = useState(false);

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
                    {credits?.remaining ?? stats?.remaining_credits ?? '—'} <span className="text-slate-500 font-medium">/ {credits?.total ?? stats?.total_credits ?? 100}</span>
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
                    {statsLoading ? '…' : `${credits?.remaining ?? stats?.remaining_credits ?? '—'} / ${credits?.total ?? stats?.total_credits ?? 100} credits`}
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

            {canViewStats && (
              <>
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
              </>
            )}

            {user.role === 'admin' && token && (
              <AdminPanel token={token} currentUser={user} />
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Login / Register card ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <AuthCard />
      </div>
    </div>
  );
}
