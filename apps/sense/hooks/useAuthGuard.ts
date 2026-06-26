'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

/**
 * useAuthGuard
 * Redirects unauthenticated users to /login, carrying a `returnUrl` so they
 * can be bounced back after sign-in.
 *
 * Call this hook at the top of any client-side page or layout component that
 * requires authentication.
 *
 * @returns {{ isLoggedIn: boolean, token: string | null }} — safe to use for
 *   conditional rendering *after* the guard has resolved.
 */
export function useAuthGuard() {
    const { isLoggedIn, token } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Auth state is rehydrated from localStorage on mount.
        // We only redirect if we are definitely not logged in.
        if (!isLoggedIn) {
            const returnUrl = encodeURIComponent(pathname ?? '/');
            router.replace(`/profile?returnUrl=${returnUrl}`);
        }
    }, [isLoggedIn, pathname, router]);

    return { isLoggedIn, token };
}
