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

let capturedProps: any = null;

vi.mock('@/lib/apiClient', async (importOriginal) => {
  const actual = await importOriginal() as any;
  const mockTables = Array.from({ length: 5 }, (_, i) => `table_${i + 1}`);
  return {
    ...actual,
    apiClient: {
      listPostgresTables: vi.fn().mockResolvedValue({ tables: mockTables }),
      getCatalog: vi.fn().mockResolvedValue({ files: [], last_session: null, sessions: [] }),
      scanConnector: vi.fn(),
      scanMetadata: vi.fn(),
      deductCredits: vi.fn().mockResolvedValue(undefined),
    }
  };
});

beforeEach(() => {
  capturedProps = null;
  const mockTables = Array.from({ length: 5 }, (_, i) => `table_${i + 1}`);
  vi.mocked(apiClient.listPostgresTables).mockResolvedValue({ tables: mockTables });
  vi.mocked(apiClient.getCatalog).mockResolvedValue({ files: [], last_session: null, sessions: [] });
  vi.mocked(apiClient.scanConnector).mockResolvedValue({ total_pii_found: 1 } as any);
  vi.mocked(apiClient.scanMetadata).mockResolvedValue({ files: [{ is_folder: false, file_name: 'table_1', metadata: { flagged_columns: [], scan_mode: 'METADATA_ONLY' } }] } as any);
  vi.mocked(apiClient.deductCredits).mockResolvedValue({} as any);
});

afterEach(() => {
  vi.useRealTimers();
});

const { authState } = vi.hoisted(() => ({ authState: { token: 'mock-token' } }));
vi.mock('@/lib/authContext', () => ({
  useAuth: () => ({ isLoggedIn: true, token: authState.token, user: {} })
}));

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
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="document-viewer-modal-mock">Mock Modal</div>;
  }
}));

const setupAndScan = async (scanModeValue: string) => {
    let resolveScan: any;
    if (scanModeValue === 'metadata_only') {
        vi.mocked(apiClient.scanMetadata).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    } else {
        vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    }

    const { unmount } = render(<DatabaseScanTab modelCatalogue={[]} />);
    
    // Auth
    fireEvent.change(screen.getByPlaceholderText(/localhost/i), { target: { value: 'localhost' } });
    fireEvent.change(screen.getByPlaceholderText('5432'), { target: { value: '5433' } });
    fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'db' } });
    fireEvent.change(screen.getByPlaceholderText(/db_user/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'pw-secret-1' } });
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    // Browse
    await waitFor(() => expect(screen.getByText(/Total Tables/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());
    
    // Check initial modal absence
    expect(screen.queryByTestId('document-viewer-modal-mock')).not.toBeInTheDocument();
    expect(capturedProps).toBeNull();

    // Select table_1
    const checkboxes = screen.getAllByRole('checkbox');
    await act(async () => { fireEvent.click(checkboxes[1]); });
    
    // Trigger scan
    await waitFor(() => expect(screen.getByRole('button', { name: /Scan Now/i })).not.toBeDisabled());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: scanModeValue } });
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Scan Now/i }));
    });
    
    // Resolve scan
    await act(async () => { 
        if (scanModeValue === 'metadata_only') {
            resolveScan({ files: [{ is_folder: false, file_name: 'table_1', metadata: { flagged_columns: [], scan_mode: 'METADATA_ONLY' } }] });
        } else {
            resolveScan({ total_pii_found: 1 });
        }
    });
    
    // Wait for completion
    await waitFor(() => {
        expect(screen.getByText(/Scan Complete/i)).toBeInTheDocument();
    });

    // Open viewer
    const openBtn = screen.getByTestId('open-db.public.table_1');
    await act(async () => {
        fireEvent.click(openBtn);
    });

    return { unmount };
};

const assertProjectionContext = (expectedMode: string) => {
    expect(screen.getByTestId('document-viewer-modal-mock')).toBeInTheDocument();
    expect(capturedProps.credentials).toEqual({}); // Rule E
    expect(capturedProps.projectionContext).toBeDefined();
    expect(capturedProps.projectionContext.scanMode).toBe(expectedMode);
    expect(capturedProps.projectionContext.table).toBe('table_1');
    expect(capturedProps.projectionContext.connection).toStrictEqual({
        host: 'localhost',
        port: '5433',
        database: 'db',
        user: 'user',
        password: 'pw-secret-1'
    });
};

describe('Table Projection Context Injection', () => {
    it('provides full scan context by default', async () => {
        const { unmount } = await setupAndScan('full');
        assertProjectionContext('full');
        unmount();
    });

    it('provides sampling scan context', async () => {
        const { unmount } = await setupAndScan('sampling');
        assertProjectionContext('sampling');
        unmount();
    });

    it('provides metadata scan context', async () => {
        const { unmount } = await setupAndScan('metadata_only');
        assertProjectionContext('metadata_only');
        unmount();
    });

    it('renders no modal before a scan', async () => {
        render(<DatabaseScanTab modelCatalogue={[]} />);
        expect(screen.queryByTestId('document-viewer-modal-mock')).not.toBeInTheDocument();
        expect(capturedProps).toBeNull(); // Rule D
    });
});
