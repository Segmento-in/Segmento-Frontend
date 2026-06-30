'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
    Upload, Play, RotateCcw, CheckCircle2, CheckSquare, Square,
    AlertCircle, Layers, FileText, Video, XCircle,
} from 'lucide-react';
import { EvaluatorModel, VideoJobStatus, apiClient } from '@/lib/apiClient';
import ModelShowdown, { getPiiColor } from '@/components/model-lab/ModelShowdown';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';

// ── File categories & types ───────────────────────────────────────────────────

const CATEGORIES = [
    {
        key: 'unstructured',
        label: '📄 Unstructured',
        desc: 'Documents, emails, plain text, video',
        types: [
            { ext: 'txt',  label: 'Plain Text (.txt)',        accept: '.txt' },
            { ext: 'pdf',  label: 'PDF Document (.pdf)',      accept: '.pdf' },
            { ext: 'docx', label: 'Word Document (.docx)',    accept: '.docx' },
            { ext: 'rtf',  label: 'Rich Text (.rtf)',         accept: '.rtf' },
            { ext: 'odt',  label: 'OpenDocument (.odt)',      accept: '.odt' },
            { ext: 'md',   label: 'Markdown (.md)',           accept: '.md' },
            { ext: 'log',  label: 'Log File (.log)',          accept: '.log' },
            { ext: 'eml',  label: 'Email (.eml)',             accept: '.eml' },
            { ext: 'epub', label: 'eBook (.epub)',            accept: '.epub' },
            { ext: 'pptx', label: 'PowerPoint (.pptx)',      accept: '.pptx' },
            { ext: 'mp4',  label: '🎬 MP4 Video (.mp4)',      accept: '.mp4'  },
            { ext: 'mkv',  label: '🎬 MKV Video (.mkv)',      accept: '.mkv'  },
            { ext: 'avi',  label: '🎬 AVI Video (.avi)',      accept: '.avi'  },
            { ext: 'mov',  label: '🎬 MOV Video (.mov)',      accept: '.mov'  },
            { ext: 'webm', label: '🎬 WebM Video (.webm)',    accept: '.webm' },
        ],
    },
    {
        key: 'semi_structured',
        label: '🗂️ Semi-Structured',
        desc: 'Config files, web data, tabular text',
        types: [
            { ext: 'json',    label: 'JSON (.json)',          accept: '.json' },
            { ext: 'xml',     label: 'XML (.xml)',            accept: '.xml' },
            { ext: 'yaml',    label: 'YAML (.yaml,.yml)',     accept: '.yaml,.yml' },
            { ext: 'html',    label: 'HTML (.html)',          accept: '.html,.htm' },
            { ext: 'csv',     label: 'CSV (.csv)',            accept: '.csv' },
            { ext: 'tsv',     label: 'TSV (.tsv)',            accept: '.tsv' },
            { ext: 'ini',     label: 'INI Config (.ini)',     accept: '.ini' },
            { ext: 'toml',    label: 'TOML (.toml)',          accept: '.toml' },
            { ext: 'config',  label: 'Config (.cfg,.conf)',   accept: '.cfg,.conf,.config' },
            { ext: 'edifact', label: 'EDIFACT (.edi)',        accept: '.edi' },
        ],
    },
    {
        key: 'structured',
        label: '🗄️ Structured',
        desc: 'Databases, data warehousing formats',
        types: [
            { ext: 'sqlite',  label: 'SQLite (.db,.sqlite)',  accept: '.sqlite,.db' },
            { ext: 'sql',     label: 'SQL Script (.sql)',     accept: '.sql' },
            { ext: 'parquet', label: 'Parquet (.parquet)',    accept: '.parquet' },
            { ext: 'avro',    label: 'Avro (.avro)',          accept: '.avro' },
            { ext: 'xlsx',    label: 'Excel 2007+ (.xlsx)',   accept: '.xlsx' },
            { ext: 'xls',     label: 'Excel Legacy (.xls)',   accept: '.xls' },
            { ext: 'orc',     label: 'ORC (.orc)',            accept: '.orc' },
            { ext: 'hdf5',    label: 'HDF5 (.h5,.hdf5)',     accept: '.h5,.hdf5' },
            { ext: 'feather', label: 'Feather (.feather)',    accept: '.feather' },
            { ext: 'dta',     label: 'Stata (.dta)',          accept: '.dta' },
        ],
    },
];

