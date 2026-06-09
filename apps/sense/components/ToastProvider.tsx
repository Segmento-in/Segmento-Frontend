'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = 'info' | 'success' | 'error' | 'warning';

interface ToastPayload {
    type?: ToastType;
    title: string;
    message?: string;
    /** Duration in ms before auto-dismiss. Default 5000. Pass 0 to disable. */
    duration?: number;
}

interface Toast extends ToastPayload {
    id: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ICONS: Record<ToastType, React.ReactNode> = {
    info:    <Info className="w-4 h-4 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
    error:   <AlertCircle className="w-4 h-4 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
};

const STYLES: Record<ToastType, { wrap: string; icon: string; bar: string }> = {
    info: {
        wrap: 'bg-white border border-slate-200 shadow-xl',
        icon: 'text-blue-500 bg-blue-50',
        bar:  'bg-blue-500',
    },
    success: {
        wrap: 'bg-white border border-slate-200 shadow-xl',
        icon: 'text-emerald-600 bg-emerald-50',
        bar:  'bg-emerald-500',
    },
    error: {
        wrap: 'bg-white border border-red-200 shadow-xl',
        icon: 'text-red-500 bg-red-50',
        bar:  'bg-red-500',
    },
    warning: {
        wrap: 'bg-white border border-amber-200 shadow-xl',
        icon: 'text-amber-500 bg-amber-50',
        bar:  'bg-amber-500',
    },
};

const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 5;

// ── Single toast card ─────────────────────────────────────────────────────────

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const type = toast.type ?? 'info';
    const duration = toast.duration ?? DEFAULT_DURATION;
    const style = STYLES[type];

    // Progress bar animation — tracks remaining time visually
    const progressRef = useRef<HTMLDivElement>(null);
    const startRef = useRef(Date.now());
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        if (duration <= 0) return;
        const total = duration;

        const tick = () => {
            const elapsed = Date.now() - startRef.current;
            const pct = Math.max(0, 1 - elapsed / total);
            if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${pct})`;
            }
            if (pct > 0) {
                frameRef.current = requestAnimationFrame(tick);
            }
        };
        frameRef.current = requestAnimationFrame(tick);

        const timer = setTimeout(() => onDismiss(toast.id), duration);
        return () => {
            clearTimeout(timer);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        };
    }, [toast.id, duration, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className={`relative w-80 rounded-xl overflow-hidden pointer-events-auto select-none ${style.wrap}`}
        >
            {/* Progress bar — shrinks left-to-right as time elapses */}
            {duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left">
                    <div
                        ref={progressRef}
                        className={`h-full w-full origin-left ${style.bar}`}
                        style={{ transform: 'scaleX(1)', willChange: 'transform' }}
                    />
                </div>
            )}

            <div className="flex items-start gap-3 px-4 py-3.5 pr-3">
                {/* Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${style.icon}`}>
                    {ICONS[type]}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{toast.title}</p>
                    {toast.message && (
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
                    )}
                </div>

                {/* Dismiss */}
                <button
                    onClick={() => onDismiss(toast.id)}
                    className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Dismiss notification"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
}

// ── Provider (mount once in layout) ──────────────────────────────────────────

export default function ToastProvider() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((payload: ToastPayload) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        setToasts(prev => {
            // Cap at MAX_TOASTS — drop oldest if needed
            const next = [...prev, { ...payload, id }];
            return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
        });
    }, []);

    useEffect(() => {
        const handler = (e: Event) => {
            const payload = (e as CustomEvent<ToastPayload>).detail;
            if (payload?.title) addToast(payload);
        };

        window.addEventListener('segmento:toast', handler);
        return () => window.removeEventListener('segmento:toast', handler);
    }, [addToast]);

    return (
        // Fixed top-right corner, above everything including the navbar
        <div
            className="fixed top-20 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none"
            aria-live="polite"
            aria-label="Notifications"
        >
            <AnimatePresence mode="sync">
                {toasts.map(t => (
                    <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </AnimatePresence>
        </div>
    );
}
