'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plug, ArrowLeft, Shield, Cpu, Lock, Zap } from 'lucide-react';
import { apiClient, EvaluatorModel } from '@/lib/apiClient';

import DriveScanTab from '@/components/model-lab/tabs/DriveScanTab';
import S3ScanTab from '@/components/model-lab/tabs/S3ScanTab';
import AzureScanTab from '@/components/model-lab/tabs/AzureScanTab';
import GCSScanTab from '@/components/model-lab/tabs/GCSScanTab';

// ── Fallback catalogue ────────────────────────────────────────────────────────
const FALLBACK_CATALOGUE: EvaluatorModel[] = [
    { key: 'regex', label: 'Regex Engine', hf_id: 'deterministic', type: 'Rule-based', params: '—', f1_benchmark: 1.0, lazy: false, description: 'Deterministic regex.' },
    { key: 'spacy', label: 'SpaCy LG', hf_id: 'en_core_web_lg', type: 'Statistical', params: '685M', f1_benchmark: 0.0, lazy: false, description: 'SpaCy large.' },
    { key: 'presidio', label: 'MS Presidio', hf_id: 'microsoft/presidio-analyzer', type: 'Rule+ML', params: '—', f1_benchmark: 0.0, lazy: false, description: 'Microsoft Presidio.' },
    { key: 'gliner', label: 'GLiNER Small', hf_id: 'urchade/gliner_small-v2.1', type: 'GLiNER', params: 'small', f1_benchmark: 0.85, lazy: false, description: 'Zero-shot small.' },
    { key: 'deberta', label: 'DeBERTa PII', hf_id: 'lakshyakh93/deberta-large-finetuned-pii', type: 'NER', params: '86M', f1_benchmark: 0.92, lazy: false, description: 'DeBERTa V3.' },
    { key: 'pasteproof', label: 'Pasteproof v2', hf_id: 'joneauxedgar/pasteproof-pii-detector-v2', type: 'NER', params: '149M', f1_benchmark: 0.97, lazy: true, description: 'ModernBERT 149M.' },
    { key: 'piiranha', label: 'Piiranha v1', hf_id: 'iiiorg/piiranha-v1-detect-personal-information', type: 'NER', params: '86M', f1_benchmark: 0.931, lazy: true, description: 'DeBERTa PII.' },
    { key: 'nvidia_gliner', label: 'NVIDIA GLiNER', hf_id: 'nvidia/gliner-PII-0.1', type: 'GLiNER', params: '570M', f1_benchmark: 0.87, lazy: true, description: 'NVIDIA 37-label.' },
    { key: 'mmbert', label: 'mmbert32k', hf_id: 'llm-semantic-router/mmbert32k-pii-detector-merged', type: 'NER', params: '307M', f1_benchmark: 0.969, lazy: true, description: 'ModernBERT 32k.' },
    { key: 'nerguard', label: 'NerGuard-0.3B', hf_id: 'exdsgift/NerGuard-0.3B', type: 'NER', params: '300M', f1_benchmark: 0.996, lazy: true, description: 'mDeBERTa — top F1.' },
    { key: 'gliner_large', label: 'GLiNER PII Large', hf_id: 'knowledgator/gliner-pii-large-v1.0', type: 'GLiNER', params: 'large', f1_benchmark: 0.833, lazy: true, description: 'GLiNER large.' },
];

