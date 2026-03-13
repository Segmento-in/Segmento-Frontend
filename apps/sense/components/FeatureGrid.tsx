"use client"

import { Database, FileText, Globe, Zap, ImageIcon, Plus, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useRef } from "react"

const features = [
    {
        icon: Database,
        title: "PII Pattern Recognition",
        description: "Advanced algorithms detect SSNs, credit cards, emails, phone numbers, and custom PII patterns.",
    },
    {
        icon: FileText,
        title: "Multi-Source Scanning",
        description: "Scan databases, cloud storage, APIs, file systems, and more through one unified platform.",
    },
    {
        icon: Globe,
        title: "Multilingual Detection",
        description: "Detect PII across 100+ languages with locale-specific patterns and validation.",
        languages: ["Hello", "Bonjour", "Hola", "你好", "مرحبا"],
    },
    {
        icon: Zap,
        title: "Compliance Reporting",
        description: "Automated compliance reports for GDPR, HIPAA, CCPA, and other regulations.",
    },
    {
        icon: ImageIcon,
        title: "OCR for Scanned Documents",
        description: "Extract and detect PII from scanned documents, PDFs, and images with high accuracy.",
    },
    {
        icon: Plus,
        title: "API Integrations",
        description: "REST APIs and webhooks for seamless integration with your existing data stack.",
    },
]

export function FeatureGrid() {
    const ref = useRef(null)

    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden" ref={ref}>
            <div className="container mx-auto px-4 relative z-10">
                
                {/* Header Section */}
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366f1] text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm"
                    >
                        <Sparkles className="h-3 w-3" />
                        Comprehensive Protection
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
                        All-in-one <span className="text-[#6366f1]">PII intelligence.</span>
                    </h2>
                    
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Segmento Sense's comprehensive feature set covers the long tail of your data protection needs, out of the box.
                    </p>
                </div>

                {/* Grid Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group relative bg-white border border-slate-100 rounded-4xl p-8 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-100 hover:-translate-y-1"
                            >
                                {/* Icon Container (Squircle Style) */}
                                <div className="relative w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#6366f1] mb-8 group-hover:bg-[#6366f1] group-hover:text-white transition-all duration-300">
                                    {idx === 1 ? (
                                        <motion.div
                                            animate={{ rotateZ: [0, 90, 90, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
                                        >
                                            <Icon className="h-8 w-8" />
                                        </motion.div>
                                    ) : (
                                        <Icon className="h-8 w-8" />
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-[#6366f1] transition-colors">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-4">
                                    {feature.description}
                                </p>

                                {/* Language badges for multilingual feature */}
                                {idx === 2 && feature.languages && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {feature.languages.map((lang, langIdx) => (
                                            <motion.span
                                                key={lang}
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: langIdx * 0.1 + 0.3 }}
                                                className="px-2 py-1 bg-indigo-50 text-[#6366f1] text-[10px] rounded-md font-bold uppercase tracking-wider border border-indigo-100/50"
                                            >
                                                {lang}
                                            </motion.span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}