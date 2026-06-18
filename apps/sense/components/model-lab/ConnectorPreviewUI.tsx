'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Image as ImageIcon, Video, Music,
    CheckCircle2, AlertCircle, Maximize2, ShieldCheck,
    Folder, Tag, Sparkles, ChevronRight, ChevronDown, Filter, ArrowUpDown,
    ArrowUp, ArrowDown, Loader2, Database
} from 'lucide-react';
import { DriveItem, DriveFileScanResult, FileCatalogEntry, ConnectorResultRow, ConnectorResultDetail } from '@/lib/apiClient';

// ── Types ────────────────────────────────────────────────────────────────────

type PiiState = 'pii' | 'clean' | 'unscanned' | 'new';
// pii_count removed from sort keys (column removed)
type SortKey = 'name' | 'classification' | 'size' | 'first_seen' | 'last_scanned';
type SortDir = 'asc' | 'desc';

interface Props {
    items: DriveItem[];
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    scanningIds: Set<string>;
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
    filterMode?: 'all' | 'pii' | 'clean' | 'incremental' | 'unscanned';
    searchQuery?: string;
    className?: string;
    mode?: 'drive' | 'database';
    /**
     * When provided, render a flat read-only table of pre-mapped rows using the
     * shared ConnectorResultRow contract. Drive navigation, selection, and folder
     * browsing are all disabled. Cell content is rendered by renderResultCells()
     * — the same function FileRow calls — so column layout is always in sync.
     */
    rows?: ConnectorResultRow[];
    isMetadataScan?: boolean;
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
    if (cat?.classification === 'SENSITIVE') return 'pii';
    if (cat?.classification === 'NON-SENSITIVE') return 'clean';

    const tag = item.appProperties?.segmento_pii_detected;
    if (tag === 'true' || tag === true) return 'pii';
    if (tag === 'false' || tag === false) return 'clean';

    // If there is no previous session, then there are NO incremental files yet. 
    // All files are just 'unscanned'.
    if (!lastSession) return 'unscanned';

