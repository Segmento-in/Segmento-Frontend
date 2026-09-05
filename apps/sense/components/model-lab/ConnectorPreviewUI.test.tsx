import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ConnectorPreviewUI from './ConnectorPreviewUI';

// ── Mocks ──────────────────────────────────────────────────────────────────

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/lib/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('framer-motion', async () => {
  const actual = (await vi.importActual('framer-motion')) as any;
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('ConnectorPreviewUI — Surface 3: PII Tagging controls gating', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  });

  const mockItems = [
    {
      id: 'file-1',
      name: 'financials.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      path: 'financials.xlsx',
      isFolder: false,
      parseable: true,
      sizeBytes: 1024,
    } as any,
  ];

  const mockScanResults = [
    {
      file_id: 'file-1',
      pii_detected: true,
      pii_count: 5,
    } as any,
  ];

  it('hides Apply Tag button when user has support role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-sup', email: 'support@acme.com', role: 'support' },
      token: 'valid-jwt',
      isLoggedIn: true,
    });

    render(
      <ConnectorPreviewUI
        items={mockItems}
        selectedIds={new Set()}
        onToggleSelection={() => {}}
        scanningIds={new Set()}
        scanResults={mockScanResults}
        onOpenFile={() => {}}
        onTagFile={() => {}}
      />
    );

    // Tag prompt text is visible
    expect(screen.getByText(/tag this file in drive\?/i)).toBeInTheDocument();
    // But Apply Tag button and visibility dropdown are NOT rendered
    expect(screen.queryByRole('button', { name: /apply tag/i })).not.toBeInTheDocument();
  });

  it('shows Apply Tag button when user has admin role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-adm', email: 'admin@acme.com', role: 'admin' },
      token: 'valid-jwt',
      isLoggedIn: true,
    });

    render(
      <ConnectorPreviewUI
        items={mockItems}
        selectedIds={new Set()}
        onToggleSelection={() => {}}
        scanningIds={new Set()}
        scanResults={mockScanResults}
        onOpenFile={() => {}}
        onTagFile={() => {}}
      />
    );

    expect(screen.getByText(/tag this file in drive\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply tag/i })).toBeInTheDocument();
  });

  it('shows Apply Tag button when user has null role (Individual account)', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-ind', email: 'solo@personal.com', role: null },
      token: 'valid-jwt',
      isLoggedIn: true,
    });

    render(
      <ConnectorPreviewUI
        items={mockItems}
        selectedIds={new Set()}
        onToggleSelection={() => {}}
        scanningIds={new Set()}
        scanResults={mockScanResults}
        onOpenFile={() => {}}
        onTagFile={() => {}}
      />
    );

    expect(screen.getByText(/tag this file in drive\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply tag/i })).toBeInTheDocument();
  });
});
