'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Image as ImageIcon, Video, Music,
    CheckCircle2, AlertCircle, Maximize2, ShieldCheck,
    Folder, Tag, Sparkles, ChevronRight, Filter, ArrowUpDown,
    ArrowUp, ArrowDown, Loader2
} from 'lucide-react';
import { DriveItem, DriveFileScanResult, FileCatalogEntry } from '@/lib/apiClient';

// ── Types ────────────────────────────────────────────────────────────────────

type PiiState = 'pii' | 'clean' | 'unscanned' | 'new';
// pii_count removed from sort keys (column removed)
type SortKey = 'name' | 'status' | 'size' | 'first_seen' | 'last_scanned';
type SortDir = 'asc' | 'desc';

interface Props {
    items: DriveItem[];
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    scanningIds: Set<string>;        // files currently being scanned (inline spinner)
    scanResults: DriveFileScanResult[];
    onOpenFile: (fileId: string) => void;
    connectorType?: string;
    catalogData?: FileCatalogEntry[];
    lastSession?: any;
    piiActions?: Record<string, 'pending' | 'tagged' | 'ignored'>;
    fileTagVisibility?: Record<string, 'api_only' | 'api_and_human'>;
    onTagFile?: (id: string) => void;
    onIgnoreFile?: (id: string) => void;
    onSetTagVisibility?: (id: string, visibility: 'api_only' | 'api_and_human') => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}

function getPiiState(
    item: DriveItem,
    catalogData?: FileCatalogEntry[],
    lastSession?: any,
    scanResults?: DriveFileScanResult[]
): PiiState {
    const liveResult = scanResults?.find(r => r.file_id === item.id);
    if (liveResult) return liveResult.pii_detected ? 'pii' : 'clean';

    const cat = catalogData?.find(c => c.file_id === item.id);
    if (cat?.scan_status === 'pii_found') return 'pii';
    if (cat?.scan_status === 'clean') return 'clean';

    const tag = item.appProperties?.segmento_pii_detected;
    if (tag === 'true' || tag === true) return 'pii';
    if (tag === 'false' || tag === false) return 'clean';

    if (!lastSession) return 'new';
    if (cat?.first_seen_at) {
        const firstSeen = new Date(cat.first_seen_at).getTime();
        const lastScan = new Date(lastSession.triggered_at).getTime();
        if (firstSeen > lastScan) return 'new';
    }
    if (cat) return 'unscanned';
    return 'new';
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function PiiBadge({ state }: { state: PiiState }) {
    const configs: Record<PiiState, { cls: string; icon: React.ReactNode; label: string }> = {
        pii: {
            cls: 'bg-rose-500 text-white shadow-rose-500/20',
            icon: <Tag className="w-3 h-3 fill-current" />,
            label: 'PII Found',
        },
        clean: {
            cls: 'bg-emerald-500 text-white shadow-emerald-500/20',
            icon: <ShieldCheck className="w-3 h-3" />,
            label: 'Clean',
        },
        new: {
            cls: 'bg-blue-500 text-white shadow-blue-500/20',
            icon: <Sparkles className="w-3 h-3" />,
            label: 'New',
        },
        unscanned: {
            cls: 'bg-slate-400 text-white shadow-slate-400/20',
            icon: <Folder className="w-3 h-3" />,
            label: 'Unscanned',
        },
    };
    const { cls, icon, label } = configs[state];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-md ${cls}`}>
            {icon}{label}
        </span>
    );
}

// ── Sort header button ────────────────────────────────────────────────────────

function SortHeader({
    label, sortKey, currentKey, dir, onSort,
    className = ''
}: {
    label: string; sortKey: SortKey; currentKey: SortKey; dir: SortDir;
    onSort: (k: SortKey) => void; className?: string;
}) {
    const active = currentKey === sortKey;
    return (
        <button
            onClick={() => onSort(sortKey)}
            className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ${className}`}
        >
            {label}
            {active
                ? (dir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)
                : <ArrowUpDown className="w-3 h-3 opacity-30" />}
        </button>
    );
}

// ── Folder aggregate ──────────────────────────────────────────────────────────

