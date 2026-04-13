"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/ui/button" 
import { MessageSquareText, Zap, ShieldCheck, Activity, Lock, Database, Globe } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"

const data = [
    { name: "Discovery", value: 35, color: "#2563EB", icon: <Activity className="w-5 h-5" /> }, // Blue
    { name: "Observability", value: 25, color: "#16A34A", icon: <ShieldCheck className="w-5 h-5" /> }, // Green
    { name: "Security", value: 15, color: "#DC2626", icon: <Lock className="w-5 h-5" /> }, // Red
    { name: "Governance", value: 15, color: "#DB2777", icon: <Database className="w-5 h-5" /> }, // Pink
    { name: "Compliance", value: 10, color: "#EAB308", icon: <Globe className="w-5 h-5" /> }, // Yellow
]

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
    return (
        <g>
            <defs>
                <filter id="premiumGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <Sector
                cx={cx} cy={cy}
                innerRadius={innerRadius - 2}
                outerRadius={outerRadius + 16}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                filter="url(#premiumGlow)"
                className="transition-all duration-700 cursor-pointer"
            />
        </g>
    )
}

export function HeroSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const DynamicPie = Pie as any;

    // Auto-highlight next color every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % data.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-24">
            {/* Subtle Professional Background */}
            <div className="absolute top-0 right-0 w-150 h-150 bg-slate-50 rounded-full blur-[120px] pointer-events-none opacity-40" />
            
            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left: Professional Typography */}
                    <div className="flex-1 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-[#0F172A] text-4xl md:text-5xl lg:text-[5.2rem] font-black leading-[0.95] mb-8 tracking-tighter">
                                Secure Your Sensitive Data <br />
                               with,Transparent<br />
                                <span className="text-[#2563EB]">Multi-Engine PII Detection.</span>
                            </h1>
                            
                            <p className="text-[#64748B] text-xl mb-12 max-w-xl leading-relaxed font-normal tracking-tight">
                                Move beyond legacy "black box" platforms. Segmento Sense delivers Explainable AI, 100% client-side OCR, and instant synthetic data cloning to discover, classify, and protect your PII without your data ever leaving your infrastructure.

                            </p>
                             
                            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
    {/* First Button: Deploy Sense */}
    <a href="/products/data-classification/demo" className="block w-full sm:w-auto">
        <Button className="h-16 w-full sm:w-64 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-none font-bold tracking-[0.1em] uppercase transition-all shadow-xl flex items-center justify-center gap-3">
            <MessageSquareText className="w-6 h-5 text-blue-400" />
            <span className="text-sm">Demo</span>
        </Button>
    </a>

    {/* Second Button: Engineering Docs */}
   <a href="/contact" className="block w-full sm:w-auto">
    <Button 
        variant="outline" 
        className="h-16 w-full sm:w-64 border-slate-200 text-[#0F172A] bg-white hover:bg-slate-50 rounded-none border-[1.5px] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-3 transition-all"
    >
        <Zap className="w-6 h-5 text-amber-500" />
        <span className="text-sm">View Docs</span>
    </Button>
</a>
</div>
                        </motion.div>
                    </div>

                    {/* Right: Auto-Cycling Rotating Graph */}
                    <div className="flex-1 relative w-full h-[420px] sm:h-[520px] lg:h-[650px] flex items-center justify-center">
                        
                        {/* Slow Rotating Container */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full relative z-10"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <DynamicPie
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        data={data}
                                        cx="50%" cy="50%"
                                        innerRadius={150}
                                        outerRadius={200}
                                        dataKey="value"
                                        onMouseEnter={(_:any, i:number) => setActiveIndex(i)}
                                        stroke="none"
                                        paddingAngle={6}
                                    >
                                        {data.map((entry: any, index: number) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color} 
                                                className="outline-none transition-all duration-1000"
                                                // Darkened Multicolor logic
                                                style={{
                                                    filter: `
                                                        contrast(1.2) brightness(0.6) saturate(0.9)
                                                        ${activeIndex === index ? 'brightness(1.2) saturate(1.3)' : ''}
                                                    `,
                                                    opacity: activeIndex === index ? 1 : 0.25
                                                }}
                                            />
                                        ))}
                                    </DynamicPie>
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Stationary Center Text (Pinned) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                                    className="text-center"
                                >
                                    <div className="flex items-center justify-center mb-4 transition-colors duration-500" style={{ color: data[activeIndex].color }}>
                                        {data[activeIndex].icon}
                                    </div>
                                    <span className="text-8xl font-black text-[#0F172A] tracking-tighter block leading-none">
                                        {data[activeIndex].value}%
                                    </span>
                                    <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 mt-5">
                                        {data[activeIndex].name}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Tech Orbitals */}
                        <div className="absolute inset-0 border-[0.5px] border-slate-100 rounded-full scale-[0.6] pointer-events-none" />
                        <div className="absolute inset-0 border-[0.5px] border-slate-100 rounded-full scale-[0.85] pointer-events-none opacity-40" />

                        
                    </div>
                </div>
            </div>
        </section>
    )
}