"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Shield, Wrench, CheckCircle2, ArrowUpRight, Activity, Zap, Layers, Lock } from "lucide-react"

const features = [
    {
        id: "discover",
        title: "Discover",
        icon: Search,
        colorTheme: "from-blue-600 via-cyan-400 to-emerald-400",
        accent: "text-blue-600",
        description: "Automatically discover PII across all data sources with real-time scanning and multi-language support.",
        details: ["Structured & Unstructured support", "Real-time scanning accuracy", "100+ Languages supported", "Full source coverage"],
    },
    {
        id: "classify",
        title: "Classify",
        icon: Filter,
        colorTheme: "from-indigo-600 via-purple-500 to-pink-500",
        accent: "text-indigo-600",
        description: "AI-powered data classification with automated categorization by sensitivity level and compliance.",
        details: ["Sensitivity categorization", "Custom logic rules", "Identity-centric mapping", "GDPR & HIPAA ready"],
    },
    {
        id: "protect",
        title: "Protect",
        icon: Shield,
        colorTheme: "from-fuchsia-600 via-rose-500 to-orange-400",
        accent: "text-rose-600",
        description: "Automated data masking, redaction, and encryption for PII protection and access control.",
        details: ["Automated masking", "Field-level encryption", "Access governance", "Secure handling"],
    },
    {
        id: "remediate",
        title: "Remediate",
        icon: Wrench,
        colorTheme: "from-emerald-600 via-teal-500 to-sky-400",
        accent: "text-emerald-600",
        description: "Automated risk remediation workflows with data minimization and retention enforcement.",
        details: ["Risk workflows", "Data minimization", "Retention enforcement", "Audit reporting"],
    },
]

export function FeaturesOverview() {
    const [activeFeature, setActiveFeature] = useState("discover")
    const active = features.find((f) => f.id === activeFeature) || features[0]

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header Section - Centered */}
                <div className="text-center mb-16 max-w-4xl mx-auto space-y-6">
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
                        Free your data from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">documents.</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        A comprehensive suite of APIs for all your PII detection and protection needs.
                    </p>
                </div>

                {/* TABS - Forced One Line */}
                <div className="flex justify-center mb-20">
                    <div className="flex flex-nowrap items-center gap-2 p-2 bg-slate-50/80 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 overflow-x-auto no-scrollbar max-w-full">
                        {features.map((f) => {
                            const Icon = f.icon
                            const isActive = activeFeature === f.id
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFeature(f.id)}
                                    className={`flex items-center gap-3 px-8 py-3.5 rounded-[2rem] transition-all duration-300 whitespace-nowrap ${
                                        isActive 
                                        ? "bg-slate-900 text-white shadow-xl scale-105" 
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                                    }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? "" : "opacity-70"}`} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.15em]">{f.title}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    
                    {/* LEFT SIDE: Content Info */}
                    <div className="space-y-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active.id}
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="space-y-10"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-5xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase ">
                                        {active.title}
                                    </h3>
                                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                                        {active.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {active.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                            <CheckCircle2 className={`h-5 w-5 ${active.accent} shrink-0`} />
                                            <span className="text-slate-700 font-bold text-[13px] tracking-tight">{detail}</span>
                                        </div>
                                    ))}
                                </div>

                               
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT SIDE: Colorful Dynamic Visuals */}
                    <div className="relative min-h-[500px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`viz-${active.id}`}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 0.6, ease: "anticipate" }}
                                className="w-full flex items-center justify-center"
                            >
                                {active.id === "discover" && (
                                    <div className="relative flex items-end gap-3 h-72 w-full max-w-sm px-6">
                                        {[40, 70, 45, 90, 65, 80, 55, 95, 60, 85].map((h, i) => (
                                            <motion.div 
                                                key={i}
                                                animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`], opacity: [0.7, 1, 0.7] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                                className={`flex-1 rounded-full bg-gradient-to-t ${active.colorTheme} shadow-2xl`}
                                            />
                                        ))}
                                        <div className="absolute -top-16 left-0 right-0 flex justify-center">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase shadow-xl">
                                                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                                                Live Processing
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {active.id === "classify" && (
                                    <div className="relative w-80 h-80">
                                        {[1, 0.7, 0.4].map((scale, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                                transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                                                className={`absolute inset-0 rounded-[3.5rem] border-2 border-dashed ${active.accent} opacity-20`}
                                                style={{ scale }}
                                            />
                                        ))}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div 
                                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                                                transition={{ duration: 5, repeat: Infinity }}
                                                className={`w-40 h-40 rounded-[3rem] bg-gradient-to-br ${active.colorTheme} flex items-center justify-center shadow-2xl shadow-indigo-500/40`}
                                            >
                                                <Layers className="text-white w-16 h-16" />
                                            </motion.div>
                                        </div>
                                    </div>
                                )}

                                {active.id === "protect" && (
                                    <div className="grid grid-cols-3 gap-6 w-full max-w-sm px-6">
                                        {[...Array(9)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ 
                                                    opacity: [0.3, 1, 0.3], 
                                                    scale: [0.9, 1.05, 0.9],
                                                    backgroundColor: i % 2 === 0 ? "#0f172a" : "transparent"
                                                }}
                                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                                                className={`aspect-square rounded-[1.5rem] bg-gradient-to-tr ${active.colorTheme} flex items-center justify-center border border-white/10 shadow-lg`}
                                            >
                                                <Lock className="text-white w-5 h-5" />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {active.id === "remediate" && (
                                    <div className="flex flex-col gap-8 w-full max-w-sm">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="relative h-20 bg-slate-50 rounded-3xl border border-slate-100 flex items-center px-8 overflow-hidden group shadow-sm">
                                                <Zap className={`w-6 h-6 ${active.accent} mr-4`} />
                                                <div className="flex-1 h-2 bg-slate-200 rounded-full relative overflow-hidden">
                                                    <motion.div 
                                                        animate={{ left: ["-100%", "100%"] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                                                        className={`absolute inset-0 w-1/2 bg-gradient-to-r ${active.colorTheme} blur-[2px]`}
                                                    />
                                                </div>
                                                <div className="ml-6 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}