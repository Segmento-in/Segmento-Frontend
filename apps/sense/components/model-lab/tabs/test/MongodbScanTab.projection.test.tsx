import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import MongodbScanTab from '../MongodbScanTab';
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
      listMongodbCollections: vi.fn().mockResolvedValue({ tables: mockTables }),
      getDbCatalog: vi.fn().mockResolvedValue({ files: [], last_session: null, sessions: [] }),
      scanConnector: vi.fn(),
      scanMetadata: vi.fn(),
      deductCredits: vi.fn().mockResolvedValue(undefined),
    }
  };
});

const modalSpy = vi.hoisted(() => ({ calls: [] as any[] }));

vi.mock('../../DocumentViewerModal', () => ({
  default: (props: any) => {
    modalSpy.calls.push(props);
    return (
      <div data-testid="document-viewer-modal-mock">
        <button data-testid="close-modal" onClick={props.onClose}>close</button>
      </div>
    );
  }
}));

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

beforeEach(() => {
  modalSpy.calls = [];
  const mockTables = Array.from({ length: 25 }, (_, i) => `table_${i + 1}`);
  vi.mocked(apiClient.listMongodbCollections).mockResolvedValue({ tables: mockTables });
  vi.mocked(apiClient.getDbCatalog).mockResolvedValue({ files: [], last_session: null, sessions: [] });
  vi.mocked(apiClient.scanConnector).mockResolvedValue({ total_pii_found: 1 } as any);
  vi.mocked(apiClient.scanMetadata).mockResolvedValue({ files: [] } as any);
  vi.mocked(apiClient.deductCredits).mockResolvedValue({} as any);
});

afterEach(() => {
  vi.useRealTimers();
});

const fillAuthAndConnect = async (container: HTMLElement) => {
  fireEvent.change(screen.getByPlaceholderText(/localhost/i), { target: { value: '127.0.0.1' } });
  fireEvent.change(screen.getByPlaceholderText(/my_database/i), { target: { value: 'testdb' } });
  fireEvent.change(screen.getByPlaceholderText(/admin/i), { target: { value: 'admin' } });
  const passwordInput = container.querySelector('input[type="password"]')!;
  fireEvent.change(passwordInput, { target: { value: 'pass123' } });
  fireEvent.click(screen.getByRole('button', { name: /Connect & List Collections/i }));
  await waitFor(() => expect(screen.getByText(/Select Collections/i)).toBeInTheDocument());
};

