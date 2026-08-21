/**
 * NewsletterCTA — Client Component
 * Requires "use client" for the email input onChange and the
 * onMouseEnter/onMouseLeave decorative link effects.
 *
 * PRD §Phase 4.5:
 *   Container: dark #1A1A1A, 8px border-radius
 *   Layout: Flexbox — text+input left, geometric illustration right
 *   Input Group: inline flex (borderless input + PrimaryActionButton)
 */

"use client";

import { useState } from "react";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";
import NewsletterHub from "../NewsletterHub";
import { motion, useReducedMotion } from "framer-motion";

export function NewsletterCTA() {
    const [isNewsletterHubOpen, setIsNewsletterHubOpen] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const transitionProps = shouldReduceMotion 
        ? { duration: 0 } 
        : { type: 'spring' as const, damping: 25, stiffness: 300 };

    return (
        <section className="py-24 bg-[var(--pulse-color-bg-surface-tint)] relative overflow-hidden">
            <div className="pulse-container relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={transitionProps}
                    className="relative bg-[var(--pulse-color-bg-surface-dark)] rounded-[var(--pulse-radius-card)] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl border border-white/5 dark:border-white/10"
                >
                    {/* Decorative floating orbs with parallax */}
                    <motion.div 
                        animate={shouldReduceMotion ? {} : { 
                            y: [0, -20, 0],
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.4, 0.3]
                        }}
                        transition={shouldReduceMotion ? {} : { 
                            duration: 8, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                        }}
                        className="absolute -top-20 right-[20%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] pointer-events-none blur-3xl" 
                    />
                    <motion.div 
                        animate={shouldReduceMotion ? {} : { 
                            y: [0, 30, 0],
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.3, 0.2]
                        }}
                        transition={shouldReduceMotion ? {} : { 
                            duration: 10, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="absolute -bottom-32 right-10 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25)_0%,transparent_70%)] pointer-events-none blur-3xl" 
                    />

                    {/* Left — text + form */}
                    <div className="flex-1 max-w-2xl relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transitionProps, delay: 0.1 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/10"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-xs font-semibold text-[var(--pulse-color-text-inverse)] uppercase tracking-wider">Newsletter · 3× Daily</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transitionProps, delay: 0.2 }}
                            className="text-4xl lg:text-5xl font-extrabold text-[var(--pulse-color-text-inverse)] tracking-tight leading-[1.1] mb-6"
                        >
                            Get the weekly Pulse digest delivered straight to your inbox.
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transitionProps, delay: 0.3 }}
                            className="text-[var(--pulse-color-text-muted)] text-lg lg:text-xl mb-10 max-w-lg leading-relaxed"
                        >
                            Curated AI, Cloud, and Data intelligence from Segmento Pulse.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...transitionProps, delay: 0.4 }}
                        >
                            <motion.div
                                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                                className="inline-block relative group"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
                                <PrimaryActionButton
                                    onClick={() => setIsNewsletterHubOpen(true)}
                                    className="relative rounded-full text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-50 hover:text-black border-none shadow-xl font-bold tracking-wide transition-all"
                                    size="lg"
                                >
                                    Choose Subscription Schedule
                                </PrimaryActionButton>
                            </motion.div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 font-medium">
                                We offer Morning, Midday, Evening, Weekly, and Monthly options.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right — geometric illustration */}
                    <motion.div 
                        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ ...transitionProps, delay: 0.3 }}
                        className="shrink-0 w-64 h-64 lg:w-80 lg:h-80 relative flex items-center justify-center z-10 hidden md:flex"
                    >
                        <motion.div 
                            animate={shouldReduceMotion ? {} : { rotate: 360 }}
                            transition={shouldReduceMotion ? {} : { duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute w-48 h-48 lg:w-64 lg:h-64 border border-purple-500/30 rounded-full" 
                        />
                        <motion.div 
                            animate={shouldReduceMotion ? {} : { rotate: -360 }}
                            transition={shouldReduceMotion ? {} : { duration: 50, repeat: Infinity, ease: "linear" }}
                            className="absolute w-32 h-32 lg:w-44 lg:h-44 border border-blue-500/30 rounded-2xl rotate-45" 
                        />
                        <motion.div 
                            animate={shouldReduceMotion ? {} : { 
                                y: [-10, 10, -10],
                                rotate: [0, 90, 0]
                            }}
                            transition={shouldReduceMotion ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-12 h-12 lg:w-16 lg:h-16 border border-emerald-500/40 rounded-full top-8 right-8 lg:top-12 lg:right-12 bg-emerald-500/10 backdrop-blur-sm" 
                        />
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl relative z-20">
                            <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Global Newsletter Hub Overlay */}
            {isNewsletterHubOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsNewsletterHubOpen(false)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800"
                    >
                        <button
                            onClick={() => setIsNewsletterHubOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 z-10 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="pt-4">
                            <NewsletterHub />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
