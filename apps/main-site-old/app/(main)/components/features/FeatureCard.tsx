"use client"

import { motion } from "framer-motion"
import * as Icons from "lucide-react"

type IconName = "BarChart3" | "Brain" | "RefreshCcw" | "LayoutDashboard" | "Lock" | "Globe"

interface FeatureCardProps {
    iconName: IconName
    title: string
    description: string
    stat: string
}

export function FeatureCard({ iconName, title, description, stat }: FeatureCardProps) {
    const Icon = Icons[iconName] as Icons.LucideIcon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white rounded-2xl border border-border/50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative space-y-4">
                {/* Icon */}
                <div className="inline-flex p-4 rounded-xl bg-linear-to-br from-primary/10 to-purple-100 group-hover:from-primary/20 group-hover:to-purple-200 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>

                {/* Stat Badge */}
                <div className="inline-flex px-4 py-2 rounded-full bg-linear-to-r from-primary/10 to-purple-100 border border-primary/20">
                    <span className="text-sm font-semibold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {stat}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}
