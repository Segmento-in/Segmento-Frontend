import Link from "next/link"
import { ArrowLeft, TrendingUp, Sparkles, Zap, CheckCircle2 } from "lucide-react"
import { Button } from "@/ui/button"

export const metadata = {
    title: "Introducing Segmento Pulse: Real-Time Technology Intelligence | Blog",
    description: "Announcing Segmento Pulse - Your centralized hub for real-time tech news, trends, and insights across AI, Data, and Cloud",
}

export default function SegmentoPulseLaunchPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <article className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <header className="mb-16">
                        <Link href="/blog">
                            <Button variant="ghost" className="mb-8 text-blue-400 hover:text-white hover:bg-blue-500/10 transition-all group rounded-full border border-blue-500/20">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                                Back to Blog
                            </Button>
                        </Link>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <time className="text-xs font-semibold text-slate-500 tracking-widest uppercase">January 10, 2026</time>
                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                PRODUCT LAUNCH
                            </span>
                        </div>

                        {/* REDUCED HEADLINE SIZE */}
                        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                Introducing Segmento Pulse:
                            </span>
                            <br />
                            <span className="text-white">Real-Time Tech Intelligence</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl border-l-2 border-blue-500/50 pl-6">
                            Stay ahead with curated tech news, trends, and insights—powered by Segmento's commitment to <span className="text-blue-400 font-medium">actionable intelligence.</span>
                        </p>
                    </header>

                    {/* Main Content */}
                    <div className="space-y-16">
                        
                        <section>
                            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                                Today, we're thrilled to announce <strong className="text-white border-b border-blue-500/50">Segmento Pulse</strong>—a new product from Segmento designed to keep technology leaders, data professionals, and innovators informed with real-time news and insights across the rapidly evolving tech landscape.
                            </p>
                        </section>

                        {/* What is Pulse - Feature Card */}
                        <section className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                                    <span className="bg-blue-500/20 p-2 rounded-lg">📰</span> 
                                    What is Segmento Pulse?
                                </h2>
                                <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
                                    <p>
                                        Segmento Pulse is your <strong className="text-blue-400 font-semibold">centralized hub for technology intelligence</strong>. In a world where staying updated is critical to staying competitive, Pulse delivers curated, categorized news from trusted sources—bringing clarity to the noise.
                                    </p>
                                    <p>
                                        Whether you're tracking AI breakthroughs, data security threats, cloud innovations, or business analytics trends, Pulse ensures you never miss what matters.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Why We Built It */}
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                                <Sparkles className="w-6 h-6 text-blue-500" />
                                Why We Built Segmento Pulse
                            </h2>
                            <p className="text-slate-400 text-lg mb-8">
                                At Segmento, we understand the challenges of information overload. Technology professionals are inundated with:
                            </p>
                            <div className="grid gap-4">
                                {[
                                    { text: "Fragmented news sources scattered across platforms", icon: "✕" },
                                    { text: "Irrelevant content that doesn't match focus areas", icon: "✕" },
                                    { text: "Time wasted sifting through noise to find signal", icon: "✕" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                                        <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs font-bold shrink-0">
                                            {item.icon}
                                        </div>
                                        <span className="text-slate-300 font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 text-slate-400 text-lg italic">
                                Segmento Pulse was built to solve this. It's not just another news aggregator—it's a <span className="text-white font-semibold">purpose-built intelligence platform</span> for the modern data and technology professional.
                            </p>
                        </section>

                        {/* Key Features Bento */}
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                                <TrendingUp className="w-6 h-6 text-purple-500" />
                                Key Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "Intelligent Categorization", desc: "News is organized across 11 specialized categories including AI, Security, and Governance.", color: "border-blue-500", icon: "🎯" },
                                    { title: "Real-Time Updates", desc: "Aggregates news from trusted global sources in real-time, keeping you connected.", color: "border-purple-500", icon: "⚡" },
                                    { title: "Intuitive Design", desc: "Bento-style grid interface makes exploring news visually engaging and effortless.", color: "border-indigo-500", icon: "🎨" },
                                    { title: "Curated for Pros", desc: "Built specifically for technology and data professionals covering your key topics.", color: "border-pink-500", icon: "📊" }
                                ].map((feature, i) => (
                                    <div key={i} className={`group bg-slate-900/40 border border-white/5 border-l-4 ${feature.color} p-6 rounded-r-xl hover:bg-slate-800/50 transition-all`}>
                                        <div className="text-2xl mb-3">{feature.icon}</div>
                                        <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Coverage Grid */}
                        <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-8 text-white">📚 Coverage Areas</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: "Artificial Intelligence", bg: "bg-purple-500/10", text: "text-purple-400", sub: "Breakthroughs & Trends" },
                                    { name: "Data Security", bg: "bg-red-500/10", text: "text-red-400", sub: "Threats & Cyber Updates" },
                                    { name: "Data Governance", bg: "bg-emerald-500/10", text: "text-emerald-400", sub: "Compliance & Regulations" },
                                    { name: "Data Privacy", bg: "bg-amber-500/10", text: "text-amber-400", sub: "GDPR & Global Privacy" },
                                    { name: "Data Engineering", bg: "bg-indigo-500/10", text: "text-indigo-400", sub: "ETL & Infrastructure" },
                                    { name: "Business Intelligence", bg: "bg-violet-500/10", text: "text-violet-400", sub: "Tools & Dashboards" },
                                    { name: "Business Analytics", bg: "bg-blue-500/10", text: "text-blue-400", sub: "Methodologies & Trends" },
                                    { name: "Cloud Computing", bg: "bg-cyan-500/10", text: "text-cyan-400", sub: "AWS, Azure, GCP" },
                                    { name: "Tech Magazines", bg: "bg-slate-500/10", text: "text-slate-400", sub: "Deep Dive Articles" }
                                ].map((cat, i) => (
                                    <div key={i} className={`${cat.bg} p-4 rounded-xl border border-white/5 transition-transform hover:-translate-y-1`}>
                                        <h4 className={`font-bold ${cat.text} text-sm mb-1`}>{cat.name}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{cat.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Value List */}
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                                <Zap className="w-6 h-6 text-yellow-500" />
                                The Value Segmento Pulse Brings
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Time Savings", desc: "Get everything in one place, no more source jumping.", color: "text-green-400" },
                                    { title: "Informed Decisions", desc: "Strategy backed by latest industry insights.", color: "text-blue-400" },
                                    { title: "Competitive Edge", desc: "Stay ahead of trends before your competitors do.", color: "text-purple-400" },
                                    { title: "Focused Learning", desc: "Deepen expertise without information overload.", color: "text-indigo-400" }
                                ].map((value, i) => (
                                    <div key={i} className="flex gap-4">
                                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-1 ${value.color}`} />
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{value.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{value.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA SECTION */}
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 md:p-16 text-center shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">🚀 Get Started with Pulse Today</h2>
                            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                                Segmento Pulse is <strong>live and free to use</strong>. Join the hub built for technology leaders and innovators.
                            </p>
                            <Link href="/pulse">
                                <Button className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-10 py-7 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                                    Explore Segmento Pulse →
                                </Button>
                            </Link>
                        </section>

                        {/* Roadmap */}
                        <section className="py-10 border-t border-white/10">
                            <h2 className="text-2xl font-bold mb-6 text-white italic">💡 What's Next</h2>
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                {["Personalized feeds", "Newsletter delivery", "AI summaries", "Sentiment analysis", "Mobile apps"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-500 text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Footer / Final Thoughts */}
                        <footer className="pt-10 border-t border-white/10 text-center space-y-4 pb-20">
                            <h2 className="text-xl font-bold text-white">🎯 Final Thoughts</h2>
                            <p className="text-slate-500 text-sm italic max-w-2xl mx-auto">
                                With Segmento Pulse, we're delivering <strong>intelligence</strong>. Clarity, relevance, and real-time insights—all in one place.
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-2 pt-8">
                                {["Product Launch", "Segmento Pulse", "Tech News", "Real-Time Intelligence"].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-bold tracking-wider uppercase">
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