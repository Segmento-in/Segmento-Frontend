"use client"

import { Shield, Clock, Headphones, Server, ChevronRight } from "lucide-react"
import { motion, Variants } from "framer-motion"

const enterpriseFeatures = [
    {
        icon: Clock,
        title: "99.9%+ uptime",
        description: "Battle-tested infrastructure you can trust at scale.",
    },
    {
        icon: Headphones,
        title: "Enterprise support",
        description: "Hands-on support and tailored SLAs for your needs.",
    },
    {
        icon: Shield,
        title: "SOC2, HIPAA compliant",
        description: "Certified security for sensitive and regulated data.",
    },
    {
        icon: Server,
        title: "Local Deployment",
        description: "Run Segmento Sense within your own infrastructure.",
    },
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.05,
        },
    },
}

const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 20, 
        scale: 0.98,
        filter: "blur(4px)" 
    },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: "blur(0px)",
        transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 120 
        }
    }
}

export function EnterpriseSection() {
    return (
        // Reduced top padding (py-16 instead of py-32) to reduce gap before section
        <section id="enterprise" className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    
                    {/* Left Side: Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-950 tracking-[-0.05em] leading-[0.95]">
                            Built for Scale <br />
                            <span className="text-[#6366f1]">Engineered for Sovereignty.</span>
                        </h2>
                        
                        <p className="text-base text-slate-500 max-w-md mb-8 leading-relaxed font-medium">
                           Segmento Sense is designed around stateless workers and decoupled ingestion queues, allowing you to scale horizontally across your own infrastructure. Keep your data local, reduce your cloud egress costs, and maintain total compliance.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-10">
                            <a
  href="https://www.segmento.in/contact"
  className="block w-full sm:w-auto"
> 
                                <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 h-14 rounded-xl text-sm font-black shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                                    Contact sales
                                </button>
                            </a>
                            
                        </div>

                        {/* Certification Badges */}
                        <div className="pt-8 border-t border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Security Certifications</p>
                            <div className="flex flex-wrap gap-2">
                                {["SOC 2 TYPE II", "HIPAA", "ISO 27001", "GDPR"].map((badge, i) => (
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        key={badge} 
                                        className="text-[9px] font-black px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg"
                                    >
                                        {badge}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Feature Cards (Reduced Height & Gap) */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="w-full lg:w-1/2 grid sm:grid-cols-2 gap-4"
                    >
                        {enterpriseFeatures.map((feature, idx) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={idx}
                                    variants={cardVariants}
                                    whileHover={{ scale: 1.02 }}
                                    className="group relative p-6 bg-white border border-slate-100 rounded-[2rem] transition-all duration-300 hover:border-indigo-300 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.1)]"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-5 group-hover:bg-[#6366f1] group-hover:text-white group-hover:rotate-3 transition-all duration-500">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-slate-950 mb-2 tracking-tight transition-colors">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-xs text-slate-500 leading-normal font-medium mb-4 opacity-80 group-hover:opacity-100">
                                        {feature.description}
                                    </p>
                                    
                                    <div className="flex items-center text-[#6366f1] text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                        Details <ChevronRight className="h-3 w-3 ml-1" />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}