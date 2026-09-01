import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './authContext';

// ── Mock APIClient at the module level ────────────────────────────────────────
// We mock './apiClient' so the real AuthProvider uses our spy instead of fetch.
// This lets us test authContext.register's real forwarding logic without a network.

const { mockApiRegister, mockApiLogin, mockApiLogout } = vi.hoisted(() => ({
  mockApiRegister: vi.fn(),
  mockApiLogin:    vi.fn(),
  mockApiLogout:   vi.fn(),
}));

vi.mock('./apiClient', () => ({
  APIClient: vi.fn(function () {
    return {
      register: mockApiRegister,
      login:    mockApiLogin,
      logout:   mockApiLogout,
    };
  }),
}));

// localStorage is available in jsdom — clear between tests
beforeEach(() => {
  localStorage.clear();
  mockApiRegister.mockReset();
  mockApiLogin.mockReset();
});

// ── Helper: render a child that captures the context value ────────────────────

function TestConsumer({ onMount }: { onMount: (ctx: ReturnType<typeof useAuth>) => void }) {
  const ctx = useAuth();
  React.useEffect(() => { onMount(ctx); }, []); // eslint-disable-line
  return null;
}

function renderWithProvider(onMount: (ctx: ReturnType<typeof useAuth>) => void) {
  render(
    <AuthProvider>
      <TestConsumer onMount={onMount} />
    </AuthProvider>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('authContext — register() forwarding', () => {
  it('forwards organizationName to apiClient.register when provided', async () => {
    // api.register returns a token-less response (email confirmation pending)
    mockApiRegister.mockResolvedValue({ access_token: null, user: {} });

    let capturedCtx: ReturnType<typeof useAuth> | null = null;
    renderWithProvider((ctx) => { capturedCtx = ctx; });

    await act(async () => {
      await capturedCtx!.register('Jane Doe', 'jane@acme.com', 'secret99', 'Acme Corp');
    });

    expect(mockApiRegister).toHaveBeenCalledOnce();
    expect(mockApiRegister).toHaveBeenCalledWith('Jane Doe', 'jane@acme.com', 'secret99', 'Acme Corp');
  });

  it('does NOT forward organizationName when Individual path omits it', async () => {
    mockApiRegister.mockResolvedValue({ access_token: null, user: {} });

    let capturedCtx: ReturnType<typeof useAuth> | null = null;
    renderWithProvider((ctx) => { capturedCtx = ctx; });

    await act(async () => {
      await capturedCtx!.register('Solo User', 'solo@test.com', 'pass123');
    });

    expect(mockApiRegister).toHaveBeenCalledOnce();
    // Called with exactly 3 args — organizationName is undefined (not a 4th value)
    expect(mockApiRegister).toHaveBeenCalledWith('Solo User', 'solo@test.com', 'pass123', undefined);
  });
});

describe('authContext — login() forwarding & deferred persistence', () => {
  const fakeUser = { id: 'u1', email: 'a@b.com', name: 'A', created_at: '', org_id: null, organization_name: null };

  it('forwards email + password to apiClient.login and returns { access_token, user }', async () => {
    mockApiLogin.mockResolvedValue({ access_token: 'tok-abc', user: fakeUser });

    let capturedCtx: ReturnType<typeof useAuth> | null = null;
    renderWithProvider((ctx) => { capturedCtx = ctx; });

    // Infer from the context type directly — avoids nullable capturedCtx and org_id narrowing
    let result: Awaited<ReturnType<ReturnType<typeof useAuth>['login']>> | undefined;
    await act(async () => {
      result = await capturedCtx!.login('a@b.com', 'password');
    });

    // Forwarding: apiClient.login called with exact args
    expect(mockApiLogin).toHaveBeenCalledOnce();
    expect(mockApiLogin).toHaveBeenCalledWith('a@b.com', 'password');

    // Return shape: caller gets the token + user back
    expect(result).toEqual({ access_token: 'tok-abc', user: fakeUser });
  });

  it('does NOT write to localStorage — persistence deferred to caller', async () => {
    mockApiLogin.mockResolvedValue({ access_token: 'tok-abc', user: fakeUser });

    let capturedCtx: ReturnType<typeof useAuth> | null = null;
    renderWithProvider((ctx) => { capturedCtx = ctx; });

    await act(async () => {
      await capturedCtx!.login('a@b.com', 'password');
    });

    // authContext.login must NOT persist — ProfileClient decides after mismatch check
    expect(localStorage.getItem('sense_access_token')).toBeNull();
    expect(localStorage.getItem('sense_auth_user')).toBeNull();
  });
});