function getFolderAggregate(item: DriveItem, catalogData?: FileCatalogEntry[]) {
    if (!catalogData) return { piiCount: 0, childCount: 0, hasPii: false };
    const children = catalogData.filter(c => c.parent_folder_id === item.id && !c.is_folder);
    const piiCount = children.reduce((s, c) => s + (c.pii_count || 0), 0);
    return { piiCount, childCount: children.length, hasPii: piiCount > 0 };
}

// Column grid: Name | Type | Status | Size | First Seen | Last Scanned | Scan Type
// col widths:   1fr   70px   130px   90px   100px         110px          100px
const GRID = 'grid-cols-[1fr_70px_130px_90px_100px_110px_100px]';

// ── Main component ────────────────────────────────────────────────────────────

export default function ConnectorPreviewUI({
    items, selectedIds, onToggleSelection, scanningIds, scanResults, onOpenFile,
    connectorType = 'Google Drive', catalogData, lastSession,
    piiActions = {}, fileTagVisibility = {}, onTagFile, onIgnoreFile, onSetTagVisibility
}: Props) {
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
        { id: null, name: `${connectorType} Root` }
    ]);
    const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

    const [incrementalOnly, setIncrementalOnly] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    function handleSort(key: SortKey) {
        if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    }

    function navigateInto(folderId: string, folderName: string) {
        setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
    }

    function navigateTo(index: number) {
        setBreadcrumbs(prev => prev.slice(0, index + 1));
    }

    const currentItems = useMemo(() => {
        return items.filter(item => {
            if (currentFolderId === null) return !item.path.includes('/');
            const folderItem = items.find(i => i.id === currentFolderId);
            if (!folderItem) return false;
            const prefix = folderItem.path + '/';
            return item.path.startsWith(prefix) &&
                item.path.indexOf('/', prefix.length) === -1;
        });
    }, [items, currentFolderId]);

    const filteredItems = useMemo(() => {
        if (!incrementalOnly) return currentItems;
        return currentItems.filter(item => {
            const state = getPiiState(item, catalogData, lastSession, scanResults);
            return state === 'new';
        });
    }, [currentItems, incrementalOnly, catalogData, lastSession, scanResults]);

    const sortedItems = useMemo(() => {
        const folders = filteredItems.filter(i => i.isFolder);
        const files = filteredItems.filter(i => !i.isFolder);

        function sortVal(item: DriveItem): string | number {
            const cat = catalogData?.find(c => c.file_id === item.id);
            switch (sortKey) {
                case 'name': return item.name.toLowerCase();
                case 'size': return item.sizeBytes || 0;
                case 'first_seen': return cat?.first_seen_at || '';
                case 'last_scanned': return cat?.last_scanned_at || '';
                case 'status': {
                    const s = getPiiState(item, catalogData, lastSession, scanResults);
                    return { pii: 0, clean: 1, new: 2, unscanned: 3 }[s];
                }
                default: return item.name.toLowerCase();
            }
        }

        const compare = (a: DriveItem, b: DriveItem) => {
            const av = sortVal(a), bv = sortVal(b);
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        };

        return [...folders.sort(compare), ...files.sort(compare)];
    }, [filteredItems, sortKey, sortDir, catalogData, lastSession, scanResults]);

    const fileCount = currentItems.filter(i => !i.isFolder).length;
    const newCount = currentItems.filter(i =>
        !i.isFolder && getPiiState(i, catalogData, lastSession, scanResults) === 'new'
    ).length;

    return (
        <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-[#0B1120] overflow-hidden flex flex-col shadow-inner" style={{ minHeight: 480, maxHeight: 640 }}>

            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shrink-0 gap-3">
                <nav className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                            <button
                                onClick={() => navigateTo(idx)}
                                className={`text-sm font-semibold transition-colors shrink-0 ${idx === breadcrumbs.length - 1
                                    ? 'text-slate-900 dark:text-white cursor-default'
                                    : 'text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
                                    }`}
                            >
                                {crumb.name}
                            </button>
                        </React.Fragment>
                    ))}
                </nav>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 font-mono">{fileCount} files</span>
                    {newCount > 0 && (
                        <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-700">
                            {newCount} new
                        </span>
                    )}
                    <button
                        onClick={() => setIncrementalOnly(v => !v)}
                        title="Show only newly discovered files"
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${incrementalOnly
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                            }`}
                    >
                        <Filter className="w-3 h-3" />
                        Incremental Only
                    </button>
                </div>
            </div>

            {/* ── Table header ─────────────────────────────────────────────── */}
            <div className={`sticky top-0 z-20 grid ${GRID} gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-[#0B1120]/95 backdrop-blur shrink-0`}>
                <SortHeader label="Name" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</div>
                <SortHeader label="Status" sortKey="status" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Size" sortKey="size" currentKey={sortKey} dir={sortDir} onSort={handleSort} className="justify-end" />
                <SortHeader label="First Seen" sortKey="first_seen" currentKey={sortKey} dir={sortDir} onSort={handleSort} className="justify-center" />
                <SortHeader label="Last Scanned" sortKey="last_scanned" currentKey={sortKey} dir={sortDir} onSort={handleSort} className="justify-center" />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">Scan Type</div>
            </div>

            {/* ── Table body ───────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
                {sortedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                        <Folder className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm">
                            {incrementalOnly ? 'No new files in this folder.' : 'No files found in this folder.'}
                        </p>
                        {incrementalOnly && (
                            <button onClick={() => setIncrementalOnly(false)} className="text-xs text-blue-500 hover:underline">
                                Show all files
                            </button>
                        )}
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {sortedItems.map(item => {
                            if (item.isFolder) {
                                return <FolderRow
                                    key={item.id}
                                    item={item}
                                    catalogData={catalogData}
                                    onNavigate={navigateInto}
                                />;
                            }
                            
                            const sr = scanResults.find(r => r.file_id === item.id);
                            const actionState = piiActions[item.id];
                            const needsTagPrompt = sr && sr.pii_detected && (sr.pii_count || 0) > 0 && actionState !== 'ignored' && actionState !== 'tagged';

                            return (
                                <React.Fragment key={item.id}>
                                    <FileRow
                                        item={item}
                                        isSelected={selectedIds.has(item.id)}
                                        isScanning={scanningIds.has(item.id)}
                                        onToggle={onToggleSelection}
                                        scanResult={sr}
                                        catalogData={catalogData}
                                        lastSession={lastSession}
                                        scanResults={scanResults}
                                        onOpenFile={onOpenFile}
                                    />
                                    {needsTagPrompt && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="ml-8 mr-4 mb-2 p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-200 font-medium">
                                                    <Tag className="w-4 h-4 text-blue-500" />
                                                    <span>Found {sr.pii_count} PII entities. Tag this file in Drive?</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onOpenFile(item.id); }}
                                                        className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 text-xs font-semibold rounded-md shadow-sm transition-all flex items-center gap-1 mr-2"
                                                    >
                                                        <Maximize2 className="w-3 h-3" />
                                                        View Analysis
                                                    </button>
                                                    <select
                                                        value={fileTagVisibility[item.id] || 'api_only'}
                                                        onChange={(e) => onSetTagVisibility && onSetTagVisibility(item.id, e.target.value as any)}
                                                        className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
                                                    >
                                                        <option value="api_only">API Only (Hidden)</option>
                                                        <option value="api_and_human">Visible Description</option>
                                                    </select>
                                                    <button
                                                        onClick={() => onTagFile && onTagFile(item.id)}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
                                                    >
                                                        Apply Tag
                                                    </button>
                                                    <button
                                                        onClick={() => onIgnoreFile && onIgnoreFile(item.id)}
                                                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md transition-colors"
                                                    >
                                                        Ignore
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

// ── Folder Row ────────────────────────────────────────────────────────────────

function FolderRow({
    item, catalogData, onNavigate
}: {
    item: DriveItem;
    catalogData?: FileCatalogEntry[];
    onNavigate: (id: string, name: string) => void;
}) {
    const { piiCount, childCount, hasPii } = getFolderAggregate(item, catalogData);

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => onNavigate(item.id, item.name)}
            className={`grid ${GRID} gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors group items-center`}
        >
            {/* Name */}
            <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-slate-600">
                    <Folder className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{childCount > 0 ? `${childCount} files inside` : 'Open to explore'}</p>
                </div>
            </div>

            {/* Type */}
            <div className="text-xs text-slate-400">Folder</div>

            {/* Status */}
            <div className="flex items-center">
                {hasPii ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:border-rose-500/30">
                        <AlertCircle className="w-3 h-3" />PII: {piiCount}
                    </span>
                ) : (
                    <span className="text-[10px] text-slate-400 italic">Folder</span>
                )}
            </div>

            {/* Size — N/A */}
            <div className="text-right text-xs text-slate-400">—</div>
            {/* First Seen — N/A */}
            <div className="text-center text-xs text-slate-400">—</div>
            {/* Last Scanned — N/A */}
            <div className="text-center text-xs text-slate-400">—</div>

            {/* Scan Type */}
            <div className="flex items-center justify-center">
                <span className="text-[10px] text-slate-400">—</span>
            </div>
        </motion.div>
    );
}

