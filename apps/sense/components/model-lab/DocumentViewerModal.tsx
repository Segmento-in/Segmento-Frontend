'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Loader2, AlertCircle, Maximize2, ExternalLink } from 'lucide-react';
import { apiClient, DriveFileScanResult, DriveItem, EvaluatorPrediction } from '@/lib/apiClient';
import { PII_LABEL_COLORS } from './ModelShowdown';
import { useAuth } from '@/lib/authContext';

interface Props {
    fileInfo: DriveItem;
    scanResult: DriveFileScanResult;
    credentials: any;
    authType: string;
    onClose: () => void;
}

export default function DocumentViewerModal({
    fileInfo,
    scanResult,
    credentials,
    authType,
    onClose
}: Props) {
    const [chunks, setChunks] = useState<Array<{text: string, start_idx: number, end_idx: number}>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    const { token } = useAuth();

    const [isTagging, setIsTagging] = useState(false);
    const [tagSuccess, setTagSuccess] = useState<boolean | null>(null);

    // Aggregate predictions from all models for this file
    const predictions: EvaluatorPrediction[] = Object.values(scanResult.scan_data?.per_model || {}).flatMap((m: any) => m.predictions || []);
    const validPredictions = predictions.filter(p => p.result !== 'FN' && p.text);

    useEffect(() => {
        let isMounted = true;
        const fetchContent = async () => {
            setLoading(true);
            try {
                const data = await apiClient.driveContentChunks(
                    authType,
                    credentials,
                    {
                        id: fileInfo.id,
                        name: fileInfo.name,
                        mimeType: fileInfo.mimeType
                    },
                    3000,
                    token || ''
                );

                if (isMounted) {
                    setChunks(data.chunks || []);
                    setLoading(false);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchContent();
        return () => { isMounted = false; };
    }, [fileInfo.id, credentials, authType]);

    // Renders text for the current chunk, inserting highlight nodes based on predictions
    const renderHighlightedText = () => {
        if (!chunks[page]) return null;
        
        const chunk = chunks[page];
        const { text, start_idx, end_idx } = chunk;
        
        const safe_start_idx = start_idx ?? 0;
        const safe_end_idx = end_idx ?? text.length;

        // Find predictions that overlap with this chunk
        const pagePredictions = validPredictions.filter(p => 
            (p.start >= safe_start_idx && p.start < safe_end_idx) || 
            (p.end > safe_start_idx && p.end <= safe_end_idx) ||
            (p.start < safe_start_idx && p.end > safe_end_idx)
        );

        if (pagePredictions.length === 0) {
            return <div className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300">{text}</div>;
        }

        // Build ranges relative to the chunk string
        const ranges = pagePredictions.map(p => {
            const relStart = Math.max(0, p.start - safe_start_idx);
            const relEnd = Math.min(text.length, p.end - safe_start_idx);
            return { relStart, relEnd, label: p.label, unique: p.result === 'FP' };
        }).sort((a, b) => a.relStart - b.relStart);

        // De-overlap ranges (simple strategy: take the first one, skip overlapping)
        const nonOverlapping = [];
        let lastEnd = -1;
        for (const r of ranges) {
            if (r.relStart >= lastEnd) {
                nonOverlapping.push(r);
                lastEnd = r.relEnd;
            }
        }

        const nodes = [];
        let cursor = 0;
        
        nonOverlapping.forEach((r, i) => {
            if (r.relStart > cursor) {
                nodes.push(<span key={`text-${i}`}>{text.slice(cursor, r.relStart)}</span>);
            }
            
            const color = PII_LABEL_COLORS[r.label?.toUpperCase()] || PII_LABEL_COLORS['DEFAULT'];
            
            nodes.push(
                <mark 
                    key={`mark-${i}`} 
                    title={r.label}
                    className={`inline-block mx-0.5 px-1 rounded font-medium ${color.bg} ${color.text} ${r.unique ? 'ring-1 ring-purple-400' : ''}`}
                >
                    {text.slice(r.relStart, r.relEnd)}
                    <span className="ml-1 text-[8px] uppercase opacity-70 align-top">{r.label}</span>
                </mark>
            );
            cursor = r.relEnd;
        });

        if (cursor < text.length) {
            nodes.push(<span key="text-end">{text.slice(cursor)}</span>);
        }

        return <div className="whitespace-pre-wrap font-mono text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{nodes}</div>;
    };

    const handleTagFile = async () => {
        setIsTagging(true);
        setTagSuccess(null);
        try {
            const filesToTag = [{
                file_id: scanResult.file_id!,
                pii_detected: scanResult.pii_detected!,
                pii_count: scanResult.pii_count!
            }];
            const res = await apiClient.driveTagFiles(authType, credentials, filesToTag, true, token || '');
            if (res.tagged[0]?.success) {
                setTagSuccess(true);
            } else {
                setTagSuccess(false);
            }
        } catch (err) {
            console.error(err);
            setTagSuccess(false);
        } finally {
            setIsTagging(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Maximize2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    {fileInfo.name}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span>{fileInfo.mimeType}</span>
                                    {scanResult.pii_detected ? (
                                        <span className="text-red-500 font-medium bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded">
                                            {scanResult.pii_count} PII Detected
                                        </span>
                                    ) : (
                                        <span className="text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                            Clean
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Autonomous Tag Button */}
                            {scanResult.pii_detected && (
                                <button
                                    onClick={handleTagFile}
                                    disabled={isTagging || tagSuccess === true}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                                        tagSuccess === true ? 'bg-emerald-500 text-white cursor-default' :
                                        tagSuccess === false ? 'bg-red-500 text-white hover:bg-red-600' :
                                        'bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                                    } disabled:opacity-50`}
                                >
                                    {isTagging ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                     tagSuccess === true ? <AlertCircle className="w-4 h-4" /> : null}
                                    {tagSuccess === true ? 'Tagged Successfully' : 
                                     tagSuccess === false ? 'Retry Tagging' : 'Write PII Tag to Drive'}
                                </button>
                            )}
                            <div className="flex items-center gap-2">
                                {fileInfo.webViewLink && (
                                    <a 
                                        href={fileInfo.webViewLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded transition-colors text-xs font-semibold"
                                    >
                                        <ExternalLink size={14} />
                                        Open in Drive
                                    </a>
                                )}
                                <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white dark:bg-[#0B1120]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                                <p>Extracting and rendering document...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full text-red-500">
                                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-medium text-lg">Failed to load content</p>
                                <p className="text-sm opacity-80 mt-2">{error}</p>
                            </div>
                        ) : chunks.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                No readable text found in this file.
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto selection:bg-blue-200 dark:selection:bg-blue-900">
                                {renderHighlightedText()}
                            </div>
                        )}
                    </div>

                    {/* Footer / Pagination */}
                    {!loading && chunks.length > 1 && (
                        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                            <span className="text-sm text-slate-500">
                                Page {page + 1} of {chunks.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setPage(p => Math.min(chunks.length - 1, p + 1))}
                                    disabled={page === chunks.length - 1}
                                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
