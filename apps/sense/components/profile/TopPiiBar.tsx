'use client';

import React, { useEffect, useRef } from 'react';
import { ProfileStatsResponse } from '@/lib/apiClient';

interface Props {
  stats: ProfileStatsResponse;
}

export default function TopPiiBar({ stats }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!chartRef.current) return;
    if (stats.top_pii_categories.length === 0) return;

    let Plotly: any;

    import('plotly.js-dist-min').then(m => {
      Plotly = m.default;

      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#CBD5E1' : '#475569';
      const gridColor = isDark ? '#334155' : '#e2e8f0';
      const axisColor = isDark ? '#94A3B8' : '#64748b';

      // Need to reverse so highest is at the top of horizontal bar chart
      const categories = [...stats.top_pii_categories].reverse();

      Plotly.react(
        chartRef.current,
        [
          {
            x: categories.map(c => c.count),
            y: categories.map(c => c.category),
            type: 'bar',
            orientation: 'h',
            marker: {
              color: '#3B82F6', // blue-500
              opacity: 0.8,
              line: {
                color: '#2563EB', // blue-600
                width: 1
              }
            }
          }
        ],
        {
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { color: textColor, size: 11 },
          margin: { t: 10, r: 20, b: 30, l: 120 },
          xaxis: {
            showgrid: true,
            gridcolor: gridColor,
            color: axisColor,
            zeroline: false
          },
          yaxis: {
            showgrid: false,
            color: axisColor,
            automargin: true
          },
          bargap: 0.3
        },
        {
          responsive: true,
          displayModeBar: false,
        }
      );
    });

    return () => {
      if (chartRef.current && Plotly) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [stats.top_pii_categories]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-5 h-full flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Top PII Categories</h3>
      
      {stats.top_pii_categories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[220px]">
          <span className="text-sm text-slate-400">No PII data found</span>
        </div>
      ) : (
        <div className="flex-1 relative min-h-[220px]">
          <div ref={chartRef} className="w-full h-full absolute inset-0" />
        </div>
      )}
    </div>
  );
}
