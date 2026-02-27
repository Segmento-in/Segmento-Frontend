"use client"

import Link from "next/link"
import { Button } from "@/ui/button"
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle } from "lucide-react"
import Chatbot from "./chatbot"
import { motion, easeOut, easeInOut } from "framer-motion"

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: easeOut },
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 },
}

export default function HomePage() {
  const scrollToProducts = () => {
    const section = document.getElementById("products")
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
  <div className="flex flex-col bg-[#020617] selection:bg-cyan-500/30">
  {/* Hero Section */}
  <section
    className="relative min-h-[90vh] flex items-center overflow-hidden bg-cover bg-center"
    style={{ backgroundImage: "url('/image/hero-bg.png')" }}
  >
    {/* Deep Premium Overlay - Swapped to Slate-950 and Indigo-950 for true dark feel */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/95 to-[#0f172a]/90 backdrop-blur-[2px]" />

    {/* Subtle Radial Glow to add depth behind text */}
    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="relative container mx-auto px-6 z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:pl-12 xl:pl-20"
        >
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight">
            <span className="block text-white mb-2">
              AI-Driven
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Data Solutions for Modern Enterprises
            </span>
          </h1>
        </motion.div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="max-w-xl lg:pr-12 xl:pr-20"
        >
          {/* Platform Badge */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6 px-4 py-1.5 bg-cyan-500/10 backdrop-blur-md rounded-full border border-cyan-500/20"
          >
            <p className="text-xs md:text-sm font-bold text-cyan-400 uppercase tracking-widest">
              Data intelligence Platform
            </p>
          </motion.div>

          {/* Description */}
          <p className="text-lg text-slate-400 mb-6 leading-relaxed">
            Segmento is a robust platform delivering cutting-edge AI products that
            solve real enterprise challenges. From real-time data intelligence to
            advanced security solutions.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex gap-3 items-start">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <p className="text-slate-300">
                <strong className="text-white">1. Segmento Pulse</strong> – Intelligent trends & AI-powered insights.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <p className="text-slate-300">
                <strong className="text-white">2. Segmento Sense</strong> – Enterprise-grade data security & protection.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 flex items-center gap-2
                bg-gradient-to-r from-cyan-600 to-blue-600
                hover:from-cyan-500 hover:to-blue-500
                text-white shadow-[0_10px_20px_-10px_rgba(6,182,212,0.5)] transition-all duration-300"
              onClick={scrollToProducts}
            >
              Explore Our Products
              <ArrowRight className="h-5 w-5" />
            </Button>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg px-8 py-6 border-slate-700 text-slate-300 hover:bg-white/5 hover:text-white transition-all"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  </section>

  {/* Value Proposition */}
<section className="py-20 md:py-28 bg-gradient-to-b from-[#F8FAFC] to-white">
  <div className="container mx-auto px-6">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeOut }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto text-center mb-20"
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
        Why Choose Segmento?
      </h2>

      <p className="text-lg text-slate-600 leading-relaxed">
        Built for enterprises that demand security, intelligence, and scale
      </p>
    </motion.div>

    {/* Cards */}
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"
    >
      {[
        {
          icon: Shield,
          title: "Privacy-First Architecture",
          desc: "Built with security and compliance at the core. GDPR, HIPAA, and SOC2 readiness from day one.",
          color: "from-indigo-500 to-blue-500",
        },
        {
          icon: Zap,
          title: "AI-Native Intelligence",
          desc: "Advanced machine learning models that understand data context, not just surface patterns.",
          color: "from-purple-500 to-pink-500",
        },
        {
          icon: TrendingUp,
          title: "Enterprise Scale",
          desc: "Designed to process millions of data points per second with consistent performance.",
          color: "from-emerald-500 to-teal-500",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.15, ease: easeOut }}
          className="
            group bg-white rounded-2xl p-10 text-center
            border border-[#0B1C2D]/20
            hover:border-[#0B1C2D]
            hover:shadow-xl
            transition-all duration-300
          "
        >
          {/* Center Icon */}
          <div
            className={`mx-auto mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color}
                        flex items-center justify-center shadow-lg
                        group-hover:scale-110 transition-transform duration-300`}
          >
            <item.icon className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </motion.div>

  </div>
</section>

   {/* Products Section */}
<section
  id="products"
  className="py-16 md:py-24
             bg-gradient-to-br from-[#0B0F3B] via-[#141863] to-[#0B0F3B]"
>
  <div className="container mx-auto px-4">

    {/* Heading */}
    <motion.div {...fadeInUp} className="text-center mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="text-3xl md:text-4xl font-extrabold mb-4 text-white"
      >
        Our Products
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: easeOut }}
        className="text-lg text-slate-300"
      >
        Powerful solutions for modern enterprise data challenges
      </motion.p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

      {/* Segmento Pulse */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="bg-white/5 backdrop-blur-xl
                   rounded-2xl p-8
                   border border-white/10
                   hover:border-indigo-400/40
                   transition-all"
      >
        <div className="flex flex-col h-full">
          <h3
            className="text-2xl md:text-3xl font-bold mb-4
                       bg-gradient-to-r from-indigo-400 to-cyan-400
                       bg-clip-text text-transparent"
          >
            Segmento Pulse
          </h3>

          <p className="text-lg text-slate-300 mb-6">
            Stay ahead with real-time data intelligence. Get the latest news,
            insights, and trends curated for your data and tech needs.
          </p>

          <ul className="space-y-3 mb-6 grow text-slate-200">
            {[
              "Curated tech & data news",
              "Real-time insights & trends",
              "Multi-category coverage",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <Link href="/pulse">
            <Button
              size="lg"
              className="w-full
                         bg-gradient-to-r from-indigo-500 to-cyan-500
                         hover:from-indigo-600 hover:to-cyan-600
                         text-white"
            >
              Explore Pulse <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Segmento Sense (Styled SAME as Pulse) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="bg-white/5 backdrop-blur-xl
                   rounded-2xl p-8
                   border border-white/10
                   hover:border-indigo-400/40
                   transition-all"
      >
        <div className="flex flex-col h-full">
          <h3
            className="text-2xl md:text-3xl font-bold mb-4
                       bg-gradient-to-r from-indigo-400 to-cyan-400
                       bg-clip-text text-transparent"
          >
            Segmento Sense
          </h3>

          <p className="text-lg text-slate-300 mb-6">
            Our flagship enterprise intelligence platform built to classify,
            secure, and understand sensitive data at scale.
          </p>

          <ul className="space-y-3 mb-6 grow text-slate-200">
            {[
              "AI-powered data classification",
              "Enterprise-grade privacy & security",
              "Built for large-scale organizations",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <Link href="/products/data-classification">
            <Button
              size="lg"
              className="w-full
                         bg-gradient-to-r from-indigo-500 to-cyan-500
                         hover:from-indigo-600 hover:to-cyan-600
                         text-white"
            >
              Explore sense <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.div>

    </div>
  </div>
</section>
      {/* Stats Section */}
<section className="py-16 md:py-24 bg-white">
  <div className="container mx-auto px-4">
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-4xl mx-auto text-center"
    >
      {[
        {
          val: "99.99%",
          lab: "Uptime SLA",
          col: "bg-gradient-to-r from-indigo-600 to-blue-600",
        },
        {
          val: "1M+",
          lab: "Records/Second",
          col: "bg-gradient-to-r from-purple-600 to-pink-600",
        },
        {
          val: "95%",
          lab: "AI Accuracy",
          col: "bg-gradient-to-r from-cyan-600 to-blue-600",
        },
        {
          val: "Zero",
          lab: "Data Breaches",
          col: "bg-gradient-to-r from-emerald-600 to-green-600",
        },
      ].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: i * 0.2, ease: easeOut }}
        >
          {/* Stat Value */}
          <div
            className={`text-4xl md:text-5xl font-bold mb-2
                        ${stat.col}
                        bg-clip-text text-transparent`}
          >
            {stat.val}
          </div>

          {/* Label */}
          <div className="text-muted-foreground font-medium tracking-wide">
            {stat.lab}
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

 {/* CTA Section - Dark Aesthetic Card UI */}
<section className="bg-white py-24">
    <div className="container mx-auto px-4 text-center">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto p-12 md:p-16 [3rem] bg-[#0f172a] border border-slate-800 shadow-2xl relative overflow-hidden"
        >
            {/* Decorative glows to match branding */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 relative z-10">
                Ready to Transform Your Data Security?
            </h2>
            
            <p className="text-slate-400 mb-10 font-medium text-lg max-w-2xl mx-auto relative z-10 leading-relaxed">
                Join enterprises worldwide who trust Segmento to protect their most sensitive data.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Link 
                    href="/contact" 
                    className="px-10 py-4 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 transition-transform hover:scale-105 active:scale-95 text-center flex items-center justify-center"
                >
                    Get Started Today
                </Link>
                <Link 
                    href="/products/data-classification" 
                    className="px-10 py-4 border-2 border-cyan-400/50 text-cyan-400 rounded-xl font-bold hover:bg-cyan-400/10 transition-all shadow-lg hover:border-cyan-400 text-center flex items-center justify-center"
                >
                    View Demo
                </Link>
            </div>
        </motion.div>
    </div>
</section>

      <Chatbot />
    </div>
  )
}
