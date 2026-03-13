"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useSpring, useTransform, useMotionValue, animate } from "framer-motion"

export function CounterSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    
    // Snappier physics-based count (increased stiffness, adjusted damping)
    const count = useMotionValue(0)
    const springValue = useSpring(count, { stiffness: 60, damping: 15 }) 
    const rounded = useTransform(springValue, (latest) => Math.round(latest))

    // Plain, solid color sequence: Red -> Yellow -> Green -> Pink -> Blue (Final)
    const textColor = useTransform(
        springValue,
        [0, 10, 25, 40, 50],
        ["#EF4444", "#EAB308", "#22C55E", "#EC4899", "#3B82F6"]
    )

    useEffect(() => {
        if (isInView) {
            // Reduced duration from 3s to 1.5s for fast counting
            animate(count, 50, { duration: 1.5, ease: "easeOut" })
        }
    }, [isInView, count])

    return (
        <section ref={ref} className="relative py-16 bg-white overflow-hidden">
            {/* Minimalist Background Detail */}
            <div className="absolute inset-0 opacity-[0.3] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:30px_30px]" />

            <div className="container relative mx-auto px-4">
                <div className="flex flex-col items-center">
                    
                    <div className="relative">
                        {/* Ghost Number - Reduced size to match main counter */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 0.04, scale: 1.1 } : {}}
                            style={{ color: textColor }}
                            className="absolute inset-0 flex items-center justify-center text-[7rem] font-black select-none pointer-events-none"
                        >
                        </motion.div>

                        <div className="relative flex items-center justify-center">
                            {/* Reduced text size from 13rem to 8rem (desktop) and 8xl to 6xl (mobile) */}
                            <motion.div 
                                style={{ color: textColor }}
                                className="text-6xl md:text-[8rem] font-black tracking-tighter flex items-baseline transition-colors duration-200"
                            >
                                <motion.span>{rounded}</motion.span>
                                <span className="ml-2 text-4xl md:text-6xl">M+</span>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.4 }}
                        className="text-center mt-4"
                    >
                        <p className="text-lg md:text-xl text-slate-500 font-medium">
                            Records secured with <span className="text-slate-900 font-semibold">Segmento Sense</span>
                        </p>
                        
                        {/* Solid Blue Underline */}
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={isInView ? { width: "100%" } : {}}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="h-1 bg-[#3B82F6] mt-6 rounded-full max-w-[80px] mx-auto"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function ShieldIcon() {
    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
}

function LockIcon() {
    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
}