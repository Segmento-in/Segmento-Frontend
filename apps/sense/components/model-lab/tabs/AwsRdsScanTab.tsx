'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, ArrowLeft, Download, Database, Eye, EyeOff, Search, Shield } from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, AwsRdsCredentials, FileCatalogEntry, DriveItem, OutOfCreditsError } from '@/lib/apiClient';
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
        id: entry.file_id, name: entry.file_name, mimeType: entry.connector_type || 'aws-rds', path,
        isFolder: entry.is_folder || false, parseable: !entry.is_folder, ext: 'DB', sizeBytes: entry.file_size_bytes || 0,
        mediaType: 'document', appProperties: {}, tooBig: false, parentId: entry.parent_folder_id || '',
    };
}

type Step = 'AUTH' | 'BROWSE' | 'RESULTS';
type EngineType = 'postgres' | 'mysql' | 'aurora';

const ENGINE_DEFAULTS: Record<EngineType, { port: string; label: string; accent: string; emoji: string }> = {
  postgres: { port: '5432', label: 'PostgreSQL', accent: 'indigo', emoji: '🐘' },
  mysql: { port: '3306', label: 'MySQL', accent: 'orange', emoji: '🐬' },
  aurora: { port: '5432', label: 'Aurora', accent: 'blue', emoji: '🌌' },
};

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

export default function AwsRdsScanTab({ modelCatalogue, onStepChange }: Props) {
  const [step, setStep] = useState<Step>('AUTH');
  const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useAuth();
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(0);

  const [creds, setCreds] = useState<AwsRdsCredentials>({
    engine: 'postgres', host: '', port: '5432', database: '', user: '', password: '',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(new Set());
  const [scanEntries, setScanEntries] = useState<TableScanEntry[]>([]);
  const [scanningTableIds, setScanningTableIds] = useState<Set<string>>(new Set());
  const [lastScanMode, setLastScanMode] = useState<'full' | 'metadata'>('full');
  const [catalogData, setCatalogData] = useState<FileCatalogEntry[]>([]);
  const [lastSession, setLastSession] = useState<any>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'pii' | 'clean' | 'unscanned'>('all');
  const [resultSearch, setResultSearch] = useState('');

  const engine = creds.engine as EngineType;
  const accent = ENGINE_DEFAULTS[engine].accent;
  const accentRing = 'focus:ring-indigo-500';
  const accentBtn = 'bg-indigo-600 hover:bg-indigo-700';
  const accentBg = 'bg-indigo-100 text-indigo-600';
  const accentStep = 'bg-indigo-100 text-indigo-600';
  const inputCls = `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl ${accentRing} focus:ring-2 outline-none text-slate-900 text-sm`;

  const fetchCatalog = async () => {
    try {
        const res = await apiClient.getDbCatalog(token || '', 'aws-rds');
        setCatalogData(res.files || []);
        setLastSession(res.last_session || null);
    } catch { }
  };

  const handleConnect = async () => {
    if (!creds.host || !creds.database || !creds.user) return setError('Host, Database, User required.');
    setIsConnecting(true); setError(null);
    try {
      const res = await apiClient.listAwsRdsTables(creds);
      setTables(res.tables || []);
      setSelectedTableIds(new Set()); setScanEntries([]); setFilterMode('all'); setResultSearch('');
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
          const catalogRes = await apiClient.scanMetadata({ ...creds, connector_type: 'aws-rds', table: t }, token || '');
          const fileEntry = catalogRes.files.find(f => !f.is_folder && f.file_name === t);
          const flaggedColumns = fileEntry?.metadata?.flagged_columns || [];
          res = { total_pii_found: flaggedColumns.length, pii_counts: [], metadata: { scan_mode: 'metadata_only', flagged_columns: flaggedColumns } } as any;
        } else {
          res = await apiClient.scanConnector('aws-rds', { ...creds, table: t }, token || '');
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
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2"><StepBadge n={1} accentStep={accentStep} /> AWS RDS Connection</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['postgres', 'mysql', 'aurora'] as EngineType[]).map(t => (
                    <button key={t} onClick={() => setCreds(p => ({ ...p, engine: t, port: ENGINE_DEFAULTS[t].port }))} 
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border ${creds.engine === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                      {ENGINE_DEFAULTS[t].emoji} {ENGINE_DEFAULTS[t].label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Host</label>
                    <input type="text" value={creds.host} onChange={e => setCreds(p => ({ ...p, host: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Port</label>
                    <input type="text" value={creds.port} onChange={e => setCreds(p => ({ ...p, port: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Database</label><input type="text" value={creds.database} onChange={e => setCreds(p => ({ ...p, database: e.target.value }))} className={inputCls} /></div>
                <div><label className="block text-sm font-medium mb-1.5">User</label><input type="text" value={creds.user} onChange={e => setCreds(p => ({ ...p, user: e.target.value }))} className={inputCls} /></div>
                <div><label className="block text-sm font-medium mb-1.5">Password</label><input type="password" value={creds.password} onChange={e => setCreds(p => ({ ...p, password: e.target.value }))} className={inputCls} /></div>
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
                  className={`p-3 rounded-xl border cursor-pointer ${selectedTableIds.has(t) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                  {t}
                </div>
              ))}
            </div>
            {selectedTableIds.size > 0 && (
              <div className="p-4 border-t bg-slate-50 flex gap-4">
                <button onClick={() => handleScan('metadata')} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Metadata Scan</button>
                <button onClick={() => handleScan('full')} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Full Deep Scan</button>
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
            <ConnectorPreviewUI items={catalogItems} selectedIds={new Set()} onToggleSelection={() => {}} scanningIds={scanningTableIds} scanResults={[]} onOpenFile={() => {}} connectorType="aws-rds" catalogData={catalogData} lastSession={lastSession} filterMode="all" searchQuery="" className="flex-1 min-h-0" mode="database" isMetadataScan={lastScanMode === 'metadata'} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
