'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, CheckCircle2, ChevronRight, Loader2, Play,
  Eye, EyeOff, ArrowLeft, Download, Database, XCircle, Search, Shield
} from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, DatabaseCredentials, FileCatalogEntry, DriveItem, OutOfCreditsError } from '@/lib/apiClient';
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

/** Convert a FileCatalogEntry (DB table) to a DriveItem so ConnectorPreviewUI can render it */
function catalogEntryToDriveItem(entry: FileCatalogEntry): DriveItem {
    let path = entry.full_path || entry.file_name;
    // Flatten DB paths to skip intermediate schema folders
    if (!entry.is_folder && entry.parent_folder_id) {
        path = `${entry.parent_folder_id}/${entry.file_name}`;
    }
    
    return {
        id: entry.file_id,
        name: entry.file_name,
        mimeType: entry.connector_type || 'database',
        path: path,
        isFolder: entry.is_folder || false,
        parseable: !entry.is_folder,
        ext: entry.connector_type ? entry.connector_type.substring(0, 2).toUpperCase() : 'DB',
        sizeBytes: entry.file_size_bytes || 0,
        mediaType: 'document',
        appProperties: {},
        tooBig: false,
        parentId: entry.parent_folder_id || '',
    };
}

type Step = 'AUTH' | 'BROWSE' | 'RESULTS';
type DbType = 'postgresql' | 'mysql';

const DB_DEFAULTS: Record<DbType, { port: string; label: string; accent: string; emoji: string }> = {
  postgresql: { port: '5432', label: 'PostgreSQL', accent: 'indigo', emoji: '🐘' },
  mysql: { port: '3306', label: 'MySQL', accent: 'orange', emoji: '🐬' },
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {children}
    </div>
  );
}

