'use client';

import React, { useEffect, useRef } from 'react';
import { Trash2, AlertCircle, GitCompare } from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { PinnedResult } from '@/lib/apiClient';

interface Props {
    state: ModelLabState;
    update: (patch: Partial<ModelLabState>) => void;
    removePin: (idx: number) => void;
    clearPins: () => void;
}

const F1_TXT = (f: number) => f >= 0.9 ? 'text-emerald-400' : f >= 0.75 ? 'text-orange-400' : 'text-red-400';

export default function CompareTab({ state, update, removePin, clearPins }: Props) {
    const chartRef = useRef<HTMLDivElement>(null);
    const pins     = state.pinnedResults;

    // Draw grouped bar chart whenever pins change
    useEffect(() => {
        if (typeof window === 'undefined' || !chartRef.current || pins.length === 0) return;
        import('plotly.js-dist-min').then(m => {
            const Plotly = m.default;
            const labels = pins.map(p => p.label);
            Plotly.react(chartRef.current!, [
                { name: 'F1',        x: labels, y: pins.map(p => p.f1),        type: 'bar', marker: { color: '#22C55E' } },
                { name: 'Precision', x: labels, y: pins.map(p => p.precision), type: 'bar', marker: { color: '#6366F1' } },
                { name: 'Recall',    x: labels, y: pins.map(p => p.recall),    type: 'bar', marker: { color: '#38BDF8' } },
            ], {
                paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
                font: { color: '#94a3b8', size: 11 },
                margin: { t: 20, r: 10, b: 80, l: 40 },
                xaxis: { tickangle: -30, showgrid: false, color: '#334155' },
                yaxis: { range: [0, 1], showgrid: true, gridcolor: '#1e293b', color: '#334155', title: 'Score' },
                barmode: 'group', bargap: 0.2,
                legend: { orientation: 'h', y: -0.35, font: { size: 10 } },
            }, { responsive: true, displayModeBar: false });
        });
    }, [pins]);

    if (pins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-5 py-24 rounded-2xl border border-dashed border-white/10 bg-[#0F1629]">
                <GitCompare size={36} className="text-slate-600" />
                <div className="text-center">
                    <p className="text-sm font-bold text-slate-400 mb-1">No pinned results yet</p>
                    <p className="text-xs text-slate-600">Go to the <strong className="text-slate-400">Metrics</strong> tab → run a scan → click <strong className="text-emerald-400">Pin Result</strong></p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Pinned results table */}
            <div className="rounded-2xl border border-white/5 bg-[#0F1629] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                        Pinned Results ({pins.length})
                    </p>
                    <button
                        onClick={clearPins}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 size={11} /> Clear All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['Label', 'Model', 'F1', 'Precision', 'Recall', 'TP', 'FP', 'FN', ''].map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-semibold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pins.map((pin, i) => (
                                <tr key={pin.timestamp} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                    <td className="px-4 py-2.5 text-slate-300 font-semibold max-w-[160px] truncate">{pin.label}</td>
                                    <td className="px-4 py-2.5 font-mono text-slate-400">{pin.modelKey}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`font-black font-mono ${F1_TXT(pin.f1)}`}>{pin.f1.toFixed(3)}</span>
                                    </td>
                                    <td className="px-4 py-2.5 font-mono text-slate-300">{pin.precision.toFixed(3)}</td>
                                    <td className="px-4 py-2.5 font-mono text-slate-300">{pin.recall.toFixed(3)}</td>
                                    <td className="px-4 py-2.5 text-emerald-400 font-mono">{pin.tp}</td>
                                    <td className="px-4 py-2.5 text-orange-400 font-mono">{pin.fp}</td>
                                    <td className="px-4 py-2.5 text-red-400 font-mono">{pin.fn}</td>
                                    <td className="px-4 py-2.5">
                                        <button
                                            onClick={() => removePin(i)}
                                            className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
                <div className="rounded-2xl border border-white/5 bg-[#0F1629] p-5">
                    <p className="text-xs font-bold text-slate-400 mb-4 tracking-wider uppercase">
                        F1 / Precision / Recall Comparison
                    </p>
                    <div ref={chartRef} className="w-full h-[300px]" />
                </div>
            )}

            {pins.length === 1 && (
                <div className="px-5 py-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <p className="text-xs text-amber-400">
                        Pin at least <strong>2 results</strong> to see the comparison chart.
                    </p>
                </div>
            )}
        </div>
    );
}
