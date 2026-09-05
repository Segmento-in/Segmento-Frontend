'use client';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileClient from './ProfileClient';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn(() => null) }),
}));

const { mockUseAuth, mockGetProfileStats, mockGetCredits } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockGetProfileStats: vi.fn(),
  mockGetCredits: vi.fn(),
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    getProfileStats: mockGetProfileStats,
    getCredits: mockGetCredits,
    register: vi.fn(),
  },
}));

// register + login + commitSession fns exposed for per-test assertion
const mockRegister      = vi.fn();
const mockLogin         = vi.fn();
const mockCommitSession = vi.fn();

vi.mock('@/lib/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Stub profile sub-components — not under test here
vi.mock('@/components/profile/StatsBar', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/PiiDonut', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/ConnectorsRanking', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/ActivityHeatmap', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/ScanFeed', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/RiskScore', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/TopPiiBar', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/AdminPanel', () => ({ default: () => <div data-testid="admin-panel">Admin Panel</div> }));

// ── Helpers ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockUseAuth.mockReturnValue({
    user: null,
    isLoggedIn: false,
    login: mockLogin,
    commitSession: mockCommitSession,
    register: mockRegister,
    logout: vi.fn(),
    token: null,
  });
});

function goToRegisterTab() {
  // Use exact match to avoid hitting "Register here" link-button
  fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProfileClient — organization toggle', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockRegister.mockResolvedValue(undefined);
    mockLogin.mockReset();
    mockCommitSession.mockReset();
    // Default: Individual account (no org_id)
    mockLogin.mockResolvedValue({
      access_token: 'tok',
      user: { id: 'u1', email: 'a@b.com', name: 'A', created_at: '', org_id: null, organization_name: null },
    });
  });

  // ── Test 1 ───────────────────────────────────────────────────────────────────
  it('renders register tab with Individual selected by default, org name field hidden', () => {
    render(<ProfileClient />);
    goToRegisterTab();

    // "Individual" option must be present and active (aria-pressed or just visible)
    expect(screen.getByRole('button', { name: /individual/i })).toBeInTheDocument();
    // Organization Name field must NOT be visible
    expect(screen.queryByLabelText(/organization name/i)).not.toBeInTheDocument();
  });

  // ── Test 2 ───────────────────────────────────────────────────────────────────
  it('reveals Organization Name field when Organization toggle is selected', () => {
    render(<ProfileClient />);
    goToRegisterTab();

    fireEvent.click(screen.getByRole('button', { name: /^organization$/i }));

    expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
  });

  // ── Test 3 ───────────────────────────────────────────────────────────────────
  it('calls register with organizationName when Organization is selected and name is typed', async () => {
    render(<ProfileClient />);
    goToRegisterTab();

    // Switch to Organization mode
    fireEvent.click(screen.getByRole('button', { name: /^organization$/i }));

    // Fill in all required fields
    fireEvent.change(screen.getByPlaceholderText(/jane doe/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: 'jane@acme.com' } });
    fireEvent.change(screen.getByPlaceholderText(/min\. 6 characters/i), { target: { value: 'secret99' } });
    fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: 'secret99' } });
    fireEvent.change(screen.getByLabelText(/organization name/i), { target: { value: 'Acme Corp' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Jane Doe', 'jane@acme.com', 'secret99', 'Acme Corp');
    });
  });

  // ── Test 4 ───────────────────────────────────────────────────────────────────
  it('calls register with exactly (name, email, password) — no org arg — when Individual is selected', async () => {
    render(<ProfileClient />);
    goToRegisterTab();

    // Individual is already selected by default — do NOT click Organization
    fireEvent.change(screen.getByPlaceholderText(/jane doe/i), { target: { value: 'Solo User' } });
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: 'solo@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/min\. 6 characters/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByPlaceholderText(/repeat password/i), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockRegister).toHaveBeenCalledWith('Solo User', 'solo@test.com', 'pass123');
    });
  });
});

