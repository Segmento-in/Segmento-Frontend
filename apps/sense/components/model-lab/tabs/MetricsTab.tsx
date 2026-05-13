'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, Crosshair, Pin, AlertCircle } from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { MetricRow } from '@/lib/apiClient';

interface Props {
    state: ModelLabState;
    update: (patch: Partial<ModelLabState>) => void;
    pinResult: (modelKey: string, label: string) => void;
}

const F1_BG  = (f1: number) => f1 >= 0.9 ? '#22C55E' : f1 >= 0.75 ? '#F97316' : '#EF4444';
const F1_TXT = (f1: number) => f1 >= 0.9 ? 'text-emerald-400' : f1 >= 0.75 ? 'text-orange-400' : 'text-red-400';

export default function MetricsTab({ state, update, pinResult }: Props) {
    const modelKeys = Object.keys(state.scanResult?.per_model ?? {});
    const modelData = state.scanResult?.per_model?.[state.activeModelKey];
    const [pinLabel, setPinLabel] = useState('');
    const chartRef  = useRef<HTMLDivElement>(null);
    const donutRef  = useRef<HTMLDivElement>(null);
    const histRef   = useRef<HTMLDivElement>(null);

    const metrics  = modelData?.metrics ?? [];
    const overall  = metrics.find(r => r.entity_type === 'OVERALL');
    const perType  = metrics.filter(r => r.entity_type !== 'OVERALL');

    // ── Plotly charts ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!perType.length) return;

        let Plotly: any;

        import('plotly.js-dist-min').then(m => {
            Plotly = m.default;

            const isDark =
                document.documentElement.classList.contains('dark');

            const textColor = isDark ? '#CBD5E1' : '#475569';
            const gridColor = isDark ? '#334155' : '#e2e8f0';
            const axisColor = isDark ? '#94A3B8' : '#64748b';

            const layout = {
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { color: textColor, size: 11 },
                margin: { t: 20, r: 10, b: 60, l: 10 },
                xaxis: { showgrid: false, color: axisColor },
                yaxis: {
                    range: [0, 1],
                    showgrid: true,
                    gridcolor: gridColor,
                    color: axisColor,
                },
                legend: {
                    orientation: 'h',
                    y: -0.25,
                    font: { size: 10 },
                },
                bargap: 0.25,
            };

            // Bar chart — F1 / Precision / Recall per entity
            if (chartRef.current) {
                const labels = perType.map(r => r.entity_type);

                Plotly.react(
                    chartRef.current,
                    [
                        {
                            name: 'F1',
                            x: labels,
                            y: perType.map(r => r.f1),
                            type: 'bar',
                            marker: { color: '#22C55E' },
                        },
                        {
                            name: 'Precision',
                            x: labels,
                            y: perType.map(r => r.precision),
                            type: 'bar',
                            marker: { color: '#6366F1' },
                        },
                        {
                            name: 'Recall',
                            x: labels,
                            y: perType.map(r => r.recall),
                            type: 'bar',
                            marker: { color: '#38BDF8' },
                        },
                    ],
                    {
                        ...layout,
                        xaxis: {
                            ...layout.xaxis,
                            tickangle: -35,
                        },
                    },
                    {
                        responsive: true,
                        displayModeBar: false,
                    }
                );
            }

            // Donut — TP / FP / FN
            if (donutRef.current && overall) {
                Plotly.react(
                    donutRef.current,
                    [
                        {
                            values: [overall.tp, overall.fp, overall.fn],
                            labels: [
                                'True Positives',
                                'False Positives',
                                'False Negatives',
                            ],
                            type: 'pie',
                            hole: 0.6,
                            marker: {
                                colors: [
                                    '#22C55E',
                                    '#F97316',
                                    '#EF4444',
                                ],
                            },
                            textinfo: 'none',
                        },
                    ],
                    {
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        font: { color: textColor, size: 11 },
                        margin: { t: 20, r: 20, b: 20, l: 20 },
                        legend: { font: { size: 10 } },
                        showlegend: true,
                    },
                    {
                        responsive: true,
                        displayModeBar: false,
                    }
                );
            }

            // Confidence histogram
            if (histRef.current && modelData) {
                const tpScores  = modelData.comparison.TP.map(e => e.score);
                const fpScores  = modelData.comparison.FP.map(e => e.score);
                const detScores = modelData.predictions.map(e => e.score);

                const hasGT = state.scanResult?.has_gt;

                Plotly.react(
                    histRef.current,
                    hasGT
                        ? [
                              {
                                  name: 'TP',
                                  x: tpScores,
                                  type: 'histogram',
                                  marker: {
                                      color: 'rgba(34,197,94,0.7)',
                                  },
                                  opacity: 0.8,
                              },
                              {
                                  name: 'FP',
                                  x: fpScores,
                                  type: 'histogram',
                                  marker: {
                                      color: 'rgba(249,115,22,0.7)',
                                  },
                                  opacity: 0.8,
                              },
                          ]
                        : [
                              {
                                  name: 'Detections',
                                  x: detScores,
                                  type: 'histogram',
                                  marker: {
                                      color: 'rgba(99,102,241,0.7)',
                                  },
                                  opacity: 0.8,
                              },
                          ],
                    {
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        font: { color: textColor, size: 11 },
                        margin: { t: 20, r: 10, b: 40, l: 40 },
                        xaxis: {
                            range: [0, 1],
                            title: 'Confidence',
                            color: axisColor,
                            showgrid: false,
                        },
                        yaxis: {
                            title: 'Count',
                            color: axisColor,
                            showgrid: true,
                            gridcolor: gridColor,
                        },
                        barmode: 'overlay',
                        legend: { font: { size: 10 } },
                    },
                    {
                        responsive: true,
                        displayModeBar: false,
                    }
                );
            }
        });
    }, [metrics, modelData, state.activeModelKey, state.scanResult]);

    if (!state.scanResult) {
        return <Empty message="Run a scan first — metrics will appear here." />;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Model switcher */}
            {modelKeys.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Viewing:
                    </span>

                    {modelKeys.map(k => (
                        <button
                            key={k}
                            onClick={() => update({ activeModelKey: k })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                state.activeModelKey === k
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            )}

            {/* Headline metric cards */}
            {overall && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            label: 'F1 Score',
                            value: overall.f1,
                            desc: 'Harmonic mean',
                            icon: Target,
                            color: overall.f1,
                        },
                        {
                            label: 'Precision',
                            value: overall.precision,
                            desc: 'TP / (TP+FP)',
                            icon: Crosshair,
                            color: overall.precision,
                        },
                        {
                            label: 'Recall',
                            value: overall.recall,
                            desc: 'TP / (TP+FN)',
                            icon: Eye,
                            color: overall.recall,
                        },
                    ].map(({ label, value, desc, icon: Icon, color }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-2 py-7 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                            <Icon size={18} className={F1_TXT(color)} />

                            <span
                                className={`text-4xl font-black tabular-nums ${F1_TXT(
                                    color
                                )}`}
                            >
                                {value.toFixed(3)}
                            </span>

                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {label}
                            </span>

                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {desc}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 p-4">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 tracking-wider uppercase">
                        F1 / Precision / Recall per Entity
                    </p>

                    <div ref={chartRef} className="w-full h-[260px]" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 p-4">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 tracking-wider uppercase">
                        TP / FP / FN Split
                    </p>

                    <div ref={donutRef} className="w-full h-[220px]" />
                </div>
            </div>

            {/* Confidence histogram */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 p-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 tracking-wider uppercase">
                    Confidence Distribution
                </p>

                <div ref={histRef} className="w-full h-[200px]" />
            </div>

            {/* Per-entity table */}
            {perType.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                            Per-Entity Breakdown
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    {[
                                        'Entity Type',
                                        'TP',
                                        'FP',
                                        'FN',
                                        'Precision',
                                        'Recall',
                                        'F1',
                                    ].map(h => (
                                        <th
                                            key={h}
                                            className="px-4 py-2.5 text-left text-slate-500 dark:text-slate-400 font-semibold"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {perType
                                    .sort((a, b) => b.f1 - a.f1)
                                    .map(row => (
                                        <tr
                                            key={row.entity_type}
                                            className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-200">
                                                {row.entity_type}
                                            </td>

                                            <td className="px-4 py-2.5 text-emerald-400 font-mono">
                                                {row.tp}
                                            </td>

                                            <td className="px-4 py-2.5 text-orange-400 font-mono">
                                                {row.fp}
                                            </td>

                                            <td className="px-4 py-2.5 text-red-400 font-mono">
                                                {row.fn}
                                            </td>

                                            <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-200">
                                                {row.precision.toFixed(3)}
                                            </td>

                                            <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-200">
                                                {row.recall.toFixed(3)}
                                            </td>

                                            <td className="px-4 py-2.5">
                                                <span
                                                    className={`font-black font-mono ${F1_TXT(
                                                        row.f1
                                                    )}`}
                                                >
                                                    {row.f1.toFixed(3)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pin button */}
            {overall && (
                <div className="flex items-center gap-3">
                    <input
                        placeholder={`Label this run, e.g. "${state.activeModelKey} — doc 0"`}
                        value={pinLabel}
                        onChange={e => setPinLabel(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-300"
                    />

                    <button
                        onClick={() => {
                            pinResult(
                                state.activeModelKey,
                                pinLabel || `${state.activeModelKey} — run`
                            );
                            setPinLabel('');
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors"
                    >
                        <Pin size={12} /> Pin Result
                    </button>
                </div>
            )}
        </div>
    );
}

function Empty({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <AlertCircle size={32} className="text-slate-500 dark:text-slate-400" />

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs text-center">
                {message}
            </p>
        </div>
    );
}