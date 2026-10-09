import React from 'react';
import { TableProjectionResponse, ProjectionColumn, ProjectionCell } from '@/lib/apiClient';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const PROJECTION_CONNECTORS = ['postgresql'];

interface TableProjectionViewProps {
  status: 'loading' | 'error' | 'loaded';
  data: TableProjectionResponse | null;
  errorMessage: string | null;
  onRetry: () => void;
}

export function TableProjectionView({ status, data, errorMessage, onRetry }: TableProjectionViewProps) {
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
                        <span className="font-mono text-sm whitespace-pre-wrap break-words">{cell.value}</span>
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
