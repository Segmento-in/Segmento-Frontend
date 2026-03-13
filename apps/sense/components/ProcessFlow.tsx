"use client"

import { motion, useInView } from "framer-motion"
import { Eye, Brain, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import { useRef } from "react"

const steps = [
    {
        icon: Eye,
        title: "Traditional Pattern Matching",
        description: "Segmento Sense uses advanced pattern recognition to identify potential PII across all data sources with high-speed indexing.",
        color: "from-blue-500 to-indigo-600",
    },
    {
        icon: Brain,
        title: "AI Classification & Context",
        description: "Machine learning models analyze semantic context, classify sensitivity levels, and map complex data relationships.",
        color: "from-indigo-600 to-violet-600",
    },
    {
        icon: CheckCircle,
        title: "Human-Level Verification",
        description: "Our system validates edge cases and corrects false positives, ensuring 99.9% accuracy in complex compliance scenarios.",
        color: "from-violet-600 to-fuchsia-600",
    },
]

export function ProcessFlow() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section className="py-24 bg-[#F0F9FF] overflow-hidden" ref={ref}>
            <div className="container mx-auto px-4 relative">
                
                {/* Background Decorative Element */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-40 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[120px]" />
                </div>

                <div className="text-center mb-20 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
                    >
                        <Sparkles className="h-3 w-3" />
                        The Multi-Pass Engine
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight leading-[1.1]">
                        Built to detect the way <br />
                        <span className="text-[#6366f1]">humans actually think.</span>
                    </h2>
                    
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Moving beyond simple regex. Our multi-layered approach combines mathematical precision with neural-network understanding.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {/* The Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[4.5rem] left-0 w-full h-[2px] bg-indigo-100/50" />

                    {steps.map((step, idx) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative"
                            >
                                {/* Animated Line Progress Overlay */}
                                {idx < steps.length - 1 && (
                                    <motion.div 
                                        className="hidden md:block absolute top-[4.5rem] left-[50%] w-full h-[2px] bg-gradient-to-r from-indigo-400 to-transparent z-20"
                                        initial={{ scaleX: 0, originX: 0 }}
                                        animate={isInView ? { scaleX: 1 } : {}}
                                        transition={{ delay: (idx * 0.2) + 0.5, duration: 1 }}
                                    />
                                )}

                                <div className="relative z-10 bg-white border border-white rounded-4xl p-8 h-full flex flex-col items-center text-center transition-all duration-500 shadow-xl shadow-blue-900/5 group-hover:shadow-2xl group-hover:shadow-indigo-900/10 group-hover:-translate-y-1">
                                    
                                    {/* Icon Squircle Container */}
                                    <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} p-[1px] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-indigo-200/40`}>
                                        <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
                                            <Icon className="h-8 w-8 text-[#6366f1]" />
                                        </div>
                                        
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">
                                            0{idx + 1}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        {step.description}
                                    </p>

                                    {/* Interaction Indicator */}
                                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <ArrowRight className="h-5 w-5 text-indigo-400" />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Bottom Status Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="mt-20 p-5 bg-[#6366f1] rounded-3xl max-w-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200"
                >
                    <p className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                        "Integrates seamlessly with our development workflow"
                    </p>
                </motion.div>
            </div>
        </section>
    )
}