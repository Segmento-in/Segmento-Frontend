import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import MariadbScanTab from '../MariadbScanTab';
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
      listMariadbTables: vi.fn().mockResolvedValue({ tables: mockTables }),
      getDbCatalog: vi.fn().mockResolvedValue({ files: [], last_session: null, sessions: [] }),
      scanConnector: vi.fn(),
      deductCredits: vi.fn().mockResolvedValue(undefined),
    }
  };
});

beforeEach(() => {
  const mockTables = Array.from({ length: 25 }, (_, i) => `table_${i + 1}`);
  vi.mocked(apiClient.listMariadbTables).mockResolvedValue({ tables: mockTables });
  vi.mocked(apiClient.getDbCatalog).mockResolvedValue({ files: [], last_session: null, sessions: [] });
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
  default: ({ items, selectedIds, onToggleSelection, onOpenFile }: any) => (
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
          <button 
            data-testid={`open-${item.id}`} 
            onClick={() => onOpenFile(item.id)}
          >
            Open File
          </button>
        </div>
      ))}
    </div>
  )
}));
vi.mock('../../DocumentViewerModal', () => ({
  default: ({ scanResult }: any) => (
    <div data-testid="document-viewer-modal-mock">
      {scanResult?.entities?.length > 0 && <div>Flagged Entities</div>}
    </div>
  )
}));

describe('MariadbScanTab', () => {
  const setupAndClickScan = async (numTablesToSelect: number) => {
    const { container, unmount } = render(<MariadbScanTab modelCatalogue={[]} />);
    fireEvent.change(screen.getByPlaceholderText(/localhost/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/root/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    await waitFor(() => expect(screen.getByText(/Select Tables/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());
    
    for (let i = 1; i <= numTablesToSelect; i++) {
      await act(async () => { fireEvent.click(screen.getByText(`table_${i}`)); });
    }
    
    await waitFor(() => expect(screen.getByRole('button', { name: /Full Deep Scan/i })).not.toBeDisabled());
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Full Deep Scan/i }));
    });
    return { container, unmount };
  };

  it('Table list renders correctly and selection works', async () => {
    const { unmount } = render(<MariadbScanTab modelCatalogue={[]} />);
    
    fireEvent.change(screen.getByPlaceholderText(/localhost/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/root/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    await waitFor(() => expect(screen.getByText(/Select Tables/i)).toBeInTheDocument());
    
    await waitFor(() => {
      expect(screen.getByText('table_1')).toBeInTheDocument();
    });
    
    const tableDiv = screen.getByText('table_1');
    expect(tableDiv).toHaveClass('border-slate-200'); // Unselected initially
    
    await act(async () => {
      fireEvent.click(tableDiv);
    });
    
    expect(tableDiv).toHaveClass('border-sky-500'); // Selected class for Mariadb
    unmount();
  });

  it('Countdown is absent before scan starts, present once scanning starts (small total)', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan(1); // small bucket
    
    await waitFor(() => expect(screen.getByText('Downloading and scanning tables in-memory…')).toBeInTheDocument());
    expect(screen.getByText('1:00')).toBeInTheDocument();
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('Selecting different combinations of files (large total) lands in the correct bucket', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan(21); // large bucket > 20
    
    await waitFor(() => expect(screen.getByText('Downloading and scanning tables in-memory…')).toBeInTheDocument());
    expect(screen.getByText('10:00')).toBeInTheDocument();
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('The "Taking a bit longer than usual..." note appears only after hook reports isFirstExtension: true', async () => {
    vi.mocked(apiClient.scanConnector).mockImplementation(() => new Promise(() => {}));
    vi.useFakeTimers();
    const { unmount } = render(<MariadbScanTab modelCatalogue={[]} />);
    
    fireEvent.change(screen.getByPlaceholderText(/localhost/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/root/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    fireEvent.click(screen.getByText('table_1'));
    await act(async () => { await Promise.resolve(); });
    
    fireEvent.click(screen.getByRole('button', { name: /Full Deep Scan/i }));
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
    
    await waitFor(() => {
      expect(screen.queryByText('1:00')).not.toBeInTheDocument();
      // Wait for the RESULTS dashboard stats to appear (they have specific labels)
      expect(screen.getByText('Scanned')).toBeInTheDocument();
    });
    unmount();
  });
});

describe('F1-3: Entities passed to DocumentViewerModal', () => {
  it('passes entities to the viewer when a table is scanned and opened', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    vi.mocked(apiClient.getDbCatalog)
      .mockResolvedValueOnce({ files: [], last_session: null, sessions: [] })
      .mockResolvedValueOnce({ 
        files: [{ 
          file_id: 'db.table_1', 
          file_name: 'table_1', 
          is_folder: false, 
          connector_type: 'mariadb', 
          classification: 'SENSITIVE', 
          metadata: { pii_types: {}, flagged_columns: [] } 
        } as any], 
        last_session: null, 
        sessions: [] 
      });
    const { unmount } = render(<MariadbScanTab modelCatalogue={[]} />);
    
    // Auth
    fireEvent.change(screen.getByPlaceholderText(/localhost/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/root/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    // Browse
    await waitFor(() => expect(screen.getByText(/Select Tables/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());
    
    // Select table_1
    const tableDiv = screen.getByText('table_1');
    await act(async () => { fireEvent.click(tableDiv); });
    
    // Trigger scan
    await waitFor(() => expect(screen.getByRole('button', { name: /Full Deep Scan/i })).not.toBeDisabled());
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Full Deep Scan/i }));
    });
    
    // Wait for RESULTS step
    await waitFor(() => expect(screen.getByText('Downloading and scanning tables in-memory…')).toBeInTheDocument());
    
    // Resolve the scan with entities
    await act(async () => { 
      resolveScan({ 
        total_pii_found: 1, 
        entities: [{
          id: 'ent-1',
          start: 0,
          end: 10,
          text: 'John Doe',
          winning_label: 'PERSON',
          flagged: true,
          review_status: 'unreviewed',
          contributing_votes: {}
        }]
      }); 
    });
    
    // Scan Complete should appear
    await waitFor(() => {
      expect(screen.getByText('Scanned')).toBeInTheDocument();
    });

    // Open viewer for table_1 
    const openBtn = await screen.findByTestId('open-db.table_1');
    await act(async () => {
      fireEvent.click(openBtn);
    });

    // Check if DocumentViewerModal got entities
    expect(screen.getByText('Flagged Entities')).toBeInTheDocument();
    
    unmount();
  });
});
