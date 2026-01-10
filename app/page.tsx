import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle } from "lucide-react"
import Chatbot from "./chatbot"
import ProductPopup from "@/components/ProductPopup"

export const metadata = {
    title: "Segmento | Secure Data. Smarter Insights.",
    description: "Privacy-first, AI-driven data products that solve real enterprise challenges. Transform how you protect and analyze sensitive information.",
}

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-purple-50 to-blue-50 py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Secure Data. Smarter Insights.
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Privacy-first, AI-driven data products that solve real enterprise challenges.
                            Transform how you protect and analyze sensitive information.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products/data-classification">
                                <Button size="lg" className="text-lg px-8">
                                    Explore Our Products <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="text-lg px-8">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Segmento?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built for enterprises that demand security, intelligence, and scale
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center p-6">
                            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Privacy-First Architecture</h3>
                            <p className="text-muted-foreground">
                                Built with security and compliance at the core. GDPR, HIPAA, SOC2 ready from day one.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="inline-flex p-4 rounded-full bg-purple-100 mb-4">
                                <Zap className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI-Native Intelligence</h3>
                            <p className="text-muted-foreground">
                                Machine learning models that understand your data context, not just patterns.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4">
                                <TrendingUp className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Enterprise Scale</h3>
                            <p className="text-muted-foreground">
                                Process millions of data points per second with sub-100ms latency.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
                        <p className="text-lg text-muted-foreground">
                            Powerful solutions for modern data challenges
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border/50">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                        Segmento Sense
                                    </h3>
                                    <p className="text-lg text-muted-foreground mb-6">
                                        Our flagship enterprise solution. Built for organizations that demand
                                        the highest levels of intelligence and security for their most sensitive assets.
                                    </p>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Advanced AI-powered technology</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Enterprise-grade security</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Trusted by leading organizations</span>
                                        </li>
                                    </ul>
                                    <Link href="/products/data-classification">
                                        <Button size="lg">
                                            Learn More <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/images/logo_new.png"
                                        alt="Segmento Sense"
                                        width={200}
                                        height={100}
                                        className="rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99.99%</div>
                            <div className="text-muted-foreground">Uptime SLA</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">1M+</div>
                            <div className="text-muted-foreground">Records/Second</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">95%</div>
                            <div className="text-muted-foreground">AI Accuracy</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">Zero</div>
                            <div className="text-muted-foreground">Data Breaches</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Transform Your Data Security?
                    </h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                        Join enterprises worldwide who trust Segmento to protect their most sensitive data
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" variant="secondary" className="text-lg px-8">
                                Get Started Today
                            </Button>
                        </Link>
                        <Link href="/products/data-classification">
                            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent text-white border-white hover:bg-white/10">
                                View Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Product Popup */}
            <ProductPopup />

            {/* Chatbot */}
            <Chatbot />
        </div>
    )
}