// ── Helpers (Sign-In tab) ─────────────────────────────────────────────────────

function fillAndSubmitLogin() {
  fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'secret99' } });
  // Use id to avoid collision with the "Sign In" tab button
  fireEvent.click(document.getElementById('login-submit')!);
}

// ── Tests — Sign-In Account Mode Selector ────────────────────────────────────

describe('ProfileClient — Sign-In Account Mode Selector', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockCommitSession.mockReset();
    // Default login response: Individual account (org_id null)
    mockLogin.mockResolvedValue({
      access_token: 'tok',
      user: { id: 'u1', email: 'a@b.com', name: 'A', created_at: '', org_id: null, organization_name: null },
    });
  });

  // ── Test 5 ───────────────────────────────────────────────────────────────────
  it('Sign-In tab renders Account Mode Selector with Individual selected by default', () => {
    render(<ProfileClient />);
    // Sign-In tab is the default — no click needed
    expect(screen.getByRole('button', { name: /^individual$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^organization$/i })).toBeInTheDocument();
  });

  // ── Test 6 ───────────────────────────────────────────────────────────────────
  it('matching mode (Individual selected + login returns org_id null) → session persisted, no error', async () => {
    render(<ProfileClient />);
    // mockLogin already returns org_id: null (Individual) — toggle stays on Individual
    fillAndSubmitLogin();
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));
    // No mismatch error rendered
    expect(screen.queryByText(/individual.*organization|organization.*individual|account.*mismatch|wrong.*account/i)).not.toBeInTheDocument();
  });

  // ── Test 7 ───────────────────────────────────────────────────────────────────
  it('mismatch: Individual selected but login returns an org_id → error shown, session NOT set', async () => {
    // Override: login returns an Organization account
    mockLogin.mockResolvedValue({
      access_token: 'tok',
      user: { id: 'u2', email: 'a@b.com', name: 'A', created_at: '', org_id: 'org-123', organization_name: 'Acme' },
    });
    render(<ProfileClient />);
    // Leave toggle on Individual (default)
    fillAndSubmitLogin();
    await waitFor(() =>
      expect(screen.getByText(/individual.*organization|organization.*individual|this account is.*organization|wrong.*account|account.*mismatch/i)).toBeInTheDocument()
    );
    // localStorage must NOT contain a token
    expect(localStorage.getItem('sense_access_token')).toBeNull();
  });

  // ── Test 8 ───────────────────────────────────────────────────────────────────
  it('mismatch: Organization selected but login returns org_id null → error shown, session NOT set', async () => {
    // login returns Individual account (org_id null) — default mock
    render(<ProfileClient />);
    // Switch toggle to Organization
    fireEvent.click(screen.getByRole('button', { name: /^organization$/i }));
    fillAndSubmitLogin();
    await waitFor(() =>
      expect(screen.getByText(/individual.*organization|organization.*individual|this account is.*individual|wrong.*account|account.*mismatch/i)).toBeInTheDocument()
    );
    // localStorage must NOT contain a token
    expect(localStorage.getItem('sense_access_token')).toBeNull();
  });
});

// ── Google Sign-In Button Tests ───────────────────────────────────────────────
// Mock supabaseClient at the module level using vi.hoisted() so the spy
// is captured before any imports hoist the module.

const { mockSignInWithOAuth } = vi.hoisted(() => ({
  mockSignInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: { signInWithOAuth: mockSignInWithOAuth },
  },
}));

