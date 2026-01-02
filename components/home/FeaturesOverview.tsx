"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Shield, Wrench } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
    {
        id: "discover",
        title: "Discover",
        icon: Search,
        description: "Automatically discover PII across all data sources with real-time scanning and multi-language support.",
        details: [
            "Support for structured and unstructured data",
            "Real-time scanning with high accuracy",
            "Multi-language PII detection across 100+ languages",
            "Comprehensive data source coverage",
        ],
    },
    {
        id: "classify",
        title: "Classify",
        icon: Filter,
        description: "AI-powered data classification with automated categorization by sensitivity level and compliance requirements.",
        details: [
            "Automatic categorization by sensitivity level",
            "Custom classification rules and policies",
            "Identity-centric data mapping",
            "Compliance-ready categorization (GDPR, HIPAA, CCPA)",
        ],
    },
    {
        id: "protect",
        title: "Protect",
        icon: Shield,
        description: "Automated data masking, redaction, and encryption for comprehensive PII protection and access control.",
        details: [
            "Automated data masking and redaction",
            "Encryption for sensitive fields",
            "Access control and governance",
            "Compliance-ready data handling",
        ],
    },
    {
        id: "remediate",
        title: "Remediate",
        icon: Wrench,
        description: "Automated risk remediation workflows with data minimization, retention enforcement, and audit trails.",
        details: [
            "Automated risk remediation workflows",
            "Data minimization and deletion",
            "Retention policy enforcement",
            "Comprehensive audit trail and reporting",
        ],
    },
]

export function FeaturesOverview() {
    const [activeFeature, setActiveFeature] = useState("discover")

    const active = features.find((f) => f.id === activeFeature) || features[0]

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                        Free your data from documents.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A comprehensive suite of APIs for all your PII detection and protection needs.
                    </p>
                </div>

                {/* Feature Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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

                {/* Active Feature Content with visual placeholder */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-2 gap-8 items-center"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl">{active.title}</CardTitle>
                                <CardDescription className="text-lg">{active.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {active.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-primary mt-1">✓</span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Visual placeholder for feature demonstration */}
                        <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        {active.id === "discover" && <Search className="h-10 w-10 text-primary" />}
                                        {active.id === "classify" && <Filter className="h-10 w-10 text-primary" />}
                                        {active.id === "protect" && <Shield className="h-10 w-10 text-primary" />}
                                        {active.id === "remediate" && <Wrench className="h-10 w-10 text-primary" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Visual demonstration of {active.title.toLowerCase()} capabilities
                                    </p>
                                </div>
                            </div>
                            {/* Animated pulse effect */}
                            <motion.div
                                className="absolute inset-0 bg-primary/5"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}
