'use client';

import React, { useState } from 'react';
import { SourceSidebar, SourceConfig } from '@/components/pii-demo/SourceSidebar';
import { FileUpload } from '@/components/pii-demo/FileUpload';
import { ModelSelector } from '@/components/pii-demo/ModelSelector';
import { PIIAnalytics } from '@/components/pii-demo/PIIAnalytics';
import { Inspector } from '@/components/pii-demo/Inspector';
import { ChessLoadingAnimation } from '@/components/pii-demo/ChessLoadingAnimation';
import { DatabaseConnector } from '@/components/pii-demo/connectors/DatabaseConnector';
import { CloudStorageConnector } from '@/components/pii-demo/connectors/CloudStorageConnector';
import { SlackConnector } from '@/components/pii-demo/connectors/SlackConnector';
import { ConfluenceConnector } from '@/components/pii-demo/connectors/ConfluenceConnector';
import { GmailConnector } from '@/components/pii-demo/connectors/GmailConnector';
import { AnalysisResponse } from '@/lib/apiClient';

export default function PIIDemoPage() {
    const [sourceConfig, setSourceConfig] = useState<SourceConfig>({
        mainCategory: 'File System',
        source: 'File Upload',
        fileSubType: 'CSV',
        structType: 'Structured Data',
    });
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState('');
    const [isLightMode, setIsLightMode] = useState(false);
    const [selectedModels, setSelectedModels] = useState<string[]>(['regex','nltk','spacy','presidio','gliner','deberta']);

    const handleAnalysisComplete = (result: AnalysisResponse) => {
        setAnalysisResult(result);
        setError('');
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setAnalysisResult(null);
    };

    // --- Dynamic Glass Theme ---
    const theme = {
        card: "bg-white/80 dark:bg-[#0F111A]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-indigo-500/30 group",
        sidebar: "w-80 flex flex-col bg-slate-100 dark:bg-[#07080D] border-r border-slate-200 dark:border-white/10 transition-all duration-300 relative shrink-0",
        accentText: "bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 dark:from-indigo-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent animate-hue-rotate",
    };

    const renderMainContent = () => {
        if (sourceConfig.mainCategory === 'File System' && sourceConfig.fileSubType) {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className={theme.card}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                        Source: {sourceConfig.fileSubType}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-gray-500">Maximum payload: 1GB • Neural Scan enabled</p>
                                </div>
                            </div>
                        </div>
                        <FileUpload
                            fileType={sourceConfig.fileSubType}
                            selectedModels={selectedModels}
                            onAnalysisComplete={handleAnalysisComplete}
                            onLoading={setLoading}
                            onError={handleError}
                        />
                    </div>

                    {analysisResult && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-500">
                            <PIIAnalytics piiCounts={analysisResult.pii_counts} schema={analysisResult.schema} />
                            {analysisResult.inspector && <Inspector inspectorData={analysisResult.inspector} />}
                            
                            {(sourceConfig.fileSubType === 'PDF' || sourceConfig.fileSubType === 'Image (OCR)') && analysisResult.image && (
                                <div className={theme.card}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></div>
                                        <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-200">Rendered Document</h3>
                                    </div>
                                    <div className="flex justify-center bg-slate-100 dark:bg-black/50 p-4 rounded-xl border border-slate-200 dark:border-white/10">
                                        <img src={analysisResult.image} alt="Scanned Document" className="max-w-full h-auto rounded shadow-md" />
                                    </div>
                                </div>
                            )}

                            {analysisResult.data && analysisResult.data.length > 0 && (
                                <div className={theme.card}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                                        <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-200">Neural Fragments</h3>
                                    </div>
                                    <div className="overflow-x-auto custom-scrollbar rounded-xl">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-white/5">
                                                <tr>
                                                    {Object.keys(analysisResult.data[0]).map((key) => (
                                                        <th key={key} className="px-6 py-4 font-bold">{key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                                {analysisResult.data.slice(0, 50).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-indigo-500/5 transition-colors group/row">
                                                        {Object.values(row).map((value: any, cellIdx) => (
                                                            <td key={cellIdx} className="px-6 py-4 text-slate-600 dark:text-gray-400 group-hover/row:text-slate-900 dark:group-hover/row:text-white transition-colors" dangerouslySetInnerHTML={{ __html: String(value) }} />
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className={`${theme.card} flex flex-col items-center justify-center py-32`}>
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-indigo-500/20">
                    <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Connecting to {sourceConfig.source}</h2>
                <p className="text-slate-500 dark:text-gray-500">Initializing secure tunnel via Sentry-V4 Protocol...</p>
            </div>
        );
    };

    return (
        <div className={`${isLightMode ? '' : 'dark'} font-sans`}>
        <div className="flex h-screen w-full bg-slate-50 dark:bg-[#05060B] text-slate-900 dark:text-gray-100 overflow-hidden font-sans">
            {/* 1. SIDEBAR - Issue badge removed and content adjusted */}
            <aside className={theme.sidebar}>
                {/* Brand / Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-slate-200 dark:border-white/5 shrink-0 relative z-10 bg-slate-200/50 dark:bg-black/40">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <span className="text-lg font-black tracking-tighter uppercase italic">Sentry <span className="text-indigo-500 not-italic">AI</span></span>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 sidebar-content">
                    <div className="animate-in fade-in duration-700">
                        <SourceSidebar onSourceChange={setSourceConfig} />
                    </div>
                    {/* Model Selector Panel */}
                    <div className="animate-in fade-in duration-1000">
                        <ModelSelector onChange={setSelectedModels} />
                    </div>
                </div>

                {/* Simplified Footer Status */}
                <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-100/80 dark:bg-black/60">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                            <span>v4.2.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-emerald-500">System Online</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT - Gap removed, flush with sidebar */}
            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative bg-slate-50 dark:bg-[#05060B] bg-center dark:[background-image:radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:40px_40px]">
                {/* Navbar Spacer */}
                <div className="absolute top-24 right-12 z-[100]">
                    <button 
                        onClick={() => setIsLightMode(!isLightMode)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1A1A1A] border border-slate-300 dark:border-[#3E2F5B]/50 text-slate-900 dark:text-white text-sm font-bold hover:scale-105 transition-transform shadow-lg cursor-pointer pointer-events-auto"
                    >
                        {isLightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                </div>
                <div className="h-20 w-full" />
                
                {/* Content Container - No horizontal margin on container, padding handles spacing */}
                <div className="max-w-6xl mx-auto px-12 py-12 relative">
                    <div className="mb-16">
                        
                        <h1 className={`text-6xl font-black mb-6 tracking-tighter ${theme.accentText}`}>
                            Classification <br /> Node.
                        </h1>
                        <p className="text-slate-600 dark:text-gray-400 text-lg max-w-xl leading-relaxed font-light">
                            Autonomous data orchestration. Discover, redact, and govern PII at scale using decentralized AI models.
                        </p>
                    </div>

                    <div className="relative z-10">
                        {error && (
                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}
                        {renderMainContent()}
                    </div>
                </div>
                
                {/* Decorative Gradient */}
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            </main>

            {/* 3. LOADING OVERLAY */}
            {loading && (
                <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-[#05060B]/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
                    <div className="text-center">
                        <ChessLoadingAnimation message="Quantizing Neural Fragments..." />
                        <div className="mt-8 flex justify-center gap-1">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes hue-rotate {
                    from { filter: hue-rotate(0deg); }
                    to { filter: hue-rotate(360deg); }
                }
                .animate-hue-rotate {
                    animation: hue-rotate 10s linear infinite;
                }

                /* --- ATTRACTIVE DROPDOWNS OVERRIDE --- */
                .sidebar-content select {
                    appearance: none !important;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") !important;
                    background-repeat: no-repeat !important;
                    background-position: right 1rem center !important;
                    background-size: 1em !important;
                    background-color: #161822 !important; 
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #FFFFFF !important; 
                    font-weight: 600 !important;
                    font-size: 0.85rem !important;
                    padding: 12px 16px !important;
                    border-radius: 14px !important;
                    width: 100% !important;
                    margin-bottom: 12px !important;
                    transition: all 0.2s ease-in-out !important;
                    cursor: pointer !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }

                .sidebar-content select:hover {
                    border-color: #6366f1 !important;
                    background-color: #1c1f2e !important;
                    box-shadow: 0 0 15px rgba(99, 102, 241, 0.2) !important;
                }

                .sidebar-content label {
                    color: #6366f1 !important; 
                    font-size: 10px !important;
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.15em !important;
                    margin-bottom: 8px !important;
                    display: block !important;
                }

                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
        </div>
    );
}