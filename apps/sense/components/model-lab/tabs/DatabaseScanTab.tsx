'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle, CheckCircle2, ChevronRight, Loader2, Play,
    Eye, EyeOff, ArrowLeft, Download, Database,
} from 'lucide-react';
import { apiClient, EvaluatorModel, AnalysisResponse, PIICount, DatabaseCredentials } from '@/lib/apiClient';

interface Props { modelCatalogue: EvaluatorModel[]; onStepChange?: (step: Step) => void; }

type Step = 'AUTH' | 'BROWSE' | 'RESULTS';
type DbType = 'postgresql' | 'mysql';

const DB_DEFAULTS: Record<DbType, { port: string; label: string; accent: string; emoji: string }> = {
    postgresql: { port: '5432', label: 'PostgreSQL', accent: 'indigo', emoji: '🐘' },
    mysql:      { port: '3306', label: 'MySQL',      accent: 'orange', emoji: '🐬' },
};

export default function DatabaseScanTab({ modelCatalogue, onStepChange }: Props) {
    const [step, setStep] = useState<Step>('AUTH');
    const changeStep = (s: Step) => { setStep(s); onStepChange?.(s); };
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // AUTH
    const [dbType, setDbType] = useState<DbType>('postgresql');
    const [creds, setCreds] = useState<DatabaseCredentials & { port: string }>({
        host: '', port: '5432', database: '', user: '', password: '',
    });
    const [isConnecting, setIsConnecting] = useState(false);

    // BROWSE
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState('');

    // RESULTS
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);

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
        setIsConnecting(true); setError(null);
        try {
            const res = dbType === 'postgresql'
                ? await apiClient.listPostgresTables(creds)
                : await apiClient.listMysqlTables(creds);
            setTables(res.tables || []);
            setSelectedTable('');
            changeStep('BROWSE');
        } catch (e: any) {
            setError(e.message || `Failed to connect to ${DB_DEFAULTS[dbType].label}.`);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleScan = async () => {
        if (!selectedTable) return;
        setIsScanning(true); setScanError(null); setResult(null); changeStep('RESULTS');
        try {
            const res = dbType === 'postgresql'
                ? await apiClient.scanPostgresqlTable({ ...creds, table: selectedTable })
                : await apiClient.scanMysqlTable({ ...creds, table: selectedTable });
            setResult(res);
        } catch (e: any) {
            setScanError(e.message || 'Scan failed.');
        } finally {
            setIsScanning(false);
        }
    };

    const resetToAuth = () => { changeStep('AUTH'); setError(null); setTables([]); setSelectedTable(''); setResult(null); setScanError(null); };
    const resetToBrowse = () => { changeStep('BROWSE'); setResult(null); setScanError(null); };

    // ── Shared UI helpers ───────────────────────────────────────────────────

    const accent = DB_DEFAULTS[dbType].accent;
    const accentRing = accent === 'indigo' ? 'focus:ring-indigo-500' : 'focus:ring-orange-500';
    const accentBtn  = accent === 'indigo'
        ? 'bg-indigo-600 hover:bg-indigo-700'
        : 'bg-orange-500 hover:bg-orange-600';
    const accentBg   = accent === 'indigo'
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

    const Card = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {children}
        </div>
    );

    const StepBadge = ({ n }: { n: number }) => (
        <span className={`flex items-center justify-center w-6 h-6 rounded-full ${accentStep} text-sm font-bold`}>
            {n}
        </span>
    );

    const inputCls = `w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl ${accentRing} focus:ring-2 outline-none text-slate-900 dark:text-white text-sm`;

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
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

            {/* Error banner */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            <AnimatePresence mode="wait">

                {/* ── STAGE 1: AUTH ──────────────────────────────────────── */}
                {step === 'AUTH' && (
                    <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <StepBadge n={1} /> Connect to Database
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
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                                                    dbType === type
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

                {/* ── STAGE 2: TABLE PICKER ──────────────────────────────── */}
                {step === 'BROWSE' && (
                    <motion.div key="browse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                        <Card>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <StepBadge n={2} /> Select Table
                                </h3>
                                <button onClick={resetToAuth} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                    Change Credentials
                                </button>
                            </div>

                            {/* Connected status */}
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg mb-5 text-sm text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Connected to <span className="font-semibold mx-1">{creds.database}</span> on {creds.host} — found {tables.length} table(s)
                            </div>

                            {/* Table selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Select Table
                                </label>
                                <select
                                    value={selectedTable}
                                    onChange={e => setSelectedTable(e.target.value)}
                                    className={`${inputCls}`}
                                >
                                    <option value="">— Choose a table —</option>
                                    {tables.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleScan}
                                    disabled={!selectedTable}
                                    className={`flex items-center gap-2 px-8 py-3 ${accentBtn} text-white rounded-xl font-medium disabled:opacity-50 transition-colors shadow-sm`}
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Scan Table for PII
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* ── STAGE 3: RESULTS ──────────────────────────────────── */}
                {step === 'RESULTS' && (
                    <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                        {/* Premium Dashboard Header */}
                        <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={resetToBrowse}
                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Scan Another Table
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
                                    {selectedTable && (
                                        <span className={`text-xs font-semibold text-white ${accentCount} px-2 py-0.5 rounded-full`}>
                                            {creds.database}.{selectedTable}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {isScanning ? (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${accent === 'indigo' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-orange-50 text-orange-600 border border-orange-200'} rounded-lg text-xs font-semibold`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${accent === 'indigo' ? 'bg-indigo-500' : 'bg-orange-500'} animate-pulse`} />
                                        Scanning…
                                    </span>
                                ) : result ? (
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

                        {/* Scanning placeholder */}
                        {isScanning && (
                            <Card>
                                <div className="flex flex-col items-center py-12">
                                    <Loader2 className={`w-10 h-10 ${accent === 'indigo' ? 'text-indigo-500' : 'text-orange-500'} animate-spin mb-4`} />
                                    <p className="text-slate-500 text-sm">Querying table and scanning for PII in-memory…</p>
                                </div>
                            </Card>
                        )}

                        {/* Scan error */}
                        {!isScanning && scanError && (
                            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 dark:text-red-400">{scanError}</p>
                            </div>
                        )}

                        {/* Results */}
                        {!isScanning && result && (
                            <div className="space-y-4">
                                {/* ── PII Badge ────────────────────────────────── */}
                                <div className="flex items-center gap-3">
                                    {result.total_pii_found > 0 ? (
                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-400 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-black uppercase tracking-widest shadow-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            PII Positive
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-black uppercase tracking-widest shadow-sm">
                                            <CheckCircle2 className="w-4 h-4" />
                                            PII Negative
                                        </span>
                                    )}
                                    <span className="text-sm text-slate-500">
                                        {result.total_pii_found > 0
                                            ? `${result.total_pii_found} PII entities detected in ${creds.database}.${selectedTable}`
                                            : `No PII detected in ${creds.database}.${selectedTable}`}
                                    </span>
                                </div>

                                {/* Result card */}
                                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 p-4 border-l-4 border-l-transparent">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                            result.total_pii_found > 0
                                                ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                            {result.total_pii_found > 0
                                                ? <AlertCircle className="w-4 h-4" />
                                                : <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white font-mono">
                                                {creds.database}.<span className="font-bold">{selectedTable}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {DB_DEFAULTS[dbType].label} · {creds.host}:{creds.port}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                            result.total_pii_found > 0
                                                ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                        }`}>
                                            {result.total_pii_found > 0 ? `${result.total_pii_found} PII` : 'Clean'}
                                        </span>
                                    </div>

                                    {/* PII Breakdown */}
                                    {result.pii_counts && result.pii_counts.length > 0 && (
                                        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-[#0F172A]">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                                                PII Breakdown
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {result.pii_counts.map((p: PIICount) => (
                                                    <div key={p['PII Type']} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                                        <span className="text-slate-600 dark:text-slate-400 truncate">{p['PII Type']}</span>
                                                        <span className="font-bold text-red-600 dark:text-red-400 ml-2">{p.Count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Schema */}
                                    {result.schema && result.schema.length > 0 && (
                                        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-[#1E293B]">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                                                Table Schema
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.schema.map((col) => (
                                                    <div key={col.Column} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
                                                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{col.Column}</span>
                                                        <span className="text-slate-400">{col.Type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
