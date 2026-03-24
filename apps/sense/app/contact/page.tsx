"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Mail, 
    Phone, 
    MapPin, 
    Send, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    Zap
} from "lucide-react"

export default function ContactPage() {
    const [mounted, setMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise(r => setTimeout(r, 1500))
        setIsSubmitting(false)
        setSubmitted(true)
    }

    if (!mounted) return null

    return (
        <main className="min-h-screen bg-white relative overflow-hidden selection:bg-indigo-100 font-sans">
            {/* --- Dynamic Background --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px]" 
                />
            </div>

            <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[10px] font-bold uppercase tracking-wider mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                            Support Online
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[0.95] mb-6">
                            Let's talk about <br />
                            <span className="text-[#4F46E5]">data security.</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
                            Have questions about PII detection or enterprise integration? Our engineering team is ready to help.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        
                        {/* Left Side: Information Cards */}
                        <div className="lg:col-span-5 space-y-6">
                            {[
                                { 
                                    icon: Mail, 
                                    title: "Email Support", 
                                    desc: "Response within 2 hours", 
                                    detail: "info@segmento.in",
                                    color: "text-blue-600",
                                    bg: "bg-blue-50/50"
                                },
                                { 
                                    icon: Phone, 
                                    title: "Direct Line", 
                                    desc: "Mon-Fri, 9am - 6pm PST", 
                                    detail: "+91 9908727027",
                                    color: "text-indigo-600",
                                    bg: "bg-indigo-50/50"
                                },
                                { 
                                    icon: MapPin, 
                                    title: "Main Office", 
                                    desc: "Visakhapatnam, India",
                                    detail: "Aathidyam, Rama talkies, Waltair Uplands",
                                    color: "text-emerald-600",
                                    bg: "bg-emerald-50/50"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 8 }}
                                    className="p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-xs text-slate-400 font-medium mb-1">{item.desc}</p>
                                            <p className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:text-indigo-700">
                                                {item.detail} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="mt-10 p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 relative overflow-hidden group">
                                <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-200/40 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck className="text-indigo-600" size={20} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Enterprise Security</span>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-indigo-900/70">
                                        Your inquiries are encrypted and handled with strict confidentiality.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Light Themed Contact Form */}
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
                            >
                                <AnimatePresence mode="wait">
                                    {!submitted ? (
                                        <motion.form 
                                            key="contact-form"
                                            onSubmit={handleSubmit} 
                                            className="space-y-6"
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                    <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                                    <input required type="email" placeholder="john@company.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                                                <div className="relative">
                                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all appearance-none cursor-pointer">
                                                        <option>Enterprise Sense Deployment</option>
                                                        <option>API & Integration Support</option>
                                                        <option>Security Compliance</option>
                                                        <option>General Feedback</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ArrowRight size={16} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                                <textarea required rows={4} placeholder="Tell us about your requirements..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none" />
                                            </div>

                                            <button 
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white h-16 rounded-2xl text-base font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                            >
                                                {isSubmitting ? "Sending..." : "Send Message"}
                                                {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.div 
                                            key="success-message"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="py-20 text-center"
                                        >
                                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                            <p className="text-slate-500 font-medium mb-8">Transmission received. Our engineering team will be in touch shortly.</p>
                                            <button 
                                                onClick={() => setSubmitted(false)}
                                                className="px-8 py-3 rounded-xl bg-slate-900 font-bold text-sm text-white hover:bg-slate-800 transition-all"
                                            >
                                                Send another message
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}