"use client"

import * as React from "react"
import { Sparkles, TrendingUp, Shield, DollarSign } from "lucide-react"
import { CompetitorSelector } from "@/components/comparison/CompetitorSelector"
import { ComparisonTable } from "@/components/comparison/ComparisonTable"
import { Button } from "@/components/ui/button"

export default function ComparePage() {
    // Start with 2 popular competitors for immediate value
    const [selectedCompetitors, setSelectedCompetitors] = React.useState<
        string[]
    >(["spirion", "bigid"])

    const handleAddCompetitor = (competitorId: string) => {
        if (
            !selectedCompetitors.includes(competitorId) &&
            selectedCompetitors.length < 3
        ) {
            setSelectedCompetitors([...selectedCompetitors, competitorId])
        }
    }

    const handleRemoveCompetitor = (competitorId: string) => {
        setSelectedCompetitors(
            selectedCompetitors.filter((id) => id !== competitorId)
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-background to-primary-50/30 border-b">
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                <div className="container relative mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mb-6">
                            <Sparkles className="w-4 h-4" />
                            Competitive Analysis
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                            Compare Segmento Sense <br />
                            with Leading Competitors
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            See how our agentless, AI-powered PII detection platform stacks up
                            against enterprise solutions like Spirion, BigID, and AWS Macie.
                        </p>

                        {/* Key Differentiators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-primary-200/50 shadow-sm">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Agentless Architecture
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    No endpoint agents, no infrastructure friction
                                </p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-primary-200/50 shadow-sm">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Explainable AI (XAI)
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Transparent detection logic, not a black box
                                </p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-primary-200/50 shadow-sm">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Flat Pricing</h3>
                                <p className="text-sm text-muted-foreground">
                                    No per-GB cloud tax or hidden connector fees
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <CompetitorSelector
                                selectedCompetitors={selectedCompetitors}
                                onAddCompetitor={handleAddCompetitor}
                                maxCompetitors={3}
                            />
                            {selectedCompetitors.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedCompetitors([])}
                                    size="lg"
                                >
                                    Reset Comparison
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Matrix */}
            <section className="container mx-auto px-4 py-12 md:py-16">
                <ComparisonTable
                    selectedCompetitors={selectedCompetitors}
                    onRemoveCompetitor={handleRemoveCompetitor}
                />
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Experience the Difference?
                    </h2>
                    <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                        Join organizations who chose agentless, explainable PII detection
                        over expensive enterprise platforms.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white text-primary-600 hover:bg-primary-50"
                        >
                            Start Free Trial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                        >
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
