'use client';

import Link from "next/link"
import { Check, HelpCircle } from "lucide-react"
import { Button } from "@/ui/button"
import { motion, easeOut } from "framer-motion"

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
        <div className="min-h-screen bg-white selection:bg-purple-500/30">
            {/* Hero Section - Matching "Who Are We" exactly */}
            <section className="relative bg-[#020617] py-20 lg:py-28 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-600/15 blur-[120px] rounded-full" />
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-linear-to-r from-[#a855f7] to-[#7c3aed]">
                            Pricing
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
                            Segmento helps businesses unlock the real value of their customer data. 
                            Choose a plan that scales with your growth.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Tiers - Dark Cards, No Overlap */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                        {tiers.map((tier, idx) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className={`relative flex flex-col bg-[#0f172a] rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-800 transition-all duration-300 hover:shadow-2xl hover:border-purple-500/30 ${
                                    tier.featured ? "ring-2 ring-purple-600/20" : ""
                                }`}
                            >
                                {tier.featured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 px-5 rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed">{tier.subtitle}</p>
                                </div>

                                <div className="mb-10 flex items-baseline gap-1">
                                    {tier.price !== "Custom" && tier.price !== "Free" && (
                                        <span className="text-2xl font-bold text-purple-500">$</span>
                                    )}
                                    <span className="text-5xl font-bold text-white tracking-tighter">
                                        {tier.price}
                                    </span>
                                    {tier.period && (
                                        <span className="text-slate-500 font-bold ml-1 text-sm">{tier.period}</span>
                                    )}
                                </div>

                                <div className="space-y-4 mb-12 flex-1">
                                    {tier.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3 group">
                                            <div className="shrink-0 mt-1">
                                                <Check className="w-4 h-4 text-purple-500 stroke-[3px]" />
                                            </div>
                                            <span className="text-slate-300 font-medium text-sm leading-relaxed group-hover:text-white transition-colors">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/contact" className="w-full mt-auto">
                                    <Button 
                                        className={`w-full py-7 rounded-xl text-base font-bold transition-all duration-300 ${
                                            tier.featured 
                                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20" 
                                            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                                        }`}
                                    >
                                        {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ - Dark Section */}
            <section className="bg-[#020617] py-24 border-t border-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                                Frequently Asked Questions
                            </h2>
                            <div className="h-1 w-16 bg-purple-600 mx-auto rounded-full opacity-80" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={faq.q}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="p-8 rounded-[2rem] bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-colors group"
                                >
                                    <h3 className="text-white font-bold text-lg mb-4 group-hover:text-purple-400 transition-colors">
                                        {faq.q}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed text-sm font-medium">
                                        {faq.a}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            
        </div>
    )
}