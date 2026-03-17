"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useSpring, useTransform, useMotionValue, animate } from "framer-motion"
import { Shield, Activity, TrendingUp, Zap, Globe, ArrowRight, ShieldCheck, Plus, Cpu, Network, Lock } from "lucide-react"
import { Button } from "@/ui/button" 

// --- 1. COMPARISON CTA (Top Part) ---
export function ComparisonCTA() {
    const stats = [
        { value: "<15min", label: "Setup Time", icon: Zap, color: "text-amber-500", bg: "bg-amber-50/50" },
        { value: "99.9%", label: "Accuracy", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50/50" },
        { value: "12+", label: "Integrations", icon: Plus, color: "text-blue-600", bg: "bg-blue-50/50" },
        { value: "24/7", label: "Monitoring", icon: Activity, color: "text-rose-500", bg: "bg-rose-50/50" },
    ]

    return (
        <section className="relative pt-32 pb-0 bg-[#F8FAFF] overflow-hidden">
            <div className="container relative mx-auto px-6 z-10 max-w-6xl text-center mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
                >
                    <Network className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Enterprise Benchmark</span>
                </motion.div>
                
                <h2 className="text-5xl md:text-7xl font-black text-[#0F172A] leading-[0.9] tracking-tighter mb-8">
                    The New Standard <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 italic font-serif py-2 inline-block">of Security</span>
                </h2>

                <div className="relative overflow-hidden py-10 border-y border-slate-200/60">
                    <motion.div 
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex items-center whitespace-nowrap"
                    >
                        {[stats, stats].map((set, idx) => (
                            <div key={idx} className="flex items-center">
                                {set.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-6 px-12">
                                        <div className={`p-4 rounded-2xl border border-white shadow-sm ${stat.bg}`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-4xl font-black text-[#0F172A] tracking-tighter">{stat.value}</span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">{stat.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// --- 2. COUNTER & DYNAMIC GRAPHS ---
export function CounterSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    
    // Counter Logic
    const count = useMotionValue(0)
    const springCount = useSpring(count, { stiffness: 40, damping: 20 }) 
    const rounded = useTransform(springCount, (latest) => Math.round(latest))
    const themeColor = useTransform(springCount, [0, 50], ["#EF4444", "#3B82F6"])

    useEffect(() => {
        if (isInView) {
            animate(count, 50, { duration: 3, ease: [0.16, 1, 0.3, 1] })
        }
    }, [isInView, count])

    return (
        <section ref={ref} className="relative pb-32 bg-[#F8FAFF] overflow-hidden pt-4">
            <div className="container relative mx-auto px-6 z-10 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Counter Card with Live Graph */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-8 bg-white border border-slate-200 p-10 rounded-[40px] shadow-sm relative overflow-hidden"
                    >
                        {/* Live Frequency Graph (Background) */}
                        <div className="absolute top-0 right-0 w-full h-48 opacity-[0.05] pointer-events-none">
                            <svg viewBox="0 0 400 100" className="w-full h-full">
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={isInView ? { pathLength: 1 } : {}}
                                    transition={{ duration: 4 }}
                                    d="M0 50 Q 25 10 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                                        <Cpu className="w-4 h-4 animate-pulse" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Counter</span>
                                </div>
                                <div className="flex gap-1 h-6 items-end">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div 
                                            key={i}
                                            animate={{ height: ["20%", "100%", "40%"] }}
                                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                            className="w-1 bg-blue-200 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex items-baseline">
                                <motion.div 
                                    style={{ color: themeColor }}
                                    className="text-[9rem] md:text-[12rem] font-black tracking-tighter leading-none"
                                >
                                    <motion.span>{rounded}</motion.span>
                                    <span className="text-4xl md:text-6xl ml-4 font-black text-slate-200">M+</span>
                                </motion.div>
                            </div>

                            <div className="mt-10 flex flex-col md:flex-row justify-between items-end gap-6">
                                <div className="max-w-[300px]">
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Total records protected across global endpoints by Segmento Sense.
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-blue-600 uppercase mb-2">Network Load</span>
                                    <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            style={{ backgroundColor: themeColor }}
                                            initial={{ width: 0 }}
                                            animate={isInView ? { width: "100%" } : {}}
                                            transition={{ duration: 3 }}
                                            className="h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Dynamic Cards */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {[
                            { icon: Globe, label: "Network Edge", value: "142 Cities", graph: true },
                            { icon: TrendingUp, label: "Speed", value: "9.2 GB/s", graph: false }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex flex-col justify-between flex-1 relative overflow-hidden group"
                            >
                                <div className="flex justify-between">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="h-4 flex gap-0.5 items-end">
                                        {[...Array(4)].map((_, j) => (
                                            <motion.div 
                                                key={j}
                                                animate={{ height: ["40%", "100%", "60%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }}
                                                className="w-0.5 bg-slate-200 group-hover:bg-blue-300"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div className="text-3xl font-black text-[#0F172A] mb-1">{item.value}</div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                                </div>
                                
                                {/* Background Decorative Circle */}
                                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final Buttons */}
                
            </div>
        </section>
    )
}