"use client"

import { useState } from "react"
import { 
    Building2, Heart, Shield, Scale, 
    ShoppingCart, Code, CheckCircle2, Zap
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const industries = [
    {
        id: "finance",
        label: "Finance",
        icon: Building2,
        color: "#2563eb",
        title: "Protect financial data with confidence",
        description: "Extract key insights from investor decks and SEC filings while protecting customer PII.",
        features: ["Detect SSNs", "SOX & GLBA compliance", "PCI-DSS protection", "Data masking"],
        lightBg: "bg-blue-50/50"
    },
    {
        id: "healthcare",
        label: "Healthcare",
        icon: Heart,
        color: "#e11d48",
        title: "HIPAA-compliant patient protection",
        description: "Automatically detect and protect PHI across all systems with comprehensive security.",
        features: ["PHI detection", "HIPAA automation", "Records protection", "De-identification"],
        lightBg: "bg-rose-50/50"
    },
    {
        id: "legal",
        label: "Legal",
        icon: Scale,
        color: "#7c3aed",
        title: "Attorney-client privilege protection",
        description: "Protect sensitive legal documents and case files with precision PII detection.",
        features: ["Classification", "Client privacy", "Case security", "Access control"],
        lightBg: "bg-violet-50/50"
    },
    {
        id: "insurance",
        label: "Insurance",
        icon: Shield,
        color: "#0891b2",
        title: "Policy holder data security",
        description: "Secure policy holder information and claims data across all digital systems.",
        features: ["PII protection", "Claims security", "Underwriting", "Compliance"],
        lightBg: "bg-cyan-50/50"
    },
    {
        id: "retail",
        label: "Retail",
        icon: ShoppingCart,
        color: "#d97706",
        title: "Customer data protection",
        description: "CCPA and GDPR compliance for customer data with automated detection.",
        features: ["Customer PII", "GDPR compliance", "Payment protection", "Governance"],
        lightBg: "bg-amber-50/50"
    },
    {
        id: "technology",
        label: "Technology",
        icon: Code,
        color: "#059669",
        title: "User data governance at scale",
        description: "API security and data governance for building data-intensive applications.",
        features: ["Data discovery", "API scanning", "Dev protection", "DevOps sync"],
        lightBg: "bg-emerald-50/50"
    },
]

export function IndustryUseCases() {
    const [activeTab, setActiveTab] = useState(industries[0].id)
    const current = industries.find(i => i.id === activeTab) || industries[0]

    return (
        <section className="pt-0 pb-24 bg-[#FBFDFF] relative overflow-hidden">
            {/* Dynamic Background Glow */}
            <motion.div 
                animate={{ backgroundColor: current.color }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[140px] opacity-[0.04] pointer-events-none" 
            />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                
                {/* Centered Header Section - Tightened top margin */}
                <div className="flex flex-col items-center text-center pt-16 mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="h-[2px] w-6 bg-blue-600 rounded-full" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">Enterprise Solutions</span>
                        <div className="h-[2px] w-6 bg-blue-600 rounded-full" />
                    </motion.div>
                    
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">
                        Powering the <br />
                        <span className="text-blue-600">Industry Leaders.</span>
                    </h2>
                    
                    <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
                        Precision data security and PII protection tailored for high-stakes 
                        environments and global compliance standards.
                    </p>
                </div>

                {/* Main Interactive Grid */}
                <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
                    
                    {/* Vertical Navigation */}
                    <div className="flex flex-col gap-2 p-3 bg-white/80 backdrop-blur-md rounded-[32px] border border-slate-200/60 shadow-sm">
                        {industries.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group
                                    ${activeTab === item.id 
                                        ? "text-white shadow-lg shadow-blue-200/50" 
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                style={activeTab === item.id ? { backgroundColor: item.color } : {}}
                            >
                                <motion.div
                                    animate={activeTab === item.id ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <item.icon className="h-4 w-4" />
                                </motion.div>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Display Panel */}
                    <div className="relative min-h-[500px] rounded-[48px] overflow-hidden border border-slate-200/60 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all duration-500">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="p-10 md:p-16 h-full flex flex-col justify-center"
                            >
                                <div className="max-w-2xl">
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-widest ${current.lightBg}`}
                                        style={{ color: current.color }}
                                    >
                                        <Zap className="h-3 w-3 fill-current" />
                                        Deployment Active
                                    </motion.div>

                                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                                        {current.title}
                                    </h3>
                                    <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
                                        {current.description}
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {current.features.map((f, idx) => (
                                        <motion.div
                                            key={f}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ y: -5, backgroundColor: "#fff", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                                            className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 group transition-all"
                                        >
                                            <div 
                                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                                                style={{ backgroundColor: `${current.color}15` }}
                                            >
                                                <CheckCircle2 className="h-5 w-5" style={{ color: current.color }} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{f}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}