import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/ui/button"

export const metadata = {
    title: "Segmento's Top 5 Standout Moments of 2025 | Blog",
    description: "Looking back at our journey building privacy-first, AI-driven data products in 2025",
}

export default function Blog2025MomentsPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4">
                <article className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <Link href="/blog">
                            <Button variant="ghost" className="mb-6">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 mb-6">
                            <time className="text-sm text-muted-foreground">December 31, 2025</time>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                Company News
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Segmento's Top 5 Standout Moments of 2025
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Looking back at our journey building privacy-first, AI-driven data products
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>1️⃣</span> A Powerful Beginning on an Auspicious Day
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                <strong>27th November 2025</strong> marked the official launch of Segmento—an auspicious day that set the tone for our journey. From day one, our mission was clear: to build privacy-first, AI-driven data products that solve real enterprise challenges.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                This wasn't just another company launch. It was the beginning of a movement  to redefine how organizations handle sensitive data, putting privacy and intelligence at the core of every decision.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>2️⃣</span> Rapid Kick-Off of Our Flagship Product
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Within weeks of launch, we quick-started development of our flagship <strong>Data Classification Framework</strong>, moving swiftly from concept to execution. This fast momentum demonstrated Segmento's ability to turn vision into working solutions without delay.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Our team worked tirelessly to translate enterprise needs into a robust architecture that could scale from startups to Fortune 500 companies.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>3️⃣</span> Completion of the Data Classification Framework
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                In record time, we successfully completed the core development of our <strong>Data Classification Framework</strong>—designed to help organizations identify, classify, and govern sensitive data across systems with accuracy and scalability.
                            </p>
                            <div className="bg-primary/5 rounded-lg p-6 my-6">
                                <p className="font-semibold mb-3">The framework brings together:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Automated discovery across structured and unstructured data</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Intelligent classification using pattern matching and ML</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Policy-driven governance and access controls</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">✓</span>
                                        <span>Real-time monitoring and compliance reporting</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>4️⃣</span> AI Models Enabled from Day One
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                A key milestone was the enablement of <strong>AI models</strong> within the framework. By embedding intelligence early, we laid the foundation for:
                            </p>
                            <div className="bg-purple-50 rounded-lg p-6 my-6">
                                <ul className="space-y-3">
                                    <li>
                                        <strong className="text-purple-700">Automated data discovery</strong> - Finding sensitive data wherever it lives
                                    </li>
                                    <li>
                                        <strong className="text-purple-700">Smart classification and tagging</strong> - Understanding data context beyond regex
                                    </li>
                                    <li>
                                        <strong className="text-purple-700">Future-ready compliance and observability</strong> - Adapting to evolving regulations
                                    </li>
                                </ul>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                This ensured our product was <strong>AI-native, not AI-added</strong>. Intelligence isn't a feature—it's the foundation of how Segmento works.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>5️⃣</span> Establishing Segmento's Product-First DNA
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                2025 firmly established Segmento as a <strong>product-driven data technology startup</strong>. Our focus on architecture, privacy, and AI readiness positioned us strongly for scaling data products in 2026 and beyond.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                We're not building services—we're building products that enterprises can trust, deploy, and scale independently.
                            </p>
                        </section>

                        <section className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>🌱</span> Looking Ahead
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                2025 was about <strong>building the foundation</strong>. With a solid product, AI capabilities, and a clear vision, Segmento enters the future ready to innovate, scale, and redefine data governance.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Here's to 2026 and beyond—where we turn this foundation into transformative solutions for enterprises worldwide.
                            </p>
                        </section>
                    </div>

                    {/* Tags & Share */}
                    <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">Company News</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">Milestones</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">AI</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">Data Classification</span>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
