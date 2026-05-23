'use client';

import React from 'react';
import { Trophy, Eye, AlertTriangle, CheckCircle2, Star } from 'lucide-react';

interface TypeCount { [label: string]: number }

interface ModelShowdownResult {
    pii_count: number;
    accuracy: number;
    type_counts: TypeCount;
    unique_count: number;
    missed_count: number;
    consensus_count: number;
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

            {/* Accuracy = found ÷ union legend */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 px-1">
                Accuracy = PII found by model ÷ total unique PII across all models.
                Consensus = found by ≥2 models. Unique = only this model found it.
            </p>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.ranked.map((ranked) => {
                    const modelResult = data.per_model[ranked.model_key];
                    const info = catalogueMap[ranked.model_key];
                    if (!modelResult || !info) return null;

                    const rankIdx = ranked.rank - 1;
                    const typeEntries = Object.entries(modelResult.type_counts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 8);

                    return (
                        <div
                            key={ranked.model_key}
                            className={`relative rounded-2xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/30 ${
                                rankIdx === 0
                                    ? 'border-amber-300 dark:border-amber-600/50'
                                    : 'border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            {/* Rank badge */}
                            <div className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shadow-lg bg-gradient-to-br ${
                                RANK_STYLES[rankIdx] ?? 'from-slate-200 to-slate-300 text-slate-700'
                            }`}>
                                {ranked.rank <= 3 && rankIdx === 0 && <Trophy size={14} className="absolute -top-1 -right-1 text-amber-500" />}
                                #{ranked.rank}
                            </div>

                            {/* Card header */}
                            <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 pr-10 leading-tight">
                                    {info.label}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border-0 ${TYPE_TAG[info.type] ?? 'bg-slate-100 text-slate-600'}`}>
                                        {info.type}
                                    </span>
                                    {info.params !== '—' && (
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500">{info.params}</span>
                                    )}
                                    {info.lazy && (
                                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 font-mono">LAZY</span>
                                    )}
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
                                {[
                                    { label: 'Accuracy', value: `${(modelResult.accuracy * 100).toFixed(1)}%`, color: ACC_COLOR(modelResult.accuracy) },
                                    { label: 'PII Found', value: modelResult.pii_count, color: 'text-slate-900 dark:text-slate-100' },
                                    { label: 'Unique', value: modelResult.unique_count, color: 'text-purple-500' },
                                ].map(stat => (
                                    <div key={stat.label} className="flex flex-col items-center py-3 gap-0.5">
                                        <span className={`text-base font-black ${stat.color}`}>{stat.value}</span>
                                        <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* PII type breakdown */}
                            <div className="p-4 space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                                    PII Types Detected
                                </p>
                                {typeEntries.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No PII detected</p>
                                ) : (
                                    typeEntries.map(([label, count]) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-400 rounded-full"
                                                    style={{ width: `${Math.min(100, (count / (modelResult.pii_count || 1)) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 w-5 text-right font-mono">{count}</span>
                                            <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium min-w-[60px]">{label}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Missed / consensus footer */}
                            <div className="flex items-center gap-3 px-4 pb-4">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={11} className="text-emerald-400" />
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold text-emerald-500">{modelResult.consensus_count}</span> consensus
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertTriangle size={11} className="text-amber-400" />
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold text-amber-500">{modelResult.missed_count}</span> missed
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
