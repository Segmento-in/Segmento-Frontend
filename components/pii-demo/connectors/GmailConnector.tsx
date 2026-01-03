'use client';

import React, { useState } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface GmailConnectorProps {
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

export const GmailConnector: React.FC<GmailConnectorProps> = ({
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    const [credentialsFile, setCredentialsFile] = useState<File | null>(null);
    const [maxEmails, setMaxEmails] = useState('10');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setCredentialsFile(files[0]);
        }
    };

    const handleScan = async () => {
        if (!credentialsFile) {
            onError('Please upload Gmail credentials JSON file');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const result = await apiClient.scanGmail(credentialsFile, parseInt(maxEmails));
            onAnalysisComplete(result);
        } catch (error: any) {
            onError(`Failed to scan Gmail: ${error.message}`);
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {/* Credentials File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gmail Credentials JSON
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
                        Upload your Gmail API credentials JSON file
                    </p>
                </div>

                {/* Max Emails */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Number of Emails to Scan
                    </label>
                    <input
                        type="number"
                        value={maxEmails}
                        onChange={(e) => setMaxEmails(e.target.value)}
                        min="1"
                        max="100"
                        placeholder="10"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Maximum: 100 emails
                    </p>
                </div>
            </div>

            {/* Scan Button */}
            <button
                onClick={handleScan}
                disabled={!credentialsFile}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#B3945B] to-[#8B7355] hover:opacity-90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Scan Gmail Inbox
            </button>

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <p className="text-blue-200 font-semibold mb-1">How to Get Gmail API Credentials</p>
                        <ol className="text-blue-300/80 text-sm list-decimal list-inside space-y-1">
                            <li>Go to Google Cloud Console (console.cloud.google.com)</li>
                            <li>Create a new project or select existing one</li>
                            <li>Enable Gmail API for your project</li>
                            <li>Create OAuth 2.0 credentials</li>
                            <li>Download the credentials JSON file</li>
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
                            Your credentials are used for this session only and are not stored. We recommend using a test account for scanning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
