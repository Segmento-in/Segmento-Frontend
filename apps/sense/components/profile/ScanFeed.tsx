'use client';

import React from 'react';
import { ProfileStatsResponse } from '@/lib/apiClient';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Props {
  stats: ProfileStatsResponse;
}

export default function ScanFeed({ stats }: Props) {
  const { recent_scans } = stats;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-5 h-full flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Scans</h3>
      
      {recent_scans.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[150px]">
          <span className="text-sm text-slate-400">No recent scans</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800 z-0" />
          
          {recent_scans.map((scan, i) => {
            const isCompleted = scan.status === 'completed';
            const isFailed = scan.status === 'failed' || scan.status === 'error';
            const Icon = isCompleted ? CheckCircle2 : (isFailed ? XCircle : Clock);
            const iconColor = isCompleted ? 'text-emerald-500' : (isFailed ? 'text-red-500' : 'text-blue-500');
            const bgClass = 'bg-white dark:bg-slate-900';

            return (
              <div key={scan.session_id + i} className="flex items-start gap-4 relative z-10 group">
                <div className={`mt-0.5 w-6 h-6 rounded-full ${bgClass} flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700`}>
                  <Icon size={14} className={iconColor} />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize group-hover:text-blue-500 transition-colors">
                      {scan.connector_type} Scan
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(scan.started_at).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 
                      (isFailed ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500')
                    }`}>
                      {scan.status}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {scan.file_count} {scan.file_count === 1 ? 'file' : 'files'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
