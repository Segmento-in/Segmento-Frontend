'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, ModelInfo } from '@/lib/apiClient';

interface ModelSelectorProps {
    onChange: (selectedModels: string[]) => void;
}

const ALWAYS_ON_DEFAULTS = ['regex', 'nltk', 'spacy', 'presidio', 'gliner', 'deberta'];

export const ModelSelector: React.FC<ModelSelectorProps> = ({ onChange }) => {
    const [alwaysOn, setAlwaysOn]   = useState<ModelInfo[]>([]);
    const [lazyModels, setLazy]     = useState<ModelInfo[]>([]);
    const [enabled, setEnabled]     = useState<Set<string>>(new Set(ALWAYS_ON_DEFAULTS));
    const [expanded, setExpanded]   = useState(false);
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        apiClient.getModels().then(data => {
            setAlwaysOn(data.always_on);
            setLazy(data.lazy_loaded);
            setLoading(false);
        }).catch(() => {
            // Fallback if backend not ready yet
            setLoading(false);
        });
    }, []);

    const toggle = (key: string) => {
        setEnabled(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            onChange(Array.from(next));
            return next;
        });
    };

    useEffect(() => {
        onChange(Array.from(enabled));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeCount = enabled.size;

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0F111A]/60 backdrop-blur-md overflow-hidden shadow-lg">
            {/* Header — always visible, toggles the panel */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">🧬</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                        Active Scanners
                    </span>
                    <span className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {activeCount} ON
                    </span>
                </div>
                <span className={`text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {expanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-white/5 pt-4">
                    {loading ? (
                        <p className="text-xs text-slate-400 animate-pulse">Loading model catalogue...</p>
                    ) : (
                        <>
                            {/* Always-On Section */}
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3">
                                    ⚡ Core Engine (Always Available)
                                </p>
                                <div className="space-y-2">
                                    {alwaysOn.map(m => (
                                        <ModelToggleRow
                                            key={m.key}
                                            model={m}
                                            checked={enabled.has(m.key)}
                                            onToggle={() => toggle(m.key)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Lazy-Loaded Section */}
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">
                                    🚀 Advanced Models (Lazy Load)
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-gray-500 mb-3 leading-snug">
                                    First activation takes 10–20s to load into RAM.
                                </p>
                                <div className="space-y-2">
                                    {lazyModels.map(m => (
                                        <ModelToggleRow
                                            key={m.key}
                                            model={m}
                                            checked={enabled.has(m.key)}
                                            onToggle={() => toggle(m.key)}
                                            isLazy
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Sub-component: a single model toggle row                            */
/* ------------------------------------------------------------------ */
interface ToggleRowProps {
    model: ModelInfo;
    checked: boolean;
    onToggle: () => void;
    isLazy?: boolean;
}

const ModelToggleRow: React.FC<ToggleRowProps> = ({ model, checked, onToggle, isLazy }) => (
    <label
        className={`flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-all group
            ${checked
                ? 'bg-indigo-500/10 border border-indigo-500/20'
                : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
            }`}
    >
        {/* Custom toggle pill */}
        <div
            onClick={onToggle}
            className={`relative mt-0.5 w-8 h-4 rounded-full transition-colors flex-shrink-0 cursor-pointer
                ${checked ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all
                ${checked ? 'left-4' : 'left-0.5'}`} />
        </div>

        <div className="min-w-0 flex-1" onClick={onToggle}>
            <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-800 dark:text-white">{model.label}</span>
                {isLazy && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                        LAZY
                    </span>
                )}
                {checked && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                        ACTIVE
                    </span>
                )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 leading-snug mt-0.5 truncate">
                {model.description}
            </p>
        </div>
    </label>
);
