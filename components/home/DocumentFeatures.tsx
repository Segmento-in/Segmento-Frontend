"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ScissorsIcon, Download, Edit3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                        Document Intelligence Suite
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Transform, split, extract, and edit documents with precision and intelligence.
                    </p>
                </div>

                {/* Feature Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        const isActive = activeFeature === feature.id
                        return (
                            <motion.button
                                key={feature.id}
                                onClick={() => setActiveFeature(feature.id)}
                                className={`p-6 rounded-lg border-2 transition-all text-left relative overflow-hidden ${isActive
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon className={`h-8 w-8 mb-3 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                <h3 className="font-semibold text-lg">{feature.title}</h3>
                            </motion.button>
                        )
                    })}
                </div>

                {/* Active Feature Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl">{active.title}</CardTitle>
                                <CardDescription className="text-lg">{active.description}</CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Visual placeholder for feature demonstration */}
                        <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center p-8">
                                    {/* Parse - Labels */}
                                    {active.id === "parse" && active.labels && (
                                        <div className="space-y-4">
                                            <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <FileText className="h-10 w-10 text-primary" />
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {active.labels.map((label, idx) => (
                                                    <motion.span
                                                        key={label}
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 20,
                                                            delay: idx * 0.15,
                                                        }}
                                                        className="px-4 py-2 bg-primary/20 text-primary text-sm font-mono rounded border border-primary/30"
                                                    >
                                                        {label}
                                                    </motion.span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-4">
                                                Document structure identification
                                            </p>
                                        </div>
                                    )}

                                    {/* Split - Pages */}
                                    {active.id === "split" && (
                                        <div className="space-y-4">
                                            <div className="flex justify-center gap-2">
                                                {[1, 2, 3].map((page, idx) => (
                                                    <motion.div
                                                        key={page}
                                                        initial={{ x: 0, rotate: 0 }}
                                                        animate={{
                                                            x: (idx - 1) * 40,
                                                            rotate: (idx - 1) * 5,
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            delay: idx * 0.2,
                                                        }}
                                                        className="w-24 h-32 bg-white border-2 border-primary/30 rounded shadow-md"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-4">
                                                Intelligent document splitting
                                            </p>
                                        </div>
                                    )}

                                    {/* Extract - Claims */}
                                    {active.id === "extract" && active.claims && (
                                        <div className="space-y-4">
                                            <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <Download className="h-10 w-10 text-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                {active.claims.map((claim, idx) => (
                                                    <motion.div
                                                        key={claim}
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{
                                                            duration: 0.4,
                                                            delay: idx * 0.2,
                                                        }}
                                                        className="px-4 py-2 bg-primary/10 text-primary rounded border border-primary/30 text-sm"
                                                    >
                                                        → {claim}
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-4">
                                                Structured data extraction
                                            </p>
                                        </div>
                                    )}

                                    {/* Edit - Scanning Line */}
                                    {active.id === "edit" && (
                                        <div className="space-y-4 relative">
                                            <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <Edit3 className="h-10 w-10 text-primary" />
                                            </div>
                                            {/* Scanning line animation */}
                                            <motion.div
                                                className="absolute inset-0 bg-primary/30"
                                                animate={{
                                                    x: [-400, 400],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                style={{ width: '2px' }}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Dynamic form field detection and filling
                                            </p>
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
