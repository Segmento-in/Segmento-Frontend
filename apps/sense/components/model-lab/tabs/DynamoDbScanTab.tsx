'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, ArrowLeft, Download, Database, Search, Shield } from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, DynamoDbCredentials, FileCatalogEntry, DriveItem, OutOfCreditsError } from '@/lib/apiClient';
import ConnectorPreviewUI from '../ConnectorPreviewUI';
import { useAuth } from '@/lib/authContext';
import OutOfCreditsModal from '@/components/OutOfCreditsModal';

interface TableScanEntry {
  tableName: string;
  status: 'unscanned' | 'scanning' | 'scanned' | 'error';
  result?: AnalysisResponse;
  error?: string;
}

interface Props { modelCatalogue: EvaluatorModel[]; onStepChange?: (step: Step) => void; }

function catalogEntryToDriveItem(entry: FileCatalogEntry): DriveItem {
    let path = entry.full_path || entry.file_name;
    if (!entry.is_folder && entry.parent_folder_id) path = `${entry.parent_folder_id}/${entry.file_name}`;
    return {
        id: entry.file_id, name: entry.file_name, mimeType: entry.connector_type || 'dynamodb', path,
        isFolder: entry.is_folder || false, parseable: !entry.is_folder, ext: 'DB', sizeBytes: entry.file_size_bytes || 0,
        mediaType: 'document', appProperties: {}, tooBig: false, parentId: entry.parent_folder_id || '',
    };
}

type Step = 'AUTH' | 'BROWSE' | 'RESULTS';

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">{children}</div>;
}

function StepBadge({ n, accentStep }: { n: number; accentStep: string }) {
  return <span className={`flex items-center justify-center w-6 h-6 rounded-full ${accentStep} text-sm font-bold`}>{n}</span>;
}

function DashboardStatCard({ label, value, valueColor = 'text-slate-800' }: { label: string; value: number | string; valueColor?: string; }) {
  return (
    <div className="flex flex-col justify-center px-6 py-5 cursor-default select-none">
      <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">{label}</p>
      <p className={`text-4xl font-light leading-none tracking-tight ${valueColor}`}>{value}</p>
    </div>
  );
}

