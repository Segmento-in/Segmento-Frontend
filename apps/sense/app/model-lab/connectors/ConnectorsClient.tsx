'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, Plug, Cloud, Database, Server,
} from 'lucide-react';
import { apiClient, EvaluatorModel } from '@/lib/apiClient';

// ── Connector Tab Components (imported as-is, zero modification) ─────────────
import DriveScanTab from '@/components/model-lab/tabs/DriveScanTab';
import S3ScanTab from '@/components/model-lab/tabs/S3ScanTab';
import AzureScanTab from '@/components/model-lab/tabs/AzureScanTab';
import GCSScanTab from '@/components/model-lab/tabs/GCSScanTab';

// ── Connector Registry ────────────────────────────────────────────────────────
const CONNECTORS = [
    {
        id: 'drive' as const,
        emoji: '☁️',
        label: 'Google Drive',
        shortLabel: 'Drive',
        description: 'Browse Drive folders & scan files with AI models for PII',
        tag: 'OAuth2 / Service Account',
        Icon: Cloud,
        accent: {
            bg: 'bg-blue-50 hover:bg-blue-100/80',
            border: 'border-blue-200',
            activeBg: 'bg-blue-600',
            activeBorder: 'border-blue-600',
            pill: 'bg-blue-100 text-blue-700 border-blue-200',
            ring: 'ring-blue-400/30',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            dot: 'bg-blue-500',
            glow: 'shadow-blue-500/20',
        },
    },
    {
        id: 's3' as const,
        emoji: '🪣',
        label: 'Amazon S3',
        shortLabel: 'S3',
        description: 'Connect to AWS S3 buckets and run PII scans in-memory',
        tag: 'IAM Access Keys',
        Icon: Database,
        accent: {
            bg: 'bg-orange-50 hover:bg-orange-100/80',
            border: 'border-orange-200',
            activeBg: 'bg-orange-500',
            activeBorder: 'border-orange-500',
            pill: 'bg-orange-100 text-orange-700 border-orange-200',
            ring: 'ring-orange-400/30',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            dot: 'bg-orange-500',
            glow: 'shadow-orange-500/20',
        },
    },
    {
        id: 'azure' as const,
        emoji: '🔷',
        label: 'Azure Blob Storage',
        shortLabel: 'Azure',
        description: 'Scan blobs from Azure Storage containers for PII entities',
        tag: 'Connection String',
        Icon: Server,
        accent: {
            bg: 'bg-sky-50 hover:bg-sky-100/80',
            border: 'border-sky-200',
            activeBg: 'bg-sky-600',
            activeBorder: 'border-sky-600',
            pill: 'bg-sky-100 text-sky-700 border-sky-200',
            ring: 'ring-sky-400/30',
            iconBg: 'bg-sky-100',
            iconColor: 'text-sky-600',
            dot: 'bg-sky-500',
            glow: 'shadow-sky-500/20',
        },
    },
    {
        id: 'gcs' as const,
        emoji: '🗄️',
        label: 'Google Cloud Storage',
        shortLabel: 'GCS',
        description: 'Browse GCS buckets and scan files for PII in-memory',
        tag: 'Service Account JSON',
        Icon: Database,
        accent: {
            bg: 'bg-amber-50 hover:bg-amber-100/80',
            border: 'border-amber-200',
            activeBg: 'bg-amber-500',
            activeBorder: 'border-amber-500',
            pill: 'bg-amber-100 text-amber-700 border-amber-200',
            ring: 'ring-amber-400/30',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            dot: 'bg-amber-500',
            glow: 'shadow-amber-500/20',
        },
    },
] as const;

type ConnectorId = typeof CONNECTORS[number]['id'];

