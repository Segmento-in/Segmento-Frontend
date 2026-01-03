'use client';

import React, { useState } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface ConfluenceConnectorProps {
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

export const ConfluenceConnector: React.FC<ConfluenceConnectorProps> = ({
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [pageId, setPageId] = useState('');
    const [showToken, setShowToken] = useState(false);

    const handleScan = async () => {
        if (!url || !username || !token || !pageId) {
            onError('Please fill in all fields');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const result = await apiClient.scanConfluence(url, username, token, pageId);
            onAnalysisComplete(result);
        } catch (error: any) {
            onError(`Failed to scan Confluence page: ${error.message}`);
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Confluence URL */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confluence URL
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://your-domain.atlassian.net"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email/Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>

                {/* API Token */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        API Token
                    </label>
                    <div className="relative">
                        <input
                            type={showToken ? 'text' : 'password'}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Your Atlassian API token"
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showToken ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Create at id.atlassian.com/manage-profile/security/api-tokens
                    </p>
                </div>

                {/* Page ID */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Page ID
                    </label>
                    <input
                        type="text"
                        value={pageId}
                        onChange={(e) => setPageId(e.target.value)}
                        placeholder="123456789"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Find the page ID in the URL: /pages/123456789/page-title
                    </p>
                </div>
            </div>

            {/* Scan Button */}
            <button
                onClick={handleScan}
                disabled={!url || !username || !token || !pageId}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#B3945B] to-[#8B7355] hover:opacity-90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Scan Confluence Page
            </button>

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <p className="text-blue-200 font-semibold mb-1">How to Get Page ID</p>
                        <p className="text-blue-300/80 text-sm">
                            Open the Confluence page in your browser. The URL will contain the page ID. Example:
                        </p>
                        <code className="block bg-black/30 px-3 py-2 rounded mt-2 text-xs text-blue-300">
                            https://your-domain.atlassian.net/wiki/spaces/SPACE/pages/123456789/Page+Title
                        </code>
                        <p className="text-blue-300/80 text-sm mt-2">
                            The page ID in this example is <strong>123456789</strong>
                        </p>
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
                            API tokens are used for this session only and are not stored. Use API tokens with appropriate permissions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
