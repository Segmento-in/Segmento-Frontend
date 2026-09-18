import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import AwsGlueScanTab from '../AwsGlueScanTab';
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
      listGlueTables: vi.fn().mockResolvedValue({ tables: mockTables }),
      getDbCatalog: vi.fn().mockResolvedValue({ files: [], last_session: null, sessions: [] }),
      scanConnector: vi.fn(),
      deductCredits: vi.fn().mockResolvedValue(undefined),
    }
  };
});

beforeEach(() => {
  const mockTables = Array.from({ length: 25 }, (_, i) => `table_${i + 1}`);
  vi.mocked(apiClient.listGlueTables).mockResolvedValue({ tables: mockTables });
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

describe('AwsGlueScanTab', () => {
  const setupAndClickScan = async (numTablesToSelect: number) => {
    const { container, unmount } = render(<AwsGlueScanTab modelCatalogue={[]} />);
    
    // Auth inputs: AWS Access Key, AWS Secret Key, AWS Region, Database Name
    const inputs = screen.getAllByRole('textbox');
    const secretInput = screen.getByPlaceholderText(/••••••••/i); // Only one password input
    fireEvent.change(inputs[0], { target: { value: 'access' } }); // Access Key
    fireEvent.change(secretInput, { target: { value: 'secret' } }); // Secret Key
    fireEvent.change(inputs[1], { target: { value: 'us-east-1' } }); // Region
    fireEvent.change(inputs[2], { target: { value: 'db' } }); // Database Name
    
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    await waitFor(() => expect(screen.getByText(/Select Tables/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());
    
    for (let i = 1; i <= numTablesToSelect; i++) {
      await act(async () => { fireEvent.click(screen.getByText(`table_${i}`)); });
    }
    
    await waitFor(() => expect(screen.getByRole('button', { name: /Scan Schema Metadata/i })).not.toBeDisabled());
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Scan Schema Metadata/i }));
    });
    return { container, unmount };
  };

  it('Table list renders correctly and selection works', async () => {
    const { unmount } = render(<AwsGlueScanTab modelCatalogue={[]} />);
    
    const inputs = screen.getAllByRole('textbox');
    const secretInput = screen.getByPlaceholderText(/••••••••/i); // Only one password input
    fireEvent.change(inputs[0], { target: { value: 'access' } }); // Access Key
    fireEvent.change(secretInput, { target: { value: 'secret' } }); // Secret Key
    fireEvent.change(inputs[1], { target: { value: 'us-east-1' } }); // Region
    fireEvent.change(inputs[2], { target: { value: 'db' } }); // Database Name
    
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
    
    expect(tableDiv).toHaveClass('border-orange-500'); // Selected class for AwsGlue
    unmount();
  });

  it('Countdown is absent before scan starts, present once scanning starts (small total)', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan(1); // small bucket
    
    await waitFor(() => expect(screen.getByText('Downloading and scanning schema metadata in-memory…')).toBeInTheDocument());
    expect(screen.getByText('1:00')).toBeInTheDocument();
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('Selecting different combinations of files (large total) lands in the correct bucket', async () => {
    let resolveScan: any;
    vi.mocked(apiClient.scanConnector).mockImplementationOnce(() => new Promise(res => { resolveScan = res; }));
    const { unmount } = await setupAndClickScan(21); // large bucket > 20
    
    await waitFor(() => expect(screen.getByText('Downloading and scanning schema metadata in-memory…')).toBeInTheDocument());
    expect(screen.getByText('10:00')).toBeInTheDocument();
    
    await act(async () => { resolveScan({ total_pii_found: 1 }); });
    unmount();
  });

  it('The "Taking a bit longer than usual..." note appears only after hook reports isFirstExtension: true', async () => {
    vi.mocked(apiClient.scanConnector).mockImplementation(() => new Promise(() => {}));
    vi.useFakeTimers();
    const { unmount } = render(<AwsGlueScanTab modelCatalogue={[]} />);
    
    const inputs = screen.getAllByRole('textbox');
    const secretInput = screen.getByPlaceholderText(/••••••••/i); // Only one password input
    fireEvent.change(inputs[0], { target: { value: 'access' } }); // Access Key
    fireEvent.change(secretInput, { target: { value: 'secret' } }); // Secret Key
    fireEvent.change(inputs[1], { target: { value: 'us-east-1' } }); // Region
    fireEvent.change(inputs[2], { target: { value: 'db' } }); // Database Name
    
    fireEvent.click(screen.getByRole('button', { name: /Connect & List Tables/i }));
    
    await act(async () => {
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    });
    
    fireEvent.click(screen.getByText('table_1'));
    await act(async () => { await Promise.resolve(); });
    
    fireEvent.click(screen.getByRole('button', { name: /Scan Schema Metadata/i }));
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
      expect(screen.getByText('Scanned')).toBeInTheDocument();
    });
    unmount();
  });
});
