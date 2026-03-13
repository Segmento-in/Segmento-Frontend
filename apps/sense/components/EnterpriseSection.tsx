"use client"

import { Shield, Clock, Headphones, Server, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

const enterpriseFeatures = [
    {
        icon: Clock,
        title: "99.9%+ uptime",
        description: "Battle-tested infrastructure you can trust in production and at scale.",
    },
    {
        icon: Headphones,
        title: "Enterprise support and SLAs",
        description: "Hands-on forward deployed support and tailored SLAs to meet your enterprise needs.",
    },
    {
        icon: Shield,
        title: "SOC2, HIPAA compliant",
        description: "Enterprise-grade security, certified for sensitive and regulated data.",
    },
    {
        icon: Server,
        title: "Deploy in your environment",
        description: "Run Segmento Sense entirely within your own infrastructure for strict compliance.",
    },
]

export function EnterpriseSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    
                    {/* Left Side: Content */}
                    <div className="w-full lg:w-1/2">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366f1] text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm"
                        >
                            <Sparkles className="h-3 w-3" />
                            Scale with Confidence
                        </motion.div>
                        
                        <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
                            Ready for the <br />
                            <span className="text-[#6366f1]">Enterprise.</span>
                        </h2>
                        
                        <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed font-medium">
                            From security to scale, Segmento Sense is built for the demands of production environments. Trusted by the world's most regulated industries.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link href="/contact">
                                <Button size="lg" className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 h-14 rounded-2xl text-base font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1">
                                    Contact sales
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                                View Security Whitepaper
                            </Button>
                        </div>

                        {/* Certification Badges */}
                        <div className="pt-8 border-t border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Security Certifications</p>
                            <div className="flex flex-wrap gap-3">
                                {["SOC 2 TYPE II", "HIPAA COMPLIANT", "ISO 27001", "GDPR READY"].map((badge) => (
                                    <span key={badge} className="text-[10px] font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Feature Cards */}
                    <div className="w-full lg:w-1/2 grid sm:grid-cols-2 gap-4">
                        {enterpriseFeatures.map((feature, idx) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group p-6 bg-white border border-slate-100 rounded-3xl transition-all duration-300 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-900/5"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#6366f1] mb-6 group-hover:bg-[#6366f1] group-hover:text-white transition-colors duration-300">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#6366f1] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                    <div className="mt-4 flex items-center text-[#6366f1] text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                        Learn more <ChevronRight className="h-3 w-3 ml-1" />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    )
}