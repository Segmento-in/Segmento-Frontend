'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
    Upload, ChevronDown, ChevronUp, CheckSquare, Square,
    Play, RotateCcw, FileText, Settings2, AlertCircle,
    CheckCircle2, Target, Eye, BarChart2,
} from 'lucide-react';
import { ModelLabState } from '@/app/model-lab/ModelLabClient';
import { EvaluatorModel, apiClient } from '@/lib/apiClient';

const FORMAT_OPTIONS = [
    { value: 'auto',       label: 'Auto-detect',              desc: 'Let the backend figure out the format' },
    { value: 'bigcode',    label: 'bigcode JSON (BIO)',        desc: 'tokens + labels + trailing_whitespace' },
    { value: 'nemotron',   label: 'Nemotron Parquet (spans)', desc: 'text + spans columns' },
    { value: 'csv_spans',  label: 'CSV with spans column',    desc: 'text col + JSON spans col' },
    { value: 'json_spans', label: 'JSON with spans',          desc: '[{text, spans}] array' },
    { value: 'unlabeled',  label: 'Unlabeled (any format)',   desc: 'No GT — detection only' },
];

const TYPE_COLORS: Record<string, string> = {
    'Rule-based':  'border-emerald-300 text-emerald-700 bg-emerald-500/10',
    'Statistical': 'border-amber-500/50 text-amber-600 bg-amber-500/10',
    'GLiNER':      'border-purple-500/50 text-purple-600 bg-purple-500/10',
    'NER':         'border-blue-500/50 text-blue-600 bg-blue-500/10',
    'Rule+ML':     'border-cyan-500/50 text-cyan-300 bg-cyan-500/10',
};

const F1_COLOR = (f1: number) =>
    f1 >= 0.97 ? 'text-emerald-400' :
    f1 >= 0.92 ? 'text-teal-400' :
    f1 >= 0.85 ? 'text-blue-400' :
    f1 > 0     ? 'text-amber-400' : 'text-slate-500';

interface Props {
    state: ModelLabState;
    update: (patch: Partial<ModelLabState>) => void;
}

