import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DocumentViewerModal from './DocumentViewerModal';
import { apiClient } from '@/lib/apiClient';

// Mock dependencies
const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/lib/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    getFileText: vi.fn().mockResolvedValue({ text: 'mock text' }),
    reviewEntity: vi.fn().mockResolvedValue({ status: 'success' }),
  }
}));

// Mock child components to isolate the test to just the modal's tabs
vi.mock('@/components/pii-demo/PIIAnalytics', () => ({
  PIIAnalytics: () => <div data-testid="pii-analytics-mock" />
}));
vi.mock('@/components/pii-demo/Inspector', () => ({
  Inspector: () => <div data-testid="inspector-mock" />
}));

describe('DocumentViewerModal Tab Seams', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  });
  const mockFileInfo = {
    id: 'file-1',
    name: 'test.csv',
    mimeType: 'text/csv',
    path: '/test.csv'
  } as any;

  const mockScanResult = {
    file_id: 'file-1',
    pii_detected: true,
    pii_count: 5,
    result: { pii_counts: [] },
    scan_data: {}
  } as any;

  it('Ticket 1 - Seam 1: Renders 3 tabs (PII Analytics, Highlighted Text, Model Breakdown) for Drive/Local files', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="service_account" // Represents Drive or Local
        onClose={() => {}}
      />
    );

    expect(screen.getByText('PII Analytics')).toBeInTheDocument();
    expect(screen.getByText('Highlighted Text')).toBeInTheDocument();
    
    // This is the failing assertion for the red phase:
    expect(screen.getByText('Model Breakdown')).toBeInTheDocument();
  });

  it('Ticket 1 - Seam 2: Renders only 2 tabs for Database connections', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql" // Represents Database
        onClose={() => {}}
      />
    );

    expect(screen.getByText('PII Analytics')).toBeInTheDocument();
    expect(screen.getByText('Highlighted Text')).toBeInTheDocument();
    
    // Should NOT have the 3rd tab
    expect(screen.queryByText('Model Breakdown')).not.toBeInTheDocument();
  });

  it('Ticket 3: Default tab renders standard analytics; clicking Model Breakdown renders advanced panels', () => {
    const { fireEvent } = require('@testing-library/react');

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="service_account"
        onClose={() => {}}
      />
    );

    // Default tab is 'analytics' (donut chart mock)
    expect(screen.getByTestId('pii-analytics-mock')).toBeInTheDocument();
    
    // Schema map view shouldn't be there yet
    expect(screen.queryByText('Schema Map View (Zero Trust)')).not.toBeInTheDocument();

    // Click Model Breakdown
    fireEvent.click(screen.getByText('Model Breakdown'));

    // Now Schema map view should be there
    expect(screen.getByText('Schema Map View (Zero Trust)')).toBeInTheDocument();
    
    // And the donut chart mock shouldn't be
    expect(screen.queryByTestId('pii-analytics-mock')).not.toBeInTheDocument();
  });
});

// ── Surface 3: PII tagging controls role gating ───────────────────────────

describe('DocumentViewerModal — PII Tagging controls gating', () => {
  const mockFileInfo = {
    id: 'file-1',
    name: 'test.csv',
    mimeType: 'text/csv',
    path: '/test.csv'
  } as any;

  const mockScanResult = {
    file_id: 'file-1',
    pii_detected: true,
    pii_count: 5,
    result: { pii_counts: [] },
    scan_data: {}
  } as any;

  it('hides Tag File button when user has support role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-sup', email: 'support@acme.com', role: 'support' },
      token: 'valid-jwt',
      isLoggedIn: true,
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="service_account"
        onClose={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: /tag in drive/i })).not.toBeInTheDocument();
  });

  it('shows Tag File button when user has admin role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-adm', email: 'admin@acme.com', role: 'admin' },
      token: 'valid-jwt',
      isLoggedIn: true,
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="service_account"
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /tag in drive/i })).toBeInTheDocument();
  });

  it('shows Tag File button when user has null role (Individual account)', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-ind', email: 'solo@personal.com', role: null },
      token: 'valid-jwt',
      isLoggedIn: true,
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="service_account"
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /tag in drive/i })).toBeInTheDocument();
  });
});

