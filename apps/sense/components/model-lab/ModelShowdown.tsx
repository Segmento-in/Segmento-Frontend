'use client';

import React, { useState } from 'react';
import { Trophy, Eye, AlertTriangle, CheckCircle2, Star, ChevronDown, ChevronUp, Tag } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

interface TypeCount { [label: string]: number }

interface Prediction {
    text: string;
    label: string;
    start: number;
    end: number;
    score?: number;
    result?: string; // 'TP' | 'FP' | 'FN'
}

interface ModelShowdownResult {
    pii_count: number;
    accuracy: number;
    type_counts: TypeCount;
    unique_count: number;
    missed_count: number;
    consensus_count: number;
    predictions?: Prediction[];
}

interface RankedEntry {
    model_key: string;
    pii_count: number;
    accuracy: number;
    rank: number;
}

interface ShowdownData {
    per_model: Record<string, ModelShowdownResult>;
    ranked: RankedEntry[];
    union_total: number;
    elapsed: number;
}

interface ModelInfo {
    key: string;
    label: string;
    type: string;
    params: string;
    lazy: boolean;
}

interface Props {
    data: ShowdownData;
    modelCatalogue: ModelInfo[];
}

// ── Style helpers ──────────────────────────────────────────────────────────

const RANK_STYLES = [
    'from-amber-400 to-yellow-500 text-white shadow-amber-200 dark:shadow-amber-900',
    'from-slate-300 to-slate-400 text-white shadow-slate-200 dark:shadow-slate-800',
    'from-orange-400 to-amber-600 text-white shadow-orange-200 dark:shadow-orange-900',
];

const TYPE_TAG: Record<string, string> = {
    'Rule-based':  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    'Statistical': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    'GLiNER':      'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
    'NER':         'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    'Rule+ML':     'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
};

const ACC_COLOR = (acc: number) =>
    acc >= 0.9 ? 'text-emerald-500' :
    acc >= 0.7 ? 'text-teal-500' :
    acc >= 0.5 ? 'text-blue-500' :
    acc > 0    ? 'text-amber-500' : 'text-slate-400';

// Color per PII label (consistent across cards and doc viewer)
export const PII_LABEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    EMAIL:         { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-300 dark:border-emerald-600' },
    PHONE:         { bg: 'bg-blue-100 dark:bg-blue-500/20',       text: 'text-blue-800 dark:text-blue-200',       border: 'border-blue-300 dark:border-blue-600' },
    PHONE_NUMBER:  { bg: 'bg-blue-100 dark:bg-blue-500/20',       text: 'text-blue-800 dark:text-blue-200',       border: 'border-blue-300 dark:border-blue-600' },
    PERSON:        { bg: 'bg-pink-100 dark:bg-pink-500/20',       text: 'text-pink-800 dark:text-pink-200',       border: 'border-pink-300 dark:border-pink-600' },
    FIRST_NAME:    { bg: 'bg-pink-100 dark:bg-pink-500/20',       text: 'text-pink-800 dark:text-pink-200',       border: 'border-pink-300 dark:border-pink-600' },
    LAST_NAME:     { bg: 'bg-rose-100 dark:bg-rose-500/20',       text: 'text-rose-800 dark:text-rose-200',       border: 'border-rose-300 dark:border-rose-600' },
    FULL_NAME:     { bg: 'bg-pink-100 dark:bg-pink-500/20',       text: 'text-pink-800 dark:text-pink-200',       border: 'border-pink-300 dark:border-pink-600' },
    LOCATION:      { bg: 'bg-orange-100 dark:bg-orange-500/20',   text: 'text-orange-800 dark:text-orange-200',   border: 'border-orange-300 dark:border-orange-600' },
    ADDRESS:       { bg: 'bg-orange-100 dark:bg-orange-500/20',   text: 'text-orange-800 dark:text-orange-200',   border: 'border-orange-300 dark:border-orange-600' },
    GPE:           { bg: 'bg-orange-100 dark:bg-orange-500/20',   text: 'text-orange-800 dark:text-orange-200',   border: 'border-orange-300 dark:border-orange-600' },
    SSN:           { bg: 'bg-red-100 dark:bg-red-500/20',         text: 'text-red-800 dark:text-red-200',         border: 'border-red-300 dark:border-red-600' },
    CREDIT_CARD:   { bg: 'bg-purple-100 dark:bg-purple-500/20',   text: 'text-purple-800 dark:text-purple-200',   border: 'border-purple-300 dark:border-purple-600' },
    IP_ADDRESS:    { bg: 'bg-amber-100 dark:bg-amber-500/20',     text: 'text-amber-800 dark:text-amber-200',     border: 'border-amber-300 dark:border-amber-600' },
    URL:           { bg: 'bg-teal-100 dark:bg-teal-500/20',       text: 'text-teal-800 dark:text-teal-200',       border: 'border-teal-300 dark:border-teal-600' },
    DATE:          { bg: 'bg-indigo-100 dark:bg-indigo-500/20',   text: 'text-indigo-800 dark:text-indigo-200',   border: 'border-indigo-300 dark:border-indigo-600' },
    DOB:           { bg: 'bg-indigo-100 dark:bg-indigo-500/20',   text: 'text-indigo-800 dark:text-indigo-200',   border: 'border-indigo-300 dark:border-indigo-600' },
    AGE:           { bg: 'bg-yellow-100 dark:bg-yellow-500/20',   text: 'text-yellow-800 dark:text-yellow-200',   border: 'border-yellow-300 dark:border-yellow-600' },
    DEFAULT:       { bg: 'bg-slate-100 dark:bg-slate-700',        text: 'text-slate-700 dark:text-slate-200',     border: 'border-slate-300 dark:border-slate-600' },
};

