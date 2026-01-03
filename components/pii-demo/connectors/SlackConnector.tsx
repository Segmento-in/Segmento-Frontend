'use client';

import React, { useState } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface SlackConnectorProps {
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

export const SlackConnector: React.FC<SlackConnectorProps> = ({
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    const [token, setToken] = useState('');
    const [channelId, setChannelId] = useState('');
    const [showToken, setShowToken] = useState(false);

    const handleScan = async () => {
        if (!token || !channelId) {
            onError('Please provide both Slack token and channel ID');
            return;
        }

        onLoading(true);
        onError('');

        try {
            const result = await apiClient.scanSlack(token, channelId);
            onAnalysisComplete(result);
        } catch (error: any) {
            onError(`Failed to scan Slack messages: ${error.message}`);
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {/* Slack Token */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Slack API Token
                    </label>
                    <div className="relative">
                        <input
                            type={showToken ? 'text' : 'password'}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="xoxb-your-slack-bot-token"
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
                        Create a bot token at api.slack.com/apps
                    </p>
                </div>

                {/* Channel ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Channel ID
                    </label>
                    <input
                        type="text"
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder="C01234ABCDE"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Right-click a channel and select "Copy link" to get the ID
                    </p>
                </div>
            </div>

            {/* Scan Button */}
            <button
                onClick={handleScan}
                disabled={!token || !channelId}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#B3945B] to-[#8B7355] hover:opacity-90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Scan Slack Channel Messages
            </button>

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <p className="text-blue-200 font-semibold mb-1">Required Permissions</p>
                        <p className="text-blue-300/80 text-sm mb-2">
                            Your Slack bot needs the following scopes:
                        </p>
                        <ul className="text-blue-300/80 text-sm list-disc list-inside space-y-1">
                            <li>channels:history</li>
                            <li>channels:read</li>
                            <li>users:read</li>
                        </ul>
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
                            API tokens are used for this session only and are not stored. Never share your tokens.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
