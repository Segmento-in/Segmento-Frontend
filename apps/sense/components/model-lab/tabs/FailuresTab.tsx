'use client';

import React from 'react';
import { AlertTriangle, XCircle, Info, AlertCircle } from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';

interface Props {
    state: ModelLabState;
    update: (patch: Partial<ModelLabState>) => void;
}

export default function FailuresTab({ state, update }: Props) {
    const modelKeys = Object.keys(state.scanResult?.per_model ?? {});
    const modelData = state.scanResult?.per_model?.[state.activeModelKey];

    if (!state.scanResult) {
        return <Empty message="Run a scan first — failure analysis will appear here." />;
    }
    if (!state.scanResult.has_gt) {
        return <Empty message="Ground truth required for failure analysis. Upload a labeled dataset." />;
    }
    if (!modelData) {
        return <Empty message="Select a model to view its failures." />;
    }

    const missed = modelData.failures.missed;
    const fps    = modelData.failures.false_positives;
    const highFp = fps.filter(f => f.confidence >= 0.7);
    const lowFp  = fps.filter(f => f.confidence < 0.7);

    return (
        <div className="flex flex-col gap-6">
            {/* Model switcher */}
            {modelKeys.length > 1 && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Model:</span>

                    <div className="flex gap-1 flex-wrap">
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
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* False Negatives */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <XCircle size={15} className="text-red-400" />

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            False Negatives{' '}
                            <span className="text-red-400">({missed.length})</span>
                        </h3>

                        <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">
                            Missed by the model
                        </span>
                    </div>

                    {missed.length === 0 ? (
                        <div className="px-4 py-6 rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 text-center">
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                                🎉 No false negatives!
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                            {missed.map((e, i) => (
                                <div
                                    key={i}
                                    className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300 font-mono">
                                            {e.entity_type}
                                        </span>

                                        <span
                                            className={`text-[9px] px-2 py-0.5 rounded font-mono ${
                                                e.reason.startsWith('CHUNK')
                                                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
                                            }`}
                                        >
                                            {e.reason.split('—')[0].trim()}
                                        </span>
                                    </div>

                                    <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                                        "{e.value}"
                                    </p>

                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {e.context}
                                    </p>

                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 italic">
                                        {e.reason.split('—')[1]?.trim()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* False Positives */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={15} className="text-orange-400" />

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            False Positives{' '}
                            <span className="text-orange-400">({fps.length})</span>
                        </h3>

                        <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">
                            Wrong flags
                        </span>
                    </div>

                    {fps.length === 0 ? (
                        <div className="px-4 py-6 rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 text-center">
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                                🎉 No false positives!
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                            {fps.map((e, i) => (
                                <div
                                    key={i}
                                    className="px-4 py-3 rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/10"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300 font-mono">
                                            {e.entity_type}
                                        </span>

                                        <span
                                            className={`text-[10px] font-mono ${
                                                e.confidence >= 0.7
                                                    ? 'text-orange-500 dark:text-orange-300'
                                                    : 'text-yellow-600 dark:text-yellow-300'
                                            }`}
                                        >
                                            {(e.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>

                                    <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1.5">
                                        "{e.value}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fix recommendations */}
                    {fps.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2">
                                <Info size={12} className="text-blue-400" />

                                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-300">
                                    Fix Recommendations
                                </span>
                            </div>

                            {lowFp.length > 0 && (
                                <div className="px-3 py-2.5 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10">
                                    <p className="text-[11px] text-blue-700 dark:text-blue-300">
                                        <strong>{lowFp.length} low-confidence</strong> FP — raise confidence threshold above{' '}
                                        <code className="text-blue-800 dark:text-blue-200">
                                            {Math.max(...lowFp.map(f => f.confidence)).toFixed(2)}
                                        </code>
                                    </p>
                                </div>
                            )}

                            {highFp.length > 0 && (
                                <div className="px-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10">
                                    <p className="text-[11px] text-purple-700 dark:text-purple-300">
                                        <strong>{highFp.length} high-confidence</strong> FP — model needs fine-tuning on this entity type
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Empty({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl border border-slate-200 bg-white shadow-sm border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
            <AlertCircle size={32} className="text-slate-500 dark:text-slate-400" />

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs text-center">
                {message}
            </p>
        </div>
    );
}