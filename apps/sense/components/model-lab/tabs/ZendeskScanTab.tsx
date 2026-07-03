'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, HeadphonesIcon } from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, OutOfCreditsError, ZendeskCredentials } from '@/lib/apiClient';
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

export default function ZendeskScanTab({ modelCatalogue, onStepChange }: Props) {
  const [step, setStep] = useState<Step>('AUTH');
  const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(0);

  const [creds, setCreds] = useState<ZendeskCredentials>({ subdomain: '', email: '', api_token: '' });
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AnalysisResponse | null>(null);

  const inputCls = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:ring-2 outline-none text-slate-900 text-sm`;

  const handleScan = async () => {
    if (!creds.subdomain || !creds.email || !creds.api_token) return setError('Subdomain, Email, and API Token are required.');
    
    if (token) {
        try { await apiClient.deductCredits(token, 1); } 
        catch (e) { if (e instanceof OutOfCreditsError) { setCreditsLeft(e.creditsRemaining); setOutOfCredits(true); return; } }
    }
    
    setIsScanning(true); setError(null);
    try {
      const res = await apiClient.scanConnector('zendesk', creds, token || '');
      setScanResult(res);
      changeStep('RESULTS');
    } catch (e: any) { setError(e.message || 'Failed to scan Zendesk.'); } 
    finally { setIsScanning(false); }
  };

  const catalogData = [
    {
      file_id: `${creds.subdomain}.zendesk.com`,
      file_name: 'Tickets',
      is_folder: false,
      mime_type: 'zendesk',
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
      id: `${creds.subdomain}.zendesk.com`,
      name: 'Tickets',
      mimeType: 'zendesk',
      path: 'Zendesk Tickets',
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
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">1</span> <HeadphonesIcon className="w-5 h-5 text-emerald-500" /> Zendesk Connection</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1.5">Zendesk Subdomain</label>
                  <div className="flex items-center relative">
                    <span className="absolute left-4 text-slate-400 font-medium text-sm">https://</span>
                    <input type="text" value={creds.subdomain} onChange={e => setCreds(p => ({ ...p, subdomain: e.target.value }))} className={`${inputCls} pl-16 pr-24`} placeholder="company" />
                    <span className="absolute right-4 text-slate-400 font-medium text-sm">.zendesk.com</span>
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Admin Email</label><input type="email" value={creds.email} onChange={e => setCreds(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="admin@company.com" /></div>
                <div><label className="block text-sm font-medium mb-1.5">API Token</label><input type="password" value={creds.api_token} onChange={e => setCreds(p => ({ ...p, api_token: e.target.value }))} className={inputCls} placeholder="Zendesk API Token..." /></div>
                
                <button onClick={handleScan} disabled={isScanning} className={`w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium disabled:opacity-50 flex justify-center items-center gap-2`}>
                  {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isScanning ? 'Scanning Tickets...' : 'Connect & Scan Tickets'}
                </button>
              </div>
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
                <h2 className="text-sm font-bold text-slate-800 flex-1">Zendesk: {creds.subdomain}.zendesk.com</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Scan Complete
                </span>
            </div>
            <div className="grid grid-cols-3 divide-x border-b bg-white shrink-0">
              <DashboardStatCard label="Tickets Scanned" value={scanResult?.rows_scanned || 0} />
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
                connectorType="zendesk" 
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
