'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
    Upload, Play, RotateCcw, CheckCircle2, CheckSquare, Square,
    ChevronDown, AlertCircle, Layers, FileText,
} from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { EvaluatorModel, apiClient } from '@/lib/apiClient';
import ModelShowdown from '@/components/model-lab/ModelShowdown';

// ── File categories & types ───────────────────────────────────────────────────

const CATEGORIES = [
    {
        key: 'unstructured',
        label: '📄 Unstructured',
        desc: 'Documents, emails, plain text',
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
};

interface Props {
    modelCatalogue: EvaluatorModel[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FormatScanTab({ modelCatalogue }: Props) {
    const [s, setS] = useState<FormatScanState>(INITIAL);
    const fileRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const patch = (p: Partial<FormatScanState>) => setS(prev => ({ ...prev, ...p }));

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

        patch({ isLoading: true, error: null, loadingStage: 'Parsing file…', showdownData: null });

        try {
            // Step 1: Parse
            const parsed = await apiClient.evaluatorParse(s.uploadedFile, s.fileType, 0);
            patch({ parsedChars: parsed.char_count, loadingStage: `Running ${s.selectedModels.length} models…` });

            // Step 2: Scan
            const scan = await apiClient.evaluatorScan(
                parsed.text,
                [],
                s.selectedModels,
                0.5,
                4.5,
            );

            patch({ showdownData: scan, isLoading: false, loadingStage: '' });
        } catch (err: any) {
            patch({ isLoading: false, loadingStage: '', error: err?.message ?? 'Backend error.' });
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
                            {s.isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {s.loadingStage || 'Processing…'}
                                </>
                            ) : (
                                <>
                                    <Play size={15} />
                                    Run Model Showdown
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
                </div>
            </div>

            {/* ── Results: Model Showdown ── */}
            {s.showdownData && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Layers size={16} className="text-emerald-400" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Model Showdown Results</h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            — {s.fileType.toUpperCase()} file · {s.selectedModels.length} models
                        </span>
                    </div>
                    <ModelShowdown
                        data={s.showdownData}
                        modelCatalogue={modelCatalogue.length > 0 ? modelCatalogue : FALLBACK_MODELS}
                    />
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
