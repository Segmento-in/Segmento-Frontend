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

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    getProfileStats: vi.fn(),
    register: vi.fn(),
  },
}));

// register fn exposed for assertion
const mockRegister = vi.fn();

vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({
    user: null,
    isLoggedIn: false,
    login: vi.fn(),
    register: mockRegister,
    logout: vi.fn(),
    token: null,
  }),
}));

// Stub profile sub-components — not under test here
vi.mock('@/components/profile/StatsBar', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/PiiDonut', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/ConnectorsRanking', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/ActivityHeatmap', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/ScanFeed', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/RiskScore', () => ({ default: () => <div /> }));
vi.mock('@/components/profile/TopPiiBar', () => ({ default: () => <div /> }));

// ── Helpers ──────────────────────────────────────────────────────────────────

function goToRegisterTab() {
  // Use exact match to avoid hitting "Register here" link-button
  fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProfileClient — organization toggle', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockRegister.mockResolvedValue(undefined);
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
