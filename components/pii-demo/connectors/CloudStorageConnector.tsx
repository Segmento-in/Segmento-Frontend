'use client';

import React, { useState } from 'react';
import { S3Connector } from './S3Connector';
import { GoogleDriveConnector } from './GoogleDriveConnector';
import { AzureBlobConnector } from './AzureBlobConnector';
import { GCSConnector } from './GCSConnector';
import { AnalysisResponse } from '@/lib/apiClient';

interface CloudStorageConnectorProps {
    sourceType: 'Google Drive' | 'Amazon S3' | 'Azure Blob Storage' | 'Google Cloud Storage';
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string) => void;
}

export const CloudStorageConnector: React.FC<CloudStorageConnectorProps> = ({
    sourceType,
    onAnalysisComplete,
    onLoading,
    onError,
}) => {
    // Route to appropriate connector based on source type
    switch (sourceType) {
        case 'Amazon S3':
            return (
                <S3Connector
                    onAnalysisComplete={onAnalysisComplete}
                    onLoading={onLoading}
                    onError={onError}
                />
            );

        case 'Google Drive':
            return (
                <GoogleDriveConnector
                    onAnalysisComplete={onAnalysisComplete}
                    onLoading={onLoading}
                    onError={onError}
                />
            );

        case 'Azure Blob Storage':
            return (
                <AzureBlobConnector
                    onAnalysisComplete={onAnalysisComplete}
                    onLoading={onLoading}
                    onError={onError}
                />
            );

        case 'Google Cloud Storage':
            return (
                <GCSConnector
                    onAnalysisComplete={onAnalysisComplete}
                    onLoading={onLoading}
                    onError={onError}
                />
            );

        default:
            return (
                <div className="text-center py-12">
                    <h3 className="text-2xl font-bold text-[#B3945B] mb-4">{sourceType}</h3>
                    <p className="text-gray-400">
                        Unknown cloud storage type
                    </p>
                </div>
            );
    }
};
