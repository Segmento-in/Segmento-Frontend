'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import NewsletterCard from './NewsletterCard';
import NewsletterModal from './NewsletterModal';
import { ALL_PREFERENCES, getTheme, PreferenceKey } from './NewsletterConfig';

export default function NewsletterHub() {
    const [selectedPreference, setSelectedPreference] = useState<PreferenceKey | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const handleSelectPreference = (preference: PreferenceKey) => {
        setSelectedPreference(preference);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPreference(null), 300);
    };

    const transitionProps = shouldReduceMotion 
        ? { duration: 0 } 
        : { type: 'spring' as const, damping: 25, stiffness: 300 };

    return (
        <div className="w-full py-12 px-6 lg:py-16 lg:px-12">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transitionProps, delay: 0.1 }}
                    className="text-center mb-16"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...transitionProps, delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1.5 mb-6 border border-gray-200 dark:border-gray-700"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Choose Frequency</span>
                    </motion.div>

                    <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                        Segmento Pulse
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Get curated tech news delivered exactly when you want it.
                    </p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="space-y-6">
                    {/* Top Row - 3 Cards (Morning, Afternoon, Evening) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ALL_PREFERENCES.slice(0, 3).map((preferenceKey, index) => {
                            const theme = getTheme(preferenceKey);
                            return (
                                <NewsletterCard
                                    key={preferenceKey}
                                    theme={theme}
                                    onSelect={handleSelectPreference}
                                    index={index}
                                />
                            );
                        })}
                    </div>

                    {/* Bottom Row - 2 Cards (Weekly, Monthly) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ALL_PREFERENCES.slice(3).map((preferenceKey, index) => {
                            const theme = getTheme(preferenceKey);
                            return (
                                <NewsletterCard
                                    key={preferenceKey}
                                    theme={theme}
                                    onSelect={handleSelectPreference}
                                    index={index + 3}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Modal */}
                {selectedPreference && (
                    <NewsletterModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        theme={getTheme(selectedPreference)}
                    />
                )}
            </div>
        </div>
    );
}
