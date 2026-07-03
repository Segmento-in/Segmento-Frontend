'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, Mail, Key } from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, OutOfCreditsError, GmailCredentials } from '@/lib/apiClient';
import ConnectorPreviewUI from '../ConnectorPreviewUI';
import { useAuth } from '@/lib/authContext';
import OutOfCreditsModal from '@/components/OutOfCreditsModal';

interface Props { modelCatalogue: EvaluatorModel[]; onStepChange?: (step: Step) => void; }

type Step = 'AUTH' | 'RESULTS';

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">{children}</div>;
}

function DashboardStatCard({ label, value, valueColor = 'text-slate-800' }: { label: string; value: number | string; valueColor?: string; }) {
  return (
    <div className="flex flex-col justify-center px-6 py-5 cursor-default select-none">
      <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">{label}</p>
      <p className={`text-4xl font-light leading-none tracking-tight ${valueColor}`}>{value}</p>
    </div>
  );
}

export default function GmailScanTab({ modelCatalogue, onStepChange }: Props) {
  const [step, setStep] = useState<Step>('AUTH');
  const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(0);

  const [authType, setAuthType] = useState<'service_account' | 'oauth2_token'>('service_account');
  const [credentials, setCredentials] = useState<Record<string, unknown> | null>(null);
  const [saFileName, setSaFileName] = useState<string | null>(null);
  const [oauthToken, setOauthToken] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AnalysisResponse | null>(null);

  const handleSAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            setCredentials(json);
            setSaFileName(file.name);
            setError(null);
        } catch (err) {
            setError("Invalid JSON file.");
            setCredentials(null);
        }
    };
    reader.readAsText(file);
  };

  const handleOauthSubmit = () => {
    if (!oauthToken.trim()) {
        setError("Please enter a valid OAuth2 Access Token.");
        return;
    }
    setCredentials({ access_token: oauthToken.trim() });
    setError(null);
  };

  const handleScan = async () => {
    if (!credentials) return setError('Credentials are required.');
    
    if (token) {
        try { await apiClient.deductCredits(token, 1); } 
        catch (e) { if (e instanceof OutOfCreditsError) { setCreditsLeft(e.creditsRemaining); setOutOfCredits(true); return; } }
    }
    
    setIsScanning(true); setError(null);
    try {
      const creds: GmailCredentials = { credentials, auth_type: authType };
      const res = await apiClient.scanConnector('gmail', creds, token || '');
      setScanResult(res);
      changeStep('RESULTS');
    } catch (e: any) { setError(e.message || 'Failed to scan Gmail.'); } 
    finally { setIsScanning(false); }
  };

  // Mock catalog data for ConnectorPreviewUI database mode
  const catalogData = [
    {
      file_id: 'Gmail Inbox',
      file_name: 'Emails',
      is_folder: false,
      mime_type: 'gmail',
      file_size_bytes: 0,
      first_seen_at: new Date().toISOString(),
      metadata: {
        column_count: 4,
        row_count_scanned: scanResult?.rows_scanned || 0,
        pii_types: scanResult?.pii_counts?.reduce((acc: any, curr) => ({ ...acc, [curr['PII Type']]: curr.Count }), {})
      },
      classification: scanResult?.total_pii_found ? 'SENSITIVE' : 'NON-SENSITIVE'
    } as any
  ];
  
  const catalogItem = {
      id: 'Gmail Inbox',
      name: 'Emails',
      mimeType: 'gmail',
      path: 'Gmail Inbox',
      isFolder: false,
      parseable: true,
      ext: 'DB',
      sizeBytes: 0,
      mediaType: 'document' as const,
      appProperties: {},
      tooBig: false,
      parentId: ''
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      <OutOfCreditsModal open={outOfCredits} onClose={() => setOutOfCredits(false)} creditsRemaining={creditsLeft} />
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl m-6 mb-0 shrink-0 text-red-700 text-sm">{error}</div>}
      <AnimatePresence mode="wait">
        {step === 'AUTH' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-6 w-full p-6">
            <Card>
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-sm font-bold">1</span> <Mail className="w-5 h-5 text-red-500" /> Gmail Connection</h3>
              
              <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit mb-6">
                  <button
                      onClick={() => setAuthType('service_account')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${authType === 'service_account' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      Service Account JSON
                  </button>
                  <button
                      onClick={() => setAuthType('oauth2_token')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${authType === 'oauth2_token' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      OAuth2 Token
                  </button>
              </div>

              {authType === 'service_account' && (
                  <div className="space-y-4 max-w-md mb-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Upload JSON Key
                      </label>
                      <div className="flex items-center gap-4">
                          <input type="file" accept=".json" onChange={handleSAUpload} className="hidden" id="sa-upload" />
                          <label htmlFor="sa-upload" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                              <Key className="w-4 h-4" /> Choose File
                          </label>
                          {saFileName && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {saFileName} loaded</span>}
                      </div>
                      <p className="text-xs text-slate-500">Requires a Google Cloud Service Account with Gmail API access.</p>
                  </div>
              )}

              {authType === 'oauth2_token' && (
                  <div className="space-y-4 max-w-md mb-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Access Token
                      </label>
                      <div className="flex gap-2">
                          <input type="password" value={oauthToken} onChange={(e) => setOauthToken(e.target.value)} placeholder="ya29.a0Ael9sF..." className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                          <button onClick={handleOauthSubmit} className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors">Apply</button>
                      </div>
                      {credentials?.access_token != null && <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Token applied</p>}
                  </div>
              )}

              <button onClick={handleScan} disabled={isScanning || !credentials} className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium disabled:opacity-50 flex justify-center items-center gap-2`}>
                {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isScanning ? 'Scanning Inbox...' : 'Connect & Scan Inbox'}
              </button>
            </Card>
          </motion.div>
        )}

        {step === 'RESULTS' && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between gap-3 bg-white border-b border-slate-200 px-6 py-3 shadow-sm shrink-0">
                <button onClick={() => changeStep('AUTH')} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div className="w-px h-5 bg-slate-200" />
                <h2 className="text-sm font-bold text-slate-800 flex-1">Gmail Inbox Scan</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Scan Complete
                </span>
            </div>
            <div className="grid grid-cols-3 divide-x border-b bg-white shrink-0">
              <DashboardStatCard label="Emails Scanned" value={scanResult?.rows_scanned || 0} />
              <DashboardStatCard label="Total PII Found" value={scanResult?.total_pii_found || 0} valueColor={scanResult?.total_pii_found ? "text-rose-600" : "text-emerald-600"} />
              <DashboardStatCard label="Status" value={scanResult?.total_pii_found ? 'SENSITIVE' : 'CLEAN'} valueColor={scanResult?.total_pii_found ? "text-rose-600" : "text-emerald-600"} />
            </div>
            <ConnectorPreviewUI 
                items={[catalogItem]} 
                selectedIds={new Set([catalogItem.id])} 
                onToggleSelection={() => {}} 
                scanningIds={new Set()} 
                scanResults={scanResult ? [{ file_id: catalogItem.id, pii_detected: scanResult.total_pii_found > 0, pii_count: scanResult.total_pii_found, error: null }] as any : []} 
                onOpenFile={() => {}} 
                connectorType="gmail" 
                catalogData={catalogData} 
                lastSession={null} 
                filterMode="all" 
                searchQuery="" 
                className="flex-1 min-h-0" 
                mode="database" 
                isMetadataScan={false} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
