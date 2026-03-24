'use client'

import Link from "next/link"
import { ArrowRight, Newspaper, Zap, Calendar, Sparkles } from "lucide-react"
import { motion, Variants } from "framer-motion"

// FIXED PATHS: Moving from app/blog/ to app/components/
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function BlogPage() {
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.5, 
                ease: "easeOut" as const
            } 
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-white selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section - Light Gradient */}
                <motion.section 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="relative border-b border-slate-100 bg-linear-to-b from-slate-50 to-white py-24"
                >
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                            Segmento Insights
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight text-slate-900">
                            The <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Blog</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            Deep dives into data privacy, AI governance, and the future of enterprise tech.
                        </p>
                    </div>
                </motion.section>

                {/* Blog Grid Section */}
                <div className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                            
                            {/* 1. Featured Post - Premium Shadow Card */}
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="md:col-span-2 group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
                            >
                                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-3 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
                                                Featured
                                            </span>
                                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-tight">Product Launch</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold mb-5 text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                            <Link href="/blog/segmento-pulse-launch">
                                                Introducing Segmento Pulse: Real-Time Intelligence
                                            </Link>
                                        </h2>
                                        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                                            Your centralized hub for tech news, trends, and curated insights across AI, Data, and Cloud infrastructure.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                                                <Calendar className="w-4 h-4" /> Jan 10, 2026
                                            </div>
                                            <Link href="/blog/segmento-pulse-launch">
                                                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 group/btn">
                                                    Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 aspect-square bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                        <Zap className="w-24 h-24 text-slate-200 group-hover:text-indigo-300 transition-all" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* 2. Standard Post - Clean Minimalist */}
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="group bg-slate-50/50 rounded-3xl border border-slate-200 p-8 hover:bg-white hover:shadow-xl transition-all duration-500"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    <Link href="/blog/2025-moments">
                                        Top 5 Standout Moments of 2025
                                    </Link>
                                </h3>
                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    A retrospective on milestones that defined our privacy-first AI journey.
                                </p>
                                <Link href="/blog/2025-moments" className="flex items-center text-sm font-bold text-slate-900 hover:gap-3 transition-all gap-2">
                                    View Roadmap <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>

                            {/* 3. Coming Soon - Glassy Light Section */}
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="relative bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center group overflow-hidden border border-slate-200 shadow-sm"
                            >
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl" />
                                
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                                        <Newspaper className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900">The Future of Data</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-50 mx-auto">
                                        Deep dives into encrypted computing and AI governance coming next month.
                                    </p>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}