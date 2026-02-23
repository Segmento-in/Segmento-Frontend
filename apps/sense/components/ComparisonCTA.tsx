"use client"

import Link from "next/link"
import { ArrowRight, BarChart3 } from "lucide-react"
import { Button } from "@/ui/button"

export function ComparisonCTA() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-primary-50/30 to-purple-50 py-16 md:py-20">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="container relative mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Icon */}
                        <div className="shrink-0">
                            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 shadow-xl">
                                <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-linear-to-r from-primary-700 to-primary-500 bg-clip-text text-primary ">
                                How Does Segmento Stack Up?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Compare our agentless, AI-powered approach with enterprise platforms like Spirion, BigID, AWS Macie, and more. See the difference in architecture, performance, and cost.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Button asChild size="lg" className="gap-2 group">
                                    <Link href={`${process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:3000'}/compare`}>
                                        View Competitive Analysis
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/pricing">
                                        See Pricing
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-primary-200/50">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-1">{"<"}15min</div>
                            <div className="text-sm text-muted-foreground">Setup Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-1">{"<"}1%</div>
                            <div className="text-sm text-muted-foreground">False Positives</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-1">12+</div>
                            <div className="text-sm text-muted-foreground">Competitors</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
