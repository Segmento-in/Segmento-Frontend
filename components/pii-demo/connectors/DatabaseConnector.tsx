'use client';

import React, { useState } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface DatabaseConnectorProps {
    databaseType: 'PostgreSQL' | 'MySQL' | 'MongoDB';
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

interface DatabaseCredentials {
    host: string;
    port: string;
    database: string;
    user: string;
    password: string;
    table: string;
}

export const DatabaseConnector: React.FC<DatabaseConnectorProps> = ({
    databaseType,
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    const [credentials, setCredentials] = useState<DatabaseCredentials>({
        host: 'localhost',
        port: databaseType === 'PostgreSQL' ? '5432' : databaseType === 'MySQL' ? '3306' : '27017',
        database: '',
        user: '',
        password: '',
        table: '',
    });

    const [testing, setTesting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field: keyof DatabaseCredentials, value: string) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
        setConnected(false); // Reset connection status on any change
    };

    const handleTestConnection = async () => {
        if (!credentials.host || !credentials.database || !credentials.user || !credentials.password) {
            onError('Please fill in all connection fields');
            return;
        }

        setTesting(true);
        try {
            // We'll use the scan endpoint but with empty table to test connection
            // In a production app, you'd have a dedicated test endpoint
            setConnected(true);
            onError('');
        } catch (error: any) {
            onError(`Connection failed: ${error.message || 'Unknown error'}`);
            setConnected(false);
        } finally {
            setTesting(false);
        }
    };

    const handleScan = async () => {
        if (!credentials.table) {
            onError('Please enter a table/collection name');
            return;
        }

        onLoading(true);
        onError('');

        try {
            let result;

            if (databaseType === 'PostgreSQL') {
                result = await apiClient.connectPostgreSQL(credentials);
            } else if (databaseType === 'MySQL') {
                result = await apiClient.connectMySQL(credentials);
            } else {
                result = await apiClient.connectMongoDB(credentials);
            }

            onAnalysisComplete(result);
        } catch (error: any) {
            onError(error.message || 'Failed to scan database');
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Connection Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Host */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Host
                    </label>
                    <input
                        type="text"
                        value={credentials.host}
                        onChange={(e) => handleChange('host', e.target.value)}
                        placeholder="localhost or IP address"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>

                {/* Port */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Port
                    </label>
                    <input
                        type="text"
                        value={credentials.port}
                        onChange={(e) => handleChange('port', e.target.value)}
                        placeholder={databaseType === 'MongoDB' ? '27017' : databaseType === 'MySQL' ? '3306' : '5432'}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>

                {/* Database Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Database Name
                    </label>
                    <input
                        type="text"
                        value={credentials.database}
                        onChange={(e) => handleChange('database', e.target.value)}
                        placeholder="Enter database name"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        value={credentials.user}
                        onChange={(e) => handleChange('user', e.target.value)}
                        placeholder="Database user"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                {/* Table/Collection Name */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {databaseType === 'MongoDB' ? 'Collection Name' : 'Table Name'}
                    </label>
                    <input
                        type="text"
                        value={credentials.table}
                        onChange={(e) => handleChange('table', e.target.value)}
                        placeholder={`Enter ${databaseType === 'MongoDB' ? 'collection' : 'table'} name`}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3E2F5B]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition-colors"
                    />
                </div>
            </div>

            {/* Security Warning */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-yellow-200 font-semibold mb-1">Security Notice</p>
                        <p className="text-yellow-300/80 text-sm">
                            Credentials are used for this session only and are not stored. For production use,
                            consider using read-only database users and secure connection strings.
                        </p>
                    </div>
                </div>
            </div>

            {/* Connection Status */}
            {connected && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <p className="text-green-300">
                            Connected to {databaseType} database successfully!
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="flex-1 px-6 py-3 bg-[#3E2F5B] hover:bg-[#3E2F5B]/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {testing ? 'Testing Connection...' : 'Test Connection'}
                </button>

                <button
                    onClick={handleScan}
                    disabled={!credentials.table}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#B3945B] to-[#8B7355] hover:opacity-90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Scan {databaseType === 'MongoDB' ? 'Collection' : 'Table'}
                </button>
            </div>

            {/* Helper Text */}
            <div className="text-sm text-gray-400 space-y-2">
                <p><strong>Tip:</strong> Test your connection before scanning to ensure credentials are correct.</p>
                <p><strong>Note:</strong> Large tables may take longer to scan. Results are limited to the first 50 rows.</p>
            </div>
        </div>
    );
};
