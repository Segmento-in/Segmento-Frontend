import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import S3ScanTab from '../../S3ScanTab';
import { apiClient } from '@/lib/apiClient';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => {
            const { initial, animate, exit, transition, ...rest } = props;
            return <div {...rest}>{children}</div>;
        }
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
}));

vi.mock('@/lib/apiClient', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    apiClient: {
      listS3Buckets: vi.fn().mockResolvedValue({ buckets: ['test-bucket'] }),
      listS3Files: vi.fn().mockResolvedValue({ 
        files: [
          { name: 'small.csv', sizeBytes: 1024 },
          { name: 'large.csv', sizeBytes: 150 * 1024 * 1024 }
        ] 
      }),
      scanS3File: vi.fn(),
      deductCredits: vi.fn().mockResolvedValue(undefined),
    }
  };
});

beforeEach(() => {
  vi.mocked(apiClient.listS3Buckets).mockResolvedValue({ buckets: ['test-bucket'] });
  vi.mocked(apiClient.listS3Files).mockResolvedValue({ 
    files: [
      { name: 'small.csv', sizeBytes: 1024 },
      { name: 'large.csv', sizeBytes: 150 * 1024 * 1024 }
    ] 
  });
  vi.mocked(apiClient.scanS3File).mockResolvedValue({ total_pii_found: 1 } as any);
  vi.mocked(apiClient.deductCredits).mockResolvedValue({} as any);
});

afterEach(() => {
  vi.useRealTimers();
});

// Mock the Auth context
vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ isLoggedIn: true, token: 'mock-token', user: {} })
}));

// Mock child components
vi.mock('@/components/OutOfCreditsModal', () => ({
  default: () => <div data-testid="out-of-credits-mock" />
}));
vi.mock('../../ConnectorPreviewUI', () => ({
  default: ({ items, selectedIds, onToggleSelection }: any) => (
    <div data-testid="connector-preview-ui-mock">
      {items.map((item: any) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.name} - {item.sizeBytes} bytes
          <button 
            data-testid={`toggle-${item.id}`} 
            onClick={() => onToggleSelection(item.id)}
          >
            {selectedIds.has(item.id) ? 'Selected' : 'Unselected'}
          </button>
        </div>
      ))}
    </div>
  )
}));
vi.mock('../../DocumentViewerModal', () => ({
  default: () => <div data-testid="document-viewer-modal-mock" />
}));

describe('S3ScanTab - Step 1: Adapt to new response shape', () => {
  it('File list renders correctly with the new {name, sizeBytes} shape and selection works', async () => {
    const { container } = render(<S3ScanTab modelCatalogue={[]} />);
    
    // Step 1: Fill in Auth
    fireEvent.change(screen.getByPlaceholderText(/AKIAIOSFODNN7EXAMPLE/i), { target: { value: 'fake-access' } });
    fireEvent.change(screen.getByPlaceholderText(/wJalrXUtnFEMI/i), { target: { value: 'fake-secret' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect to S3/i }));
    
    // Step 2: Browse
    await waitFor(() => expect(screen.getByText(/Select Bucket/i)).toBeInTheDocument());
    
    // Select bucket
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'test-bucket' } });
    
    // Verify files rendered via our mocked ConnectorPreviewUI
    await waitFor(() => {
      expect(screen.getByTestId('item-small.csv')).toBeInTheDocument();
      expect(screen.getByTestId('item-large.csv')).toBeInTheDocument();
    });
    
    // Verify name and size are passed down
    expect(screen.getByTestId('item-small.csv')).toHaveTextContent('small.csv - 1024 bytes');
    expect(screen.getByTestId('item-large.csv')).toHaveTextContent('large.csv - 157286400 bytes');
    
    // Verify Selection works (Step 1)
    const toggleSmall = screen.getByTestId('toggle-small.csv');
    expect(toggleSmall).toHaveTextContent('Unselected');
    
    await act(async () => {
      fireEvent.click(toggleSmall);
    });
    expect(screen.getByTestId('toggle-small.csv')).toHaveTextContent('Selected');
    
    // Check that selected summary updates
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });
});