function StepBadge({ n, accentStep }: { n: number; accentStep: string }) {
  return (
    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${accentStep} text-sm font-bold`}>
      {n}
    </span>
  );
}

function DashboardStatCard({
  label,
  value,
  valueColor = 'text-slate-800',
}: {
  label: string;
  value: number | string;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-col justify-center px-6 py-5 cursor-default select-none">
      <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">
        {label}
      </p>
      <p className={`text-4xl font-light leading-none tracking-tight ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

export default function DatabaseScanTab({ modelCatalogue, onStepChange }: Props) {
  const [step, setStep] = useState<Step>('AUTH');
  const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { token } = useAuth();
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(0);

  // AUTH
  const [dbType, setDbType] = useState<DbType>('postgresql');
  const [creds, setCreds] = useState<DatabaseCredentials & { port: string }>({
    host: '', port: '5432', database: '', user: '', password: '',
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // BROWSE — multi-select
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(new Set());

  // RESULTS — per-table scan tracking
  const [scanEntries, setScanEntries] = useState<TableScanEntry[]>([]);
  const [scanningTableIds, setScanningTableIds] = useState<Set<string>>(new Set());
  const [lastScanMode, setLastScanMode] = useState<'full' | 'metadata'>('full');

  // Catalog data from Supabase (persisted across sessions)
  const [catalogData, setCatalogData] = useState<FileCatalogEntry[]>([]);
  const [lastSession, setLastSession] = useState<any>(null);

  // Filter + search (shared across BROWSE and RESULTS)
  type FilterMode = 'all' | 'pii' | 'clean' | 'unscanned';
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [resultSearch, setResultSearch] = useState('');

  const fetchCatalog = async (dbType: DbType) => {
    try {
        const res = await apiClient.getDbCatalog('default_uid', dbType);
        setCatalogData(res.files || []);
        setLastSession(res.last_session || null);
    } catch { /* non-fatal */ }
  };

  const stats = useMemo(() => {
    const scanned = scanEntries.filter(e => e.status === 'scanned');
    const piiTables = scanned.filter(e => (e.result?.total_pii_found ?? 0) > 0);
    const cleanTables = scanned.filter(e => (e.result?.total_pii_found ?? 0) === 0);
    const totalPii = scanned.reduce((s, e) => s + (e.result?.total_pii_found ?? 0), 0);
    return {
      total: scanEntries.length,
      scanned: scanned.length,
      pii: piiTables.length,
      clean: cleanTables.length,
      totalPii,
    };
  }, [scanEntries]);



  // ── Handlers ────────────────────────────────────────────────────────────

  const handleDbTypeChange = (type: DbType) => {
    setDbType(type);
    setCreds(p => ({ ...p, port: DB_DEFAULTS[type].port }));
  };

  const handleConnect = async () => {
    if (!creds.host || !creds.database || !creds.user) {
      setError('Host, Database, and User are required.');
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const res =
        dbType === 'postgresql'
          ? await apiClient.listPostgresTables(creds)
          : await apiClient.listMysqlTables(creds);
      const tableList: string[] = res.tables || [];
      setTables(tableList);
      setSelectedTableIds(new Set());
      setScanEntries([]);
      setFilterMode('all');
      setResultSearch('');
      await fetchCatalog(dbType);
      changeStep('BROWSE');
    } catch (e: any) {
      setError(e.message || `Failed to connect to ${DB_DEFAULTS[dbType].label}.`);
    } finally {
      setIsConnecting(false);
    }
  };

  const getFileId = (tableName: string): string => {
    return dbType === 'postgresql'
      ? `${creds.database}.public.${tableName}`
      : `${creds.database}.${tableName}`;
  };

  const handleScan = async (mode: 'full' | 'metadata' = 'full') => {
    if (selectedTableIds.size === 0) return;

    // Credit deduction gate
    if (token) {
        try {
            await apiClient.deductCredits(token, 1);
        } catch (e) {
            if (e instanceof OutOfCreditsError) {
                setCreditsLeft(e.creditsRemaining);
                setOutOfCredits(true);
                return;
            }
        }
    }

    const tablesToScan = [...selectedTableIds];

    // Initialise all entries as 'scanning'
    const initial: TableScanEntry[] = tablesToScan.map(t => ({
      tableName: t,
      status: 'scanning',
    }));
    setScanEntries(initial);
    setScanningTableIds(new Set(tablesToScan.map(getFileId)));
    setLastScanMode(mode);
    setFilterMode('all');
    setResultSearch('');
    changeStep('RESULTS');

    // Scan sequentially to avoid overwhelming the DB connection
    let totalPiiFound = 0;
    let errorCount = 0;

    for (const tableName of tablesToScan) {
      try {
        let res: AnalysisResponse;
        if (mode === 'metadata') {
          // Metadata scan hits the new endpoint which returns a CatalogResponse.
          // We extract the table's entry and mock an AnalysisResponse to keep the UI flow happy.
          const catalogRes = await apiClient.scanMetadata({ ...creds, connector_type: dbType, table: tableName });
          const fileEntry = catalogRes.files.find(f => !f.is_folder && f.file_name === tableName);
          const flaggedColumns = fileEntry?.metadata?.flagged_columns || [];
          totalPiiFound += flaggedColumns.length;
          res = {
            total_pii_found: flaggedColumns.length,
            pii_counts: flaggedColumns.map((c: any) => ({ 'PII Type': c.matched_rule || 'PII', Count: 1 })),
            rows_scanned: 0,
            metadata: { scan_mode: 'metadata_only', flagged_columns: flaggedColumns } // Mock metadata to pass down
          } as AnalysisResponse & { metadata?: any };
        } else {
          res = dbType === 'postgresql'
            ? await apiClient.scanPostgresqlTable({ ...creds, table: tableName })
            : await apiClient.scanMysqlTable({ ...creds, table: tableName });
          totalPiiFound += res.total_pii_found || 0;
        }
        
        setScanEntries(prev =>
          prev.map(e =>
            e.tableName === tableName
              ? { ...e, status: 'scanned', result: res }
              : e,
          ),
        );
      } catch (e: any) {
        errorCount += 1;
        setScanEntries(prev =>
          prev.map(entry =>
            entry.tableName === tableName
              ? { ...entry, status: 'error', error: e.message || 'Scan failed.' }
              : entry,
          ),
        );
      } finally {
        setScanningTableIds(prev => {
          const next = new Set(prev);
          next.delete(getFileId(tableName));
          return next;
        });
      }
    }
    // Refresh catalog after all scans complete
    await fetchCatalog(dbType);

    window.dispatchEvent(new CustomEvent('segmento:toast', {
        detail: {
            type: errorCount === 0 ? 'success' : 'warning',
            title: 'Scan complete',
            message: `Found ${totalPiiFound} PII item(s) across ${tablesToScan.length} table(s).`,
        }
    }));
  };

  const resetToAuth = () => {
    changeStep('AUTH');
    setError(null);
    setTables([]);
    setSelectedTableIds(new Set());
    setScanEntries([]);
    setScanningTableIds(new Set());
    setFilterMode('all');
    setResultSearch('');
  };

  const resetToBrowse = () => {
    changeStep('BROWSE');
    setScanEntries([]);
    setScanningTableIds(new Set());
    setFilterMode('all');
    setResultSearch('');
  };

  const toggleTableSelection = (tableName: string) => {
    setSelectedTableIds(prev => {
      const next = new Set(prev);
      if (next.has(tableName)) next.delete(tableName);
      else next.add(tableName);
      return next;
    });
  };

  const selectAllTables = () => {
    if (selectedTableIds.size === tables.length) {
      setSelectedTableIds(new Set());
    } else {
      setSelectedTableIds(new Set(tables));
    }
  };

  // ── Shared UI helpers ───────────────────────────────────────────────────

  const accent = DB_DEFAULTS[dbType].accent;
  const accentRing = accent === 'indigo' ? 'focus:ring-indigo-500' : 'focus:ring-orange-500';
  const accentBtn = accent === 'indigo'
    ? 'bg-indigo-600 hover:bg-indigo-700'
    : 'bg-orange-500 hover:bg-orange-600';
  const accentBg = accent === 'indigo'
    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
    : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400';
  const accentStep = accent === 'indigo'
    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
    : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400';
  const accentCount = accent === 'indigo'
    ? 'bg-indigo-600'
    : 'bg-orange-500';
  const accentCheckbox = accent === 'indigo'
    ? 'bg-indigo-600 border-indigo-600'
    : 'bg-orange-500 border-orange-500';

  const inputCls = `w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl ${accentRing} focus:ring-2 outline-none text-slate-900 dark:text-white text-sm`;

  // catalogItems: convert catalog entries to DriveItem[] for ConnectorPreviewUI
  const catalogItems = useMemo(() => catalogData.map(catalogEntryToDriveItem), [catalogData]);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">

      <OutOfCreditsModal
        open={outOfCredits}
        onClose={() => setOutOfCredits(false)}
        creditsRemaining={creditsLeft}
      />

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3 m-6 mb-0 shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ── STAGE 1: AUTH ──────────────────────────────────────── */}
        {step === 'AUTH' && (
          <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto space-y-6 w-full overflow-y-auto p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${accentBg} rounded-xl`}>
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {DB_DEFAULTS[dbType].emoji} {DB_DEFAULTS[dbType].label} Scan
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Browse tables and scan for PII in-memory — zero data retention.
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <StepBadge n={1} accentStep={accentStep} /> Connect to Database
              </h3>

              <div className="space-y-4">
                {/* DB Type toggle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Database Type
                  </label>
                  <div className="flex gap-2">
                    {(['postgresql', 'mysql'] as DbType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => handleDbTypeChange(type)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${dbType === type
                            ? type === 'postgresql'
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-orange-500 border-orange-500 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                          }`}
                      >
                        <span>{DB_DEFAULTS[type].emoji}</span>
                        {DB_DEFAULTS[type].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Host + Port row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Host</label>
                    <input
                      type="text"
                      value={creds.host}
                      onChange={e => setCreds(p => ({ ...p, host: e.target.value }))}
                      placeholder="localhost or 127.0.0.1"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Port</label>
                    <input
                      type="text"
                      value={creds.port}
                      onChange={e => setCreds(p => ({ ...p, port: e.target.value }))}
                      placeholder={DB_DEFAULTS[dbType].port}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Database */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Database Name</label>
                  <input
                    type="text"
                    value={creds.database}
                    onChange={e => setCreds(p => ({ ...p, database: e.target.value }))}
                    placeholder="my_database"
                    className={inputCls}
                  />
                </div>

                {/* User */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">User</label>
                  <input
                    type="text"
                    value={creds.user}
                    onChange={e => setCreds(p => ({ ...p, user: e.target.value }))}
                    placeholder="db_user"
                    className={inputCls}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={creds.password}
                      onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Security notice */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                  ⚠️ Credentials are used for this session only and are not stored.
                </div>

                <button
                  onClick={handleConnect}
                  disabled={!creds.host || !creds.database || !creds.user || isConnecting}
                  className={`flex items-center gap-2 px-6 py-3 ${accentBtn} text-white rounded-xl font-medium disabled:opacity-50 transition-colors`}
                >
                  {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isConnecting ? 'Connecting...' : 'Connect & List Tables'}
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── STAGE 2: BROWSE STEP ──────────────────────────────── */}
        {step === 'BROWSE' && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* ── Stat Strip ─────────────────────────────────────────── */}
            <div className="grid grid-cols-4 divide-x divide-slate-200 border-b border-slate-200 bg-white shrink-0">
              <DashboardStatCard label="Total Tables" value={tables.length} />
              <DashboardStatCard label="Database" value={creds.database} />
              <DashboardStatCard label="DB Type" value={DB_DEFAULTS[dbType].label} />
              <DashboardStatCard label="Host" value={creds.host} />
            </div>

            {/* ── Filter tabs ────────────────────────────────────────── */}
            <div className="flex items-center border-b border-slate-200 px-6 shrink-0 bg-white">
              <div className="flex items-center gap-8">
                {(['all', 'unscanned'] as FilterMode[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setFilterMode(key)}
                    className={`pb-3 pt-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${filterMode === key
                        ? accent === 'indigo'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-orange-500 text-orange-500'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                      }`}
                  >
                    {key === 'all' ? 'All Tables' : 'Unscanned'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Toolbar ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-3 shrink-0 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-lg w-64 border border-slate-200/50">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tables…"
                  value={resultSearch}
                  onChange={e => setResultSearch(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetToAuth}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change Credentials
                </button>
                <button
                  onClick={selectAllTables}
                  className={`flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg shadow-sm whitespace-nowrap ${accentBtn}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {selectedTableIds.size === tables.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {/* ── Table list ─────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-white">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                  <tr>
                    <th className="w-10 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={tables.length > 0 && selectedTableIds.size === tables.length}
                        onChange={selectAllTables}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Table Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Classification
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Schema
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tables
                    .filter(t =>
                      resultSearch ? t.toLowerCase().includes(resultSearch.toLowerCase()) : true,
                    )
                    .map(tableName => (
                      <tr
                        key={tableName}
                        onClick={() => toggleTableSelection(tableName)}
                        className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedTableIds.has(tableName) ? 'bg-indigo-50/40' : ''
                          }`}
                      >
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedTableIds.has(tableName)}
                            onChange={() => toggleTableSelection(tableName)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Database className={`w-4 h-4 shrink-0 ${accent === 'indigo' ? 'text-indigo-400' : 'text-orange-400'
                              }`} />
                            <span className="font-mono text-sm font-medium text-slate-800">
                              {tableName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                            Unscanned
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">—</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── STAGE 3: RESULTS ──────────────────────────────────── */}
        {step === 'RESULTS' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* ── Premium Dashboard Header ─ shrink-0 */}
            <div className="flex items-center justify-between gap-3 bg-white border-b border-slate-200 px-6 py-3 shadow-sm shrink-0">
              {/* Left: back + title + count */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={resetToBrowse}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <div className="w-px h-5 bg-slate-200" />
                <button
                  onClick={resetToAuth}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  New Connection
                </button>
                <div className="w-px h-5 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-800">Scan Results</h2>
                  <span className={`text-xs font-semibold text-white ${accentCount} px-2 py-0.5 rounded-full tabular-nums`}>
                    {scanEntries.length}
                  </span>
                </div>
              </div>

              {/* Center: search */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-lg w-56 border border-slate-200/60 flex-shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={resultSearch}
                  onChange={e => setResultSearch(e.target.value)}
                  placeholder="Search results…"
                  className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
                />
              </div>

              {/* Right: status badge + export */}
              <div className="flex items-center gap-3 shrink-0">
                {scanningTableIds.size > 0 ? (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${accent === 'indigo'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                      : 'bg-orange-50 text-orange-600 border border-orange-200'
                    } rounded-lg text-xs font-semibold`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${accent === 'indigo' ? 'bg-indigo-500' : 'bg-orange-500'
                      } animate-pulse`} />
                    Scanning {scanningTableIds.size} table{scanningTableIds.size !== 1 ? 's' : ''}…
                  </span>
                ) : stats.scanned > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Scan Complete
                  </span>
                ) : null}
                <button
                  disabled
                  title="Export coming soon"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-400 text-sm font-semibold bg-white cursor-not-allowed opacity-60 select-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* ── Stat Strip ─ shrink-0 */}
            <div className="grid grid-cols-4 divide-x divide-slate-200 border-b border-slate-200 bg-white shrink-0">
              <DashboardStatCard label="Tables Scanned" value={stats.scanned} />
              <DashboardStatCard 
                label={lastScanMode === 'metadata' ? "Potential PII Tables" : "PII Found"} 
                value={stats.pii} 
                valueColor="text-rose-600" 
              />
              <DashboardStatCard label="Clean" value={stats.clean} valueColor="text-emerald-600" />
              <DashboardStatCard 
                label={lastScanMode === 'metadata' ? "Potential PII Columns" : "Total PII Entities"} 
                value={stats.totalPii} 
                valueColor="text-amber-600" 
              />
            </div>

            {/* ── Filter tabs ─ shrink-0 */}
            <div className="flex items-center border-b border-slate-200 px-6 shrink-0 bg-white">
              <div className="flex items-center gap-8">
                {([
                  { key: 'all', label: 'All' },
                  { key: 'pii', label: 'PII Found' },
                  { key: 'clean', label: 'Clean' },
                ] as { key: FilterMode; label: string }[]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilterMode(tab.key)}
                    className={`pb-3 pt-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${filterMode === tab.key
                        ? accent === 'indigo'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-orange-500 text-orange-500'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Results table — shared ConnectorPreviewUI rows path ─ flex-1 overflow-y-auto */}
            <ConnectorPreviewUI
              items={catalogItems}
              selectedIds={new Set()}
              onToggleSelection={() => {}}
              scanningIds={scanningTableIds}
              scanResults={[]}
              onOpenFile={() => {}}
              connectorType="Database"
              catalogData={catalogData}
              lastSession={lastSession}
              filterMode={filterMode}
              searchQuery={resultSearch}
              className="flex-1 min-h-0"
              mode="database"
              isMetadataScan={lastScanMode === 'metadata'}
            />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Floating selection pill for BROWSE */}
      <AnimatePresence>
        {step === 'BROWSE' && selectedTableIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-4 bg-[#1E1E1E] text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700/60">
              <span className="text-sm font-medium pl-1">
                Selected: {selectedTableIds.size}
              </span>
              <div className="w-px h-4 bg-slate-600" />
              <button
                onClick={() => handleScan('metadata')}
                disabled={scanningTableIds.size > 0}
                className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium hover:text-emerald-400 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5" />
                Metadata-Only Scan
              </button>
              <div className="w-px h-4 bg-slate-600" />
              <button
                onClick={() => handleScan('full')}
                disabled={scanningTableIds.size > 0}
                className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Scan Tables
              </button>
              <button
                onClick={() => setSelectedTableIds(new Set())}
                className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
