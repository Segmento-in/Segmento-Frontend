'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid, List, File, FileText, Image as ImageIcon, Video, Music,
    CheckCircle2, AlertCircle, Maximize2, ShieldAlert, ShieldCheck, Folder, Tag, Sparkles
} from 'lucide-react';
import { DriveItem, DriveFileScanResult } from '@/lib/apiClient';

interface Props {
    items: DriveItem[];
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    isScanning: boolean;
    scanResults: DriveFileScanResult[];
    onOpenFile: (fileId: string) => void;
    connectorType?: string;
}

// ── Badge state helpers ──────────────────────────────────────────────────────
function getPiiState(item: DriveItem) {
    const tag = item.appProperties?.segmento_pii_detected;
    if (tag === 'true'  || tag === true)  return 'pii' as const;
    if (tag === 'false' || tag === false) return 'clean' as const;
    return 'unscanned' as const;
}

// ── Sub-components ───────────────────────────────────────────────────────────
function PiiBadge({ state }: { state: 'pii' | 'clean' | 'unscanned' }) {
    if (state === 'pii') return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/20">
            <Tag className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-bold tracking-wide uppercase">File Contains PII</span>
        </div>
    );
    if (state === 'clean') return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Scanned — No PII</span>
        </div>
    );
    return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400 text-white shadow-md shadow-amber-400/20">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Not Scanned</span>
        </div>
    );
}

function SelectionDot() {
    return (
        <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
    );
}