describe('ProfileClient — Google Sign-In button', () => {
  beforeEach(() => {
    mockSignInWithOAuth.mockReset();
    mockSignInWithOAuth.mockResolvedValue({ data: {}, error: null });
    localStorage.clear();
  });

  // ── Test 9 ───────────────────────────────────────────────────────────────────
  it('Register tab: Organization mode + empty org name → Google button does NOT call signInWithOAuth', async () => {
    render(<ProfileClient />);
    // Go to Register tab
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
    // Switch to Organization mode
    fireEvent.click(screen.getByRole('button', { name: /^organization$/i }));
    // Leave org name empty — click Google button
    fireEvent.click(document.getElementById('reg-google')!);

    // signInWithOAuth must NOT be called
    expect(mockSignInWithOAuth).not.toHaveBeenCalled();
    // An error message must appear
    expect(screen.getByText(/organization name is required/i)).toBeInTheDocument();
  });

  // ── Test 10 ──────────────────────────────────────────────────────────────────
  it('Register tab: Individual mode → clicking Google writes correct intent to localStorage and calls signInWithOAuth', async () => {
    render(<ProfileClient />);
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
    // Individual is already selected — click Google directly
    fireEvent.click(document.getElementById('reg-google')!);

    await waitFor(() => expect(mockSignInWithOAuth).toHaveBeenCalledTimes(1));

    // Verify intent written before the OAuth call
    const raw = localStorage.getItem('sense_oauth_intent');
    expect(raw).not.toBeNull();
    const intent = JSON.parse(raw!);
    expect(intent.mode).toBe('individual');

    // Verify signInWithOAuth called with correct args
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: expect.objectContaining({ redirectTo: expect.stringContaining('/auth/callback') }),
    });
  });
});

// ── Admin Panel Role Gating Tests ───────────────────────────────────────────

describe('ProfileClient — Admin Panel role gating', () => {
  beforeEach(() => {
    mockGetProfileStats.mockReset();
    mockGetCredits.mockReset();
    mockGetCredits.mockResolvedValue({
      credits_remaining: 100,
      credits_used: 0,
      last_restored_at: null,
      weekly_allowance: 100,
    });
    mockGetProfileStats.mockResolvedValue({
      total_scans: 0,
      total_files_scanned: 0,
      pii_fields_found: 0,
      needs_review_pending: 0,
      classification_breakdown: { sensitive: 0, non_sensitive: 0, needs_review: 0 },
      risk_score: 0,
      top_connectors: [],
      recent_scans: [],
      heatmap_data: [],
      top_pii_categories: [],
    });
  });

  it('renders Admin Panel when user role is admin', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'u-admin',
        name: 'Admin User',
        email: 'admin@acme.com',
        created_at: '2026-09-01T00:00:00Z',
        org_id: 'org-123',
        organization_name: 'Acme Corp',
        role: 'admin',
      },
      isLoggedIn: true,
      token: 'admin-tok',
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: vi.fn(),
    });

    render(<ProfileClient />);
    expect(await screen.findByTestId('admin-panel')).toBeInTheDocument();
    await waitFor(() => expect(mockGetProfileStats).toHaveBeenCalledWith('admin-tok'));
  });

  it('does NOT render Admin Panel when user role is support', async () => {
    mockGetCredits.mockResolvedValue({
      credits_remaining: 100,
      credits_used: 0,
      last_restored_at: null,
      weekly_allowance: 100,
    });

    mockUseAuth.mockReturnValue({
      user: {
        id: 'u-support',
        name: 'Support User',
        email: 'support@acme.com',
        created_at: '2026-09-01T00:00:00Z',
        org_id: 'org-123',
        organization_name: 'Acme Corp',
        role: 'support',
      },
      isLoggedIn: true,
      token: 'support-tok',
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: vi.fn(),
    });

    render(<ProfileClient />);
    await waitFor(() => expect(mockGetCredits).toHaveBeenCalledWith('support-tok'));
    expect(mockGetProfileStats).not.toHaveBeenCalled();
    expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
  });

  it('does NOT render Admin Panel when user role is null (Individual account)', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'u-solo',
        name: 'Solo User',
        email: 'solo@example.com',
        created_at: '2026-09-01T00:00:00Z',
        org_id: null,
        organization_name: null,
        role: null,
      },
      isLoggedIn: true,
      token: 'solo-tok',
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: vi.fn(),
    });

    render(<ProfileClient />);
    await waitFor(() => expect(mockGetProfileStats).toHaveBeenCalledWith('solo-tok'));
    expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
  });
});

