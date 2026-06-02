'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud, Folder, CheckCircle2, XCircle, ChevronRight, Search, Play, Tag,
    AlertCircle, Loader2, RefreshCw, Key, Lock, ArrowLeft
} from 'lucide-react';

import { apiClient, EvaluatorModel, DriveItem, DriveFileScanResult } from '@/lib/apiClient';
import ModelShowdown from '../ModelShowdown';
import ConnectorPreviewUI from '../ConnectorPreviewUI';
import DocumentViewerModal from '../DocumentViewerModal';

interface Props {
    modelCatalogue: EvaluatorModel[];
}

type Step = 'AUTH' | 'BROWSE' | 'CONFIG' | 'RESULTS';

export default function DriveScanTab({ modelCatalogue }: Props) {
    const [step, setStep] = useState<Step>('AUTH');
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

    // --- State: Config ---
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set(['deberta', 'regex']));
    const [enableTagging, setEnableTagging] = useState(false);
    const [tagVisibility, setTagVisibility] = useState<'api_only' | 'api_and_human'>('api_only');

    // --- State: Scan & Results ---
    const [isScanning, setIsScanning] = useState(false);
    const [scanResults, setScanResults] = useState<DriveFileScanResult[]>([]);

    // --- State: Tagging ---
    const [isTagging, setIsTagging] = useState(false);
    const [tagSuccess, setTagSuccess] = useState(false);
    const [tagStatuses, setTagStatuses] = useState<Record<string, { success: boolean; error: string | null }>>({});

    // --- State: Document Viewer Modal ---
    const [viewerFileId, setViewerFileId] = useState<string | null>(null);

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
            const res = await apiClient.driveFolderBrowse(authType, credentials, folderInput);
            setItems(res.items);
            setStep('BROWSE');
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

    const toggleModel = (key: string) => {
        const next = new Set(selectedModels);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        setSelectedModels(next);
    };

    const handleScan = async () => {
        if (selectedIds.size === 0 || selectedModels.size === 0 || !credentials) return;

        const filesToScan = items
            .filter(i => selectedIds.has(i.id))
            .map(i => ({ id: i.id, name: i.name, mimeType: i.mimeType }));

        setIsScanning(true);
        setStep('RESULTS');
        setError(null);
        setScanResults([]);
        setTagStatuses({});

        try {
            const res = await apiClient.driveFolderScan(
                authType,
                credentials,
                filesToScan,
                Array.from(selectedModels)
            );

            setScanResults(res.results);
        } catch (err: any) {
            setError(err.message || "Scan failed.");
            setStep('BROWSE'); // fallback
        } finally {
            setIsScanning(false);
        }
    };

    const handleTag = async () => {
        if (!credentials) return;

        const filesToTag = scanResults.map(r => ({
            file_id: r.file_id,
            pii_detected: r.pii_detected,
            pii_count: r.pii_count
        }));

        if (filesToTag.length === 0) return;

        setIsTagging(true);
        try {
            const res = await apiClient.driveTagFiles(authType, credentials, filesToTag, tagVisibility === 'api_and_human');

            const newStatuses: Record<string, { success: boolean, error: string | null }> = {};
            res.tagged.forEach(t => {
                newStatuses[t.file_id] = { success: t.success, error: t.error };
            });
            setTagStatuses(newStatuses);
            setTagSuccess(true);
            setTimeout(() => setTagSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Tagging failed.");
        } finally {
            setIsTagging(false);
        }
    };

    const getModelShowdownData = () => {
        const allData = scanResults.map(r => r.scan_data).filter(Boolean);
        if (allData.length === 0) return null;
        if (allData.length === 1) return allData[0];

        // Aggregate
        const per_model: Record<string, any> = {};
        let union_total = 0;
        let elapsed = 0;

        allData.forEach(d => {
            if (!d) return;
            union_total += d.union_total || 0;
            elapsed += d.elapsed || 0;
            Object.entries(d.per_model || {}).forEach(([modelKey, res]: [string, any]) => {
                if (!per_model[modelKey]) {
                    per_model[modelKey] = {
                        pii_count: 0,
                        accuracy: 0,
                        type_counts: {},
                        unique_count: 0,
                        missed_count: 0,
                        consensus_count: 0,
                        predictions: [],
                    };
                }
                const agg = per_model[modelKey];
                agg.pii_count += res.pii_count || 0;

                // Aggregate predictions and append file_name for autonomy
                const parentResult = scanResults.find(sr => sr.scan_data === d);
                if (res.predictions && Array.isArray(res.predictions)) {
                    const mappedPredictions = res.predictions.map((p: any) => ({
                        ...p,
                        file_name: parentResult?.file_name || 'Unknown File'
                    }));
                    agg.predictions.push(...mappedPredictions);
                }
                Object.entries(res.type_counts || {}).forEach(([k, v]: [string, any]) => {
                    agg.type_counts[k] = (agg.type_counts[k] || 0) + v;
                });
                agg.unique_count += res.unique_count || 0;
                agg.missed_count += res.missed_count || 0;
                agg.consensus_count += res.consensus_count || 0;
            });
        });

        Object.keys(per_model).forEach(k => {
            const accuracies = allData.map(d => d.per_model?.[k]?.accuracy || 0);
            per_model[k].accuracy = accuracies.reduce((a, b) => a + b, 0) / (accuracies.length || 1);
        });

        const ranked = Object.entries(per_model).map(([model_key, res]) => ({
            model_key,
            pii_count: res.pii_count,
            accuracy: res.accuracy,
            rank: 0
        })).sort((a, b) => {
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return b.pii_count - a.pii_count;
        }).map((r, i) => ({ ...r, rank: i + 1 }));

        return {
            per_model,
            ranked,
            union_total,
            elapsed
        };
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
                                {credentials?.access_token && <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Token applied</p>}
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
                        className="flex flex-col gap-6"
                    >
                        {/* Selected Models Configuration */}
                        <div className="p-4 bg-white dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Active Scanners</h3>
                            <div className="flex flex-wrap gap-2">
                                {modelCatalogue.map(model => (
                                    <button
                                        key={model.key}
                                        onClick={() => toggleModel(model.key)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${selectedModels.has(model.key)
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                                                : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${selectedModels.has(model.key) ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                        {model.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* File Explorer (Connector Preview) */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Select Assets to Scan</h3>
                                <button
                                    onClick={selectAllParseable}
                                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                >
                                    Select All Parseable
                                </button>
                            </div>

                            <ConnectorPreviewUI
                                items={items}
                                selectedIds={selectedIds}
                                onToggleSelection={toggleSelection}
                                isScanning={isScanning}
                                scanResults={scanResults}
                                onOpenFile={handleOpenFile}
                                connectorType="Google Drive"
                            />

                            <div className="flex items-center justify-between mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <span className="text-blue-600 dark:text-blue-400">{selectedIds.size}</span> items selected
                                </div>
                                <button
                                    onClick={handleScan}
                                    disabled={selectedIds.size === 0 || selectedModels.size === 0}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Run Scan Pipeline
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. SCANNING & RESULTS */}
                {step === 'RESULTS' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => { setStep('BROWSE'); setScanResults([]); }}
                                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scan Results</h2>
                        </div>

                        {!isScanning && scanResults.length > 0 && (
                            <div className="p-4 bg-white dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Model Performance (Across Scanned Files)</h3>
                                </div>
                                {getModelShowdownData() && (
                                    <ModelShowdown data={getModelShowdownData()} modelCatalogue={modelCatalogue} />
                                )}
                            </div>
                        )}

                        {/* File Explorer (Connector Preview) */}
                        <ConnectorPreviewUI
                            items={items.filter(i => selectedIds.has(i.id) || scanResults.some(r => r.file_id === i.id))} // show only selected/scanned
                            selectedIds={selectedIds}
                            onToggleSelection={toggleSelection}
                            isScanning={isScanning}
                            scanResults={scanResults}
                            onOpenFile={handleOpenFile}
                            connectorType="Google Drive"
                        />

                        {/* Tagging Action */}
                        {!isScanning && scanResults.length > 0 && (
                            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                        <Tag className="w-5 h-5" />
                                        Write Tags to Drive
                                    </h3>
                                    <p className="text-sm text-blue-700/80 dark:text-blue-200/70 mt-1 max-w-xl">
                                        Update the `appProperties` of the scanned files in Google Drive with the PII detection results. This allows third-party tools (like DLP systems) to enforce policies.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <select
                                        value={tagVisibility}
                                        onChange={(e) => setTagVisibility(e.target.value as any)}
                                        className="w-full px-3 py-2 bg-white dark:bg-[#0B1120] border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 outline-none"
                                    >
                                        <option value="api_only">API Properties (Hidden)</option>
                                        <option value="api_and_human">API + Description (Visible)</option>
                                    </select>

                                    <button
                                        onClick={handleTag}
                                        disabled={isTagging || tagSuccess}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${tagSuccess ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {isTagging ? <Loader2 className="w-4 h-4 animate-spin" /> : (tagSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />)}
                                        {isTagging ? 'Writing Tags...' : (tagSuccess ? 'Tags Enforced!' : 'Enforce Policies')}
                                    </button>
                                </div>
                            </div>
                        )}

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
