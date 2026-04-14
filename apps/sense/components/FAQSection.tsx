"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/ui/accordion"
import { Button } from "@/ui/button"
import { motion } from "framer-motion"
import { HelpCircle, MessageSquare, ArrowRight } from "lucide-react"

const faqs = [
    {
        question: "Do you offer trials? How can I get access to an API key?",
        answer: "Yes! We offer a free tier for testing and development. Contact our sales team or sign up directly to get started with immediate API access.",
    },

    {
        question: "How is this different from AWS Macie or Azure Purview?",
        answer: "Cloud-native tools lock you into their ecosystem and lack explainability. Sense is environment-agnostic, offers transparent detection logic, and provides synthetic data cloning for developers.",
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
    {
        question: "Does my image data leave my network for OCR scanning?",
        answer: "Never. Sense uses local libraries to process everything client-side.",
    },
]

const bubbles = [
    { color: "bg-[#00B4FF]", size: "w-24 h-24", top: "15%", left: "15%", delay: 0 },
    { color: "bg-[#4CAF50]", size: "w-16 h-16", top: "20%", left: "65%", delay: 0.2 },
    { color: "bg-[#FFB300]", size: "w-36 h-36", top: "40%", left: "25%", delay: 0.1 },
    { color: "bg-[#F44336]", size: "w-14 h-14", top: "68%", left: "70%", delay: 0.3 },
    { color: "bg-[#9C27B0]", size: "w-20 h-20", top: "78%", left: "20%", delay: 0.4 },
]

export default function FAQSection() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Minimalist Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left Side: Animated Bubbles (Scaled down for professional look) */}
                    <div className="w-full lg:w-1/2 relative h-[350px] md:h-[450px] hidden sm:block">
                        {bubbles.map((bubble, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                animate={{ y: [0, -12, 0] }}
                                transition={{ 
                                    scale: { delay: bubble.delay, type: "spring", stiffness: 100 },
                                    y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className={`absolute ${bubble.size} ${bubble.color} rounded-full flex items-center justify-center shadow-lg border-[6px] border-white`}
                                style={{ top: bubble.top, left: bubble.left }}
                            >
                                <span className="text-white font-bold text-2xl md:text-3xl select-none">?</span>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent opacity-30" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side: FAQ Content */}
                    <div className="w-full lg:w-1/2">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-10"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-[#6200EA] tracking-tight mb-3">
                                FAQ
                            </h2>
                            <div className="w-12 h-1 bg-[#6200EA] rounded-full" />
                        </motion.div>

                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 5 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    viewport={{ once: true }}
                                >
                                    <AccordionItem 
                                        value={`item-${idx}`} 
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <AccordionTrigger className="text-left font-semibold text-slate-800 py-5 text-base md:text-lg hover:no-underline hover:text-[#6200EA] transition-colors group-data-[state=open]:text-[#6200EA]">
                                            <span className="leading-snug">{faq.question}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-500 leading-relaxed font-normal pb-6 text-sm md:text-[0.95rem]">
                                            <div className="pl-4 border-l border-slate-200">
                                                {faq.answer}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>

                        {/* Professional CTA Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex w-12 h-12 bg-white rounded-xl shadow-sm items-center justify-center text-[#6200EA]">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Still have questions?</h4>
                                    <p className="text-xs text-slate-500 font-medium">We're here to help you secure your data.</p>
                                </div>
                            </div>
<<<<<<< Updated upstream
                            <a href="/contact">
=======
                            <a href="https://segmento.in/contact" target="_blank" rel="noopener noreferrer">
>>>>>>> Stashed changes
                                <Button className="bg-[#6200EA] hover:bg-[#4500AB] text-white rounded-lg px-5 h-10 text-xs font-bold transition-all flex items-center gap-2">
                                    Contact Us
                                    <ArrowRight size={14} />
                                </Button>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}