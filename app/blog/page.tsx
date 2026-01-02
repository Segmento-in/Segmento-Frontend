import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Blog - Segmento",
    description: "Insights on data privacy, AI, and enterprise technology from the Segmento team",
}

export default function BlogPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Segmento Blog
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Insights on data privacy, AI, and enterprise technology
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Featured Post */}
                    <div className="md:col-span-2 bg-white rounded-2xl border border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                    Latest
                                </span>
                                <time className="text-sm text-muted-foreground">December 31, 2025</time>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">Company News</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4 hover:text-primary transition-colors">
                                <Link href="/blog/2025-moments">
                                    Segmento's Top 5 Standout Moments of 2025
                                </Link>
                            </h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                Looking back at our journey building privacy-first, AI-driven data products. From our auspicious launch on November 27th to completing our flagship Data Classification Framework, 2025 was about building the foundation.
                            </p>
                            <Link href="/blog/2025-moments">
                                <Button>
                                    Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-2xl border border-border/50 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-2xl font-bold mb-3">More Articles Coming Soon</h3>
                        <p className="text-muted-foreground">
                            Stay tuned for more insights on data privacy, AI technologies, and enterprise solutions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
