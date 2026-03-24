'use client'

import Link from "next/link"
import { ArrowLeft, TrendingUp, Sparkles, Zap, CheckCircle2 } from "lucide-react"

export default function SegmentoPulseLaunchPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <article className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <header className="mb-16">
                        <Link href="/blog">
                            <button className="flex items-center mb-8 px-4 py-2 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 transition-all group rounded-full border border-blue-200 cursor-pointer bg-white shadow-sm">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                                Back to Blog
                            </button>
                        </Link>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <time className="text-xs font-semibold text-slate-500 tracking-widest uppercase">January 10, 2026</time>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold shadow-sm">
                                PRODUCT LAUNCH
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                                Introducing Segmento Pulse:
                            </span>
                            <br />
                            <span className="text-slate-900">Real-Time Tech Intelligence</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl border-l-2 border-blue-500/50 pl-6">
                            Stay ahead with curated tech news, trends, and insights—powered by Segmento's commitment to <span className="text-blue-600 font-medium">actionable intelligence.</span>
                        </p>
                    </header>

                    {/* Main Content */}
                    <div className="space-y-16">
                        
                        <section>
                            <p className="text-slate-700 text-lg md:text-xl leading-relaxed">
                                Today, we're thrilled to announce <strong className="text-slate-900 border-b border-blue-200">Segmento Pulse</strong>—a new product from Segmento designed to keep technology leaders, data professionals, and innovators informed with real-time news and insights across the rapidly evolving tech landscape.
                            </p>
                        </section>

                        {/* What is Pulse - Feature Card */}
                        <section className="relative group">
    {/* PURPLE/BLUE GLOW EFFECT */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
    
    {/* GLASS CARD */}
    <div className="relative bg-slate-950/80 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-xl shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-4 text-white">
            <span className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2.5 rounded-xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                📰
            </span> 
            What is Segmento Pulse?
        </h2>
        
        <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
            <p>
                Segmento Pulse is your <strong className="text-blue-400 font-semibold">centralized hub for technology intelligence</strong>. In a world where staying updated is critical to staying competitive, Pulse delivers curated, categorized news from trusted sources—bringing clarity to the noise.
            </p>
            <p>
                Whether you're tracking AI breakthroughs, data security threats, cloud innovations, or business analytics trends, Pulse ensures you never miss what matters.
            </p>
        </div>

        {/* SUBTLE CORNER ACCENT */}
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-tr-xl"></div>
        </div>
    </div>
</section>

                        {/* Key Features Bento */}
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                                <span className="p-1.5 bg-purple-50 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </span>
                                Key Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "Intelligent Categorization", desc: "News is organized across 11 specialized categories including AI, Security, and Governance.", color: "border-blue-500", icon: "🎯" },
                                    { title: "Real-Time Updates", desc: "Aggregates news from trusted global sources in real-time, keeping you connected.", color: "border-purple-500", icon: "⚡" },
                                    { title: "Intuitive Design", desc: "Bento-style grid interface makes exploring news visually engaging and effortless.", color: "border-indigo-500", icon: "🎨" },
                                    { title: "Curated for Pros", desc: "Built specifically for technology and data professionals covering your key topics.", color: "border-pink-500", icon: "📊" }
                                ].map((feature, i) => (
                                    <div key={i} className={`group bg-white border border-slate-200 border-l-4 ${feature.color} p-6 rounded-r-xl hover:shadow-md transition-all`}>
                                        <div className="text-2xl mb-3">{feature.icon}</div>
                                        <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Coverage Grid */}
                        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-8 text-slate-900">📚 Coverage Areas</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: "Artificial Intelligence", bg: "bg-purple-100", text: "text-purple-700", sub: "Breakthroughs & Trends" },
                                    { name: "Data Security", bg: "bg-red-100", text: "text-red-700", sub: "Threats & Cyber Updates" },
                                    { name: "Data Governance", bg: "bg-emerald-100", text: "text-emerald-700", sub: "Compliance & Regulations" },
                                    { name: "Data Privacy", bg: "bg-amber-100", text: "text-amber-700", sub: "GDPR & Global Privacy" },
                                    { name: "Data Engineering", bg: "bg-indigo-100", text: "text-indigo-700", sub: "ETL & Infrastructure" },
                                    { name: "Business Intelligence", bg: "bg-violet-100", text: "text-violet-700", sub: "Tools & Dashboards" },
                                    { name: "Business Analytics", bg: "bg-blue-100", text: "text-blue-700", sub: "Methodologies & Trends" },
                                    { name: "Cloud Computing", bg: "bg-cyan-100", text: "text-cyan-700", sub: "AWS, Azure, GCP" },
                                    { name: "Tech Magazines", bg: "bg-slate-200", text: "text-slate-700", sub: "Deep Dive Articles" }
                                ].map((cat, i) => (
                                    <div key={i} className={`${cat.bg} p-4 rounded-xl border border-white transition-transform hover:-translate-y-1 shadow-sm`}>
                                        <h4 className={`font-bold ${cat.text} text-sm mb-1`}>{cat.name}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{cat.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Value List */}
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                                <span className="p-1.5 bg-yellow-50 rounded-lg">
                                    <Zap className="w-6 h-6 text-yellow-600" />
                                </span>
                                The Value Segmento Pulse Brings
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Time Savings", desc: "Get everything in one place, no more source jumping.", color: "text-green-600" },
                                    { title: "Informed Decisions", desc: "Strategy backed by latest industry insights.", color: "text-blue-600" },
                                    { title: "Competitive Edge", desc: "Stay ahead of trends before your competitors do.", color: "text-purple-600" },
                                    { title: "Focused Learning", desc: "Deepen expertise without information overload.", color: "text-indigo-600" }
                                ].map((value, i) => (
                                    <div key={i} className="flex gap-4">
                                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-1 ${value.color}`} />
                                        <div>
                                            <h4 className="text-slate-900 font-bold mb-1">{value.title}</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA SECTION */}
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 md:p-16 text-center shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">🚀 Get Started with Pulse Today</h2>
                            <p className="text-blue-50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                                Segmento Pulse is <strong>live and free to use</strong>. Join the hub built for technology leaders and innovators.
                            </p>
                            <Link href="/pulse">
                                <button className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-10 py-4 rounded-full font-extrabold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer">
                                    Explore Segmento Pulse →
                                </button>
                            </Link>
                        </section>

                        {/* Roadmap */}
                        <section className="py-10 border-t border-slate-200">
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 italic">💡 What's Next</h2>
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                {["Personalized feeds", "Newsletter delivery", "AI summaries", "Sentiment analysis", "Mobile apps"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-500 text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Footer / Final Thoughts */}
                        <footer className="pt-10 border-t border-slate-200 text-center space-y-4 pb-20">
                            <h2 className="text-xl font-bold text-slate-900">🎯 Final Thoughts</h2>
                            <p className="text-slate-500 text-sm italic max-w-2xl mx-auto">
                                With Segmento Pulse, we're delivering <strong>intelligence</strong>. Clarity, relevance, and real-time insights—all in one place.
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-2 pt-8">
                                {["Product Launch", "Segmento Pulse", "Tech News", "Real-Time Intelligence"].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold tracking-wider uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </footer>
                    </div>
                </article>
            </div>
        </div>
    )
}