'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, Pattern } from '@/lib/apiClient';

interface SourceSidebarProps {
    onSourceChange: (config: SourceConfig) => void;
}

export interface SourceConfig {
    mainCategory: string;
    source: string;
    fileSubType?: string;
    structType?: string;
    dbType?: string;
}

export const SourceSidebar: React.FC<SourceSidebarProps> = ({ onSourceChange }) => {
    const [mainCategory, setMainCategory] = useState('File System');
    const [structType, setStructType] = useState('Structured Data');
    const [fileSubType, setFileSubType] = useState('CSV');
    const [dbType, setDbType] = useState('Relational (SQL)');
    const [dbSource, setDbSource] = useState('PostgreSQL');
    const [cloudSource, setCloudSource] = useState('Google Drive');
    const [enterpriseSource, setEnterpriseSource] = useState('Gmail');

    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [newPatternName, setNewPatternName] = useState('');
    const [newPatternRegex, setNewPatternRegex] = useState('');
    const [showAddPattern, setShowAddPattern] = useState(false);
    const [showRemovePattern, setShowRemovePattern] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState('');

    useEffect(() => {
        loadPatterns();
    }, []);

    useEffect(() => {
        // Notify parent of source changes
        let source = '';
        let config: SourceConfig = { mainCategory, source: '' };

        if (mainCategory === 'File System') {
            source = 'File Upload';
            config = { mainCategory, source, fileSubType, structType };
        } else if (mainCategory === 'Databases') {
            source = dbSource;
            config = { mainCategory, source, dbType };
        } else if (mainCategory === 'Cloud Storage') {
            source = cloudSource;
            config = { mainCategory, source };
        } else if (mainCategory === 'Enterprise Connectors') {
            source = enterpriseSource;
            config = { mainCategory, source };
        }

        onSourceChange(config);
    }, [mainCategory, structType, fileSubType, dbType, dbSource, cloudSource, enterpriseSource]);

    const loadPatterns = async () => {
        try {
            const response = await apiClient.getPatterns();
            setPatterns(response.patterns);
        } catch (error) {
            console.error('Failed to load patterns:', error);
        }
    };

    const handleAddPattern = async () => {
        if (!newPatternName || !newPatternRegex) return;

        try {
            await apiClient.addPattern(newPatternName, newPatternRegex);
            setNewPatternName('');
            setNewPatternRegex('');
            setShowAddPattern(false);
            loadPatterns();
        } catch (error) {
            alert('Failed to add pattern: ' + error);
        }
    };

    const handleRemovePattern = async () => {
        if (!selectedPattern) return;

        try {
            await apiClient.deletePattern(selectedPattern);
            setSelectedPattern('');
            setShowRemovePattern(false);
            loadPatterns();
        } catch (error) {
            alert('Failed to remove pattern: ' + error);
        }
    };

    return (
        <div className="w-80 bg-gradient-to-b from-[#1A1A1A] to-[#141E30] border-r border-[#3E2F5B]/30 p-6 overflow-y-auto h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">🛡️ Segmento Sense</h2>
                <p className="text-sm text-gray-400">PII Detection Platform</p>
            </div>

            {/* Source Selection */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#B3945B] mb-4">1. Source Selection</h3>

                <label className="block text-sm text-gray-300 mb-2">Select System</label>
                <select
                    value={mainCategory}
                    onChange={(e) => setMainCategory(e.target.value)}
                    className="w-full bg-[#3E2F5B]/20 border border-[#3E2F5B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#B3945B] transition-colors"
                >
                    <option value="File System">File System</option>
                    <option value="Databases">Databases</option>
                    <option value="Cloud Storage">Cloud Storage</option>
                    <option value="Enterprise Connectors">Enterprise Connectors</option>
                </select>

                {/* File System Options */}
                {mainCategory === 'File System' && (
                    <div className="mt-4 space-y-3">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Data Type</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStructType('Structured Data')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${structType === 'Structured Data'
                                            ? 'bg-[#3E94560] text-white'
                                            : 'bg-[#3E2F5B]/20 text-gray-400 hover:bg-[#3E2F5B]/40'
                                        }`}
                                >
                                    Structured
                                </button>
                                <button
                                    onClick={() => setStructType('Unstructured Data')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${structType === 'Unstructured Data'
                                            ? 'bg-[#3E94560] text-white'
                                            : 'bg-[#3E2F5B]/20 text-gray-400 hover:bg-[#3E2F5B]/40'
                                        }`}
                                >
                                    Unstructured
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">File Format</label>
                            <select
                                value={fileSubType}
                                onChange={(e) => setFileSubType(e.target.value)}
                                className="w-full bg-[#3E2F5B]/20 border border-[#3E2F5B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#B3945B]"
                            >
                                {structType === 'Structured Data' ? (
                                    <>
                                        <option value="CSV">CSV</option>
                                        <option value="JSON">JSON</option>
                                        <option value="Parquet">Parquet</option>
                                        <option value="Apache Avro">Apache Avro</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="PDF">PDF</option>
                                        <option value="Image (OCR)">Image (OCR)</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                )}

                {/* Database Options */}
                {mainCategory === 'Databases' && (
                    <div className="mt-4 space-y-3">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Database Type</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setDbType('Relational (SQL)');
                                        setDbSource('PostgreSQL');
                                    }}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${dbType === 'Relational (SQL)'
                                            ? 'bg-[#3E94560] text-white'
                                            : 'bg-[#3E2F5B]/20 text-gray-400 hover:bg-[#3E2F5B]/40'
                                        }`}
                                >
                                    SQL
                                </button>
                                <button
                                    onClick={() => {
                                        setDbType('Non-Relational (NoSQL)');
                                        setDbSource('MongoDB');
                                    }}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${dbType === 'Non-Relational (NoSQL)'
                                            ? 'bg-[#3E94560] text-white'
                                            : 'bg-[#3E2F5B]/20 text-gray-400 hover:bg-[#3E2F5B]/40'
                                        }`}
                                >
                                    NoSQL
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Select Database</label>
                            <select
                                value={dbSource}
                                onChange={(e) => setDbSource(e.target.value)}
                                className="w-full bg-[#3E2F5B]/20 border border-[#3E2F5B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#B3945B]"
                            >
                                {dbType === 'Relational (SQL)' ? (
                                    <>
                                        <option value="PostgreSQL">🐘 PostgreSQL</option>
                                        <option value="MySQL">🐬 MySQL</option>
                                    </>
                                ) : (
                                    <option value="MongoDB">🍃 MongoDB</option>
                                )}
                            </select>
                        </div>
                    </div>
                )}

                {/* Cloud Storage Options */}
                {mainCategory === 'Cloud Storage' && (
                    <div className="mt-4">
                        <label className="block text-sm text-gray-300 mb-2">Service</label>
                        <select
                            value={cloudSource}
                            onChange={(e) => setCloudSource(e.target.value)}
                            className="w-full bg-[#3E2F5B]/20 border border-[#3E2F5B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#B3945B]"
                        >
                            <option value="Google Drive">Google Drive</option>
                            <option value="AWS S3">AWS S3</option>
                            <option value="Azure Blob Storage">Azure Blob Storage</option>
                            <option value="Google Cloud Storage">Google Cloud Storage</option>
                        </select>
                    </div>
                )}

                {/* Enterprise Connectors Options */}
                {mainCategory === 'Enterprise Connectors' && (
                    <div className="mt-4">
                        <label className="block text-sm text-gray-300 mb-2">Platform</label>
                        <select
                            value={enterpriseSource}
                            onChange={(e) => setEnterpriseSource(e.target.value)}
                            className="w-full bg-[#3E2F5B]/20 border border-[#3E2F5B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#B3945B]"
                        >
                            <option value="Gmail">Gmail</option>
                            <option value="Slack">Slack</option>
                            <option value="Confluence">Confluence</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="border-t border-[#3E2F5B]/30 pt-6 my-6"></div>

            {/* Patterns Section */}
            <div>
                <h3 className="text-lg font-semibold text-[#B3945B] mb-4">2. Patterns</h3>

                {/* Pattern List */}
                <div className="bg-[#3E2F5B]/10 rounded-lg p-3 mb-3 max-h-48 overflow-y-auto">
                    <table className="w-full text-xs">
                        <thead className="text-gray-400">
                            <tr>
                                <th className="text-left pb-2">Name</th>
                                <th className="text-left pb-2">Regex</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {patterns.map((pattern, idx) => (
                                <tr key={idx} className="border-t border-[#3E2F5B]/20">
                                    <td className="py-1">{pattern.name}</td>
                                    <td className="py-1 font-mono text-[10px]">{pattern.regex.slice(0, 15)}...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Pattern */}
                <button
                    onClick={() => setShowAddPattern(!showAddPattern)}
                    className="w-full bg-[#3E94560]/20 hover:bg-[#3E94560]/40 text-[#B3945B] px-3 py-2 rounded-lg text-sm mb-2 transition-colors"
                >
                    ➕ Add Pattern
                </button>

                {showAddPattern && (
                    <div className="bg-[#3E2F5B]/20 rounded-lg p-3 mb-2">
                        <input
                            type="text"
                            placeholder="Pattern Name"
                            value={newPatternName}
                            onChange={(e) => setNewPatternName(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-[#3E2F5B] rounded px-2 py-1 text-white text-sm mb-2 focus:outline-none focus:border-[#B3945B]"
                        />
                        <input
                            type="text"
                            placeholder="Regex Pattern"
                            value={newPatternRegex}
                            onChange={(e) => setNewPatternRegex(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-[#3E2F5B] rounded px-2 py-1 text-white text-sm mb-2 focus:outline-none focus:border-[#B3945B]"
                        />
                        <button
                            onClick={handleAddPattern}
                            className="w-full bg-[#B3945B] hover:bg-[#B3945B]/80 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Add
                        </button>
                    </div>
                )}

                {/* Remove Pattern */}
                <button
                    onClick={() => setShowRemovePattern(!showRemovePattern)}
                    className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                    🗑️ Remove Pattern
                </button>

                {showRemovePattern && (
                    <div className="bg-[#3E2F5B]/20 rounded-lg p-3 mt-2">
                        <select
                            value={selectedPattern}
                            onChange={(e) => setSelectedPattern(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-[#3E2F5B] rounded px-2 py-1 text-white text-sm mb-2 focus:outline-none focus:border-[#B3945B]"
                        >
                            <option value="">Select Pattern</option>
                            {patterns.map((pattern, idx) => (
                                <option key={idx} value={pattern.name}>{pattern.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleRemovePattern}
                            disabled={!selectedPattern}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Remove Selected
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
