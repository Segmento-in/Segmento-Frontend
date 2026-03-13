"use client"

import React, { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for testing and small projects",
        features: [
            "Up to 1,000 records/month",
            "Basic PII detection",
            "Email support",
            "API access",
            "Community support",
        ],
        cta: "Get started",
        href: "/contact",
        highlighted: false,
    },
    {
        name: "Professional",
        price: "$499",
        period: "/month",
        description: "For growing teams and businesses",
        features: [
            "Up to 100,000 records/month",
            "Advanced PII detection",
            "All data sources",
            "Priority support",
            "Custom classifiers",
            "Compliance reports",
            "99.9% uptime SLA",
        ],
        cta: "Start free trial",
        href: "/contact",
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large-scale deployments",
        features: [
            "Unlimited records",
            "Dedicated infrastructure",
            "On-premise deployment",
            "24/7 priority support",
            "Custom SLAs",
            "Advanced security",
            "Dedicated account manager",
            "Custom integrations",
        ],
        cta: "Contact sales",
        href: "/contact",
        highlighted: false,
    },
]

const faqs = [
    { 
        q: "Can I change plans later?", 
        a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately on your next billing cycle." 
    },
    { 
        q: "What payment methods do you accept?", 
        a: "We accept all major credit cards, ACH transfers, and invoicing for Enterprise customers through our secure payment portal." 
    },
    { 
        q: "Is there a free trial?", 
        a: "Absolutely. Professional and Enterprise plans come with a 14-day free trial. No credit card is required to start exploring Sense." 
    },
    { 
        q: "How secure is my data?", 
        a: "Security is our core product. We use bank-grade AES-256 encryption and never store your raw PII data on our primary servers." 
    }
]

function PricingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-white text-slate-900 py-24 relative selection:bg-blue-100 font-sans">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="container relative mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-slate-900"
                    >
                        Simple, transparent pricing
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
                    >
                        Choose the plan that's right for your team. Scale as you grow.
                    </motion.p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32 items-stretch">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex"
                        >
                            <Card
                                className={`relative flex flex-col w-full transition-all duration-300 border-slate-200 bg-white shadow-sm overflow-hidden ${
                                    plan.highlighted 
                                    ? "ring-2 ring-blue-600 shadow-xl lg:scale-105 z-10" 
                                    : "hover:border-slate-300 hover:shadow-md"
                                }`}
                            >
                                {plan.highlighted && (
                                    <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2 text-center">
                                        Most Popular
                                    </div>
                                )}
                                
                                <CardHeader className="pt-8 pb-6">
                                    <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">{plan.description}</CardDescription>
                                    <div className="mt-6 flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-slate-900 tracking-tight">{plan.price}</span>
                                        {plan.period && <span className="text-slate-400 text-lg font-medium">{plan.period}</span>}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex flex-col flex-grow pt-0 px-8 pb-8">
                                    <div className="h-px w-full bg-slate-100 mb-8" />
                                    <ul className="space-y-4 mb-10 flex-grow">
                                        {plan.features.map((feature, featureIdx) => (
                                            <li key={featureIdx} className="flex items-start gap-3">
                                                <div className="mt-1 bg-blue-50 p-0.5 rounded-full">
                                                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                                                </div>
                                                <span className="text-slate-600 text-sm font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto">
                                        <Link href={plan.href}>
                                            <Button
                                                className={`w-full h-12 rounded-xl font-bold transition-all duration-300 shadow-sm ${
                                                    plan.highlighted 
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                                    : "bg-white hover:bg-slate-50 text-blue-600 border border-slate-200"
                                                }`}
                                            >
                                                {plan.cta}
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-20 px-4">
                    <h2 className="text-3xl font-bold mb-10 text-center text-slate-900">
                        Frequently asked questions
                    </h2>
                    
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div 
                                key={i} 
                                className={`border rounded-2xl transition-all duration-300 ${
                                    openFaq === i 
                                    ? 'border-blue-200 bg-blue-50/20 shadow-sm' 
                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                }`}
                            >
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className={`font-bold transition-colors ${openFaq === i ? 'text-blue-600' : 'text-slate-900'}`}>
                                        {faq.q}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-slate-500 text-sm font-medium leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingPage;