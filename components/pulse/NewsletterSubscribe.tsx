'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSubscribe() {
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
                        topics: ['news', 'ai', 'security', 'cloud']
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setStatus({
                    type: 'success',
                    message: data.message || 'Successfully subscribed! Check your email for confirmation.'
                });
                setFormData({ email: '', name: '' });
                setIsPolicyAccepted(false);
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

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-purple-100 dark:border-gray-700"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Subscribe to Newsletter
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Get weekly tech insights, AI trends, and security updates delivered to your inbox
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Policy Consent Checkbox */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="policyConsent"
                                checked={isPolicyAccepted}
                                onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                                className="mt-1 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                            />
                            <div className="flex-1">
                                <label htmlFor="policyConsent" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                    By filling this form I accept the policy.
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <em>I agree that Segmento Pulse is collecting my email and personal information, and I am agreeing to receive promotional emails and newsletters.</em>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Topics Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            You'll receive updates about:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['AI & ML', 'Data Security', 'Cloud Computing', 'Tech News'].map((topic) => (
                                <span
                                    key={topic}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                >
                                    ✓ {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading || !isPolicyAccepted}
                        whileHover={{ scale: (loading || !isPolicyAccepted) ? 1 : 1.02 }}
                        whileTap={{ scale: (loading || !isPolicyAccepted) ? 1 : 0.98 }}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${(loading || !isPolicyAccepted)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                            }`}
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
                            'Subscribe Now 🚀'
                        )}
                    </motion.button>

                    {/* Status Message */}
                    {status.type && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg ${status.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700'
                                : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
                                }`}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {status.type === 'success' ? (
                                        <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <p className={`ml-3 text-sm font-medium ${status.type === 'success'
                                    ? 'text-green-800 dark:text-green-200'
                                    : 'text-red-800 dark:text-red-200'
                                    }`}>
                                    {status.message}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Privacy Note */}
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        We respect your privacy. Unsubscribe at any time with one click.
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
