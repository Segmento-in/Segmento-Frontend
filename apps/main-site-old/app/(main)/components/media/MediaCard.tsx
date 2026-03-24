"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { ArrowRight } from "lucide-react"

type IconName = "Newspaper" | "Tv" | "Video" | "Smartphone" | "Laptop" | "Flame"

interface MediaCardProps {
    iconName: IconName
    publication: string
    headline: string
    link: string
}

export function MediaCard({ iconName, publication, headline, link }: MediaCardProps) {
    const Icon = Icons[iconName] as Icons.LucideIcon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group bg-white rounded-2xl border border-border/50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
            {/* Icon */}
            <div className="inline-flex p-4 rounded-xl bg-linear-to-br from-primary/10 to-purple-100 group-hover:from-primary/20 group-hover:to-purple-200 transition-colors mb-6">
                <Icon className="w-8 h-8 text-primary" />
            </div>

            {/* Publication */}
            <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {publication}
            </h3>

            {/* Headline */}
            <p className="text-muted-foreground leading-relaxed mb-6">
                "{headline}"
            </p>

            {/* Read More Link */}
            <Link
                href={link}
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
            >
                Read Full Article
                <ArrowRight className="w-4 h-4" />
            </Link>
        </motion.div>
    )
}
