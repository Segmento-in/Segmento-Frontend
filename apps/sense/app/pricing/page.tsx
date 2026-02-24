import { Check } from "lucide-react"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import Link from "next/link"

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

export default function PricingPage() {
    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that's right for your team. Scale as you grow.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {plans.map((plan, idx) => (
                        <Card
                            key={idx}
                            className={`relative ${plan.highlighted ? "border-primary shadow-lg scale-105" : ""}`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, featureIdx) => (
                                        <li key={featureIdx} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-primary shrink-0  mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={plan.href}>
                                    <Button
                                        className="w-full"
                                        variant={plan.highlighted ? "default" : "outline"}
                                        size="lg"
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif text-3xl font-bold mb-8 text-center">
                        Frequently asked questions
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                            <p className="text-muted-foreground">
                                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                            <p className="text-muted-foreground">
                                We accept all major credit cards, ACH transfers, and can arrange invoicing for Enterprise customers.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                            <p className="text-muted-foreground">
                                Yes! Professional and Enterprise plans come with a 14-day free trial. No credit card required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
