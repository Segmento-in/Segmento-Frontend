'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const AUTO_REFRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

interface UseAutoRefreshOptions {
    /** localStorage key for storing the last-scan timestamp */
    storageKey: string;
    /** Called when 24h elapses — should be the same function the Refresh button calls */
    onAutoRefresh: () => void;
    /** How often (ms) to recompute the label. Default: 60 000 (every minute) */
    intervalMs?: number;
}

interface UseAutoRefreshResult {
    /** e.g. "auto in 22h 14m" | "auto in 45m" | null (no scan yet) */
    timeLeftLabel: string | null;
    /** Call this after a successful manual refresh or scan to reset the countdown */
    resetTimer: () => void;
    /** true if 24h already passed and an auto-refresh is pending */
    isOverdue: boolean;
}

function buildLabel(msLeft: number): string {
    const totalMinutes = Math.max(0, Math.floor(msLeft / 60_000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `auto in ${hours}h ${minutes}m`;
    return `auto in ${minutes}m`;
}

function readTimestamp(key: string): number | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const ts = parseInt(raw, 10);
        return isNaN(ts) ? null : ts;
    } catch {
        return null;
    }
}

function writeTimestamp(key: string, ts: number): void {
    try {
        localStorage.setItem(key, ts.toString());
    } catch {
        // localStorage may be unavailable (SSR, private browsing, quota exceeded)
    }
}

export function useAutoRefresh({
    storageKey,
    onAutoRefresh,
    intervalMs = 60_000,
}: UseAutoRefreshOptions): UseAutoRefreshResult {
    const [timeLeftLabel, setTimeLeftLabel] = useState<string | null>(null);
    const [isOverdue, setIsOverdue] = useState(false);

    // Keep a stable ref to the callback to avoid stale closures in the interval
    const onAutoRefreshRef = useRef(onAutoRefresh);
    useEffect(() => { onAutoRefreshRef.current = onAutoRefresh; }, [onAutoRefresh]);

    // Compute label from current timestamp in localStorage
    const recompute = useCallback(() => {
        const storedTs = readTimestamp(storageKey);
        if (storedTs === null) {
            // No scan has ever been run — hide the badge
            setTimeLeftLabel(null);
            setIsOverdue(false);
            return;
        }

        const elapsed = Date.now() - storedTs;
        const msLeft = AUTO_REFRESH_THRESHOLD_MS - elapsed;

        if (msLeft <= 0) {
            // 24h has passed — fire auto-refresh once
            setIsOverdue(true);
            setTimeLeftLabel(null);

            // Write fresh timestamp BEFORE calling the callback to prevent
            // multiple rapid fires if the callback is slow or the component re-renders
            const newTs = Date.now();
            writeTimestamp(storageKey, newTs);

            // Dispatch toast notification (Feature 2 bridge)
            try {
                window.dispatchEvent(new CustomEvent('segmento:toast', {
                    detail: {
                        type: 'info',
                        title: 'Files refreshed',
                        message: 'Your Google Drive files have been automatically refreshed.',
                    },
                }));
            } catch {
                // Defensive — CustomEvent may not be available in all environments
            }

            onAutoRefreshRef.current();
        } else {
            setIsOverdue(false);
            setTimeLeftLabel(buildLabel(msLeft));
        }
    }, [storageKey]);

    // Run on mount and on every tick
    useEffect(() => {
        // Compute immediately on mount so the badge shows before the first tick
        recompute();

        const id = setInterval(recompute, intervalMs);
        return () => clearInterval(id); // ← memory-leak guard
    }, [recompute, intervalMs]);

    // Called by the parent after a successful manual action (scan or refresh)
    const resetTimer = useCallback(() => {
        writeTimestamp(storageKey, Date.now());
        recompute();
    }, [storageKey, recompute]);

    return { timeLeftLabel, resetTimer, isOverdue };
}