export function getPiiColor(label: string) {
    return PII_LABEL_COLORS[label?.toUpperCase()] ?? PII_LABEL_COLORS['DEFAULT'];
}

// ── PII Badge ──────────────────────────────────────────────────────────────

function PiiBadge({ text, label, isUnique }: { text: string; label: string; isUnique?: boolean }) {
    const c = getPiiColor(label);
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-medium ${c.bg} ${c.text} ${c.border} ${isUnique ? 'ring-1 ring-purple-400' : ''}`}>
            <span className="font-mono opacity-60 text-[8px]">{label}</span>
            <span className="max-w-[120px] truncate" title={text}>"{text}"</span>
        </span>
    );
}

// ── ModelCard ──────────────────────────────────────────────────────────────

function ModelCard({
    ranked,
    modelResult,
    info,
}: {
    ranked: RankedEntry;
    modelResult: ModelShowdownResult;
    info: ModelInfo;
}) {
    const [showAllPii, setShowAllPii] = useState(false);
    const rankIdx = ranked.rank - 1;

    // Build detected PII list — filter out FN (missed) items from predictions
    const detected: Prediction[] = (modelResult.predictions ?? [])
        .filter(p => p.result !== 'FN' && p.text && p.label)
        .filter(p => {
            // deduplicate by (text, label)
            return true;
        });

    // Deduplicate detected for display
    const seen = new Set<string>();
    const uniqueDetected: Prediction[] = [];
    for (const p of detected) {
        const key = `${p.label}::${p.text}`;
        if (!seen.has(key)) { seen.add(key); uniqueDetected.push(p); }
    }

    const SHOW_LIMIT = 8;
    const visiblePii = showAllPii ? uniqueDetected : uniqueDetected.slice(0, SHOW_LIMIT);
    const hiddenCount = uniqueDetected.length - SHOW_LIMIT;

    const typeEntries = Object.entries(modelResult.type_counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    return (
        <div className={`relative rounded-2xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/30 flex flex-col ${
            rankIdx === 0 ? 'border-amber-300 dark:border-amber-600/50' : 'border-slate-200 dark:border-slate-700'
        }`}>

            {/* Rank badge */}
            <div className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shadow-lg bg-gradient-to-br ${
                RANK_STYLES[rankIdx] ?? 'from-slate-200 to-slate-300 text-slate-700'
            }`}>
                {rankIdx === 0 && <Trophy size={12} className="absolute -top-1 -right-1 text-amber-500" />}
                #{ranked.rank}
            </div>

            {/* Header */}
            <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 pr-10 leading-tight">{info.label}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${TYPE_TAG[info.type] ?? 'bg-slate-100 text-slate-600'}`}>
                        {info.type}
                    </span>
                    {info.params !== '—' && <span className="text-[9px] text-slate-400">{info.params}</span>}
                    {info.lazy && <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 font-mono">LAZY</span>}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
                {[
                    { label: 'Accuracy',  value: `${(modelResult.accuracy * 100).toFixed(1)}%`, color: ACC_COLOR(modelResult.accuracy) },
                    { label: 'PII Found', value: modelResult.pii_count,   color: 'text-slate-900 dark:text-slate-100' },
                    { label: 'Unique',    value: modelResult.unique_count, color: 'text-purple-500' },
                ].map(stat => (
                    <div key={stat.label} className="flex flex-col items-center py-3 gap-0.5">
                        <span className={`text-base font-black ${stat.color}`}>{stat.value}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* PII Type bars */}
            <div className="px-4 pt-4 pb-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Type Breakdown</p>
                {typeEntries.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No PII detected</p>
                ) : (
                    typeEntries.map(([label, count]) => {
                        const c = getPiiColor(label);
                        return (
                            <div key={label} className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div className={`h-full rounded-full bg-emerald-400`}
                                        style={{ width: `${Math.min(100, (count / (modelResult.pii_count || 1)) * 100)}%` }} />
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono w-4 text-right">{count}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${c.bg} ${c.text} min-w-[64px]`}>{label}</span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detected PII items — NEW SECTION */}
            {uniqueDetected.length > 0 && (
                <div className="px-4 pb-3 border-t border-slate-100 dark:border-slate-800 mt-2 pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Tag size={10} className="text-slate-400" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Detected PII</p>
                        <span className="ml-auto text-[9px] font-mono text-slate-400">{uniqueDetected.length} items</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {visiblePii.map((p, i) => (
                            <PiiBadge
                                key={i}
                                text={p.text}
                                label={p.label}
                                isUnique={p.result === 'FP'}
                            />
                        ))}
                    </div>
                    {uniqueDetected.length > SHOW_LIMIT && (
                        <button
                            onClick={() => setShowAllPii(!showAllPii)}
                            className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            {showAllPii
                                ? <><ChevronUp size={11} /> Show less</>
                                : <><ChevronDown size={11} /> +{hiddenCount} more</>
                            }
                        </button>
                    )}
                    {uniqueDetected.some(p => p.result === 'FP') && (
                        <p className="mt-1.5 text-[9px] text-purple-500">
                            <span className="ring-1 ring-purple-400 rounded px-1">ring</span> = unique to this model
                        </p>
                    )}
                </div>
            )}

            {/* Footer: consensus + missed */}
            <div className="flex items-center gap-3 px-4 pb-4 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    <span className="text-[10px] text-slate-500">
                        <span className="font-semibold text-emerald-500">{modelResult.consensus_count}</span> consensus
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <AlertTriangle size={11} className="text-amber-400" />
                    <span className="text-[10px] text-slate-500">
                        <span className="font-semibold text-amber-500">{modelResult.missed_count}</span> missed
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── Main export ────────────────────────────────────────────────────────────

export default function ModelShowdown({ data, modelCatalogue }: Props) {
    const catalogueMap = Object.fromEntries(modelCatalogue.map(m => [m.key, m]));

    return (
        <div className="space-y-6">
            {/* Summary bar */}
            <div className="flex flex-wrap gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center gap-2">
                    <Star size={14} className="text-emerald-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{data.union_total}</span> unique PII spans found
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{data.ranked.length}</span> models evaluated
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Eye size={14} className="text-purple-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Elapsed: <span className="font-bold text-slate-900 dark:text-slate-100">{data.elapsed}s</span>
                    </span>
                </div>
                <div className="ml-auto text-[10px] px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-400 font-semibold">
                    ⚠ Detection-Only — no ground truth
                </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 px-1">
                Accuracy = PII found ÷ union total · Consensus = ≥2 models agree · Ring badge = unique to this model
            </p>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.ranked.map((ranked) => {
                    const modelResult = data.per_model[ranked.model_key];
                    const info = catalogueMap[ranked.model_key];
                    if (!modelResult || !info) return null;
                    return (
                        <ModelCard
                            key={ranked.model_key}
                            ranked={ranked}
                            modelResult={modelResult}
                            info={info}
                        />
                    );
                })}
            </div>
        </div>
    );
}
