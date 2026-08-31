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
