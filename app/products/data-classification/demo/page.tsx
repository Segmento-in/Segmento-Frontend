'use client';

import React, { useState } from 'react';
import { SourceSidebar, SourceConfig } from '@/components/pii-demo/SourceSidebar';
import { FileUpload } from '@/components/pii-demo/FileUpload';
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

    const handleAnalysisComplete = (result: AnalysisResponse) => {
        setAnalysisResult(result);
        setError('');
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setAnalysisResult(null);
    };

    const renderMainContent = () => {
        // File System
        if (sourceConfig.mainCategory === 'File System' && sourceConfig.fileSubType) {
            return (
                <div className="space-y-6">
                    <div className="bg-linear-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Upload {sourceConfig.fileSubType} File
                        </h2>
                        <FileUpload
                            fileType={sourceConfig.fileSubType}
                            onAnalysisComplete={handleAnalysisComplete}
                            onLoading={setLoading}
                            onError={handleError}
                        />
                    </div>

                    {/* Results */}
                    {analysisResult && (
                        <>
                            <PIIAnalytics
                                piiCounts={analysisResult.pii_counts}
                                schema={analysisResult.schema}
                            />

                            {analysisResult.inspector && (
                                <Inspector inspectorData={analysisResult.inspector} />
                            )}

                            {/* Data Display */}
                            {analysisResult.data && analysisResult.data.length > 0 && (
                                <div className="bg-linear-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                                    <h3 className="text-xl font-semibold text-[#B3945B] mb-4">
                                        Scanned Results
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-[#3E2F5B]/30">
                                                    {Object.keys(analysisResult.data[0]).map((key) => (
                                                        <th key={key} className="text-left py-2 px-3 text-gray-400">
                                                            {key}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysisResult.data.slice(0, 50).map((row, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="border-b border-[#3E2F5B]/10 hover:bg-[#3E2F5B]/10 transition-colors"
                                                    >
                                                        {Object.values(row).map((value: any, cellIdx) => (
                                                            <td
                                                                key={cellIdx}
                                                                className="py-2 px-3 text-gray-300"
                                                                dangerouslySetInnerHTML={{ __html: String(value) }}
                                                            />
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* PDF Image */}
                            {analysisResult.image && (
                                <div className="bg-linear-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-[#B3945B]">
                                            PDF Page {analysisResult.current_page! + 1} of {analysisResult.total_pages}
                                        </h3>

                                        {/* Pagination Controls */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const newPage = (analysisResult.current_page || 0) - 1;
                                                    if (newPage >= 0) {
                                                        // Trigger re-upload with new page
                                                        const event = new CustomEvent('pdf-page-change', { detail: { page: newPage } });
                                                        window.dispatchEvent(event);
                                                    }
                                                }}
                                                disabled={(analysisResult.current_page || 0) <= 0 || loading}
                                                className="px-4 py-2 bg-[#3E2F5B] hover:bg-[#3E2F5B]/80 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                ← Previous
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newPage = (analysisResult.current_page || 0) + 1;
                                                    if (newPage < (analysisResult.total_pages || 0)) {
                                                        const event = new CustomEvent('pdf-page-change', { detail: { page: newPage } });
                                                        window.dispatchEvent(event);
                                                    }
                                                }}
                                                disabled={(analysisResult.current_page || 0) >= (analysisResult.total_pages || 1) - 1 || loading}
                                                className="px-4 py-2 bg-[#3E2F5B] hover:bg-[#3E2F5B]/80 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    </div>
                                    <img
                                        src={analysisResult.image}
                                        alt="PDF Page"
                                        className="w-full rounded-lg"
                                    />
                                </div>
                            )}

                            {/* OCR Image */}
                            {analysisResult.original_image && (
                                <div className="bg-linear-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                                    <h3 className="text-xl font-semibold text-[#B3945B] mb-4">
                                        Original Image
                                    </h3>
                                    <img
                                        src={analysisResult.original_image}
                                        alt="Original"
                                        className="max-w-md rounded-lg"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        }

        // Databases
        if (sourceConfig.mainCategory === 'Databases') {
            return (
                <div className="bg-linear-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Connect to {sourceConfig.source}
                    </h2>
                    <DatabaseConnector
                        databaseType={sourceConfig.source as 'PostgreSQL' | 'MySQL' | 'MongoDB'}
                        onAnalysisComplete={handleAnalysisComplete}
                        onLoading={setLoading}
                        onError={handleError}
                    />
                </div>
            );
        }

        // Cloud Storage
        if (sourceConfig.mainCategory === 'Cloud Storage') {
            return (
                <div className="bg-linear-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {sourceConfig.source} Import
                    </h2>
                    <CloudStorageConnector
                        sourceType={sourceConfig.source as 'Google Drive' | 'Amazon S3' | 'Azure Blob Storage' | 'Google Cloud Storage'}
                        onAnalysisComplete={handleAnalysisComplete}
                        onLoading={setLoading}
                        onError={handleError}
                    />
                </div>
            );
        }

        // Enterprise Connectors
        if (sourceConfig.mainCategory === 'Enterprise Connectors') {
            const connector = sourceConfig.source === 'Gmail' ? (
                <GmailConnector
                    onAnalysisComplete={handleAnalysisComplete}
                    onLoading={setLoading}
                    onError={handleError}
                />
            ) : sourceConfig.source === 'Slack' ? (
                <SlackConnector
                    onAnalysisComplete={handleAnalysisComplete}
                    onLoading={setLoading}
                    onError={handleError}
                />
            ) : sourceConfig.source === 'Confluence' ? (
                <ConfluenceConnector
                    onAnalysisComplete={handleAnalysisComplete}
                    onLoading={setLoading}
                    onError={handleError}
                />
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">
                        {sourceConfig.source} connector coming soon!
                    </p>
                    <p className="text-sm text-gray-500">
                        Backend API ready. OAuth flow in progress.
                    </p>
                </div>
            );

            return (
                <div className="bg-linear-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {sourceConfig.source} Scanner
                    </h2>
                    {connector}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex min-h-screen bg-linear-to-br from-[#141E30] via-[#1A1A1A] to-[#141E30]">
            {/* Loading Animation */}
            {loading && <ChessLoadingAnimation message="Analyzing your data with AI models..." />}

            {/* Sidebar */}
            <SourceSidebar onSourceChange={setSourceConfig} />

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        PII Detection & Data Classification
                    </h1>
                    <p className="text-gray-400">
                        AI-powered platform to discover, classify, and protect sensitive data across your organization
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Dynamic Content */}
                {renderMainContent()}
            </div>
        </div>
    );
}

// Placeholder components for non-file features
const DatabaseConnectorPlaceholder: React.FC<{ source: string }> = ({ source }) => (
    <div className="text-center py-12">
        <p className="text-gray-400 mb-4">
            Database connector for <span className="text-[#B3945B] font-semibold">{source}</span>
        </p>
        <p className="text-sm text-gray-500">
            This feature requires backend integration. Full implementation available.
        </p>
    </div>
);

const CloudStoragePlaceholder: React.FC<{ source: string }> = ({ source }) => (
    <div className="text-center py-12">
        <p className="text-gray-400 mb-4">
            Cloud storage connector for <span className="text-[#B3945B] font-semibold">{source}</span>
        </p>
        <p className="text-sm text-gray-500">
            This feature requires credentials. Full implementation available.
        </p>
    </div>
);

const EnterpriseConnectorPlaceholder: React.FC<{ source: string }> = ({ source }) => (
    <div className="text-center py-12">
        <p className="text-gray-400 mb-4">
            Enterprise connector for <span className="text-[#B3945B] font-semibold">{source}</span>
        </p>
        <p className="text-sm text-gray-500">
            This feature requires authentication. Full implementation available.
        </p>
    </div>
);
