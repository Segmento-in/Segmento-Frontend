import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import DocumentViewerModal from './DocumentViewerModal';
import { apiClient } from '@/lib/apiClient';

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/lib/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    getFileText: vi.fn(),
    reviewEntity: vi.fn(),
    projectConnector: vi.fn(),
  }
}));

vi.mock('@/components/pii-demo/PIIAnalytics', () => ({
  PIIAnalytics: () => <div data-testid="pii-analytics-mock">Analytics Content</div>
}));
vi.mock('@/components/pii-demo/Inspector', () => ({
  Inspector: () => <div data-testid="inspector-mock" />
}));

function createDeferred() {
  let resolve!: (value: any) => void;
  let reject!: (reason?: any) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('DocumentViewerModal - Table Projection', () => {
  const mockFileInfo = {
    id: 'file-1',
    name: 'test.csv',
    mimeType: 'text/csv',
    path: '/test.csv'
  } as any;

  const mockScanResult = {
    file_id: 'file-1',
    pii_detected: false,
    pii_count: 0,
    result: { pii_counts: [] },
    scan_data: {}
  } as any;

  const validContext = {
    scanMode: 'sampling',
    connection: { host: 'h', port: 'p', database: 'd', user: 'u', password: 'pw' },
    table: 't1'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 'usr-1', role: 'admin' },
      token: 'fake-token',
      isLoggedIn: true,
    });
  });

  it('case a: no projectionContext -> no Table View tab', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        onClose={() => {}}
      />
    );
    expect(screen.queryByText('Table View')).not.toBeInTheDocument();
  });

  it('case b: projectionContext with scanMode metadata_only -> no tab', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={{ ...validContext, scanMode: 'metadata_only' }}
        onClose={() => {}}
      />
    );
    expect(screen.queryByText('Table View')).not.toBeInTheDocument();
  });

  it('case c: authType mysql with a context -> no tab', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mysql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    expect(screen.queryByText('Table View')).not.toBeInTheDocument();
  });

  it('case d: authType postgresql, scanMode sampling -> tab visible, others still present', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Table View')).toBeInTheDocument();
    expect(screen.getByText('Highlighted Text')).toBeInTheDocument();
    expect(screen.getByText('PII Analytics')).toBeInTheDocument();
  });

  it('case e: clicking tab calls projectConnector ONCE with exact payload', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 0, columns: [], rows: []
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    expect(apiClient.projectConnector).toHaveBeenCalledWith(
      'postgresql',
      { host: 'h', port: 'p', database: 'd', user: 'u', password: 'pw', table: 't1', scan_mode: 'sampling' },
      'fake-token'
    );
    
    await waitFor(() => {
      expect(screen.getByText('No rows found.')).toBeInTheDocument();
    });
  });

  it('case f: loading state visible while request pending', async () => {
    const deferred = createDeferred();
    (apiClient.projectConnector as any).mockReturnValue(deferred.promise);
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    await act(async () => {
      deferred.resolve({ scan_mode: 'sampling', row_cap: 5, displayed_rows: 0, columns: [], rows: [] });
    });
  });

  it('case g: loaded -> shows 2 rows text, column names, cell values, no "first"', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 2,
      columns: [
        { name: 'colA', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 2 },
        { name: 'colB', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 2 }
      ],
      rows: [
        [{ value: 'val1A', findings: [] }, { value: 'val1B', findings: [] }],
        [{ value: 'val2A', findings: [] }, { value: 'val2B', findings: [] }]
      ]
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    
    await waitFor(() => {
      expect(screen.getByText('colA')).toBeInTheDocument();
    });
    
    expect(screen.getByText('colB')).toBeInTheDocument();
    expect(screen.getByText('val1A')).toBeInTheDocument();
    expect(screen.getByText('val2B')).toBeInTheDocument();
    
    const header = screen.getByText('Showing 2 rows from this table. Counts in PII Analytics come from the scan sample.');
    expect(header).toBeInTheDocument();
    expect(screen.queryByText(/first/i)).not.toBeInTheDocument();
  });

  it('case g (1 row): loaded -> shows 1 row text', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 50,
      displayed_rows: 1,
      columns: [{ name: 'colX', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'valX', findings: [] }]]
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => {
      expect(screen.getByText('Showing 1 row from this table. Counts in PII Analytics come from the scan sample.')).toBeInTheDocument();
    });
  });

  it('case h: zero rows -> "No rows found."', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 0, columns: [], rows: []
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    fireEvent.click(screen.getByText('Table View'));
    
    await waitFor(() => {
      expect(screen.getByText('No rows found.')).toBeInTheDocument();
    });
  });

  it('case i: error -> message + Retry button -> click Retry -> rows show', async () => {
    (apiClient.projectConnector as any).mockRejectedValueOnce(new Error('Network failure'));
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    
    await waitFor(() => {
      expect(screen.getByText('Network failure')).toBeInTheDocument();
    });
    
    const retryBtn = screen.getByRole('button', { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();
    
    (apiClient.projectConnector as any).mockResolvedValueOnce({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 0, columns: [], rows: []
    });
    
    fireEvent.click(retryBtn);
    
    await waitFor(() => {
      expect(screen.getByText('No rows found.')).toBeInTheDocument();
    });
  });

  it('case j: switch tab and back after loading -> still ONE call in total; grid still there', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'KeepCol', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'KeepVal', findings: [] }]]
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    
    await waitFor(() => {
      expect(screen.getByText('KeepVal')).toBeInTheDocument();
    });
    
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('PII Analytics'));
    expect(screen.queryByText('KeepVal')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Table View'));
    expect(screen.getByText('KeepVal')).toBeInTheDocument();
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
  });

  it('case k: click Table View, click another tab while pending, resolve, click Table View -> rows on screen', async () => {
    const deferred = createDeferred();
    (apiClient.projectConnector as any).mockReturnValue(deferred.promise);
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('PII Analytics'));
    
    await act(async () => {
      deferred.resolve({
        scan_mode: 'sampling',
        row_cap: 5,
        displayed_rows: 1,
        columns: [{ name: 'TrapCol', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
        rows: [[{ value: 'TrapVal', findings: [] }]]
      });
    });
    
    fireEvent.click(screen.getByText('Table View'));
    
    await waitFor(() => {
      expect(screen.getByText('TrapVal')).toBeInTheDocument();
    });
  });

  it('case l: existing tabs still render as before', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText(/Schema Map View/i)).toBeInTheDocument();
  });

  it('case m: error, click Retry, retry fails -> 2 calls total, error visible', async () => {
    (apiClient.projectConnector as any).mockRejectedValueOnce(new Error('First fail'));
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText('First fail')).toBeInTheDocument());
    
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    
    (apiClient.projectConnector as any).mockRejectedValueOnce(new Error('Second fail'));
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    
    await waitFor(() => expect(screen.getByText('Second fail')).toBeInTheDocument());
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('case n: response with verdict chip and findings -> screen shows cell value, no verdict chips or findings', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'colE', verdict: 'EMAIL_ADDRESS', verdict_cells: 1, flagged_cells: 1, total_cells: 1 }],
      rows: [[{ value: 'alice@example.com', findings: [{ label: 'EMAIL_ADDRESS', start: 0, end: 17, score: 0.9 }] }]]
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText('alice@example.com')).toBeInTheDocument());
    
    expect(screen.queryByText('EMAIL_ADDRESS')).not.toBeInTheDocument();
  });

  it('case o: 120 character cell value -> no truncate class', async () => {
    const longValue = 'A'.repeat(120);
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'colL', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: longValue, findings: [] }]]
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="postgresql"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(longValue)).toBeInTheDocument());
    
    const cellElement = screen.getByText(longValue);
    expect(cellElement).not.toHaveClass('truncate');
  });
});
