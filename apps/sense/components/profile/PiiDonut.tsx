'use client';

import React, { useEffect, useRef } from 'react';
import { ProfileStatsResponse } from '@/lib/apiClient';

interface Props {
  stats: ProfileStatsResponse;
}

export default function PiiDonut({ stats }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!chartRef.current) return;

    let Plotly: any;

    import('plotly.js-dist-min').then(m => {
      Plotly = m.default;

      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#CBD5E1' : '#475569';
      
      const bd = stats.classification_breakdown;
      const values = [bd.sensitive, bd.needs_review, bd.non_sensitive];
      const labels = ['Sensitive', 'Needs Review', 'Non-Sensitive'];
      const colors = ['#EF4444', '#F97316', '#22C55E']; // red, orange, green

      // Check for empty state
      if (values.every(v => v === 0)) {
        Plotly.purge(chartRef.current);
        return; // We will handle empty state in the render function
      }

      Plotly.react(
        chartRef.current,
        [
          {
            values,
            labels,
            type: 'pie',
            hole: 0.7,
            marker: { colors },
            textinfo: 'none',
            hoverinfo: 'label+value+percent'
          }
        ],
        {
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { color: textColor, size: 11 },
          margin: { t: 10, r: 10, b: 10, l: 10 },
          showlegend: true,
          legend: {
            orientation: 'h',
            y: -0.1,
            x: 0.5,
            xanchor: 'center',
            font: { size: 10 }
          }
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
  }, [stats.classification_breakdown]);

  const isEmpty = Object.values(stats.classification_breakdown).every(v => v === 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-5 h-full flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Classification Split</h3>
      <div className="flex-1 relative min-h-[220px]">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-slate-400">No data available</span>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-full absolute inset-0" />
        )}
      </div>
    </div>
  );
}
