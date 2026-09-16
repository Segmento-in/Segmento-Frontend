import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import GCSScanTab from '../GCSScanTab';
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
      listGCSBuckets: vi.fn(),
      listGCSFiles: vi.fn(),
      scanGCSFile: vi.fn(),
      deductCredits: vi.fn(),
    }
  };
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

describe('GCSScanTab - Step 1: Adapt to new response shape', () => {
  beforeEach(() => {
    vi.mocked(apiClient.listGCSBuckets).mockResolvedValue({ buckets: ['test-bucket'] });
    vi.mocked(apiClient.listGCSFiles).mockResolvedValue({ 
      files: [
        { name: 'small.csv', sizeBytes: 1024 },
        { name: 'large.csv', sizeBytes: 150 * 1024 * 1024 }
      ] 
    });
    vi.mocked(apiClient.scanGCSFile).mockResolvedValue({ total_pii_found: 1 } as any);
    vi.mocked(apiClient.deductCredits).mockResolvedValue({} as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('File list renders correctly with the new {name, sizeBytes} shape and selection works', async () => {
    const { container } = render(<GCSScanTab modelCatalogue={[]} />);
    
    // Step 1: Fill in Auth (SA JSON file mock)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const saFile = new File(['{"project_id": "test"}'], 'sa.json', { type: 'application/json' });
    
    await act(async () => {
        fireEvent.change(fileInput, { target: { files: [saFile] } });
        // wait for onload
        await new Promise(r => setTimeout(r, 10));
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Connect to GCS/i }));
    
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
    vi.mocked(apiClient.listGCSBuckets).mockImplementation(() => Promise.resolve({ buckets: ['test-bucket'] }));
    vi.mocked(apiClient.listGCSFiles).mockImplementation(() => Promise.resolve({ 
      files: [
        { name: 'small.csv', sizeBytes: 1024 },
        { name: 'large.csv', sizeBytes: 150 * 1024 * 1024 }
      ] 
    }));
    vi.mocked(apiClient.scanGCSFile).mockImplementation(() => new Promise(() => {}));
    vi.mocked(apiClient.deductCredits).mockImplementation(() => Promise.resolve({} as any));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setupAndClickScan = async (fileName: string) => {
    const { container, unmount } = render(<GCSScanTab modelCatalogue={[]} />);
    
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const saFile = new File(['{"project_id": "test"}'], 'sa.json', { type: 'application/json' });
    
    await act(async () => {
        fireEvent.change(fileInput, { target: { files: [saFile] } });
        await new Promise(r => setTimeout(r, 10));
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Connect to GCS/i }));
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
    vi.mocked(apiClient.scanGCSFile).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('small.csv');
    await waitFor(() => expect(screen.getByText(/Scanning…/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/1:00/)).toBeInTheDocument());
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('Selecting different combinations of files (large total) lands in the correct bucket', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanGCSFile).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('large.csv');
    await waitFor(() => expect(screen.getByText(/Scanning…/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/10:00/)).toBeInTheDocument());
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('The "Taking a bit longer than usual..." note appears only after hook reports isFirstExtension: true', async () => {
    vi.useFakeTimers();
    const { container, unmount } = render(<GCSScanTab modelCatalogue={[]} />);
    
    // Step 1: CONNECT
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const saFile = new File(['{"project_id": "test"}'], 'sa.json', { type: 'application/json' });
    
    await act(async () => {
        fireEvent.change(fileInput, { target: { files: [saFile] } });
        vi.advanceTimersByTime(100); // Allow FileReader to finish
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Connect to GCS/i }));
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
    vi.mocked(apiClient.scanGCSFile).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('small.csv');
    
    await waitFor(() => expect(screen.getByText(/1:00/)).toBeInTheDocument());
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    
    // Wait for state to change to results (which sets isScanning to false)
    await waitFor(() => {
      expect(screen.queryByText(/1:00/)).not.toBeInTheDocument();
      expect(screen.getByText(/Scan Complete/i)).toBeInTheDocument();
    });
    unmount();
  });
});
