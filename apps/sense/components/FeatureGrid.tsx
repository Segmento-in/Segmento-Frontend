"use client"

import { Database, FileText, Globe, Zap, ImageIcon, Plus, ShieldCheck } from "lucide-react"
import { motion, Variants } from "framer-motion"

const features = [
    {
        icon: Database,
        title: "Pattern Recognition",
        description: "Advanced algorithms detect SSNs, credit cards, and custom PII patterns.",
        color: "from-blue-600 to-indigo-700",
    },
    {
        icon: FileText,
        title: "Unified Scanning",
        description: "Scan databases, cloud storage, and APIs through one unified platform.",
        color: "from-indigo-600 to-violet-700",
    },
    {
        icon: Globe,
        title: "Global Detection",
        description: "Detect PII across 100+ languages with locale-specific validation.",
        color: "from-violet-600 to-fuchsia-700",
    },
    {
        icon: Zap,
        title: "Auto Compliance",
        description: "Automated reporting for GDPR, HIPAA, CCPA, and global regulations.",
        color: "from-amber-500 to-orange-600",
    },
    {
        icon: ImageIcon,
        title: "Neural OCR",
        description: "Extract PII from scanned documents and PDFs with high accuracy.",
        color: "from-emerald-500 to-teal-600",
    },
    {
        icon: Plus,
        title: "Fast Integration",
        description: "REST APIs and webhooks for seamless data stack integration.",
        color: "from-rose-500 to-pink-600",
    },
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            // Increased delay between each card for a clear "one-by-one" reveal
            staggerChildren: 0.25, 
            delayChildren: 0.3,
        },
    },
}

const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 50,
        scale: 0.92,
        filter: "blur(10px)" 
    },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: "blur(0px)",
        transition: { 
            type: "spring", 
            damping: 22, 
            stiffness: 80,
        }
    }
}

export function FeatureGrid() {
    return (
        <section id="features" className="py-40 bg-[#FCFCFF] overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header Section */}
                <div className="mb-28 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-8"
                    >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">System Capabilities</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-slate-950 tracking-[-0.06em] leading-none"
                    >
                        All-in-one <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">PII intelligence.</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-slate-500 font-medium text-sm md:text-base tracking-tight max-w-xl mx-auto"
                    >
                        Enterprise-grade data protection, architected for modern compliance and speed.
                    </motion.p>
                </div>

                {/* Grid Section with One-by-One Reveal */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                className="group relative"
                            >
                                <div className="relative h-full bg-white border border-slate-100 rounded-[3rem] p-12 transition-all duration-700 hover:shadow-[0_80px_100px_-30px_rgba(0,0,0,0.06)] hover:-translate-y-4 hover:border-slate-300">
                                    
                                    {/* Icon Layer */}
                                    <div className="relative mb-12 w-fit">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10`}>
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        {/* Subtle Under-glow */}
                                        <div className={`absolute inset-0 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`} />
                                    </div>

                                    {/* Content - Normal Font Weight (No Italic) */}
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-slate-950 tracking-tight leading-none">
                                            {feature.title}
                                        </h3>
                                        
                                        <p className="text-slate-500 text-[14px] leading-relaxed font-medium">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Module Footer */}
                                    <div className="mt-16 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-600 group-hover:animate-pulse transition-colors" />
                                            <span className="text-[10px] font-black text-slate-200 group-hover:text-slate-900 uppercase tracking-widest transition-colors">
                                                Active_Module_0{idx + 1}
                                            </span>
                                        </div>
                                        <Plus className="w-4 h-4 text-slate-100 group-hover:text-slate-950 transition-all group-hover:rotate-90" />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}