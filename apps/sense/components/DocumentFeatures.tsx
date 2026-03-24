"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ScissorsIcon, Download, Edit3 } from "lucide-react"

const features = [
    {
        id: "parse",
        title: "Parse",
        icon: FileText,
        shortDesc: "Precise document parsing for LLMs.",
        details: "Transform how you manage complex documents with Segmento Sense's precise parsing. We identify and convert complex tables, nested lists, and multi-column layouts into high-quality Markdown or JSON.",
        color: "from-blue-500 to-cyan-400",
    },
    {
        id: "split",
        title: "Split",
        icon: ScissorsIcon,
        shortDesc: "Intelligent multi-page document management.",
        details: "Effortlessly manage multi-page documents. Whether it's a hundred-page PDF or mixed docs, Segmento Sense identifies logical breaks and group-related content automatically.",
        color: "from-indigo-500 to-blue-600",
    },
    {
        id: "extract",
        title: "Extract",
        icon: Download,
        shortDesc: "Schema-level precision data extraction.",
        details: "Extract structured data directly from documents. Whether it's invoice fields, onboarding forms, or financial disclosures, the right data lands exactly where you need it.",
        color: "from-orange-500 to-red-500",
    },
    {
        id: "edit",
        title: "Edit",
        icon: Edit3,
        shortDesc: "Dynamic element identification and filling.",
        details: "Fill in detected blanks, tables, and checkboxes with supplied data. Edit dynamically identifies fillable elements regardless of document layout or format.",
        color: "from-emerald-500 to-teal-600",
    },
]

export function DocumentFeatures() {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <section className="relative py-24 bg-[#F8FAFF] overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)]" />

            <div className="container relative mx-auto px-6 max-w-7xl z-10">
                {/* Centered Header Section */}
                <div className="text-center mb-24">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="h-[1px] w-12 bg-blue-200" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">Core Engine</span>
                        <span className="h-[1px] w-12 bg-blue-200" />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-[#0F172A] leading-[0.9] tracking-tighter mb-8">
                     Unmatched <span className="text-blue-600">Unstructured</span> Data Parsing
                    </h2>
                      
                   <p className="text-lg text-slate-500 max-w-5xl mx-auto font-medium leading-relaxed text-center text-balance px-4">
    Garbage in means garbage out. Sense utilizes a heavyweight extraction layer to process nested PDFs, raw images, and complex tables. 
    By leveraging native parsers and local PyMuPDF/Tesseract libraries, we preserve the structural metadata needed for high-confidence identification.
</p>
                </div>

                {/* Process Flow Cards */}
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-y-1/2 hidden md:block" />

                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        const isHovered = hoveredId === feature.id

                        return (
                            <div key={feature.id} className="relative flex items-center w-full md:w-auto">
                                <motion.div
                                    onMouseEnter={() => setHoveredId(feature.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative z-20 w-full md:w-[260px] p-6 rounded-[32px] border transition-all duration-500
                                        ${isHovered 
                                            ? "bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border-blue-200 scale-105" 
                                            : "bg-white/60 backdrop-blur-md border-white shadow-sm"
                                        }`}
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* Dynamic Moving Icon Container */}
                                        <motion.div 
                                            animate={{ 
                                                y: isHovered ? [0, -12, 0] : [0, -6, 0],
                                                rotate: isHovered ? [0, 10, -10, 0] : [0, 0, 0, 0]
                                            }}
                                            transition={{ 
                                                duration: isHovered ? 2 : 4, 
                                                repeat: Infinity, 
                                                ease: "easeInOut" 
                                            }}
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg flex items-center justify-center`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </motion.div>
                                        
                                        <div>
                                            <h3 className="text-lg font-black text-[#0F172A] mb-1">{feature.title}</h3>
                                            <p className="text-[13px] text-slate-500 font-medium leading-snug">{feature.shortDesc}</p>
                                            
                                            <AnimatePresence>
                                                {isHovered && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }} 
                                                        animate={{ height: "auto", opacity: 1 }} 
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-4 mt-4 border-t border-slate-100 text-[12px] text-slate-600 leading-relaxed italic">
                                                            {feature.details}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Connecting Line (Mobile) */}
                                {idx !== features.length - 1 && (
                                    <div className="h-10 w-[2px] bg-slate-200 mx-auto md:hidden" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}