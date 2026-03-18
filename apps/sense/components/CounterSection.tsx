"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useSpring, useTransform, useMotionValue, animate } from "framer-motion"
import { Shield, Activity, TrendingUp, Zap, Globe, ArrowRight, Cpu, FileSearch, Lock, Eye } from "lucide-react"
import { Button } from "@/ui/button" 

// --- COUNTER & DYNAMIC GRAPHS ---
export function CounterSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    
    // Counter Logic
    const count = useMotionValue(0)
    const springCount = useSpring(count, { stiffness: 40, damping: 20 }) 
    const rounded = useTransform(springCount, (latest) => Math.round(latest))
    const themeColor = useTransform(springCount, [0, 50], ["#EF4444", "#3B82F6"])

    useEffect(() => {
        if (isInView) {
            animate(count, 50, { duration: 3, ease: [0.16, 1, 0.3, 1] })
        }
    }, [isInView, count])

    const stats = [
        { icon: FileSearch, label: "File Formats", value: "400+" },
        { icon: Eye, label: "Client-Side OCR", value: "100%" },
        { icon: Lock, label: "Cloud Egress", value: "Zero" },
        { icon: Zap, label: "AI Triggers", value: "100%" }
    ]

    return (
        <section ref={ref} className="relative pb-32 bg-[#F8FAFF] overflow-hidden pt-4">
            <div className="container relative mx-auto px-6 z-10 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Counter Card with Live Graph */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-8 bg-white border border-slate-200 p-10 rounded-[40px] shadow-sm relative overflow-hidden"
                    >
                        {/* Live Frequency Graph (Background) */}
                        <div className="absolute top-0 right-0 w-full h-48 opacity-[0.05] pointer-events-none">
                            <svg viewBox="0 0 400 100" className="w-full h-full">
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={isInView ? { pathLength: 1 } : {}}
                                    transition={{ duration: 4 }}
                                    d="M0 50 Q 25 10 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                                        <Cpu className="w-4 h-4 animate-pulse" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Counter</span>
                                </div>
                                <div className="flex gap-1 h-6 items-end">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div 
                                            key={i}
                                            animate={{ height: ["20%", "100%", "40%"] }}
                                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                            className="w-1 bg-blue-200 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex items-baseline">
                                <motion.div 
                                    style={{ color: themeColor }}
                                    className="text-[9rem] md:text-[12rem] font-black tracking-tighter leading-none"
                                >
                                    <motion.span>{rounded}</motion.span>
                                    <span className="text-4xl md:text-6xl ml-4 font-black text-slate-200">M+</span>
                                </motion.div>
                            </div>

                            <div className="mt-10 flex flex-col md:flex-row justify-between items-end gap-6">
                                <div className="max-w-[300px]">
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Total records protected across global endpoints by Segmento Sense.
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-blue-600 uppercase mb-2">Network Load</span>
                                    <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            style={{ backgroundColor: themeColor }}
                                            initial={{ width: 0 }}
                                            animate={isInView ? { width: "100%" } : {}}
                                            transition={{ duration: 3 }}
                                            className="h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: 4 Specific Stats Grid */}
                    <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
                        {stats.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm flex flex-col justify-between relative overflow-hidden group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="h-3 flex gap-0.5 items-end">
                                        {[...Array(3)].map((_, j) => (
                                            <motion.div 
                                                key={j}
                                                animate={{ height: ["40%", "100%", "60%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }}
                                                className="w-0.5 bg-slate-100 group-hover:bg-blue-200"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-black text-[#0F172A] leading-none mb-1">{item.value}</div>
                                    <div className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-blue-500 transition-colors">
                                        {item.label}
                                    </div>
                                </div>
                                
                                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-50 rounded-full blur-xl group-hover:bg-blue-100 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}