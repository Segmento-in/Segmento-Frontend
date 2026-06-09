'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud, Folder, CheckCircle2, XCircle, ChevronRight, Search, Play, Tag,
    AlertCircle, Loader2, RefreshCw, Key, ArrowLeft,
    ShieldAlert, ShieldCheck, Files, Sparkles, BarChart3, Download
} from 'lucide-react';

import { apiClient, EvaluatorModel, DriveItem, DriveFileScanResult, FileCatalogEntry } from '@/lib/apiClient';
import ConnectorPreviewUI from '../ConnectorPreviewUI';
import DocumentViewerModal from '../DocumentViewerModal';

interface Props {
    modelCatalogue: EvaluatorModel[];
    onStepChange?: (step: Step) => void;
}

type Step = 'AUTH' | 'BROWSE' | 'CONFIG' | 'RESULTS';

// ── Dashboard Stat Card ────────
function DashboardStatCard({ label, value, valueColor = 'text-slate-800' }: {
    label: string;
    value: number | string;
    valueColor?: string;
}) {
    return (
        <div className="flex flex-col justify-center px-6 py-5 cursor-default select-none">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">{label}</p>
            <p className={`text-4xl font-light leading-none tracking-tight ${valueColor}`}>{value}</p>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DriveScanTab({ modelCatalogue, onStepChange }: Props) {
    const [step, setStep] = useState<Step>('AUTH');

    const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
    const [error, setError] = useState<string | null>(null);

    // --- State: Auth ---
    const [authType, setAuthType] = useState<'service_account' | 'oauth2_token'>('service_account');
    const [credentials, setCredentials] = useState<Record<string, unknown> | null>(null);
    const [saFileName, setSaFileName] = useState<string | null>(null);
    const [oauthToken, setOauthToken] = useState('');

    // --- State: Browse ---
    const [folderInput, setFolderInput] = useState('');
    const [isBrowsing, setIsBrowsing] = useState(false);
    const [items, setItems] = useState<DriveItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [catalogData, setCatalogData] = useState<FileCatalogEntry[]>([]);
    const [lastSession, setLastSession] = useState<any>(null);

    // All available model keys — run every model on every scan (no user selection)
    const ALL_MODEL_KEYS = ['ensemble', 'regex', 'nltk', 'spacy', 'presidio', 'gliner', 'deberta', 'pasteproof', 'piiranha', 'nvidia_gliner', 'mmbert'];

    // --- State: Scan & Results ---
    const [scanningIds, setScanningIds] = useState<Set<string>>(new Set()); // per-file inline spinner
    const [scanResults, setScanResults] = useState<DriveFileScanResult[]>([]);

    // --- State: Per-file PII tag actions ---
    // 'pending' = show tag prompt | 'tagged' = tagged | 'ignored' = dismissed
    const [piiActions, setPiiActions] = useState<Record<string, 'pending' | 'tagged' | 'ignored'>>({});
    const [tagVisibility, setTagVisibility] = useState<Record<string, 'api_only' | 'api_and_human'>>({});

    // --- State: Document Viewer Modal ---
    const [viewerFileId, setViewerFileId] = useState<string | null>(null);

    // --- State: Filter tabs (BROWSE/RESULTS step) ---
    type FilterMode = 'all' | 'pii' | 'clean' | 'incremental' | 'unscanned';
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    // --- State: RESULTS search ---
    const [resultSearch, setResultSearch] = useState('');

    // --- Computed stats (live, updates as scanResults stream in) ---
    const stats = useMemo(() => {
        const fileItems = items.filter(i => !i.isFolder);
        const total = fileItems.length;
        const piiFromScan = scanResults.filter(r => r.pii_detected).length;
        const cleanFromScan = scanResults.filter(r => !r.pii_detected && !r.error).length;
        const totalPiiEntities = scanResults.reduce((s, r) => s + (r.pii_count || 0), 0);
        // Files not yet in any scan result
        const scannedIds = new Set(scanResults.map(r => r.file_id));
        const piiFromCatalog = fileItems.filter(i => {
            if (scannedIds.has(i.id)) return false;
            const cat = catalogData.find(c => c.file_id === i.id);
            return cat?.scan_status === 'pii_found' || i.appProperties?.segmento_pii_detected === 'true' || i.appProperties?.segmento_pii_detected === true;
        }).length;
        const cleanFromCatalog = fileItems.filter(i => {
            if (scannedIds.has(i.id)) return false;
            const cat = catalogData.find(c => c.file_id === i.id);
            return cat?.scan_status === 'clean' || i.appProperties?.segmento_pii_detected === 'false' || i.appProperties?.segmento_pii_detected === false;
        }).length;
        const piiFiles = piiFromScan + piiFromCatalog;
        const cleanFiles = cleanFromScan + cleanFromCatalog;
        // New = not in catalog at all, or added after last session
        const newFiles = fileItems.filter(i => {
            if (scannedIds.has(i.id)) return false;
            const cat = catalogData.find(c => c.file_id === i.id);
            const tag = i.appProperties?.segmento_pii_detected;
            if (tag === 'true' || tag === true || tag === 'false' || tag === false) return false;
            if (cat?.scan_status === 'pii_found' || cat?.scan_status === 'clean') return false;
            if (!lastSession) return true;
            if (cat?.first_seen_at) {
                return new Date(cat.first_seen_at).getTime() > new Date(lastSession.triggered_at).getTime();
            }
            return !cat;
        }).length;
        const unscannedFiles = Math.max(0, total - piiFiles - cleanFiles - newFiles);
        return { total, piiFiles, cleanFiles, newFiles, unscannedFiles, totalPiiEntities };
    }, [items, catalogData, lastSession, scanResults]);

    // ==================== HANDLERS ====================

    const handleSAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                setCredentials(json);
                setSaFileName(file.name);
                setError(null);
            } catch (err) {
                setError("Invalid JSON file.");
                setCredentials(null);
            }
        };
        reader.readAsText(file);
    };

    const handleOauthSubmit = () => {
        if (!oauthToken.trim()) {
            setError("Please enter a valid OAuth2 Access Token.");
            return;
        }
        setCredentials({ access_token: oauthToken.trim() });
        setError(null);
    };

    const handleBrowse = async () => {
        if (!folderInput.trim()) {
            setError("Please enter a folder ID or URL.");
            return;
        }
        if (!credentials) {
            setError("Missing credentials.");
            return;
        }

        setIsBrowsing(true);
        setError(null);
        try {
            const [res, catalogRes] = await Promise.all([
                apiClient.driveFolderBrowse(authType, credentials, folderInput),
                apiClient.getFileCatalog('google_drive', 'default_uid')
            ]);
            setItems(res.items);
            setCatalogData(catalogRes.files || []);
            setLastSession(catalogRes.last_session || null);
            changeStep('BROWSE');
        } catch (err: any) {
            setError(err.message || "Failed to browse folder.");
        } finally {
            setIsBrowsing(false);
        }
    };

    const toggleSelection = (id: string) => {
        const newSel = new Set(selectedIds);
        if (newSel.has(id)) newSel.delete(id);
        else newSel.add(id);
        setSelectedIds(newSel);
    };

    const selectAllParseable = () => {
        const newSel = new Set<string>();
        items.forEach(item => {
            const isAlreadyScanned = item.appProperties?.segmento_pii_detected === 'true' || item.appProperties?.segmento_pii_detected === true;
            if (!item.isFolder && item.parseable && !isAlreadyScanned) newSel.add(item.id);
        });

        if (newSel.size === selectedIds.size) {
            setSelectedIds(new Set<string>()); // Toggle off
        } else {
            setSelectedIds(newSel);
        }
    };

    // toggleModel removed — all models run by default

    const handleScan = async () => {
        if (selectedIds.size === 0 || !credentials) return;

        const filesToScan = items
            .filter(i => selectedIds.has(i.id))
            .map(i => ({ id: i.id, name: i.name, mimeType: i.mimeType }));

        // Mark every selected file as "scanning" so inline spinners appear
        setScanningIds(new Set(selectedIds));
        changeStep('RESULTS');
        setError(null);
        setScanResults([]);
        setPiiActions({});
        setTagVisibility({});

        try {
            const res = await apiClient.driveFolderScan(
                authType,
                credentials,
                filesToScan,
                ALL_MODEL_KEYS
            );

            setScanResults(res.results);
            setScanningIds(new Set()); // clear all inline spinners

            // Refresh catalog after scan so badges update from DB
            try {
                const catalogRes = await apiClient.getFileCatalog('google_drive', 'default_uid');
                setCatalogData(catalogRes.files || []);
                setLastSession(catalogRes.last_session || null);
            } catch {
                // non-fatal — live scan results still show correct badges
            }

        } catch (err: any) {
            setScanningIds(new Set()); // clear spinners on error too
            setError(err.message || "Scan failed.");
            changeStep('BROWSE');
        }
    };


    // Per-file inline tagging handler
    const handlePerFileTag = async (fileId: string) => {
        if (!credentials) return;
        const result = scanResults.find(r => r.file_id === fileId);
        if (!result) return;
        const vis = tagVisibility[fileId] ?? 'api_only';
        const human = vis === 'api_and_human';
        try {
            await apiClient.driveTagFiles(authType, credentials,
                [{ file_id: fileId, pii_detected: result.pii_detected, pii_count: result.pii_count }],
                human
            );
            setPiiActions(prev => ({ ...prev, [fileId]: 'tagged' }));
        } catch {
            // silently fail — badge stays pending so user can retry
        }
    };

    const handleOpenFile = (fileId: string) => {
        setViewerFileId(fileId);
    };

    // ==================== RENDER ====================

    return (
        <div className="flex flex-col flex-1 min-h-0 h-full">
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 dark:bg-red-900/20 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* 1. AUTHENTICATION */}
                {step === 'AUTH' && (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="p-6 bg-white dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <Cloud className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Connect Google Drive</h2>
                        </div>

                        <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit">
                            <button
                                onClick={() => setAuthType('service_account')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${authType === 'service_account' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Service Account JSON
                            </button>
                            <button
                                onClick={() => setAuthType('oauth2_token')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${authType === 'oauth2_token' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                OAuth2 Token
                            </button>
                        </div>

                        {authType === 'service_account' && (
                            <div className="space-y-4 max-w-md">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Upload JSON Key
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleSAUpload}
                                        className="hidden"
                                        id="sa-upload"
                                    />
                                    <label
                                        htmlFor="sa-upload"
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer transition-colors text-sm font-medium"
                                    >
                                        <Key className="w-4 h-4" />
                                        Choose File
                                    </label>
                                    {saFileName && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {saFileName} loaded</span>}
                                </div>
                                <p className="text-xs text-slate-500">Requires a Google Cloud Service Account with Drive API access.</p>
                            </div>
                        )}

                        {authType === 'oauth2_token' && (
                            <div className="space-y-4 max-w-md">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Access Token
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={oauthToken}
                                        onChange={(e) => setOauthToken(e.target.value)}
                                        placeholder="ya29.a0Ael9sF..."
                                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={handleOauthSubmit}
                                        className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {credentials?.access_token != null && <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Token applied</p>}
                            </div>
                        )}

                        {credentials && (
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 max-w-xl">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Target Folder URL or ID
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Folder className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={folderInput}
                                            onChange={(e) => setFolderInput(e.target.value)}
                                            placeholder="e.g. 1A2b3C4d5E6f7G8h9I0j"
                                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleBrowse}
                                        disabled={isBrowsing || !folderInput.trim()}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isBrowsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                        Browse
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* 2. BROWSE & CONFIG */}
                {step === 'BROWSE' && (
                    <motion.div key="browse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col flex-1 min-h-0">

                        {/* Stat Cards Row ─ horizontal KPI strip */}
                        <div className="grid grid-cols-4 divide-x divide-slate-200 border-b border-slate-200 bg-white shrink-0">
                            <DashboardStatCard label="Total Files" value={stats.total} />
                            <DashboardStatCard label="PII Found" value={stats.piiFiles} valueColor="text-rose-600" />
                            <DashboardStatCard label="Clean" value={stats.cleanFiles} valueColor="text-emerald-600" />
                            <DashboardStatCard label="New Files" value={stats.newFiles} valueColor="text-blue-600" />
                        </div>

                        {/* Filter tabs */}
                        <div className="flex items-center border-b border-slate-200 px-6 shrink-0">
                            <div className="flex items-center gap-8">
                                {([
                                    { key: 'all',         label: 'All' },
                                    { key: 'pii',         label: 'PII Found' },
                                    { key: 'clean',       label: 'Clean' },
                                    { key: 'incremental', label: 'Incremental' },
                                    { key: 'unscanned',   label: 'Unscanned' },
                                ] as { key: FilterMode; label: string }[]).map(tab => (
                                    <button key={tab.key} onClick={() => setFilterMode(tab.key)}
                                        className={`pb-3 pt-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${filterMode === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="flex items-center justify-between px-6 py-3 shrink-0 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-lg w-64 border border-slate-200/50">
                                    <Search className="w-4 h-4 text-slate-400" />
                                    <input type="text" placeholder="Search" className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <button onClick={handleBrowse} disabled={isBrowsing} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-50 transition-colors px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 bg-white shadow-sm">
                                    <RefreshCw className={`w-4 h-4 ${isBrowsing ? 'animate-spin' : ''}`} />Refresh
                                </button>
                                <button onClick={selectAllParseable} className="flex items-center gap-2 text-sm font-semibold text-white transition-colors px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm whitespace-nowrap">
                                    <CheckCircle2 className="w-4 h-4" /> Select All Parsable
                                </button>
                            </div>
                        </div>

                        {/* File table — flex-1 so it fills remaining height */}
                        <ConnectorPreviewUI
                            items={items} selectedIds={selectedIds} onToggleSelection={toggleSelection}
                            scanningIds={scanningIds} scanResults={scanResults} onOpenFile={handleOpenFile}
                            connectorType="Google Drive" catalogData={catalogData} lastSession={lastSession}
                            piiActions={piiActions} fileTagVisibility={tagVisibility} onTagFile={handlePerFileTag}
                            onIgnoreFile={(id) => setPiiActions(prev => ({ ...prev, [id]: 'ignored' }))}
                            onSetTagVisibility={(id, v) => setTagVisibility(prev => ({ ...prev, [id]: v }))}
                            filterMode={filterMode}
                            className="flex-1 min-h-0"
                        />
                    </motion.div>
                )}


                {/* 3. SCANNING & RESULTS */}
                {step === 'RESULTS' && (
                    <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1 min-h-0">

                        {/* ── Premium Dashboard Header ─ shrink-0 */}
                        <div className="flex items-center justify-between gap-3 bg-white border-b border-slate-200 px-6 py-3 shadow-sm shrink-0">
                            {/* Left: back + title + count */}
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => { changeStep('BROWSE'); setScanResults([]); setFilterMode('all'); setResultSearch(''); }}
                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back
                                </button>
                                <div className="w-px h-5 bg-slate-200" />
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-slate-800">Scan Results</h2>
                                    <span className="text-xs font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full tabular-nums">
                                        {scanResults.length}
                                    </span>
                                </div>
                            </div>

                            {/* Center: inline search */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-lg w-56 border border-slate-200/60 flex-shrink-0">
                                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    value={resultSearch}
                                    onChange={e => setResultSearch(e.target.value)}
                                    placeholder="Search results…"
                                    className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
                                />
                            </div>

                            {/* Right: status badge + export */}
                            <div className="flex items-center gap-3 shrink-0">
                                {scanningIds.size > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        Scanning {scanningIds.size} file{scanningIds.size !== 1 ? 's' : ''}…
                                    </span>
                                ) : scanResults.length > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Scan Complete
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

                        {/* Stat Cards Row ─ shrink-0 */}
                        <div className="grid grid-cols-4 divide-x divide-slate-200 border-b border-slate-200 bg-white shrink-0">
                            <DashboardStatCard label="Files Scanned" value={scanResults.length} />
                            <DashboardStatCard label="PII Found" value={scanResults.filter(r => r.pii_detected).length} valueColor="text-rose-600" />
                            <DashboardStatCard label="Clean" value={scanResults.filter(r => !r.pii_detected && !r.error).length} valueColor="text-emerald-600" />
                            <DashboardStatCard label="Total PII" value={stats.totalPiiEntities} valueColor="text-amber-600" />
                        </div>

                        {/* Filter tabs ─ shrink-0 */}
                        <div className="flex items-center border-b border-slate-200 px-6 shrink-0">
                            <div className="flex items-center gap-8">
                                {([
                                    { key: 'all',   label: 'All Results' },
                                    { key: 'pii',   label: 'PII Found' },
                                    { key: 'clean', label: 'Clean' },
                                ] as { key: FilterMode; label: string }[]).map(tab => (
                                    <button key={tab.key} onClick={() => setFilterMode(tab.key)}
                                        className={`pb-3 pt-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${filterMode === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* File table — takes all remaining height */}
                        <ConnectorPreviewUI
                            items={items} selectedIds={selectedIds} onToggleSelection={toggleSelection}
                            scanningIds={scanningIds} scanResults={scanResults} onOpenFile={handleOpenFile}
                            connectorType="Google Drive" catalogData={catalogData} lastSession={lastSession}
                            piiActions={piiActions} fileTagVisibility={tagVisibility} onTagFile={handlePerFileTag}
                            onIgnoreFile={(id) => setPiiActions(prev => ({ ...prev, [id]: 'ignored' }))}
                            onSetTagVisibility={(id, v) => setTagVisibility(prev => ({ ...prev, [id]: v }))}
                            filterMode={filterMode} searchQuery={resultSearch}
                            className="flex-1 min-h-0"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating selection pill */}
            <AnimatePresence>
                {step === 'BROWSE' && selectedIds.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="flex items-center gap-4 bg-[#1E1E1E] text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700/60">
                            <span className="text-sm font-medium pl-1">Selected: {selectedIds.size}</span>
                            <div className="w-px h-4 bg-slate-600" />
                            <button onClick={handleScan} disabled={scanningIds.size > 0}
                                className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors disabled:opacity-50 whitespace-nowrap">
                                <Play className="w-3.5 h-3.5 fill-current" /> Run Scan
                            </button>
                            <button onClick={() => setSelectedIds(new Set())}
                                className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                <XCircle className="w-3.5 h-3.5" /> Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {viewerFileId && (
                <DocumentViewerModal
                    fileInfo={items.find(i => i.id === viewerFileId)!}
                    scanResult={scanResults.find(r => r.file_id === viewerFileId)!}
                    credentials={credentials}
                    authType={authType}
                    onClose={() => setViewerFileId(null)}
                />
            )}
        </div>
    );
}
