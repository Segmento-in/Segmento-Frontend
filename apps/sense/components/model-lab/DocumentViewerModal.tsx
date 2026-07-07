'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles,
    ExternalLink, ShieldAlert, ShieldCheck, BarChart3, Tag, CheckCircle2
} from 'lucide-react';
import { apiClient, DriveFileScanResult, DriveItem, EvaluatorPrediction } from '@/lib/apiClient';
import { PII_LABEL_COLORS } from './ModelShowdown';
import { useAuth } from '@/lib/authContext';
import { PIIAnalytics } from '@/components/pii-demo/PIIAnalytics';
import { Inspector } from '@/components/pii-demo/Inspector';

interface Props {
    fileInfo: DriveItem;
    scanResult: DriveFileScanResult;
    credentials: any;
    authType: string;
    onClose: () => void;
}

// Derive PIIAnalytics-compatible pii_counts from scan_data
function derivePiiCounts(scan_data: any): Array<{ 'PII Type': string; Count: number }> {
    if (!scan_data?.per_model) return [];
    const typeTotals: Record<string, number> = {};
    Object.values(scan_data.per_model).forEach((m: any) => {
        Object.entries(m.type_counts || {}).forEach(([label, count]: [string, any]) => {
            typeTotals[label] = (typeTotals[label] || 0) + count;
        });
    });
    return Object.entries(typeTotals).map(([label, count]) => ({ 'PII Type': label, Count: count }));
}

function deriveSchema(scan_data: any): Array<{ Column: string; Type: string }> {
    if (!scan_data?.ranked) return [];
    return scan_data.ranked.map((r: any) => ({
        Column: r.model_key,
        Type: `${r.pii_count} PII detection${r.pii_count !== 1 ? 's' : ''} (rank #${r.rank})`
    }));
}

type Tab = 'analytics' | 'text';

