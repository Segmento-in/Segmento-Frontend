'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plug, ArrowLeft, Shield, Cpu, Lock, Zap, LayoutGrid, User } from 'lucide-react';
import { apiClient, EvaluatorModel } from '@/lib/apiClient';

import DriveScanTab from '@/components/model-lab/tabs/DriveScanTab';
import S3ScanTab from '@/components/model-lab/tabs/S3ScanTab';
import AzureScanTab from '@/components/model-lab/tabs/AzureScanTab';
import GCSScanTab from '@/components/model-lab/tabs/GCSScanTab';
import DatabaseScanTab from '@/components/model-lab/tabs/DatabaseScanTab';

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
    {
        id: 'database' as const,
        emoji: '🗃️',
        label: 'Relational Database',
        titleLine1: 'SQL',
        titleLine2: 'Database',
        category: 'DATABASES',
        description: 'Connect to PostgreSQL or MySQL, browse tables, and run PII scans fully in-memory.',
        authType: 'Host / User / Password',
        scanData: ['Table rows & columns', 'Schema metadata', 'PII entities per column'],
        features: [
            { Icon: Shield, text: 'Rows scanned in-memory — zero data retained' },
            { Icon: Lock, text: 'Direct JDBC-style connection (host + credentials)' },
            { Icon: Cpu, text: '11+ AI models for precise PII detection' },
            { Icon: Zap, text: 'Supports PostgreSQL & MySQL' },
        ],
        accent: {
            cat: 'bg-violet-50 text-violet-600 border border-violet-100',
            dot: 'bg-violet-500',
            iconBg: 'bg-violet-50',
            iconColor: 'text-violet-600',
            btn: 'group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:text-white group-hover:shadow-violet-500/25',
            titleColor: 'text-violet-600',
            badge: 'bg-violet-50 text-violet-700 border-violet-200',
            featureIcon: 'text-violet-500',
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

interface FlowState {
    id: string;
    connector: ConnectorId;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ConnectorsClient() {
    const [modelCatalogue, setModelCatalogue] = useState<EvaluatorModel[]>([]);

    // Core state for new navigation behavior
    // 'connectors' = connector grid, 'scan' = active configuring flow, 'results' = retained profile results
    const [rightView, setRightView] = useState<'connectors' | 'scan' | 'results'>('connectors');
    const [hasResults, setHasResults] = useState(false);
    // Manage instances of scan flows
    const [configuring, setConfiguring] = useState<FlowState | null>(null);
    const [profile, setProfile] = useState<FlowState | null>(null);

    // Track the step ONLY for the configuring flow
    const [currentStep, setCurrentStep] = useState<'AUTH' | 'BROWSE' | 'CONFIG' | 'RESULTS'>('AUTH');

    const handleStepChange = (flowId: string, step: 'AUTH' | 'BROWSE' | 'CONFIG' | 'RESULTS') => {
        if (configuring?.id === flowId) {
            setCurrentStep(step);
        }
        // Activate Profile as soon as there's browseable/scannable content
        if ((step === 'BROWSE' || step === 'RESULTS') && configuring?.id === flowId) {
            setHasResults(true);
            setProfile(configuring);
        }
        // On RESULTS: switch view and clear the active configuring slot
        if (step === 'RESULTS') {
            setRightView('results');
            if (configuring?.id === flowId) {
                setConfiguring(null);
            }
        }
    };

    return (
        <div className="flex flex-1 min-h-0 bg-white text-slate-900">

            {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
            <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-y-auto z-30">

                {/* Sidebar header */}
                <div className="px-4 pt-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Plug className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Data Connectors</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5 leading-snug">Scan cloud storage for PII</p>
                </div>

                {/* Back to Model Lab */}
                <div className="px-3 pt-3">
                    <Link
                        href="/model-lab"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                        Model Lab
                    </Link>
                </div>

                {/* Divider */}
                <div className="mx-4 mt-2 mb-2 border-t border-slate-100" />
                <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">Available</p>

                {/* Navigation Buttons */}
                <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">


                    {/* Connectors Button — always goes to the grid; parks in-progress flow to Profile */}
                    <button
                        onClick={() => {
                            // If user is in a flow that's past AUTH (BROWSE/RESULTS), park it to Profile
                            if (configuring && currentStep !== 'AUTH') {
                                setProfile(configuring);
                                setConfiguring(null);
                                setHasResults(true);
                            }
                            setRightView('connectors');
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${(rightView === 'connectors' || rightView === 'scan')
                                ? 'bg-slate-900 shadow-md text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${(rightView === 'connectors' || rightView === 'scan') ? 'bg-white/10' : 'bg-slate-100 text-slate-500'
                            }`}>
                            <LayoutGrid className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">Connectors</p>
                            <p className="text-[10px] truncate text-slate-400">Available Sources</p>
                        </div>
                        {/* Dot indicator when a scan flow is in progress */}
                        {configuring && (
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-pulse" />
                        )}
                    </button>

                </nav>

                {/* Sidebar footer stats */}
                <div className="px-4 py-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <div><span className="font-bold text-emerald-500">11+</span> AI models</div>
                        <div className="w-px h-3 bg-slate-200" />
                        <div><span className="font-bold text-slate-600">0</span> stored</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        N
                    </div>
                </div>

            </aside>

            {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative">

                {/* ── GRID VIEW ────────────────────────────────────────── */}
                <div className={`flex-col flex-1 min-h-0 overflow-y-auto ${rightView === 'connectors' ? 'flex' : 'hidden'}`}>
                    {/* Hero */}
                    <div className="bg-white border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                Data Connectors
                            </h1>
                            <p className="mt-4 text-base text-slate-500 max-w-2xl">
                                Select a storage connector to scan files and objects for PII. Segmento Sense analyzes your data strictly in-memory — ensuring zero retention and maximum security.
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5">
                                Select a Connector
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {CONNECTORS.map((c) => (
                                    <ConnectorCard
                                        key={c.id}
                                        conn={c}
                                        onSelect={() => {
                                            // If this connector is already in-progress, just resume it
                                            if (configuring?.connector === c.id) {
                                                setRightView('scan');
                                            } else {
                                                setConfiguring({ id: `flow-${Date.now()}`, connector: c.id });
                                                setCurrentStep('AUTH');
                                                setRightView('scan');
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── MOUNTED SCAN FLOWS ──────────────────────────────────────── */}
                {[profile, configuring]
                    .filter((f): f is FlowState => f !== null)
                    // Deduplicate: profile and configuring may temporarily point to the same flow
                    .filter((f, idx, arr) => arr.findIndex(x => x.id === f.id) === idx)
                    .map((flow) => {
                    const isProfile = profile?.id === flow.id;
                    const isVisible = (rightView === 'results' && isProfile) ||
                        (rightView === 'scan' && configuring?.id === flow.id);

                    const conn = CONNECTORS.find(c => c.id === flow.connector);
                    if (!conn) return null;

                    // Profile flow: show its internal step (not hardcoded to RESULTS)
                    // The DriveScanTab etc. maintain their own internal step, but the outer
                    // wrapper uses flowStep for info-bar and layout. Use the saved currentStep
                    // for profile when it was parked, or 'RESULTS' if it completed a scan.
                    const flowStep = isProfile ? (currentStep !== 'AUTH' ? currentStep : 'RESULTS') : currentStep;

                    return (
                        <div key={flow.id} className={`flex-col flex-1 min-h-0 overflow-hidden ${isVisible ? 'flex' : 'hidden'}`}>
                            {/* Compact info bar — only shown after AUTH */}
                            {flowStep !== 'AUTH' && (
                                <div className="bg-white border-b border-slate-200 shadow-sm shrink-0">
                                    <div className="px-6 py-3 flex items-center gap-4">
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
                                            {!isProfile && (
                                                <button
                                                    onClick={() => setConfiguring(null)}
                                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400"
                                                >
                                                    <ArrowLeft className="w-3.5 h-3.5" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Layout: AUTH=hero+form grid | BROWSE/RESULTS=full-height flush */}
                            <div className={`flex flex-col ${flowStep === 'AUTH'
                                    ? 'flex-1 bg-white border-b border-slate-200 overflow-y-auto'
                                    : 'flex-1 min-h-0 overflow-hidden'
                                }`}>
                                <div className={
                                    flowStep === 'AUTH'
                                        ? 'max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'
                                        : 'flex flex-col flex-1 min-h-0 h-full'
                                }>
                                    {/* LEFT hero panel — only visible in AUTH step */}
                                    {flowStep === 'AUTH' && (
                                        <div>
                                            <button
                                                onClick={() => setConfiguring(null)}
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

                                    {/* Scan tab — full width/height in BROWSE/RESULTS, right-column in AUTH */}
                                    <div className={flowStep === 'AUTH' ? 'min-w-0' : 'flex flex-col flex-1 min-h-0 h-full'}>
                                        {conn.id === 'drive' && <DriveScanTab modelCatalogue={modelCatalogue} onStepChange={(step) => handleStepChange(flow.id, step)} />}
                                        {conn.id === 's3' && <S3ScanTab modelCatalogue={modelCatalogue} onStepChange={(step) => handleStepChange(flow.id, step)} />}
                                        {conn.id === 'azure' && <AzureScanTab modelCatalogue={modelCatalogue} onStepChange={(step) => handleStepChange(flow.id, step)} />}
                                        {conn.id === 'gcs' && <GCSScanTab modelCatalogue={modelCatalogue} onStepChange={(step) => handleStepChange(flow.id, step)} />}
                                        {conn.id === 'database' && <DatabaseScanTab modelCatalogue={modelCatalogue} onStepChange={(step) => handleStepChange(flow.id, step)} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