// ── Fallback model catalogue (matches ModelLabTabs) ───────────────────────────
const FALLBACK_CATALOGUE: EvaluatorModel[] = [
    { key: 'regex',         label: 'Regex Engine',    hf_id: 'deterministic',                                      type: 'Rule-based',  params: '—',    f1_benchmark: 1.0,   lazy: false, description: 'Deterministic regex patterns.' },
    { key: 'nltk',          label: 'NLTK Chunker',    hf_id: 'nltk',                                               type: 'Statistical', params: '—',    f1_benchmark: 0.0,   lazy: false, description: 'NLTK ne_chunk.' },
    { key: 'spacy',         label: 'SpaCy LG',        hf_id: 'en_core_web_lg',                                     type: 'Statistical', params: '685M', f1_benchmark: 0.0,   lazy: false, description: 'SpaCy en_core_web_lg.' },
    { key: 'presidio',      label: 'MS Presidio',     hf_id: 'microsoft/presidio-analyzer',                        type: 'Rule+ML',     params: '—',    f1_benchmark: 0.0,   lazy: false, description: 'Microsoft Presidio.' },
    { key: 'gliner',        label: 'GLiNER Small',    hf_id: 'urchade/gliner_small-v2.1',                          type: 'GLiNER',      params: 'small',f1_benchmark: 0.85,  lazy: false, description: 'Zero-shot GLiNER small.' },
    { key: 'deberta',       label: 'DeBERTa PII',     hf_id: 'lakshyakh93/deberta-large-finetuned-pii',            type: 'NER',         params: '86M',  f1_benchmark: 0.92,  lazy: false, description: 'Kaggle-winning DeBERTa V3.' },
    { key: 'pasteproof',    label: 'Pasteproof v2',   hf_id: 'joneauxedgar/pasteproof-pii-detector-v2',            type: 'NER',         params: '149M', f1_benchmark: 0.97,  lazy: true,  description: 'ModernBERT 149M.' },
    { key: 'piiranha',      label: 'Piiranha v1',     hf_id: 'iiiorg/piiranha-v1-detect-personal-information',     type: 'NER',         params: '86M',  f1_benchmark: 0.931, lazy: true,  description: 'DeBERTa PII detector.' },
    { key: 'nvidia_gliner', label: 'NVIDIA GLiNER',   hf_id: 'nvidia/gliner-PII-0.1',                              type: 'GLiNER',      params: '570M', f1_benchmark: 0.87,  lazy: true,  description: 'NVIDIA GLiNER 37-label.' },
    { key: 'mmbert',        label: 'mmbert32k',       hf_id: 'llm-semantic-router/mmbert32k-pii-detector-merged',  type: 'NER',         params: '307M', f1_benchmark: 0.969, lazy: true,  description: 'ModernBERT 32k context.' },
    { key: 'nerguard',      label: 'NerGuard-0.3B',   hf_id: 'exdsgift/NerGuard-0.3B',                             type: 'NER',         params: '300M', f1_benchmark: 0.996, lazy: true,  description: 'mDeBERTa — highest F1.' },
    { key: 'gliner_large',  label: 'GLiNER PII Large',hf_id: 'knowledgator/gliner-pii-large-v1.0',                 type: 'GLiNER',      params: 'large',f1_benchmark: 0.833, lazy: true,  description: 'GLiNER large PII.' },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function ConnectorsClient() {
    const [activeConnector, setActiveConnector] = useState<ConnectorId>('drive');
    const [modelCatalogue, setModelCatalogue] = useState<EvaluatorModel[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    // Fetch model catalogue independently — this page owns its own state
    useEffect(() => {
        apiClient
            .evaluatorGetModels()
            .then((res) => setModelCatalogue(res.models))
            .catch(() => setModelCatalogue(FALLBACK_CATALOGUE));
    }, []);

    const activeConn = CONNECTORS.find(c => c.id === activeConnector)!;

    const handleSelectConnector = (id: ConnectorId) => {
        setActiveConnector(id);
        // Smooth scroll to content panel so the user sees the transition
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ── Breadcrumb / Top Nav ────────────────────────────────────── */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
                    <Link
                        href="/model-lab"
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                        Model Lab
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    <div className="flex items-center gap-2">
                        <Plug className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-sm font-semibold text-slate-900">Connectors</span>
                    </div>
                    {/* Active connector badge */}
                    <div className="ml-2 flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <motion.span
                            key={activeConnector}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm font-medium text-slate-500"
                        >
                            {activeConn.label}
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* ── Page Hero ───────────────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-emerald-100 rounded-xl">
                                    <Plug className="w-5 h-5 text-emerald-700" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                    Data Connectors
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
                                Cloud PII Scanner
                            </h1>
                            <p className="text-base text-slate-500 max-w-xl leading-relaxed">
                                Connect to any cloud storage provider and run all{' '}
                                <span className="font-semibold text-slate-700">AI detection models</span> in-memory.
                                Zero data retention. Results in seconds.
                            </p>
                        </div>
                        {/* Stats strip */}
                        <div className="flex items-center gap-6 shrink-0">
                            <div className="text-center">
                                <p className="text-2xl font-black text-slate-900">4</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Connectors</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-center">
                                <p className="text-2xl font-black text-emerald-600">11+</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-0.5">AI Models</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-center">
                                <p className="text-2xl font-black text-slate-900">0</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Data Stored</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Connector Picker Cards ──────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Select a Connector
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CONNECTORS.map((conn) => {
                        const isActive = activeConnector === conn.id;
                        return (
                            <motion.button
                                key={conn.id}
                                onClick={() => handleSelectConnector(conn.id)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`
                                    relative text-left p-5 rounded-2xl border-2 transition-all duration-200
                                    ${isActive
                                        ? `${conn.accent.activeBg} ${conn.accent.activeBorder} shadow-lg ${conn.accent.glow} ring-4 ${conn.accent.ring}`
                                        : `bg-white ${conn.accent.border} hover:shadow-md`
                                    }
                                `}
                            >
                                {/* Active indicator dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="connector-active-dot"
                                        className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-white/80"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                    />
                                )}

                                {/* Icon */}
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl
                                    ${isActive ? 'bg-white/20' : conn.accent.iconBg}
                                `}>
                                    {conn.emoji}
                                </div>

                                {/* Label */}
                                <p className={`text-sm font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                    {conn.label}
                                </p>

                                {/* Description */}
                                <p className={`text-xs leading-relaxed mb-3 ${isActive ? 'text-white/75' : 'text-slate-500'}`}>
                                    {conn.description}
                                </p>

                                {/* Auth tag */}
                                <span className={`
                                    inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
                                    ${isActive
                                        ? 'bg-white/15 text-white border-white/30'
                                        : conn.accent.pill
                                    }
                                `}>
                                    {conn.tag}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* ── Active Connector Scan UI (Full Width) ───────────────────── */}
            <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* Section header for active connector */}
                <motion.div
                    key={`header-${activeConnector}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-200"
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${activeConn.accent.iconBg}`}>
                        {activeConn.emoji}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{activeConn.label}</h2>
                        <p className="text-xs text-slate-500">{activeConn.description}</p>
                    </div>
                    <div className="ml-auto">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${activeConn.accent.pill}`}>
                            {activeConn.tag}
                        </span>
                    </div>
                </motion.div>

                {/* Connector content panel — full width, smooth transition */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeConnector}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {activeConnector === 'drive' && (
                            <DriveScanTab modelCatalogue={modelCatalogue} />
                        )}
                        {activeConnector === 's3' && (
                            <S3ScanTab modelCatalogue={modelCatalogue} />
                        )}
                        {activeConnector === 'azure' && (
                            <AzureScanTab modelCatalogue={modelCatalogue} />
                        )}
                        {activeConnector === 'gcs' && (
                            <GCSScanTab modelCatalogue={modelCatalogue} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Footer spacer ───────────────────────────────────────────── */}
            <div className="h-24" />
        </div>
    );
}
