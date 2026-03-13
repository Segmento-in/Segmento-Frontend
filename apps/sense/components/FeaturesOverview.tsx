"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Shield, Wrench, CheckCircle2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"

const features = [
    {
        id: "discover",
        title: "Discover",
        icon: Search,
        description: "Automatically discover PII across all data sources with real-time scanning and multi-language support.",
        details: [
            "Support for structured and unstructured data",
            "Real-time scanning with high accuracy",
            "Multi-language PII detection (100+)",
            "Comprehensive source coverage",
        ],
    },
    {
        id: "classify",
        title: "Classify",
        icon: Filter,
        description: "AI-powered data classification with automated categorization by sensitivity level and compliance.",
        details: [
            "Automatic sensitivity categorization",
            "Custom classification rules",
            "Identity-centric data mapping",
            "Compliance-ready (GDPR, HIPAA)",
        ],
    },
    {
        id: "protect",
        title: "Protect",
        icon: Shield,
        description: "Automated data masking, redaction, and encryption for PII protection and access control.",
        details: [
            "Automated masking & redaction",
            "Encryption for sensitive fields",
            "Access control & governance",
            "Secure data handling",
        ],
    },
    {
        id: "remediate",
        title: "Remediate",
        icon: Wrench,
        description: "Automated risk remediation workflows with data minimization and retention enforcement.",
        details: [
            "Risk remediation workflows",
            "Data minimization & deletion",
            "Retention policy enforcement",
            "Audit trail & reporting",
        ],
    },
]

export function FeaturesOverview() {
    const [activeFeature, setActiveFeature] = useState("discover")
    const active = features.find((f) => f.id === activeFeature) || features[0]

    return (
        <section className="py-20 bg-slate-50/50"> 
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Sparkles className="h-3 w-3" />
                        Enterprise API Suite
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">
                        Free your data from <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">documents.</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                        A comprehensive suite of APIs for all your PII detection and protection needs.
                    </p>
                </div>

                {/* Feature Tabs - Compact Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        const isActive = activeFeature === feature.id
                        return (
                            <motion.button
                                key={feature.id}
                                onClick={() => setActiveFeature(feature.id)}
                                className={`group p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${isActive
                                    ? "border-indigo-600 bg-white shadow-lg shadow-indigo-100 ring-1 ring-indigo-600"
                                    : "border-slate-200 bg-white/50 hover:bg-white hover:border-indigo-300"
                                    }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all ${
                                    isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                                }`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className={`font-bold text-sm tracking-tight ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                                    {feature.title}
                                </h3>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeUnderline" 
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-violet-600" 
                                    />
                                )}
                            </motion.button>
                        )
                    })}
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="grid md:grid-cols-2 gap-8 items-stretch"
                    >
                        {/* Information Card */}
                        <Card className="border-none shadow-2xl shadow-indigo-100/50 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm ring-1 ring-slate-100">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
                                    {active.title}
                                </CardTitle>
                                <CardDescription className="text-base text-slate-500 font-medium leading-relaxed">
                                    {active.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <ul className="grid gap-3">
                                    {active.details.map((detail, idx) => (
                                        <motion.li 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={idx} 
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-sm transition-all"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                                            <span className="text-slate-700 font-semibold text-xs tracking-tight">{detail}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Visual Experience Block */}
                        <div className="relative min-h-[320px] rounded-[2rem] overflow-hidden bg-slate-900 flex items-center justify-center border-4 border-white shadow-2xl">
                            {/* Animated Background Mesh */}
                            <div className="absolute inset-0 opacity-40" 
                                 style={{ 
                                    backgroundImage: `radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)`,
                                    backgroundSize: '24px 24px'
                                 }} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-900" />
                            
                            {/* Focal Point */}
                            <div className="relative z-10 text-center">
                                <motion.div 
                                    animate={{ 
                                        boxShadow: ["0 0 0 0px rgba(99, 102, 241, 0)", "0 0 0 20px rgba(99, 102, 241, 0.1)", "0 0 0 0px rgba(99, 102, 241, 0)"] 
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl shadow-indigo-500/20 rotate-3"
                                >
                                    <active.icon className="h-10 w-10 text-white" />
                                </motion.div>
                                <div className="space-y-1">
                                    <h4 className="text-white text-lg font-bold tracking-tight">Active Node</h4>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <p className="text-indigo-300 font-mono text-[10px] uppercase tracking-[0.2em]">System Status: Optimal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}