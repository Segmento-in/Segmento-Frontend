'use client';

import React, { useState, useRef } from 'react';
import { apiClient, AnalysisResponse } from '@/lib/apiClient';

interface FileUploadProps {
    fileType: string;
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onLoading: (loading: boolean) => void;
}

const FILE_SIZE_LIMIT = 1024 * 1024 * 1024; // 1GB

export const FileUpload: React.FC<FileUploadProps> = ({ fileType, onAnalysisComplete, onLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [maskEnabled, setMaskEnabled] = useState(false);
    const [pdfPage, setPdfPage] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    };

    const handleFileSelection = (file: File) => {
        setError('');

        // Validate file size
        if (file.size > FILE_SIZE_LIMIT) {
            setError(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 1GB limit`);
            return;
        }

        // Validate file type
        const validExtensions: Record<string, string[]> = {
            'CSV': ['.csv'],
            'JSON': ['.json'],
            'Parquet': ['.parquet'],
            'Apache Avro': ['.avro'],
            'PDF': ['.pdf'],
            'Image (OCR)': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'],
        };

        const extensions = validExtensions[fileType] || [];
        const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!extensions.includes(fileExt)) {
            setError(`Invalid file type. Expected: ${extensions.join(', ')}`);
            return;
        }

        setSelectedFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelection(files[0]);
        }
    };

    const handleScan = async () => {
        if (!selectedFile) return;

        setError('');
        onLoading(true);

        try {
            let result: AnalysisResponse;

            switch (fileType) {
                case 'CSV':
                    result = await apiClient.uploadCSV(selectedFile, maskEnabled);
                    break;
                case 'JSON':
                    result = await apiClient.uploadJSON(selectedFile, maskEnabled);
                    break;
                case 'Parquet':
                    result = await apiClient.uploadParquet(selectedFile, maskEnabled);
                    break;
                case 'Apache Avro':
                    result = await apiClient.uploadAvro(selectedFile, maskEnabled);
                    break;
                case 'PDF':
                    result = await apiClient.uploadPDF(selectedFile, pdfPage);
                    break;
                case 'Image (OCR)':
                    result = await apiClient.uploadImage(selectedFile, maskEnabled);
                    break;
                default:
                    throw new Error('Unsupported file type');
            }

            onAnalysisComplete(result);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze file');
        } finally {
            onLoading(false);
        }
    };

    const handlePDFPageChange = async (newPage: number) => {
        if (!selectedFile) return;
        setPdfPage(newPage);

        onLoading(true);
        try {
            const result = await apiClient.uploadPDF(selectedFile, newPage);
            onAnalysisComplete(result);
        } catch (err: any) {
            setError(err.message || 'Failed to load PDF page');
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* File Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${isDragging
                        ? 'border-[#B3945B] bg-[#B3945B]/10'
                        : 'border-[#3E2F5B] hover:border-[#B3945B]/50 bg-[#3E2F5B]/5'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept={
                        fileType === 'Image (OCR)'
                            ? '.jpg,.jpeg,.png,.bmp,.tiff'
                            : fileType === 'CSV'
                                ? '.csv'
                                : fileType === 'JSON'
                                    ? '.json'
                                    : fileType === 'Parquet'
                                        ? '.parquet'
                                        : fileType === 'Apache Avro'
                                            ? '.avro'
                                            : '.pdf'
                    }
                />

                <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#3E2F5B] to-[#B3945B] rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>

                    {selectedFile ? (
                        <>
                            <p className="text-lg text-[#B3945B] font-semibold">{selectedFile.name}</p>
                            <p className="text-sm text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg text-gray-300">
                                Drop your {fileType} file here or <span className="text-[#B3945B]">browse</span>
                            </p>
                            <p className="text-sm text-gray-500">Maximum file size: 1GB</p>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Options */}
            {selectedFile && fileType !== 'PDF' && (
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="mask-toggle"
                        checked={maskEnabled}
                        onChange={(e) => setMaskEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-[#3E2F5B] text-[#B3945B] focus:ring-[#B3945B]"
                    />
                    <label htmlFor="mask-toggle" className="text-sm text-gray-300 cursor-pointer">
                        🔒 Enable PII Masking
                    </label>
                </div>
            )}

            {/* Scan Button */}
            {selectedFile && (
                <button
                    onClick={handleScan}
                    className="w-full bg-gradient-to-r from-[#3E2F5B] to-[#B3945B] hover:from-[#3E2F5B]/80 hover:to-[#B3945B]/80 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    🔍 Scan for PII
                </button>
            )}
        </div>
    );
};
