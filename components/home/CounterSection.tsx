"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

export function CounterSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [count, setCount] = useState(0)
    const targetCount = 50000000 // 50M+ records protected

    useEffect(() => {
        if (isInView) {
            let start = 0
            const duration = 2000 // 2 seconds
            const increment = targetCount / (duration / 16) // 60fps

            const timer = setInterval(() => {
                start += increment
                if (start >= targetCount) {
                    setCount(targetCount)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 16)

            return () => clearInterval(timer)
        }
    }, [isInView, targetCount])

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(0)}M+`
        }
        return num.toLocaleString()
    }

    return (
        <section ref={ref} className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="text-6xl md:text-8xl font-bold text-primary mb-4">
                        {formatNumber(count)}
                    </div>
                    <p className="text-xl text-muted-foreground">
                        records protected and counting
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
