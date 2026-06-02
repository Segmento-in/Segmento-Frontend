'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, BarChart2, AlertTriangle, GitCompare, Layers, Plug, ChevronDown } from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { EvaluatorModel, apiClient } from '@/lib/apiClient';
import UploadScanTab from './tabs/UploadScanTab';
import DocumentViewTab from './tabs/DocumentViewTab';
import MetricsTab from './tabs/MetricsTab';
import FailuresTab from './tabs/FailuresTab';
import CompareTab from './tabs/CompareTab';
import FormatScanTab from './tabs/FormatScanTab';
import DriveScanTab from './tabs/DriveScanTab';
import S3ScanTab from './tabs/S3ScanTab';
import AzureScanTab from './tabs/AzureScanTab';
import GCSScanTab from './tabs/GCSScanTab';

// ── Regular tabs (indices 0-5, unchanged) ──────────────────────────────────
const TABS = [
    { label: '🗂️ Format Scan',   id: 'formatscan' },
    { label: '📁 Upload & Scan', id: 'upload' },
    { label: '📄 Document View', id: 'docview' },
    { label: '📊 Metrics',       id: 'metrics' },
    { label: '🔍 Failures',      id: 'failures' },
    { label: '📌 Compare',       id: 'compare' },
];

// ── Connector registry ─────────────────────────────────────────────────────
const CONNECTORS = [
    {
        id: 'drive' as const,
        emoji: '☁️',
        label: 'Google Drive',
        description: 'Browse Drive folders & scan with AI models',
        accent: { pill: 'bg-blue-600', ring: 'ring-blue-400/40', badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50' },
    },
    {
        id: 's3' as const,
        emoji: '🪣',
        label: 'Amazon S3',
        description: 'Scan files from S3 buckets for PII',
        accent: { pill: 'bg-orange-500', ring: 'ring-orange-400/40', badge: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700/50' },
    },
    {
        id: 'azure' as const,
        emoji: '🔷',
        label: 'Azure Blob',
        description: 'Scan blobs from Azure Storage containers',
        accent: { pill: 'bg-sky-600', ring: 'ring-sky-400/40', badge: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700/50' },
    },
    {
        id: 'gcs' as const,
        emoji: '🗄️',
        label: 'Google Cloud Storage',
        description: 'Scan files from GCS buckets for PII',
        accent: { pill: 'bg-amber-500', ring: 'ring-amber-400/40', badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50' },
    },
] as const;

type ConnectorId = typeof CONNECTORS[number]['id'];

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

    // Local connector state — lives here, not in global ModelLabState
    const [activeConnector, setActiveConnector] = useState<ConnectorId>('drive');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch model catalogue once
    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        apiClient
            .evaluatorGetModels()
            .then((res) => update({ modelCatalogue: res.models }))
            .catch(() => update({ modelCatalogue: FALLBACK_CATALOGUE }));
    }, [update]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selectConnector = (id: ConnectorId) => {
        setActiveConnector(id);
        update({ activeTab: 6 });
        setDropdownOpen(false);
    };

    const isConnectorsActive = state.activeTab === 6;
    const conn = CONNECTORS.find(c => c.id === activeConnector)!;

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

                {/* Thin divider */}
                <div className="w-px h-6 mx-1 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

                {/* Connectors dropdown — outside overflow div, never clipped */}
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                        onClick={() => {
                            if (!isConnectorsActive) update({ activeTab: 6 });
                            setDropdownOpen(prev => !prev);
                        }}
                        className={`relative flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isConnectorsActive
                                ? 'text-emerald-800 dark:text-emerald-300'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                    >
                        {isConnectorsActive && (
                            <motion.div
                                layoutId="tab-pill"
                                className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/15 rounded-xl border border-emerald-300 dark:border-emerald-500/30"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                            <Plug className="w-3.5 h-3.5" />
                            {isConnectorsActive
                                ? <>{conn.emoji} {conn.label}</>
                                : 'Connectors'
                            }
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </span>
                    </button>

                    {/* Dropdown panel — absolutely positioned below button, z-50 escapes all parents */}
                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 p-2"
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-3 py-2">
                                    Data Connectors
                                </p>
                                {CONNECTORS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => selectConnector(c.id)}
                                        className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left ${
                                            activeConnector === c.id && isConnectorsActive
                                                ? 'bg-slate-100 dark:bg-slate-800'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <span className="text-xl leading-none mt-0.5">{c.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{c.label}</span>
                                                {activeConnector === c.id && isConnectorsActive && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{c.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Tab panels ──────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.activeTab === 6 ? `connectors-${activeConnector}` : state.activeTab}
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

                    {/* Connectors panel — renders the active connector */}
                    {state.activeTab === 6 && activeConnector === 'drive'  && <DriveScanTab modelCatalogue={state.modelCatalogue} />}
                    {state.activeTab === 6 && activeConnector === 's3'     && <S3ScanTab    modelCatalogue={state.modelCatalogue} />}
                    {state.activeTab === 6 && activeConnector === 'azure'  && <AzureScanTab modelCatalogue={state.modelCatalogue} />}
                    {state.activeTab === 6 && activeConnector === 'gcs'    && <GCSScanTab   modelCatalogue={state.modelCatalogue} />}
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