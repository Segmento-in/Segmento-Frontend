'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plug, ChevronRight } from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { EvaluatorModel, apiClient } from '@/lib/apiClient';
import UploadScanTab from './tabs/UploadScanTab';
import DocumentViewTab from './tabs/DocumentViewTab';
import MetricsTab from './tabs/MetricsTab';
import FailuresTab from './tabs/FailuresTab';
import CompareTab from './tabs/CompareTab';
import FormatScanTab from './tabs/FormatScanTab';

// ── Regular tabs (indices 0-5, unchanged) ──────────────────────────────────
const TABS = [
    { label: '🗂️ Format Scan',   id: 'formatscan' },
    { label: '📁 Upload & Scan', id: 'upload' },
    { label: '📄 Document View', id: 'docview' },
    { label: '📊 Metrics',       id: 'metrics' },
    { label: '🔍 Failures',      id: 'failures' },
    { label: '📌 Compare',       id: 'compare' },
];



// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
    state: ModelLabState;
    update: (patch: Partial<ModelLabState>) => void;
    pinResult: (modelKey: string, label: string) => void;
    removePin: (idx: number) => void;
    clearPins: () => void;
}

export default function ModelLabTabs({ state, update, pinResult, removePin, clearPins }: Props) {
    const didFetch = useRef(false);

    // Fetch model catalogue once
    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        apiClient
            .evaluatorGetModels()
            .then((res) => update({ modelCatalogue: res.models }))
            .catch(() => update({ modelCatalogue: FALLBACK_CATALOGUE }));
    }, [update]);

    return (
        <section className="max-w-7xl mx-auto px-4 pb-24 dark:bg-[#0F172A]">

            {/* ── Tab bar ─────────────────────────────────────────────── */}
            {/*
                Layout: outer flex row (no overflow) holds:
                  1. Inner scrollable div  — regular tabs (overflow-x-auto)
                  2. Thin divider          — flex-shrink-0
                  3. Connectors button     — flex-shrink-0, OUTSIDE the overflow div
                                            so the dropdown is never clipped.
            */}
            <div className="flex items-center p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-8">

                {/* Scrollable regular tabs — takes remaining space */}
                <div className="flex gap-1 overflow-x-auto scrollbar-none flex-1 min-w-0">
                    {TABS.map((tab, idx) => (
                        <button
                            key={tab.id}
                            onClick={() => update({ activeTab: idx })}
                            className={`relative flex-shrink-0 px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                state.activeTab === idx
                                    ? 'text-emerald-800 dark:text-emerald-300'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            {state.activeTab === idx && (
                                <motion.div
                                    layoutId="tab-pill"
                                    className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/15 rounded-xl border border-emerald-300 dark:border-emerald-500/30"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>


            </div>

            {/* ── Tab panels ──────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                >
                    {state.activeTab === 0 && <FormatScanTab modelCatalogue={state.modelCatalogue} />}
                    {state.activeTab === 1 && <UploadScanTab state={state} update={update} />}
                    {state.activeTab === 2 && <DocumentViewTab state={state} update={update} />}
                    {state.activeTab === 3 && <MetricsTab state={state} update={update} pinResult={pinResult} />}
                    {state.activeTab === 4 && <FailuresTab state={state} update={update} />}
                    {state.activeTab === 5 && <CompareTab state={state} update={update} removePin={removePin} clearPins={clearPins} />}


                </motion.div>
            </AnimatePresence>
        </section>
    );
}

// ── Fallback catalogue (unchanged from original) ───────────────────────────
const FALLBACK_CATALOGUE: EvaluatorModel[] = [
    { key: 'regex',        label: 'Regex Engine',    hf_id: 'deterministic',                                      type: 'Rule-based',  params: '—',    f1_benchmark: 1.0,   lazy: false, description: 'Deterministic regex patterns.' },
    { key: 'nltk',         label: 'NLTK Chunker',    hf_id: 'nltk',                                               type: 'Statistical', params: '—',    f1_benchmark: 0.0,   lazy: false, description: 'NLTK ne_chunk.' },
    { key: 'spacy',        label: 'SpaCy LG',        hf_id: 'en_core_web_lg',                                     type: 'Statistical', params: '685M', f1_benchmark: 0.0,   lazy: false, description: 'SpaCy en_core_web_lg.' },
    { key: 'presidio',     label: 'MS Presidio',     hf_id: 'microsoft/presidio-analyzer',                        type: 'Rule+ML',     params: '—',    f1_benchmark: 0.0,   lazy: false, description: 'Microsoft Presidio.' },
    { key: 'gliner',       label: 'GLiNER Small',    hf_id: 'urchade/gliner_small-v2.1',                          type: 'GLiNER',      params: 'small',f1_benchmark: 0.85,  lazy: false, description: 'Zero-shot GLiNER small.' },
    { key: 'deberta',      label: 'DeBERTa PII',     hf_id: 'lakshyakh93/deberta-large-finetuned-pii',            type: 'NER',         params: '86M',  f1_benchmark: 0.92,  lazy: false, description: 'Kaggle-winning DeBERTa V3.' },
    { key: 'pasteproof',   label: 'Pasteproof v2',   hf_id: 'joneauxedgar/pasteproof-pii-detector-v2',            type: 'NER',         params: '149M', f1_benchmark: 0.97,  lazy: true,  description: 'ModernBERT 149M.' },
    { key: 'piiranha',     label: 'Piiranha v1',     hf_id: 'iiiorg/piiranha-v1-detect-personal-information',     type: 'NER',         params: '86M',  f1_benchmark: 0.931, lazy: true,  description: 'DeBERTa PII detector.' },
    { key: 'nvidia_gliner',label: 'NVIDIA GLiNER',   hf_id: 'nvidia/gliner-PII-0.1',                              type: 'GLiNER',      params: '570M', f1_benchmark: 0.87,  lazy: true,  description: 'NVIDIA GLiNER 37-label.' },
    { key: 'mmbert',       label: 'mmbert32k',       hf_id: 'llm-semantic-router/mmbert32k-pii-detector-merged',  type: 'NER',         params: '307M', f1_benchmark: 0.969, lazy: true,  description: 'ModernBERT 32k context.' },
    { key: 'nerguard',     label: 'NerGuard-0.3B',   hf_id: 'exdsgift/NerGuard-0.3B',                             type: 'NER',         params: '300M', f1_benchmark: 0.996, lazy: true,  description: 'mDeBERTa — highest F1.' },
    { key: 'gliner_large', label: 'GLiNER PII Large',hf_id: 'knowledgator/gliner-pii-large-v1.0',                 type: 'GLiNER',      params: 'large',f1_benchmark: 0.833, lazy: true,  description: 'GLiNER large PII.' },
];