const TYPE_COLORS: Record<string, string> = {
    'Rule-based':  'border-emerald-300 text-emerald-700 bg-emerald-500/10',
    'Statistical': 'border-amber-500/50 text-amber-600 bg-amber-500/10',
    'GLiNER':      'border-purple-500/50 text-purple-600 bg-purple-500/10',
    'NER':         'border-blue-500/50 text-blue-600 bg-blue-500/10',
    'Rule+ML':     'border-cyan-500/50 text-cyan-300 bg-cyan-500/10',
};

// ── Video format detection ────────────────────────────────────────────────────

const VIDEO_TYPES = new Set(['mp4', 'mkv', 'avi', 'mov', 'webm']);

// ── State shape (local to this tab) ──────────────────────────────────────────

interface FormatScanState {
    category: string;
    fileType: string;
    uploadedFile: File | null;
    selectedModels: string[];
    isLoading: boolean;
    loadingStage: string;
    error: string | null;
    showdownData: any | null;
    parsedChars: number;
    parsedText: string;
    // video async job
    videoJobId: string | null;
    videoProgress: number;
    videoStage: string;
    videoStatus: VideoJobStatus['status'] | null;
}

const INITIAL: FormatScanState = {
    category: 'unstructured',
    fileType: 'pdf',
    uploadedFile: null,
    selectedModels: ['regex', 'spacy', 'deberta'],
    isLoading: false,
    loadingStage: '',
    error: null,
    showdownData: null,
    parsedChars: 0,
    parsedText: '',
    videoJobId: null,
    videoProgress: 0,
    videoStage: '',
    videoStatus: null,
};