// ── Surface 4: Profile Stats Dashboard Role Gating Tests ─────────────────────

describe('ProfileClient — Surface 4: Profile Stats Dashboard role gating', () => {
  beforeEach(() => {
    mockGetProfileStats.mockReset();
    mockGetCredits.mockReset();
    mockGetProfileStats.mockResolvedValue({
      total_credits: 100,
      used_credits: 10,
      remaining_credits: 90,
      total_scans: 5,
      total_files_scanned: 12,
      pii_fields_found: 3,
      needs_review_pending: 0,
      classification_breakdown: { sensitive: 1, non_sensitive: 2, needs_review: 0 },
      risk_score: 15,
      top_connectors: [],
      recent_scans: [],
      heatmap_data: [],
      top_pii_categories: [],
    });
    mockGetCredits.mockResolvedValue({
      credits_remaining: 42,
      credits_used: 58,
      last_restored_at: null,
      weekly_allowance: 100,
    });
  });

  it('hides Security Dashboard and calls getCredits (not getProfileStats) for support role', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'u-support',
        name: 'Support User',
        email: 'support@acme.com',
        created_at: '2026-09-01T00:00:00Z',
        org_id: 'org-123',
        organization_name: 'Acme Corp',
        role: 'support',
      },
      isLoggedIn: true,
      token: 'support-tok',
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: vi.fn(),
    });

    render(<ProfileClient />);
    
    // getCredits should be called for support, NOT getProfileStats
    await waitFor(() => expect(mockGetCredits).toHaveBeenCalledWith('support-tok'));
    expect(mockGetProfileStats).not.toHaveBeenCalled();

    // Security Dashboard header & stats should NOT be rendered
    expect(screen.queryByText('Security Dashboard')).not.toBeInTheDocument();

    // Credit balance is still displayed from getCredits response (desktop sidebar and mobile header)
    expect(screen.getAllByText(/42/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows Security Dashboard and calls getProfileStats for admin role', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'u-admin',
        name: 'Admin User',
        email: 'admin@acme.com',
        created_at: '2026-09-01T00:00:00Z',
        org_id: 'org-123',
        organization_name: 'Acme Corp',
        role: 'admin',
      },
      isLoggedIn: true,
      token: 'admin-tok',
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: vi.fn(),
    });

    render(<ProfileClient />);
    
    // getProfileStats should be called for admin, NOT getCredits
    await waitFor(() => expect(mockGetProfileStats).toHaveBeenCalledWith('admin-tok'));
    expect(mockGetCredits).not.toHaveBeenCalled();

    // Security Dashboard should be rendered
    expect(await screen.findByText('Security Dashboard')).toBeInTheDocument();

    // Credit balance is displayed from getProfileStats response (90 / 100)
    expect((await screen.findAllByText(/90/)).length).toBeGreaterThanOrEqual(1);
  });

  it('shows Security Dashboard and calls getProfileStats for null role (Individual account)', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'u-solo',
        name: 'Solo User',
        email: 'solo@example.com',
        created_at: '2026-09-01T00:00:00Z',
        org_id: null,
        organization_name: null,
        role: null,
      },
      isLoggedIn: true,
      token: 'solo-tok',
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: vi.fn(),
    });

    render(<ProfileClient />);
    
    // getProfileStats should be called for null role (Individual), NOT getCredits
    await waitFor(() => expect(mockGetProfileStats).toHaveBeenCalledWith('solo-tok'));
    expect(mockGetCredits).not.toHaveBeenCalled();

    // Security Dashboard should be rendered
    expect(await screen.findByText('Security Dashboard')).toBeInTheDocument();

    // Credit balance is displayed from getProfileStats response (90 / 100)
    expect((await screen.findAllByText(/90/)).length).toBeGreaterThanOrEqual(1);
  });
});

