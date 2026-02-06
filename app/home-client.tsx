"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle } from "lucide-react"
import Chatbot from "./chatbot"
import PulseSideBanner from "@/components/PulseSideBanner"
import { motion } from "framer-motion"

// Animation Variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
}

const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
}

export default function HomePage() {
    return (
        <div className="flex flex-col bg-[#F4F0FF]">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-primary/5 via-purple-50 to-blue-50 py-20 md:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-primary/20">
                            <p className="text-sm font-semibold text-primary">Segmento Platform</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            AI-Driven Solutions for Modern Enterprises
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
                            Segmento is a robust platform delivering cutting-edge AI products that solve real enterprise challenges. From real-time data intelligence to advanced security solutions.
                        </p>
                        <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
                            Explore our suite of products: <span className="text-blue-600 font-bold">Segmento Pulse</span> for intelligent news & insights, and <span className="text-primary font-bold">Segmento Sense</span> for enterprise-grade data security.
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
                    </motion.div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div 
                        {...fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Segmento?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built for enterprises that demand security, intelligence, and scale
                        </p>
                    </motion.div>

                    <motion.div 
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                    >
                        {[
                            { icon: Shield, title: "Privacy-First Architecture", desc: "Built with security and compliance at the core. GDPR, HIPAA, SOC2 ready from day one.", color: "bg-primary/10", iconCol: "text-primary" },
                            { icon: Zap, title: "AI-Native Intelligence", desc: "Machine learning models that understand your data context, not just patterns.", color: "bg-purple-100", iconCol: "text-purple-600" },
                            { icon: TrendingUp, title: "Enterprise Scale", desc: "Process millions of data points per second with sub-100ms latency.", color: "bg-blue-100", iconCol: "text-blue-600" }
                        ].map((item, i) => (
                            <motion.div key={i} variants={fadeInUp} className="text-center p-6">
                                <div className={`inline-flex p-4 rounded-full ${item.color} mb-4`}>
                                    <item.icon className={`w-8 h-8 ${item.iconCol}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 md:py-24 bg-linear-to-br from-primary/5 to-purple-50">
                <div className="container mx-auto px-4">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
                        <p className="text-lg text-muted-foreground">
                            Powerful solutions for modern data challenges
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Segmento Pulse */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-border/50 hover:shadow-2xl transition-shadow"
                        >
                            <div className="flex flex-col h-full">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Segmento Pulse
                                </h3>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Stay ahead with real-time data intelligence. Get the latest news, insights,
                                    and trends curated for your data and tech needs.
                                </p>
                                <ul className="space-y-3 mb-6 grow">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>Curated tech & data news</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>Real-time insights & trends</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span>Multi-category coverage</span>
                                    </li>
                                </ul>
                                <Link href="/pulse">
                                    <Button size="lg" className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        Explore Pulse <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Segmento Sense */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-border/50 hover:shadow-2xl transition-shadow"
                        >
                            <div className="flex flex-col h-full">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                    Segmento Sense
                                </h3>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Our flagship enterprise solution. Built for organizations that demand
                                    the highest levels of intelligence and security for their most sensitive assets.
                                </p>
                                <ul className="space-y-3 mb-6 grow">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span>Advanced AI-powered technology</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span>Enterprise-grade security</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span>Trusted by leading organizations</span>
                                    </li>
                                </ul>
                                <Link href="/products/data-classification">
                                    <Button size="lg" className="w-full">
                                        Learn More <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div 
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center"
                    >
                        {[
                            { val: "99.99%", lab: "Uptime SLA", col: "text-primary" },
                            { val: "1M+", lab: "Records/Second", col: "text-purple-600" },
                            { val: "95%", lab: "AI Accuracy", col: "text-blue-600" },
                            { val: "Zero", lab: "Data Breaches", col: "text-green-600" }
                        ].map((stat, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <div className={`text-4xl md:text-5xl font-bold ${stat.col} mb-2`}>{stat.val}</div>
                                <div className="text-muted-foreground">{stat.lab}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

           {/* CTA Section – SAME UI AS HERO */}
      <section className="relative bg-linear-to-br from-primary/5 via-purple-50 to-blue-50 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-primary/20">
              <p className="text-sm font-semibold text-primary">
                Get Started with Segmento
              </p>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-linear-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Transform Your Data Security?
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join enterprises worldwide who trust Segmento to protect their most sensitive data
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8">
                  Get Started Today
                </Button>
              </Link>

              <Link href="/products/data-classification">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

            <PulseSideBanner />
            <Chatbot />
        </div>
    )
}