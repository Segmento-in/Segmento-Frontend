"use client"

import { motion } from "framer-motion"
import { Button } from "@/ui/button"

export function HeroSection() {
    return (
        <section className="relative min-h-150 flex items-center justify-center animated-grid bg-background overflow-hidden">


            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        Turn data into insights.
                        <br />
                        <span className="text-primary">Build with confidence.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                    >
                        Segmento Sense combines the best of AI and pattern recognition to discover, classify, and protect PII with unmatched accuracy and compliance coverage.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a href="/products/data-classification/demo">
                            <Button size="lg" className="text-base px-8">
                                Try for free
                            </Button>
                        </a>
                        <a href="/contact">
                            <Button size="lg" variant="outline" className="text-base px-8">
                                Request a demo
                            </Button>
                        </a>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="text-sm text-muted-foreground mt-8"
                    >
                        Helping everyone from startups to Fortune 500 enterprises protect their data.
                    </motion.p>
                </div>
            </div>
        </section>
    )
}
