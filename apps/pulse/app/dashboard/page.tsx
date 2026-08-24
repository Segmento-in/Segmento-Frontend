'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { fetchUserSubscription, UserSubscription } from '@/lib/userApi';
import { getApiBase } from '@/lib/apiBase';
import { User as UserIcon, Mail, ShieldCheck, ArrowLeft, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import SubscriptionManager from '@/components/SubscriptionManager';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);
                if (currentUser.email) {
                    const subData = await fetchUserSubscription(currentUser.email);
                    setSubscription(subData);
                }
            } catch (err) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [router]);

    const handleInitialize = async () => {
        if (!user || !user.email) return;
        setInitializing(true);
        try {
            const API_BASE = getApiBase();
            await fetch(`${API_BASE}/api/subscription/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, name: user.name || 'Pulse User', preference: 'Weekly' })
            });
            const fresh = await fetchUserSubscription(user.email);
            if (fresh) setSubscription(fresh);
        } catch (error) {
            console.error("Failed to initialize profile:", error);
        } finally {
            setInitializing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[100dvh] w-full flex items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-900 dark:border-white"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-[100dvh] w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans pb-24">
            
            {/* Ambient Ethereal Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-in fade-in duration-1000" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-in fade-in duration-1000 delay-300" />
                {/* Subtle CSS Noise */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-12">
                
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className="mb-12 flex items-center justify-between"
                >
                    <Link href="/" className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-200/50 dark:bg-white/5 border border-zinc-300/50 dark:border-white/10 backdrop-blur-md transition-colors hover:bg-zinc-200 dark:hover:bg-white/10">
                        <ArrowLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:-translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" strokeWidth={2} />
                        <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-zinc-700 dark:text-zinc-300">
                            Back to Pulse
                        </span>
                    </Link>
                    
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-200/50 dark:bg-white/5 border border-zinc-300/50 dark:border-white/10 backdrop-blur-md">
                        <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-zinc-700 dark:text-zinc-300">
                            System Active
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Sidebar / Identity Profile Menu */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        <div className="p-1.5 rounded-[2rem] bg-zinc-200/50 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl backdrop-blur-2xl">
                            <div className="bg-white dark:bg-zinc-900 rounded-[calc(2rem-0.375rem)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                
                                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center text-center">
                                    <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 mb-4 ring-4 ring-zinc-50 dark:ring-black">
                                        <UserIcon className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-brand, inherit)' }}>
                                        {user.name || "Pulse User"}
                                    </h2>
                                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">
                                        <ShieldCheck className="h-3 w-3" /> Standard Identity
                                    </span>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.15em] block mb-2">
                                            Primary Email
                                        </label>
                                        <div className="flex items-center gap-3 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                                            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.15em] block mb-2">
                                            Status
                                        </label>
                                        <div className="flex items-center gap-3 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                                            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            </div>
                                            Active Account
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Main Content Area */}
                    <div className="lg:col-span-8">
                        <div className="p-1.5 rounded-[2.5rem] bg-zinc-200/50 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl backdrop-blur-2xl">
                            <div className="bg-white dark:bg-zinc-900 rounded-[calc(2.5rem-0.375rem)] h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                
                                <div className="px-8 py-10 border-b border-zinc-100 dark:border-zinc-800/50">
                                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-brand, inherit)' }}>
                                        Preferences
                                    </h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Configure your content delivery schedules and communication parameters.
                                    </p>
                                </div>
                                
                                <div className="p-8">
                                    {subscription ? (
                                        <SubscriptionManager
                                            initialSubscription={subscription}
                                            onUpdate={async () => {
                                                if (user.email) {
                                                    const fresh = await fetchUserSubscription(user.email);
                                                    if (fresh) setSubscription(fresh);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl">
                                            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 mx-auto flex items-center justify-center mb-4 ring-1 ring-black/5 dark:ring-white/5">
                                                <Activity className="h-6 w-6 text-zinc-400" />
                                            </div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                                                No active subscription profile found for this identity. Initialize your preferences to start receiving curated insights.
                                            </p>
                                            
                                            <button 
                                                onClick={handleInitialize}
                                                disabled={initializing}
                                                className="group relative inline-flex items-center justify-between h-12 pl-6 pr-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-100 mx-auto"
                                            >
                                                <span className="relative z-10 text-sm tracking-wide mr-4">
                                                    {initializing ? "Initializing..." : "Initialize Profile"}
                                                </span>
                                                <div className="relative z-10 w-9 h-9 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-white/20 dark:group-hover:bg-black/20 group-hover:scale-105">
                                                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" strokeWidth={2} />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
