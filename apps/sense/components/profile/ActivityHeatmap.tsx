'use client';

import React, { useMemo } from 'react';
import { ProfileStatsResponse } from '@/lib/apiClient';

interface Props {
  stats: ProfileStatsResponse;
}

export default function ActivityHeatmap({ stats }: Props) {
  // Generate a full year of dates (365 days) ending today
  const { maxCount, days } = useMemo(() => {
    const dataMap = new Map(stats.heatmap_data.map(d => [d.date, d.count]));
    
    let max = 0;
    const generatedDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the start date (365 days ago)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Adjust startDate to start on a Sunday
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    const totalDays = 364 + startDay + (6 - today.getDay());

    for (let i = 0; i <= totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
      ].join('-');

      const count = dataMap.get(dateStr) || 0;
      if (count > max) max = count;

      generatedDays.push({
        date: dateStr,
        count,
        isFuture: d > today
      });
    }

    return { maxCount: max || 1, days: generatedDays };
  }, [stats.heatmap_data]);

  // Group into weeks for the column layout
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getIntensityClass = (count: number, isFuture: boolean) => {
    if (isFuture) return 'bg-transparent';
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800/50';
    const ratio = count / maxCount;
    if (ratio < 0.25) return 'bg-blue-300 dark:bg-blue-900/40';
    if (ratio < 0.50) return 'bg-blue-400 dark:bg-blue-700/60';
    if (ratio < 0.75) return 'bg-blue-500 dark:bg-blue-500/80';
    return 'bg-blue-600 dark:bg-blue-400';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activity Heatmap</h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-300 dark:bg-blue-900/40" />
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 dark:bg-blue-500/80" />
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-600 dark:bg-blue-400" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
        {weeks.map((week, wi) => (
          <div key={`w-${wi}`} className="flex flex-col gap-1 flex-shrink-0">
            {week.map((day, di) => (
              <div
                key={day.date}
                title={`${day.count} scans on ${day.date}`}
                className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count, day.isFuture)} transition-colors`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
