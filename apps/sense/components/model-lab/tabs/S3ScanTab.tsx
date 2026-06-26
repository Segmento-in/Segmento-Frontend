'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight,
    Loader2, Play, Eye, EyeOff, ArrowLeft, Download,
} from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, PIICount, OutOfCreditsError } from '@/lib/apiClient';
import { useAuth } from '@/lib/authContext';
import OutOfCreditsModal from '@/components/OutOfCreditsModal';

interface Props { modelCatalogue: EvaluatorModel[]; onStepChange?: (step: Step) => void; }

type Step = 'AUTH' | 'BROWSE' | 'RESULTS';

interface S3Creds { accessKey: string; secretKey: string; region: string; }
interface FileScanResult { key: string; result: AnalysisResponse | null; error: string | null; }

const AWS_REGIONS = [
    'us-east-1','us-east-2','us-west-1','us-west-2',
    'eu-west-1','eu-central-1','ap-south-1','ap-southeast-1','ap-northeast-1',
];

export default function S3ScanTab({ modelCatalogue, onStepChange }: Props) {
    const [step, setStep]           = useState<Step>('AUTH');
    const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
    const [error, setError]         = useState<string | null>(null);
    const [showSecret, setShowSecret] = useState(false);

    const { token } = useAuth();
    const [outOfCredits, setOutOfCredits] = useState(false);
    const [creditsLeft, setCreditsLeft] = useState(0);

    // AUTH
    const [creds, setCreds]         = useState<S3Creds>({ accessKey: '', secretKey: '', region: 'us-east-1' });
    const [isConnecting, setIsConnecting] = useState(false);

    // BROWSE
    const [buckets, setBuckets]     = useState<string[]>([]);
    const [selectedBucket, setSelectedBucket] = useState('');
    const [files, setFiles]         = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);

    // RESULTS
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults]     = useState<FileScanResult[]>([]);
    const [expandedFile, setExpandedFile] = useState<string | null>(null);

    // ── Handlers ──────────────────────────────────────────────────────────

    const handleConnect = async () => {
        if (!creds.accessKey || !creds.secretKey) { setError('Enter AWS Access Key and Secret Key.'); return; }
        setIsConnecting(true); setError(null);
        try {
            const res = await apiClient.listS3Buckets(creds.accessKey, creds.secretKey, creds.region);
            setBuckets(res.buckets || []);
            setSelectedBucket(''); setFiles([]); setSelectedFiles(new Set());
            changeStep('BROWSE');
        } catch (e: any) { setError(e.message || 'Failed to connect to AWS S3.'); }
        finally { setIsConnecting(false); }
    };

    const handleBucketChange = async (bucket: string) => {
        setSelectedBucket(bucket); setFiles([]); setSelectedFiles(new Set());
        if (!bucket) return;
        setIsLoadingFiles(true);
        try {
            const res = await apiClient.listS3Files(creds.accessKey, creds.secretKey, creds.region, bucket);
            setFiles(res.files || []);
        } catch (e: any) { setError(e.message || 'Failed to list files.'); }
        finally { setIsLoadingFiles(false); }
    };

    const toggleFile = (key: string) => {
        const next = new Set(selectedFiles);
        next.has(key) ? next.delete(key) : next.add(key);
        setSelectedFiles(next);
    };

    const handleScan = async () => {
        if (selectedFiles.size === 0) return;

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
                // Non-credit errors: fall through to normal scan
            }
        }

        setIsScanning(true); setError(null); setResults([]); changeStep('RESULTS');
        const fileList = Array.from(selectedFiles);
        const out: FileScanResult[] = [];
        for (const key of fileList) {
            try {
                const res = await apiClient.scanS3File(creds.accessKey, creds.secretKey, creds.region, selectedBucket, key);
                out.push({ key, result: res, error: null });
            } catch (e: any) {
                out.push({ key, result: null, error: e.message || 'Scan failed.' });
            }
            setResults([...out]);
        }
        setIsScanning(false);
    };

    const resetToAuth = () => { changeStep('AUTH'); setError(null); setBuckets([]); setFiles([]); setSelectedFiles(new Set()); setResults([]); };

    // ── Shared card wrapper ────────────────────────────────────────────────
    const Card = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {children}
        </div>
    );

    const StepBadge = ({ n }: { n: number }) => (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-bold">
            {n}
        </span>
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
                <div className="p-3 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
                    <span className="text-2xl">🪣</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Amazon S3 Scan</h2>
                    <p className="text-slate-500 dark:text-slate-400">Browse S3 buckets and scan files for PII in-memory.</p>
                </div>
            </div>

            {/* Error banner */}
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
                                <StepBadge n={1} /> Connect to AWS S3
                            </h3>

                            <div className="space-y-4">
                                {/* Access Key */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        AWS Access Key ID
                                    </label>
                                    <input
                                        type="text"
                                        value={creds.accessKey}
                                        onChange={e => setCreds(p => ({ ...p, accessKey: e.target.value }))}
                                        placeholder="AKIAIOSFODNN7EXAMPLE"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white font-mono text-sm"
                                    />
                                </div>

                                {/* Secret Key */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        AWS Secret Access Key
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showSecret ? 'text' : 'password'}
                                            value={creds.secretKey}
                                            onChange={e => setCreds(p => ({ ...p, secretKey: e.target.value }))}
                                            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white font-mono text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecret(p => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Region */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        AWS Region
                                    </label>
                                    <select
                                        value={creds.region}
                                        onChange={e => setCreds(p => ({ ...p, region: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white text-sm"
                                    >
                                        {AWS_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                {/* Security notice */}
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                                    ⚠️ Credentials are used for this session only and are not stored.
                                </div>

                                <button
                                    onClick={handleConnect}
                                    disabled={!creds.accessKey || !creds.secretKey || isConnecting}
                                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                                >
                                    {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    {isConnecting ? 'Connecting...' : 'Connect to S3'}
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

                            {/* Connected status */}
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg mb-5 text-sm text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Connected — found {buckets.length} bucket(s) in {creds.region}
                            </div>

                            {/* Bucket selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Select Bucket
                                </label>
                                <select
                                    value={selectedBucket}
                                    onChange={e => handleBucketChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white text-sm"
                                >
                                    <option value="">— Choose a bucket —</option>
                                    {buckets.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            {/* File list */}
                            {isLoadingFiles && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading files...
                                </div>
                            )}

                            {files.length > 0 && (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <button onClick={() => setSelectedFiles(new Set(files))} className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                                            Select All
                                        </button>
                                        <span className="text-slate-300 dark:text-slate-600">|</span>
                                        <button onClick={() => setSelectedFiles(new Set())} className="text-sm text-slate-500 hover:underline">
                                            Clear
                                        </button>
                                        <span className="ml-auto text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                            {selectedFiles.size} selected
                                        </span>
                                    </div>

                                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-[360px] overflow-y-auto">
                                        {files.map(file => {
                                            const isSelected = selectedFiles.has(file);
                                            return (
                                                <div
                                                    key={file}
                                                    onClick={() => toggleFile(file)}
                                                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                                                        isSelected ? 'bg-orange-50 dark:bg-orange-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                                        isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 dark:border-slate-600'
                                                    }`}>
                                                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                                    </div>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate font-mono">{file}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end mt-5">
                                        <button
                                            onClick={handleScan}
                                            disabled={selectedFiles.size === 0}
                                            className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium disabled:opacity-50 transition-colors shadow-sm"
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

                        {/* ── Premium Dashboard Header ───────────────────────────── */}
                        <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => changeStep('BROWSE')}
                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back
                                </button>
                                <div className="w-px h-5 bg-slate-200" />
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-slate-800">Scan Results</h2>
                                    <span className="text-xs font-semibold text-white bg-orange-500 px-2 py-0.5 rounded-full tabular-nums">
                                        {results.length}/{selectedFiles.size}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {isScanning ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg text-xs font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        Scanning…
                                    </span>
                                ) : results.length > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Scan Complete &middot; {results.filter(r => r.result && r.result.total_pii_found > 0).length} contain PII
                                    </span>
                                ) : null}
                                <button
                                    disabled
                                    title="Export coming soon"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-400 text-sm font-semibold bg-white cursor-not-allowed opacity-60 select-none"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Scanning placeholder */}
                        {isScanning && results.length === 0 && (
                            <Card>
                                <div className="flex flex-col items-center py-12">
                                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                                    <p className="text-slate-500 text-sm">Downloading and scanning files in-memory…</p>
                                </div>
                            </Card>
                        )}

                        {/* Per-file results */}
                        {results.map(r => (
                            <FileResultCard
                                key={r.key}
                                fileKey={r.key}
                                result={r.result}
                                error={r.error}
                                expanded={expandedFile === r.key}
                                onToggle={() => setExpandedFile(p => p === r.key ? null : r.key)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Per-file result card ────────────────────────────────────────────────────
function FileResultCard({
    fileKey, result, error, expanded, onToggle,
}: {
    fileKey: string;
    result: AnalysisResponse | null;
    error: string | null;
    expanded: boolean;
    onToggle: () => void;
}) {
    const hasPii = result && result.total_pii_found > 0;

    return (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
            {/* Header row */}
            <div onClick={onToggle} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors border-l-4 border-l-transparent hover:border-l-orange-400">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    error ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : hasPii ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                    : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                    {error ? <AlertCircle className="w-4 h-4" /> : hasPii ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate font-mono">{fileKey}</p>
                    {error && <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Error: {error}</p>}
                </div>
                {!error && result && (
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        hasPii ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                        : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    }`}>
                        {hasPii ? `${result.total_pii_found} PII` : 'Clean'}
                    </span>
                )}
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </div>

            {/* Expanded body */}
            {expanded && !error && result && result.pii_counts && result.pii_counts.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-[#0F172A]">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                        PII Breakdown
                    </p>
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
