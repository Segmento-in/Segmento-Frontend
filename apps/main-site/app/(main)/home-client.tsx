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
  <div className="flex flex-col bg-[#0B0F1A]">
    {/* Hero Section */}
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/image/hero-bg.png')" }}
    >
      {/* Dark Premium Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0B0F1A]/90 via-[#0E1330]/85 to-[#0A1A3F]/90 backdrop-blur-sm" />

      <div className="relative container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* LEFT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:pl-20 xl:pl-28"
          >
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-snug tracking-tight">
              <span className="block text-white">
                AI-Driven
              </span>
              <span className="block bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Solutions for Modern Enterprises
              </span>
            </h1>
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="max-w-xl lg:pr-20 xl:pr-28"
          >
            {/* Platform Badge */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur rounded-full border border-cyan-400/30"
            >
              <p className="text-sm font-semibold text-cyan-400 tracking-wide">
                Data intelligence Platform
              </p>
            </motion.div>

            

            {/* Description */}
            <p className="text-lg text-slate-300 mb-4 leading-relaxed">
              Segmento is a robust platform delivering cutting-edge AI products that
              solve real enterprise challenges. From real-time data intelligence to
              advanced security solutions.
            </p>

            <p className="text-base text-slate-400 mb-8 font-medium leading-relaxed">
  Explore our suite of products:
  <br />

  <span className="block">
    <span className="text-cyan-400 font-bold">
      1. Segmento Pulse
    </span>{" "}
    – Intelligent news, trends, and AI-powered insights tailored for modern professionals.
  </span>


  <span className="block">
    <span className="text-indigo-400 font-bold">
      2. Segmento Sense
    </span>{" "}
    – Enterprise-grade data security and protection built for scalable and secure systems.
  </span>
</p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 flex items-center gap-2
                  bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500
                  hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400
                  text-white shadow-lg shadow-blue-500/30"
                onClick={scrollToProducts}
              >
                Explore Our Products
                <ArrowRight className="h-5 w-5" />
              </Button>

              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10"
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

      {/* CTA Section */}
<section className="relative py-20 md:py-32 overflow-hidden
                    bg-gradient-to-br from-[#050B2C] via-[#0B1C4D] to-[#020617]">
  
  {/* Soft Glow Background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_60%)]" />

  <div className="relative container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: easeOut }}
      className="max-w-4xl mx-auto text-center"
    >
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5
                   bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500
                   bg-clip-text text-transparent"
      >
        Ready to Transform Your Data Security?
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: easeOut }}
        className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
      >
        Join enterprises worldwide who trust Segmento to protect their most sensitive data
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: easeOut }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/contact">
          <Button
            size="lg"
            className="text-lg px-8
                       bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500
                       hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400
                       text-white shadow-lg shadow-blue-500/30"
          >
            Get Started Today
          </Button>
        </Link>

        <Link href="/products/data-classification">
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8
                       border-cyan-400/40 text-cyan-300
                       hover:bg-cyan-400/10 hover:text-cyan-200"
          >
            View Demo
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  </div>
</section>

      <Chatbot />
    </div>
  )
}
