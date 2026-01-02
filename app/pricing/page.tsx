import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Pricing - Segmento",
    description: "Simple, transparent pricing for enterprise data security",
}

const tiers = [
    {
        name: "Starter",
        subtitle: "For small teams getting started",
        price: "499",
        period: "/month",
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
        price: "1,999",
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
        <div className="min-h-screen py-20">
            {/* Hero */}
            <section className="mb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Choose the plan that fits your organization's needs
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="mb-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`rounded-2xl border p-8 ${tier.featured
                                        ? "border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/5 to-purple-50"
                                        : "border-border/50 bg-white shadow-lg"
                                    }`}
                            >
                                {tier.featured && (
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-white text-sm font-semibold mb-4">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                                    <p className="text-muted-foreground text-sm">{tier.subtitle}</p>
                                </div>
                                <div className="mb-6">
                                    {tier.price === "Custom" ? (
                                        <div className="text-4xl font-bold">Custom</div>
                                    ) : (
                                        <div className="flex items-baseline">
                                            <span className="text-3xl">$</span>
                                            <span className="text-5xl font-bold">{tier.price}</span>
                                            <span className="text-muted-foreground ml-2">{tier.period}</span>
                                        </div>
                                    )}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/contact">
                                    <Button
                                        className="w-full"
                                        variant={tier.featured ? "default" : "outline"}
                                        size="lg"
                                    >
                                        {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-gradient-to-br from-primary/5 to-purple-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
