"use client"

import { Button } from "@/ui/button"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Zap, Shield } from "lucide-react"

export function CTASection() {
    return (
        /* Section background set to your specific light azure tint #F0F9FF */
        <section className="py-24 bg-[#F0F9FF] relative overflow-hidden">
            
            {/* Soft Background Decorative Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    /* Light Theme Card: White background with a subtle border and high-end shadow */
                    className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(79,70,229,0.1)]"
                >
                    {/* Subtle Shield Watermark in Indigo Tint */}
                    <Shield className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500/5 rotate-12 pointer-events-none" />
                    
                    {/* Subtle Grid Pattern Overlay in Indigo Tint */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: `radial-gradient(#4F46E5 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                    
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[10px] font-bold uppercase tracking-widest mb-8"
                        >
                            <Zap className="h-3 w-3 fill-current" />
                            Ready to secure your data?
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 tracking-tight leading-[1.1]">
                            Get started in <br />
                            <span className="text-[#4F46E5]">
                                minutes, not months.
                            </span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            Join thousands of forward-thinking teams protecting their most sensitive data with Segmento Sense.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.a 
                                href="/products/data-classification/demo"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-10 h-14 rounded-2xl text-base font-bold shadow-xl shadow-indigo-200 transition-all">
                                    Try for free
                                </Button>
                            </motion.a>

                            <motion.a 
                                href="/contact"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 px-10 h-14 rounded-2xl text-base font-bold transition-all">
                                    Request a demo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </motion.a>
                        </div>

                        {/* Badges Footer in Slate Tint */}
                        <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
                            <p className="text-[10px] text-slate-900 font-bold tracking-widest uppercase flex items-center gap-2">
                                <Sparkles className="h-3 w-3" />
                                No credit card required
                            </p>
                            <div className="w-1 h-1 bg-slate-400 rounded-full" />
                            <p className="text-[10px] text-slate-900 font-bold tracking-widest uppercase">
                                SOC2 & GDPR Compliant
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}