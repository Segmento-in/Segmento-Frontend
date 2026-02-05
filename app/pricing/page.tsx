'use client';

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const tiers = [
    {
        name: "Starter",
        subtitle: "For small teams getting started",
        price: "Free",
        features: [
            "Up to 100GB data scanned",
            "5 data sources",
            "Basic PII detection",
            "Email support",
            "Monthly reporting",
        ],
    },
    {
        name: "Professional",
        subtitle: "For growing organizations",
        price: "999",
        period: "/month",
        featured: true,
        features: [
            "Up to 1TB data scanned",
            "Unlimited data sources",
            "Advanced AI classification",
            "Priority support",
            "Real-time monitoring",
            "Custom policies",
            "API access",
        ],
    },
    {
        name: "Enterprise",
        subtitle: "For large-scale deployments",
        price: "Custom",
        features: [
            "Unlimited data scanning",
            "Unlimited data sources",
            "Advanced AI + custom models",
            "Dedicated support team",
            "On-premise deployment",
            "SLA guarantee",
            "Custom integrations",
            "Training & onboarding",
        ],
    },
]

const faqs = [
    {
        q: "Can I change plans later?",
        a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, ACH transfers, and wire transfers for enterprise customers.",
    },
    {
        q: "Is there a free trial?",
        a: "Yes! We offer a 14-day free trial for all plans. No credit card required to start.",
    },
    {
        q: "What happens if I exceed my data limit?",
        a: "We'll notify you when you approach your limit. You can upgrade your plan or purchase additional capacity.",
    },
]

export default function PricingPage() {
    return (
        <div className="min-h-screen py-20 bg-gray-50/50">
            {/* Hero */}
            <section className="mb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-linear-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Simple, Transparent<br className="hidden sm:block" />
                            Pricing
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                            Choose the plan that fits your organization&apos;s needs
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="mb-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                        {tiers.map((tier) => (
                            <motion.div
                                key={tier.name}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`group relative rounded-3xl border p-8 transition-all duration-300 cursor-pointer bg-white
                                    ${tier.featured 
                                        ? "border-purple-500 shadow-[0_20px_50px_rgba(147,51,234,0.15)] ring-2 ring-purple-500/20" 
                                        : "border-transparent shadow-xl hover:border-purple-500 hover:shadow-[0_20px_50px_rgba(147,51,234,0.15)] hover:ring-2 hover:ring-purple-500/20"
                                    }`}
                            >
                                {tier.featured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-purple-600 text-white text-sm font-bold shadow-lg z-10">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">{tier.name}</h3>
                                    <p className="text-muted-foreground text-sm">{tier.subtitle}</p>
                                </div>

                                <div className="mb-8">
                                    {tier.price === "Custom" || tier.price === "Free" ? (
                                        <div className="text-5xl font-extrabold tracking-tight">{tier.price}</div>
                                    ) : (
                                        <div className="flex items-baseline">
                                            <span className="text-3xl font-bold text-gray-400">$</span>
                                            <span className="text-6xl font-extrabold tracking-tight">{tier.price}</span>
                                            <span className="text-muted-foreground ml-2 font-medium">{tier.period}</span>
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-4 mb-10">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div className="mt-1 rounded-full bg-purple-100 p-0.5 group-hover:bg-purple-600 transition-colors">
                                                <Check className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/contact">
                                    <Button
                                        className={`w-full py-6 text-lg font-bold rounded-xl transition-all duration-300 border-none
                                            ${tier.featured 
                                                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200" 
                                                : "bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-900"
                                            }`}
                                        variant="default"
                                    >
                                        {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-white border-t">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="group p-2">
                                <h3 className="font-bold text-lg mb-3 group-hover:text-purple-600 transition-colors">{faq.q}</h3>
                                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}