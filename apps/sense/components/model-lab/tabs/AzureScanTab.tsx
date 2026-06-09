'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, Play, Eye, EyeOff, ArrowLeft, Download } from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, PIICount } from '@/lib/apiClient';

interface Props { modelCatalogue: EvaluatorModel[]; onStepChange?: (step: Step) => void; }
type Step = 'AUTH' | 'BROWSE' | 'RESULTS';
interface FileScanResult { blob: string; result: AnalysisResponse | null; error: string | null; }

export default function AzureScanTab({ modelCatalogue, onStepChange }: Props) {
    const [step, setStep]             = useState<Step>('AUTH');
    const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
    const [error, setError]           = useState<string | null>(null);
    const [showConnStr, setShowConnStr] = useState(false);

    // AUTH
    const [connStr, setConnStr]       = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    // BROWSE
    const [containers, setContainers] = useState<string[]>([]);
    const [selectedContainer, setSelectedContainer] = useState('');
    const [blobs, setBlobs]           = useState<string[]>([]);
    const [selectedBlobs, setSelectedBlobs] = useState<Set<string>>(new Set());
    const [isLoadingBlobs, setIsLoadingBlobs] = useState(false);

    // RESULTS
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults]       = useState<FileScanResult[]>([]);
    const [expandedBlob, setExpandedBlob] = useState<string | null>(null);

    // ── Handlers ──────────────────────────────────────────────────────────

    const handleConnect = async () => {
        if (!connStr.trim()) { setError('Enter the Azure Storage connection string.'); return; }
        setIsConnecting(true); setError(null);
        try {
            const res = await apiClient.listAzureContainers(connStr.trim());
            setContainers(res.containers || []);
            setSelectedContainer(''); setBlobs([]); setSelectedBlobs(new Set());
            changeStep('BROWSE');
        } catch (e: any) { setError(e.message || 'Failed to connect to Azure Storage.'); }
        finally { setIsConnecting(false); }
    };

    const handleContainerChange = async (container: string) => {
        setSelectedContainer(container); setBlobs([]); setSelectedBlobs(new Set());
        if (!container) return;
        setIsLoadingBlobs(true);
        try {
            const res = await apiClient.listAzureBlobs(connStr.trim(), container);
            setBlobs(res.blobs || []);
        } catch (e: any) { setError(e.message || 'Failed to list blobs.'); }
        finally { setIsLoadingBlobs(false); }
    };

    const toggleBlob = (blob: string) => {
        const next = new Set(selectedBlobs);
        next.has(blob) ? next.delete(blob) : next.add(blob);
        setSelectedBlobs(next);
    };

    const handleScan = async () => {
        if (selectedBlobs.size === 0) return;
        setIsScanning(true); setError(null); setResults([]); changeStep('RESULTS');
        const blobList = Array.from(selectedBlobs);
        const out: FileScanResult[] = [];
        for (const blob of blobList) {
            try {
                const res = await apiClient.scanAzureBlob(connStr.trim(), selectedContainer, blob);
                out.push({ blob, result: res, error: null });
            } catch (e: any) {
                out.push({ blob, result: null, error: e.message || 'Scan failed.' });
            }
            setResults([...out]);
        }
        setIsScanning(false);
    };

    const resetToAuth = () => { changeStep('AUTH'); setError(null); setContainers([]); setBlobs([]); setSelectedBlobs(new Set()); setResults([]); };

    const Card = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">{children}</div>
    );
    const StepBadge = ({ n }: { n: number }) => (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-sm font-bold">{n}</span>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-xl">
                    <span className="text-2xl">🔷</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Azure Blob Scan</h2>
                    <p className="text-slate-500 dark:text-slate-400">Browse Azure containers and scan blobs for PII in-memory.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            <AnimatePresence mode="wait">

                {/* ── STEP 1: AUTH ─────────────────────────────────────── */}
                {step === 'AUTH' && (
                    <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <StepBadge n={1} /> Connect to Azure Storage
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Azure Storage Connection String
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConnStr ? 'text' : 'password'}
                                            value={connStr}
                                            onChange={e => setConnStr(e.target.value)}
                                            placeholder="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white font-mono text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConnStr(p => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            {showConnStr ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1.5">
                                        Find this in Azure Portal → Storage Account → Access Keys → Connection string
                                    </p>
                                </div>

                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                                    ⚠️ Connection string is used for this session only and is not stored.
                                </div>

                                <button
                                    onClick={handleConnect}
                                    disabled={!connStr.trim() || isConnecting}
                                    className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                                >
                                    {isConnecting && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {isConnecting ? 'Connecting...' : 'Connect to Azure'}
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* ── STEP 2: BROWSE ───────────────────────────────────── */}
                {step === 'BROWSE' && (
                    <motion.div key="browse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                        <Card>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <StepBadge n={2} /> Select Blobs
                                </h3>
                                <button onClick={resetToAuth} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                    Change Credentials
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg mb-5 text-sm text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Connected — found {containers.length} container(s)
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Container</label>
                                <select
                                    value={selectedContainer}
                                    onChange={e => handleContainerChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white text-sm"
                                >
                                    <option value="">— Choose a container —</option>
                                    {containers.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {isLoadingBlobs && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading blobs...
                                </div>
                            )}

                            {blobs.length > 0 && (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <button onClick={() => setSelectedBlobs(new Set(blobs))} className="text-sm text-sky-600 dark:text-sky-400 hover:underline">Select All</button>
                                        <span className="text-slate-300 dark:text-slate-600">|</span>
                                        <button onClick={() => setSelectedBlobs(new Set())} className="text-sm text-slate-500 hover:underline">Clear</button>
                                        <span className="ml-auto text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{selectedBlobs.size} selected</span>
                                    </div>

                                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-[360px] overflow-y-auto">
                                        {blobs.map(blob => {
                                            const isSelected = selectedBlobs.has(blob);
                                            return (
                                                <div key={blob} onClick={() => toggleBlob(blob)}
                                                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 ${isSelected ? 'bg-sky-50 dark:bg-sky-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                                    </div>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate font-mono">{blob}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end mt-5">
                                        <button onClick={handleScan} disabled={selectedBlobs.size === 0}
                                            className="flex items-center gap-2 px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors shadow-sm"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                            Scan {selectedBlobs.size} blob(s) for PII
                                        </button>
                                    </div>
                                </>
                            )}
                        </Card>
                    </motion.div>
                )}

                {/* ── STEP 3: RESULTS ──────────────────────────────────── */}
                {step === 'RESULTS' && (
                    <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                        {/* Premium Dashboard Header */}
                        <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
                            <div className="flex items-center gap-3 shrink-0">
                                <button onClick={() => changeStep('BROWSE')} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all">
                                    <ArrowLeft className="w-3.5 h-3.5" />Back
                                </button>
                                <div className="w-px h-5 bg-slate-200" />
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-slate-800">Scan Results</h2>
                                    <span className="text-xs font-semibold text-white bg-sky-600 px-2 py-0.5 rounded-full tabular-nums">{results.length}/{selectedBlobs.size}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {isScanning ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-lg text-xs font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />Scanning…
                                    </span>
                                ) : results.length > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />Scan Complete
                                    </span>
                                ) : null}
                                <button disabled title="Export coming soon" className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-400 text-sm font-semibold bg-white cursor-not-allowed opacity-60 select-none">
                                    <Download className="w-3.5 h-3.5" />Export
                                </button>
                            </div>
                        </div>

                        {isScanning && results.length === 0 && (
                            <Card>
                                <div className="flex flex-col items-center py-12">
                                    <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
                                    <p className="text-slate-500 text-sm">Downloading and scanning blobs in-memory…</p>
                                </div>
                            </Card>
                        )}

                        {results.map(r => (
                            <AzureResultCard
                                key={r.blob}
                                blobName={r.blob}
                                result={r.result}
                                error={r.error}
                                expanded={expandedBlob === r.blob}
                                onToggle={() => setExpandedBlob(p => p === r.blob ? null : r.blob)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AzureResultCard({ blobName, result, error, expanded, onToggle }: {
    blobName: string; result: AnalysisResponse | null; error: string | null; expanded: boolean; onToggle: () => void;
}) {
    const hasPii = result && result.total_pii_found > 0;
    return (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div onClick={onToggle} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors border-l-4 border-l-transparent hover:border-l-sky-400">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${error ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : hasPii ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                    {error || hasPii ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate font-mono">{blobName}</p>
                    {error && <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Error: {error}</p>}
                </div>
                {!error && result && (
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${hasPii ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'}`}>
                        {hasPii ? `${result.total_pii_found} PII` : 'Clean'}
                    </span>
                )}
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </div>
            {expanded && !error && result && result.pii_counts && result.pii_counts.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-[#0F172A]">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">PII Breakdown</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {result.pii_counts.map((p: PIICount) => (
                            <div key={p['PII Type']} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                <span className="text-slate-600 dark:text-slate-400 truncate">{p['PII Type']}</span>
                                <span className="font-bold text-red-600 dark:text-red-400 ml-2">{p.Count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
