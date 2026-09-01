'use client';

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mock supabaseClient using vi.hoisted() ────────────────────────────────────
// Mirrors the exact pattern from authContext.test.tsx.

const { mockExchangeCode } = vi.hoisted(() => ({
  mockExchangeCode: vi.fn(),
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: { exchangeCodeForSession: mockExchangeCode },
  },
}));

// ── Mock apiClient ────────────────────────────────────────────────────────────
const { mockOauthSync } = vi.hoisted(() => ({
  mockOauthSync: vi.fn(),
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: { oauthSync: mockOauthSync },
}));

// ── Mock authContext ──────────────────────────────────────────────────────────
const mockCommitSession = vi.fn();
const mockRouterPush    = vi.fn();

vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ commitSession: mockCommitSession }),
}));

vi.mock('next/navigation', () => ({
  useRouter:       () => ({ push: mockRouterPush }),
  useSearchParams: () => ({ get: (key: string) => key === 'code' ? 'test-pkce-code' : null }),
}));

// ── Import subject under test ─────────────────────────────────────────────────
import AuthCallbackPage from './page';

// ── Constants ─────────────────────────────────────────────────────────────────
const INTENT_KEY = 'sense_oauth_intent';
const fakeUser   = { id: 'u1', email: 'g@google.com', name: 'G', created_at: '', org_id: null, organization_name: null };

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockExchangeCode.mockReset();
  mockOauthSync.mockReset();
  mockCommitSession.mockReset();
  mockRouterPush.mockReset();
  localStorage.clear();
});

describe('AuthCallbackPage', () => {

  // ── Test 1: happy path ────────────────────────────────────────────────────
  it('successful exchange + successful backend sync → commitSession called with correct shape', async () => {
    mockExchangeCode.mockResolvedValue({
      data: { session: { access_token: 'access-tok-123' } },
      error: null,
    });
    mockOauthSync.mockResolvedValue(fakeUser);

    // Stash an intent as the Google button would have
    localStorage.setItem(INTENT_KEY, JSON.stringify({ mode: 'individual' }));

    render(<AuthCallbackPage />);

    // Wait for commitSession to be called (async effect completes)
    await waitFor(() => expect(mockCommitSession).toHaveBeenCalledTimes(1));

    // Verify commitSession called with correct shape: (accessToken, user)
    expect(mockCommitSession).toHaveBeenCalledWith('access-tok-123', fakeUser);
    // oauthSync called with the right args
    expect(mockOauthSync).toHaveBeenCalledWith('access-tok-123', 'individual', undefined);
    // intent cleared from localStorage
    expect(localStorage.getItem(INTENT_KEY)).toBeNull();
    // navigated to /profile
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/profile'));
  });

  // ── Test 2: backend 409 ───────────────────────────────────────────────────
  it('successful exchange + backend returns 409 → commitSession NOT called, error shown, intent cleared', async () => {
    mockExchangeCode.mockResolvedValue({
      data: { session: { access_token: 'access-tok-xyz' } },
      error: null,
    });
    // Simulate backend throwing 409 Account Mode Mismatch
    mockOauthSync.mockRejectedValue(
      new Error('Account mode mismatch: this account is an organization account.'),
    );

    localStorage.setItem(INTENT_KEY, JSON.stringify({ mode: 'individual' }));

    render(<AuthCallbackPage />);

    // Wait for the error element to appear (async effect completes with error)
    await waitFor(() =>
      expect(screen.getByTestId('callback-error')).toBeInTheDocument()
    );

    // commitSession must NOT be called
    expect(mockCommitSession).not.toHaveBeenCalled();
    // Error message rendered
    expect(screen.getByTestId('callback-error').textContent).toMatch(/account mode mismatch/i);
    // Intent cleared
    expect(localStorage.getItem(INTENT_KEY)).toBeNull();
    // Redirect fires (0ms setTimeout — fires on next tick after error state)
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/profile'));
  });

  // ── Test 3: exchange fails ─────────────────────────────────────────────────
  it('exchangeCodeForSession fails → generic error shown, no crash, commitSession NOT called', async () => {
    mockExchangeCode.mockResolvedValue({
      data: { session: null },
      error: new Error('invalid_grant'),
    });

    localStorage.setItem(INTENT_KEY, JSON.stringify({ mode: 'individual' }));

    render(<AuthCallbackPage />);

    // Wait for error element
    await waitFor(() =>
      expect(screen.getByTestId('callback-error')).toBeInTheDocument()
    );

    // Generic error message
    expect(screen.getByTestId('callback-error').textContent).toMatch(/google sign-in failed/i);
    // oauthSync never reached
    expect(mockOauthSync).not.toHaveBeenCalled();
    // commitSession never reached
    expect(mockCommitSession).not.toHaveBeenCalled();
    // Intent cleared even on exchange failure
    expect(localStorage.getItem(INTENT_KEY)).toBeNull();
    // Redirect fires
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/profile'));
  });
});
