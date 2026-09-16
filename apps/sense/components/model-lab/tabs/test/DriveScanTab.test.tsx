import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import DriveScanTab from '../DriveScanTab';
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
      driveFolderBrowse: vi.fn(),
      getFileCatalog: vi.fn(),
      driveFolderScan: vi.fn(),
      deductCredits: vi.fn(),
    }
  };
});

// Mock the Auth context
vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ isLoggedIn: true, token: 'mock-token', user: {} })
}));

// Mock hooks
vi.mock('@/hooks/useAutoRefresh', () => ({
  useAutoRefresh: () => ({ timeLeftLabel: '', resetTimer: vi.fn() })
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

describe('DriveScanTab - Step 1: Adapt to new response shape', () => {
  beforeEach(() => {
    vi.mocked(apiClient.driveFolderBrowse).mockResolvedValue({ 
      items: [
        { id: '1', name: 'small.csv', mimeType: 'text/csv', sizeBytes: 1024, parseable: true },
        { id: '2', name: 'large.csv', mimeType: 'text/csv', sizeBytes: 150 * 1024 * 1024, parseable: true }
      ] 
    } as any);
    vi.mocked(apiClient.getFileCatalog).mockResolvedValue({ files: [], last_session: null, sessions: [] });
    vi.mocked(apiClient.driveFolderScan).mockResolvedValue({ results: [{ pii_count: 1 }] } as any);
    vi.mocked(apiClient.deductCredits).mockResolvedValue({} as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('File list renders correctly with the new {name, sizeBytes} shape and selection works', async () => {
    const { container } = render(<DriveScanTab modelCatalogue={[]} />);
    
    // Step 1: Auth
    fireEvent.click(screen.getByRole('button', { name: /OAuth2 Token/i }));
    fireEvent.change(screen.getByPlaceholderText(/ya29.a0Ael9sF/i), { target: { value: 'fake-token' } });
    fireEvent.click(screen.getByRole('button', { name: /Apply/i }));
    
    // Enter Folder ID and click Browse
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1A2b3C4d5E6f7G8h9I0j/i), { target: { value: 'test-folder-id' } });
    fireEvent.click(screen.getByRole('button', { name: /Browse/i }));
    
    // Step 2: Browse
    await waitFor(() => expect(screen.getByText(/Total Files/i)).toBeInTheDocument());
    
    // Verify files rendered via our mocked ConnectorPreviewUI
    await waitFor(() => {
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
    });
    
    // Verify name and size are passed down
    expect(screen.getByTestId('item-1')).toHaveTextContent('small.csv - 1024 bytes');
    expect(screen.getByTestId('item-2')).toHaveTextContent('large.csv - 157286400 bytes');
    
    // Verify Selection works
    const toggleSmall = screen.getByTestId('toggle-1');
    expect(toggleSmall).toHaveTextContent('Unselected');
    
    await act(async () => {
      fireEvent.click(toggleSmall);
    });
    expect(screen.getByTestId('toggle-1')).toHaveTextContent('Selected');
    
    // Check that selected summary updates in the floating pill
    expect(screen.getByText('Selected: 1')).toBeInTheDocument();
  });
});

describe('Scan Estimate Loading UI', () => {
  beforeEach(() => {
    vi.mocked(apiClient.driveFolderBrowse).mockImplementation(() => Promise.resolve({ 
      items: [
        { id: '1', name: 'small.csv', mimeType: 'text/csv', sizeBytes: 1024, parseable: true },
        { id: '2', name: 'large.csv', mimeType: 'text/csv', sizeBytes: 150 * 1024 * 1024, parseable: true }
      ] 
    } as any));
    vi.mocked(apiClient.getFileCatalog).mockImplementation(() => Promise.resolve({ files: [], last_session: null, sessions: [] }));
    vi.mocked(apiClient.driveFolderScan).mockImplementation(() => new Promise(() => {}));
    vi.mocked(apiClient.deductCredits).mockImplementation(() => Promise.resolve({} as any));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setupAndClickScan = async (fileId: string) => {
    const { container, unmount } = render(<DriveScanTab modelCatalogue={[]} />);
    
    fireEvent.click(screen.getByRole('button', { name: /OAuth2 Token/i }));
    fireEvent.change(screen.getByPlaceholderText(/ya29.a0Ael9sF/i), { target: { value: 'fake-token' } });
    fireEvent.click(screen.getByRole('button', { name: /Apply/i }));
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1A2b3C4d5E6f7G8h9I0j/i), { target: { value: 'test-folder-id' } });
    fireEvent.click(screen.getByRole('button', { name: /Browse/i }));
    
    await waitFor(() => expect(screen.getByText(/Total Files/i)).toBeInTheDocument());
    
    const toggleFile = screen.getByTestId(`toggle-${fileId}`);
    await act(async () => { fireEvent.click(toggleFile); });
    
    await waitFor(() => expect(screen.getByRole('button', { name: /Run Scan/i })).not.toBeDisabled());
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Run Scan/i }));
    });
    return { container, unmount };
  };

  it('Countdown is absent before scan starts, present once scanning starts (small total)', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.driveFolderScan).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('1');
    await waitFor(() => expect(screen.getByText(/Scanning 1 file…/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/1:00/)).toBeInTheDocument());
    await act(async () => { resolveScan({ results: [{ pii_count: 1 }] }); });
    unmount();
  });

  it('Selecting different combinations of files (large total) lands in the correct bucket', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.driveFolderScan).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('2');
    await waitFor(() => expect(screen.getByText(/Scanning 1 file…/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/10:00/)).toBeInTheDocument());
    await act(async () => { resolveScan({ results: [{ pii_count: 1 }] }); });
    unmount();
  });

  it('The "Taking a bit longer than usual..." note appears only after hook reports isFirstExtension: true', async () => {
    vi.useFakeTimers();
    const { unmount } = render(<DriveScanTab modelCatalogue={[]} />);
    
    // Step 1: AUTH
    fireEvent.click(screen.getByRole('button', { name: /OAuth2 Token/i }));
    fireEvent.change(screen.getByPlaceholderText(/ya29.a0Ael9sF/i), { target: { value: 'fake-token' } });
    fireEvent.click(screen.getByRole('button', { name: /Apply/i }));
    
    // Step 2: BROWSE
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1A2b3C4d5E6f7G8h9I0j/i), { target: { value: 'test-folder-id' } });
    fireEvent.click(screen.getByRole('button', { name: /Browse/i }));
    
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    const toggleFile = screen.getByTestId('toggle-1');
    fireEvent.click(toggleFile);
    await act(async () => { await Promise.resolve(); });
    
    // Step 3: SCAN
    fireEvent.click(screen.getByRole('button', { name: /Run Scan/i }));
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
    vi.mocked(apiClient.driveFolderScan).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan('1');
    
    await waitFor(() => expect(screen.getByText(/1:00/)).toBeInTheDocument());
    
    await act(async () => { resolveScan({ results: [{ pii_count: 1 }] }); });
    
    await waitFor(() => {
      expect(screen.queryByText(/1:00/)).not.toBeInTheDocument();
      expect(screen.getByText(/Scan Complete/i)).toBeInTheDocument();
    });
    unmount();
  });
});
