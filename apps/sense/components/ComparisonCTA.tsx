"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Plus } from "lucide-react"
import { Button } from "@/ui/button"
import { motion } from "framer-motion"

export function ComparisonCTA() {
    return (
        <section className="relative overflow-hidden bg-white border-y border-slate-100 py-24">
            
            {/* The Blueprint Grid - Enhanced with a radial mask for depth */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:45px_45px] opacity-[0.15]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
            </div>

            <div className="container relative mx-auto px-4 z-10">
                <div className="mx-auto max-w-5xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        /* Added glowing shadow effect and subtle ring to the border */
                        className="group relative flex flex-col md:flex-row items-center justify-between gap-12 bg-white border border-slate-200 ring-1 ring-indigo-500/10 p-8 md:p-14 rounded-3xl shadow-[0_0_50px_-12px_rgba(113,71,232,0.25)] hover:shadow-[0_0_60px_-12px_rgba(113,71,232,0.4)] transition-shadow duration-500 overflow-hidden"
                    >
                        {/* Decorative background accent inside the card */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#F0F9FF] rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

                        {/* Content Area */}
                        <div className="flex-1 text-center md:text-left relative z-10">
                            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-[#7147E8]" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7147E8]">
                                    Market Analysis
                                </span>
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#2D2D2D] tracking-tight">
                                How Does Segmento <br />
                                <span className="text-[#7147E8]">Stack Up?</span>
                            </h2>
                            <p className="text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed font-medium">
                                Compare our agentless approach with platforms like <span className="text-slate-900 font-semibold">Spirion, BigID,</span> and <span className="text-slate-900 font-semibold">AWS Macie</span>. 
                                See the difference in architecture, performance, and cost.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Button asChild className="h-14 px-10 bg-[#7147E8] hover:bg-[#5B36D1] text-white rounded-2xl font-bold tracking-wider uppercase shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 gap-2 group">
                                    <Link href={`${process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:3000'}/compare`}>
                                        View Analysis
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-14 px-10 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-2xl font-bold tracking-wider uppercase transition-all">
                                    <Link href="/pricing">
                                        See Pricing
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats - Styled as floating data points */}
                        <div className="w-full md:w-auto grid grid-cols-1 gap-8 md:border-l md:border-slate-100 md:pl-16 relative z-10">
                            {[
                                { value: "<15min", label: "Setup Time", color: "text-[#7147E8]" },
                                { value: "<1%", label: "False Positives", color: "text-emerald-500" },
                                { value: "12+", label: "Competitors", color: "text-amber-500" }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center md:items-start group/stat"
                                >
                                    <div className={`text-3xl font-black ${stat.color} tracking-tighter mb-1 flex items-center gap-1`}>
                                        {stat.value}
                                        <Plus className="w-3 h-3 opacity-30 group-hover/stat:rotate-90 transition-transform" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}