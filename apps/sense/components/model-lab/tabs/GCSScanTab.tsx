'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronRight, Key, Loader2, Play, ArrowLeft, Download } from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, PIICount, OutOfCreditsError } from '@/lib/apiClient';
import { useAuth } from '@/lib/authContext';
import OutOfCreditsModal from '@/components/OutOfCreditsModal';

interface Props { modelCatalogue: EvaluatorModel[]; onStepChange?: (step: Step) => void; }
type Step = 'AUTH' | 'BROWSE' | 'RESULTS';
interface FileScanResult { fileName: string; result: AnalysisResponse | null; error: string | null; }

export default function GCSScanTab({ modelCatalogue, onStepChange }: Props) {
    const [step, setStep]             = useState<Step>('AUTH');
    const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
    const [error, setError]           = useState<string | null>(null);

    const { token } = useAuth();
    const [outOfCredits, setOutOfCredits] = useState(false);
    const [creditsLeft, setCreditsLeft] = useState(0);

    // AUTH
    const [saFileName, setSaFileName] = useState<string | null>(null);
    const [credentials, setCredentials] = useState<Record<string, unknown> | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // BROWSE
    const [buckets, setBuckets]       = useState<string[]>([]);
    const [selectedBucket, setSelectedBucket] = useState('');
    const [files, setFiles]           = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);

    // RESULTS
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults]       = useState<FileScanResult[]>([]);
    const [expandedFile, setExpandedFile] = useState<string | null>(null);

    // ── Handlers ──────────────────────────────────────────────────────────

    const handleSAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const json = JSON.parse(ev.target?.result as string);
                setCredentials(json);
                setSaFileName(file.name);
                setError(null);
            } catch {
                setError('Invalid JSON file. Please upload a valid GCP service account key.');
                setCredentials(null);
            }
        };
        reader.readAsText(file);
    };

    const handleConnect = async () => {
        if (!credentials) { setError('Please upload a service account JSON key.'); return; }
        setIsConnecting(true); setError(null);
        try {
            const res = await apiClient.listGCSBuckets(credentials);
            setBuckets(res.buckets || []);
            setSelectedBucket(''); setFiles([]); setSelectedFiles(new Set());
            changeStep('BROWSE');
        } catch (e: any) { setError(e.message || 'Failed to connect to Google Cloud Storage.'); }
        finally { setIsConnecting(false); }
    };

    const handleBucketChange = async (bucket: string) => {
        setSelectedBucket(bucket); setFiles([]); setSelectedFiles(new Set());
        if (!bucket) return;
        setIsLoadingFiles(true);
        try {
            const res = await apiClient.listGCSFiles(credentials, bucket);
            setFiles(res.files || []);
        } catch (e: any) { setError(e.message || 'Failed to list files.'); }
        finally { setIsLoadingFiles(false); }
    };

    const toggleFile = (f: string) => {
        const next = new Set(selectedFiles);
        next.has(f) ? next.delete(f) : next.add(f);
        setSelectedFiles(next);
    };

    const handleScan = async () => {
        if (selectedFiles.size === 0 || !credentials) return;

        // Credit deduction gate
        if (token) {
            try {
                await apiClient.deductCredits(token, 1);
            } catch (e) {
                if (e instanceof OutOfCreditsError) {
                    setCreditsLeft(e.creditsRemaining);
                    setOutOfCredits(true);
                    return;
                }
            }
        }

        setIsScanning(true); setError(null); setResults([]); changeStep('RESULTS');
        const fileList = Array.from(selectedFiles);
        const out: FileScanResult[] = [];
        for (const fileName of fileList) {
            try {
                const res = await apiClient.scanGCSFile(credentials, selectedBucket, fileName);
                out.push({ fileName, result: res, error: null });
            } catch (e: any) {
                out.push({ fileName, result: null, error: e.message || 'Scan failed.' });
            }
            setResults([...out]);
        }
        setIsScanning(false);
    };

    const resetToAuth = () => {
        changeStep('AUTH'); setError(null); setCredentials(null); setSaFileName(null);
        setBuckets([]); setFiles([]); setSelectedFiles(new Set()); setResults([]);
    };

    const Card = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">{children}</div>
    );
    const StepBadge = ({ n }: { n: number }) => (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-bold">{n}</span>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <OutOfCreditsModal
                open={outOfCredits}
                onClose={() => setOutOfCredits(false)}
                creditsRemaining={creditsLeft}
            />

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                    <span className="text-2xl">🗄️</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Google Cloud Storage Scan</h2>
                    <p className="text-slate-500 dark:text-slate-400">Browse GCS buckets and scan files for PII in-memory.</p>
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
                                <StepBadge n={1} /> Connect to Google Cloud Storage
                            </h3>

                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Upload your GCP Service Account JSON key file. The service account must have{' '}
                                    <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">storage.objects.list</code> and{' '}
                                    <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">storage.objects.get</code> permissions.
                                </p>

                                {/* File drop zone */}
                                <label className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <input type="file" accept=".json" className="hidden" onChange={handleSAUpload} />
                                    <Key className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {saFileName ? (
                                            <span className="text-amber-600 dark:text-amber-400">✓ {saFileName}</span>
                                        ) : 'Click to upload service account JSON key'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {saFileName ? 'Click to change file' : '.json files only'}
                                    </p>
                                </label>

                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                                    ⚠️ Credentials are used for this session only and are not stored.
                                </div>

                                <button
                                    onClick={handleConnect}
                                    disabled={!credentials || isConnecting}
                                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                                >
                                    {isConnecting && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {isConnecting ? 'Connecting...' : 'Connect to GCS'}
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
                                    <StepBadge n={2} /> Select Files
                                </h3>
                                <button onClick={resetToAuth} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                    Change Credentials
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg mb-5 text-sm text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Connected — found {buckets.length} bucket(s)
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Bucket</label>
                                <select
                                    value={selectedBucket}
                                    onChange={e => handleBucketChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white text-sm"
                                >
                                    <option value="">— Choose a bucket —</option>
                                    {buckets.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            {isLoadingFiles && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading files...
                                </div>
                            )}

                            {files.length > 0 && (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <button onClick={() => setSelectedFiles(new Set(files))} className="text-sm text-amber-600 dark:text-amber-400 hover:underline">Select All</button>
                                        <span className="text-slate-300 dark:text-slate-600">|</span>
                                        <button onClick={() => setSelectedFiles(new Set())} className="text-sm text-slate-500 hover:underline">Clear</button>
                                        <span className="ml-auto text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{selectedFiles.size} selected</span>
                                    </div>

                                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-[360px] overflow-y-auto">
                                        {files.map(file => {
                                            const isSelected = selectedFiles.has(file);
                                            return (
                                                <div key={file} onClick={() => toggleFile(file)}
                                                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 ${isSelected ? 'bg-amber-50 dark:bg-amber-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                                    </div>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate font-mono">{file}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end mt-5">
                                        <button onClick={handleScan} disabled={selectedFiles.size === 0}
                                            className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium disabled:opacity-50 transition-colors shadow-sm"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                            Scan {selectedFiles.size} file(s) for PII
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
                                    <span className="text-xs font-semibold text-white bg-amber-500 px-2 py-0.5 rounded-full tabular-nums">{results.length}/{selectedFiles.size}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {isScanning ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />Scanning…
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
                                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                                    <p className="text-slate-500 text-sm">Downloading and scanning files in-memory…</p>
                                </div>
                            </Card>
                        )}

                        {results.map(r => (
                            <GCSResultCard
                                key={r.fileName}
                                fileName={r.fileName}
                                result={r.result}
                                error={r.error}
                                expanded={expandedFile === r.fileName}
                                onToggle={() => setExpandedFile(p => p === r.fileName ? null : r.fileName)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function GCSResultCard({ fileName, result, error, expanded, onToggle }: {
    fileName: string; result: AnalysisResponse | null; error: string | null; expanded: boolean; onToggle: () => void;
}) {
    const hasPii = result && result.total_pii_found > 0;
    return (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div onClick={onToggle} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors border-l-4 border-l-transparent hover:border-l-amber-400">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${error ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : hasPii ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                    {error || hasPii ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate font-mono">{fileName}</p>
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