    if (cat?.first_seen_at) {
        const firstSeen = new Date(cat.first_seen_at).getTime();
        const lastScan = new Date(lastSession.triggered_at).getTime();
        if (firstSeen > lastScan) return 'new';
    }
    if (cat) return 'unscanned';
    return 'new'; // If it's not in catalog, and there IS a lastSession, it's new
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function PiiBadge({ state }: { state: PiiState }) {
    const configs: Record<PiiState, { cls: string; label: string }> = {
        pii: { cls: 'border-rose-200 text-rose-600', label: 'SENSITIVE' },
        clean: { cls: 'border-slate-200 text-slate-500', label: 'NON-SENSITIVE' },
        new: { cls: 'border-blue-200 text-blue-600', label: 'New' },
        unscanned: { cls: 'border-slate-200 text-slate-500', label: 'Unscanned' },
    };
    const { cls, label } = configs[state];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border bg-white ${cls}`}>
            {label}
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
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors ${className}`}
        >
            {label}
            {active && (dir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
        </button>
    );
}

// ── Folder aggregate ──────────────────────────────────────────────────────────

function getFolderAggregate(
    item: DriveItem,
    catalogData?: FileCatalogEntry[],
    scanResults?: DriveFileScanResult[]
): {
    piiCount: number; childCount: number; hasPii: boolean; totalSize: number; state: PiiState;
} {
    if (!catalogData) return { piiCount: 0, childCount: 0, hasPii: false, totalSize: 0, state: 'unscanned' };
    const children = catalogData.filter(c => c.parent_folder_id === item.id && !c.is_folder);
    const piiCount = children.reduce((s, c) => {
        const types = c.metadata?.pii_types;
        return s + (types ? Object.values(types).reduce((a, b) => a + b, 0) : 0);
    }, 0);
    const totalSize = children.reduce((s, c) => s + (c.file_size_bytes || 0), 0);

    // Check DB state
    const dbHasPii = piiCount > 0 || children.some(c => c.classification === 'SENSITIVE');
    const dbHasScanned = children.some(c => c.classification && c.classification !== 'unscanned');

    // Check Live state
    const liveResults = scanResults?.filter(r => children.some(c => c.file_id === r.file_id)) || [];
    const liveHasPii = liveResults.some(r => r.pii_detected);
    const liveHasScanned = liveResults.length > 0;

    const hasPii = dbHasPii || liveHasPii;
    const hasScannedFiles = dbHasScanned || liveHasScanned;

    let state: PiiState = 'unscanned';
    if (hasPii) {
        state = 'pii';
    } else if (children.length > 0 && hasScannedFiles) {
        state = 'clean';
    }

    return { piiCount, childCount: children.length, hasPii, totalSize, state };
}

// Column grid: Name | Type | Classification | Size | First Seen | Last Scanned | Scan Type
// col widths:   1fr   70px   130px   90px   100px  110px         100px
const GRID = 'grid-cols-[1fr_70px_130px_90px_100px_110px_100px]';

// Map ConnectorResultRow classification to PiiState for PiiBadge
function classificationToPiiState(cls: ConnectorResultRow['classification'], isScanning?: boolean): PiiState {
    if (isScanning) return 'unscanned'; // badge hidden behind spinner anyway
    switch (cls) {
        case 'SENSITIVE': return 'pii';
        case 'NON-SENSITIVE': return 'clean';
        case 'FOLDER': return 'clean';
        default: return 'unscanned';
    }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ConnectorPreviewUI({
    items, selectedIds, onToggleSelection, scanningIds, scanResults, onOpenFile,
    connectorType = 'Google Drive', catalogData, lastSession,
    piiActions = {}, fileTagVisibility = {}, onTagFile, onIgnoreFile, onSetTagVisibility,
    filterMode = 'all', searchQuery = '', className, mode = 'drive', rows, isMetadataScan,
}: Props) {
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
        { id: null, name: `${connectorType} Root` }
    ]);
    const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

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
        let base = currentItems;
        // Apply filter mode
        if (filterMode !== 'all') {
            base = base.filter(item => {
                if (item.isFolder) return true;
                const state = getPiiState(item, catalogData, lastSession, scanResults);
                switch (filterMode) {
                    case 'pii': return state === 'pii';
                    case 'clean': return state === 'clean';
                    case 'incremental': return state === 'new';
                    case 'unscanned': return state === 'unscanned';
                    default: return true;
                }
            });
        }
        // Apply search query
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            base = base.filter(item => item.name.toLowerCase().includes(q));
        }
        return base;
    }, [currentItems, filterMode, searchQuery, catalogData, lastSession, scanResults]);

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
                case 'classification': {
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

    // ── rows mode: flat read-only table (DB scan results) ──────────────────
    if (rows) {
        return (
            <div className={`relative bg-white flex flex-col border-t border-slate-200 ${className ?? 'h-[600px]'}`}>
                {/* Shared column headers — identical to Drive mode */}
                <div className={`sticky top-0 z-20 grid ${GRID} gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50/80 shrink-0`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classification</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Size</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">First Seen</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Last Scanned</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Scan Type</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                            <Database className="w-10 h-10 text-slate-300" />
                            <p className="text-sm">No results to display.</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {rows.map(row => <ResultRow key={row.id} row={row} isMetadataScan={isMetadataScan} />)}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`relative bg-white flex flex-col border-t border-slate-200 ${className ?? 'h-[600px]'}`}>

            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white shrink-0 gap-3">
                <nav className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
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
                </div>
            </div>

            {/* ── Table header ─────────────────────────────────────────────── */}
            <div className={`sticky top-0 z-20 grid ${GRID} gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50/80 shrink-0`}>
                {mode === 'database' ? (
                    // ── Database mode headers ──────────────────────────────
                    <>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Table Name</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DB Type</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classification</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Columns</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">First Seen</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Last Scanned</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Scan Type</div>
                    </>
                ) : (
                    // ── Drive mode headers (unchanged) ─────────────────────
                    <>
                        <SortHeader label="Name" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</div>
                        <SortHeader label="Classification" sortKey="classification" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                        <SortHeader label="Size" sortKey="size" currentKey={sortKey} dir={sortDir} onSort={handleSort} className="justify-end" />
                        <SortHeader label="First Seen" sortKey="first_seen" currentKey={sortKey} dir={sortDir} onSort={handleSort} className="justify-center" />
                        <SortHeader label="Last Scanned" sortKey="last_scanned" currentKey={sortKey} dir={sortDir} onSort={handleSort} className="justify-center" />
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Scan Type</div>
                    </>
                )}
            </div>

            {/* ── Table body ───────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
                {sortedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                        <Folder className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm">
                            {filterMode !== 'all' ? `No ${filterMode} files in this folder.` : 'No files found in this folder.'}
                        </p>
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
                                    scanResults={scanResults}
                                    mode={mode}
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
                                        mode={mode}
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
    item, catalogData, onNavigate, scanResults, mode = 'drive'
}: {
    item: DriveItem;
    catalogData?: FileCatalogEntry[];
    onNavigate: (id: string, name: string) => void;
    scanResults?: DriveFileScanResult[];
    mode?: 'drive' | 'database';
}) {
    const aggregate = getFolderAggregate(item, catalogData, scanResults);
    const { childCount } = aggregate;

    // DB mode: compute total column count from all child table metadata
    const totalColumns = mode === 'database'
        ? (catalogData?.filter(c => c.parent_folder_id === item.id && !c.is_folder)
            .reduce((s, c) => s + (c.metadata?.column_count || 0), 0) ?? 0)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => onNavigate(item.id, item.name)}
            className={`grid ${GRID} gap-2 px-4 py-2.5 border-b border-l-2 border-slate-100 dark:border-slate-800/50 border-l-transparent hover:border-l-blue-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-all group items-center`}
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
                    <p className="text-[10px] text-slate-400">
                        {mode === 'database'
                            ? (childCount > 0 ? `${childCount} table${childCount !== 1 ? 's' : ''}` : 'No tables scanned')
                            : (childCount > 0 ? `${childCount} files inside` : 'Open to explore')
                        }
                    </p>
                </div>
            </div>

            {/* Type */}
            <div className="text-xs text-slate-400">
                {mode === 'database' ? 'Database' : 'Folder'}
            </div>

            {/* Classification */}
            <div className="flex items-center">
                <PiiBadge state={aggregate.state} />
            </div>

            {/* Size (drive) / Columns (database) */}
            <div className="text-right">
                <span className="text-xs text-slate-500 font-mono">
                    {mode === 'database'
                        ? (totalColumns > 0 ? `${totalColumns} cols` : '—')
                        : (aggregate.totalSize > 0 ? formatBytes(aggregate.totalSize) : '—')
                    }
                </span>
            </div>

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

function getFileIcon(item: DriveItem | null, cls = 'w-4 h-4', itemType?: string): React.JSX.Element {
    if (itemType === 'Table') return <Database className={`text-violet-500 ${cls}`} />;
    if (itemType === 'Folder' || (item?.isFolder)) return <Folder className={`text-blue-500 fill-blue-500/20 ${cls}`} />;
    if (!item) return <FileText className={`text-slate-500 ${cls}`} />;
    const mt = item.mediaType;
    if (mt === 'image') return <ImageIcon className={`text-blue-400 ${cls}`} />;
    if (mt === 'video') return <Video className={`text-purple-400 ${cls}`} />;
    if (mt === 'audio') return <Music className={`text-green-400 ${cls}`} />;
    if (item.ext === 'pdf') return <FileText className={`text-red-400 ${cls}`} />;
    return <FileText className={`text-slate-500 ${cls}`} />;
}

function FileRow({
    item, isSelected, isScanning, onToggle, scanResult,
    catalogData, lastSession, scanResults, onOpenFile, mode = 'drive'
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
    mode?: 'drive' | 'database';
}) {
    const cat = catalogData?.find(c => c.file_id === item.id);
    const state = getPiiState(item, catalogData, lastSession, scanResults);

    const borderAccent = isScanning
        ? 'border-l-blue-400'
        : !item.parseable
            ? 'border-l-transparent'
            : isSelected
                ? 'border-l-blue-500'
                : 'border-l-transparent hover:border-l-blue-300';

    const rowBg = isScanning
        ? 'bg-blue-50/40 dark:bg-blue-900/10'
        : !item.parseable
            ? 'opacity-50 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/50'
            : isSelected
                ? 'bg-blue-50/50 dark:bg-blue-900/20 cursor-pointer'
                : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer';

    const isMetadataRow = cat?.metadata?.scan_mode === 'metadata_only';
    const flaggedColumns = cat?.metadata?.flagged_columns || [];
    const [expanded, setExpanded] = useState(false);

    const handleRowClick = () => {
        if (isMetadataRow) {
            setExpanded(!expanded);
            return;
        }
        if (scanResult) onOpenFile(item.id);
        else if (!isScanning && item.parseable) onToggle(item.id);
    };

    return (
        <motion.div className="flex flex-col border-b border-slate-100 dark:border-slate-800/50">
        <div
            onClick={handleRowClick}
            className={`grid ${GRID} gap-2 px-4 py-2.5 border-l-2 transition-all items-center ${rowBg} ${borderAccent}`}
        >
            {/* Name + icon — Drive-specific: includes selection dot overlay */}
            <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
                        {getFileIcon(item, 'w-4 h-4', item.isFolder ? 'Folder' : undefined)}
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
            {mode === 'database' ? (
                <div className="flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border bg-violet-50 border-violet-200 text-violet-700">
                        {(cat?.connector_type || item.mimeType || 'DB').toUpperCase()}
                    </span>
                </div>
            ) : (
                <div className="text-xs text-slate-400 uppercase font-mono">{item.ext || '—'}</div>
            )}

            {/* Classification — shared scanning-spinner affordance */}
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
                    {mode === 'database'
                        ? (cat?.metadata?.column_count != null ? `${cat.metadata.column_count} cols` : '—')
                        : formatBytes(cat?.file_size_bytes || item.sizeBytes)
                    }
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
                {mode === 'database' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-700 border border-blue-200">
                        Full Load
                    </span>
                ) : isScanning ? (
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
                ) : cat?.scan_type === 'FULL_LOAD' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-700 border border-blue-200">
                        Full Load
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
        </div>
        
        {/* ── Schema Map View for Metadata Scans ── */}
        <AnimatePresence>
            {expanded && isMetadataRow && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50"
                >
                    <div className="p-4 pl-12">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            Schema Map View (Zero Trust)
                        </div>
                        {flaggedColumns.length === 0 ? (
                            <div className="text-sm text-slate-500 italic bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                No PII indicators found in schema.
                            </div>
                        ) : (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold">Column Name</th>
                                            <th className="px-4 py-2 text-left font-semibold">Matched Rule</th>
                                            <th className="px-4 py-2 text-left font-semibold">Confidence</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                                        {flaggedColumns.map((col: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300 text-xs">{col.name}</td>
                                                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{col.matched_rule}</td>
                                                <td className="px-4 py-2.5">
                                                    {col.confidence === 'HIGH' ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-200">
                                                            Sensitive
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-600 border border-amber-200">
                                                            Review Required
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        </motion.div>
    );
}

// ── renderResultCells ─────────────────────────────────────────────────────────
// The single source of truth for what goes in each of the 7 cells of a
// ConnectorResultRow. Both FileRow (Drive) and ResultRow (DB) call this.
// Column order here MUST match the header order in the rows-mode header block
// and the Drive-mode header block — same GRID template, same column index.

function renderResultCells(row: ConnectorResultRow): React.JSX.Element[] {
    const piiState = classificationToPiiState(row.classification, row.isScanning);
    return [
        // [0] Name
        <div key="name" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 shrink-0">
                {getFileIcon(null, 'w-4 h-4', row.itemType)}
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{row.name}</p>
        </div>,

        // [1] Type
        <div key="type" className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border bg-violet-50 border-violet-200 text-violet-700">
                {row.itemType}
            </span>
        </div>,

        // [2] Classification
        <div key="cls" className="flex items-center">
            {row.isScanning ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    <Loader2 className="w-3 h-3 animate-spin" />Scanning
                </span>
            ) : row.classification === 'Unsupported' ? (
                <span className="text-xs font-medium text-slate-400">Unsupported</span>
            ) : (
                <PiiBadge state={piiState} />
            )}
        </div>,

        // [3] Size
        <div key="size" className="text-right">
            <span className="text-xs text-slate-500 font-mono">{row.sizeLabel ?? '—'}</span>
        </div>,

        // [4] First Seen
        <div key="first" className="text-center">
            <span className="text-[10px] text-slate-400 font-mono">{formatDate(row.firstSeen)}</span>
        </div>,

        // [5] Last Scanned
        <div key="last" className="text-center">
            <span className="text-[10px] text-slate-400 font-mono">{formatDate(row.lastScanned)}</span>
        </div>,

        // [6] Scan Type + optional expand chevron
        <div key="scan" className="flex items-center justify-center gap-1 shrink-0">
            <span className="text-[10px] text-slate-400">{row.scanType ?? '—'}</span>
        </div>,
    ];
}

// ── ResultRow — read-only DB result row —————————————————————————————————
// Renders the same 7 cells as FileRow via renderResultCells(),
// but wraps them in a non-interactive, non-selectable container.
// Includes an optional collapsible breakdown panel for rows with detail.

function ResultRow({ row, isMetadataScan }: { row: ConnectorResultRow, isMetadataScan?: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const hasDetail = !!(row.detail && row.detail.breakdown.length > 0);
    const isMetadataRow = isMetadataScan || row.metadata?.scan_mode === 'metadata_only';
    const flaggedColumns = row.metadata?.flagged_columns || [];
    
    // Determine what panel to show on click
    const isExpandable = hasDetail || isMetadataRow;

    return (
        <div className="flex flex-col border-b border-slate-100 dark:border-slate-800/50">
            <div
                onClick={() => isExpandable && setExpanded(!expanded)}
                className={`grid gap-2 px-4 py-2.5 border-l-2 transition-all items-center border-l-transparent ${row.isScanning ? 'bg-blue-50/30' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'} ${isExpandable ? 'cursor-pointer' : ''}`}
                style={{ gridTemplateColumns: hasDetail ? '1fr 70px 130px 90px 100px 110px 100px 28px' : undefined }}
            >
                {/* 7 shared cells */}
                <div className={`grid ${GRID} gap-2 col-span-full`}>
                    {renderResultCells(row)}
                </div>
            </div>
            {/* Expand chevron row */}
            {hasDetail && (
                <div className="border-b border-slate-100 dark:border-slate-800/50">
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="w-full flex items-center gap-1.5 px-4 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        {expanded ? 'Hide' : 'Show'} PII breakdown
                    </button>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 py-3 bg-red-50/40 flex flex-wrap gap-2">
                                    {row.detail!.breakdown.map(b => (
                                        <div
                                            key={b.label}
                                            className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs"
                                        >
                                            <span className="text-slate-600">{b.label}</span>
                                            <span className="font-bold text-red-600">{b.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            
            {/* ── Schema Map View for Metadata Scans ── */}
            {isMetadataRow && (
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50"
                        >
                            <div className="p-4 pl-12">
                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    Schema Map View (Zero Trust)
                                </div>
                                {flaggedColumns.length === 0 ? (
                                    <div className="text-sm text-slate-500 italic bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        No PII indicators found in schema.
                                    </div>
                                ) : (
                                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-semibold">Column Name</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Matched Rule</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Confidence</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                                                {flaggedColumns.map((col: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300 text-xs">{col.name}</td>
                                                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{col.matched_rule}</td>
                                                        <td className="px-4 py-2.5">
                                                            {col.confidence === 'HIGH' ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-200">
                                                                    Sensitive
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-600 border border-amber-200">
                                                                    Review Required
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

