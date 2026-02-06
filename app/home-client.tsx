"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import Chatbot from "./chatbot";
import PulseSideBanner from "@/components/PulseSideBanner";
import { motion } from "framer-motion";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 },
};

export default function HomeClient() {
  return (
    <div className="flex flex-col bg-[#F4F0FF]">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/5 via-purple-50 to-blue-50 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-primary/20">
              <p className="text-sm font-semibold text-primary">
                Segmento Platform
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI-Driven Solutions for Modern Enterprises
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Segmento is a robust platform delivering cutting-edge AI products
              that solve real enterprise challenges.
            </p>

            <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
              Explore our suite of products:{" "}
              <span className="text-blue-600 font-bold">Segmento Pulse</span> and{" "}
              <span className="text-primary font-bold">Segmento Sense</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products/data-classification">
                <Button size="lg" className="text-lg px-8">
                  Explore Our Products
                  <ArrowRight className="ml-2 h-5 w-5" />
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
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Segmento?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for enterprises that demand security, intelligence, and
              scale
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
              {
                icon: Shield,
                title: "Privacy-First Architecture",
                desc: "GDPR, HIPAA, SOC2 ready from day one.",
                color: "bg-primary/10",
                iconCol: "text-primary",
              },
              {
                icon: Zap,
                title: "AI-Native Intelligence",
                desc: "Context-aware machine learning models.",
                color: "bg-purple-100",
                iconCol: "text-purple-600",
              },
              {
                icon: TrendingUp,
                title: "Enterprise Scale",
                desc: "Millions of events per second with low latency.",
                color: "bg-blue-100",
                iconCol: "text-blue-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center p-6"
              >
                <div
                  className={`inline-flex p-4 rounded-full ${item.color} mb-4`}
                >
                  <item.icon className={`w-8 h-8 ${item.iconCol}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <PulseSideBanner />
      <Chatbot />
    </div>
  );
}
