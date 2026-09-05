'use client';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JoinClient from './JoinClient';

const { mockUseAuth, mockPreviewInvite, mockAcceptInvite, mockPush } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockPreviewInvite: vi.fn(),
  mockAcceptInvite: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: vi.fn(() => null) }),
  useParams: () => ({ token: 'valid-tok' }),
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    previewInvite: mockPreviewInvite,
    acceptInvite: mockAcceptInvite,
  },
}));

vi.mock('@/lib/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  },
}));

describe('JoinClient — /join/[token] Invite Landing', () => {
  const mockLogin = vi.fn();
  const mockCommitSession = vi.fn();
  const mockRegister = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoggedIn: false,
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: mockLogout,
    });
  });

  // ── Test 1: Loading valid token calls preview and displays org name & role ────
  it('1. loading /join/[valid-token] calls preview and displays the organization name and role correctly', async () => {
    mockPreviewInvite.mockResolvedValueOnce({
      organization_name: 'Acme Corp',
      role: 'support',
    });

    render(<JoinClient token="valid-tok" />);

    await waitFor(() => {
      expect(mockPreviewInvite).toHaveBeenCalledWith('valid-tok');
    });

    expect(await screen.findByText(/Acme Corp/i)).toBeInTheDocument();
    expect(screen.getByText(/support/i)).toBeInTheDocument();
  });

  // ── Test 2: Loading invalid or expired token shows error state, no auth form ───
  it('2. loading /join/[invalid-or-expired-token] shows error state and no auth form', async () => {
    mockPreviewInvite.mockRejectedValueOnce(new Error('Invite expired'));

    render(<JoinClient token="expired-tok" />);

    expect(await screen.findByText('Invite Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Invite expired')).toBeInTheDocument();
    expect(screen.getByText(/Return to homepage/i)).toBeInTheDocument();

    // No sign-in or register auth form rendered
    expect(screen.queryByRole('button', { name: /^Sign In$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Register$/i })).not.toBeInTheDocument();
  });

  // ── Test 3: Logged-out visitor sees the Sign In / Register form on a valid token ──
  it('3. a logged-out visitor sees the Sign In / Register form on a valid token', async () => {
    mockPreviewInvite.mockResolvedValueOnce({
      organization_name: 'Stark Industries',
      role: 'support',
    });

    render(<JoinClient token="stark-tok" />);

    expect(await screen.findByText('Join Organization')).toBeInTheDocument();
    expect(screen.getByText(/You're invited to join Stark Industries as support/i)).toBeInTheDocument();

    // Reused AuthCard form elements are present
    expect(screen.getAllByRole('button', { name: /^Sign In$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /^Register$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  // ── Test 4: Already logged-in visitor sees confirmation step instead of login form ─
  it('4. an already-logged-in visitor sees the confirmation step instead of a login form', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-1', email: 'member@acme.com', name: 'Member One' },
      token: 'valid-session-jwt',
      isLoggedIn: true,
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: mockLogout,
    });

    mockPreviewInvite.mockResolvedValueOnce({
      organization_name: 'Acme Corp',
      role: 'support',
    });

    render(<JoinClient token="valid-tok" />);

    expect(await screen.findByText('Organization Invite')).toBeInTheDocument();
    expect(screen.getByText('member@acme.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Accept Invite/i })).toBeInTheDocument();

    // Does NOT show login/register form
    expect(screen.queryByLabelText(/Password/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Sign In$/i })).not.toBeInTheDocument();
  });

  // ── Test 5: Successful accept redirects into the app with updated user session ─
  it('5. successful accept redirects into the app and commits updated user', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-1', email: 'member@acme.com', name: 'Member One' },
      token: 'valid-session-jwt',
      isLoggedIn: true,
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: mockLogout,
    });

    mockPreviewInvite.mockResolvedValueOnce({
      organization_name: 'Acme Corp',
      role: 'support',
    });

    mockAcceptInvite.mockResolvedValueOnce({
      id: 'usr-1',
      email: 'member@acme.com',
      name: 'Member One',
      created_at: '2026-09-01T00:00:00Z',
      org_id: 'org-123',
      organization_name: 'Acme Corp',
      role: 'support',
    });

    render(<JoinClient token="valid-tok" />);

    const acceptBtn = await screen.findByRole('button', { name: /Accept Invite/i });
    fireEvent.click(acceptBtn);

    await waitFor(() => {
      expect(mockAcceptInvite).toHaveBeenCalledWith('valid-tok', 'valid-session-jwt');
    });

    expect(mockCommitSession).toHaveBeenCalledWith(
      'valid-session-jwt',
      expect.objectContaining({
        id: 'usr-1',
        org_id: 'org-123',
        organization_name: 'Acme Corp',
        role: 'support',
      }),
    );

    expect(mockPush).toHaveBeenCalledWith('/profile');
  });

  // ── Test 6: Failed accept shows error and does NOT clear visitor's session ────
  it('6. a failed accept (email mismatch) shows an error and does not clear the visitor existing session', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-2', email: 'wrong@acme.com', name: 'Wrong Person' },
      token: 'valid-session-jwt',
      isLoggedIn: true,
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: mockLogout,
    });

    mockPreviewInvite.mockResolvedValueOnce({
      organization_name: 'Acme Corp',
      role: 'support',
    });

    mockAcceptInvite.mockRejectedValueOnce(
      new Error('Authenticated email does not match invited email'),
    );

    render(<JoinClient token="valid-tok" />);

    const acceptBtn = await screen.findByRole('button', { name: /Accept Invite/i });
    fireEvent.click(acceptBtn);

    expect(
      await screen.findByText('Authenticated email does not match invited email'),
    ).toBeInTheDocument();

    // Session is preserved — logout is NEVER called
    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockCommitSession).not.toHaveBeenCalled();

    // User email remains visible
    expect(screen.getByText('wrong@acme.com')).toBeInTheDocument();
  });

  // ── Test 7: Registering via AuthCard on join page hides org toggle and accepts ──
  it('7. registering via AuthCard from the join page never shows the Account Type toggle; accept still succeeds afterward', async () => {
    mockPreviewInvite.mockResolvedValue({
      organization_name: 'Acme Corp',
      role: 'support',
    });

    const { rerender } = render(<JoinClient token="valid-tok" />);

    // Wait for preview to load and render State 4 (logged out visitor)
    expect(await screen.findByText('Join Organization')).toBeInTheDocument();

    // Switch to Register tab
    const registerTab = screen.getByRole('button', { name: /^Register$/i });
    fireEvent.click(registerTab);

    // Bug 1 proof: Account Type toggle and Organization Name field are NOT rendered
    expect(screen.queryByText(/Account Type/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Organization Name/i)).not.toBeInTheDocument();

    // Fill registration form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'New Joiner' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'joiner@acme.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    // Submit registration
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Verify registration was called as a plain Individual (no organization name argument)
    expect(mockRegister).toHaveBeenCalledWith('New Joiner', 'joiner@acme.com', 'password123');

    // Simulate session created post-registration -> now logged in
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-new', email: 'joiner@acme.com', name: 'New Joiner' },
      token: 'jwt-new-session',
      isLoggedIn: true,
      login: mockLogin,
      commitSession: mockCommitSession,
      register: mockRegister,
      logout: mockLogout,
    });

    rerender(<JoinClient token="valid-tok" />);

    // Now in State 3 (confirmation step)
    expect(await screen.findByText('Organization Invite')).toBeInTheDocument();
    expect(screen.getByText('joiner@acme.com')).toBeInTheDocument();

    mockAcceptInvite.mockResolvedValueOnce({
      id: 'usr-new',
      email: 'joiner@acme.com',
      name: 'New Joiner',
      created_at: '2026-09-05T00:00:00Z',
      org_id: 'org-acme',
      organization_name: 'Acme Corp',
      role: 'support',
    });

    const acceptBtn = screen.getByRole('button', { name: /Accept Invite/i });
    fireEvent.click(acceptBtn);

    await waitFor(() => {
      expect(mockAcceptInvite).toHaveBeenCalledWith('valid-tok', 'jwt-new-session');
    });

    expect(mockCommitSession).toHaveBeenCalledWith(
      'jwt-new-session',
      expect.objectContaining({
        id: 'usr-new',
        org_id: 'org-acme',
        organization_name: 'Acme Corp',
        role: 'support',
      }),
    );
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });

  // ── Test 8: Google sign-in is disabled with note when lockedInviteContext is set ──
  it('8. Google button is confirmed disabled in join page context', async () => {
    mockPreviewInvite.mockResolvedValueOnce({
      organization_name: 'Acme Corp',
      role: 'support',
    });

    render(<JoinClient token="valid-tok" />);

    // Login tab: Google button is disabled and explanatory note is displayed
    const loginGoogleBtn = await screen.findByRole('button', { name: /Continue with Google/i });
    expect(loginGoogleBtn).toBeDisabled();
    expect(
      screen.getByText(/Google Sign-In is disabled for invite acceptance/i),
    ).toBeInTheDocument();

    // Switch to Register tab
    const registerTab = screen.getByRole('button', { name: /^Register$/i });
    fireEvent.click(registerTab);

    // Register tab: Google button is also disabled with explanatory note
    const regGoogleBtn = screen.getByRole('button', { name: /Continue with Google/i });
    expect(regGoogleBtn).toBeDisabled();
    expect(
      screen.getByText(/Google Sign-In is disabled for invite acceptance/i),
    ).toBeInTheDocument();
  });
});
