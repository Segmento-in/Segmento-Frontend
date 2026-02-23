'use client';

import React, { useState } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface AzureBlobConnectorProps {
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

export const AzureBlobConnector: React.FC<AzureBlobConnectorProps> = ({
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    const [connectionString, setConnectionString] = useState('');
    const [showConnectionString, setShowConnectionString] = useState(false);
    const [containers, setContainers] = useState<string[]>([]);
    const [selectedContainer, setSelectedContainer] = useState('');
    const [blobs, setBlobs] = useState<string[]>([]);
    const [selectedBlob, setSelectedBlob] = useState('');
    const [connected, setConnected] = useState(false);

    const handleConnect = async () => {
        if (!connectionString) {
            onError('Please provide Azure connection string');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const response = await apiClient.listAzureContainers(connectionString);
            setContainers(response.containers || []);
            setConnected(true);
            onError('');
        } catch (error: any) {
            onError(`Failed to connect to Azure Blob Storage: ${error.message}`);
            setConnected(false);
        } finally {
            onLoading(false);
        }
    };

    const handleContainerSelect = async (container: string) => {
        setSelectedContainer(container);
        setBlobs([]);
        setSelectedBlob('');

        if (!container) return;

        onLoading(true);
        try {
            const response = await apiClient.listAzureBlobs(connectionString, container);
            setBlobs(response.blobs || []);
        } catch (error: any) {
            onError(`Failed to list blobs: ${error.message}`);
        } finally {
            onLoading(false);
        }
    };

    const handleScan = async () => {
        if (!selectedBlob) {
            onError('Please select a blob to scan');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const result = await apiClient.scanAzureBlob(
                connectionString,
                selectedContainer,
                selectedBlob
            );
            onAnalysisComplete(result);
        } catch (error: any) {
            onError(`Failed to scan blob: ${error.message}`);
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Connection String */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Azure Storage Connection String
                </label>
                <div className="relative">
                    <input
                        type={showConnectionString ? 'text' : 'password'}
                        value={connectionString}
                        onChange={(e) => {
                            setConnectionString(e.target.value);
                            setConnected(false);
                            setContainers([]);
                        }}
                        placeholder="DefaultEndpointsProtocol=https;AccountName=..."
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConnectionString(!showConnectionString)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                        {showConnectionString ? '🙈' : '👁️'}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Find in Azure Portal → Storage Account → Access Keys
                </p>
            </div>

            {/* Connect Button */}
            {!connected && (
                <button
                    onClick={handleConnect}
                    disabled={!connectionString}
                    className="w-full px-6 py-3 bg-[#3E2F5B] hover:bg-[#3E2F5B]/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Connect to Azure Blob Storage
                </button>
            )}

            {/* Connection Status */}
            {connected && containers.length > 0 && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <p className="text-green-300">
                            Connected to Azure! Found {containers.length} container(s).
                        </p>
                    </div>
                </div>
            )}

            {/* Container Selection */}
            {connected && containers.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Container
                    </label>
                    <select
                        value={selectedContainer}
                        onChange={(e) => handleContainerSelect(e.target.value)}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition-colors"
                    >
                        <option value="">-- Choose a container --</option>
                        {containers.map(container => (
                            <option key={container} value={container}>{container}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Blob Selection */}
            {selectedContainer && blobs.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Blob to Scan ({blobs.length} blob(s) found)
                    </label>
                    <select
                        value={selectedBlob}
                        onChange={(e) => setSelectedBlob(e.target.value)}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition-colors"
                    >
                        <option value="">-- Choose a blob --</option>
                        {blobs.map(blob => (
                            <option key={blob} value={blob}>{blob}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Scan Button */}
            {selectedBlob && (
                <button
                    onClick={handleScan}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#B3945B] to-[#8B7355] hover:opacity-90 text-white font-semibold rounded-lg transition-all"
                >
                    Scan Blob for PII
                </button>
            )}

            {/* Security Warning */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-yellow-200 font-semibold mb-1">Security Notice</p>
                        <p className="text-yellow-300/80 text-sm">
                            Connection string is used for this session only and is not stored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
