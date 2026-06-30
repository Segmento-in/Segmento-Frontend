'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '@/components/model-lab/tabs/FormatScanTab';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { apiClient, OutOfCreditsError, AnalysisResponse, DriveItem, DriveFileScanResult } from '@/lib/apiClient';
import OutOfCreditsModal from '@/components/OutOfCreditsModal';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import { PIIAnalytics } from '@/components/pii-demo/PIIAnalytics';
import { Inspector } from '@/components/pii-demo/Inspector';
import ConnectorPreviewUI from '@/components/model-lab/ConnectorPreviewUI';
import DocumentViewerModal from '@/components/model-lab/DocumentViewerModal';

export default function LocalUploadView() {
  type CategoryKey = typeof CATEGORIES[number]['key'];
  
  const [step, setStep] = useState<'select-type' | 'upload' | 'scanning' | 'results' | 'error'>('select-type');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('structured');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);

  const { isLoggedIn, token } = useAuth();
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(0);
  const [scanningCount, setScanningCount] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [scanResults, setScanResults] = useState<{ file: File; result: AnalysisResponse }[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);
  const [viewingFileId, setViewingFileId] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[2]; // defaults to structured
  const activeTypeObj = activeCategory.types.find(t => t.ext === selectedFileType);

  const handleFilesSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;

    // 1. ACTION-LEVEL AUTH GATE
    if (!isLoggedIn) {
      router.push('/profile?returnUrl=/model-lab/connectors');
      return;
    }

    // 2. CLIENT-SIDE CREDIT GATE & OPTIMISTIC DECREMENT
    if (token) {
      try {
        await apiClient.deductCredits(token, files.length);
      } catch (e) {
        if (e instanceof OutOfCreditsError) {
          setCreditsLeft(e.creditsRemaining);
          setOutOfCredits(true);
          return;
        }
      }
    }

    // 4. TRANSITION
    setUploadedFiles(files);
    setScanningCount(files.length);
    setStep('scanning');
  };

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
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFilesSelected(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFilesSelected(files);
    }
  };

  useEffect(() => {
    if (step === 'scanning' && uploadedFiles.length > 0) {
      let isMounted = true;
      const runScans = async () => {
        try {
          const results = await Promise.all(
            uploadedFiles.map(async (f) => {
              let result: AnalysisResponse;
              const models = ['ensemble', 'regex', 'nltk', 'spacy', 'presidio', 'gliner', 'deberta'];
              
              switch (activeTypeObj?.ext || selectedFileType) {
                case 'csv': result = await apiClient.uploadCSV(f, false, models); break;
                case 'json': result = await apiClient.uploadJSON(f, false, models); break;
                case 'parquet': result = await apiClient.uploadParquet(f, false, models); break;
                case 'avro': result = await apiClient.uploadAvro(f, false, models); break;
                case 'pdf': result = await apiClient.uploadPDF(f, 0, models); break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'bmp':
                case 'tiff': result = await apiClient.uploadImage(f, false); break;
                default: result = await apiClient.uploadCSV(f, false, models); break; // fallback
              }
              return { file: f, result };
            })
          );
          
          if (isMounted) {
            setScanResults(results);
            setStep('results');
          }
        } catch (err: any) {
          if (isMounted) {
            setScanError(err.message || 'Failed to scan files');
            setStep('error');
          }
        }
      };
      runScans();
      return () => { isMounted = false; };
    }
  }, [step, uploadedFiles, selectedFileType, activeTypeObj]);

  const retryScan = () => {
    setScanError(null);
    setStep('scanning');
  };

  const chooseDifferentFile = () => {
    setUploadedFiles([]);
    setScanResults([]);
    setScanError(null);
    setStep('select-type');
  };

  // Convert uploaded files to DriveItem and DriveFileScanResult for ConnectorPreviewUI and DocumentViewerModal
  const driveItems: DriveItem[] = uploadedFiles.map(f => ({
    id: f.name,
    name: f.name,
    mimeType: f.type || 'application/octet-stream',
    isFolder: false,
    ext: f.name.split('.').pop() || '',
    mediaType: 'document',
    parseable: true,
    tooBig: false,
    sizeBytes: f.size,
    path: f.name,
    parentId: 'root'
  }));

  const mappedScanResults: DriveFileScanResult[] = scanResults.map(sr => ({
    file_id: sr.file.name,
    fileId: sr.file.name,
    file_name: sr.file.name,
    mime_type: sr.file.type,
    pii_detected: sr.result.total_pii_found > 0,
    pii_count: sr.result.total_pii_found,
    result: sr.result
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-900 min-h-[400px]">
      <OutOfCreditsModal
        open={outOfCredits}
        onClose={() => setOutOfCredits(false)}
        creditsRemaining={creditsLeft}
      />

      {step === 'select-type' && (
        <>
          {/* Navbar */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as CategoryKey)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  selectedCategory === cat.key
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat.label.replace(/[^a-zA-Z-\s]/g, '').trim()}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {activeCategory.types.map(type => (
              <div
                key={type.ext}
                onClick={() => {
                  setSelectedFileType(type.ext);
                  setStep('upload');
                }}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all bg-white flex flex-col items-center justify-center text-center gap-3"
              >
                <div className="text-gray-900 font-semibold text-sm">
                  {type.label.split(' (')[0]}
                </div>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                  {type.accept}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 'upload' && (
        <div className="flex flex-col h-full min-h-[300px]">
          {/* Back Breadcrumb */}
          <button
            onClick={() => {
              setSelectedFileType(null);
              setStep('select-type');
            }}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-6 cursor-pointer self-start transition-colors"
          >
            <span className="mr-1">←</span> Back to file types
          </button>

          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-500 bg-white hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept={activeTypeObj?.accept}
            />
            
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                <UploadCloud className="w-8 h-8" />
              </div>
              
              <div>
                <p className="text-lg text-gray-900 font-semibold">
                  Upload {activeTypeObj ? activeTypeObj.label.split(' (')[0] : selectedFileType} Files
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop files here or <span className="text-blue-600 font-medium">browse</span>
                </p>
              </div>
              <p className="text-xs text-gray-400">Multiple files supported.</p>
            </div>
          </div>
        </div>
      )}

      {step === 'scanning' && (
        <div className="flex flex-col h-full min-h-[300px] items-center justify-center text-center">
           <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
           <p className="text-gray-900 font-semibold text-lg">
             Scanning {scanningCount} file{scanningCount !== 1 ? 's' : ''} for PII...
           </p>
           <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
             Our ensemble engine is securely processing your files in memory. 
             Results will appear shortly.
           </p>
        </div>
      )}

      {step === 'results' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900">Scan Results</h2>
            <button
              onClick={chooseDifferentFile}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Scan New Files
            </button>
          </div>

          {uploadedFiles.length === 1 && scanResults.length === 1 ? (
            <div className="flex flex-col gap-8 bg-white text-gray-900">
              <PIIAnalytics
                piiCounts={scanResults[0].result.pii_counts}
                schema={scanResults[0].result.schema}
              />
              {scanResults[0].result.inspector && (
                <Inspector inspectorData={scanResults[0].result.inspector} />
              )}
            </div>
          ) : (
            <div className="bg-white text-gray-900">
              <ConnectorPreviewUI
                items={driveItems}
                scanResults={mappedScanResults}
                selectedIds={new Set()}
                onToggleSelection={() => {}}
                scanningIds={new Set()}
                onOpenFile={(id) => setViewingFileId(id)}
                connectorType="Local Upload"
              />
            </div>
          )}
        </div>
      )}

      {step === 'error' && (
        <div className="flex flex-col h-full min-h-[300px] items-center justify-center text-center bg-white text-gray-900 border border-red-200 rounded-xl p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Scan Failed</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            {scanError || 'An unexpected error occurred while scanning your files.'}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={retryScan}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Retry
            </button>
            <button
              onClick={chooseDifferentFile}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Choose Different File
            </button>
          </div>
        </div>
      )}

      {viewingFileId && (
        <DocumentViewerModal
          fileInfo={driveItems.find(i => i.id === viewingFileId)!}
          scanResult={mappedScanResults.find(r => r.file_id === viewingFileId)!}
          credentials={{}}
          authType="local"
          onClose={() => setViewingFileId(null)}
        />
      )}
    </div>
  );
}