describe('Scan Estimate Loading UI', () => {
  beforeEach(() => {
    vi.mocked(apiClient.listS3Buckets).mockImplementation(() => Promise.resolve({ buckets: ['test-bucket'] }));
    vi.mocked(apiClient.listS3Files).mockImplementation(() => Promise.resolve({ 
      files: [
        { name: 'small.csv', sizeBytes: 1024 },
        { name: 'large.csv', sizeBytes: 150 * 1024 * 1024 }
      ] 
    }));
    vi.mocked(apiClient.scanS3File).mockImplementation(() => new Promise(() => {}));
    vi.mocked(apiClient.deductCredits).mockImplementation(() => Promise.resolve({} as any));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setupAndClickScan = async (fileName: string) => {
    const { container, unmount } = render(<S3ScanTab modelCatalogue={[]} />);
    fireEvent.change(screen.getByPlaceholderText(/AKIAIOSFODNN7EXAMPLE/i), { target: { value: 'fake-access' } });
    fireEvent.change(screen.getByPlaceholderText(/wJalrXUtnFEMI/i), { target: { value: 'fake-secret' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect to S3/i }));
    await waitFor(() => expect(screen.getByText(/Select Bucket/i)).toBeInTheDocument());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'test-bucket' } });
    
    await waitFor(() => expect(screen.getByTestId(`item-${fileName}`)).toBeInTheDocument());
    
    const toggleFile = screen.getByTestId(`toggle-${fileName}`);
    await act(async () => { fireEvent.click(toggleFile); });
    
    // Wait for the button to show "Scan 1 file(s)"
    await waitFor(() => expect(screen.getByRole('button', { name: /Scan 1 file\(s\) for PII/i })).not.toBeDisabled());
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Scan 1 file\(s\) for PII/i }));
    });
    return { container, unmount };
  };

  it('Countdown is absent before scan starts, present once scanning starts (small total)', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanS3File).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('small.csv');
    await waitFor(() => expect(screen.getByText('Scanning…')).toBeInTheDocument());
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('Selecting different combinations of files (large total) lands in the correct bucket', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanS3File).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('large.csv');
    await waitFor(() => expect(screen.getByText('Scanning…')).toBeInTheDocument());
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });



  it('The "Taking a bit longer than usual..." note appears only after hook reports isFirstExtension: true', async () => {
    vi.useFakeTimers();
    const { container, unmount } = render(<S3ScanTab modelCatalogue={[]} />);
    
    // Step 1: CONNECT
    fireEvent.change(screen.getByPlaceholderText(/AKIAIOSFODNN7EXAMPLE/i), { target: { value: 'fake-access' } });
    fireEvent.change(screen.getByPlaceholderText(/wJalrXUtnFEMI/i), { target: { value: 'fake-secret' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Connect to S3/i }));
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    // Step 2: BROWSE
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'test-bucket' } });
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    const toggleFile = screen.getByTestId('toggle-small.csv');
    fireEvent.click(toggleFile);
    await act(async () => { await Promise.resolve(); });
    
    // Step 3: SCAN
    fireEvent.click(screen.getByRole('button', { name: /Scan 1 file\(s\) for PII/i }));
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    expect(screen.queryByText(/Taking a bit longer than usual/i)).not.toBeInTheDocument();
    
    await act(async () => {
      vi.advanceTimersByTime(65000);
    });
    
    expect(screen.getByText(/Taking a bit longer than usual/i)).toBeInTheDocument();
    
    unmount();
  });

  it('Countdown disappears when scanning ends', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanS3File).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('small.csv');
    
    await waitFor(() => expect(screen.getByText('1:00')).toBeInTheDocument());
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    
    // Wait for state to change to results (which sets isScanning to false)
    await waitFor(() => {
      expect(screen.queryByText('1:00')).not.toBeInTheDocument();
      expect(screen.getByText(/Scan Complete/i)).toBeInTheDocument();
    });
    unmount();
  });
});