describe('MongodbScanTab projectionContext', () => {
  it('mongodb-ctx A: Full Deep Scan, open table_1 -> projectionContext equals scanMode full, the typed connection, table table_1', async () => {
    const catalogWithTable1 = {
      files: [{
        file_id: 'db.table_1',
        file_name: 'table_1',
        is_folder: false,
        connector_type: 'mongodb',
        classification: 'SENSITIVE',
        metadata: { pii_types: {}, flagged_columns: [] }
      } as any],
      last_session: null,
      sessions: []
    };
    vi.mocked(apiClient.getDbCatalog)
      .mockResolvedValueOnce({ files: [], last_session: null, sessions: [] })
      .mockResolvedValueOnce(catalogWithTable1)
      .mockResolvedValue(catalogWithTable1);

    const { container, unmount } = render(<MongodbScanTab modelCatalogue={[]} />);

    await fillAuthAndConnect(container);
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());

    const tableDiv = screen.getByText('table_1');
    await act(async () => { fireEvent.click(tableDiv); });

    await waitFor(() => expect(screen.getByRole('button', { name: /Full Deep Scan/i })).not.toBeDisabled());
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Full Deep Scan/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Scanned')).toBeInTheDocument();
    });

    const openBtn = await screen.findByTestId('open-db.table_1');
    await act(async () => {
      fireEvent.click(openBtn);
    });

    // Regression guards pass at RED
    expect(screen.getByTestId('document-viewer-modal-mock')).toBeInTheDocument();
    const lastProps = modalSpy.calls[modalSpy.calls.length - 1];
    expect(lastProps.authType).toBe('mongodb');
    expect(lastProps.credentials).toEqual({});

    // Target assertion fails at RED
    expect(lastProps.projectionContext).toEqual({
      scanMode: 'full',
      connection: {
        host: '127.0.0.1',
        port: '27017',
        database: 'testdb',
        user: 'admin',
        password: 'pass123'
      },
      table: 'table_1'
    });

    unmount();
  });

  it('mongodb-ctx B: Metadata Scan, open table_1 -> projectionContext.scanMode is metadata_only, table table_1, connection has the typed values', async () => {
    const catalogWithTable1 = {
      files: [{
        file_id: 'db.table_1',
        file_name: 'table_1',
        is_folder: false,
        connector_type: 'mongodb',
        classification: 'SENSITIVE',
        metadata: { pii_types: {}, flagged_columns: [] }
      } as any],
      last_session: null,
      sessions: []
    };
    vi.mocked(apiClient.getDbCatalog)
      .mockResolvedValueOnce({ files: [], last_session: null, sessions: [] })
      .mockResolvedValueOnce(catalogWithTable1)
      .mockResolvedValue(catalogWithTable1);

    vi.mocked(apiClient.scanMetadata).mockResolvedValue({
      files: [{ file_name: 'table_1', is_folder: false, metadata: { flagged_columns: [] } }]
    } as any);

    const { container, unmount } = render(<MongodbScanTab modelCatalogue={[]} />);

    await fillAuthAndConnect(container);
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());

    const tableDiv = screen.getByText('table_1');
    await act(async () => { fireEvent.click(tableDiv); });

    await waitFor(() => expect(screen.getByRole('button', { name: /Metadata Scan/i })).not.toBeDisabled());
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Metadata Scan/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Scanned')).toBeInTheDocument();
    });

    const openBtn = await screen.findByTestId('open-db.table_1');
    await act(async () => {
      fireEvent.click(openBtn);
    });

    // Regression guards pass at RED
    expect(screen.getByTestId('document-viewer-modal-mock')).toBeInTheDocument();
    const lastProps = modalSpy.calls[modalSpy.calls.length - 1];
    expect(lastProps.authType).toBe('mongodb');
    expect(lastProps.credentials).toEqual({});

    // Target assertions fail at RED
    expect(lastProps.projectionContext?.scanMode).toBe('metadata_only');
    expect(lastProps.projectionContext?.table).toBe('table_1');
    expect(lastProps.projectionContext?.connection).toEqual({
      host: '127.0.0.1',
      port: '27017',
      database: 'testdb',
      user: 'admin',
      password: 'pass123'
    });

    unmount();
  });

  it('mongodb-ctx C: Full Deep Scan on table_1 and table_2, open table_1 then close then open table_2 -> projectionContext.table follows the opened table each time', async () => {
    const catalogWithTwoTables = {
      files: [
        {
          file_id: 'db.table_1',
          file_name: 'table_1',
          is_folder: false,
          connector_type: 'mongodb',
          classification: 'SENSITIVE',
          metadata: { pii_types: {}, flagged_columns: [] }
        } as any,
        {
          file_id: 'db.table_2',
          file_name: 'table_2',
          is_folder: false,
          connector_type: 'mongodb',
          classification: 'SENSITIVE',
          metadata: { pii_types: {}, flagged_columns: [] }
        } as any
      ],
      last_session: null,
      sessions: []
    };
    vi.mocked(apiClient.getDbCatalog)
      .mockResolvedValueOnce({ files: [], last_session: null, sessions: [] })
      .mockResolvedValueOnce(catalogWithTwoTables)
      .mockResolvedValue(catalogWithTwoTables);

    const { container, unmount } = render(<MongodbScanTab modelCatalogue={[]} />);

    await fillAuthAndConnect(container);
    await waitFor(() => expect(screen.getByText('table_1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('table_2')).toBeInTheDocument());

    await act(async () => { fireEvent.click(screen.getByText('table_1')); });
    await act(async () => { fireEvent.click(screen.getByText('table_2')); });

    await waitFor(() => expect(screen.getByRole('button', { name: /Full Deep Scan/i })).not.toBeDisabled());
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Full Deep Scan/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Scanned')).toBeInTheDocument();
    });

    // Open table_1
    const openBtn1 = await screen.findByTestId('open-db.table_1');
    await act(async () => {
      fireEvent.click(openBtn1);
    });

    expect(screen.getByTestId('document-viewer-modal-mock')).toBeInTheDocument();
    const propsTable1 = modalSpy.calls[modalSpy.calls.length - 1];
    expect(propsTable1.authType).toBe('mongodb');
    expect(propsTable1.credentials).toEqual({});
    expect(propsTable1.projectionContext?.table).toBe('table_1');
    expect(propsTable1.projectionContext?.scanMode).toBe('full');

    // Close modal
    await act(async () => {
      fireEvent.click(screen.getByTestId('close-modal'));
    });
    await waitFor(() => expect(screen.queryByTestId('document-viewer-modal-mock')).toBeNull());

    // Open table_2
    const openBtn2 = await screen.findByTestId('open-db.table_2');
    await act(async () => {
      fireEvent.click(openBtn2);
    });

    expect(screen.getByTestId('document-viewer-modal-mock')).toBeInTheDocument();
    const propsTable2 = modalSpy.calls[modalSpy.calls.length - 1];
    expect(propsTable2.authType).toBe('mongodb');
    expect(propsTable2.credentials).toEqual({});
    expect(propsTable2.projectionContext?.table).toBe('table_2');
    expect(propsTable2.projectionContext?.scanMode).toBe('full');

    unmount();
  });
});
