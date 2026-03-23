'use client'

import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle2, Rocket, Zap, Shield, Brain, Target, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Blog2025MomentsPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <article className="max-w-3xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-16 relative">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                        
                        <Link href="/blog">
                            {/* REPLACED: UI Button with Tailwind-only motion.button */}
                            <motion.button 
                                whileHover={{ x: -4 }}
                                className="mb-8 flex items-center gap-2 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors group font-medium text-sm"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform" /> 
                                Back to Blog
                            </motion.button>
                        </Link>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <span className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                                <Calendar className="h-3 w-3" /> December 31, 2025
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold">
                                Company News
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-slate-900">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Segmento's Top 5
                            </span>
                            <br />
                            <span className="inline-block mt-2">
                                Standout Moments
                            </span>
                        </h1>

                        <p className="text-xl text-slate-500 leading-relaxed font-light max-w-2xl">
                            Looking back at our journey building privacy-first, AI-driven data products.
                        </p>
                    </header>

                    {/* Content Body */}
                    <div className="space-y-20 relative">
                        <div className="absolute left-0 md:-left-10 top-4 bottom-4 w-px bg-gradient-to-b from-blue-400 via-purple-400 to-transparent hidden md:block opacity-30" />

                        {/* Section 1 */}
                        <section className="relative group">
                            <div className="absolute -left-11.25 top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/10 hidden md:block shadow-sm" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                                <span className="text-blue-600"><Rocket className="h-6 w-6" /></span>
                                1. A Powerful Beginning on an Auspicious Day
                            </h2>
                            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                                <p>
                                    <strong className="text-slate-900 font-semibold">27th November 2025</strong> marked the official launch of Segmento—an auspicious day that set the tone for our journey. From day one, our mission was clear: to build privacy-first, AI-driven data products that solve real enterprise challenges.
                                </p>
                                <p>
                                    This wasn't just another company launch. It was the beginning of a movement to redefine how organizations handle sensitive data, putting privacy and intelligence at the core of every decision.
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1.5 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-500/10 hidden md:block shadow-sm" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                                <span className="text-purple-600"><Zap className="h-6 w-6" /></span>
                                2. Rapid Kick-Off of Our Flagship Product
                            </h2>
                            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                                <p>
                                    Within weeks of launch, we quick-started development of our flagship <strong className="text-slate-900 font-semibold">Data Classification Framework</strong>, moving swiftly from concept to execution. This fast momentum demonstrated Segmento's ability to turn vision into working solutions without delay.
                                </p>
                                <p>
                                    Our team worked tirelessly to translate enterprise needs into a robust architecture that could scale from startups to Fortune 500 companies.
                                </p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1.5 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10 hidden md:block shadow-sm" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                                <span className="text-indigo-600"><Shield className="h-6 w-6" /></span>
                                3. Completion of the Data Classification Framework
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                In record time, we successfully completed the core development of our <strong className="text-slate-900 font-semibold">Data Classification Framework</strong>—designed to help organizations identify, classify, and govern sensitive data across systems with accuracy and scalability.
                            </p>
                            
                            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                <p className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                    The framework brings together:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Automated discovery across structured and unstructured data",
                                        "Intelligent classification using pattern matching and ML",
                                        "Policy-driven governance and access controls",
                                        "Real-time monitoring and compliance reporting"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 group">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1.5 h-3 w-3 rounded-full bg-cyan-600 ring-4 ring-cyan-500/10 hidden md:block shadow-sm" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                                <span className="text-cyan-600"><Brain className="h-6 w-6" /></span>
                                4. AI Models Enabled from Day One
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                A key milestone was the enablement of <strong className="text-slate-900 font-semibold">AI models</strong> within the framework. By embedding intelligence early, we laid the foundation for:
                            </p>
                            
                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {[
                                    { title: "Automated data discovery", desc: "Finding sensitive data wherever it lives" },
                                    { title: "Smart classification and tagging", desc: "Understanding data context beyond regex" },
                                    { title: "Future-ready compliance and observability", desc: "Adapting to evolving regulations" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-100/50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100 transition-colors">
                                        <p className="font-bold text-slate-900">{item.title}</p>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <p className="text-slate-600 text-lg leading-relaxed italic border-l-2 border-cyan-500 pl-6 bg-cyan-50/50 py-4">
                                This ensured our product was <strong className="text-cyan-700">AI-native, not AI-added</strong>. Intelligence isn't a feature—it's the foundation of how Segmento works.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="relative">
                            <div className="absolute -left-11.25 top-1.5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 hidden md:block shadow-sm" />
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                                <span className="text-emerald-600"><Target className="h-6 w-6" /></span>
                                5. Establishing Segmento's Product-First DNA
                            </h2>
                            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                                <p>
                                    2025 firmly established Segmento as a <strong className="text-slate-900 font-semibold">product-driven data technology startup</strong>. Our focus on architecture, privacy, and AI readiness positioned us strongly for scaling data products in 2026 and beyond.
                                </p>
                                <p>
                                    We're not building services—we're building products that enterprises can trust, deploy, and scale independently.
                                </p>
                            </div>
                        </section>

                        {/* Looking Ahead Footer Section */}
                        <section className="mt-32 p-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-slate-200 relative overflow-hidden group shadow-xl shadow-blue-500/5">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="h-24 w-24 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                                🌱 Looking Ahead
                            </h2>
                            <div className="space-y-6 text-slate-600 text-lg leading-relaxed relative z-10">
                                <p>
                                    2025 was about <strong className="text-slate-900">building the foundation</strong>. With a solid product, AI capabilities, and a clear vision, Segmento enters the future ready to innovate, scale, and redefine data governance.
                                </p>
                                <p className="text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Here's to 2026 and beyond—where we turn this foundation into transformative solutions for enterprises worldwide.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Tags Footer */}
                    <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-wrap gap-3">
                        {["Company News", "Milestones", "AI", "Data Classification"].map((tag) => (
                            <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-200 transition-all cursor-default">
                                {tag}
                            </span>
                        ))}
                    </footer>
                </article>
            </div>
        </div>
    )
}