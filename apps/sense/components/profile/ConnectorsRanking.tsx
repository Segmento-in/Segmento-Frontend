'use client';

import React from 'react';
import { ProfileStatsResponse } from '@/lib/apiClient';
import { HardDrive, Server, Globe, Database } from 'lucide-react';

interface Props {
  stats: ProfileStatsResponse;
}

function getIconForConnector(type: string) {
  const t = type.toLowerCase();
  if (t.includes('postgres') || t.includes('mysql') || t.includes('mongo')) return <Database size={16} className="text-blue-500" />;
  if (t.includes('s3') || t.includes('azure') || t.includes('gcs')) return <Server size={16} className="text-emerald-500" />;
  if (t.includes('drive')) return <HardDrive size={16} className="text-yellow-500" />;
  return <Globe size={16} className="text-slate-500" />;
}

export default function ConnectorsRanking({ stats }: Props) {
  const { top_connectors } = stats;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-5 flex flex-col h-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Top Connectors</h3>
      
      {top_connectors.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[150px]">
          <span className="text-sm text-slate-400">No connector data available</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {top_connectors.map((c, i) => (
            <div key={c.connector_type + i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  {getIconForConnector(c.connector_type)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{c.connector_type}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Last: {new Date(c.last_scan).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-700 dark:text-slate-300 tabular-nums">{c.scan_count}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Scans</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
