import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import DatabaseScanTab from '../DatabaseScanTab';
import { apiClient } from '@/lib/apiClient';

vi.mock('framer-motion', () => ({
    motion: {
        circle: ({ children, ...props }: any) => { const { initial, animate, exit, transition, ...rest } = props; return <circle {...rest}>{children}</circle>; },
        div: ({ children, ...props }: any) => {
            const { initial, animate, exit, transition, ...rest } = props;
            return <div {...rest}>{children}</div>;
        }
    },
    useReducedMotion: () => false,
        AnimatePresence: ({ children }: any) => <>{children}</>
}));

vi.mock('@/lib/apiClient', async (importOriginal) => {
  const actual = await importOriginal() as any;
  const mockTables = Array.from({ length: 25 }, (_, i) => `table_${i + 1}`);
  return {
    ...actual,
    apiClient: {
      listPostgresTables: vi.fn().mockResolvedValue({ tables: mockTables }),
      getCatalog: vi.fn().mockResolvedValue({ files: [], last_session: null, sessions: [] }),
      scanConnector: vi.fn(),
      deductCredits: vi.fn().mockResolvedValue(undefined),
    }
  };
});

beforeEach(() => {
  const mockTables = Array.from({ length: 25 }, (_, i) => `table_${i + 1}`);
  vi.mocked(apiClient.listPostgresTables).mockResolvedValue({ tables: mockTables });
  vi.mocked(apiClient.getCatalog).mockResolvedValue({ files: [], last_session: null, sessions: [] });
  vi.mocked(apiClient.scanConnector).mockResolvedValue({ total_pii_found: 1 } as any);
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
          {item.name}
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

describe('DatabaseScanTab - Step 1: Adapt to new pattern', () => {
  it('Table list renders correctly and selection works', async () => {
    const { container } = render(<DatabaseScanTab modelCatalogue={[]} />);
    
    // Step 1: Fill in Auth
    fireEvent.change(screen.getByPlaceholderText(/localhost or 127.0.0.1/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/db_user/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    // Step 2: Browse
    await waitFor(() => expect(screen.getByText(/Total Tables/i)).toBeInTheDocument());
    
    // Verify files rendered (since we're checking table_1)
    await waitFor(() => {
      expect(screen.getByText('table_1')).toBeInTheDocument();
    });
    
    // Check checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox is "select all", second is table_1
    const toggleSmall = checkboxes[1];
    
    await act(async () => {
      fireEvent.click(toggleSmall);
    });
    
    expect(toggleSmall).toBeChecked();
  });
});

describe('Scan Estimate Loading UI', () => {
  beforeEach(() => {
    const mockTables = Array.from({ length: 25 }, (_, i) => `table_${i + 1}`);
    vi.mocked(apiClient.listPostgresTables).mockImplementation(() => Promise.resolve({ tables: mockTables }));
    vi.mocked(apiClient.getCatalog).mockImplementation(() => Promise.resolve({ files: [], last_session: null, sessions: [] }));
    vi.mocked(apiClient.scanConnector).mockImplementation(() => new Promise(() => {}));
    vi.mocked(apiClient.deductCredits).mockImplementation(() => Promise.resolve({} as any));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setupAndClickScan = async (numTablesToSelect: number) => {
    const { container, unmount } = render(<DatabaseScanTab modelCatalogue={[]} />);
    fireEvent.change(screen.getByPlaceholderText(/localhost or 127.0.0.1/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/db_user/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    await waitFor(() => expect(screen.getByText(/Total Tables/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());
    
    const checkboxes = screen.getAllByRole('checkbox');
    for (let i = 1; i <= numTablesToSelect; i++) {
      await act(async () => { fireEvent.click(checkboxes[i]); });
    }
    
    // Trigger scan using the floating pill "Scan Now" button
    await waitFor(() => expect(screen.getByRole('button', { name: /Scan Now/i })).not.toBeDisabled());
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Scan Now/i }));
    });
    return { container, unmount };
  };

  it('Countdown is absent before scan starts, present once scanning starts (small total)', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan(1); // small bucket
    
    // Wait for the RESULTS step to load
    await waitFor(() => expect(screen.getByText('Downloading and scanning tables in-memory…')).toBeInTheDocument());
    
    // Check countdown
    expect(screen.getByText('1:00')).toBeInTheDocument();
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('Selecting different combinations of files (large total) lands in the correct bucket', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan(21); // large bucket > 20
    
    await waitFor(() => expect(screen.getByText('Downloading and scanning tables in-memory…')).toBeInTheDocument());
    
    expect(screen.getByText('10:00')).toBeInTheDocument(); // large bucket starts at 10:00
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('The "Taking a bit longer than usual..." note appears only after hook reports isFirstExtension: true', async () => {
    vi.useFakeTimers();
    const { unmount } = render(<DatabaseScanTab modelCatalogue={[]} />);
    
    fireEvent.change(screen.getByPlaceholderText(/localhost/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/db_user/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    await act(async () => { await Promise.resolve(); });
    
    fireEvent.click(screen.getByRole('button', { name: /Scan Now/i }));
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    expect(screen.queryByText(/Taking a bit longer than usual/i)).not.toBeInTheDocument();
    
    await act(async () => {
      vi.advanceTimersByTime(65000); // 1 minute + 5s for small bucket extension
    });
    
    expect(screen.getByText(/Taking a bit longer than usual/i)).toBeInTheDocument();
    
    unmount();
  });

  it('Countdown disappears when scanning ends', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan(1);
    
    await waitFor(() => expect(screen.getByText('1:00')).toBeInTheDocument());
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    
    // Wait for the placeholder to disappear and Scan Complete to appear
    await waitFor(() => {
      expect(screen.queryByText('1:00')).not.toBeInTheDocument();
      expect(screen.getByText(/Scan Complete/i)).toBeInTheDocument();
    });
    unmount();
  });
});
