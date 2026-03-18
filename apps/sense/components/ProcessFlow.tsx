"use client"

import { motion, Variants } from "framer-motion"
import { Eye, Brain, CheckCircle, Sparkles, Database, Search, MessageSquare, Zap } from "lucide-react"

const steps = [
    {
        icon: Database,
        title: "Connect & Ingest",
        description: "Seamlessly attach to file systems, databases, and object storage.",
        color: "from-blue-600 to-indigo-700",
        position: "top-0 left-1/2 -translate-x-1/2", // Top Center
    },
    {
        icon: Search,
        title: "Detection",
        description: "Run Regex, rules, and NLP models simultaneously on extracted text.",
        color: "from-indigo-600 to-violet-700",
        position: "top-1/2 -translate-y-1/2 right-0", // Right Center
    },
    {
        icon: MessageSquare,
        title: "Score & Explain",
        description: "Generate confidence scores and provide plain-text reasoning.",
        color: "from-violet-600 to-fuchsia-700",
        position: "bottom-0 left-1/2 -translate-x-1/2", // Bottom Center
    },
    {
        icon: Zap,
        title: "Tag & Automate",
        description: "Push metadata tags to generate remediation scripts instantly.",
        color: "from-fuchsia-600 to-pink-700",
        position: "top-1/2 -translate-y-1/2 left-0", // Left Center
    },
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.4, // Faster stagger for 4 items
            delayChildren: 0.2
        },
    },
}

const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.85, 
        y: 30,
        filter: "blur(8px)" 
    },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 100,
        }
    },
}

export function ProcessFlow() {
    return (
        <section className="pb-32 pt-20 bg-[#F8FAFC] overflow-hidden">
            <motion.div 
                className="container mx-auto px-4 relative max-w-6xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={containerVariants}
            >
                
                {/* Clean, Dynamic Header Section */}
                <div className="text-center mb-24">
                    <motion.h2 
                        variants={cardVariants}
                        className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight leading-[0.95] mb-6"
                    >
                        Built to detect the way <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">humans actually think.</span>
                    </motion.h2>
                    <motion.p 
                        variants={cardVariants}
                        className="max-w-2xl mx-auto text-slate-600 font-medium text-sm md:text-base leading-relaxed"
                    >
                        Moving beyond simple regex. Our multi-layered approach combines mathematical precision with neural-network understanding.
                    </motion.p>
                </div>

                {/* Circular Process Wrapper */}
                <div className="relative h-[700px] w-full max-w-[700px] mx-auto flex items-center justify-center">
                    
                    {/* Ultra-Thin Precision Trace */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(15, 23, 42, 0.03)" strokeWidth="0.1" />
                        <motion.circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke="url(#premiumLine)"
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                        />
                        <defs>
                            <linearGradient id="premiumLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Staggered Reveal Process Cards */}
                    {steps.map((step, idx) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                className={`absolute ${step.position} z-20 group`}
                            >
                                <div className="relative w-64 h-64 rounded-full flex items-center justify-center p-8 transition-all duration-500 hover:-translate-y-2">
                                    
                                    {/* Glass Body */}
                                    <div className="absolute inset-0 rounded-full bg-white border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.03)] group-hover:border-indigo-400/50 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 transition-all duration-500" />
                                    
                                    {/* Rotating Active Border Shimmer */}
                                    <div className="absolute inset-0 rounded-full p-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin [animation-duration:8s]" />
                                        <div className="absolute inset-[1.5px] rounded-full bg-white" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>

                                        <h3 className="text-base font-black text-slate-950 mb-1 tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed max-w-[150px]">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Step Label */}
                                    <div className="absolute top-6 right-12">
                                        <span className="text-[8px] font-black text-slate-950/20 tracking-tighter uppercase">Step 0{idx + 1}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>
        </section>
    )
}