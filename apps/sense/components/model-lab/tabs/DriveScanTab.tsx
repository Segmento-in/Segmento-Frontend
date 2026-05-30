'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud,
    Folder,
    FileText,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Search,
    Play,
    Tag,
    AlertCircle,
    Loader2,
    File,
    Image as ImageIcon,
    Video,
    Music,
    RefreshCw,
    Key,
    Lock
} from 'lucide-react';

import { apiClient, EvaluatorModel, DriveItem, DriveFileScanResult } from '@/lib/apiClient';
import ModelShowdown from '../ModelShowdown';

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
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    // --- State: Config ---
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set(['deberta', 'regex']));
    const [enableTagging, setEnableTagging] = useState(false);
    const [tagVisibility, setTagVisibility] = useState<'api_only' | 'api_and_human'>('api_only');

    // --- State: Scan & Results ---
    const [isScanning, setIsScanning] = useState(false);
    const [scanResults, setScanResults] = useState<DriveFileScanResult[]>([]);
    const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
    const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
    
    // --- State: Tagging ---
    const [isTagging, setIsTagging] = useState(false);
    const [tagStatuses, setTagStatuses] = useState<Record<string, { success: boolean; error: string | null }>>({});

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
            
            // Auto-expand root folders
            const rootIds = new Set<string>();
            res.items.filter(i => i.isFolder).forEach(f => rootIds.add(f.id));
            setExpandedFolders(rootIds);
            
            setStep('BROWSE');
        } catch (err: any) {
            setError(err.message || "Failed to browse folder.");
        } finally {
            setIsBrowsing(false);
        }
    };

    const toggleFolder = (id: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedFolders(newExpanded);
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
            if (!item.isFolder && item.parseable) newSel.add(item.id);
        });
        setSelectedIds(newSel);
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
            // We use the batch endpoint that does them sequentially to avoid OOM
            // We can simulate progress if we had SSE, but for now we rely on the backend 
            // returning all at once. In a real prod environment we'd chunk this or use websockets.
            // For now, we'll just show a loading state.
            
            // To simulate per-file progress for the UX, we'll chunk it frontend-side 
            // into batches of 1 if requested, but to save HTTP overhead we'll just send them all.
            // Actually, per the plan: "Sequential per-file scan — RAM safe on 16GB HF Spaces" is done in backend.
            // So we just await the single request.
            
            setScanProgress({ current: 0, total: filesToScan.length });
            
            const res = await apiClient.driveFolderScan(
                authType,
                credentials,
                filesToScan,
                Array.from(selectedModels)
            );
            
            setScanResults(res.results);
            setScanProgress({ current: filesToScan.length, total: filesToScan.length });
        } catch (err: any) {
            setError(err.message || "Scan failed.");
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
            
            const newStatuses: Record<string, {success: boolean, error: string|null}> = {};
            res.tagged.forEach(t => {
                newStatuses[t.file_id] = { success: t.success, error: t.error };
            });
            setTagStatuses(newStatuses);
        } catch (err: any) {
             setError(err.message || "Tagging failed.");
        } finally {
            setIsTagging(false);
        }
    };

    // ==================== RENDERERS ====================

    // Recursive tree renderer
    const renderTree = (parentId: string, depth = 0) => {
        // If parentId is the root folder itself (which we might not have in the list if we queried 'folderId in parents')
        // Actually, our API returns all items inside folder_id.
        // We need to group by parentId, but drive API list doesn't give us tree easily without manual mapping.
        // For simplicity, we just list files with their path.
        
        const sorted = [...items].sort((a, b) => a.path.localeCompare(b.path));
        
        return (
            <div className="space-y-1 mt-4 border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-50 dark:bg-slate-900/50 max-h-[400px] overflow-y-auto">
                {/* Legend */}
                <div className="flex flex-wrap gap-2 px-2 py-1.5 mb-1 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-red-400" /> Document</span>
                    <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3 text-blue-400" /> Image (OCR)</span>
                    <span className="flex items-center gap-1"><Video className="w-3 h-3 text-purple-400" /> Video (AI transcript)</span>
                    <span className="flex items-center gap-1"><Music className="w-3 h-3 text-green-400" /> Audio (AI transcript)</span>
                </div>
                {sorted.map(item => {
                    if (item.isFolder) return null;

                    const isSelected = selectedIds.has(item.id);
                    const canParse = item.parseable;

                    // Icon + badge based on mediaType
                    let fileIcon = <File className="w-4 h-4 text-slate-400" />;
                    let mediaBadge: React.ReactNode = null;
                    const mt = item.mediaType;
                    if (mt === 'image') {
                        fileIcon = <ImageIcon className="w-4 h-4 text-blue-400" />;
                        mediaBadge = canParse ? <span className="text-xs font-medium text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded">OCR</span> : null;
                    } else if (mt === 'video') {
                        fileIcon = <Video className="w-4 h-4 text-purple-400" />;
                        mediaBadge = canParse ? <span className="text-xs font-medium text-purple-600 dark:text-purple-400 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 rounded">Video AI</span> : null;
                    } else if (mt === 'audio') {
                        fileIcon = <Music className="w-4 h-4 text-green-400" />;
                        mediaBadge = canParse ? <span className="text-xs font-medium text-green-600 dark:text-green-400 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded">Audio AI</span> : null;
                    } else if (item.ext === 'pdf') {
                        fileIcon = <FileText className="w-4 h-4 text-red-400" />;
                    } else if (mt === 'document') {
                        fileIcon = <FileText className="w-4 h-4 text-slate-500" />;
                    }

                    return (
                        <div
                            key={item.id}
                            onClick={() => canParse && toggleSelection(item.id)}
                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                                !canParse ? 'opacity-50 cursor-not-allowed' :
                                isSelected ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <div className="flex-shrink-0 pt-0.5">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    isSelected
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}>
                                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                            </div>

                            {fileIcon}

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 truncate">{item.path} • {(item.sizeBytes / 1024).toFixed(1)} KB</p>
                            </div>

                            {canParse && mediaBadge}

                            {!canParse && (
                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded">
                                    {item.tooBig ? '> 50MB' : 'Unsupported'}
                                </span>
                            )}
                        </div>
                    );
                })}
                {items.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">No files found.</div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Cloud className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Drive Folder Scan</h2>
                    <p className="text-slate-500 dark:text-slate-400">Scan entire Google Drive folders securely in-memory.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Wizard Content */}
            <AnimatePresence mode="wait">
                
                {/* STEP 1: AUTH */}
                {step === 'AUTH' && (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm">1</span>
                            Connect to Google Drive
                        </h3>
                        
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6 w-fit">
                            <button
                                onClick={() => setAuthType('service_account')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${authType === 'service_account' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Service Account (JSON)
                            </button>
                            <button
                                onClick={() => setAuthType('oauth2_token')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${authType === 'oauth2_token' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                OAuth2 Token
                            </button>
                        </div>
                        
                        {authType === 'service_account' ? (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500">Upload your Google Cloud Service Account JSON key.</p>
                                <label className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <input type="file" accept=".json" className="hidden" onChange={handleSAUpload} />
                                    <Key className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {saFileName || "Click to upload JSON key"}
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500">Paste your OAuth2 Access Token. <br/>Note: You must generate this via Google OAuth Playground or gcloud CLI.</p>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={oauthToken}
                                        onChange={e => setOauthToken(e.target.value)}
                                        placeholder="ya29.a0..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-mono text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleOauthSubmit}
                                    disabled={!oauthToken.trim()}
                                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-colors"
                                >
                                    Confirm Token
                                </button>
                            </div>
                        )}
                        
                        {credentials && (
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Folder to Scan</h4>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={folderInput}
                                            onChange={e => setFolderInput(e.target.value)}
                                            placeholder="Paste Folder ID or full URL..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                                            onKeyDown={e => e.key === 'Enter' && handleBrowse()}
                                        />
                                    </div>
                                    <button
                                        onClick={handleBrowse}
                                        disabled={!folderInput.trim() || isBrowsing}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                                    >
                                        {isBrowsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                        Browse
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* STEP 2: BROWSE */}
                {step === 'BROWSE' && (
                    <motion.div
                        key="browse"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm">2</span>
                                Select Files
                            </h3>
                            <button onClick={() => setStep('AUTH')} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                Change Folder
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                            <button onClick={selectAllParseable} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Select All Parseable</button>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <button onClick={() => setSelectedIds(new Set())} className="text-sm text-slate-500 hover:underline">Clear</button>
                            
                            <div className="ml-auto text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                {selectedIds.size} selected
                            </div>
                        </div>
                        
                        {renderTree(folderInput)}
                        
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setStep('CONFIG')}
                                disabled={selectedIds.size === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                Continue to Config <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: CONFIG */}
                {step === 'CONFIG' && (
                    <motion.div
                        key="config"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm">3</span>
                                Configure Scan
                            </h3>
                            <button onClick={() => setStep('BROWSE')} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                Back to Files
                            </button>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Models</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                {modelCatalogue.map(model => (
                                    <div
                                        key={model.key}
                                        onClick={() => toggleModel(model.key)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedModels.has(model.key)
                                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                                                : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{model.label}</span>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                selectedModels.has(model.key) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                                {selectedModels.has(model.key) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500">{model.type} • {model.params}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-6">
                            <div className="flex flex-col gap-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div className="pt-1">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                            checked={enableTagging}
                                            onChange={e => setEnableTagging(e.target.checked)}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-emerald-500" />
                                            Enable Metadata Tagging
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Requires `drive.metadata` scope. A "Tag Files" button will appear after scanning.
                                        </p>
                                    </div>
                                </label>
                                
                                {enableTagging && (
                                    <div className="ml-7 pl-4 border-l-2 border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="tagVisibility"
                                                value="api_only"
                                                checked={tagVisibility === 'api_only'}
                                                onChange={() => setTagVisibility('api_only')}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                                <strong>API Only</strong> (Hidden appProperties - Secure)
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="tagVisibility"
                                                value="api_and_human"
                                                checked={tagVisibility === 'api_and_human'}
                                                onChange={() => setTagVisibility('api_and_human')}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                                <strong>API + Human Eye</strong> (Adds to file description for visibility)
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-6">
                            <button
                                onClick={handleScan}
                                disabled={selectedModels.size === 0}
                                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                Start Scan ({selectedIds.size} files, {selectedModels.size} models)
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: RESULTS */}
                {step === 'RESULTS' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {isScanning ? (
                            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Scanning Files...</h3>
                                <p className="text-slate-500">
                                    {scanProgress.total > 0 ? `Streaming in-memory safely. This may take a moment.` : `Initializing...`}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Summary Banner */}
                                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scan Complete</h3>
                                        <p className="text-slate-500">
                                            Scanned {scanResults.length} files • {scanResults.filter(r => r.pii_detected).length} contain PII • {scanResults.filter(r => r.error).length} errors
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setStep('BROWSE')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                            Scan More
                                        </button>
                                        
                                        {enableTagging && scanResults.length > 0 && (
                                            <button 
                                                onClick={handleTag}
                                                disabled={isTagging}
                                                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                {isTagging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                                                {isTagging ? 'Tagging...' : 'Tag PII in Drive'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Per-file results */}
                                <div className="space-y-4">
                                    {scanResults.map(res => (
                                        <div key={res.file_id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                            
                                            {/* Card Header */}
                                            <div 
                                                onClick={() => setExpandedResultId(expandedResultId === res.file_id ? null : res.file_id)}
                                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {res.pii_detected ? (
                                                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                                            <AlertCircle className="w-4 h-4" />
                                                        </div>
                                                    ) : res.error ? (
                                                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                                            <AlertCircle className="w-4 h-4" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">{res.file_name}</p>
                                                        <p className="text-xs text-slate-500">{res.mime_type} • {res.char_count.toLocaleString()} chars</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    {tagStatuses[res.file_id] && (
                                                        <span className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${
                                                            tagStatuses[res.file_id].success 
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                            : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                                        }`}>
                                                            <Tag className="w-3 h-3" />
                                                            {tagStatuses[res.file_id].success ? 'Tagged' : 'Tag Failed'}
                                                        </span>
                                                    )}
                                                
                                                    {res.error ? (
                                                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full">Error</span>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div className={`h-full ${res.pii_detected ? 'bg-red-500 w-full' : 'bg-emerald-500 w-full'}`} />
                                                            </div>
                                                            <span className={`text-sm font-bold w-16 text-right ${res.pii_detected ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                {res.pii_detected ? `${res.pii_count} PII` : 'Clean'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedResultId === res.file_id ? 'rotate-90' : ''}`} />
                                                </div>
                                            </div>
                                            
                                            {/* Card Body (Expanded) */}
                                            {expandedResultId === res.file_id && (
                                                <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-[#0F172A]">
                                                    {res.error ? (
                                                        <p className="text-amber-600 dark:text-amber-400 text-sm py-4">{res.error}</p>
                                                    ) : res.scan_data ? (
                                                        <ModelShowdown 
                                                            data={res.scan_data as any}
                                                            modelCatalogue={modelCatalogue}
                                                        />
                                                    ) : (
                                                        <p className="text-slate-500 text-sm py-4">No scan data available.</p>
                                                    )}
                                                </div>
                                            )}
                                            
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
