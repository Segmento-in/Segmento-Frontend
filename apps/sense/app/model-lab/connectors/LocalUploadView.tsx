'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '@/components/model-lab/tabs/FormatScanTab';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { apiClient, OutOfCreditsError, AnalysisResponse, DriveItem, DriveFileScanResult } from '@/lib/apiClient';
import OutOfCreditsModal from '@/components/OutOfCreditsModal';
import { Loader2, UploadCloud, AlertCircle, ArrowLeft, File } from 'lucide-react';
import { getFileTypeIcon } from '@/components/model-lab/localUpload/fileTypeIcons';
import ConnectorPreviewUI from '@/components/model-lab/ConnectorPreviewUI';
import DocumentViewerModal from '@/components/model-lab/DocumentViewerModal';

// ── 3-D tilt card for File Types ─────────────────────────────────────────────
function FileTypeCard({ type, isScanning, onFilesSelected }: { type: any; isScanning: boolean; onFilesSelected: (files: File[]) => void }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rx = ((y - height / 2) / height) * 12;
        const ry = ((width / 2 - x) / width) * 12;
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    };
    const onMouseLeave = () => {
        if (cardRef.current)
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    const handleClick = () => {
        if (!isScanning && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onFilesSelected(files);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // T2: Resolve per-format icon and hover border class
    const { Icon, hoverBorderClass } = getFileTypeIcon(type.ext);

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={handleClick}
            style={{ transition: 'transform 0.18s ease-out, box-shadow 0.3s ease' }}
            // T3: hover:-translate-y-0.5 adds CSS-only lift; hoverBorderClass adds family-tinted border glow
            className={`group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-150 hover:-translate-y-0.5 ${hoverBorderClass} flex flex-col items-center justify-center text-center gap-4 h-full overflow-hidden relative ${isScanning ? 'opacity-90 pointer-events-none' : 'active:scale-95'}`}
        >
            <input 
                type="file" 
                multiple 
                className="hidden" 
                accept={type.accept}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 dark:from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon Container — transparent background, larger realistic logo */}
            <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
                {isScanning ? (
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : (
                    <Icon className="w-14 h-14 drop-shadow-sm" />
                )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[15px] font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {isScanning ? 'Scanning...' : type.label.split(' (')[0]}
              </h3>
              <div className="mt-2.5 text-[9px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 px-2.5 py-1 rounded-lg uppercase tracking-widest truncate max-w-[120px] mx-auto group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-100 dark:group-hover:border-blue-800/50 transition-colors">
                  {type.accept}
              </div>
            </div>
        </div>
    );
}

export default function LocalUploadView() {
  type CategoryKey = typeof CATEGORIES[number]['key'];
  type ScanMode = 'full' | 'sampling' | 'metadata_only' | 'metadata_and_sampling';

  const [step, setStep] = useState<'select-type' | 'select-scan-mode' | 'results' | 'error'>('select-type');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('structured');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [scanningType, setScanningType] = useState<string | null>(null);
  const [selectedScanMode, setSelectedScanMode] = useState<ScanMode>('full');
  const [isScanning, setIsScanning] = useState(false);  // T3: shows loading overlay after Start Scan click
  // Files buffered at card-click stage, uploaded only after scan mode confirmed.
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // T2: only parquet and avro have a real file-format schema footer we can read.
  // All other formats (CSV, JSON, TXT, PDF…) do not support metadata-only scanning.
  const METADATA_CAPABLE_EXTS = new Set(['parquet', 'avro']);

  const { isLoggedIn, token } = useAuth();
  const router = useRouter();

  const [outOfCredits, setOutOfCredits] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(0);
  const [scanningCount, setScanningCount] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [scanResults, setScanResults] = useState<{ file: File; result: AnalysisResponse }[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);
  const [viewingFileId, setViewingFileId] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[2]; // defaults to structured
  const activeTypeObj = activeCategory.types.find(t => t.ext === selectedFileType);

  // Step 1 → Step 2: save files + ext, go to scan-mode selector.
  const handleFilesSelected = (files: File[], ext: string) => {
    if (!files || files.length === 0) return;

    if (!isLoggedIn) {
      router.push('/profile?returnUrl=/model-lab/connectors');
      return;
    }

    setPendingFiles(files);
    setSelectedFileType(ext);
    // T2: if the new file type can't do metadata scanning and the user had
    // previously selected a metadata mode, reset it back to 'full'.
    if (!METADATA_CAPABLE_EXTS.has(ext) && (selectedScanMode === 'metadata_only' || selectedScanMode === 'metadata_and_sampling')) {
      setSelectedScanMode('full');
    }
    setStep('select-scan-mode');
  };

  // Step 2 → upload: deduct credits + trigger scans with chosen scan mode.
  const startScan = async () => {
    if (pendingFiles.length === 0) return;

    if (token) {
      try {
        await apiClient.deductCredits(token, pendingFiles.length);
      } catch (e) {
        if (e instanceof OutOfCreditsError) {
          setCreditsLeft(e.creditsRemaining);
          setOutOfCredits(true);
          return;
        }
      }
    }

    // T3: show loading overlay immediately — before setting scanningType so
    // the user sees feedback the instant they click, not after the API resolves.
    setIsScanning(true);
    setUploadedFiles(pendingFiles);
    setScanningCount(pendingFiles.length);
    setScanningType(selectedFileType);
  };

  useEffect(() => {
    if (scanningType && uploadedFiles.length > 0) {
      let isMounted = true;
      const runScans = async () => {
        try {
          const results = await Promise.all(
            uploadedFiles.map(async (f) => {
              let result: AnalysisResponse;
              const models = ['ensemble', 'regex', 'nltk', 'spacy', 'presidio', 'gliner', 'deberta'];
              const mode = selectedScanMode;

              switch (scanningType) {
                case 'csv':     result = await apiClient.uploadCSV(f, false, models, mode); break;
                case 'json':    result = await apiClient.uploadJSON(f, false, models, mode); break;
                case 'parquet': result = await apiClient.uploadParquet(f, false, models, mode); break;
                case 'avro':    result = await apiClient.uploadAvro(f, false, models, mode); break;
                case 'pdf':     result = await apiClient.uploadPDF(f, 0, models, mode); break;
                case 'txt':     result = await apiClient.uploadTXT(f, false, models, mode); break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'bmp':
                case 'tiff':    result = await apiClient.uploadImage(f, false, mode); break;
                default:        result = await apiClient.uploadCSV(f, false, models, mode); break;
              }
              return { file: f, result };
            })
          );

          if (isMounted) {
            setScanResults(results);
            setScanningType(null);
            setIsScanning(false);  // T3: hide loading overlay
            setStep('results');
          }
        } catch (err: any) {
          if (isMounted) {
            setScanError(err.message || 'Failed to scan files');
            setScanningType(null);
            setIsScanning(false);  // T3: hide loading overlay on error
            setStep('error');
          }
        }
      };
      runScans();
      return () => { isMounted = false; };
    }
  }, [scanningType, uploadedFiles]);

  const retryScan = () => {
    setScanError(null);
    setScanningType(selectedFileType);
  };

  const chooseDifferentFile = () => {
    setPendingFiles([]);
    setUploadedFiles([]);
    setScanResults([]);
    setScanError(null);
    setStep('select-type');
  };

  const goBackToTypeSelect = () => {
    setPendingFiles([]);
    setIsScanning(false);  // T3: clear loading state if user goes back
    setStep('select-type');
  };


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
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 dark:bg-slate-800 relative w-full">
      <OutOfCreditsModal
        open={outOfCredits}
        onClose={() => setOutOfCredits(false)}
        creditsRemaining={creditsLeft}
      />

      {step === 'select-type' && (
        <div className="flex-col flex-1 min-h-0 overflow-y-auto flex">
          {/* Hero Header matching Connectors grid */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Local Upload
              </h1>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-400 max-w-2xl">
                Select a file format to securely scan local files in your browser. Files are processed entirely in-memory ensuring zero retention and maximum security.
              </p>
            </div>
          </div>

          {/* Grid Container */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-5">
                Select File Type
              </p>
              
              {/* Navbar */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key as CategoryKey)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                      selectedCategory === cat.key
                        ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pb-12">
                {activeCategory.types.map(type => (
                  <FileTypeCard
                    key={type.ext}
                    type={type}
                    isScanning={scanningType === type.ext}
                    onFilesSelected={(files) => handleFilesSelected(files, type.ext)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'select-scan-mode' && (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Header — mirrors select-type hero */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Choose Scan Mode
              </h1>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-400 max-w-2xl">
                Select how deeply Sense should scan your{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide text-sm">
                  {selectedFileType?.toUpperCase()}
                </span>{' '}
                file{pendingFiles.length > 1 ? 's' : ''} for PII.
              </p>
            </div>
          </div>

          {/* Scan-mode selector card */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-5">
                Scan Mode
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {(
                  [
                    {
                      value: 'full' as const,
                      label: 'Full Data Scan',
                      badge: 'Up to 5,000 rows',
                      description: 'Scans a safety-bounded slice of every row for PII. Most thorough data-level analysis.',
                      icon: '🔍',
                    },
                    {
                      value: 'sampling' as const,
                      label: 'Sampling Scan',
                      badge: 'Up to 1,500 rows',
                      description: 'Fast statistical sample — ideal for large files or quick validation runs.',
                      icon: '⚡',
                    },
                    {
                      value: 'metadata_only' as const,
                      label: 'Metadata-Only',
                      badge: 'Schema only',
                      description: 'Reads column names and types without touching row data. Zero PII-model inference.',
                      icon: '🏷️',
                    },
                    {
                      value: 'metadata_and_sampling' as const,
                      label: 'Hybrid',
                      badge: 'Schema + Sample',
                      description: 'Combines metadata column flagging with a 1,500-row data scan for maximum coverage.',
                      icon: '🔀',
                    },
                  ] as const
                )
                  // T2: only show metadata modes for file types that have a real schema
                  .filter((mode) =>
                    mode.value === 'full' || mode.value === 'sampling'
                      ? true
                      : METADATA_CAPABLE_EXTS.has(selectedFileType ?? '')
                  )
                  .map((mode) => (
                  <button
                    key={mode.value}
                    id={`scan-mode-${mode.value}`}
                    onClick={() => setSelectedScanMode(mode.value)}
                    disabled={isScanning}
                    className={`text-left p-5 rounded-2xl border-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedScanMode === mode.value
                        ? 'border-slate-900 dark:border-white bg-white dark:bg-slate-800 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{mode.icon}</span>
                      {selectedScanMode === mode.value && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="font-black text-slate-900 dark:text-white text-sm mb-1">{mode.label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{mode.badge}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{mode.description}</p>
                  </button>
                ))}
              </div>

              {/* File list preview */}
              {pendingFiles.length > 0 && (
                <div className="mb-8 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-3">
                    Files to scan
                  </p>
                  <ul className="space-y-2">
                    {pendingFiles.map((f) => (
                      <li key={f.name} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase shrink-0">
                          {f.name.split('.').pop()}
                        </span>
                        <span className="font-medium truncate">{f.name}</span>
                        <span className="text-slate-400 text-xs ml-auto shrink-0">
                          {(f.size / 1024).toFixed(1)} KB
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* T3: Loading overlay — shown immediately after Start Scan click */}
              {isScanning && (
                <div className="mb-8 p-6 bg-slate-900 rounded-2xl flex items-center gap-4">
                  <Loader2 className="w-6 h-6 text-white animate-spin shrink-0" />
                  <div>
                    <p className="text-white font-black text-sm">Scanning your file…</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {pendingFiles[0]?.name} · {selectedScanMode.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-4">
                <button
                  id="start-scan-btn"
                  onClick={startScan}
                  disabled={isScanning}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  {isScanning ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Scanning…</>
                  ) : 'Start Scan'}
                </button>
                <button
                  id="back-to-type-select-btn"
                  onClick={goBackToTypeSelect}
                  disabled={isScanning}
                  className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="flex flex-col flex-1 min-h-0 bg-slate-50 dark:bg-slate-800 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
             <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                        <File className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Scan Results</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Local Upload • {scanningCount} file{scanningCount !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                <button 
                  onClick={chooseDifferentFile} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  Scan New Files
                </button>
             </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
        </div>
      )}

      {step === 'error' && (
        <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center p-12">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-8 border border-red-100 dark:border-red-800/50">
              <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Scan Failed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto text-base">
            {scanError || 'An unexpected error occurred while scanning your files.'}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={retryScan}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Retry Scan
            </button>
            <button
              onClick={chooseDifferentFile}
              className="px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
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
