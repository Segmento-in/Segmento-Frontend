"use client"

import { Button } from "@/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, ArrowRight, Zap, Shield, CheckCircle2 } from "lucide-react"
import { useRef, useState, useEffect } from "react"
export default function CTASection() {
    const [isMounted, setIsMounted] = useState(false)
    const sectionRef = useRef(null)

    // Mount check to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    // Smooth parallax for the decorative glows
    const yValue = useTransform(scrollYProgress, [0, 1], [0, 120])

    return (
        <section 
            ref={sectionRef}
            className="py-24 bg-[#F0F9FF] relative overflow-hidden"
        >
            {/* --- Elegant Professional Background --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Fixed position mesh glows - No Math.random() to prevent errors */}
                <motion.div 
                    style={{ y: isMounted ? yValue : 0 }}
                    className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px]" 
                />
                <motion.div 
                    style={{ y: isMounted ? -yValue : 0 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]" 
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(79,70,229,0.08)] group"
                >
                    {/* Subtle Professional Grid Overlay */}
                    <div 
                        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                        style={{ 
                            backgroundImage: `radial-gradient(#4F46E5 1px, transparent 1px)`, 
                            backgroundSize: '32px 32px' 
                        }} 
                    />

                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[10px] font-bold uppercase tracking-wider mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                             Stop Guessing
                        </div>
                         
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight leading-tight">
                                                    Stop Guessing Where Your 
 <br />
                            <span className="text-[#4F46E5]">Sensitive Data Lives.</span>
                        </h2>
                        
                        <p className="text-base md:text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                            Equip your engineering and security teams with a tool that explains its findings, masks data safely, and operates entirely on your terms.

                        </p>

                        {/* Professional Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
    <a href="/contact" className="w-full sm:w-auto">
        <Button 
            variant="outline"
            className="group relative w-full sm:w-auto h-12 px-8 rounded-xl overflow-hidden
                       bg-black border border-white/[0.08] text-white font-bold text-sm
                       hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-300
                       flex items-center justify-center gap-2 shadow-2xl shadow-blue-900/10"
        >
            {/* Dynamic Inner Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            
            <span className="relative z-10">Start Your Local Deployment</span>
            
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-blue-400" />
        </Button>
    </a>
</div>
                        {/* Trust Markers */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-x-8 gap-y-3">
                            {[
                                { icon: Sparkles, text: "No Card Required" },
                                { icon: Shield, text: "GDPR & SOC2" },
                                { icon: CheckCircle2, text: "Instant Setup" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <item.icon className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Minimalist Watermark */}
                    <Shield className="absolute -right-12 -bottom-12 w-48 h-48 text-indigo-500/[0.03] -rotate-12 pointer-events-none" />
                </motion.div>
            </div>
        </section>
    )
}