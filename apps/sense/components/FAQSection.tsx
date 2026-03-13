"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/ui/accordion"
import { Button } from "@/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, HelpCircle } from "lucide-react"

const faqs = [
    {
        question: "Do you offer trials? How can I get access to an API key?",
        answer: "Yes! We offer a free tier for testing and development. Contact our sales team or sign up directly to get started with immediate API access.",
    },
    {
        question: "What types of PII can Segmento Sense detect?",
        answer: "We detect a comprehensive range of PII including SSNs, credit card numbers, email addresses, phone numbers, addresses, dates of birth, medical records, financial data, and custom patterns specific to your industry.",
    },
    {
        question: "How does Segmento Sense ensure accuracy?",
        answer: "Our multi-pass system combines traditional pattern matching with AI-powered classification and contextual analysis. This approach achieves industry-leading accuracy rates while minimizing false positives.",
    },
    {
        question: "Is Segmento Sense compliant with GDPR, HIPAA, and other regulations?",
        answer: "Yes, Segmento Sense is designed to help you achieve compliance with GDPR, HIPAA, CCPA, SOX, and other data privacy regulations. We maintain SOC 2 Type II and HIPAA certifications.",
    },
    {
        question: "Can I deploy Segmento Sense in my own infrastructure?",
        answer: "Absolutely. We offer flexible deployment options including SaaS, private cloud, and on-premise installations to meet your security and compliance requirements.",
    },
    {
        question: "What integrations does Segmento Sense support?",
        answer: "We integrate with major cloud platforms (AWS, Azure, GCP), databases, data warehouses, CRM systems, and offer REST APIs for custom integrations. Our platform is designed to fit seamlessly into your existing data stack.",
    },
]

export function FAQSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Soft Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366f1] text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm"
                        >
                            <Sparkles className="h-3 w-3" />
                            Support & Resources
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Questions, <span className="text-[#6366f1]">answered.</span>
                        </h2>
                        <p className="text-slate-500 font-medium">
                            Everything you need to know about Segmento Sense.
                        </p>
                    </div>

                    {/* Accordion */}
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <AccordionItem 
                                    value={`item-${idx}`} 
                                    className="bg-white border border-slate-100 rounded-2xl px-6 transition-all duration-300 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-900/5 overflow-hidden"
                                >
                                    <AccordionTrigger className="text-left font-bold text-slate-800 py-6 hover:no-underline hover:text-[#6366f1] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <HelpCircle className="h-5 w-5 text-indigo-200 group-hover:text-indigo-500 transition-colors" />
                                            {faq.question}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-500 leading-relaxed font-medium pb-6 text-base">
                                        <div className="pl-9">
                                            {faq.answer}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>

                    {/* CTA Footer */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-16 p-8 rounded-3xl bg-slate-50 border border-slate-100"
                    >
                        <p className="text-slate-600 font-semibold mb-6">Still have questions about PII protection?</p>
                        <Link href="/contact">
                            <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 h-12 rounded-xl font-bold shadow-md transition-all hover:-translate-y-0.5">
                                Contact our team
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}