// ── Connector registry ────────────────────────────────────────────────────────
const CONNECTORS = [
    {
        id: 'drive' as const,
        emoji: '☁️',
        label: 'Google Drive',
        titleLine1: 'Google',
        titleLine2: 'Drive',
        category: 'GOOGLE CLOUD',
        description: 'Browse Drive folders & scan files with AI models for PII detection in-memory.',
        authType: 'OAuth2 / Service Account',
        scanData: ['Drive files & documents', 'Folder structure & paths', 'File metadata & content'],
        features: [
            { Icon: Shield, text: 'Files scanned in-memory — zero data retention' },
            { Icon: Lock, text: 'OAuth2 & Service Account authentication' },
            { Icon: Cpu, text: '11+ AI models for precise PII detection' },
            { Icon: Zap, text: 'Results delivered in seconds, not minutes' },
        ],
        accent: {
            cat: 'bg-blue-50 text-blue-600 border border-blue-100',
            dot: 'bg-blue-500',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            btn: 'group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:shadow-blue-500/25',
            titleColor: 'text-blue-600',
            badge: 'bg-blue-50 text-blue-700 border-blue-200',
            featureIcon: 'text-blue-500',
        },
    },
    {
        id: 's3' as const,
        emoji: '🪣',
        label: 'Amazon S3',
        titleLine1: 'Amazon',
        titleLine2: 'S3',
        category: 'AWS',
        description: 'Connect to AWS S3 buckets and run AI-powered PII scans fully in-memory.',
        authType: 'IAM Access Keys',
        scanData: ['S3 objects & files', 'Bucket contents & paths', 'Object metadata & content'],
        features: [
            { Icon: Shield, text: 'Objects streamed in-memory — zero retention' },
            { Icon: Lock, text: 'IAM Access Key authentication' },
            { Icon: Cpu, text: '11+ AI models for precise PII detection' },
            { Icon: Zap, text: 'Parallel scanning across multiple objects' },
        ],
        accent: {
            cat: 'bg-orange-50 text-orange-600 border border-orange-100',
            dot: 'bg-orange-500',
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-600',
            btn: 'group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white group-hover:shadow-orange-500/25',
            titleColor: 'text-orange-500',
            badge: 'bg-orange-50 text-orange-700 border-orange-200',
            featureIcon: 'text-orange-500',
        },
    },
    {
        id: 'azure' as const,
        emoji: '🔷',
        label: 'Azure Blob Storage',
        titleLine1: 'Azure',
        titleLine2: 'Blob Storage',
        category: 'MICROSOFT AZURE',
        description: 'Scan blobs from Azure Storage containers for PII entities, in-memory.',
        authType: 'Connection String',
        scanData: ['Blob containers & objects', 'Storage container paths', 'Blob metadata & content'],
        features: [
            { Icon: Shield, text: 'Blobs scanned in-memory — zero data stored' },
            { Icon: Lock, text: 'Connection string authentication' },
            { Icon: Cpu, text: '11+ AI models for precise PII detection' },
            { Icon: Zap, text: 'Supports all Azure storage tiers' },
        ],
        accent: {
            cat: 'bg-sky-50 text-sky-600 border border-sky-100',
            dot: 'bg-sky-500',
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-600',
            btn: 'group-hover:bg-sky-600 group-hover:border-sky-600 group-hover:text-white group-hover:shadow-sky-500/25',
            titleColor: 'text-sky-600',
            badge: 'bg-sky-50 text-sky-700 border-sky-200',
            featureIcon: 'text-sky-500',
        },
    },
    {
        id: 'gcs' as const,
        emoji: '🗄️',
        label: 'Google Cloud Storage',
        titleLine1: 'Google Cloud',
        titleLine2: 'Storage',
        category: 'GOOGLE CLOUD',
        description: 'Browse GCS buckets and scan files for PII with zero data retention.',
        authType: 'Service Account JSON',
        scanData: ['GCS bucket objects', 'Storage bucket paths', 'File metadata & content'],
        features: [
            { Icon: Shield, text: 'Files scanned in-memory — zero data retained' },
            { Icon: Lock, text: 'Service Account JSON authentication' },
            { Icon: Cpu, text: '11+ AI models for precise PII detection' },
            { Icon: Zap, text: 'Works across all GCS storage classes' },
        ],
        accent: {
            cat: 'bg-amber-50 text-amber-600 border border-amber-100',
            dot: 'bg-amber-500',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            btn: 'group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white group-hover:shadow-amber-500/25',
            titleColor: 'text-amber-600',
            badge: 'bg-amber-50 text-amber-700 border-amber-200',
            featureIcon: 'text-amber-500',
        },
    },
] as const;

type ConnectorId = typeof CONNECTORS[number]['id'];
type Connector = typeof CONNECTORS[number];

