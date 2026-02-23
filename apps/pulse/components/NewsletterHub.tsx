'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NewsletterCard from './NewsletterCard';
import NewsletterModal from './NewsletterModal';
import { ALL_PREFERENCES, getTheme, PreferenceKey } from './NewsletterConfig';

export default function NewsletterHub() {
    const [selectedPreference, setSelectedPreference] = useState<PreferenceKey | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectPreference = (preference: PreferenceKey) => {
        setSelectedPreference(preference);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPreference(null), 300);
    };

    return (
        <div className="w-full py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Segmento Pulse
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Get curated tech news delivered exactly when you want it.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pick your perfect schedule below
                    </p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="space-y-4">
                    {/* Top Row - 3 Cards (Morning, Afternoon, Evening) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