export default function DocumentViewerModal({
    fileInfo,
    scanResult,
    credentials,
    authType,
    onClose
}: Props) {
    const { token } = useAuth();

    // ── UI state ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<Tab>('analytics');
    const [chunks, setChunks] = useState<Array<{ text: string; start_idx: number; end_idx: number }>>([]);
    const [textLoading, setTextLoading] = useState(false);
    const [textError, setTextError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    // ── Tagging state ─────────────────────────────────────────────────────────
    const [isTagging, setIsTagging] = useState(false);
    const [tagState, setTagState] = useState<'idle' | 'success' | 'error'>('idle');
    const [tagError, setTagError] = useState<string | null>(null);

    // ── Derived analytics data from scan_data ─────────────────────────────────
    const hasScanData = !!(scanResult.scan_data || scanResult.result);
    const piiCounts = useMemo(() => {
        if (scanResult.result?.pii_counts) return scanResult.result.pii_counts;
        return derivePiiCounts(scanResult.scan_data) as any;
    }, [scanResult]);
    const schemaRows = useMemo(() => {
        if (scanResult.result?.schema) return scanResult.result.schema;
        return deriveSchema(scanResult.scan_data) as any;
    }, [scanResult]);

    // ── Predictions from all models for highlighted text ──────────────────────
    const validPredictions: EvaluatorPrediction[] = useMemo(() =>
        Object.values(scanResult.scan_data?.per_model || {})
            .flatMap((m: any) => m.predictions || [])
            .filter((p: any) => p.result !== 'FN' && p.text),
        [scanResult.scan_data]
    );

    // ── Fetch text chunks ONLY when user switches to "Text" tab ──────────────
    useEffect(() => {
        if (activeTab !== 'text') return;
        if (chunks.length > 0 || textLoading) return; // already fetched

        // Local upload — no download needed
        if (authType === 'local') return;

        let mounted = true;
        setTextLoading(true);
        setTextError(null);

        apiClient.driveContentChunks(
            authType,
            credentials,
            { id: fileInfo.id, name: fileInfo.name, mimeType: fileInfo.mimeType },
            3000,
            token || ''
        ).then(data => {
            if (mounted) { setChunks(data.chunks || []); setTextLoading(false); }
        }).catch((err: any) => {
            if (mounted) {
                setTextError(
                    'File content preview unavailable — the OAuth token does not grant ' +
                    'this app raw file read access. Use the Analytics tab to view PII results.'
                );
                setTextLoading(false);
            }
        });

        return () => { mounted = false; };
    }, [activeTab, fileInfo.id, authType, credentials, token, chunks.length, textLoading]);

    // ── Tagging ───────────────────────────────────────────────────────────────
    const handleTagFile = async () => {
        setIsTagging(true);
        setTagState('idle');
        setTagError(null);
        try {
            const res = await apiClient.driveTagFiles(
                authType,
                credentials,
                [{ file_id: scanResult.file_id!, pii_detected: !!scanResult.pii_detected, pii_count: scanResult.pii_count || 0 }],
                true,
                token || ''
            );
            if (res.tagged[0]?.success) {
                setTagState('success');
            } else {
                setTagState('error');
                setTagError(res.tagged[0]?.error || 'Tagging failed.');
            }
        } catch (err: any) {
            setTagState('error');
            setTagError(err.message || 'Tagging failed.');
        } finally {
            setIsTagging(false);
        }
    };

    // ── Text highlight renderer ───────────────────────────────────────────────
    const renderHighlightedText = () => {
        if (!chunks[page]) return null;
        const { text, start_idx, end_idx } = chunks[page];
        const safeStart = start_idx ?? 0;
        const safeEnd = end_idx ?? text.length;

        const pagePreds = validPredictions.filter(p =>
            (p.start >= safeStart && p.start < safeEnd) ||
            (p.end > safeStart && p.end <= safeEnd) ||
            (p.start < safeStart && p.end > safeEnd)
        );

        if (pagePreds.length === 0) {
            return <div className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300">{text}</div>;
        }

        const ranges = pagePreds.map(p => ({
            relStart: Math.max(0, p.start - safeStart),
            relEnd: Math.min(text.length, p.end - safeStart),
            label: p.label, unique: p.result === 'FP'
        })).sort((a, b) => a.relStart - b.relStart);

        const nonOverlapping: typeof ranges = [];
        let lastEnd = -1;
        for (const r of ranges) {
            if (r.relStart >= lastEnd) { nonOverlapping.push(r); lastEnd = r.relEnd; }
        }

        const nodes: React.ReactNode[] = [];
        let cursor = 0;
        nonOverlapping.forEach((r, i) => {
            if (r.relStart > cursor) nodes.push(<span key={`t${i}`}>{text.slice(cursor, r.relStart)}</span>);
            const color = PII_LABEL_COLORS[r.label?.toUpperCase()] || PII_LABEL_COLORS['DEFAULT'];
            nodes.push(
                <mark key={`m${i}`} title={r.label}
                    className={`inline-block mx-0.5 px-1 rounded font-medium ${color.bg} ${color.text} ${r.unique ? 'ring-1 ring-purple-400' : ''}`}>
                    {text.slice(r.relStart, r.relEnd)}
                    <span className="ml-1 text-[8px] uppercase opacity-70 align-top">{r.label}</span>
                </mark>
            );
            cursor = r.relEnd;
        });
        if (cursor < text.length) nodes.push(<span key="end">{text.slice(cursor)}</span>);
        return <div className="whitespace-pre-wrap font-mono text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{nodes}</div>;
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {/* ── Header ──────────────────────────────────────────── */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* PII badge */}
                            {scanResult.pii_detected ? (
                                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl shrink-0">
                                    <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                </div>
                            ) : (
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate max-w-sm">{fileInfo.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-slate-400">{fileInfo.ext?.toUpperCase() || fileInfo.mimeType}</span>
                                    {scanResult.pii_detected ? (
                                        <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-200">
                                            {scanResult.pii_count} PII Detected
                                        </span>
                                    ) : (
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200">
                                            Clean — No PII
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Tag button — always shown for Drive files */}
                            {authType !== 'local' && (
                                <button
                                    onClick={handleTagFile}
                                    disabled={isTagging || tagState === 'success'}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-sm ${
                                        tagState === 'success'
                                            ? 'bg-emerald-500 border-emerald-500 text-white cursor-default'
                                            : tagState === 'error'
                                            ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600'
                                    } disabled:opacity-60`}
                                    title={tagError || undefined}
                                >
                                    {isTagging ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : tagState === 'success' ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    ) : (
                                        <Tag className="w-3.5 h-3.5" />
                                    )}
                                    {tagState === 'success' ? 'Tagged' : tagState === 'error' ? 'Retry Tag' : 'Tag in Drive'}
                                </button>
                            )}
                            {fileInfo.webViewLink && (
                                <a href={fileInfo.webViewLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold border border-blue-200 transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Open in Drive
                                </a>
                            )}
                            <button onClick={onClose}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* ── Tag error banner ─────────────────────────────────── */}
                    {tagState === 'error' && tagError && (
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs shrink-0">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span><strong>Tagging failed:</strong> {tagError}. This usually means the OAuth token doesn't allow writing to Drive metadata. Try opening the file directly in Drive.</span>
                        </div>
                    )}

                    {/* ── Tabs ─────────────────────────────────────────────── */}
                    <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shrink-0 px-5">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`flex items-center gap-2 pb-3 pt-3 text-sm font-semibold border-b-2 transition-colors mr-8 -mb-px ${
                                activeTab === 'analytics'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            PII Analytics
                            {scanResult.pii_detected && (
                                <span className="ml-1 px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">
                                    {scanResult.pii_count}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('text')}
                            className={`flex items-center gap-2 pb-3 pt-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                                activeTab === 'text'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Highlighted Text
                        </button>
                    </div>

                    {/* ── Body ─────────────────────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0B1120]">

                        {/* Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <div className="p-6 lg:p-8">
                                {hasScanData ? (
                                    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
                                        <PIIAnalytics
                                            piiCounts={piiCounts}
                                            schema={schemaRows}
                                        />
                                        {scanResult.result?.inspector && (
                                            <Inspector inspectorData={scanResult.result.inspector} />
                                        )}
                                        {/* Model breakdown from scan_data */}
                                        {scanResult.scan_data?.ranked && scanResult.scan_data.ranked.length > 0 && (
                                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Model Detection Breakdown</h4>
                                                </div>
                                                <table className="w-full text-sm">
                                                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left font-semibold">Rank</th>
                                                            <th className="px-4 py-2 text-left font-semibold">Model</th>
                                                            <th className="px-4 py-2 text-right font-semibold">PII Found</th>
                                                            <th className="px-4 py-2 text-right font-semibold">Consensus Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        {scanResult.scan_data.ranked.map((r: any) => (
                                                            <tr key={r.model_key} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                                <td className="px-4 py-2.5">
                                                                    <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-[11px] font-bold ${
                                                                        r.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                                                        r.rank === 2 ? 'bg-slate-100 text-slate-600' :
                                                                        'bg-slate-50 text-slate-500'
                                                                    }`}>{r.rank}</span>
                                                                </td>
                                                                <td className="px-4 py-2.5 font-mono font-medium text-slate-800 dark:text-slate-200">{r.model_key}</td>
                                                                <td className="px-4 py-2.5 text-right">
                                                                    <span className={`font-bold ${r.pii_count > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                                        {r.pii_count}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-2.5 text-right text-slate-500 font-mono text-xs">
                                                                    {(r.accuracy * 100).toFixed(1)}%
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                                        <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
                                        <p className="font-medium text-slate-500">No analysis data available</p>
                                        <p className="text-sm mt-1 opacity-70">Scan this file to see PII analytics</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Text Tab */}
                        {activeTab === 'text' && (
                            <div className="p-6 lg:p-10">
                                {authType === 'local' && scanResult.result ? (
                                    <div className="text-sm text-slate-500 italic">
                                        Text preview is not available for local uploads. Use the Analytics tab.
                                    </div>
                                ) : textLoading ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                                        <p>Extracting document text...</p>
                                    </div>
                                ) : textError ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-4">
                                        <AlertCircle className="w-10 h-10 text-amber-400 opacity-70" />
                                        <p className="font-medium text-slate-600 dark:text-slate-300">Text preview unavailable</p>
                                        <p className="text-sm text-center max-w-md text-slate-400">{textError}</p>
                                        <button
                                            onClick={() => setActiveTab('analytics')}
                                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            <BarChart3 className="w-4 h-4" /> View PII Analytics Instead
                                        </button>
                                    </div>
                                ) : chunks.length === 0 ? (
                                    <div className="flex items-center justify-center py-24 text-slate-400">
                                        No readable text found in this file.
                                    </div>
                                ) : (
                                    <div className="max-w-4xl mx-auto selection:bg-blue-200 dark:selection:bg-blue-900">
                                        {renderHighlightedText()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Footer / Pagination (text tab only) ──────────────── */}
                    {activeTab === 'text' && !textLoading && chunks.length > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                            <span className="text-sm text-slate-500">Page {page + 1} of {chunks.length}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => setPage(p => Math.min(chunks.length - 1, p + 1))} disabled={page === chunks.length - 1}
                                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