export default function ConnectorPreviewUI({
    items, selectedIds, onToggleSelection, isScanning, scanResults, onOpenFile,
    connectorType = 'Google Drive'
}: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPathPrefix, setCurrentPathPrefix] = useState('');

    const visibleItems = useMemo(() => items.filter(item => {
        if (currentPathPrefix === '') return !item.path.includes('/');
        return item.path.startsWith(currentPathPrefix + '/') &&
            item.path.indexOf('/', currentPathPrefix.length + 1) === -1;
    }), [items, currentPathPrefix]);

    const sortedItems = [...visibleItems].sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
    });

    const getFileIcon = (item: DriveItem, cls = 'w-5 h-5') => {
        if (item.isFolder) return <File className={`text-slate-400 ${cls}`} />;
        const mt = item.mediaType;
        if (mt === 'image') return <ImageIcon className={`text-blue-400 ${cls}`} />;
        if (mt === 'video') return <Video className={`text-purple-400 ${cls}`} />;
        if (mt === 'audio') return <Music className={`text-green-400 ${cls}`} />;
        if (item.ext === 'pdf') return <FileText className={`text-red-400 ${cls}`} />;
        return <FileText className={`text-slate-500 ${cls}`} />;
    };

    const getScanStatus = (id: string) => scanResults.find(r => r.file_id === id);

    return (
        <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-[#0B1120] overflow-hidden flex flex-col h-[500px] shadow-inner">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <button onClick={() => setCurrentPathPrefix('')} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-500">
                        {connectorType} Catalog
                    </button>
                    {currentPathPrefix && currentPathPrefix.split('/').map((part, idx, arr) => {
                        const pathSoFar = arr.slice(0, idx + 1).join('/');
                        return (
                            <React.Fragment key={pathSoFar}>
                                <span className="text-slate-400">/</span>
                                <button onClick={() => setCurrentPathPrefix(pathSoFar)} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-500">{part}</button>
                            </React.Fragment>
                        );
                    })}
                    <span className="text-xs text-slate-400 ml-2 shrink-0">({visibleItems.filter(i => !i.isFolder).length} files)</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg ml-4 shrink-0">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Scanning Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-16 h-16 relative mb-4">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                            <ShieldAlert className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">DEEP SCAN IN PROGRESS</h3>
                        <p className="text-sm text-slate-500 font-mono mt-2">Extracting and cataloging PII vectors...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {sortedItems.map(item => {
                            const isSelected = selectedIds.has(item.id);
                            const status = getScanStatus(item.id);
                            const piiState = getPiiState(item);

                            if (item.isFolder) return (
                                <div key={item.id} onClick={() => setCurrentPathPrefix(item.path)}
                                    className="relative group flex flex-col p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 hover:border-blue-400 cursor-pointer transition-all">
                                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center mb-3">
                                            <Folder className="w-6 h-6 text-blue-500 fill-blue-500/20" />
                                        </div>
                                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100 text-center line-clamp-2 w-full px-1">{item.name}</p>
                                    </div>
                                </div>
                            );

                            const cardBg =
                                !item.parseable ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900' :
                                status ? 'cursor-pointer hover:border-blue-400 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700' :
                                piiState === 'pii' ? `bg-rose-50/30 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50 hover:border-rose-400 cursor-pointer${isSelected ? ' ring-2 ring-blue-400' : ''}` :
                                piiState === 'clean' ? `bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 cursor-pointer${isSelected ? ' ring-2 ring-blue-400' : ''}` :
                                isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-400 ring-1 ring-blue-400 shadow-sm' :
                                'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 cursor-pointer';

                            return (
                                <div key={item.id}
                                    onClick={() => !status && item.parseable && onToggleSelection(item.id)}
                                    className={`relative group flex flex-col p-3 rounded-xl border transition-all ${cardBg}`}>

                                    {/* Status badge — top-left */}
                                    <div className="absolute top-2 left-2 z-10">
                                        {status ? (
                                            status.pii_detected ? (
                                                <div className="w-5 h-5 rounded-full bg-red-100 border border-red-300 dark:bg-red-500/20 dark:border-red-500 flex items-center justify-center text-red-600 shadow-sm">
                                                    <span className="text-[10px] font-bold">{status.pii_count}</span>
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/20 dark:border-emerald-500 flex items-center justify-center text-emerald-600 shadow-sm">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            )
                                        ) : item.parseable ? (
                                            <PiiBadge state={piiState} />
                                        ) : null}
                                    </div>

                                    {/* Selection dot — top-right (when selected, no active scan) */}
                                    {isSelected && !status && (
                                        <div className="absolute top-2 right-2 z-10"><SelectionDot /></div>
                                    )}

                                    {/* Open viewer — top-right (when session scan exists) */}
                                    {status && (
                                        <button onClick={(e) => { e.stopPropagation(); onOpenFile(item.id); }}
                                            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-blue-600"
                                            title="Open Document Viewer">
                                            <Maximize2 className="w-3 h-3" />
                                        </button>
                                    )}

                                    <div className="flex-1 flex flex-col items-center justify-center py-4 mt-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                                            {getFileIcon(item, 'w-6 h-6')}
                                        </div>
                                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100 text-center line-clamp-2 w-full px-1">{item.name}</p>
                                    </div>
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-auto flex justify-between items-center px-1">
                                        <span className="text-[10px] text-slate-500 font-mono">{(item.sizeBytes / 1024).toFixed(0)}KB</span>
                                        <span className="text-[10px] uppercase text-slate-400 font-semibold">{item.ext || 'UNK'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {sortedItems.map(item => {
                            const isSelected = selectedIds.has(item.id);
                            const status = getScanStatus(item.id);
                            const piiState = getPiiState(item);

                            if (item.isFolder) return (
                                <div key={item.id} onClick={() => setCurrentPathPrefix(item.path)}
                                    className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 hover:border-blue-400 cursor-pointer transition-colors">
                                    <div className="flex-shrink-0 w-4 h-4" />
                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shrink-0">
                                        <Folder className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex items-center">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate flex-1">{item.name}</p>
                                    </div>
                                </div>
                            );

                            const rowBg =
                                !item.parseable ? 'opacity-50 cursor-not-allowed border-transparent' :
                                status ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' :
                                piiState === 'pii' ? `bg-rose-50/30 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50 hover:border-rose-400 cursor-pointer${isSelected ? ' ring-1 ring-blue-400' : ''}` :
                                piiState === 'clean' ? `bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 cursor-pointer${isSelected ? ' ring-1 ring-blue-400' : ''}` :
                                isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-400' :
                                'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/50 hover:border-slate-300 cursor-pointer';

                            return (
                                <div key={item.id}
                                    onClick={() => !status && item.parseable && onToggleSelection(item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${rowBg}`}>

                                    {/* Status indicator */}
                                    <div className="flex-shrink-0 flex items-center justify-center">
                                        {status ? (
                                            status.pii_detected ? (
                                                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-sm border border-red-200">
                                                    <AlertCircle className="w-3 h-3" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            )
                                        ) : item.parseable ? (
                                            <PiiBadge state={piiState} />
                                        ) : null}
                                    </div>

                                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        {getFileIcon(item, 'w-4 h-4')}
                                    </div>

                                    <div className="flex-1 min-w-0 flex items-center">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate flex-1">{item.name}</p>
                                        <p className="text-xs text-slate-500 truncate w-1/3 text-right">{item.path}</p>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs text-slate-500 font-mono">{(item.sizeBytes / 1024).toFixed(0)}KB</span>
                                        {/* Selection dot */}
                                        {isSelected && !status && <SelectionDot />}
                                        {/* Open viewer */}
                                        {status && (
                                            <button onClick={(e) => { e.stopPropagation(); onOpenFile(item.id); }}
                                                className="px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded hover:bg-blue-600 transition-colors">
                                                View
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {visibleItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Folder className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
                        <p>No assets found in this folder.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