// ── File Row ──────────────────────────────────────────────────────────────────

function getFileIcon(item: DriveItem, cls = 'w-4 h-4') {
    const mt = item.mediaType;
    if (mt === 'image') return <ImageIcon className={`text-blue-400 ${cls}`} />;
    if (mt === 'video') return <Video className={`text-purple-400 ${cls}`} />;
    if (mt === 'audio') return <Music className={`text-green-400 ${cls}`} />;
    if (item.ext === 'pdf') return <FileText className={`text-red-400 ${cls}`} />;
    return <FileText className={`text-slate-500 ${cls}`} />;
}

function FileRow({
    item, isSelected, isScanning, onToggle, scanResult,
    catalogData, lastSession, scanResults, onOpenFile
}: {
    item: DriveItem;
    isSelected: boolean;
    isScanning: boolean;       // this specific file is currently scanning
    onToggle: (id: string) => void;
    scanResult?: DriveFileScanResult;
    catalogData?: FileCatalogEntry[];
    lastSession?: any;
    scanResults: DriveFileScanResult[];
    onOpenFile: (id: string) => void;
}) {
    const cat = catalogData?.find(c => c.file_id === item.id);
    const state = getPiiState(item, catalogData, lastSession, scanResults);

    const rowBg = isScanning
        ? 'bg-blue-50/40 dark:bg-blue-900/10'
        : !item.parseable
            ? 'opacity-50 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/50'
            : isSelected
                ? 'bg-blue-50/60 dark:bg-blue-900/20 cursor-pointer'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer';

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => scanResult ? onOpenFile(item.id) : (!isScanning && item.parseable && onToggle(item.id))}
            className={`grid ${GRID} gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/50 transition-colors items-center ${rowBg}`}
        >
            {/* Name + icon */}
            <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
                        {getFileIcon(item)}
                    </div>
                    {isSelected && !scanResult && !isScanning && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 border border-white dark:border-slate-900 flex items-center justify-center">
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                    </p>
                    {cat?.full_path && (
                        <p className="text-[10px] text-slate-400 truncate" title={cat.full_path}>
                            {cat.full_path}
                        </p>
                    )}
                </div>
            </div>

            {/* Type */}
            <div className="text-xs text-slate-400 uppercase font-mono">{item.ext || '—'}</div>

            {/* Status */}
            <div className="flex items-center">
                {isScanning ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                        <Loader2 className="w-3 h-3 animate-spin" />Scanning
                    </span>
                ) : !item.parseable ? (
                    <span className="text-xs font-medium text-slate-400">Unsupported</span>
                ) : (
                    <PiiBadge state={state} />
                )}
            </div>

            {/* Size */}
            <div className="text-right">
                <span className="text-xs text-slate-500 font-mono">
                    {formatBytes(cat?.file_size_bytes || item.sizeBytes)}
                </span>
            </div>

            {/* First Seen */}
            <div className="text-center">
                <span className="text-[10px] text-slate-400 font-mono">{formatDate(cat?.first_seen_at)}</span>
            </div>

            {/* Last Scanned */}
            <div className="text-center">
                <span className="text-[10px] text-slate-400 font-mono">{formatDate(cat?.last_scanned_at)}</span>
            </div>

            {/* Scan Type */}
            <div className="flex items-center justify-center shrink-0">
                {isScanning ? (
                    <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[9px] text-blue-500 font-mono">scanning</span>
                    </div>
                ) : cat?.scan_type === 'incremental' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                        Incremental
                    </span>
                ) : cat?.scan_type === 'external' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        External
                    </span>
                ) : isSelected && !scanResult ? (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                ) : item.parseable && !scanResult ? (
                    <span className="text-[10px] text-slate-400">Select</span>
                ) : (
                    <span className="text-[10px] text-slate-400">—</span>
                )}
            </div>
        </motion.div>
    );
}
