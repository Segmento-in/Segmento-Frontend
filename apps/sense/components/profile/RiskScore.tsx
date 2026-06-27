'use client';

import React from 'react';
import { ProfileStatsResponse } from '@/lib/apiClient';

interface Props {
  stats: ProfileStatsResponse;
}

export default function RiskScore({ stats }: Props) {
  const score = stats.risk_score;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let glowClass = 'shadow-emerald-500/20';
  if (score >= 20) {
    colorClass = 'text-blue-500';
    glowClass = 'shadow-blue-500/20';
  }
  if (score >= 50) {
    colorClass = 'text-orange-500';
    glowClass = 'shadow-orange-500/20';
  }
  if (score >= 80) {
    colorClass = 'text-red-500';
    glowClass = 'shadow-red-500/20';
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 p-5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 ${glowClass.replace('shadow-', 'bg-').replace('/20', '')}`} />
      
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 w-full text-left relative z-10">PII Risk Score</h3>
      
      <div className="relative flex items-center justify-center mb-4 z-10">
        <svg width="160" height="160" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-black tabular-nums ${colorClass}`}>{score}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
        </div>
      </div>
      
      <p className="text-xs text-center text-slate-500 max-w-[180px] relative z-10">
        Based on the percentage of files or tables containing sensitive data.
      </p>
    </div>
  );
}
