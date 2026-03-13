"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ScissorsIcon, Download, Edit3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"

const features = [
    {
        id: "parse",
        title: "Parse",
        icon: FileText,
        description: "Transform how you manage complex documents with Segmento Sense's precise parsing. We go beyond simple text extraction to identify and convert complex tables, nested lists, and multi-column layouts into high-quality Markdown or JSON, ensuring your LLMs get the cleanest data possible.",
        labels: ["caption", "text", "figure"],
    },
    {
        id: "split",
        title: "Split",
        icon: ScissorsIcon,
        description: "Effortlessly manage multi-page documents with intelligent splitting. Whether it's a hundred-page PDF or a collection of mixed documents, Segmento Sense identifies logical breaks and group-related content, streamlining your document processing workflow.",
    },
    {
        id: "extract",
        title: "Extract",
        icon: Download,
        description: "Extract structured data directly from documents with schema-level precision. Whether it's invoice fields, onboarding forms, or financial disclosures, Segmento Sense ensures the right data lands exactly where you need it.",
        claims: ["Claim 1", "Claim 2"],
    },
    {
        id: "edit",
        title: "Edit",
        icon: Edit3,
        description: "Fill in detected blanks, tables, and checkboxes with supplied data. No bounding boxes or pre-defined templates are required; Edit dynamically identifies fillable elements regardless of document layout or format, supporting scanned PDFs, digital forms, and complex multi-page documents.",
    },
]

export function DocumentFeatures() {
    const [activeFeature, setActiveFeature] = useState("parse")
    const active = features.find((f) => f.id === activeFeature) || features[0]

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Document Intelligence Suite
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Transform, split, extract, and edit documents with precision and intelligence.
                    </p>
                </div>

                {/* Feature Selector Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        const isActive = activeFeature === feature.id
                        return (
                            <button
                                key={feature.id}
                                onClick={() => setActiveFeature(feature.id)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all duration-300 ${
                                    isActive
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105"
                                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                <span className="font-bold text-sm uppercase tracking-wider">{feature.title}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="grid lg:grid-cols-12 gap-12 items-stretch"
                    >
                        {/* Text Content */}
                        <div className="lg:col-span-5 flex flex-col justify-center">
                            <div className="space-y-6">
                                <div className="inline-block p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                    <active.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                                    {active.title}
                                </h3>
                                <p className="text-xl text-slate-500 leading-relaxed">
                                    {active.description}
                                </p>
                            </div>
                        </div>

                        {/* Interactive Visual Preview */}
                        <div className="lg:col-span-7">
                            <div className="h-[450px] rounded-[2.5rem] bg-[#F8FAFC] border border-slate-100 shadow-inner overflow-hidden relative flex items-center justify-center p-12">
                                
                                {/* Background Decorative Element */}
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <active.icon className="h-64 w-64 text-slate-900" />
                                </div>

                                <div className="relative z-10 w-full">
                                    {/* Parse - Visual */}
                                    {active.id === "parse" && active.labels && (
                                        <div className="flex flex-col items-center gap-8">
                                            <div className="flex flex-wrap gap-3 justify-center">
                                                {active.labels.map((label, idx) => (
                                                    <motion.div
                                                        key={label}
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="px-6 py-3 bg-white border-2 border-indigo-100 rounded-xl shadow-sm font-mono text-sm text-indigo-600 font-bold"
                                                    >
                                                        &lt;{label}/&gt;
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="w-full max-w-md h-32 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-2">
                                                <div className="h-2 w-3/4 bg-slate-100 rounded" />
                                                <div className="h-2 w-full bg-slate-50 rounded" />
                                                <div className="h-2 w-1/2 bg-slate-100 rounded" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Split - Visual */}
                                    {active.id === "split" && (
                                        <div className="flex justify-center items-center gap-4 h-full">
                                            {[1, 2, 3].map((page, idx) => (
                                                <motion.div
                                                    key={page}
                                                    initial={{ rotate: 0, x: -50, opacity: 0 }}
                                                    animate={{ rotate: (idx - 1) * 8, x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    className="w-32 h-44 bg-white border border-slate-200 rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                                                    <span className="text-slate-300 font-bold text-2xl">{page}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Extract - Visual */}
                                    {active.id === "extract" && active.claims && (
                                        <div className="max-w-md mx-auto space-y-4">
                                            {active.claims.map((claim, idx) => (
                                                <motion.div
                                                    key={claim}
                                                    initial={{ x: 50, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: idx * 0.2 }}
                                                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                                        <Download className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Verified Field</div>
                                                        <div className="text-slate-900 font-bold">{claim}</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Edit - Visual */}
                                    {active.id === "edit" && (
                                        <div className="relative w-full max-w-sm mx-auto h-64 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-8">
                                            <div className="space-y-6">
                                                <div className="h-4 w-1/2 bg-slate-100 rounded" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="h-10 bg-indigo-50/50 border border-indigo-100 rounded-lg" />
                                                    <div className="h-10 bg-indigo-50/50 border border-indigo-100 rounded-lg" />
                                                </div>
                                                <div className="h-20 bg-slate-50 rounded-lg" />
                                            </div>
                                            <motion.div
                                                animate={{ top: ["0%", "100%", "0%"] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}