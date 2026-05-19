'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FlaskConical,
    Cpu,
    Zap,
    BarChart2,
    Shield,
} from 'lucide-react';

const BADGE_MODELS = [
    {
        label: 'NER',
        color:
            'from-blue-50 to-blue-100 border-blue-200 text-blue-700 dark:from-blue-500/10 dark:to-blue-500/5 dark:border-blue-500/20 dark:text-blue-300',
    },
    {
        label: 'GLiNER',
        color:
            'from-purple-50 to-purple-100 border-purple-200 text-purple-700 dark:from-purple-500/10 dark:to-purple-500/5 dark:border-purple-500/20 dark:text-purple-300',
    },
    {
        label: 'Rule-based',
        color:
            'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700 dark:from-emerald-500/10 dark:to-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-300',
    },
    {
        label: 'Statistical',
        color:
            'from-amber-50 to-amber-100 border-amber-200 text-amber-700 dark:from-amber-500/10 dark:to-amber-500/5 dark:border-amber-500/20 dark:text-amber-300',
    },
    {
        label: '12 Models',
        color:
            'from-rose-50 to-rose-100 border-rose-200 text-rose-700 dark:from-rose-500/10 dark:to-rose-500/5 dark:border-rose-500/20 dark:text-rose-300',
    },
    {
        label: 'F1 Scoring',
        color:
            'from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700 dark:from-cyan-500/10 dark:to-cyan-500/5 dark:border-cyan-500/20 dark:text-cyan-300',
    },
];

const STAT_CARDS = [
    {
        icon: Cpu,
        value: '12',
        label: 'AI Models',
        color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        icon: BarChart2,
        value: 'F1/P/R',
        label: 'Metrics',
        color: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: Shield,
        value: '37',
        label: 'PII Types',
        color: 'text-purple-600 dark:text-purple-400',
    },
    {
        icon: Zap,
        value: '6',
        label: 'File Formats',
        color: 'text-amber-600 dark:text-amber-400',
    },
];

export default function ModelLabHero() {
    return (
        <section className="relative overflow-hidden pt-28 pb-16 px-4 bg-gradient-to-b from-white to-slate-50 dark:from-[#020617] dark:to-[#0F172A] transition-colors duration-300">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Orbs */}
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-[120px]" />

                <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[100px]" />

                <div className="absolute bottom-0 left-[40%] w-[300px] h-[300px] rounded-full bg-purple-400/8 dark:bg-purple-500/10 blur-[80px]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className="relative max-w-5xl mx-auto text-center">
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-emerald-300 bg-emerald-50 shadow-sm dark:bg-emerald-500/10 dark:border-emerald-500/20"
                >
                    <FlaskConical
                        size={13}
                        className="text-emerald-600 dark:text-emerald-400"
                    />

                    <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-700 dark:text-emerald-300">
                        PII Benchmarking Observatory
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-[1.1]"
                >
                    <span className="text-slate-900 dark:text-white">
                        Measure AI Accuracy.
                    </span>

                    <br />

                    <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                        No Guesswork.
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Upload a labeled dataset → pick any of 12 AI models →
                    get honest{' '}
                    <span className="text-slate-800 dark:text-slate-100 font-semibold">
                        F1 / Precision / Recall
                    </span>{' '}
                    scores. Compare them side-by-side. Know which model
                    actually works.
                </motion.p>

                {/* Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {BADGE_MODELS.map((b) => (
                        <span
                            key={b.label}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r shadow-sm transition-colors duration-300 ${b.color}`}
                        >
                            {b.label}
                        </span>
                    ))}
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
                >
                    {STAT_CARDS.map(
                        ({ icon: Icon, value, label, color }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center gap-1.5 px-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/80 dark:border-slate-700 dark:shadow-black/20"
                            >
                                <Icon size={18} className={color} />

                                <span
                                    className={`text-2xl font-black ${color}`}
                                >
                                    {value}
                                </span>

                                <span className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                    {label}
                                </span>
                            </div>
                        )
                    )}
                </motion.div>
            </div>
        </section>
    );
}