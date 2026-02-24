'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSubscription } from '@/lib/userApi';
import { Loader2, Check, AlertCircle } from 'lucide-react';

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
    // Priority: 'subscriptions' dict > legacy 'preference' > none
    const getInitialState = () => {
        if (initialSubscription.subscriptions) {
            return initialSubscription.subscriptions;
        }
        // Fallback for legacy data: assume only the legacy preference is active
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
            const endpoint = newState
                ? '/pulse/api/subscription/subscribe'
                : '/pulse/api/subscription/unsubscribe';

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

            // Update local state
            setSubscriptions(prev => ({
                ...prev,
                [typeId]: newState
            }));

            if (onUpdate) onUpdate();

        } catch (err: any) {
            setError(err.message);
            // Revert on error? Or just show error
        } finally {
            setToggling(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>Manage Subscriptions</span>
                    <span className="text-blue-500 text-xs font-normal border border-blue-100 bg-blue-50 px-2 py-0.5 rounded-full">
                        New
                    </span>
                </h2>
                <p className="text-sm text-gray-500">Customize which newsletters you receive.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
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
                                relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                                ${isActive
                                    ? 'border-blue-200 bg-blue-50/50'
                                    : 'border-gray-100 hover:border-gray-200'
                                }
                            `}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-2xl mt-1">{type.icon}</div>
                                <div>
                                    <h3 className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                                        {type.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{type.description}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggle(type.id, isActive)}
                                disabled={isProcessing}
                                className={`
                                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    ${isActive ? 'bg-blue-600' : 'bg-gray-200'}
                                    ${isProcessing ? 'opacity-70 cursor-wait' : ''}
                                `}
                            >
                                <span className="sr-only">Use setting</span>
                                <span
                                    aria-hidden="true"
                                    className={`
                                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                                        transition duration-200 ease-in-out
                                        ${isActive ? 'translate-x-5' : 'translate-x-0'}
                                    `}
                                />
                                {isProcessing && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                                    </div>
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                    Changes are saved automatically.
                </p>
            </div>
        </div>
    );
}
