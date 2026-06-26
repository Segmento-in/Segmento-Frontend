'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface OutOfCreditsModalProps {
    open: boolean;
    onClose: () => void;
    /** Remaining credits (usually 0 when this fires) */
    creditsRemaining?: number;
}

export default function OutOfCreditsModal({
    open,
    onClose,
    creditsRemaining = 0,
}: OutOfCreditsModalProps) {
    // Find next Sunday
    const today = new Date();
    const daysUntilSunday = (7 - today.getDay()) % 7 || 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    const sundayLabel = nextSunday.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-md bg-[#0B1120] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">

                            {/* Gradient header strip */}
                            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500" />

                            <div className="p-6 sm:p-8">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Icon */}
                                <div className="flex justify-center mb-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-rose-500/20 border border-violet-500/30 flex items-center justify-center">
                                        <Zap className="w-8 h-8 text-violet-400" />
                                    </div>
                                </div>

                                {/* Heading */}
                                <h2 className="text-2xl font-black text-white text-center mb-2 tracking-tight">
                                    Out of Scan Credits
                                </h2>
                                <p className="text-slate-400 text-sm text-center leading-relaxed mb-6">
                                    You&apos;ve used all your scan credits for this week.
                                    Credits are automatically restored every Sunday.
                                </p>

                                {/* Credit counter */}
                                <div className="flex items-center justify-between px-5 py-3.5 mb-5 rounded-xl bg-white/5 border border-white/10">
                                    <span className="text-slate-400 text-sm font-medium">Credits remaining</span>
                                    <span className="text-2xl font-black text-rose-400">{creditsRemaining}</span>
                                </div>

                                {/* Next restoration */}
                                <div className="flex items-start gap-3 px-4 py-3.5 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-0.5">
                                            Next Restoration
                                        </p>
                                        <p className="text-slate-300 text-sm font-medium">{sundayLabel}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">
                                            100 credits restored automatically every Sunday.
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/profile"
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30"
                                    >
                                        View Your Dashboard
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors border border-white/10 hover:border-white/20"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
