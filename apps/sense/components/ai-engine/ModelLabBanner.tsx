"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, BarChart2, Shield, Zap, Target } from 'lucide-react';

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

export function ModelLabBanner() {
    return (
        <section className="relative w-full bg-slate-50 pt-8 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
                >
                    {/* Background accents */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10 p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-12">
                        
                        {/* Left: Text & Badges */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm">
                                <Target size={14} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-700 dark:text-emerald-300">
                                    PII Benchmarking Observatory
                                </span>
                            </div>
                            
                            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                                Measure AI Accuracy. <br className="hidden sm:block" />
                                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">No Guesswork.</span>
                            </h3>
                            
                            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                                Upload a labeled dataset, pick your models, and get honest F1 / Precision / Recall scores side-by-side. Know which model actually works for your exact data.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {BADGE_MODELS.map((b) => (
                                    <span
                                        key={b.label}
                                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border bg-gradient-to-r shadow-sm transition-colors duration-300 ${b.color}`}
                                    >
                                        {b.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right: Stat Cards (Grid) */}
                        <div className="flex-1 w-full lg:w-auto">
                            <div className="grid grid-cols-2 gap-4">
                                {STAT_CARDS.map(({ icon: Icon, value, label, color }, idx) => (
                                    <motion.div
                                        key={label}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
                                        className="flex flex-col items-center justify-center gap-1.5 px-4 py-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <Icon size={20} className={color} />
                                        <span className={`text-3xl font-black ${color}`}>
                                            {value}
                                        </span>
                                        <span className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 mt-1">
                                            {label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
