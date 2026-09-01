'use client';

/**
 * app/auth/callback/page.tsx
 *
 * Handles the Supabase PKCE OAuth redirect.
 * Why page.tsx (not route.ts):
 *   - Needs useAuth() context for commitSession()
 *   - Needs to render UI error states
 *   - Route handlers run on the server and cannot access browser localStorage or React context
 *
 * Build requirement: useSearchParams() must be inside a <Suspense> boundary
 * (Next.js App Router rule — search params are unavailable during SSR/static generation).
 * Pattern: inner component holds all logic + useSearchParams; outer export wraps in Suspense.
 *
 * Flow:
 *   1. Exchange PKCE ?code= param for a Supabase session
 *   2. Read + consume the stashed intent from localStorage
 *   3. Call backend POST /api/auth/oauth/sync via apiClient.oauthSync()
 *   4. On 200: commitSession(), push to /profile
 *   5. On any error: show message, clear intent, redirect to /profile
 */

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabaseClient';
import { apiClient } from '@/lib/apiClient';

const INTENT_KEY = 'sense_oauth_intent';

// ── Shared loading spinner — used by both Suspense fallback and inner loading state ──
function Spinner() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-400">Completing sign-in…</p>
      </div>
    </div>
  );
}

// ── Inner component — contains useSearchParams() + all async logic ────────────
// Must live inside <Suspense> to satisfy Next.js App Router's static-generation rules.
function AuthCallbackInner() {
  const { commitSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code') ?? '';

      // ── Step 1: Exchange PKCE code for Supabase session ───────────────────────
      // exchangeCodeForSession(authCode: string) — takes the raw code string,
      // not the full URL. Returns { data: { session }, error }.
      let accessToken: string;
      try {
        const { data, error: exchError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchError || !data.session) {
          throw exchError ?? new Error('No session returned from code exchange');
        }
        accessToken = data.session.access_token;
      } catch {
        localStorage.removeItem(INTENT_KEY);
        setError('Google sign-in failed, please try again.');
        setTimeout(() => router.push('/profile'), 0);
        return;
      }

      // ── Step 2: Read + consume intent (single-use) ────────────────────────────
      let intent: { mode: string; organization_name?: string } = { mode: 'individual' };
      try {
        const raw = localStorage.getItem(INTENT_KEY);
        if (raw) intent = JSON.parse(raw);
      } catch {
        // Malformed intent — fall back to individual mode
      }
      localStorage.removeItem(INTENT_KEY);

      // ── Step 3 + 4: Sync with backend, commit session ─────────────────────────
      try {
        const user = await apiClient.oauthSync(
          accessToken,
          intent.mode,
          intent.organization_name,
        );
        commitSession(accessToken, user);
        router.push('/profile');
      } catch (err: any) {
        // 409 Account Mode Mismatch, 422 missing org name, 500, network errors
        const msg: string = err?.message ?? 'Sign-in failed. Please try again.';
        setError(msg);
        setTimeout(() => router.push('/profile'), 0);
      }
    }

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!error) {
    return <Spinner />;
  }

  // ── Error state ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-3"
          data-testid="callback-error"
        >
          {error}
        </p>
        <p className="text-xs text-slate-500">Redirecting back to sign-in…</p>
      </div>
    </div>
  );
}

// ── Default export — wraps inner component in Suspense ────────────────────────
// Required by Next.js: components calling useSearchParams() need a Suspense boundary
// so the build can statically render the fallback shell.
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthCallbackInner />
    </Suspense>
  );
}
