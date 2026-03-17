"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap, Activity, Plus } from "lucide-react"
import { Button } from "@/ui/button" 
import { motion } from "framer-motion"

export function ComparisonCTA() {
    const stats = [
    { value: "<15min", label: "Setup Time", icon: Zap, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    { value: "99.9%", label: "Accuracy", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
    { value: "12+", label: "Integrations", icon: Plus, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { value: "24/7", label: "Monitoring", icon: Activity, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
]

    return (
        <section className="relative py-32 bg-[#F8FAFF] overflow-hidden">
            
            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%]  bg-blue-100/50 blur-[120px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%]  bg-indigo-100/40 blur-[100px]" />

            <div className="container relative mx-auto px-6 z-10 max-w-6xl">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-white/70 backdrop-blur-3xl border border-white p-12 md:p-20  shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                    {/* 1. Header Section */}
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="h-[2.5px] w-10 bg-blue-600" />
                            
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-[#0F172A] leading-[0.95] tracking-tighter mb-10">
                            How Does Segmento <br /> 
                            <span className="text-blue-600">Stack Up?</span>
                        </h2>

                        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
                            Compare our agentless AI approach with legacy platforms. See the difference 
                            in architecture, performance, and total cost of ownership.
                        </p>
                    </div>

                   {/* 2. Moving Stats Marquee */}
<div className="relative w-full mb-16">
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 z-10 pointer-events-none" />
    <div className="flex overflow-hidden group py-10 border-y border-slate-100/50">
        <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
            }}
            /* Added 'pr-32' to create a massive gap before the repeat starts */
            className="flex gap-12 items-center whitespace-nowrap pr-32"
        >
            {[...stats, ...stats].map((stat, i) => (
                <div key={i} className="flex items-center gap-6 px-8">
                    {/* Colorful icon containers based on the stat color */}
                    <div className={`p-4 rounded-2xl shadow-sm border border-white/50 transition-transform duration-500 group-hover:rotate-6 ${stat.bg}`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-5xl font-black text-[#0F172A] tracking-tighter">
                            {stat.value}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            {stat.label}
                        </span>
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
    {/* Faded edges to blend with the card background */}
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/90 to-transparent z-10" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/90 to-transparent z-10" />
</div>

                    {/* 3. Short Centered Buttons */}
                    <div className="flex flex-row gap-4 justify-center items-center">
                        
                        <Button asChild variant="ghost" className="h-12 px-8 bg-[#0F172A] hover:bg-blue-600 text-white rounded-none font-black tracking-widest text-[11px] uppercase transition-all duration-500 group shadow-lg">
                            <Link href="/pricing">See Pricing</Link>
                        </Button>
                    </div>

                    {/* Decorative Corner Element */}
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Plus className="w-12 h-12 text-blue-600" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}