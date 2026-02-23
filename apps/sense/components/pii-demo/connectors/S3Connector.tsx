'use client';

import React, { useState } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface S3ConnectorProps {
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

interface S3Credentials {
    accessKey: string;
    secretKey: string;
    region: string;
}

export const S3Connector: React.FC<S3ConnectorProps> = ({
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    const [credentials, setCredentials] = useState<S3Credentials>({
        accessKey: '',
        secretKey: '',
        region: 'us-east-1',
    });

    const [showSecretKey, setShowSecretKey] = useState(false);
    const [buckets, setBuckets] = useState<string[]>([]);
    const [selectedBucket, setSelectedBucket] = useState('');
    const [files, setFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [connected, setConnected] = useState(false);

    const handleCredentialChange = (field: keyof S3Credentials, value: string) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
        setConnected(false);
        setBuckets([]);
        setSelectedBucket('');
        setFiles([]);
    };

    const handleConnect = async () => {
        if (!credentials.accessKey || !credentials.secretKey || !credentials.region) {
            onError('Please fill in all AWS credentials');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const response = await apiClient.listS3Buckets(
                credentials.accessKey,
                credentials.secretKey,
                credentials.region
            );
            setBuckets(response.buckets || []);
            setConnected(true);
            onError('');
        } catch (error: any) {
            onError(`Failed to connect to AWS S3: ${error.message}`);
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
            const response = await apiClient.listS3Files(
                credentials.accessKey,
                credentials.secretKey,
                credentials.region,
                bucket
            );
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
            const result = await apiClient.scanS3File(
                credentials.accessKey,
                credentials.secretKey,
                credentials.region,
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
            {/* AWS Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        AWS Access Key ID
                    </label>
                    <input
                        type="text"
                        value={credentials.accessKey}
                        onChange={(e) => handleCredentialChange('accessKey', e.target.value)}
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        AWS Secret Access Key
                    </label>
                    <div className="relative">
                        <input
                            type={showSecretKey ? 'text' : 'password'}
                            value={credentials.secretKey}
                            onChange={(e) => handleCredentialChange('secretKey', e.target.value)}
                            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showSecretKey ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        AWS Region
                    </label>
                    <select
                        value={credentials.region}
                        onChange={(e) => handleCredentialChange('region', e.target.value)}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition-colors"
                    >
                        <option value="us-east-1">US East (N. Virginia)</option>
                        <option value="us-east-2">US East (Ohio)</option>
                        <option value="us-west-1">US West (N. California)</option>
                        <option value="us-west-2">US West (Oregon)</option>
                        <option value="eu-west-1">EU (Ireland)</option>
                        <option value="eu-central-1">EU (Frankfurt)</option>
                        <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                        <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleConnect}
                        disabled={!credentials.accessKey || !credentials.secretKey}
                        className="w-full px-6 py-3 bg-[#3E2F5B] hover:bg-[#3E2F5B]/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {connected ? 'Reconnect' : 'Connect to S3'}
                    </button>
                </div>
            </div>

            {/* Connection Status */}
            {connected && buckets.length > 0 && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <p className="text-green-300">
                            Connected to AWS S3! Found {buckets.length} bucket(s).
                        </p>
                    </div>
                </div>
            )}

            {/* Bucket Selection */}
            {connected && buckets.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select S3 Bucket
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

            {/* Security Warning */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-yellow-200 font-semibold mb-1">Security Notice</p>
                        <p className="text-yellow-300/80 text-sm">
                            AWS credentials are used for this session only and are not stored.
                            Consider using IAM roles with least-privilege access for production use.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