// ── 3-D tilt card ─────────────────────────────────────────────────────────────
function ConnectorCard({ conn, onSelect }: { conn: Connector; onSelect: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rx = ((y - height / 2) / height) * 12;
        const ry = ((width / 2 - x) / width) * 12;
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    };

    const onMouseLeave = () => {
        if (cardRef.current)
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ transition: 'transform 0.18s ease-out, box-shadow 0.3s ease' }}
            className="group bg-white border border-slate-200 rounded-2xl p-7 cursor-pointer shadow-sm hover:shadow-xl flex flex-col"
        >
            {/* Top row: icon + category */}
            <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 ${conn.accent.iconBg} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    {conn.emoji}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${conn.accent.cat}`}>
                    {conn.category}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-slate-700 transition-colors leading-tight">
                {conn.label}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                {conn.description}
            </p>

            {/* Scan data bullets */}
            <div className="mb-7 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Scan Data
                </p>
                <ul className="space-y-2">
                    {conn.scanData.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${conn.accent.dot}`} />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA */}
            <button
                onClick={onSelect}
                className={`
                    w-full py-3.5 rounded-xl border border-slate-900 bg-slate-900 text-white
                    text-sm font-bold flex items-center justify-center gap-2
                    shadow-sm group-hover:shadow-lg transition-all duration-300
                    ${conn.accent.btn}
                `}
            >
                View Connector
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ConnectorsClient() {
    const [selected, setSelected] = useState<ConnectorId | null>(null);
    const [modelCatalogue, setModelCatalogue] = useState<EvaluatorModel[]>([]);
    const [currentStep, setCurrentStep] = useState<'AUTH' | 'BROWSE' | 'CONFIG' | 'RESULTS'>('AUTH');

    // Reset step whenever user picks a different connector
    useEffect(() => { setCurrentStep('AUTH'); }, [selected]);

    useEffect(() => {
        apiClient
            .evaluatorGetModels()
            .then((r) => setModelCatalogue(r.models))
            .catch(() => setModelCatalogue(FALLBACK_CATALOGUE));
    }, []);

    const conn = selected ? CONNECTORS.find((c) => c.id === selected)! : null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ── Sticky breadcrumb ─────────────────────────────────────── */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
                    <Link
                        href="/model-lab"
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                        Model Lab
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    {!conn ? (
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Plug className="w-3.5 h-3.5 text-emerald-600" />
                            Connectors
                        </span>
                    ) : (
                        <>
                            <button
                                onClick={() => setSelected(null)}
                                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <Plug className="w-3.5 h-3.5 text-emerald-600" />
                                Connectors
                            </button>
                            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                            <motion.span
                                key={conn.id}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm font-semibold text-slate-900"
                            >
                                {conn.label}
                            </motion.span>
                        </>
                    )}
                </div>
            </div>

            {/* ── Page views ───────────────────────────────────────────── */}
            <AnimatePresence mode="wait">

                {/* ── GRID VIEW ────────────────────────────────────────── */}
                {!selected && (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                    >
                        {/* Hero */}
                        <div className="bg-white border-b border-slate-200">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-emerald-100 rounded-xl">
                                                <Plug className="w-5 h-5 text-emerald-700" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                                Data Connectors
                                            </span>
                                        </div>
                                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
                                            Cloud PII Scanner
                                        </h1>
                                        <p className="text-base text-slate-500 max-w-xl leading-relaxed">
                                            Connect to any cloud storage provider and run{' '}
                                            <span className="font-semibold text-slate-700">11+ AI detection models</span>{' '}
                                            in-memory. Zero data retention. Results in seconds.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-slate-900">4</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Connectors</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-200" />
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-emerald-600">11+</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">AI Models</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-200" />
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-slate-900">0</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Data Stored</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card grid */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5">
                                Select a Connector
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {CONNECTORS.map((c) => (
                                    <ConnectorCard
                                        key={c.id}
                                        conn={c}
                                        onSelect={() => setSelected(c.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="h-20" />
                    </motion.div>
                )}

                {/* ── DETAIL VIEW ──────────────────────────────────────── */}
                {selected && conn && (
                    <motion.div
                        key={`detail-${selected}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Compact info bar — only shown after AUTH */}
                        {currentStep !== 'AUTH' && (
                            <div className="bg-white border-b border-slate-200 shadow-sm">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 ${conn.accent.iconBg} rounded-xl flex items-center justify-center text-xl shrink-0`}>
                                        {conn.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 leading-tight">{conn.label}</p>
                                        <p className="text-xs text-slate-500 truncate">{conn.description}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${conn.accent.badge}`}>
                                            {conn.authType}
                                        </span>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Connected
                                        </div>
                                        <button
                                            onClick={() => setSelected(null)}
                                            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400"
                                        >
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Single layout wrapper — CSS changes by step, tab always mounted once */}
                        <div className={currentStep === 'AUTH' ? 'bg-white border-b border-slate-200' : ''}>
                            <div className={
                                currentStep === 'AUTH'
                                    ? 'max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'
                                    : 'max-w-7xl mx-auto px-4 sm:px-6 py-6'
                            }>
                                {/* LEFT hero panel — only visible in AUTH step */}
                                {currentStep === 'AUTH' && (
                                    <div>
                                        <button
                                            onClick={() => setSelected(null)}
                                            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
                                        >
                                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                            Back to Connectors
                                        </button>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-mono mb-6 tracking-widest uppercase">
                                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                                            Not Connected
                                        </div>
                                        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-none mb-2">
                                            {conn.titleLine1}
                                        </h1>
                                        <h1 className={`text-5xl sm:text-6xl font-black tracking-tight leading-none mb-2 ${conn.accent.titleColor}`}>
                                            {conn.titleLine2}
                                        </h1>
                                        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-none mb-6">
                                            Connector
                                        </h1>
                                        <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-md">
                                            {conn.description}
                                        </p>
                                        <div className="space-y-3">
                                            {conn.features.map(({ Icon, text }) => (
                                                <div key={text} className="flex items-start gap-3 text-sm text-slate-500">
                                                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${conn.accent.featureIcon}`} />
                                                    <span>{text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Scan tab — ALWAYS mounted here, never remounts when layout switches */}
                                <div className={currentStep === 'AUTH' ? 'min-w-0' : 'w-full'}>
                                    {selected === 'drive' && <DriveScanTab modelCatalogue={modelCatalogue} onStepChange={setCurrentStep} />}
                                    {selected === 's3' && <S3ScanTab modelCatalogue={modelCatalogue} onStepChange={setCurrentStep} />}
                                    {selected === 'azure' && <AzureScanTab modelCatalogue={modelCatalogue} onStepChange={setCurrentStep} />}
                                    {selected === 'gcs' && <GCSScanTab modelCatalogue={modelCatalogue} onStepChange={setCurrentStep} />}
                                </div>
                            </div>
                        </div>

                        <div className="h-24" />
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