export default function DynamoDbScanTab({ modelCatalogue, onStepChange }: Props) {
  const [step, setStep] = useState<Step>('AUTH');
  const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(0);

  const [creds, setCreds] = useState<DynamoDbCredentials>({
    region: 'us-east-1', access_key: '', secret_key: '',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(new Set());
  const [scanEntries, setScanEntries] = useState<TableScanEntry[]>([]);
  const [scanningTableIds, setScanningTableIds] = useState<Set<string>>(new Set());
  const [lastScanMode, setLastScanMode] = useState<'full' | 'metadata'>('full');
  const [catalogData, setCatalogData] = useState<FileCatalogEntry[]>([]);
  const [lastSession, setLastSession] = useState<any>(null);

  const accentRing = 'focus:ring-orange-500';
  const accentBtn = 'bg-orange-600 hover:bg-orange-700';
  const accentStep = 'bg-orange-100 text-orange-600';
  const inputCls = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl ${accentRing} focus:ring-2 outline-none text-slate-900 text-sm`;

  const fetchCatalog = async () => {
    try {
        const res = await apiClient.getDbCatalog(token || '', 'dynamodb');
        setCatalogData(res.files || []);
        setLastSession(res.last_session || null);
    } catch { }
  };

  const handleConnect = async () => {
    if (!creds.access_key || !creds.secret_key || !creds.region) return setError('Access Key, Secret Key, Region required.');
    setIsConnecting(true); setError(null);
    try {
      const res = await apiClient.listDynamoDbTables(creds);
      setTables(res.tables || []);
      setSelectedTableIds(new Set()); setScanEntries([]);
      await fetchCatalog();
      changeStep('BROWSE');
    } catch (e: any) { setError(e.message || 'Failed to connect.'); } 
    finally { setIsConnecting(false); }
  };

  const handleScan = async (mode: 'full' | 'metadata' = 'full') => {
    if (selectedTableIds.size === 0) return;
    if (token) {
        try { await apiClient.deductCredits(token, 1); } 
        catch (e) { if (e instanceof OutOfCreditsError) { setCreditsLeft(e.creditsRemaining); setOutOfCredits(true); return; } }
    }
    const tablesToScan = [...selectedTableIds];
    setScanEntries(tablesToScan.map(t => ({ tableName: t, status: 'scanning' })));
    setScanningTableIds(new Set(tablesToScan));
    setLastScanMode(mode); changeStep('RESULTS');

    for (const t of tablesToScan) {
      try {
        let res: AnalysisResponse;
        if (mode === 'metadata') {
          const catalogRes = await apiClient.scanMetadata({ ...creds, connector_type: 'dynamodb', table: t }, token || '');
          const fileEntry = catalogRes.files.find(f => !f.is_folder && f.file_name === t);
          const flaggedColumns = fileEntry?.metadata?.flagged_columns || [];
          res = { total_pii_found: flaggedColumns.length, pii_counts: [], metadata: { scan_mode: 'metadata_only', flagged_columns: flaggedColumns } } as any;
        } else {
          res = await apiClient.scanDynamoDbTable({ ...creds, table: t }, token || '');
        }
        setScanEntries(prev => prev.map(e => e.tableName === t ? { ...e, status: 'scanned', result: res } : e));
      } catch (e: any) {
        setScanEntries(prev => prev.map(entry => entry.tableName === t ? { ...entry, status: 'error', error: e.message } : entry));
      } finally {
        setScanningTableIds(p => { const n = new Set(p); n.delete(t); return n; });
      }
    }
    await fetchCatalog();
  };

  const stats = useMemo(() => {
    const scanned = scanEntries.filter(e => e.status === 'scanned');
    const pii = scanned.filter(e => (e.result?.total_pii_found ?? 0) > 0).length;
    return { scanned: scanned.length, pii, clean: scanned.length - pii, totalPii: scanned.reduce((s, e) => s + (e.result?.total_pii_found ?? 0), 0) };
  }, [scanEntries]);

  const catalogItems = useMemo(() => catalogData.map(catalogEntryToDriveItem), [catalogData]);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      <OutOfCreditsModal open={outOfCredits} onClose={() => setOutOfCredits(false)} creditsRemaining={creditsLeft} />
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl m-6 mb-0 shrink-0 text-red-700 text-sm">{error}</div>}
      <AnimatePresence mode="wait">
        {step === 'AUTH' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-6 w-full p-6">
            <Card>
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2"><StepBadge n={1} accentStep={accentStep} /> DynamoDB Connection</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Region</label>
                  <input type="text" value={creds.region} onChange={e => setCreds(p => ({ ...p, region: e.target.value }))} className={inputCls} placeholder="us-east-1" />
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Access Key</label><input type="text" value={creds.access_key} onChange={e => setCreds(p => ({ ...p, access_key: e.target.value }))} className={inputCls} /></div>
                <div><label className="block text-sm font-medium mb-1.5">Secret Key</label><input type="password" value={creds.secret_key} onChange={e => setCreds(p => ({ ...p, secret_key: e.target.value }))} className={inputCls} /></div>
                <button onClick={handleConnect} disabled={isConnecting} className={`w-full py-3 ${accentBtn} text-white rounded-xl font-medium disabled:opacity-50`}>
                  {isConnecting ? 'Connecting...' : 'Connect & List Tables'}
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 'BROWSE' && (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1 min-h-0 bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <span className="font-bold">Select Tables ({selectedTableIds.size}/{tables.length})</span>
              <button onClick={() => changeStep('AUTH')} className="text-sm text-slate-500">Change Credentials</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {tables.map(t => (
                <div key={t} onClick={() => setSelectedTableIds(p => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; })}
                  className={`p-3 rounded-xl border cursor-pointer ${selectedTableIds.has(t) ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                  {t}
                </div>
              ))}
            </div>
            {selectedTableIds.size > 0 && (
              <div className="p-4 border-t bg-slate-50 flex gap-4">
                <button onClick={() => handleScan('metadata')} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Metadata Scan</button>
                <button onClick={() => handleScan('full')} className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold">Full Deep Scan</button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'RESULTS' && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1 min-h-0">
            <div className="grid grid-cols-4 divide-x border-b bg-white shrink-0">
              <DashboardStatCard label="Scanned" value={stats.scanned} />
              <DashboardStatCard label="PII Found" value={stats.pii} valueColor="text-rose-600" />
              <DashboardStatCard label="Clean" value={stats.clean} valueColor="text-emerald-600" />
              <DashboardStatCard label="Total Items" value={stats.totalPii} valueColor="text-amber-600" />
            </div>
            <ConnectorPreviewUI items={catalogItems} selectedIds={new Set()} onToggleSelection={() => {}} scanningIds={scanningTableIds} scanResults={[]} onOpenFile={() => {}} connectorType="dynamodb" catalogData={catalogData} lastSession={lastSession} filterMode="all" searchQuery="" className="flex-1 min-h-0" mode="database" isMetadataScan={lastScanMode === 'metadata'} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
