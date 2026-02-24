"use client"

import * as React from "react"
import { Shield, Zap, Award, ArrowRight } from "lucide-react"
import { CompetitiveComparisonTable } from "@/app/(main)/components/comparison"

export default function EnterpriseComparisonPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 border-b">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                <div className="container relative mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-5xl mx-auto">
                        {/* Badge */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 font-semibold text-sm">
                                <Award className="w-4 h-4" />
                                Enterprise Security Officer's Guide
                            </div>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-500 bg-clip-text text-transparent">
                            Competitive Comparison:
                            <br />
                            Segmento Sense vs BigID vs OneTrust
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            A comprehensive technical evaluation of PII detection platforms designed for{" "}
                            <span className="font-semibold text-gray-900">Enterprise Security Officers</span> evaluating
                            next-generation data discovery solutions.
                        </p>

                        {/* Key Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-2 border-primary-200 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">
                                        Hybrid Cloud
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Deploy on-premise or in cloud with full compliance controls
                                </p>
                            </div>

                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">
                                        DeBERTa V3
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    State-of-the-art Transformer AI with context awareness
                                </p>
                            </div>

                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {"<1%"} False Positives
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Ultra-low false positive rate reduces security analyst workload
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Competitive Table Section */}
            <section className="container mx-auto px-4 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Side-by-Side Platform Comparison
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Compare deployment options, AI architecture, performance metrics, and pricing
                            across the leading PII detection platforms in the market.
                        </p>
                    </div>

                    {/* The Comparison Table */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
                        <CompetitiveComparisonTable />
                    </div>

                    {/* Technical Note */}
                    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Technical Differentiation
                        </h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <strong>Segmento Sense</strong> leverages the DeBERTa V3 Transformer model, which understands
                            contextual relationships in data (e.g., differentiating between a movie title "John Wick" and
                            a real person's name). This reduces false positives by <strong>60-80%</strong> compared to
                            traditional pattern-matching systems used by legacy competitors.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Segmento Sense Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-t">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                            Why Enterprise Security Teams Choose Segmento Sense
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "No Vendor Lock-In",
                                    description: "Hybrid cloud deployment means you control where your sensitive data lives—on-premise, private cloud, or SaaS.",
                                    icon: "🔓"
                                },
                                {
                                    title: "Real-time Data Masking",
                                    description: "Automatically redact PII in production databases without application code changes or performance impact.",
                                    icon: "⚡"
                                },
                                {
                                    title: "100+ Pre-built Connectors",
                                    description: "Native integrations with Snowflake, PostgreSQL, MongoDB, S3, Azure Blob, and all major data platforms.",
                                    icon: "🔌"
                                },
                                {
                                    title: "Explainable AI (XAI)",
                                    description: "Every detection includes a confidence score and reasoning path—critical for SOC 2 and regulatory audits.",
                                    icon: "🔍"
                                },
                                {
                                    title: "Compliance-First Design",
                                    description: "Built-in support for GDPR Article 30 logs, CCPA data mapping, HIPAA audit trails, and SOC 2 Type II requirements.",
                                    icon: "📋"
                                },
                                {
                                    title: "Transparent Usage Pricing",
                                    description: "Pay per GB scanned with no hidden fees. No per-seat licensing or surprise connector charges.",
                                    icon: "💰"
                                },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to See Segmento Sense in Action?
                    </h2>
                    <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                        Schedule a personalized demo with our enterprise security team. We'll scan your
                        actual data sources and show you side-by-side detection accuracy comparisons.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                        >
                            Schedule Enterprise Demo
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <a
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            View Pricing Details
                        </a>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-sm text-primary-100 mb-4">Trusted by Enterprise Security Teams at:</p>
                        <div className="flex flex-wrap items-center justify-center gap-8 text-white/80 font-semibold">
                            <span>Fortune 500 Financial Services</span>
                            <span>•</span>
                            <span>Healthcare Systems</span>
                            <span>•</span>
                            <span>Government Agencies</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
