import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import DocumentViewerModal from './DocumentViewerModal';
import { apiClient } from '@/lib/apiClient';
import { PII_LABEL_COLORS } from './ModelShowdown';
import { TableProjectionView } from './TableProjectionView';

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

  it('case c: authType slack with a context -> no tab (updated in ticket 8, mysql is now supported)', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="slack"
        projectionContext={validContext}
        onClose={() => {}}
      />
    );
    expect(screen.queryByText('Table View')).not.toBeInTheDocument();
  });

  it('mysql 1: authType mysql, scanMode sampling -> tab visible', () => {
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
    expect(screen.getByText('Table View')).toBeInTheDocument();
  });

  it('mysql 2: clicking tab calls projectConnector ONCE with exact mysql payload', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 0, columns: [], rows: []
    });
    
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
    
    fireEvent.click(screen.getByText('Table View'));
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    expect(apiClient.projectConnector).toHaveBeenCalledWith(
      'mysql',
      { host: 'h', port: 'p', database: 'd', user: 'u', password: 'pw', table: 't1', scan_mode: 'sampling' },
      'fake-token'
    );
  });

  it('mysql 3: loading state visible while request pending for mysql', async () => {
    const deferred = createDeferred();
    (apiClient.projectConnector as any).mockReturnValue(deferred.promise);
    
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
    
    fireEvent.click(screen.getByText('Table View'));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('mysql 4: zero rows -> "No rows found." for mysql', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 0, columns: [], rows: []
    });
    
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
    fireEvent.click(screen.getByText('Table View'));
    
    await waitFor(() => {
      expect(screen.getByText('No rows found.')).toBeInTheDocument();
    });
  });

  it('mysql 5: loaded -> shows rows text for mysql', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'colM', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'mysql_value', findings: [] }]]
    });
    
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
    
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => {
      expect(screen.getByText('mysql_value')).toBeInTheDocument();
    });
  });

  it('mysql 6: authType "mysql", projectionContext scanMode "metadata_only": NO "Table View" tab', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mysql"
        projectionContext={{ ...validContext, scanMode: 'metadata_only' }}
        onClose={() => {}}
      />
    );
    expect(screen.queryByText('Table View')).not.toBeInTheDocument();
  });

  it('mysql 7: authType "postgresql", scanMode sampling: the tab is visible; click it; apiClient.projectConnector is called ONCE and its first argument is \'postgresql\'', async () => {
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
    
    expect(screen.getByText('Table View')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Table View'));
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    expect(apiClient.projectConnector).toHaveBeenCalledWith(
      'postgresql',
      expect.anything(),
      expect.anything()
    );
  });

  it('mysql 8: authType "mysql", scanMode "full": tab visible; click it; projectConnector called ONCE with exact payload', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'full', row_cap: 50, displayed_rows: 0, columns: [], rows: []
    });
    
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mysql"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('Table View')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Table View'));
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    expect(apiClient.projectConnector).toHaveBeenCalledWith(
      'mysql',
      { host: 'h', port: 'p', database: 'd', user: 'u', password: 'pw', table: 't1', scan_mode: 'full' },
      'fake-token'
    );
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

  it('case n (updated in ticket 5): column verdict shown in the Column Badge', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'colE', verdict: 'ZZ_COLUMN_VERDICT', verdict_cells: 1, flagged_cells: 1, total_cells: 1 }],
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
    
    expect(screen.getByText('ZZ_COLUMN_VERDICT · 1 of 1 cell')).toBeInTheDocument();
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

  it('highlight 1: a cell with one finding -> exactly one <mark> in the grid whose own text is the span; the plain text before and after it is still there.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'prefix alice@example.com suffix', findings: [{ label: 'EMAIL', start: 7, end: 24, score: 0.9 }] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(/prefix/)).toBeInTheDocument());
    
    const marks = screen.getAllByRole('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('alice@example.com');
    const container = screen.getByText(/prefix/).parentElement;
    expect(container?.textContent?.replace('EMAIL', '')).toBe('prefix alice@example.com suffix');
  });

  it('highlight 2: a cell with two findings -> two marks; the text between them is preserved.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'bob@example.com and charlie@example.com', findings: [
        { label: 'EMAIL', start: 0, end: 15, score: 0.9 },
        { label: 'EMAIL', start: 20, end: 39, score: 0.9 }
      ] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(/and/)).toBeInTheDocument());
    
    const marks = screen.getAllByRole('mark');
    expect(marks).toHaveLength(2);
    expect(marks[0]).toHaveTextContent('bob@example.com');
    expect(marks[1]).toHaveTextContent('charlie@example.com');
    const container = screen.getByText(/and/).parentElement;
    expect(container?.textContent?.replace(/EMAIL/g, '')).toBe('bob@example.com and charlie@example.com');
  });

  it('highlight 3: a clean cell -> no <mark> in that cell.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'clean text', findings: [] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText('clean text')).toBeInTheDocument());
    
    const marks = screen.queryAllByRole('mark');
    expect(marks).toHaveLength(0);
  });

  it('highlight 4: an unknown label -> the mark classes equal the DEFAULT entry bg and text classes.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'some text', findings: [{ label: 'ZZ_NOT_A_LABEL', start: 0, end: 9, score: 0.9 }] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(/some text/)).toBeInTheDocument());
    
    const mark = screen.getByRole('mark');
    const def = PII_LABEL_COLORS['DEFAULT'];
    const expectedClasses = `${def.bg} ${def.text}`.split(' ');
    expectedClasses.forEach(c => expect(mark).toHaveClass(c));
  });

  it('highlight 5: an EMAIL_ADDRESS mark does NOT carry the DEFAULT colour classes; it carries the EMAIL colours.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'dave@example.com', findings: [{ label: 'EMAIL_ADDRESS', start: 0, end: 16, score: 0.9 }] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(/dave@example.com/)).toBeInTheDocument());
    
    const mark = screen.getByRole('mark');
    const emailColor = PII_LABEL_COLORS['EMAIL'];
    const expectedClasses = `${emailColor.bg} ${emailColor.text}`.split(' ');
    expectedClasses.forEach(c => expect(mark).toHaveClass(c));
  });

  it('highlight 6: out-of-range offsets, start >= end, and overlapping findings -> no crash; invalid ones render as plain text; the text stays intact.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'unique_text', findings: [
        { label: 'EMAIL', start: -5, end: 2, score: 0.9 }, // out of bounds
        { label: 'EMAIL', start: 2, end: 1, score: 0.9 }, // start >= end
        { label: 'EMAIL', start: 10, end: 15, score: 0.9 }, // out of bounds
        { label: 'EMAIL', start: 0, end: 4, score: 0.9 }, // valid
        { label: 'EMAIL', start: 1, end: 3, score: 0.9 } // overlapping
      ] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(/ique_tex/)).toBeInTheDocument());
    
    const container = screen.getByText(/ique_tex/).parentElement;
    expect(container?.textContent?.replace(/EMAIL/g, '')).toBe('unique_text');
  });

  it('highlight 7: the mark title equals the label and does not contain the cell text.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'secret text', findings: [{ label: 'SECRET_LABEL', start: 0, end: 11, score: 0.9 }] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(/secret text/)).toBeInTheDocument());
    
    const mark = screen.getByRole('mark');
    expect(mark).toHaveAttribute('title', 'SECRET_LABEL');
  });
  it('badge 1: verdict EMAIL_ADDRESS, verdict_cells 3, total_cells 5 -> badge text "EMAIL_ADDRESS · 3 of 5 cells".', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 5,
      columns: [{ name: 'col1', verdict: 'EMAIL_ADDRESS', verdict_cells: 3, flagged_cells: 3, total_cells: 5 }],
      rows: Array(5).fill([{ value: 'v', findings: [] }])
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());
    
    const badge = screen.getByTestId('column-badge');
    expect(badge).toHaveTextContent('EMAIL_ADDRESS · 3 of 5 cells');
  });

  it('badge 2: total_cells 1, verdict_cells 1, flagged_cells 1 -> text ends "1 of 1 cell" and title AND aria-label are "1 of 1 cell contains PII".', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col2', verdict: 'SOME_LABEL', verdict_cells: 1, flagged_cells: 1, total_cells: 1 }],
      rows: [[{ value: 'v', findings: [] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());
    
    const badge = screen.getByTestId('column-badge');
    expect(badge).toHaveTextContent(/1 of 1 cell$/);
    expect(badge).toHaveAttribute('title', '1 of 1 cell contains PII');
    expect(badge).toHaveAttribute('aria-label', '1 of 1 cell contains PII');
  });

  it('badge 3: verdict null -> text "clean".', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 2,
      columns: [{ name: 'col3', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 2 }],
      rows: [[{ value: 'v', findings: [] }], [{ value: 'v', findings: [] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());
    
    const badge = screen.getByTestId('column-badge');
    expect(badge).toHaveTextContent('clean');
  });

  it('badge 4: flagged_cells 4, total_cells 5 -> title AND aria-label are "4 of 5 cells contain PII".', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 5,
      columns: [{ name: 'col4', verdict: 'A_LABEL', verdict_cells: 2, flagged_cells: 4, total_cells: 5 }],
      rows: Array(5).fill([{ value: 'v', findings: [] }])
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());
    
    const badge = screen.getByTestId('column-badge');
    expect(badge).toHaveAttribute('title', '4 of 5 cells contain PII');
    expect(badge).toHaveAttribute('aria-label', '4 of 5 cells contain PII');
  });

  it('badge 5: verdict EMAIL_ADDRESS -> badge has every class of PII_LABEL_COLORS[\'EMAIL\'] bg and text, and has NONE of the DEFAULT bg and text classes.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col5', verdict: 'EMAIL_ADDRESS', verdict_cells: 1, flagged_cells: 1, total_cells: 1 }],
      rows: [[{ value: 'v', findings: [] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());
    
    const badge = screen.getByTestId('column-badge');
    const emailColor = PII_LABEL_COLORS['EMAIL'];
    const defColor = PII_LABEL_COLORS['DEFAULT'];
    
    const expectedClasses = `${emailColor.bg} ${emailColor.text}`.split(' ');
    expectedClasses.forEach(c => expect(badge).toHaveClass(c));
    
    const defClasses = `${defColor.bg} ${defColor.text}`.split(' ');
    defClasses.forEach(c => {
      if (!expectedClasses.includes(c)) {
        expect(badge).not.toHaveClass(c);
      }
    });
  });

  it('badge 6: verdict ZZ_NOT_A_LABEL -> badge has every DEFAULT bg and text class.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col6', verdict: 'ZZ_NOT_A_LABEL', verdict_cells: 1, flagged_cells: 1, total_cells: 1 }],
      rows: [[{ value: 'v', findings: [] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());
    
    const badge = screen.getByTestId('column-badge');
    const defColor = PII_LABEL_COLORS['DEFAULT'];
    
    const expectedClasses = `${defColor.bg} ${defColor.text}`.split(' ');
    expectedClasses.forEach(c => expect(badge).toHaveClass(c));
  });

  it('badge 7: two columns -> exactly 2 badges, and both column names are still on screen.', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [
        { name: 'colA', verdict: 'LABEL1', verdict_cells: 1, flagged_cells: 1, total_cells: 1 },
        { name: 'colB', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }
      ],
      rows: [[{ value: 'v', findings: [] }, { value: 'v', findings: [] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getAllByTestId('column-badge')).toHaveLength(2));
    
    expect(screen.getByText('colA')).toBeInTheDocument();
    expect(screen.getByText('colB')).toBeInTheDocument();
  });

  it('badge 8: a cell value "secret@example.com" with verdict EMAIL_ADDRESS -> badge textContent, title and aria-label do NOT contain "secret@example.com".', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling',
      row_cap: 5,
      displayed_rows: 1,
      columns: [{ name: 'col8', verdict: 'EMAIL_ADDRESS', verdict_cells: 1, flagged_cells: 1, total_cells: 1 }],
      rows: [[{ value: 'secret@example.com', findings: [{ label: 'EMAIL_ADDRESS', start: 0, end: 18, score: 0.9 }] }]]
    });
    
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());
    
    const badge = screen.getByTestId('column-badge');
    expect(badge).not.toHaveTextContent('secret@example.com');
    expect(badge).not.toHaveAttribute('title', expect.stringContaining('secret@example.com'));
    expect(badge).not.toHaveAttribute('aria-label', expect.stringContaining('secret@example.com'));
  });
  const S = "jane.secret@example.org";

  it('masked 1: default is Raw: S is on screen; the Raw button has aria-pressed "true"; the Masked button has aria-pressed "false".', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(new RegExp(S))).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Raw' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Masked' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('masked 2: click Masked: document.body.innerHTML does NOT contain S and DOES contain "******"; the plain text before and after the span is still on screen; getAllByRole(\'mark\') still has 1 mark.', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(new RegExp(S))).toBeInTheDocument());
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    expect(document.body.innerHTML).not.toContain(S);
    expect(document.body.innerHTML).toContain('******');
    expect(screen.getByText(/prefix/)).toBeInTheDocument();
    expect(screen.getByText(/suffix/)).toBeInTheDocument();
    expect(screen.getAllByRole('mark')).toHaveLength(1);
  });

  it('masked 3: Masked, then click Raw: S is back and the Raw button is pressed again.', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(new RegExp(S))).toBeInTheDocument());
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    expect(document.body.innerHTML).not.toContain(S);
    
    fireEvent.click(screen.getByRole('button', { name: 'Raw' }));
    expect(document.body.innerHTML).toContain(S);
    expect(screen.getByRole('button', { name: 'Raw' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('masked 4: click Masked, switch to the "PII Analytics" tab, switch back to "Table View": still Masked (S not in document.body.innerHTML, Masked button pressed).', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(new RegExp(S))).toBeInTheDocument());
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    fireEvent.click(screen.getByText('PII Analytics'));
    fireEvent.click(screen.getByText('Table View'));
    
    expect(document.body.innerHTML).not.toContain(S);
    expect(screen.getByRole('button', { name: 'Masked' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('masked 5: projectConnector is called exactly once through: Masked, Raw, Masked, a tab switch and back.', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(new RegExp(S))).toBeInTheDocument());
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    fireEvent.click(screen.getByRole('button', { name: 'Raw' }));
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    fireEvent.click(screen.getByText('PII Analytics'));
    fireEvent.click(screen.getByText('Table View'));
    
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
  });

  it('masked 6: one cell with two separate findings, and one cell with two adjacent findings (end of the first equals start of the second): all spans masked, none of the raw spans in document.body.innerHTML.', async () => {
    const val1 = "abc jkl xyz";
    const s1 = "abc";
    const s2 = "xyz";
    const aVal = "foobar";
    const a1 = "foo";
    const a2 = "bar";
    
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 2,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 2 }],
      rows: [
        [{ value: val1, findings: [
          { label: 'L1', start: val1.indexOf(s1), end: val1.indexOf(s1) + s1.length, score: 0.9 },
          { label: 'L2', start: val1.indexOf(s2), end: val1.indexOf(s2) + s2.length, score: 0.9 }
        ] }],
        [{ value: aVal, findings: [
          { label: 'L3', start: 0, end: 3, score: 0.9 },
          { label: 'L4', start: 3, end: 6, score: 0.9 }
        ] }]
      ]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    expect(document.body.innerHTML).not.toContain(s1);
    expect(document.body.innerHTML).not.toContain(s2);
    expect(document.body.innerHTML).not.toContain(a1);
    expect(document.body.innerHTML).not.toContain(a2);
  });

  it('masked 7: overlapping findings that together cover a distinctive token: the union is masked, none of the token in document.body.innerHTML, the plain text around it is still there.', async () => {
    const val = "the quickbrownfox jumps";
    
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [
        { label: 'L1', start: 4, end: 14, score: 0.9 },
        { label: 'L2', start: 9, end: 17, score: 0.9 }
      ] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2));
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    expect(document.body.innerHTML).not.toContain("quickbrownfox");
    expect(screen.getAllByText(/the/)[0]).toBeInTheDocument();
    expect(screen.getByText(/jumps/)).toBeInTheDocument();
  });

  it('masked 8: three cells holding S, each with invalid findings: (a) end beyond value.length, (b) start negative, (c) start === end. In Masked: S is not in document.body.innerHTML and getAllByText(\'******\') has length 3 (whole cell masked).', async () => {
    const val = S;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 3,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 3 }],
      rows: [
        [{ value: val, findings: [{ label: 'L1', start: 0, end: val.length + 5, score: 0.9 }] }],
        [{ value: val, findings: [{ label: 'L1', start: -1, end: 5, score: 0.9 }] }],
        [{ value: val, findings: [{ label: 'L1', start: 2, end: 2, score: 0.9 }] }]
      ]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(4));
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    expect(document.body.innerHTML).not.toContain(S);
    expect(screen.getAllByText('******')).toHaveLength(3);
  });

  it('masked 9: keyboard: both toggle buttons are <button> elements with type "button", are not disabled, and element.focus() makes document.activeElement that button. Do not use user-event.', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByText(new RegExp(S))).toBeInTheDocument());
    
    const rawBtn = screen.getByRole('button', { name: 'Raw' });
    const maskedBtn = screen.getByRole('button', { name: 'Masked' });
    
    expect(rawBtn).toHaveAttribute('type', 'button');
    expect(maskedBtn).toHaveAttribute('type', 'button');
    
    expect(rawBtn).not.toBeDisabled();
    expect(maskedBtn).not.toBeDisabled();
    
    act(() => {
      rawBtn.focus();
    });
    expect(document.activeElement).toBe(rawBtn);
    
    act(() => {
      maskedBtn.focus();
    });
    expect(document.activeElement).toBe(maskedBtn);
  });

  it('masked 10: fail closed: import { TableProjectionView } from \'./TableProjectionView\' (one added import line). Render it DIRECTLY with status "loaded", data holding S in a flagged cell, onRetry as a noop, and NO viewMode prop (cast the props with `as any`). S must NOT be in document.body.innerHTML.', () => {
    const val = `prefix ${S} suffix`;
    const data = {
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    };
    
    render(<TableProjectionView status="loaded" data={data as any} errorMessage={null} onRetry={() => {}} {...({} as any)} />);
    
    expect(document.body.innerHTML).not.toContain(S);
  });

  it('masked 11: three cells holding S with bad offsets that are NOT range errors: (a) start NaN, end 5; (b) start 2.5, end 8.5; (c) start undefined (cast with `as any`), end 5. In Masked: document.body.innerHTML contains none of "jane", "secret", "example.org", and getAllByText(\'******\') has length 3.', async () => {
    const val = S;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 3,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 3 }],
      rows: [
        [{ value: val, findings: [{ label: 'L1', start: NaN, end: 5, score: 0.9 }] }],
        [{ value: val, findings: [{ label: 'L1', start: 2.5, end: 8.5, score: 0.9 }] }],
        [{ value: val, findings: [{ label: 'L1', start: undefined as any, end: 5, score: 0.9 }] }]
      ]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(4));
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    expect(document.body.innerHTML).not.toContain("jane");
    expect(document.body.innerHTML).not.toContain("secret");
    expect(document.body.innerHTML).not.toContain("example.org");
    expect(screen.getAllByText('******')).toHaveLength(3);
  });

  it('masked 12: value `prefix ${S} suffix`, one finding labelled EMAIL (offsets from indexOf). In Masked: the mark has every class of PII_LABEL_COLORS[\'EMAIL\'] bg and text; the mark\'s title attribute is exactly \'EMAIL\'; the mark text contains \'******\' and \'EMAIL\'; S is not in document.body.innerHTML.', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2));
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    expect(document.body.innerHTML).not.toContain(S);
    const marks = document.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    const mark = marks[0];
    expect(mark).toHaveClass(...PII_LABEL_COLORS['EMAIL'].bg.split(' '));
    expect(mark).toHaveClass(...PII_LABEL_COLORS['EMAIL'].text.split(' '));
    expect(mark).toHaveAttribute('title', 'EMAIL');
    expect(mark.textContent).toContain('******');
    expect(mark.textContent).toContain('EMAIL');
  });

  it('masked 13: in Raw View AND after clicking Masked, no element in document.body that has a title attribute has a title containing S.', async () => {
    const val = `prefix ${S} suffix`;
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'sampling', row_cap: 5, displayed_rows: 1,
      columns: [{ name: 'col', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: val, findings: [{ label: 'EMAIL', start: val.indexOf(S), end: val.indexOf(S) + S.length, score: 0.9 }] }]]
    });
    render(<DocumentViewerModal fileInfo={mockFileInfo} scanResult={mockScanResult} credentials={{}} authType="postgresql" projectionContext={validContext} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2));
    
    const rawElementsWithTitle = document.querySelectorAll('[title]');
    rawElementsWithTitle.forEach(el => {
      expect(el.getAttribute('title')).not.toContain(S);
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Masked' }));
    
    const maskedElementsWithTitle = document.querySelectorAll('[title]');
    maskedElementsWithTitle.forEach(el => {
      expect(el.getAttribute('title')).not.toContain(S);
    });
  });

  it('mariadb 1: authType "mariadb", scanMode "full": the "Table View" tab is visible', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mariadb"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Table View')).toBeInTheDocument();
  });

  it('mariadb 2: authType "mariadb", scanMode "full", click "Table View": apiClient.projectConnector called ONCE with exact mariadb payload', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'full', row_cap: 50, displayed_rows: 0, columns: [], rows: []
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mariadb"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Table View'));
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    expect(apiClient.projectConnector).toHaveBeenCalledWith(
      'mariadb',
      { host: 'h', port: 'p', database: 'd', user: 'u', password: 'pw', table: 't1', scan_mode: 'full' },
      'fake-token'
    );
  });

  it('mariadb 3: loading state visible while the request is pending', async () => {
    const deferred = createDeferred();
    (apiClient.projectConnector as any).mockReturnValue(deferred.promise);

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mariadb"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Table View'));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('mariadb 4: zero rows gives "No rows found."', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'full', row_cap: 50, displayed_rows: 0, columns: [], rows: []
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mariadb"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => {
      expect(screen.getByText('No rows found.')).toBeInTheDocument();
    });
  });

  it('mariadb 5: loaded gives the cell value text on screen', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'full',
      row_cap: 50,
      displayed_rows: 1,
      columns: [{ name: 'colMaria', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 1 }],
      rows: [[{ value: 'mariadb_value', findings: [] }]]
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mariadb"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => {
      expect(screen.getByText('mariadb_value')).toBeInTheDocument();
    });
  });

  it('mariadb 6: authType "mariadb", scanMode "metadata_only": NO "Table View" tab', () => {
    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mariadb"
        projectionContext={{ ...validContext, scanMode: 'metadata_only' }}
        onClose={() => {}}
      />
    );
    expect(screen.queryByText('Table View')).not.toBeInTheDocument();
  });

  it('mariadb 7: authType "mysql", scanMode "full": the tab is visible; click it; projectConnector called ONCE and its first argument is "mysql"', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'full', row_cap: 50, displayed_rows: 0, columns: [], rows: []
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mysql"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Table View')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Table View'));
    expect(apiClient.projectConnector).toHaveBeenCalledTimes(1);
    expect(apiClient.projectConnector).toHaveBeenCalledWith(
      'mysql',
      expect.anything(),
      expect.anything()
    );
  });

  it('mariadb 8: authType "mariadb", loaded with one email cell and a column with verdict EMAIL_ADDRESS, verdict_cells 1, total_cells 1, flagged_cells 1: exactly one <mark> in the grid whose own text is the email, AND one badge (data-testid "column-badge") whose text contains "EMAIL_ADDRESS"', async () => {
    (apiClient.projectConnector as any).mockResolvedValue({
      scan_mode: 'full',
      row_cap: 50,
      displayed_rows: 1,
      columns: [{ name: 'col1', verdict: 'EMAIL_ADDRESS', verdict_cells: 1, flagged_cells: 1, total_cells: 1 }],
      rows: [[{ value: 'alice@example.com', findings: [{ label: 'EMAIL_ADDRESS', start: 0, end: 17, score: 0.9 }] }]]
    });

    render(
      <DocumentViewerModal
        fileInfo={mockFileInfo}
        scanResult={mockScanResult}
        credentials={{}}
        authType="mariadb"
        projectionContext={{ ...validContext, scanMode: 'full' }}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Table View'));
    await waitFor(() => expect(screen.getByTestId('column-badge')).toBeInTheDocument());

    const marks = screen.getAllByRole('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('alice@example.com');

    const badge = screen.getByTestId('column-badge');
    expect(badge.textContent).toContain('EMAIL_ADDRESS');
  });
});

