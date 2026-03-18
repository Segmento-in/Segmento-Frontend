/**
 * Centralized API Base URL Helper
 * ================================
 * 
 * Single source of truth for constructing API base URLs.
 * 
 * Why this exists:
 *   The Pulse app lives under the `/pulse` subpath (configured via
 *   `basePath: '/pulse'` in next.config.ts). Browser-side fetch calls
 *   must include this prefix so they hit the Next.js API proxy at
 *   `/pulse/api/*`, which forwards to the Python backend server-side
 *   (no CORS).
 * 
 *   Server-side code (SSR, API routes) can call the backend directly
 *   since server→server requests are not subject to browser CORS.
 * 
 * Usage:
 *   import { getApiBase } from '@/lib/apiBase';
 *   const res = await fetch(`${getApiBase()}/api/news/ai`);
 */

export function getApiBase(): string {
    if (typeof window !== 'undefined') {
        // Browser: route through the Next.js API proxy.
        // The basePath '/pulse' ensures /pulse/api/* reaches our
        // catch-all route handler at app/api/[...path]/route.ts.
        return '/pulse';
    }
    // Server (SSR / API routes): call the Python backend directly.
    return process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';
}