describe('DocumentViewerModal — Ticket 6 Entities Tab', () => {
  const mockFileInfo = { id: 'file-1', name: 'test.csv', mimeType: 'text/csv' } as any;

  it('renders Flagged Entities tab and correctly displays/sorts entity rows', () => {
    const { fireEvent } = require('@testing-library/react');
    
    // Sample entity data with a mix of flagged/unflagged
    const mockScanResultWithEntities = {
      file_id: 'file-1',
      pii_detected: true,
      pii_count: 5,
      result: { pii_counts: [] },
      scan_data: {},
      entities: [
        { start: 0, end: 10, text: 'Unflagged1', winning_label: 'PERSON', flagged: false, contributing_votes: [] },
        { start: 10, end: 20, text: 'Flagged1', winning_label: 'ORG', flagged: true, contributing_votes: [] },
        { start: 20, end: 30, text: 'Unflagged2', winning_label: 'LOCATION', flagged: false, contributing_votes: [] },
      ]
    } as any;

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResultWithEntities}
        credentials={{}}
        authType="service_account"
        onClose={() => {}}
      />
    );

    // Tab should be present
    const entitiesTab = screen.getByText(/Flagged Entities/i);
    expect(entitiesTab).toBeInTheDocument();
    
    // Switch to the tab
    fireEvent.click(entitiesTab);

    // All entities render, none dropped
    expect(screen.getByText('Unflagged1')).toBeInTheDocument();
    expect(screen.getByText('Flagged1')).toBeInTheDocument();
    expect(screen.getByText('Unflagged2')).toBeInTheDocument();

    // The flagged ones render first: check DOM order
    const rows = screen.getAllByRole('row');
    // rows[0] is the table header
    expect(rows[1]).toHaveTextContent('Flagged1');
    expect(rows[2]).toHaveTextContent('Unflagged1');
    expect(rows[3]).toHaveTextContent('Unflagged2');
    
    // The flagged badge/indicator appears only on flagged entities
    const badges = screen.getAllByText('Needs Review');
    expect(badges.length).toBe(1); // Only Flagged1 has it
  });

  describe('Interactive Review Controls', () => {
    const { fireEvent, waitFor } = require('@testing-library/react');

    const mockScanResultWithEntity = {
      file_id: 'file-1',
      pii_detected: true,
      pii_count: 1,
      result: { pii_counts: [] },
      scan_data: {},
      entities: [
        { id: 99, start: 0, end: 10, text: 'Flagged1', winning_label: 'ORG', flagged: true, contributing_votes: [] }
      ]
    } as any;

    const mockScanResultWithUnflaggedEntity = {
      file_id: 'file-2',
      pii_detected: false,
      pii_count: 0,
      result: { pii_counts: [] },
      scan_data: {},
      entities: [
        { id: 100, start: 0, end: 10, text: 'Unflagged1', winning_label: 'ORG', flagged: false, contributing_votes: [] }
      ]
    } as any;

    beforeEach(() => {
      vi.clearAllMocks();
      // default admin
      mockUseAuth.mockReturnValue({
        user: { id: 'usr-adm', email: 'admin@acme.com', role: 'admin' },
        token: 'valid-jwt',
        isLoggedIn: true,
      });
    });

    it('Clicking approve calls the endpoint and updates displayed state', async () => {
      (apiClient.reviewEntity as any).mockResolvedValueOnce({ status: 'success', action: 'approve', entity_id: 99 });
      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithEntity} credentials={{}} authType="service_account" onClose={() => {}} />
      );
      
      fireEvent.click(screen.getByText(/Flagged Entities/i));
      
      const approveBtn = screen.getByRole('button', { name: /correct/i });
      fireEvent.click(approveBtn);

      expect(apiClient.reviewEntity).toHaveBeenCalledWith(99, 'approve', 'valid-jwt', undefined);

      await waitFor(() => {
        expect(screen.getByText('Approved')).toBeInTheDocument();
      });
    });

    it('Selecting a correction and submitting calls the endpoint and updates displayed state', async () => {
      (apiClient.reviewEntity as any).mockResolvedValueOnce({ status: 'success', action: 'correct', entity_id: 99, new_label: 'PERSON' });
      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithEntity} credentials={{}} authType="service_account" onClose={() => {}} />
      );
      
      fireEvent.click(screen.getByText(/Flagged Entities/i));
      
      // Assume we have a select for correction
      const select = screen.getByRole('combobox', { name: /wrong label/i });
      fireEvent.change(select, { target: { value: 'PERSON' } });

      expect(apiClient.reviewEntity).toHaveBeenCalledWith(99, 'correct', 'valid-jwt', 'PERSON');

      await waitFor(() => {
        expect(screen.getByText('Corrected')).toBeInTheDocument();
        // The original label should still be there, and new label too, or just the new label as current
        expect(screen.getAllByText('PERSON').length).toBeGreaterThan(0);
      });
    });

    it('Filters out backend-rejected labels from the correction dropdown', () => {
      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithEntity} credentials={{}} authType="service_account" onClose={() => {}} />
      );
      
      fireEvent.click(screen.getByText(/Flagged Entities/i));
      
      const select = screen.getByRole('combobox', { name: /wrong label/i });
      const options = Array.from(select.querySelectorAll('option')).map(o => o.value);
      
      expect(options).not.toContain('FULL_NAME');
      expect(options).not.toContain('GPE');
      expect(options).not.toContain('DOB');
      expect(options).toContain('PERSON'); // Sanity check for valid option
    });

    it('A failed API call displays a visible error banner and does not update state', async () => {
      (apiClient.reviewEntity as any).mockRejectedValueOnce(new Error('Network error'));
      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithEntity} credentials={{}} authType="service_account" onClose={() => {}} />
      );
      
      fireEvent.click(screen.getByText(/Flagged Entities/i));
      
      const approveBtn = screen.getByRole('button', { name: /correct/i });
      fireEvent.click(approveBtn);

      await waitFor(() => {
        expect(screen.getByText('Needs Review')).toBeInTheDocument();
        expect(screen.queryByText('Approved')).not.toBeInTheDocument();
        // The error banner should be visible and scoped to the entities tab
        const errorBanner = screen.getByTestId('review-error-banner');
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveTextContent(/Review failed: Network error/i);
        
        const entitiesTab = screen.getByTestId('entities-tab');
        expect(entitiesTab).toContainElement(errorBanner);
      });
    });

    it('A user without can_tag_pii does not see an active control', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'usr-sup', email: 'support@acme.com', role: 'support' },
        token: 'valid-jwt',
        isLoggedIn: true,
      });

      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithEntity} credentials={{}} authType="service_account" onClose={() => {}} />
      );
      
      fireEvent.click(screen.getByText(/Flagged Entities/i));
      
      expect(screen.queryByRole('button', { name: /correct/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('combobox', { name: /wrong label/i })).not.toBeInTheDocument();
    });

    it('An UNFLAGGED entity with review_status "unreviewed" shows an active Correct button and Wrong dropdown, but NO badge', () => {
      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithUnflaggedEntity} credentials={{}} authType="service_account" onClose={() => {}} />
      );
      
      fireEvent.click(screen.getByText(/Flagged Entities/i));
      
      // Controls should be present
      expect(screen.getByRole('button', { name: /correct/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /wrong label/i })).toBeInTheDocument();
      
      // Badge should NOT be present
      expect(screen.queryByText('Needs Review')).not.toBeInTheDocument();
    });

    it('a PostgreSQL result with entities shows the Entities tab and a working Correct/Wrong control', () => {
      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithEntity} credentials={{}} authType="postgresql" onClose={() => {}} />
      );
      
      const entitiesTab = screen.getByText(/Flagged Entities/i);
      expect(entitiesTab).toBeInTheDocument();
      fireEvent.click(entitiesTab);
      
      expect(screen.getByRole('button', { name: /correct/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /wrong label/i })).toBeInTheDocument();
    });

    it('a non-admin user still cannot trigger an active review control on a PostgreSQL entity', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'usr-sup', email: 'support@acme.com', role: 'support' },
        token: 'valid-jwt',
        isLoggedIn: true,
      });

      render(
        <DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResultWithEntity} credentials={{}} authType="postgresql" onClose={() => {}} />
      );
      
      fireEvent.click(screen.getByText(/Flagged Entities/i));
      
      expect(screen.queryByRole('button', { name: /correct/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('combobox', { name: /wrong label/i })).not.toBeInTheDocument();
    });
  });
});
