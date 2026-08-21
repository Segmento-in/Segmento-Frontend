'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { PreferenceKey, NewsletterTheme } from './NewsletterConfig';
import { getApiBase } from '@/lib/apiBase';

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

    const shouldReduceMotion = useReducedMotion();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const API_BASE = getApiBase();
            const response = await fetch(
                `${API_BASE}/api/subscription/subscribe`,
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

    const transitionProps = shouldReduceMotion 
        ? { duration: 0 } 
        : { type: 'spring' as const, damping: 25, stiffness: 300 };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20 }}
                            transition={transitionProps}
                            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glassmorphism Container with Theme */}
                            <div className={`
                                relative rounded-3xl overflow-hidden
                                bg-linear-to-br ${theme.cardGradient}
                                border border-white/20 dark:border-white/10
                                backdrop-blur-2xl shadow-2xl
                            `}>
                                {/* Animated Background Gradient */}
                                <motion.div 
                                    animate={shouldReduceMotion ? {} : { opacity: [0.15, 0.25, 0.15] }}
                                    transition={shouldReduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className={`
                                        absolute inset-0 
                                        bg-linear-to-br ${theme.cardGradient}
                                        blur-2xl
                                    `} 
                                />

                                {/* Content */}
                                <div className="relative z-10 p-8 sm:p-10">
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-6 right-6 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-900 dark:text-white" />
                                    </button>

                                    {/* Header with Theme Icon */}
                                    <div className="text-center mb-8">
                                        <motion.div
                                            initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ ...transitionProps, delay: shouldReduceMotion ? 0 : 0.1 }}
                                            className={`
                                                inline-flex items-center justify-center
                                                w-20 h-20 rounded-2xl mb-5
                                                bg-linear-to-br ${theme.cardGradient}
                                                shadow-[0_10px_20px_rgba(0,0,0,0.2)]
                                                border border-white/20
                                            `}
                                        >
                                            <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                                        </motion.div>

                                        <h2 className="text-3xl font-extrabold mb-2 text-white tracking-tight">
                                            {theme.emoji} {theme.title}
                                        </h2>
                                        <p className="text-white/80 font-medium mb-5">
                                            {theme.frequency}
                                        </p>

                                        {/* Delivery Info Card */}
                                        <div className="bg-black/20 dark:bg-black/40 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-bold text-white">
                                                    Delivered at {theme.deliveryTime}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/70">
                                                {theme.scope}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Name Input */}
                                        <div>
                                            <label htmlFor="modal-name" className="block text-sm font-semibold text-white/90 mb-2">
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
                                                className="w-full px-5 py-4 bg-white/10 dark:bg-black/20 border border-white/20 rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white outline-none transition-all duration-200 text-white placeholder-white/40 backdrop-blur-md font-medium"
                                            />
                                        </div>

                                        {/* Email Input */}
                                        <div>
                                            <label htmlFor="modal-email" className="block text-sm font-semibold text-white/90 mb-2">
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
                                                className="w-full px-5 py-4 bg-white/10 dark:bg-black/20 border border-white/20 rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white outline-none transition-all duration-200 text-white placeholder-white/40 backdrop-blur-md font-medium"
                                            />
                                        </div>

                                        {/* Policy Consent */}
                                        <div className="bg-black/10 dark:bg-black/30 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="modal-policy"
                                                    checked={isPolicyAccepted}
                                                    onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                                                    className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer transition-colors"
                                                />
                                                <div className="flex-1">
                                                    <label htmlFor="modal-policy" className="text-sm font-semibold text-white cursor-pointer select-none">
                                                        I accept the policy
                                                    </label>
                                                    <p className="text-xs text-white/60 mt-1">
                                                        <em>I agree to receive newsletters and promotional emails from SegmentoPulse.</em>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button with Theme */}
                                        <motion.button
                                            type="submit"
                                            disabled={loading || !isPolicyAccepted}
                                            whileHover={shouldReduceMotion ? {} : { scale: (loading || !isPolicyAccepted) ? 1 : 1.02 }}
                                            whileTap={shouldReduceMotion ? {} : { scale: (loading || !isPolicyAccepted) ? 1 : 0.98 }}
                                            className={`
                                                w-full py-4 px-6 rounded-xl font-bold text-white text-lg
                                                transition-all duration-200 shadow-xl
                                                ${(loading || !isPolicyAccepted)
                                                    ? 'bg-black/20 text-white/50 cursor-not-allowed border border-white/10'
                                                    : `bg-linear-to-r ${theme.buttonGradient} hover:shadow-2xl border border-white/20`
                                                }
                                            `}
                                        >
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <motion.span 
                                                        key="loading"
                                                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                                                        className="flex items-center justify-center gap-2"
                                                    >
                                                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                                                        Subscribing...
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="default"
                                                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                                                        className="block"
                                                    >
                                                        Subscribe to {theme.title} 🚀
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>

                                        {/* Status Message */}
                                        <AnimatePresence>
                                            {status.type && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={transitionProps}
                                                    className="overflow-hidden"
                                                >
                                                    <div className={`
                                                        p-4 rounded-xl backdrop-blur-md border 
                                                        ${status.type === 'success'
                                                            ? 'bg-emerald-500/20 border-emerald-500/50'
                                                            : 'bg-red-500/20 border-red-500/50'
                                                        }
                                                    `}>
                                                        <p className={`text-sm font-semibold text-center ${
                                                            status.type === 'success' ? 'text-emerald-50' : 'text-red-50'
                                                        }`}>
                                                            {status.message}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Privacy Note */}
                                        <p className="text-xs text-center text-white/50 pt-2 font-medium">
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
