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

    // T2: Resolve per-format icon, chip color, and hover border class
    const { Icon, bgColorClass, iconColorClass, hoverBorderClass } = getFileTypeIcon(type.ext);

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={handleClick}
            style={{ transition: 'transform 0.18s ease-out, box-shadow 0.3s ease' }}
            // T3: hover:-translate-y-0.5 adds CSS-only lift; hoverBorderClass adds family-tinted border glow
            className={`group bg-white border border-slate-200/60 rounded-2xl p-6 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-150 hover:-translate-y-0.5 ${hoverBorderClass} flex flex-col items-center justify-center text-center gap-4 h-full overflow-hidden relative ${isScanning ? 'opacity-90 pointer-events-none' : 'active:scale-95'}`}
        >
            <input 
                type="file" 
                multiple 
                className="hidden" 
                accept={type.accept}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* T2: Icon Chip — tinted background from Format Icon Family color */}
            <div className={`w-14 h-14 rounded-2xl ${bgColorClass} flex items-center justify-center border border-slate-200/50 group-hover:scale-110 group-hover:border-blue-200 transition-all duration-500 relative z-10 shadow-sm`}>
                {isScanning ? (
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                ) : (
                    <Icon className={`w-6 h-6 ${iconColorClass}`} />
                )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[15px] font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {isScanning ? 'Scanning...' : type.label.split(' (')[0]}
              </h3>
              <div className="mt-2.5 text-[9px] text-slate-500 font-mono bg-slate-100/80 border border-slate-200/60 px-2.5 py-1 rounded-lg uppercase tracking-widest truncate max-w-[120px] mx-auto group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                  {type.accept}
              </div>
            </div>
        </div>
    );
}

export default function LocalUploadView() {
  type CategoryKey = typeof CATEGORIES[number]['key'];
  
  const [step, setStep] = useState<'select-type' | 'results' | 'error'>('select-type');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('structured');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [scanningType, setScanningType] = useState<string | null>(null);

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

  const handleFilesSelected = async (files: File[], ext: string) => {
    if (!files || files.length === 0) return;

    if (!isLoggedIn) {
      router.push('/profile?returnUrl=/model-lab/connectors');
      return;
    }

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

    setUploadedFiles(files);
    setScanningCount(files.length);
    setSelectedFileType(ext);
    setScanningType(ext);
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
              
              switch (scanningType) {
                case 'csv': result = await apiClient.uploadCSV(f, false, models); break;
                case 'json': result = await apiClient.uploadJSON(f, false, models); break;
                case 'parquet': result = await apiClient.uploadParquet(f, false, models); break;
                case 'avro': result = await apiClient.uploadAvro(f, false, models); break;
                case 'pdf': result = await apiClient.uploadPDF(f, 0, models); break;
                case 'txt': result = await apiClient.uploadTXT(f, false, models); break;
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
            setScanningType(null);
            setStep('results');
          }
        } catch (err: any) {
          if (isMounted) {
            setScanError(err.message || 'Failed to scan files');
            setScanningType(null);
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
    setUploadedFiles([]);
    setScanResults([]);
    setScanError(null);
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
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 relative w-full">
      <OutOfCreditsModal
        open={outOfCredits}
        onClose={() => setOutOfCredits(false)}
        creditsRemaining={creditsLeft}
      />

      {step === 'select-type' && (
        <div className="flex-col flex-1 min-h-0 overflow-y-auto flex">
          {/* Hero Header matching Connectors grid */}
          <div className="bg-white border-b border-slate-200 shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Local Upload
              </h1>
              <p className="mt-4 text-base text-slate-500 max-w-2xl">
                Select a file format to securely scan local files in your browser. Files are processed entirely in-memory ensuring zero retention and maximum security.
              </p>
            </div>
          </div>

          {/* Grid Container */}
          <div className="flex-1 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5">
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
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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



      {step === 'results' && (
        <div className="flex flex-col flex-1 min-h-0 bg-slate-50 overflow-hidden">
          <div className="bg-white border-b border-slate-200 shrink-0 shadow-sm">
             <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                        <File className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 leading-tight">Scan Results</h2>
                        <p className="text-xs text-slate-500 font-medium">Local Upload • {scanningCount} file{scanningCount !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                <button 
                  onClick={chooseDifferentFile} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
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
        <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-12">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8 border border-red-100">
              <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Scan Failed</h2>
          <p className="text-slate-500 mb-10 max-w-md mx-auto text-base">
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
              className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
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
