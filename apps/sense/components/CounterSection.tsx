"use client"

import { useEffect, useRef } from "react"
import {
    motion,
    useInView,
    useSpring,
    useTransform,
    useMotionValue,
    animate
} from "framer-motion"

import {
    Shield,
    Activity,
    TrendingUp,
    Zap,
    Globe,
    ArrowRight,
    Cpu,
    FileSearch,
    Lock,
    Eye
} from "lucide-react"

import { Button } from "@/ui/button"

// --- COUNTER & DYNAMIC GRAPHS ---
export function CounterSection() {
    const ref = useRef(null)

    const isInView = useInView(ref, {
        once: true,
        margin: "-100px"
    })

    // Counter Logic
    const count = useMotionValue(0)

    const springCount = useSpring(count, {
        stiffness: 40,
        damping: 20
    })

    const rounded = useTransform(
        springCount,
        (latest) => Math.round(latest)
    )

    const themeColor = useTransform(
        springCount,
        [0, 50],
        ["#EF4444", "#3B82F6"]
    )

    useEffect(() => {
        if (isInView) {
            animate(count, 50, {
                duration: 3,
                ease: [0.16, 1, 0.3, 1]
            })
        }
    }, [isInView, count])

    const stats = [
        {
            icon: FileSearch,
            label: "File Formats",
            value: "400+"
        },
        {
            icon: Eye,
            label: "Client-Side OCR",
            value: "100%"
        },
        {
            icon: Lock,
            label: "Cloud Egress",
            value: "Zero"
        },
        {
            icon: Zap,
            label: "AI Triggers",
            value: "100%"
        }
    ]

    return (
        <section
            ref={ref}
            className="
                relative pb-32 pt-4 overflow-hidden
                bg-[#F8FAFF]
                dark:bg-[#242837]
                transition-colors duration-300
            "
        >
            <div className="container relative mx-auto px-6 z-10 max-w-6xl">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Counter Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="
                            lg:col-span-8
                            rounded-[40px]
                            relative overflow-hidden

                            bg-white
                            border border-slate-200
                            shadow-sm

                            dark:bg-[#2B3145]
                            dark:border-white/10
                        "
                    >
                        {/* Live Frequency Graph */}
                        <div className="
                            absolute top-0 right-0
                            w-full h-48
                            opacity-[0.05]
                            dark:opacity-[0.08]
                            pointer-events-none
                        ">
                            <svg
                                viewBox="0 0 400 100"
                                className="w-full h-full"
                            >
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={isInView ? { pathLength: 1 } : {}}
                                    transition={{ duration: 4 }}
                                    d="M0 50 Q 25 10 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-slate-900 dark:text-white"
                                />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full p-10">

                            {/* Top */}
                            <div className="flex justify-between items-start">

                                <div className="flex items-center gap-3">
                                    <div className="
                                        p-2 rounded-lg text-white
                                        bg-blue-600
                                    ">
                                        <Cpu className="w-4 h-4 animate-pulse" />
                                    </div>

                                    <span className="
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.2em]

                                        text-slate-400
                                        dark:text-slate-500
                                    ">
                                        Live Counter
                                    </span>
                                </div>

                                <div className="flex gap-1 h-6 items-end">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                height: [
                                                    "20%",
                                                    "100%",
                                                    "40%"
                                                ]
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                delay: i * 0.1
                                            }}
                                            className="
                                                w-1 rounded-full
                                                bg-blue-200
                                                dark:bg-blue-400/40
                                            "
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Main Counter */}
                            <div className="mt-8 flex items-baseline">
                                <motion.div
                                    style={{ color: themeColor }}
                                    className="
                                        text-[9rem]
                                        md:text-[12rem]
                                        font-black
                                        tracking-tighter
                                        leading-none
                                    "
                                >
                                    <motion.span>
                                        {rounded}
                                    </motion.span>

                                    <span className="
                                        text-4xl md:text-6xl
                                        ml-4 font-black

                                        text-slate-200
                                        dark:text-white/10
                                    ">
                                        M+
                                    </span>
                                </motion.div>
                            </div>

                            {/* Bottom */}
                            <div className="
                                mt-10
                                flex flex-col md:flex-row
                                justify-between items-end
                                gap-6
                            ">
                                <div className="max-w-[300px]">
                                    <p className="
                                        text-sm
                                        font-medium
                                        leading-relaxed

                                        text-slate-500
                                        dark:text-slate-300
                                    ">
                                        Total records protected across
                                        global endpoints by Segmento Sense.
                                    </p>
                                </div>

                                <div className="flex flex-col items-end">

                                    <span className="
                                        text-[10px]
                                        font-black
                                        uppercase
                                        mb-2

                                        text-blue-600
                                        dark:text-blue-400
                                    ">
                                        Network Load
                                    </span>

                                    <div className="
                                        w-48 h-2
                                        rounded-full overflow-hidden

                                        bg-slate-100
                                        dark:bg-white/10
                                    ">
                                        <motion.div
                                            style={{
                                                backgroundColor: themeColor
                                            }}
                                            initial={{ width: 0 }}
                                            animate={
                                                isInView
                                                    ? { width: "100%" }
                                                    : {}
                                            }
                                            transition={{ duration: 3 }}
                                            className="h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Stats */}
                    <div className="
                        lg:col-span-4
                        grid grid-cols-2 lg:grid-cols-1
                        gap-4
                    ">
                        {stats.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="
                                    relative overflow-hidden
                                    flex flex-col justify-between

                                    rounded-[32px]
                                    p-6

                                    bg-white
                                    border border-slate-200
                                    shadow-sm

                                    dark:bg-[#2B3145]
                                    dark:border-white/10

                                    group
                                "
                            >
                                {/* Top */}
                                <div className="flex justify-between items-start">

                                    <div className="
                                        p-2.5 rounded-xl
                                        transition-colors

                                        bg-slate-50
                                        text-slate-400

                                        group-hover:text-blue-600

                                        dark:bg-white/5
                                        dark:text-slate-500
                                        dark:group-hover:text-blue-400
                                    ">
                                        <item.icon className="w-4 h-4" />
                                    </div>

                                    <div className="h-3 flex gap-0.5 items-end">
                                        {[...Array(3)].map((_, j) => (
                                            <motion.div
                                                key={j}
                                                animate={{
                                                    height: [
                                                        "40%",
                                                        "100%",
                                                        "60%"
                                                    ]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    delay: j * 0.2
                                                }}
                                                className="
                                                    w-0.5

                                                    bg-slate-100
                                                    group-hover:bg-blue-200

                                                    dark:bg-white/10
                                                    dark:group-hover:bg-blue-400/50
                                                "
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Text */}
                                <div className="mt-4">

                                    <div className="
                                        text-2xl
                                        font-black
                                        leading-none
                                        mb-1

                                        text-[#0F172A]
                                        dark:text-white
                                    ">
                                        {item.value}
                                    </div>

                                    <div className="
                                        text-[8px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
                                        transition-colors

                                        text-slate-400
                                        group-hover:text-blue-500

                                        dark:text-slate-500
                                        dark:group-hover:text-blue-400
                                    ">
                                        {item.label}
                                    </div>
                                </div>

                                {/* Glow */}
                                <div className="
                                    absolute -bottom-6 -right-6
                                    w-16 h-16 rounded-full blur-xl
                                    transition-colors

                                    bg-blue-50
                                    group-hover:bg-blue-100

                                    dark:bg-blue-500/10
                                    dark:group-hover:bg-blue-500/20
                                " />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}