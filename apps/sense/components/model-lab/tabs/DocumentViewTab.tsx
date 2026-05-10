'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { EvaluatorPrediction, GTSpan } from '@/lib/apiClient';

interface Props {
    state: ModelLabState;
    update: (patch: Partial<ModelLabState>) => void;
}

const RESULT_COLORS = {
    TP: { bg: 'rgba(34,197,94,0.25)',  border: '#22C55E', label: 'TP' },
    FP: { bg: 'rgba(249,115,22,0.25)', border: '#F97316', label: 'FP' },
    FN: { bg: 'rgba(239,68,68,0.25)',  border: '#EF4444', label: 'FN' },
    DET: { bg: 'rgba(99,102,241,0.25)',border: '#6366F1', label: '' },   // unlabeled detection
};

export default function DocumentViewTab({ state, update }: Props) {
    const modelData = state.scanResult?.per_model?.[state.activeModelKey];
    const text      = state.parseResult?.text ?? '';
    const hasGT     = state.scanResult?.has_gt ?? false;
    const modelKeys = Object.keys(state.scanResult?.per_model ?? {});

    // Build highlighted HTML from spans
    const highlightedHtml = useMemo(() => {
        if (!text) return '';
        if (!modelData) return escapeHtml(text);

        // Collect all spans with their result type
        type Span = { start: number; end: number; result: 'TP' | 'FP' | 'FN' | 'DET'; label: string; score: number };
        const spans: Span[] = [];

        if (hasGT) {
            modelData.comparison.TP.forEach(e => spans.push({ start: e.start, end: e.end, result: 'TP', label: e.canonical || e.label, score: e.score }));
            modelData.comparison.FP.forEach(e => spans.push({ start: e.start, end: e.end, result: 'FP', label: e.canonical || e.label, score: e.score }));
            modelData.comparison.FN.forEach(e => spans.push({ start: e.start, end: e.end, result: 'FN', label: e.canonical || e.label, score: 0 }));
        } else {
            modelData.predictions.forEach(e => spans.push({ start: e.start, end: e.end, result: 'DET', label: e.canonical || e.label, score: e.score }));
        }

        // Sort, remove overlaps (longer wins)
        spans.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
        const clean: Span[] = [];
        let last = 0;
        for (const s of spans) {
            if (s.start >= last) { clean.push(s); last = s.end; }
        }

        // Build HTML
        let html = '';
        let pos = 0;
        for (const s of clean) {
            html += escapeHtml(text.slice(pos, s.start));
            const c = RESULT_COLORS[s.result];
            const tooltip = `${s.label}${s.score > 0 ? ` · ${(s.score * 100).toFixed(0)}%` : ''}${c.label ? ` · ${c.label}` : ''}`;
            html += `<mark style="background:${c.bg};border-bottom:2px solid ${c.border};border-radius:3px;padding:1px 3px;cursor:help;" title="${escapeHtml(tooltip)}">${escapeHtml(text.slice(s.start, s.end))}</mark>`;
            pos = s.end;
        }
        html += escapeHtml(text.slice(pos));
        return html;
    }, [text, modelData, hasGT]);

    // Page through long docs (every 1800 chars = ~1 window)
    const PAGE_SIZE = 1800;
    const totalPages = Math.max(1, Math.ceil(text.length / PAGE_SIZE));
    const currentPage = state.docIndex ?? 0;

    if (!state.scanResult && !state.parseResult) {
        return (
            <Empty message="Run a scan first — the highlighted document will appear here." />
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Controls bar */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Model selector */}
                {modelKeys.length > 1 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Model:</span>
                        <div className="flex gap-1">
                            {modelKeys.map(k => (
                                <button key={k}
                                    onClick={() => update({ activeModelKey: k })}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        state.activeModelKey === k
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-100'
                                    }`}>
                                    {k}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Doc page navigation */}
                {state.parseResult && state.parseResult.doc_count > 1 && (
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            disabled={state.docIndex <= 0}
                            onClick={() => update({ docIndex: state.docIndex - 1 })}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:border-slate-300 transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span className="text-xs text-slate-500 font-mono">
                            Doc {(state.docIndex ?? 0) + 1} / {state.parseResult.doc_count}
                        </span>
                        <button
                            disabled={state.docIndex >= state.parseResult.doc_count - 1}
                            onClick={() => update({ docIndex: state.docIndex + 1 })}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:border-slate-300 transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Legend */}
            {hasGT && (
                <div className="flex flex-wrap gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm border-slate-100">
                    {Object.entries(RESULT_COLORS).filter(([k]) => k !== 'DET').map(([key, c]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <span style={{ background: c.bg, borderBottom: `2px solid ${c.border}`, borderRadius: 3, padding: '1px 6px', fontSize: 11 }} className="text-slate-900 font-mono">
                                {key}
                            </span>
                            <span className="text-[10px] text-slate-500">
                                {key === 'TP' ? 'Correct detection' : key === 'FP' ? 'Wrong flag' : 'Missed'}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Document content */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm border-slate-100 p-6 overflow-x-auto">
                {text ? (
                    <p
                        className="text-sm text-slate-700 leading-7 whitespace-pre-wrap font-mono"
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    />
                ) : (
                    <p className="text-sm text-slate-500 italic">No text available.</p>
                )}
            </div>

            {/* Stats row */}
            {modelData && hasGT && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'True Positives',  value: modelData.comparison.TP.length, color: 'text-emerald-400' },
                        { label: 'False Positives', value: modelData.comparison.FP.length, color: 'text-orange-400' },
                        { label: 'False Negatives', value: modelData.comparison.FN.length, color: 'text-red-400' },
                    ].map(s => (
                        <div key={s.label} className="flex flex-col items-center gap-1 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm border-slate-100">
                            <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                            <span className="text-[10px] text-slate-500 tracking-widest uppercase">{s.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Empty({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl border border-slate-200 bg-white shadow-sm border-slate-100">
            <AlertCircle size={32} className="text-slate-500" />
            <p className="text-sm text-slate-500 max-w-xs text-center">{message}</p>
        </div>
    );
}

function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
