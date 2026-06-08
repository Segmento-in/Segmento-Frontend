'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud, Folder, CheckCircle2, XCircle, ChevronRight, Search, Play, Tag,
    AlertCircle, Loader2, RefreshCw, Key, ArrowLeft,
    ShieldAlert, ShieldCheck, Files, Sparkles, BarChart3
} from 'lucide-react';

import { apiClient, EvaluatorModel, DriveItem, DriveFileScanResult, FileCatalogEntry } from '@/lib/apiClient';
import ConnectorPreviewUI from '../ConnectorPreviewUI';
import DocumentViewerModal from '../DocumentViewerModal';

interface Props {
    modelCatalogue: EvaluatorModel[];
    onStepChange?: (step: Step) => void;
}

type Step = 'AUTH' | 'BROWSE' | 'CONFIG' | 'RESULTS';

// ── Stat Card (dashboard metric tile) ────────────────────────────────────────
function StatCard({ icon, label, value, sub, bg, highlight = false, highlightColor = 'text-slate-900' }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    sub: string;
    bg: string;
    highlight?: boolean;
    highlightColor?: string;
}) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className={`text-2xl font-black leading-none ${highlight ? highlightColor : 'text-slate-900 dark:text-white'}`}>{value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{sub}</p>
            </div>
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
        <div className="flex flex-col gap-6 p-4">
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
                    <motion.div
                        key="browse"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col gap-5"
                    >
                        {/* ── Stat Cards Row ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard icon={<Files className="w-4 h-4 text-slate-500" />} label="Total Files" value={stats.total} sub="in this folder" bg="bg-slate-100" />
                            <StatCard icon={<ShieldAlert className="w-4 h-4 text-rose-500" />} label="PII Found" value={stats.piiFiles} sub={stats.totalPiiEntities > 0 ? `${stats.totalPiiEntities} entities` : 'files with PII'} bg="bg-rose-50" highlight={stats.piiFiles > 0} highlightColor="text-rose-600" />
                            <StatCard icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} label="Clean" value={stats.cleanFiles} sub="no PII detected" bg="bg-emerald-50" />
                            <StatCard icon={<Sparkles className="w-4 h-4 text-blue-500" />} label="New Files" value={stats.newFiles} sub="since last scan" bg="bg-blue-50" />
                        </div>

                        {/* ── Detection engines banner ── */}
                        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                All {ALL_MODEL_KEYS.length} detection engines are active — Ensemble, DeBERTa, Presidio, SpaCy, GLiNER and more will run on every scan.
                            </p>
                        </div>

                        {/* ── Filter tabs + action buttons ── */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                {([
                                    { key: 'all',         label: 'All',        count: stats.total,         dot: 'bg-slate-400' },
                                    { key: 'pii',         label: 'PII Found',  count: stats.piiFiles,      dot: 'bg-rose-500' },
                                    { key: 'clean',       label: 'Clean',      count: stats.cleanFiles,    dot: 'bg-emerald-500' },
                                    { key: 'incremental', label: 'Incremental',count: stats.newFiles,      dot: 'bg-blue-500' },
                                    { key: 'unscanned',   label: 'Unscanned',  count: stats.unscannedFiles,dot: 'bg-slate-300' },
                                ] as { key: FilterMode; label: string; count: number; dot: string }[]).map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilterMode(tab.key)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                            filterMode === tab.key
                                                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${tab.dot} shrink-0`} />
                                        {tab.label}
                                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                                            filterMode === tab.key ? 'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-400'
                                        }`}>{tab.count}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={handleBrowse}
                                    disabled={isBrowsing}
                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 transition-all bg-white dark:bg-slate-800"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isBrowsing ? 'animate-spin' : ''}`} />
                                    Refresh Files
                                </button>
                                <button
                                    onClick={selectAllParseable}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all bg-white dark:bg-slate-800"
                                >
                                    Select All Parseable
                                </button>
                            </div>
                        </div>

                        {/* ── File table ── */}
                        <ConnectorPreviewUI
                            items={items}
                            selectedIds={selectedIds}
                            onToggleSelection={toggleSelection}
                            scanningIds={scanningIds}
                            scanResults={scanResults}
                            onOpenFile={handleOpenFile}
                            connectorType="Google Drive"
                            catalogData={catalogData}
                            lastSession={lastSession}
                            piiActions={piiActions}
                            fileTagVisibility={tagVisibility}
                            onTagFile={handlePerFileTag}
                            onIgnoreFile={(id) => setPiiActions(prev => ({ ...prev, [id]: 'ignored' }))}
                            onSetTagVisibility={(id, v) => setTagVisibility(prev => ({ ...prev, [id]: v }))}
                            filterMode={filterMode}
                        />

                        {/* ── Bottom action bar ── */}
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedIds.size}</span> items selected
                            </div>
                            <button
                                onClick={handleScan}
                                disabled={selectedIds.size === 0 || scanningIds.size > 0}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Run Scan Pipeline
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 3. SCANNING & RESULTS */}
                {step === 'RESULTS' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-5"
                    >
                        {/* ── Stat cards (live update as scan progresses) ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard icon={<Files className="w-4 h-4 text-slate-500" />} label="Files Scanned" value={scanResults.length} sub={`of ${selectedIds.size} queued`} bg="bg-slate-100" />
                            <StatCard icon={<ShieldAlert className="w-4 h-4 text-rose-500" />} label="PII Found" value={scanResults.filter(r => r.pii_detected).length} sub={stats.totalPiiEntities > 0 ? `${stats.totalPiiEntities} entities` : 'files with PII'} bg="bg-rose-50" highlight={scanResults.filter(r => r.pii_detected).length > 0} highlightColor="text-rose-600" />
                            <StatCard icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} label="Clean" value={scanResults.filter(r => !r.pii_detected && !r.error).length} sub="no PII detected" bg="bg-emerald-50" />
                            <StatCard icon={<BarChart3 className="w-4 h-4 text-amber-500" />} label="Total PII" value={stats.totalPiiEntities} sub="entities found" bg="bg-amber-50" highlight={stats.totalPiiEntities > 0} highlightColor="text-amber-600" />
                        </div>

                        {/* ── Filter tabs (same as BROWSE, for navigating results) ── */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                {([
                                    { key: 'all',   label: 'All Results', count: items.filter(i => !i.isFolder).length, dot: 'bg-slate-400' },
                                    { key: 'pii',   label: 'PII Found',   count: scanResults.filter(r => r.pii_detected).length, dot: 'bg-rose-500' },
                                    { key: 'clean', label: 'Clean',       count: scanResults.filter(r => !r.pii_detected && !r.error).length, dot: 'bg-emerald-500' },
                                ] as { key: FilterMode; label: string; count: number; dot: string }[]).map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilterMode(tab.key)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                            filterMode === tab.key
                                                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${tab.dot} shrink-0`} />
                                        {tab.label}
                                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                                            filterMode === tab.key ? 'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-400'
                                        }`}>{tab.count}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => { changeStep('BROWSE'); setScanResults([]); setFilterMode('all'); }}
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-700 transition-all bg-white dark:bg-slate-800"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to Browse
                            </button>
                        </div>

                        {/* ── File table ── */}
                        <ConnectorPreviewUI
                            items={items}
                            selectedIds={selectedIds}
                            onToggleSelection={toggleSelection}
                            scanningIds={scanningIds}
                            scanResults={scanResults}
                            onOpenFile={handleOpenFile}
                            connectorType="Google Drive"
                            catalogData={catalogData}
                            lastSession={lastSession}
                            piiActions={piiActions}
                            fileTagVisibility={tagVisibility}
                            onTagFile={handlePerFileTag}
                            onIgnoreFile={(id) => setPiiActions(prev => ({ ...prev, [id]: 'ignored' }))}
                            onSetTagVisibility={(id, v) => setTagVisibility(prev => ({ ...prev, [id]: v }))}
                            filterMode={filterMode}
                        />
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
