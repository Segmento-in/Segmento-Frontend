import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPanel from './AdminPanel';
import { apiClient } from '@/lib/apiClient';
import { AuthUser } from '@/lib/auth';

// ── Mock apiClient ──────────────────────────────────────────────────────────
vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    listMembers: vi.fn(),
    listInvites: vi.fn(),
    generateInvite: vi.fn(),
    revokeInvite: vi.fn(),
    removeMember: vi.fn(),
  },
}));

const mockCurrentUser: AuthUser = {
  id: 'u-admin-1',
  name: 'Admin Boss',
  email: 'boss@acme.com',
  created_at: '2026-09-01T00:00:00Z',
  org_id: 'org-123',
  organization_name: 'Acme Corp',
  role: 'admin',
};

const mockMembersList = [
  {
    user_id: 'u-admin-1',
    email: 'boss@acme.com',
    name: 'Admin Boss',
    role: 'admin',
    joined_at: '2026-09-01T00:00:00Z',
  },
  {
    user_id: 'u-support-1',
    email: 'support1@acme.com',
    name: 'Support Colleague',
    role: 'support',
    joined_at: '2026-09-02T10:00:00Z',
  },
];

const mockInvitesList = [
  {
    id: 'inv-pending',
    invited_email: 'pending@acme.com',
    role: 'support',
    token: 'tok-p',
    invite_url: '/join/tok-p',
    status: 'pending' as const,
    created_at: '2026-09-03T12:00:00Z',
    expires_at: '2026-09-10T12:00:00Z',
  },
  {
    id: 'inv-used',
    invited_email: 'used@acme.com',
    role: 'support',
    token: 'tok-u',
    invite_url: '/join/tok-u',
    status: 'used' as const,
    created_at: '2026-09-01T12:00:00Z',
    expires_at: '2026-09-08T12:00:00Z',
  },
  {
    id: 'inv-expired',
    invited_email: 'expired@acme.com',
    role: 'support',
    token: 'tok-e',
    invite_url: '/join/tok-e',
    status: 'expired' as const,
    created_at: '2026-08-01T12:00:00Z',
    expires_at: '2026-08-08T12:00:00Z',
  },
  {
    id: 'inv-revoked',
    invited_email: 'revoked@acme.com',
    role: 'support',
    token: 'tok-r',
    invite_url: '/join/tok-r',
    status: 'revoked' as const,
    created_at: '2026-09-02T12:00:00Z',
    expires_at: '2026-09-09T12:00:00Z',
  },
];

describe('AdminPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.listMembers as any).mockResolvedValue(mockMembersList);
    (apiClient.listInvites as any).mockResolvedValue(mockInvitesList);
    (apiClient.generateInvite as any).mockResolvedValue({
      invite_id: 'inv-new',
      token: 'tok-new',
      invite_url: '/join/tok-new',
      expires_at: '2026-09-12T00:00:00Z',
    });
    (apiClient.revokeInvite as any).mockResolvedValue({ success: true });
    (apiClient.removeMember as any).mockResolvedValue({ success: true });
  });

  // ── Test 2 (from prompt) ───────────────────────────────────────────────────
  it('generating an invite calls apiClient.generateInvite with entered email and displays returned URL', async () => {
    render(<AdminPanel token="admin-token-xyz" currentUser={mockCurrentUser} />);

    // Wait for initial load
    await waitFor(() => expect(apiClient.listMembers).toHaveBeenCalledTimes(1));

    const emailInput = screen.getByPlaceholderText(/colleague@company\.com/i);
    const generateBtn = screen.getByRole('button', { name: /generate invite/i });

    fireEvent.change(emailInput, { target: { value: 'newhire@acme.com' } });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(apiClient.generateInvite).toHaveBeenCalledWith('newhire@acme.com', 'admin-token-xyz');
    });

    // Returned URL must be displayed in a copyable element
    await waitFor(() => {
      const urlInput = screen.getByTestId('generated-invite-url') as HTMLInputElement;
      expect(urlInput).toBeInTheDocument();
      expect(urlInput.value).toContain('/join/tok-new');
    });
  });

  // ── Test 3 (from prompt) ───────────────────────────────────────────────────
  it('renders each invite status correctly (pending, used, expired, revoked)', async () => {
    render(<AdminPanel token="admin-token-xyz" currentUser={mockCurrentUser} />);

    await waitFor(() => expect(apiClient.listInvites).toHaveBeenCalledTimes(1));

    expect(screen.getByTestId('status-badge-inv-pending')).toHaveTextContent(/pending/i);
    expect(screen.getByTestId('status-badge-inv-used')).toHaveTextContent(/used/i);
    expect(screen.getByTestId('status-badge-inv-expired')).toHaveTextContent(/expired/i);
    expect(screen.getByTestId('status-badge-inv-revoked')).toHaveTextContent(/revoked/i);
  });

  // ── Test 4 (from prompt) ───────────────────────────────────────────────────
  it('clicking Revoke on a pending invite calls apiClient.revokeInvite with correct ID', async () => {
    render(<AdminPanel token="admin-token-xyz" currentUser={mockCurrentUser} />);

    await waitFor(() => expect(apiClient.listInvites).toHaveBeenCalledTimes(1));

    const pendingRow = screen.getByTestId('invite-row-inv-pending');
    const revokeBtn = pendingRow.querySelector('button[title*="Revoke"]') || screen.getByRole('button', { name: /revoke/i });

    expect(revokeBtn).toBeInTheDocument();
    fireEvent.click(revokeBtn);

    await waitFor(() => {
      expect(apiClient.revokeInvite).toHaveBeenCalledWith('inv-pending', 'admin-token-xyz');
    });

    // Non-pending rows must NOT have a revoke button
    const usedRow = screen.getByTestId('invite-row-inv-used');
    expect(usedRow.querySelector('button[title*="Revoke"]')).not.toBeInTheDocument();

    const expiredRow = screen.getByTestId('invite-row-inv-expired');
    expect(expiredRow.querySelector('button[title*="Revoke"]')).not.toBeInTheDocument();

    const revokedRow = screen.getByTestId('invite-row-inv-revoked');
    expect(revokedRow.querySelector('button[title*="Revoke"]')).not.toBeInTheDocument();
  });

  // ── Test 5 (from prompt) ───────────────────────────────────────────────────
  it('clicking Remove on Support row calls apiClient.removeMember; Admin row has no Remove button', async () => {
    render(<AdminPanel token="admin-token-xyz" currentUser={mockCurrentUser} />);

    await waitFor(() => expect(apiClient.listMembers).toHaveBeenCalledTimes(1));

    // Support member row
    const supportRow = screen.getByTestId('member-row-u-support-1');
    const removeBtn = supportRow.querySelector('button')!;
    expect(removeBtn).toHaveTextContent(/remove/i);

    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(apiClient.removeMember).toHaveBeenCalledWith('u-support-1', 'admin-token-xyz');
    });

    // Admin own row
    const adminRow = screen.getByTestId('member-row-u-admin-1');
    expect(adminRow.querySelector('button')).not.toBeInTheDocument();
    expect(adminRow).toHaveTextContent(/\(owner\)/i);
  });
});
