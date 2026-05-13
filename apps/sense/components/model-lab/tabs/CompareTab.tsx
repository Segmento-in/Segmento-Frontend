'use client';

import React, { useEffect, useRef } from 'react';
import { Trash2, GitCompare } from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { PinnedResult } from '@/lib/apiClient';

interface Props {
    state: ModelLabState;
    update: (patch: Partial<ModelLabState>) => void;
    removePin: (idx: number) => void;
    clearPins: () => void;
}

const F1_TXT = (f: number) =>
    f >= 0.9
        ? 'text-emerald-400'
        : f >= 0.75
          ? 'text-orange-400'
          : 'text-red-400';

export default function CompareTab({
    state,
    update,
    removePin,
    clearPins,
}: Props) {
    const chartRef = useRef<HTMLDivElement>(null);
    const pins = state.pinnedResults;

    // Draw grouped bar chart whenever pins change
    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !chartRef.current ||
            pins.length === 0
        )
            return;

        import('plotly.js-dist-min').then((m) => {
            const Plotly = m.default;

            const labels = pins.map((p) => p.label);

            const isDark =
                document.documentElement.classList.contains('dark');

            Plotly.react(
                chartRef.current!,
                [
                    {
                        name: 'F1',
                        x: labels,
                        y: pins.map((p) => p.f1),
                        type: 'bar',
                        marker: { color: '#22C55E' },
                    },
                    {
                        name: 'Precision',
                        x: labels,
                        y: pins.map((p) => p.precision),
                        type: 'bar',
                        marker: { color: '#6366F1' },
                    },
                    {
                        name: 'Recall',
                        x: labels,
                        y: pins.map((p) => p.recall),
                        type: 'bar',
                        marker: { color: '#38BDF8' },
                    },
                ],
                {
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',

                    font: {
                        color: isDark ? '#CBD5E1' : '#475569',
                        size: 11,
                    },

                    margin: { t: 20, r: 10, b: 80, l: 40 },

                    xaxis: {
                        tickangle: -30,
                        showgrid: false,
                        color: isDark ? '#94A3B8' : '#64748B',
                    },

                    yaxis: {
                        range: [0, 1],
                        showgrid: true,
                        gridcolor: isDark ? '#334155' : '#E2E8F0',
                        color: isDark ? '#94A3B8' : '#64748B',
                        title: 'Score',
                    },

                    barmode: 'group',
                    bargap: 0.2,

                    legend: {
                        orientation: 'h',
                        y: -0.35,
                        font: { size: 10 },
                    },
                },
                {
                    responsive: true,
                    displayModeBar: false,
                }
            );
        });
    }, [pins]);

    // Empty state
    if (pins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 py-24 rounded-2xl border border-dashed border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700">
                <GitCompare
                    size={36}
                    className="text-slate-500 dark:text-slate-400"
                />

                <div className="text-center">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-200 mb-1">
                        No pinned results yet
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Go to the{' '}
                        <strong className="text-slate-700 dark:text-slate-200">
                            Metrics
                        </strong>{' '}
                        tab → run a scan → click{' '}
                        <strong className="text-emerald-400">
                            Pin Result
                        </strong>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Pinned results table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                        Pinned Results ({pins.length})
                    </p>

                    <button
                        onClick={clearPins}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-red-400 hover:bg-red-50 dark:text-slate-400 dark:hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 size={11} />
                        Clear All
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                                {[
                                    'Label',
                                    'Model',
                                    'F1',
                                    'Precision',
                                    'Recall',
                                    'TP',
                                    'FP',
                                    'FN',
                                    '',
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-2.5 text-left text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {pins.map((pin, i) => (
                                <tr
                                    key={pin.timestamp}
                                    className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 transition-colors"
                                >
                                    {/* Label */}
                                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-100 font-semibold max-w-[160px] truncate">
                                        {pin.label}
                                    </td>

                                    {/* Model */}
                                    <td className="px-4 py-2.5 font-mono text-slate-500 dark:text-slate-400">
                                        {pin.modelKey}
                                    </td>

                                    {/* F1 */}
                                    <td className="px-4 py-2.5">
                                        <span
                                            className={`font-black font-mono ${F1_TXT(pin.f1)}`}
                                        >
                                            {pin.f1.toFixed(3)}
                                        </span>
                                    </td>

                                    {/* Precision */}
                                    <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-200">
                                        {pin.precision.toFixed(3)}
                                    </td>

                                    {/* Recall */}
                                    <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-200">
                                        {pin.recall.toFixed(3)}
                                    </td>

                                    {/* TP */}
                                    <td className="px-4 py-2.5 text-emerald-400 font-mono">
                                        {pin.tp}
                                    </td>

                                    {/* FP */}
                                    <td className="px-4 py-2.5 text-orange-400 font-mono">
                                        {pin.fp}
                                    </td>

                                    {/* FN */}
                                    <td className="px-4 py-2.5 text-red-400 font-mono">
                                        {pin.fn}
                                    </td>

                                    {/* Delete */}
                                    <td className="px-4 py-2.5">
                                        <button
                                            onClick={() => removePin(i)}
                                            className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Comparison chart */}
            {pins.length >= 2 && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 dark:bg-slate-900 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 tracking-wider uppercase">
                        F1 / Precision / Recall Comparison
                    </p>

                    <div
                        ref={chartRef}
                        className="w-full h-[300px]"
                    />
                </div>
            )}

            {/* Warning */}
            {pins.length === 1 && (
                <div className="px-5 py-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                        Pin at least <strong>2 results</strong> to see the
                        comparison chart.
                    </p>
                </div>
            )}
        </div>
    );
}