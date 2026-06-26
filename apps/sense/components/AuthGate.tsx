'use client';

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGate({ children, featureName = "this premium feature" }: { children: React.ReactNode, featureName?: string }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (isLoggedIn) {
    return <>{children}</>;
  }

  const handleLoginClick = () => {
    const returnUrl = encodeURIComponent(pathname ?? '/');
    router.push(`/profile?returnUrl=${returnUrl}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-6 text-center">
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
        <Lock className="w-10 h-10 text-blue-500" />
      </div>
      <h2 className="text-3xl font-black text-white tracking-tight mb-4">Unlock Premium Access</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
        Please sign in or create a free account to access {featureName} and use your weekly scan credits.
      </p>
      <button
        onClick={handleLoginClick}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/25 uppercase tracking-widest text-xs"
      >
        <Sparkles className="w-4 h-4" />
        Sign In / Register
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
