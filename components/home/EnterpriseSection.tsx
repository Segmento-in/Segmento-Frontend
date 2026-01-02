import { Shield, Clock, Headphones, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const enterpriseFeatures = [
    {
        icon: Clock,
        title: "99.9%+ uptime",
        description: "Battle-tested infrastructure you can trust in production and at scale.",
    },
    {
        icon: Headphones,
        title: "Enterprise support and SLAs",
        description: "Hands-on forward deployed support and tailored SLAs to meet your enterprise needs.",
    },
    {
        icon: Shield,
        title: "SOC2, HIPAA compliant",
        description: "Enterprise-grade security, certified for sensitive and regulated data.",
    },
    {
        icon: Server,
        title: "Deploy in your environment",
        description: "Run Segmento Sense entirely within your own infrastructure for strict compliance.",
    },
]

export function EnterpriseSection() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                        Enterprise-ready
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        From security to scale, Segmento Sense is built for the demands of production environments.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Contact sales</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                    {enterpriseFeatures.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <div key={idx} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="bg-primary/10 rounded-lg p-3">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Certification Badges */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">Widely trusted by enterprises worldwide</p>
                    <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
                        <div className="text-xs font-semibold px-4 py-2 border rounded">SOC 2 TYPE II</div>
                        <div className="text-xs font-semibold px-4 py-2 border rounded">HIPAA COMPLIANT</div>
                        <div className="text-xs font-semibold px-4 py-2 border rounded">ISO 27001</div>
                        <div className="text-xs font-semibold px-4 py-2 border rounded">GDPR READY</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
