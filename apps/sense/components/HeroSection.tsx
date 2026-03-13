"use client"

import { motion } from "framer-motion"
import { Button } from "@/ui/button"
import { MessageSquareText, Zap } from "lucide-react"

export function HeroSection() {
    return (
        /* Background updated to #F0F9FF based on reference images */
        <section className="relative min-h-[80vh] flex items-center justify-center bg-[#F0F9FF] overflow-hidden py-20">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto text-center">
                    
                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[#2D2D2D] text-4xl md:text-6xl lg:text-7xl font-semibold mb-8 tracking-tight leading-tight"
                    >
                        Turn data into insights for
                        <br />
                        <span className="text-[#7147E8]">
                            discovery, observability, and governance
                        </span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-[#4A4A4A] text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Segmento Sense combines the best of AI and pattern recognition to discover, 
                        classify, and protect PII with unmatched accuracy and compliance coverage.
                    </motion.p>

                    {/* Buttons Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                    >
                        <a href="/products/data-classification/demo">
                            <Button 
                                variant="outline" 
                                className="h-14 px-8 border-[#7147E8] text-[#7147E8] bg-white hover:bg-[#F3F0FF] rounded-none border-[1.5px] font-bold tracking-wider uppercase flex items-center gap-2"
                            >
                                <MessageSquareText className="w-5 h-5" />
                                Try for free
                            </Button>
                        </a>
                        
                        <a href="/contact">
                            <Button 
                                className="h-14 px-8 bg-[#7147E8] hover:bg-[#5B36D1] text-white rounded-none font-bold tracking-wider uppercase shadow-none flex items-center gap-2"
                            >
                                <Zap className="w-5 h-5 fill-white" />
                                Request a demo
                            </Button>
                        </a>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}