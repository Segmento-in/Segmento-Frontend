'use client';

import React, { useState } from 'react';
import { SourceSidebar, SourceConfig } from '@/components/pii-demo/SourceSidebar';
import { FileUpload } from '@/components/pii-demo/FileUpload';
import { PIIAnalytics } from '@/components/pii-demo/PIIAnalytics';
import { Inspector } from '@/components/pii-demo/Inspector';
import { ChessLoadingAnimation } from '@/components/pii-demo/ChessLoadingAnimation';
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
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Upload {sourceConfig.fileSubType} File
                        </h2>
                        <FileUpload
                            fileType={sourceConfig.fileSubType}
                            onAnalysisComplete={handleAnalysisComplete}
                            onLoading={setLoading}
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
                                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
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
                                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                                    <h3 className="text-xl font-semibold text-[#B3945B] mb-4">
                                        PDF Page {analysisResult.current_page! + 1} of {analysisResult.total_pages}
                                    </h3>
                                    <img
                                        src={analysisResult.image}
                                        alt="PDF Page"
                                        className="w-full rounded-lg"
                                    />
                                </div>
                            )}

                            {/* OCR Image */}
                            {analysisResult.original_image && (
                                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
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
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Connect to {sourceConfig.source}
                    </h2>
                    <DatabaseConnectorPlaceholder source={sourceConfig.source} />
                </div>
            );
        }

        // Cloud Storage
        if (sourceConfig.mainCategory === 'Cloud Storage') {
            return (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {sourceConfig.source} Import
                    </h2>
                    <CloudStoragePlaceholder source={sourceConfig.source} />
                </div>
            );
        }

        // Enterprise Connectors
        if (sourceConfig.mainCategory === 'Enterprise Connectors') {
            return (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141E30] rounded-lg p-6 border border-[#3E2F5B]/30">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {sourceConfig.source} Scanner
                    </h2>
                    <EnterpriseConnectorPlaceholder source={sourceConfig.source} />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#141E30] via-[#1A1A1A] to-[#141E30]">
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
