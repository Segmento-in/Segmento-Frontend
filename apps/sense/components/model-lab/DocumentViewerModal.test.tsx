import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DocumentViewerModal from './DocumentViewerModal';

// Mock dependencies
vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ session: { user: { id: 'test-user' } } })
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    getFileText: vi.fn().mockResolvedValue({ text: 'mock text' }),
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
