import Link from "next/link"
import { ArrowLeft, TrendingUp, Sparkles, Zap } from "lucide-react"
import { Button } from "@/ui/button"

export const metadata = {
    title: "Introducing Segmento Pulse: Real-Time Technology Intelligence | Blog",
    description: "Announcing Segmento Pulse - Your centralized hub for real-time tech news, trends, and insights across AI, Data, and Cloud",
}

export default function SegmentoPulseLaunchPage() {
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
                            <time className="text-sm text-muted-foreground">January 10, 2026</time>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                Product Launch
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Introducing Segmento Pulse: Real-Time Technology Intelligence
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Stay ahead with curated tech news, trends, and insights—powered by Segmento's commitment to actionable intelligence
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-12">
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Today, we're thrilled to announce <strong>Segmento Pulse</strong>—a new product from Segmento designed to keep technology leaders, data professionals, and innovators informed with real-time news and insights across the rapidly evolving tech landscape.
                            </p>
                        </section>

                        <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>📰</span> Whatnis Segmento Pulse?
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                Segmento Pulse is your <strong>centralized hub for technology intelligence</strong>. In a world where staying updated is critical to staying competitive, Pulse delivers curated, categorized news from trusted sources—bringing clarity to the noise.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Whether you're tracking AI breakthroughs, data security threats, cloud innovations, or business analytics trends, Pulse ensures you never miss what matters.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-blue-600" />
                                Why We Built Segmento Pulse
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                At Segmento, we understand the challenges of information overload. Technology professionals are inundated with:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-6 my-6">
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span><strong>Fragmented news sources</strong> scattered across dozens of platforms</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span><strong>Irrelevant content</strong> that doesn't match their focus areas</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span><strong>Time wasted</strong> sifting through noise to find signal</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Segmento Pulse was built to solve this. It's not just another news aggregator—it's a <strong>purpose-built intelligence platform</strong> for the modern data and technology professional.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-purple-600" />
                                Key Features
                            </h2>

                            <div className="space-y-6">
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-2xl font-bold mb-3">🎯 Intelligent Categorization</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        News is organized across <strong>11 specialized categories</strong> including Artificial Intelligence, Data Security, Data Governance, Business Intelligence, Cloud Computing, and more. Find exactly what you need, when you need it.
                                    </p>
                                </div>

                                <div className="border-l-4 border-purple-500 pl-6">
                                    <h3 className="text-2xl font-bold mb-3">⚡ Real-Time Updates</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Pulse aggregates news from <strong>trusted global sources</strong> in real-time, ensuring you're always connected to the latest developments in technology.
                                    </p>
                                </div>

                                <div className="border-l-4 border-indigo-500 pl-6">
                                    <h3 className="text-2xl font-bold mb-3">🎨 Beautiful, Intuitive Design</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Our bento-style grid interface makes exploring news <strong>visually engaging and effortless</strong>. Each category is represented with dynamic imagery and headlines that draw you in.
                                    </p>
                                </div>

                                <div className="border-l-4 border-pink-500 pl-6">
                                    <h3 className="text-2xl font-bold mb-3">📊 Curated for Professionals</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Unlike generic news apps, Pulse is <strong>built specifically for technology and data professionals</strong>—covering the topics that drive your decision-making.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-6">📚 Coverage Areas</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-purple-50 rounded-lg p-5">
                                    <h4 className="font-bold text-purple-700 mb-2">🤖 Artificial Intelligence</h4>
                                    <p className="text-sm text-gray-600">Latest breakthroughs, model releases, and AI trends</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-5">
                                    <h4 className="font-bold text-red-700 mb-2">🔒 Data Security</h4>
                                    <p className="text-sm text-gray-600">Threats, vulnerabilities, and cybersecurity updates</p>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-5">
                                    <h4 className="font-bold text-emerald-700 mb-2">📊 Data Governance</h4>
                                    <p className="text-sm text-gray-600">Compliance, regulations, and governance frameworks</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-5">
                                    <h4 className="font-bold text-amber-700 mb-2">🛡️ Data Privacy</h4>
                                    <p className="text-sm text-gray-600">GDPR, CCPA, and global privacy developments</p>
                                </div>
                                <div className="bg-indigo-50 rounded-lg p-5">
                                    <h4 className="font-bold text-indigo-700 mb-2">⚙️ Data Engineering</h4>
                                    <p className="text-sm text-gray-600">ETL, pipelines, and data infrastructure news</p>
                                </div>
                                <div className="bg-violet-50 rounded-lg p-5">
                                    <h4 className="font-bold text-violet-700 mb-2">📈 Business Intelligence</h4>
                                    <p className="text-sm text-gray-600">BI tools, dashboards, and reporting insights</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-5">
                                    <h4 className="font-bold text-blue-700 mb-2">📉 Business Analytics</h4>
                                    <p className="text-sm text-gray-600">Analytics trends, tools, and methodologies</p>
                                </div>
                                <div className="bg-pink-50 rounded-lg p-5">
                                    <h4 className="font-bold text-pink-700 mb-2">👥 Customer Data Platforms</h4>
                                    <p className="text-sm text-gray-600">CDP innovations and customer360 solutions</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-5">
                                    <h4 className="font-bold text-slate-700 mb-2">🖥️ Data Centers</h4>
                                    <p className="text-sm text-gray-600">Infrastructure, edge computing, and DC trends</p>
                                </div>
                                <div className="bg-cyan-50 rounded-lg p-5">
                                    <h4 className="font-bold text-cyan-700 mb-2">☁️ Cloud Computing</h4>
                                    <p className="text-sm text-gray-600">AWS, Azure, GCP updates and cloud innovations</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <h4 className="font-bold text-gray-700 mb-2">📖 Tech Magazines</h4>
                                    <p className="text-sm text-gray-600">In-depth articles from leading tech publications</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Zap className="w-8 h-8 text-yellow-500" />
                                The Value Segmento Pulse Brings
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                In an industry where information is power, Segmento Pulse delivers:
                            </p>
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 my-6">
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-600 text-2xl">✓</span>
                                        <div>
                                            <strong className="text-green-700">Time Savings:</strong>
                                            <p className="text-gray-700">Stop jumping between 15 different sources. Get everything in one place.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 text-2xl">✓</span>
                                        <div>
                                            <strong className="text-blue-700">Informed Decisions:</strong>
                                            <p className="text-gray-700">Make strategic technology decisions backed by the latest industry insights.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-600 text-2xl">✓</span>
                                        <div>
                                            <strong className="text-purple-700">Competitive Edge:</strong>
                                            <p className="text-gray-700">Stay ahead of trends, threats, and opportunities before your competitors do.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-indigo-600 text-2xl">✓</span>
                                        <div>
                                            <strong className="text-indigo-700">Focused Learning:</strong>
                                            <p className="text-gray-700">Deepen your expertise in specific areas without information overload.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span>🚀</span> Get Started with Segmento Pulse Today
                            </h2>
                            <p className="text-white/90 text-lg leading-relaxed mb-6">
                                Segmento Pulse is <strong>live and free to use</strong>. Whether you're a CTO, data engineer, security analyst, or technology enthusiast, Pulse is built for you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/pulse">
                                    <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                                        Explore Segmento Pulse →
                                    </Button>
                                </Link>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold mb-4">💡 What's Next</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                Segmento Pulse is just the beginning. We're committed to continuously enhancing the platform with:
                            </p>
                            <ul className="space-y-2 text-muted-foreground text-lg">
                                <li>• <strong>Personalized news feeds</strong> based on your interests</li>
                                <li>• <strong>Newsletter subscriptions</strong> delivered to your inbox</li>
                                <li>• <strong>AI-powered summaries</strong> for quick insights</li>
                                <li>• <strong>Sentiment analysis</strong> on trending topics</li>
                                <li>• <strong>Mobile applications</strong> for news on-the-go</li>
                            </ul>
                        </section>

                        <section className="mb-12 border-t pt-8">
                            <h2 className="text-3xl font-bold mb-4">🎯 Final Thoughts</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                With Segmento Pulse, we're not just delivering news—we're delivering <strong>intelligence</strong>. In a world where technology moves at lightning speed, Pulse ensures you're always in the know.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                This is our commitment to the technology community: <strong>clarity, relevance, and real-time insights</strong>—all in one place.
                            </p>
                        </section>
                    </div>

                    {/* Tags & Share */}
                    <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">Product Launch</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">Segmento Pulse</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">Tech News</span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">Real-Time Intelligence</span>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
