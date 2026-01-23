'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PreferenceKey, NewsletterTheme } from './NewsletterConfig';

interface NewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: NewsletterTheme;
}

export default function NewsletterModal({ isOpen, onClose, theme }: NewsletterModalProps) {
    const [formData, setFormData] = useState({
        email: '',
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
    const [status, setStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_PULSE_API_URL}/api/subscription/subscribe`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        name: formData.name,
                        preference: theme.id, // NEW: Send preference
                        topics: ['news', 'ai', 'security', 'cloud']
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setStatus({
                    type: 'success',
                    message: theme.successMessage
                });
                setFormData({ email: '', name: '' });
                setIsPolicyAccepted(false);

                // Auto-close after 3 seconds on success
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setStatus({
                    type: 'error',
                    message: data.detail || 'Subscription failed. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Network error. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const Icon = theme.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glassmorphism Container with Theme */}
                            <div className={`
                                relative rounded-3xl overflow-hidden
                                bg-gradient-to-br ${theme.cardGradient}
                                border border-white/20 dark:border-gray-700/30
                                backdrop-blur-xl shadow-2xl
                            `}>
                                {/* Animated Background Gradient */}
                                <div className={`
                                    absolute inset-0 opacity-20
                                    bg-gradient-to-br ${theme.cardGradient}
                                    animate-pulse
                                `} />

                                {/* Content */}
                                <div className="relative z-10 p-8">
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    </button>

                                    {/* Header with Theme Icon */}
                                    <div className="text-center mb-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.2 }}
                                            className={`
                                                inline-flex items-center justify-center
                                                w-20 h-20 rounded-2xl mb-4
                                                bg-gradient-to-br ${theme.cardGradient}
                                                shadow-lg
                                            `}
                                        >
                                            <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                                        </motion.div>

                                        <h2 className={`text-3xl font-bold mb-2 ${theme.textColor}`}>
                                            {theme.emoji} {theme.title}
                                        </h2>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            {theme.tagline}
                                        </p>

                                        {/* Delivery Info Card */}
                                        <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl p-4 backdrop-blur-sm border border-white/30">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    Delivered at {theme.deliveryTime}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {theme.scope}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name Input */}
                                        <div>
                                            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="modal-name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 bg-white/60 dark:bg-gray-800/60 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-current focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 backdrop-blur-sm"
                                                style={{ '--tw-ring-color': theme.glowColor } as any}
                                            />
                                        </div>

                                        {/* Email Input */}
                                        <div>
                                            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="modal-email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                                className="w-full px-4 py-3 bg-white/60 dark:bg-gray-800/60 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-current focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 backdrop-blur-sm"
                                                style={{ '--tw-ring-color': theme.glowColor } as any}
                                            />
                                        </div>

                                        {/* Policy Consent */}
                                        <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl p-4 border border-white/30">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="modal-policy"
                                                    checked={isPolicyAccepted}
                                                    onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                                                    className="mt-1 w-4 h-4 rounded focus:ring-2 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <label htmlFor="modal-policy" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                                        I accept the policy
                                                    </label>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <em>I agree to receive newsletters and promotional emails from SegmentoPulse.</em>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button with Theme */}
                                        <motion.button
                                            type="submit"
                                            disabled={loading || !isPolicyAccepted}
                                            whileHover={{ scale: (loading || !isPolicyAccepted) ? 1 : 1.02 }}
                                            whileTap={{ scale: (loading || !isPolicyAccepted) ? 1 : 0.98 }}
                                            className={`
                                                w-full py-4 px-6 rounded-xl font-semibold text-white
                                                transition-all duration-200 shadow-lg
                                                ${(loading || !isPolicyAccepted)
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : `bg-gradient-to-r ${theme.buttonGradient} hover:shadow-2xl`
                                                }
                                            `}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Subscribing...
                                                </span>
                                            ) : (
                                                `Subscribe to ${theme.title} 🚀`
                                            )}
                                        </motion.button>

                                        {/* Status Message */}
                                        {status.type && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`p-4 rounded-xl ${status.type === 'success'
                                                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                                                    : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
                                                    }`}
                                            >
                                                <p className={`text-sm font-medium ${status.type === 'success'
                                                    ? 'text-green-800 dark:text-green-200'
                                                    : 'text-red-800 dark:text-red-200'
                                                    }`}>
                                                    {status.message}
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* Privacy Note */}
                                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                            We respect your privacy. Unsubscribe anytime with one click.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
