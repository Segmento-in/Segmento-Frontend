'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Brain, Shield, Sparkles } from 'lucide-react';

export default function PulseSideBanner() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-close after 60 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 60000);

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        duration: 0.5
                    }}
                    className="fixed bottom-4 left-4 z-50 w-80 md:w-96"
                >
                    {/* Light Theme Card - Matching Segmento.in */}
                    <div className="relative bg-white border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Subtle gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-50 to-blue-50 opacity-60" />

                        {/* Content Container - Extended with scrolling */}
                        <div className="relative p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 group z-10"
                                aria-label="Close banner"
                            >
                                <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                            </button>

                            {/* Main Title */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-gradient-to-br from-primary to-purple-600 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Welcome to Segmento! 🚀
                                </h3>
                            </div>

                            {/* Intro Text */}
                            <p className="text-sm text-gray-700 leading-relaxed mb-6">
                                Discover our powerful AI-driven products designed to transform how you work with data.
                            </p>

                            {/* Segmento Pulse Section */}
                            <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200/50 hover:border-blue-300/70 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md">
                                        <Brain className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">Segmento Pulse</h4>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">
                                    Your intelligent news companion. Stay ahead with real-time tech updates, AI-powered insights, and curated content.
                                </p>
                                <ul className="space-y-2 text-xs text-gray-600 mb-3">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-bold">✓</span>
                                        <span>Real-time news across AI, Cloud, Data & more</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-bold">✓</span>
                                        <span>AI-powered content curation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-bold">✓</span>
                                        <span>Clutter-free reading experience</span>
                                    </li>
                                </ul>
                                <a
                                    href="/pulse"
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Explore Pulse →
                                </a>
                            </div>

                            {/* Segmento Sense Section */}
                            <div className="mb-4 p-4 bg-gradient-to-br from-primary/5 to-purple-50 rounded-xl border border-primary/30 hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-gradient-to-br from-primary to-purple-600 rounded-md">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">Segmento Sense</h4>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">
                                    Enterprise-grade PII detection and data security. Protect your most sensitive information with industry-leading AI.
                                </p>
                                <ul className="space-y-2 text-xs text-gray-600 mb-3">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">✓</span>
                                        <span>Advanced AI-powered PII detection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">✓</span>
                                        <span>GDPR, HIPAA & SOC2 compliance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-bold">✓</span>
                                        <span>Enterprise-scale data classification</span>
                                    </li>
                                </ul>
                                <a
                                    href="/products/data-classification"
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Learn More →
                                </a>
                            </div>

                            {/* Progress Bar (Auto-close indicator) */}
                            <motion.div
                                className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary via-purple-600 to-blue-600"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{
                                        duration: 60,
                                        ease: "linear"
                                    }}
                                />
                            </motion.div>
                            <p className="text-[10px] text-gray-500 text-center mt-1">
                                Auto-closes in 60s
                            </p>
                        </div>
                    </div>

                    {/* Custom Scrollbar Styles */}
                    <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: rgba(0, 0, 0, 0.05);
                            border-radius: 3px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(157, 23, 160, 0.3);
                            border-radius: 3px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: rgba(157, 23, 160, 0.5);
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
