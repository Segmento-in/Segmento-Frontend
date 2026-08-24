'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserSubscription } from '@/lib/userApi';
import { Loader2, AlertCircle } from 'lucide-react';
import { getApiBase } from '@/lib/apiBase';

interface SubscriptionManagerProps {
    initialSubscription: UserSubscription;
    onUpdate?: () => void;
}

const NEWSLETTER_TYPES = [
    {
        id: 'Morning',
        title: 'Morning Brief',
        description: 'Start your day with overnight breaking news (7 AM IST)',
        icon: '☀️'
    },
    {
        id: 'Afternoon',
        title: 'Midday Update',
        description: 'Quick catch-up on emerging stories (2 PM IST)',
        icon: '📰'
    },
    {
        id: 'Evening',
        title: 'Evening Digest',
        description: 'Comprehensive daily wrap-up (7 PM IST)',
        icon: '🌙'
    },
    {
        id: 'Weekly',
        title: 'Weekly Roundup',
        description: 'Best stories of the week, every Sunday',
        icon: '📅'
    },
    {
        id: 'Monthly',
        title: 'Monthly Intelligence',
        description: 'Deep dive analysis, 1st of every month',
        icon: '📊'
    }
];

export default function SubscriptionManager({ initialSubscription, onUpdate }: SubscriptionManagerProps) {
    // Determine active subscriptions
    const getInitialState = () => {
        if (initialSubscription.subscriptions) {
            return initialSubscription.subscriptions;
        }
        const fallback: Record<string, boolean> = {};
        if (initialSubscription.preference) {
            fallback[initialSubscription.preference] = true;
        }
        return fallback;
    };

    const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>(getInitialState());
    const [toggling, setToggling] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async (typeId: string, currentState: boolean) => {
        setToggling(typeId);
        setError(null);

        try {
            const newState = !currentState;
            const API_BASE = getApiBase();
            const endpoint = newState
                ? `${API_BASE}/api/subscription/subscribe`
                : `${API_BASE}/api/subscription/unsubscribe`;

            const method = 'POST';
            const body = newState
                ? {
                    email: initialSubscription.email,
                    name: initialSubscription.name,
                    preference: typeId,
                    topics: initialSubscription.topics || ['news']
                }
                : {
                    email: initialSubscription.email,
                    preference: typeId
                };

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.detail || data.message || 'Failed to update subscription');
            }

            setSubscriptions(prev => ({
                ...prev,
                [typeId]: newState
            }));

            if (onUpdate) onUpdate();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setToggling(null);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl flex items-center gap-3 border border-red-200 dark:border-red-900/50 backdrop-blur-md"
                >
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </motion.div>
            )}

            <div className="space-y-3">
                {NEWSLETTER_TYPES.map((type) => {
                    const isActive = subscriptions[type.id] || false;
                    const isProcessing = toggling === type.id;

                    return (
                        <motion.div
                            key={type.id}
                            layout
                            className={`
                                relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                                ${isActive
                                    ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 shadow-sm'
                                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                                }
                            `}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`
                                    w-12 h-12 flex items-center justify-center rounded-2xl text-2xl transition-transform duration-500
                                    ${isActive ? 'bg-white dark:bg-zinc-800 shadow-sm scale-110' : 'bg-zinc-50 dark:bg-zinc-950/50 opacity-80'}
                                `}>
                                    {type.icon}
                                </div>
                                <div>
                                    <h3 className={`text-base font-bold transition-colors duration-300 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                        {type.title}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-0.5">{type.description}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggle(type.id, isActive)}
                                disabled={isProcessing}
                                className={`
                                    relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-zinc-900
                                    ${isActive ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'}
                                    ${isProcessing ? 'opacity-70 cursor-wait' : ''}
                                `}
                            >
                                <span className="sr-only">Toggle {type.title}</span>
                                <span
                                    aria-hidden="true"
                                    className={`
                                        pointer-events-none inline-flex h-6 w-6 transform rounded-full bg-white dark:bg-zinc-900 shadow-sm ring-0 
                                        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                                        ${isActive ? 'translate-x-5' : 'translate-x-0'}
                                    `}
                                />
                                {isProcessing && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className={`h-4 w-4 animate-spin ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-500'}`} />
                                    </div>
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-8 text-right">
                <p className="text-xs uppercase tracking-[0.15em] font-bold text-zinc-400 dark:text-zinc-600">
                    Changes sync instantly via Pulse Core API
                </p>
            </div>
        </div>
    );
}
