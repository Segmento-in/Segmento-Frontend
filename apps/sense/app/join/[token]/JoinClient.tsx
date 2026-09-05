'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { apiClient, InvitePreviewResponse } from '@/lib/apiClient';
import AuthCard from '@/components/auth/AuthCard';

interface JoinClientProps {
  token?: string;
}

export default function JoinClient({ token: propToken }: JoinClientProps) {
  const router = useRouter();
  const params = useParams();
  const effectiveToken = propToken || (params?.token as string);

  const { user, token: authToken, isLoggedIn, commitSession } = useAuth();

  const [invite, setInvite] = useState<InvitePreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!effectiveToken) {
      setError('No invite token provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    apiClient.previewInvite(effectiveToken)
      .then((data) => {
        if (mounted) {
          setInvite(data);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (mounted) {
          setError(err?.message || 'Invalid or expired invite link.');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [effectiveToken]);

  async function handleAccept() {
    if (!authToken) return;
    setAccepting(true);
    setAcceptError(null);

    try {
      const updatedUser = await apiClient.acceptInvite(effectiveToken, authToken);
      commitSession(authToken, updatedUser);
      router.push('/profile');
    } catch (err: any) {
      // Do NOT clear or destroy the visitor's existing session
      setAcceptError(err?.message || 'Failed to accept invite.');
    } finally {
      setAccepting(false);
    }
  }

  // ── State 1: Loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Verifying invite link…</p>
        </div>
      </div>
    );
  }

  // ── State 2: Invalid / Expired / Revoked / Error ───────────────────────────────
  if (error || !invite) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">Invite Unavailable</h1>
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
            {error || 'This invite link is invalid, expired, or has already been used.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── State 3: Valid invite — Logged In visitor ──────────────────────────────────
  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Segmento Sense</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Organization Invite</h1>
            <p className="text-slate-400 text-sm mt-2">
              You're invited to join <span className="text-white font-bold">{invite.organization_name}</span> as{' '}
              <span className="text-blue-400 font-bold uppercase">{invite.role}</span>
            </p>
          </div>

          {/* Card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 p-8 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

            <div className="text-center mb-6">
              <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Currently signed in as</p>
              <p className="text-sm font-bold text-white bg-white/[0.04] border border-white/10 rounded-xl py-2.5 px-4">
                {user.email}
              </p>
            </div>

            {acceptError && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {acceptError}
              </div>
            )}

            <button
              id="accept-invite-submit"
              onClick={handleAccept}
              disabled={accepting}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 text-sm font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
            >
              {accepting ? 'Accepting Invite…' : 'Accept Invite'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── State 4: Valid invite — Logged Out visitor (reused AuthCard) ───────────────
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <AuthCard
          heading="Join Organization"
          subheading={`You're invited to join ${invite.organization_name} as ${invite.role}`}
          lockedInviteContext={true}
        />
      </div>
    </div>
  );
}
