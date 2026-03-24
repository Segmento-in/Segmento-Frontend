'use client'

import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle2, Rocket, Zap, Shield, Brain, Target, Sparkles } from "lucide-react"
import { Button } from "@/ui/button"
import { motion } from "framer-motion"

export default function Blog2025MomentsPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-cyan-500/30">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <article className="max-w-3xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-16 relative">
                        {/* Subtle glow behind the headline */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                        
                        <Link href="/blog">
                            <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                                Back to Blog
                            </Button>
                        </Link>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <span className="flex items-center gap-2 text-xs font-medium text-cyan-400 uppercase tracking-widest">
                                <Calendar className="h-3 w-3" /> December 31, 2025
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                                Company News
                            </span>
                        </div>

                        {/* ATTRACTIVE GRADIENT HEADLINE */}
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
                            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                Segmento's Top 5
                            </span>
                            <br />
                            <span className="text-white inline-block mt-2">
                                Standout Moments
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 leading-relaxed font-light max-w-2xl">
                            Looking back at our journey building privacy-first, AI-driven data products.
                        </p>
                    </header>

                    {/* Content Body */}
                    <div className="space-y-20 relative">
                        {/* Connecting Line Decor */}
                        <div className="absolute left-0 md:-left-10 top-4 bottom-4 w-px bg-linear-to-b from-cyan-500 via-purple-500 to-transparent hidden md:block opacity-20" />

                        {/* Section 1 */}
                        <section className="relative group">
                            <div className="absolute -left-11.25 top-1 h-2.5 w-2.5 rounded-full bg-cyan-500 ring-4 ring-cyan-500/20 hidden md:block" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="text-cyan-500"><Rocket className="h-6 w-6" /></span>
                                1. A Powerful Beginning on an Auspicious Day
                            </h2>
                            <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
                                <p>
                                    <strong className="text-white font-semibold">27th November 2025</strong> marked the official launch of Segmento—an auspicious day that set the tone for our journey. From day one, our mission was clear: to build privacy-first, AI-driven data products that solve real enterprise challenges.
                                </p>
                                <p>
                                    This wasn't just another company launch. It was the beginning of a movement to redefine how organizations handle sensitive data, putting privacy and intelligence at the core of every decision.
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1 h-2.5 w-2.5 rounded-full bg-purple-500 ring-4 ring-purple-500/20 hidden md:block" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="text-purple-500"><Zap className="h-6 w-6" /></span>
                                2. Rapid Kick-Off of Our Flagship Product
                            </h2>
                            <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
                                <p>
                                    Within weeks of launch, we quick-started development of our flagship <strong className="text-white font-semibold">Data Classification Framework</strong>, moving swiftly from concept to execution. This fast momentum demonstrated Segmento's ability to turn vision into working solutions without delay.
                                </p>
                                <p>
                                    Our team worked tirelessly to translate enterprise needs into a robust architecture that could scale from startups to Fortune 500 companies.
                                </p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20 hidden md:block" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="text-blue-500"><Shield className="h-6 w-6" /></span>
                                3. Completion of the Data Classification Framework
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                In record time, we successfully completed the core development of our <strong className="text-white font-semibold">Data Classification Framework</strong>—designed to help organizations identify, classify, and govern sensitive data across systems with accuracy and scalability.
                            </p>
                            
                            <div className="bg-white/3 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl shadow-cyan-500/5">
                                <p className="font-semibold text-white mb-6 flex items-center gap-2">
                                    The framework brings together:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Automated discovery across structured and unstructured data",
                                        "Intelligent classification using pattern matching and ML",
                                        "Policy-driven governance and access controls",
                                        "Real-time monitoring and compliance reporting"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-400 group">
                                            <CheckCircle2 className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 hidden md:block" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="text-indigo-400"><Brain className="h-6 w-6" /></span>
                                4. AI Models Enabled from Day One
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                A key milestone was the enablement of <strong className="text-white font-semibold">AI models</strong> within the framework. By embedding intelligence early, we laid the foundation for:
                            </p>
                            
                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {[
                                    { title: "Automated data discovery", desc: "Finding sensitive data wherever it lives" },
                                    { title: "Smart classification and tagging", desc: "Understanding data context beyond regex" },
                                    { title: "Future-ready compliance and observability", desc: "Adapting to evolving regulations" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-5 hover:bg-indigo-500/10 transition-colors">
                                        <p className="font-bold text-indigo-300">{item.title}</p>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-indigo-500 pl-6">
                                This ensured our product was <strong className="text-indigo-400">AI-native, not AI-added</strong>. Intelligence isn't a feature—it's the foundation of how Segmento works.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 hidden md:block" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="text-emerald-500"><Target className="h-6 w-6" /></span>
                                5. Establishing Segmento's Product-First DNA
                            </h2>
                            <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
                                <p>
                                    2025 firmly established Segmento as a <strong className="text-white font-semibold">product-driven data technology startup</strong>. Our focus on architecture, privacy, and AI readiness positioned us strongly for scaling data products in 2026 and beyond.
                                </p>
                                <p>
                                    We're not building services—we're building products that enterprises can trust, deploy, and scale independently.
                                </p>
                            </div>
                        </section>

                        {/* Looking Ahead Footer Section */}
                        <section className="mt-32 p-10 rounded-3xl bg-linear-to-br from-blue-600/20 via-purple-600/10 to-transparent border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="h-24 w-24 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                                🌱 Looking Ahead
                            </h2>
                            <div className="space-y-6 text-slate-300 text-lg leading-relaxed relative z-10">
                                <p>
                                    2025 was about <strong className="text-white">building the foundation</strong>. With a solid product, AI capabilities, and a clear vision, Segmento enters the future ready to innovate, scale, and redefine data governance.
                                </p>
                                <p className="text-xl font-medium bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Here's to 2026 and beyond—where we turn this foundation into transformative solutions for enterprises worldwide.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Tags Footer */}
                    <footer className="mt-20 pt-10 border-t border-slate-800 flex flex-wrap gap-3">
                        {["Company News", "Milestones", "AI", "Data Classification"].map((tag) => (
                            <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-500 text-xs font-medium hover:text-white hover:border-white/20 transition-all cursor-default">
                                {tag}
                            </span>
                        ))}
                    </footer>
                </article>
            </div>
        </div>
    )
}