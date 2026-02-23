import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/ui/accordion"
import { Button } from "@/ui/button"
import Link from "next/link"

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
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-center">
                        Questions, answered.
                    </h2>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`} className="bg-background rounded-lg px-6">
                                <AccordionTrigger className="text-left font-semibold">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="text-center mt-12">
                        <p className="text-muted-foreground mb-4">Have more questions?</p>
                        <Link href="/contact">
                            <Button>Contact us</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
