"use client"

import { motion, useInView } from "framer-motion"
import { Eye, Brain, CheckCircle } from "lucide-react"
import { useRef } from "react"

const steps = [
    {
        icon: Eye,
        title: "Traditional pattern matching",
        description: "Segmento Sense first uses advanced pattern recognition to identify potential PII across all data sources.",
    },
    {
        icon: Brain,
        title: "AI classification and context",
        description: "Machine learning models analyze context, classify sensitivity levels, and understand relationships between data elements.",
    },
    {
        icon: CheckCircle,
        title: "Human-level verification",
        description: "Like a human reviewer, our system validates and corrects edge cases, ensuring accuracy even in complex scenarios.",
    },
]

export function ProcessFlow() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section className="py-20 bg-background" ref={ref}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                        Built to detect the way humans do.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Segmento Sense's multi-pass system utilizes both pattern matching and AI models for unmatched accuracy and reliability.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((step, idx) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    delay: idx * 0.2,
                                    duration: 0.6,
                                    ease: "easeOut",
                                }}
                                className="relative"
                            >
                                <div className="bg-muted/30 rounded-lg p-8 h-full flex flex-col items-center text-center hover:bg-muted/50 transition-all duration-300">
                                    <motion.div
                                        className="bg-primary text-white rounded-full p-4 mb-4"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Icon className="h-8 w-8" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                        <motion.div
                                            className="text-primary text-2xl"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: idx * 0.2 + 0.3, duration: 0.4 }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
