'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pulseAuth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { fetchUserSubscription, UserSubscription } from '@/lib/userApi';
import { User as UserIcon, Mail, ShieldCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import SubscriptionManager from '@/components/SubscriptionManager';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pulseAuth) return;

        const unsubscribe = onAuthStateChanged(pulseAuth, async (currentUser) => {
            if (!currentUser) {
                router.push('/login');
                return;
            }

            setUser(currentUser);

            if (currentUser.email) {
                const subData = await fetchUserSubscription(currentUser.email);
                setSubscription(subData);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0078D4]"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#323130] pb-16">
            {/* Header Area representing Microsoft Admin Center style */}
            <div className="bg-white border-b border-[#EDEBE9] px-8 py-6 mb-8 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-semibold tracking-tight text-[#201F1E]">Account Management</h1>
                        <p className="text-[14px] text-[#605E5C] mt-1">Pulse Administration Center</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar / Identity Profile Menu */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-[4px] border border-[#EDEBE9] shadow-sm">
                                <div className="p-6 border-b border-[#EDEBE9] flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-[#E1DFDD] flex items-center justify-center text-[#605E5C]">
                                        <UserIcon className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-[18px] font-semibold text-[#201F1E] line-clamp-1">
                                            {user.displayName || "Pulse User"}
                                        </h2>
                                        <span className="inline-flex items-center gap-1 mt-1 text-[12px] font-medium text-[#0078D4] bg-[#F3F2F1] px-2 py-0.5 rounded-sm">
                                            <ShieldCheck className="h-3 w-3" /> Standard Identity
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div>
                                        <label className="text-[12px] font-semibold text-[#605E5C] uppercase tracking-wider block mb-1">
                                            Primary Email
                                        </label>
                                        <div className="flex items-center gap-2 text-[14px] text-[#201F1E]">
                                            <Mail className="h-4 w-4 text-[#A19F9D]" />
                                            {user.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[12px] font-semibold text-[#605E5C] uppercase tracking-wider block mb-1">
                                            Status
                                        </label>
                                        <div className="flex items-center gap-2 text-[14px] text-[#201F1E]">
                                            <div className="w-2 h-2 rounded-full bg-[#107C10]"></div>
                                            Active Account
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Optional Nav Panel mimicking Admin sidebar settings */}
                            <div className="bg-white rounded-[4px] border border-[#EDEBE9] shadow-sm p-2">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-[#201F1E] bg-[#F3F2F1] rounded-[2px]">
                                    <Settings className="h-4 w-4 text-[#605E5C]" />
                                    Subscriptions & Alerts
                                </button>
                                {/* Future placeholders to make it look robust */}
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-[#605E5C] hover:bg-[#FAF9F8] rounded-[2px] transition-colors cursor-not-allowed">
                                    <ShieldCheck className="h-4 w-4 text-[#A19F9D]" />
                                    Security & Privacy
                                </button>
                            </div>
                        </div>

                        {/* Right Main Content Area */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[4px] border border-[#EDEBE9] shadow-sm">
                                <div className="px-6 py-5 border-b border-[#EDEBE9]">
                                    <h2 className="text-[18px] font-semibold text-[#201F1E]">Subscriptions & Alerts</h2>
                                    <p className="text-[13px] text-[#605E5C] mt-1">Configure your content delivery schedules and communication preferences.</p>
                                </div>
                                <div className="p-6 bg-[#FAFAFA]">
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
                                        <div className="p-8 text-center bg-white border border-[#EDEBE9] rounded-[4px]">
                                            <p className="text-[14px] text-[#605E5C] mb-4">No active subscription profile found for this identity.</p>
                                            <button
                                                onClick={() => document.querySelector<HTMLElement>('.rainbow-shimmer-btn')?.click()}
                                                className="px-4 py-2 bg-[#0078D4] hover:bg-[#106EBE] text-white text-[14px] font-medium rounded-[2px] transition-colors"
                                            >
                                                Initialize Preferences
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