export default function UploadScanTab({ state, update }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [schemaOpen, setSchemaOpen] = useState(false);
    const [schemaText, setSchemaText] = useState('');
    const [schemaError, setSchemaError] = useState('');

    // ── FILE DRAG & DROP ─────────────────────────────────────────────────────
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) update({ uploadedFile: file, parseResult: null, scanResult: null, error: null });
    }, [update]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) update({ uploadedFile: file, parseResult: null, scanResult: null, error: null });
    };

    // ── MODEL SELECTION ──────────────────────────────────────────────────────
    const toggleModel = (key: string) => {
        const sel = state.selectedModels.includes(key)
            ? state.selectedModels.filter(k => k !== key)
            : [...state.selectedModels, key];
        update({ selectedModels: sel, activeModelKey: sel[0] ?? 'deberta' });
    };

    const selectAll  = () => {
        const all = state.modelCatalogue.map(m => m.key);
        update({ selectedModels: all, activeModelKey: all[0] ?? 'deberta' });
    };
    const clearAll   = () => update({ selectedModels: [], activeModelKey: '' });

    // ── SCHEMA PARSING ───────────────────────────────────────────────────────
    const parseSchema = (): Record<string, string> | undefined => {
        if (!schemaText.trim()) return undefined;
        try {
            const parsed = JSON.parse(schemaText);
            setSchemaError('');
            return parsed;
        } catch {
            setSchemaError('Invalid JSON — e.g. {"text_col":"text","spans_col":"spans"}');
            return undefined;
        }
    };

    // ── PARSE → SCAN PIPELINE ─────────────────────────────────────────────────
    const runPipeline = async () => {
        if (!state.uploadedFile) { update({ error: 'Please upload a file first.' }); return; }
        if (state.selectedModels.length === 0) { update({ error: 'Select at least one model.' }); return; }
        const schema = parseSchema();
        if (schemaText && !schema) return; // schema parse error shown above

        update({ isLoading: true, error: null, loadingStage: 'Parsing file…' });

        try {
            // Step 1: Parse
            const parsed = await apiClient.evaluatorParse(
                state.uploadedFile,
                state.formatHint,
                state.docIndex,
                schema,
            );
            update({ parseResult: parsed, loadingStage: 'Running models…' });

            if (state.scanMode === 'batch') {
                // Batch path
                update({ loadingStage: `Batch eval — ${state.nDocs} docs…` });
                const batch = await apiClient.evaluatorBatch(
                    state.uploadedFile,
                    state.formatHint,
                    state.nDocs,
                    state.selectedModels,
                    state.confThreshold,
                    state.entropyThreshold,
                );
                update({ batchResult: batch, isLoading: false, loadingStage: '', activeTab: 2 });
            } else {
                // Single doc path
                const scan = await apiClient.evaluatorScan(
                    parsed.text,
                    parsed.gt_spans,
                    state.selectedModels,
                    state.confThreshold,
                    state.entropyThreshold,
                );
                const firstKey = state.selectedModels[0] ?? '';
                update({
                    scanResult: scan,
                    activeModelKey: firstKey,
                    isLoading: false,
                    loadingStage: '',
                    activeTab: 1,   // jump to Document View
                });
            }
        } catch (err: any) {
            update({ isLoading: false, loadingStage: '', error: err?.message ?? 'Backend error.' });
        }
    };

    const resetAll = () => {
        update({
            uploadedFile: null, parseResult: null, scanResult: null,
            batchResult: null, error: null, activeTab: 0,
        });
        if (fileRef.current) fileRef.current.value = '';
    };

    // ── QUICK SUMMARY (shown after scan) ─────────────────────────────────────
    const activeData = state.scanResult?.per_model?.[state.activeModelKey];
    const overall    = activeData?.metrics?.find(r => r.entity_type === 'OVERALL');

    return (
        <div  className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 text-slate-900 dark:text-slate-100">

            {/* ── LEFT: Model Selector ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide">Select Models</span>
                        <div className="flex gap-2">
                            <button onClick={selectAll}
                                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-400 hover:bg-emerald-200 transition-colors">
                                All
                            </button>
                            <button onClick={clearAll}
                                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {(state.modelCatalogue.length > 0 ? state.modelCatalogue : FALLBACK_MODELS).map(model => {
                            const selected = state.selectedModels.includes(model.key);
                            return (
                                <button
                                    key={model.key}
                                    onClick={() => toggleModel(model.key)}
                                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                                        selected
    ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10'
    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <div className="mt-0.5 flex-shrink-0">
                                        {selected
                                            ? <CheckSquare size={14} className="text-emerald-400" />
                                            : <Square size={14} className="text-slate-500" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{model.label}</span>
                                            {model.lazy && (
                                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono flex-shrink-0">
                                                    LAZY
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium flex-shrink-0 ${TYPE_COLORS[model.type] ?? ''}`}>
                                                {model.type}
                                            </span>
                                            {model.params !== '—' && (
                                                <span className="text-[9px] text-slate-500 dark:text-slate-400">{model.params}</span>
                                            )}
                                            {model.f1_benchmark > 0 && (
                                                <span className={`text-[9px] font-bold ml-auto flex-shrink-0 ${F1_COLOR(model.f1_benchmark)}`}>
                                                    F1 {model.f1_benchmark.toFixed(3)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {state.selectedModels.length > 0 && (
                        <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                            <span className="text-[11px] text-emerald-400 font-semibold">
                                {state.selectedModels.length} model{state.selectedModels.length > 1 ? 's' : ''} selected
                            </span>
                        </div>
                    )}
                </div>

                {/* Thresholds */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Settings2 size={13} className="text-slate-500" />
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Thresholds</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col gap-1.5">
                            <div className="flex justify-between">
                                <span className="text-[11px] text-slate-500">Confidence</span>
                                <span className="text-[11px] font-mono text-emerald-400">{state.confThreshold.toFixed(2)}</span>
                            </div>
                            <input type="range" min={0} max={1} step={0.01}
                                value={state.confThreshold}
                                onChange={e => update({ confThreshold: parseFloat(e.target.value) })}
                                className="w-full accent-emerald-500" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <div className="flex justify-between">
                                <span className="text-[11px] text-slate-500">Entropy (secrets)</span>
                                <span className="text-[11px] font-mono text-emerald-400">{state.entropyThreshold.toFixed(1)}</span>
                            </div>
                            <input type="range" min={3} max={6} step={0.1}
                                value={state.entropyThreshold}
                                onChange={e => update({ entropyThreshold: parseFloat(e.target.value) })}
                                className="w-full accent-emerald-500" />
                        </label>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Upload + Config + Run ─────────────────────────────────── */}
            <div className="flex flex-col gap-5">

                {/* File drop zone */}
                <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
                        isDragging
                            ? 'border-emerald-400/70 bg-emerald-50'
                            : state.uploadedFile
                                ? 'border-emerald-300 bg-emerald-50'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <input ref={fileRef} type="file"
                        accept=".json,.parquet,.csv,.txt,.pdf,.avro"
                        className="hidden" onChange={handleFileChange} />
                    {state.uploadedFile ? (
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 size={32} className="text-emerald-400" />
                            <p className="text-sm font-bold text-slate-900">{state.uploadedFile.name}</p>
                            <p className="text-xs text-slate-500">
                                {(state.uploadedFile.size / 1024).toFixed(1)} KB — click to change
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                <Upload size={22} className="text-slate-500" />
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Drop a dataset file here</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                .parquet · .json · .csv · .txt · .pdf · .avro
                            </p>
                        </div>
                    )}
                </div>

                {/* Config row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Format picker */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
                        <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 tracking-wider uppercase">Dataset Format</span>
                        <div className="flex flex-col gap-2">
                            {FORMAT_OPTIONS.map(opt => (
                                <label key={opt.value} className="flex items-start gap-2.5 cursor-pointer group">
                                    <input type="radio" name="format" value={opt.value}
                                        checked={state.formatHint === opt.value}
                                        onChange={() => update({ formatHint: opt.value })}
                                        className="mt-0.5 accent-emerald-500 flex-shrink-0" />
                                    <div>
                                        <span className={`text-xs font-semibold ${state.formatHint === opt.value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                                            {opt.label}
                                        </span>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Scan mode + doc index */}
                    <div className="flex flex-col gap-4">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
                            <span className="block text-xs font-bold text-slate-500 mb-3 tracking-wider uppercase">Scan Mode</span>
                            <div className="flex gap-2">
                                {(['single', 'batch'] as const).map(mode => (
                                    <button key={mode}
                                        onClick={() => update({ scanMode: mode })}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                            state.scanMode === mode
                                                ? 'bg-emerald-500 text-white'
                                                : ':bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}>
                                        {mode === 'single' ? '📄 Single Doc' : '📦 Batch Eval'}
                                    </button>
                                ))}
                            </div>

                            {state.scanMode === 'batch' ? (
                                <div className="mt-4">
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[11px] text-slate-500">Documents to eval</span>
                                        <span className="text-[11px] font-mono text-emerald-400">{state.nDocs}</span>
                                    </div>
                                    <input type="range" min={1} max={1000} step={1}
                                        value={state.nDocs}
                                        onChange={e => update({ nDocs: parseInt(e.target.value) })}
                                        className="w-full accent-emerald-500" />
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <label className="block text-[11px] text-slate-500 mb-1.5">Doc index (0-based)</label>
                                    <input type="number" min={0} value={state.docIndex}
                                        onChange={e => update({ docIndex: parseInt(e.target.value) || 0 })}
                                       className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-300" />
                                </div>
                            )}
                        </div>

                        {/* Schema upload (collapsible) */}
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4">
                            <button
                                onClick={() => setSchemaOpen(o => !o)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Manual Schema</span>
                                {schemaOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                            </button>
                            {schemaOpen && (
                                <div className="mt-3">
                                    <p className="text-[10px] text-slate-500 mb-2">
                                        JSON: <code className="text-emerald-400">{`{"text_col":"text","spans_col":"spans"}`}</code>
                                    </p>
                                    <textarea
                                        rows={2}
                                        placeholder='{"text_col": "text", "spans_col": "spans"}'
                                        value={schemaText}
                                        onChange={e => setSchemaText(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono resize-none focus:outline-none focus:border-emerald-300"
                                    />
                                    {schemaError && (
                                        <p className="text-[10px] text-red-400 mt-1">{schemaError}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {state.error && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-500/10">
                        <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                        <span className="text-sm text-red-600">{state.error}</span>
                    </div>
                )}

                {/* Parse result info banner */}
                {state.parseResult && (
                    <div className="flex flex-wrap items-center gap-4 px-5 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-500/10">
                        <div className="flex items-center gap-2">
                            <FileText size={13} className="text-emerald-400" />
                            <span className="text-xs text-emerald-700 font-semibold">
                                {state.parseResult.format_detected.toUpperCase()}
                            </span>
                        </div>
                        <span className="text-xs text-slate-500">{state.parseResult.char_count.toLocaleString()} chars</span>
                        <span className="text-xs text-slate-500">{state.parseResult.doc_count} docs</span>
                        {state.parseResult.has_gt
                            ? <span className="text-xs text-emerald-400 font-semibold">✓ Ground truth loaded ({state.parseResult.gt_spans.length} spans)</span>
                            : <span className="text-xs text-amber-400">⚠ No ground truth — detection only</span>
                        }
                    </div>
                )}

                {/* Quick metrics (after scan) */}
                {overall && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'F1 Score',  value: overall.f1.toFixed(3),   color: 'text-emerald-400', icon: Target },
                            { label: 'Precision', value: overall.precision.toFixed(3), color: 'text-blue-400',   icon: CheckCircle2 },
                            { label: 'Recall',    value: overall.recall.toFixed(3),    color: 'text-purple-400', icon: Eye },
                            { label: 'TP / FP / FN', value: `${overall.tp} / ${overall.fp} / ${overall.fn}`, color: 'text-slate-700', icon: BarChart2 },
                        ].map(c => {
                            const Icon = c.icon;
                            return (
                                <div key={c.label} className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                                    <Icon size={14} className={c.color} />
                                    <span className={`text-xl font-black ${c.color}`}>{c.value}</span>
                                    <span className="text-[10px] text-slate-500 tracking-widest uppercase">{c.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={runPipeline}
                        disabled={state.isLoading}
                        className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all"
                    >
                        {state.isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {state.loadingStage || 'Processing…'}
                            </>
                        ) : (
                            <>
                                <Play size={15} />
                                {state.scanMode === 'batch' ? 'Run Batch Evaluation' : 'Run Full Scan'}
                            </>
                        )}
                    </button>
                    {(state.uploadedFile || state.scanResult) && (
                        <button
                            onClick={resetAll}
                            className="px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                        >
                            <RotateCcw size={15} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Fallback models for initial render before catalogue loads
const FALLBACK_MODELS: EvaluatorModel[] = [
    { key: 'regex',   label: 'Regex Engine', hf_id: '', type: 'Rule-based', params: '—',    f1_benchmark: 1.0,   lazy: false, description: '' },
    { key: 'spacy',   label: 'SpaCy LG',     hf_id: '', type: 'Statistical',params: '685M', f1_benchmark: 0.0,   lazy: false, description: '' },
    { key: 'deberta', label: 'DeBERTa PII',  hf_id: '', type: 'NER',        params: '86M',  f1_benchmark: 0.920, lazy: false, description: '' },
    { key: 'nerguard',label: 'NerGuard-0.3B',hf_id: '', type: 'NER',        params: '300M', f1_benchmark: 0.996, lazy: true,  description: '' },
];
