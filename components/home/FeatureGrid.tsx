"use client"

import { Database, FileText, Globe, Zap, ImageIcon, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

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
    return (
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                        All-in-one PII intelligence.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Segmento Sense's comprehensive feature set covers the long tail of your data protection needs, out of the box.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:border-primary/50 transition-all duration-300">
                                    <CardContent className="pt-6">
                                        <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                                            {idx === 1 ? (
                                                <motion.div
                                                    animate={{
                                                        rotateZ: [0, 90, 90, 0],
                                                    }}
                                                    transition={{
                                                        duration: 4,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        times: [0, 0.3, 0.7, 1],
                                                    }}
                                                >
                                                    <Icon className="h-10 w-10 text-primary" />
                                                </motion.div>
                                            ) : (
                                                <Icon className="h-10 w-10 text-primary" />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>

                                        {/* Language badges for multilingual feature */}
                                        {idx === 2 && feature.languages && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {feature.languages.map((lang, langIdx) => (
                                                    <motion.span
                                                        key={lang}
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        whileInView={{ scale: 1, opacity: 1 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 20,
                                                            delay: langIdx * 0.1 + 0.5,
                                                        }}
                                                        viewport={{ once: true }}
                                                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                                                    >
                                                        {lang}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
