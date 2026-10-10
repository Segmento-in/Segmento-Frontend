import React from 'react';
import { TableProjectionResponse, ProjectionColumn, ProjectionCell } from '@/lib/apiClient';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { PII_LABEL_COLORS } from './ModelShowdown';

const ALIAS_MAP: Record<string, string> = {
  'EMAIL_ADDRESS': 'EMAIL'
};

function getPiiColors(label: string) {
  const upper = (label || '').toUpperCase();
  if (PII_LABEL_COLORS[upper]) return PII_LABEL_COLORS[upper];
  if (ALIAS_MAP[upper] && PII_LABEL_COLORS[ALIAS_MAP[upper]]) return PII_LABEL_COLORS[ALIAS_MAP[upper]];
  return PII_LABEL_COLORS['DEFAULT'];
}

function renderCellWithFindings(value: string, findings: any[] = []) {
  if (!findings || findings.length === 0) {
    return value;
  }

  const validFindings = findings
    .map(f => ({
      ...f,
      start: Math.max(0, f.start),
      end: Math.min(value.length, f.end)
    }))
    .filter(f => f.start < f.end && f.start < value.length && f.end > 0)
    .sort((a, b) => a.start - b.start);

  const nonOverlapping = [];
  let lastEnd = -1;
  for (const f of validFindings) {
    if (f.start >= lastEnd) {
      nonOverlapping.push(f);
      lastEnd = f.end;
    }
  }

  const segments: React.ReactNode[] = [];
  let cursor = 0;
  
  nonOverlapping.forEach((f, i) => {
    if (f.start > cursor) {
      segments.push(<span key={`text-${i}`}>{value.slice(cursor, f.start)}</span>);
    }
    const color = getPiiColors(f.label);
    segments.push(
      <mark key={`mark-${i}`} title={f.label} className={`inline-block mx-0.5 px-1 rounded font-medium ${color.bg} ${color.text}`}>
        {value.slice(f.start, f.end)}
        <span className="ml-1 text-[8px] uppercase opacity-70 align-top">{f.label}</span>
      </mark>
    );
    cursor = f.end;
  });

  if (cursor < value.length) {
    segments.push(<span key="end">{value.slice(cursor)}</span>);
  }

  return segments;
}

function renderMaskedCell(value: string, findings: ProjectionCell['findings']) {
  if (!findings || findings.length === 0) return value;
  for (const f of findings) {
    if (!Number.isInteger(f.start) || !Number.isInteger(f.end) || f.start < 0 || f.end > value.length || f.start >= f.end) {
      return <mark className="inline-block mx-0.5 px-1 rounded font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">******</mark>;
    }
  }
  const sorted = [...findings].sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number; label: string }[] = [];
  for (const f of sorted) {
    if (merged.length === 0) {
      merged.push({ start: f.start, end: f.end, label: f.label });
    } else {
      const last = merged[merged.length - 1];
      if (f.start <= last.end) {
        last.end = Math.max(last.end, f.end);
      } else {
        merged.push({ start: f.start, end: f.end, label: f.label });
      }
    }
  }
  const segments: React.ReactNode[] = [];
  let cursor = 0;
  merged.forEach((m, idx) => {
    if (m.start > cursor) {
      segments.push(<span key={`text-${idx}`}>{value.slice(cursor, m.start)}</span>);
    }
    const color = getPiiColors(m.label);
    segments.push(
      <mark key={`mark-${idx}`} title={m.label} className={`inline-block mx-0.5 px-1 rounded font-medium ${color.bg} ${color.text}`}>
        ******
        <span className="ml-1 text-[8px] uppercase opacity-70 align-top">{m.label}</span>
      </mark>
    );
    cursor = m.end;
  });
  if (cursor < value.length) {
    segments.push(<span key="end">{value.slice(cursor)}</span>);
  }
  return segments;
}

function ColumnBadge({ col }: { col: ProjectionColumn }) {
  const tip = col.total_cells === 1
    ? `${col.flagged_cells} of 1 cell contains PII`
    : `${col.flagged_cells} of ${col.total_cells} cells contain PII`;
  if (col.verdict === null) {
    return (
      <span data-testid="column-badge" title={tip} aria-label={tip}
        className="self-start px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        clean
      </span>
    );
  }
  const color = getPiiColors(col.verdict);
  const cellWord = col.total_cells === 1 ? 'cell' : 'cells';
  return (
    <span data-testid="column-badge" title={tip} aria-label={tip}
      className={`self-start px-2 py-0.5 rounded text-[11px] font-medium ${color.bg} ${color.text}`}>
      {`${col.verdict} · ${col.verdict_cells} of ${col.total_cells} ${cellWord}`}
    </span>
  );
}

export const PROJECTION_CONNECTORS = ['postgresql'];

interface TableProjectionViewProps {
  status: 'loading' | 'error' | 'loaded';
  data: TableProjectionResponse | null;
  errorMessage: string | null;
  onRetry: () => void;
  viewMode?: 'raw' | 'masked';
}

export function TableProjectionView({ status, data, errorMessage, onRetry, viewMode }: TableProjectionViewProps) {
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 h-full min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p className="text-sm font-medium animate-pulse">Loading rows...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 h-full min-h-[300px]">
        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-800/30 flex flex-col items-center max-w-md text-center shadow-sm">
          <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
          <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Failed to Load Table View</h4>
          <p className="text-sm text-red-600 dark:text-red-300 mb-5">{errorMessage}</p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (data.displayed_rows === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 h-full min-h-[300px]">
        <p className="text-sm font-medium">No rows found.</p>
      </div>
    );
  }

  const rowCountText = data.displayed_rows === 1 ? '1 row' : `${data.displayed_rows} rows`;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B1120]">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
          Showing {rowCountText} from this table. Counts in PII Analytics come from the scan sample.
        </p>
      </div>

      <div className="flex-1 overflow-auto max-h-[60vh]">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-700">
            <tr>
              {data.columns.map((col: ProjectionColumn, idx: number) => (
                <th
                  key={idx}
                  className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-1.5">
                    <span>{col.name}</span>
                    <ColumnBadge col={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {data.rows.map((row: ProjectionCell[], rowIdx: number) => (
              <tr
                key={rowIdx}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                {row.map((cell: ProjectionCell, cellIdx: number) => {
                  return (
                    <td
                      key={cellIdx}
                      className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top"
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-sm whitespace-pre-wrap break-words">
                          {viewMode === 'raw' ? renderCellWithFindings(cell.value, cell.findings) : renderMaskedCell(cell.value, cell.findings)}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
