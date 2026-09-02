/**
 * lib/supabaseClient.ts
 *
 * Minimal Supabase browser client — scoped to Google OAuth only.
 * Do NOT import this outside:
 *   - The Google Sign-In button handler in ProfileClient.tsx
 *   - app/auth/callback/page.tsx
 *
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be
 * present in .env.local before this can be used end-to-end.
 * Tests mock this module wholesale — no real client is constructed in tests.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { 
    flowType: 'pkce',
    detectSessionInUrl: false, // PREVENT auto-stripping of ?code= from URL
    ...(isBrowser ? { storage: window.localStorage } : {})
  },
});
