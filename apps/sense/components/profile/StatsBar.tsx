'use client';

import React from 'react';
import { Database, FileText, ShieldAlert, FileSearch } from 'lucide-react';
import { ProfileStatsResponse } from '@/lib/apiClient';

interface Props {
  stats: ProfileStatsResponse;
}

export default function StatsBar({ stats }: Props) {
  const cards = [
    {
      label: 'Total Scans',
      value: stats.total_scans,
      icon: Database,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      label: 'Files Scanned',
      value: stats.total_files_scanned,
      icon: FileText,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      label: 'PII Fields Found',
      value: stats.pii_fields_found,
      icon: FileSearch,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    },
    {
      label: 'Needs Review',
      value: stats.needs_review_pending,
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {card.value.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
