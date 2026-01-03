'use client';

import React, { useState } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface GCSConnectorProps {
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

export const GCSConnector: React.FC<GCSConnectorProps> = ({
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    const [credentialsFile, setCredentialsFile] = useState<File | null>(null);
    const [credentials, setCredentials] = useState<any>(null);
    const [buckets, setBuckets] = useState<string[]>([]);
    const [selectedBucket, setSelectedBucket] = useState('');
    const [files, setFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [connected, setConnected] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setCredentialsFile(file);

            // Parse JSON credentials
            try {
                const text = await file.text();
                const creds = JSON.parse(text);
                setCredentials(creds);
                setConnected(false);
                setBuckets([]);
                setSelectedBucket('');
                setFiles([]);
            } catch (error) {
                onError('Invalid JSON credentials file');
            }
        }
    };

    const handleConnect = async () => {
        if (!credentials) {
            onError('Please upload credentials file');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const response = await apiClient.listGCSBuckets(credentials);
            setBuckets(response.buckets || []);
            setConnected(true);
            onError('');
        } catch (error: any) {
            onError(`Failed to connect to Google Cloud Storage: ${error.message}`);
            setConnected(false);
        } finally {
            onLoading(false);
        }
    };

    const handleBucketSelect = async (bucket: string) => {
        setSelectedBucket(bucket);
        setFiles([]);
        setSelectedFile('');

        if (!bucket) return;

        onLoading(true);
        try {
            const response = await apiClient.listGCSFiles(credentials, bucket);
            setFiles(response.files || []);
        } catch (error: any) {
            onError(`Failed to list files: ${error.message}`);
        } finally {
            onLoading(false);
        }
    };

    const handleScan = async () => {
        if (!selectedFile) {
            onError('Please select a file to scan');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const result = await apiClient.scanGCSFile(
                credentials,
                selectedBucket,
                selectedFile
            );
            onAnalysisComplete(result);
        } catch (error: any) {
            onError(`Failed to scan file: ${error.message}`);
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Credentials Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    GCS Credentials JSON
                </label>
                <div className="flex items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 bg-[#3E2F5B]/20 border border-[#3E2F5B] rounded-lg text-white hover:bg-[#3E2F5B]/40 transition-colors"
                    >
                        {credentialsFile ? '📄 Change File' : '📁 Choose File'}
                    </button>
                    {credentialsFile && (
                        <span className="text-sm text-gray-300">{credentialsFile.name}</span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Upload your GCS service account credentials JSON
                </p>
            </div>

            {/* Connect Button */}
            {credentials && !connected && (
                <button
                    onClick={handleConnect}
                    className="w-full px-6 py-3 bg-[#3E2F5B] hover:bg-[#3E2F5B]/80 text-white font-semibold rounded-lg transition-all"
                >
                    Connect to Google Cloud Storage
                </button>
            )}

            {/* Connection Status */}
            {connected && buckets.length > 0 && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <p className="text-green-300">
                            Connected to GCS! Found {buckets.length} bucket(s).
                        </p>
                    </div>
                </div>
            )}

            {/* Bucket Selection */}
            {connected && buckets.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select GCS Bucket
                    </label>
                    <select
                        value={selectedBucket}
                        onChange={(e) => handleBucketSelect(e.target.value)}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition-colors"
                    >
                        <option value="">-- Choose a bucket --</option>
                        {buckets.map(bucket => (
                            <option key={bucket} value={bucket}>{bucket}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* File Selection */}
            {selectedBucket && files.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select File to Scan ({files.length} file(s) found)
                    </label>
                    <select
                        value={selectedFile}
                        onChange={(e) => setSelectedFile(e.target.value)}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition-colors"
                    >
                        <option value="">-- Choose a file --</option>
                        {files.map(file => (
                            <option key={file} value={file}>{file}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Scan Button */}
            {selectedFile && (
                <button
                    onClick={handleScan}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#B3945B] to-[#8B7355] hover:opacity-90 text-white font-semibold rounded-lg transition-all"
                >
                    Scan File for PII
                </button>
            )}

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <p className="text-blue-200 font-semibold mb-1">How to Get Credentials</p>
                        <ol className="text-blue-300/80 text-sm list-decimal list-inside space-y-1">
                            <li>Go to Google Cloud Console</li>
                            <li>Create or select a project</li>
                            <li>Enable Cloud Storage API</li>
                            <li>Create a service account with Storage permissions</li>
                            <li>Download the JSON key file</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Security Warning */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-yellow-200 font-semibold mb-1">Security Notice</p>
                        <p className="text-yellow-300/80 text-sm">
                            Credentials are used for this session only and are not stored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