interface Props {
    modelCatalogue: EvaluatorModel[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FormatScanTab({ modelCatalogue }: Props) {
    const [s, setS] = useState<FormatScanState>(INITIAL);
    const fileRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const patch = (p: Partial<FormatScanState>) => setS(prev => ({ ...prev, ...p }));

    // ── Video job polling ─────────────────────────────────────────────────────
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!s.videoJobId) return;
        pollRef.current = setInterval(async () => {
            try {
                const status = await apiClient.videoStatus(s.videoJobId!);
                patch({ videoProgress: status.progress, videoStage: status.stage_detail, videoStatus: status.status });
                if (status.status === 'done' && status.result) {
                    clearInterval(pollRef.current!);
                    patch({
                        isLoading: false, videoJobId: null,
                        showdownData: status.result,
                        parsedText: status.result.parsed_text ?? '',
                        parsedChars: (status.result.parsed_text ?? '').length,
                    });
                } else if (status.status === 'error') {
                    clearInterval(pollRef.current!);
                    patch({ isLoading: false, videoJobId: null, error: status.error ?? 'Video processing failed.' });
                } else if (status.status === 'cancelled') {
                    clearInterval(pollRef.current!);
                    patch({ isLoading: false, videoJobId: null, error: 'Job cancelled.' });
                }
            } catch { /* network hiccup — keep polling */ }
        }, 3000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [s.videoJobId]);

    const cancelVideo = async () => {
        if (!s.videoJobId) return;
        try { await apiClient.videoCancel(s.videoJobId); } catch {}
        if (pollRef.current) clearInterval(pollRef.current);
        patch({ isLoading: false, videoJobId: null, videoStatus: 'cancelled', error: null });
    };

    const activeCat = CATEGORIES.find(c => c.key === s.category) ?? CATEGORIES[0];
    const activeType = activeCat.types.find(t => t.ext === s.fileType) ?? activeCat.types[0];

    // When category changes, reset to first type
    const setCategory = (key: string) => {
        const cat = CATEGORIES.find(c => c.key === key)!;
        patch({ category: key, fileType: cat.types[0].ext, uploadedFile: null, showdownData: null, error: null });
        if (fileRef.current) fileRef.current.value = '';
    };

    const setFileType = (ext: string) => {
        patch({ fileType: ext, uploadedFile: null, showdownData: null, error: null });
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleFile = (file: File) => {
        patch({ uploadedFile: file, showdownData: null, error: null });
    };

    const toggleModel = (key: string) => {
        const next = s.selectedModels.includes(key)
            ? s.selectedModels.filter(k => k !== key)
            : [...s.selectedModels, key];
        patch({ selectedModels: next });
    };

    const runScan = async () => {
        if (!s.uploadedFile) { patch({ error: 'Upload a file first.' }); return; }
        if (s.selectedModels.length === 0) { patch({ error: 'Select at least one model.' }); return; }

        if (!isLoggedIn) {
            router.push('/profile?returnUrl=/model-lab');
            return;
        }

        patch({ isLoading: true, error: null, showdownData: null, parsedText: '', videoJobId: null });

        if (VIDEO_TYPES.has(s.fileType)) {
            // ── Async path: video job queue ────────────────────────────────
            try {
                patch({ loadingStage: 'Uploading video…', videoProgress: 0, videoStage: 'Uploading…', videoStatus: 'queued' });
                const { job_id } = await apiClient.videoUpload(s.uploadedFile, s.selectedModels);
                // useEffect above takes over polling once videoJobId is set
                patch({ videoJobId: job_id, loadingStage: 'Video queued — processing in background…' });
            } catch (err: any) {
                patch({ isLoading: false, loadingStage: '', error: err?.message ?? 'Upload failed.' });
            }
        } else {
            // ── Sync path: existing 30-format pipeline (unchanged) ─────────
            patch({ loadingStage: 'Parsing file…' });
            try {
                const parsed = await apiClient.evaluatorParse(s.uploadedFile, s.fileType, 0);
                patch({ parsedChars: parsed.char_count, parsedText: parsed.text, loadingStage: `Running ${s.selectedModels.length} models…` });
                const scan = await apiClient.evaluatorScan(parsed.text, [], s.selectedModels, 0.5, 4.5);
                patch({ showdownData: scan, isLoading: false, loadingStage: '' });
            } catch (err: any) {
                patch({ isLoading: false, loadingStage: '', error: err?.message ?? 'Backend error.' });
            }
        }
    };

    const reset = () => {
        setS({ ...INITIAL, selectedModels: s.selectedModels, category: s.category, fileType: s.fileType });
        if (fileRef.current) fileRef.current.value = '';
    };

    const models = modelCatalogue.length > 0 ? modelCatalogue : FALLBACK_MODELS;

    return (
        <div className="space-y-8">

            {/* ── Step 1: Category + File Type ── */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">1</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Select File Category &amp; Type</span>
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setCategory(cat.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                s.category === cat.key
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900'
                                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                            }`}
                        >
                            {cat.label}
                            <span className="ml-2 text-[9px] opacity-70">{cat.desc}</span>
                        </button>
                    ))}
                </div>

                {/* File type chips */}
                <div className="flex flex-wrap gap-2">
                    {activeCat.types.map(t => (
                        <button
                            key={t.ext}
                            onClick={() => setFileType(t.ext)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                                s.fileType === t.ext
                                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">

                {/* ── Step 2: Model Selector ── */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">2</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Select Models</span>
                        <div className="ml-auto flex gap-1.5">
                            <button onClick={() => patch({ selectedModels: models.map(m => m.key) })}
                                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                                All
                            </button>
                            <button onClick={() => patch({ selectedModels: [] })}
                                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                        {models.map(model => {
                            const sel = s.selectedModels.includes(model.key);
                            return (
                                <button key={model.key} onClick={() => toggleModel(model.key)}
                                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                                        sel
                                            ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10'
                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <div className="mt-0.5 flex-shrink-0">
                                        {sel ? <CheckSquare size={13} className="text-emerald-400" /> : <Square size={13} className="text-slate-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{model.label}</span>
                                            {model.lazy && <span className="text-[8px] px-1 py-0.5 rounded bg-amber-500/15 text-amber-500 font-mono flex-shrink-0">LAZY</span>}
                                        </div>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${TYPE_COLORS[model.type] ?? ''}`}>
                                            {model.type}
                                        </span>
                                        {model.params !== '—' && (
                                            <span className="text-[9px] text-slate-400 ml-2">{model.params}</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {s.selectedModels.length > 0 && (
                        <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                {s.selectedModels.length} model{s.selectedModels.length > 1 ? 's' : ''} selected
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Step 3: Upload + Run ── */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">3</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Upload File</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">— {activeType.label}</span>
                        </div>

                        {/* Drop zone */}
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                            onClick={() => fileRef.current?.click()}
                            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                                isDragging
                                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/5'
                                    : s.uploadedFile
                                        ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-500/5'
                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept={activeType.accept}
                                className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                            />
                            {s.uploadedFile ? (
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 size={28} className="text-emerald-400" />
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.uploadedFile.name}</p>
                                    <p className="text-xs text-slate-400">{(s.uploadedFile.size / 1024).toFixed(1)} KB — click to change</p>
                                    {s.parsedChars > 0 && (
                                        <p className="text-[10px] text-emerald-500 font-semibold">{s.parsedChars.toLocaleString()} chars extracted</p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                        <Upload size={20} className="text-slate-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drop your {activeType.label} here</p>
                                    <p className="text-xs text-slate-400">or click to browse</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error */}
                    {s.error && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-500/10">
                            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                            <span className="text-sm text-red-600 dark:text-red-400">{s.error}</span>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={runScan}
                            disabled={s.isLoading}
                            className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                        >
                            {s.isLoading && !s.videoJobId ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {s.loadingStage || 'Processing…'}
                                </>
                            ) : s.isLoading && s.videoJobId ? (
                                <>
                                    <Video size={15} className="animate-pulse" />
                                    Video processing…
                                </>
                            ) : (
                                <>
                                    {VIDEO_TYPES.has(s.fileType) ? <Video size={15} /> : <Play size={15} />}
                                    {VIDEO_TYPES.has(s.fileType) ? 'Start Video Scan' : 'Run Model Showdown'}
                                </>
                            )}
                        </button>
                        {(s.uploadedFile || s.showdownData) && (
                            <button onClick={reset}
                                className="px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                                <RotateCcw size={15} />
                            </button>
                        )}
                    </div>

                    {/* ── Video progress panel ── */}
                    {s.videoJobId && (
                        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-5 space-y-4">
                            {/* Stage pills */}
                            <div className="flex flex-wrap gap-2">
                                {(['extracting', 'scanning', 'done'] as const).map((stage) => {
                                    const labels: Record<string, string> = {
                                        extracting: '1 · Extract',
                                        scanning:   '2 · Scan PII',
                                        done:       '3 · Done',
                                    };
                                    const isActive = s.videoStatus === stage;
                                    const isPast = s.videoStatus === 'done' && stage !== 'done' ||
                                                   s.videoStatus === 'scanning' && stage === 'extracting';
                                    return (
                                        <span key={stage} className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                                            isActive  ? 'bg-blue-500 text-white border-blue-600' :
                                            isPast    ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-300' :
                                                        'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                                        }`}>
                                            {labels[stage]}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{s.videoStage || 'Processing…'}</span>
                                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{s.videoProgress}%</span>
                                </div>
                                <div className="w-full h-2.5 rounded-full bg-blue-100 dark:bg-blue-900/50 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-700"
                                        style={{ width: `${s.videoProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Cancel */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">Polling every 3s — this may take a few minutes for long videos</span>
                                <button
                                    onClick={cancelVideo}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] font-semibold transition-all"
                                >
                                    <XCircle size={12} /> Cancel
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ── Results: Model Showdown ── */}
            {s.showdownData && (
                <div className="space-y-6">
                    {/* Model Showdown cards */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Layers size={16} className="text-emerald-400" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Model Showdown Results</h3>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                — {s.fileType.toUpperCase()} · {s.selectedModels.length} models
                            </span>
                        </div>
                        <ModelShowdown
                            data={s.showdownData}
                            modelCatalogue={models}
                        />
                    </div>

                    {/* PII Document Viewer */}
                    {s.parsedText && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FileText size={16} className="text-blue-400" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Document View</h3>
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                    Switch overlay to see each model's highlights
                                </span>
                            </div>
                            <PIIDocumentViewer
                                text={s.parsedText}
                                showdownData={s.showdownData}
                                modelCatalogue={models}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── PII Document Viewer (paginated) ──────────────────────────────────────

interface Prediction { text: string; label: string; start: number; end: number; result?: string; }

const PAGE_SIZE = 2000; // chars per page

/** Split text into pages of ~PAGE_SIZE chars, breaking at word boundaries */
function buildPages(text: string): string[] {
    if (text.length <= PAGE_SIZE) return [text];
    const pages: string[] = [];
    let offset = 0;
    while (offset < text.length) {
        let end = offset + PAGE_SIZE;
        if (end < text.length) {
            // Walk back to nearest whitespace so we don't cut a word
            let boundary = end;
            while (boundary > offset && !/\s/.test(text[boundary])) boundary--;
            if (boundary > offset) end = boundary + 1;
        }
        pages.push(text.slice(offset, end));
        offset = end;
    }
    return pages;
}

function PIIDocumentViewer({
    text,
    showdownData,
    modelCatalogue,
}: {
    text: string;
    showdownData: any;
    modelCatalogue: EvaluatorModel[];
}) {
    const ranked: { model_key: string; rank: number }[] = showdownData?.ranked ?? [];
    const firstModelKey = ranked[0]?.model_key ?? '';
    const [activeModel, setActiveModel] = useState(firstModelKey);
    const [page, setPage] = useState(0);

    // Reset to page 1 when model changes
    React.useEffect(() => {
        setPage(0);
    }, [activeModel]);

    // Initialise model
    React.useEffect(() => {
        if (!activeModel && firstModelKey) setActiveModel(firstModelKey);
    }, [firstModelKey]);

    const pages = React.useMemo(() => buildPages(text), [text]);
    const totalPages = pages.length;
    const safePage = Math.min(page, totalPages - 1);
    const pageText = pages[safePage] ?? '';
    const pageOffset = pages.slice(0, safePage).reduce((sum, p) => sum + p.length, 0);

    // All predictions for active model (excluding FN/missed)
    const allPredictions: Prediction[] = (showdownData?.per_model?.[activeModel]?.predictions ?? [])
        .filter((p: Prediction) => p.result !== 'FN' && p.start >= 0 && p.end > p.start);

    // Only predictions that fall within this page's char range
    const pageEnd = pageOffset + pageText.length;
    const pagePredictions = allPredictions
        .filter(p => p.start < pageEnd && p.end > pageOffset)
        .map(p => ({
            ...p,
            start: Math.max(p.start - pageOffset, 0),
            end: Math.min(p.end - pageOffset, pageText.length),
        }));

    // Resolve overlaps (keep longest)
    const sorted = [...pagePredictions].sort((a, b) => a.start - b.start);
    const merged: Prediction[] = [];
    for (const p of sorted) {
        const last = merged[merged.length - 1];
        if (last && p.start < last.end) {
            if ((p.end - p.start) > (last.end - last.start)) merged[merged.length - 1] = p;
        } else {
            merged.push(p);
        }
    }

    // Build rendered segments for this page
    type Segment = { kind: 'text'; content: string } | { kind: 'pii'; content: string; label: string; result?: string };
    const segments: Segment[] = [];
    let cursor = 0;
    for (const p of merged) {
        if (p.start > cursor) segments.push({ kind: 'text', content: pageText.slice(cursor, p.start) });
        if (p.start < pageText.length) {
            segments.push({ kind: 'pii', content: pageText.slice(p.start, p.end), label: p.label, result: p.result });
        }
        cursor = p.end;
    }
    if (cursor < pageText.length) segments.push({ kind: 'text', content: pageText.slice(cursor) });

    const catalogueMap = Object.fromEntries(modelCatalogue.map(m => [m.key, m]));

    const piiOnPage = merged.length;

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <FileText size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Document View — PII Highlighted</span>
                <span className="text-[10px] text-slate-400 ml-auto">
                    {text.length.toLocaleString()} chars · {totalPages} page{totalPages > 1 ? 's' : ''}
                </span>
            </div>

            {/* Model switcher */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex-shrink-0">Overlay:</span>
                {ranked.map(r => {
                    const info = catalogueMap[r.model_key];
                    return (
                        <button
                            key={r.model_key}
                            onClick={() => setActiveModel(r.model_key)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                                activeModel === r.model_key
                                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-300'
                            }`}
                        >
                            #{r.rank} {info?.label ?? r.model_key}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 px-5 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {['EMAIL', 'PHONE', 'PERSON', 'LOCATION', 'SSN', 'CREDIT_CARD', 'IP_ADDRESS', 'URL', 'DATE'].map(label => {
                    const c = getPiiColor(label);
                    return (
                        <span key={label} className={`text-[9px] px-2 py-0.5 rounded border font-semibold ${c.bg} ${c.text} ${c.border}`}>
                            {label}
                        </span>
                    );
                })}
            </div>

            {/* Text body */}
            <div className="p-5 min-h-[200px] max-h-[480px] overflow-y-auto">
                {pageText.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No content on this page.</p>
                ) : (
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-7 font-mono whitespace-pre-wrap break-words">
                        {segments.map((seg, i) => {
                            if (seg.kind === 'text') return <span key={i}>{seg.content}</span>;
                            const c = getPiiColor(seg.label);
                            return (
                                <span
                                    key={i}
                                    className="inline-flex flex-col items-center leading-none mx-0.5 align-baseline"
                                    title={`${seg.label}${seg.result === 'FP' ? ' · unique to this model' : ''}`}
                                >
                                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border} ${seg.result === 'FP' ? 'ring-1 ring-purple-400' : ''}`}>
                                        {seg.content}
                                    </span>
                                    <span className={`text-[7px] font-bold tracking-wide mt-0.5 ${c.text}`}>
                                        {seg.label}
                                    </span>
                                </span>
                            );
                        })}
                    </p>
                )}
            </div>

            {/* Pagination bar */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    {/* Left: PII count on this page */}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {piiOnPage > 0
                            ? <><span className="font-semibold text-emerald-500">{piiOnPage}</span> PII spans on this page</>
                            : 'No PII on this page'
                        }
                    </span>

                    {/* Center: Page controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(0)}
                            disabled={safePage === 0}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:border-emerald-300 hover:text-emerald-500 transition-all disabled:cursor-not-allowed"
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={safePage === 0}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:border-emerald-300 hover:text-emerald-500 transition-all disabled:cursor-not-allowed"
                        >
                            ‹ Prev
                        </button>

                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 px-2">
                            Page <span className="text-emerald-500">{safePage + 1}</span> / {totalPages}
                        </span>

                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={safePage === totalPages - 1}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:border-emerald-300 hover:text-emerald-500 transition-all disabled:cursor-not-allowed"
                        >
                            Next ›
                        </button>
                        <button
                            onClick={() => setPage(totalPages - 1)}
                            disabled={safePage === totalPages - 1}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 hover:border-emerald-300 hover:text-emerald-500 transition-all disabled:cursor-not-allowed"
                        >
                            »
                        </button>
                    </div>

                    {/* Right: Jump to page */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Go to:</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            defaultValue={safePage + 1}
                            key={safePage}
                            onBlur={e => {
                                const v = parseInt(e.target.value, 10);
                                if (!isNaN(v) && v >= 1 && v <= totalPages) setPage(v - 1);
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    const v = parseInt((e.target as HTMLInputElement).value, 10);
                                    if (!isNaN(v) && v >= 1 && v <= totalPages) setPage(v - 1);
                                }
                            }}
                            className="w-12 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-mono text-center text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>
            )}

            {/* Single-page footer */}
            {totalPages === 1 && (
                <div className="px-5 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400">
                        {piiOnPage > 0
                            ? <><span className="font-semibold text-emerald-500">{piiOnPage}</span> PII spans detected</>
                            : 'No PII detected by this model'
                        }
                    </span>
                </div>
            )}
        </div>
    );
}

const FALLBACK_MODELS: EvaluatorModel[] = [
    { key: 'regex',   label: '🛠️ Regex Engine', hf_id: '', type: 'Rule-based', params: '—',    f1_benchmark: 1.0,   lazy: false, description: '' },
    { key: 'spacy',   label: '🤖 SpaCy LG',     hf_id: '', type: 'Statistical',params: '685M', f1_benchmark: 0.0,   lazy: false, description: '' },
    { key: 'deberta', label: '🚀 DeBERTa PII',  hf_id: '', type: 'NER',        params: '86M',  f1_benchmark: 0.920, lazy: false, description: '' },
];
