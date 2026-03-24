'use client'

import Link from "next/link"
import { ArrowRight, Newspaper, Zap, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/ui/button"
import { motion, Variants } from "framer-motion"

export default function BlogPage() {
    // Explicitly typing variants as 'Variants' and using literal types for 'ease'
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.5, 
                ease: "easeOut" // Framer Motion expects specific literal strings here
            } 
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-white">
            {/* Hero Section */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-[#0b0f3b] py-24"
            >
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight leading-tight bg-linear-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                        Segmento Blog
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
                        Insights on data privacy, AI, and enterprise technology from the Segmento team.
                    </p>
                </div>
            </motion.section>

            {/* Blog Grid Section */}
            <div className="py-16 bg-slate-50/50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        
                        {/* 1. Featured Post */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="md:col-span-2 group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-500"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 transition-all group-hover:w-2" />
                            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest">
                                            Featured
                                        </span>
                                        <span className="text-xs font-semibold text-indigo-600">Product Launch</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        <Link href="/blog/segmento-pulse-launch">
                                            Introducing Segmento Pulse: Real-Time Technology Intelligence
                                        </Link>
                                    </h2>
                                    <p className="text-slate-600 text-base mb-6 leading-relaxed">
                                        Your centralized hub for real-time tech news, trends, and insights across AI, Data, and Cloud. Stay ahead with curated technology intelligence.
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5" /> January 10, 2026
                                        </div>
                                        <Link href="/blog/segmento-pulse-launch">
                                            <Button variant="link" className="text-indigo-600 font-bold p-0 group-hover:translate-x-1 transition-transform">
                                                Read Article <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="hidden lg:flex w-1/3 bg-slate-50 rounded-xl items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                    <Zap className="w-20 h-20 text-indigo-200 group-hover:text-indigo-400 transition-colors" />
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. 2025 Moments Post */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="group bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-xl transition-all duration-500 border-b-4 border-b-emerald-500/30"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company News</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">
                                <Link href="/blog/2025-moments">
                                    Segmento's Top 5 Standout Moments of 2025
                                </Link>
                            </h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                A retrospective on building privacy-first AI products and the milestones that defined our year.
                            </p>
                            <Link href="/blog/2025-moments" className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                                View Roadmap <ArrowRight className="ml-2 w-3.5 h-3.5" />
                            </Link>
                        </motion.div>

                        {/* 3. Coming Soon Card */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="relative bg-[#0b0f3b] rounded-2xl p-7 flex flex-col items-center justify-center text-center group overflow-hidden border border-white/5"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    <Newspaper className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">The Future of Data</h3>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-50 mx-auto">
                                    Deep dives into encrypted computing and AI governance coming next month.
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

           
        </div>
    )
}