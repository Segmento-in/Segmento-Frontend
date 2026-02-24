'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pulseAuth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { fetchUserSubscription, UserSubscription } from '@/lib/userApi';
import { User as UserIcon, Mail } from 'lucide-react';
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

            // Fetch subscription data
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
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="container py-12 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
                <p className="text-gray-500 mb-8">Manage your profile and news preferences.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <UserIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Profile</h2>
                                <p className="text-sm text-gray-500">Your account details</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Email Address</label>
                                <div className="flex items-center gap-2 text-gray-700 mt-1">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Manager */}
                    <div className="relative">
                        {/* Wrapper for z-index context if needed */}
                        {subscription ? (
                            <SubscriptionManager
                                initialSubscription={subscription}
                                onUpdate={async () => {
                                    // Refresh data
                                    if (user.email) {
                                        const fresh = await fetchUserSubscription(user.email);
                                        if (fresh) setSubscription(fresh);
                                    }
                                }}
                            />
                        ) : (
                            // Fallback if no subscription found
                            <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center">
                                <p className="text-gray-500 mb-4">No active subscription profile found.</p>
                                <button
                                    onClick={() => document.querySelector<HTMLElement>('.rainbow-shimmer-btn')?.click()}
                                    className="text-blue-600 hover:underline"
                                >
                                    Subscribe to access preferences
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
