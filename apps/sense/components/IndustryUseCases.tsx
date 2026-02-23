"use client"

import { Building2, Heart, Shield, Scale, ShoppingCart, Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Card, CardContent } from "@/ui/card"
import { Button } from "@/ui/button"
import Link from "next/link"

const industries = [
    {
        id: "finance",
        label: "Finance",
        icon: Building2,
        title: "Protect financial data with confidence",
        description: "Extract key insights from investor decks, spreadsheets, and SEC filings while protecting customer PII and complying with SOX, GLBA, and PCI-DSS.",
        features: [
            "Detect SSNs, account numbers, and financial data",
            "SOX and GLBA compliance",
            "PCI-DSS data protection",
            "Automated data masking for sensitive records",
        ],
        testimonial: {
            quote: "Segmento Sense helped us discover PII we didn't even know we had. The accuracy is unmatched.",
            author: "Chief Data Officer, Fortune 500 Financial Institution",
        },
    },
    {
        id: "healthcare",
        label: "Healthcare",
        icon: Heart,
        title: "HIPAA-compliant patient data protection",
        description: "Automatically detect and protect PHI across all systems with comprehensive HIPAA compliance and patient data security.",
        features: [
            "PHI detection across all data sources",
            "HIPAA compliance automation",
            "Patient records protection",
            "Automated de-identification",
        ],
        testimonial: {
            quote: "Our HIPAA compliance audit went smoothly thanks to Segmento Sense's comprehensive coverage.",
            author: "CISO, Major Healthcare Provider",
        },
    },
    {
        id: "legal",
        label: "Legal",
        icon: Scale,
        title: "Attorney-client privilege protection",
        description: "Protect sensitive legal documents, case files, and client communications with precision PII detection.",
        features: [
            "Document classification and protection",
            "Client data privacy",
            "Case file security",
            "Matter-based access control",
        ],
        testimonial: {
            quote: "Critical for managing our confidential client information at scale.",
            author: "Managing Partner, International Law Firm",
        },
    },
    {
        id: "insurance",
        label: "Insurance",
        icon: Shield,
        title: "Policy holder data security",
        description: "Secure policy holder information, claims data, and underwriting documents across all systems.",
        features: [
            "Policy holder PII protection",
            "Claims data security",
            "Underwriting document protection",
            "Regulatory compliance",
        ],
        testimonial: {
            quote: "Comprehensive coverage for our complex data landscape.",
            author: "Data Protection Officer, Insurance Company",
        },
    },
    {
        id: "retail",
        label: "Retail",
        icon: ShoppingCart,
        title: "Customer data protection",
        description: "CCPA and GDPR compliance for customer data with automated PII detection and protection.",
        features: [
            "Customer PII detection",
            "CCPA and GDPR compliance",
            "Payment data protection",
            "Marketing data governance",
        ],
        testimonial: {
            quote: "Essential for our GDPR and CCPA compliance programs.",
            author: "VP of Data Privacy, E-commerce Platform",
        },
    },
    {
        id: "technology",
        label: "Technology",
        icon: Code,
        title: "User data governance at scale",
        description: "API security and user data governance for tech companies building data-intensive applications.",
        features: [
            "User data discovery",
            "API security scanning",
            "Development environment protection",
            "DevOps integration",
        ],
        testimonial: {
            quote: "Integrates seamlessly with our development workflow.",
            author: "VP Engineering, SaaS Company",
        },
    },
]

export function IndustryUseCases() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                        Powering the world's best security teams.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Trusted across industries where data privacy matters—finance, healthcare, legal, and more.
                    </p>
                </div>

                <Tabs defaultValue="finance" className="max-w-6xl mx-auto">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
                        {industries.map((industry) => {
                            const Icon = industry.icon
                            return (
                                <TabsTrigger key={industry.id} value={industry.id} className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{industry.label}</span>
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    {industries.map((industry) => (
                        <TabsContent key={industry.id} value={industry.id}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-4">{industry.title}</h3>
                                            <p className="text-muted-foreground mb-6">{industry.description}</p>
                                            <ul className="space-y-3 mb-6">
                                                {industry.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="text-primary mt-1">✓</span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Link href="/contact">
                                                <Button>Get started</Button>
                                            </Link>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-6 flex flex-col justify-center">
                                            <blockquote className="text-lg italic mb-4">
                                                "{industry.testimonial.quote}"
                                            </blockquote>
                                            <p className="text-sm text-muted-foreground">— {industry.testimonial.author}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}
