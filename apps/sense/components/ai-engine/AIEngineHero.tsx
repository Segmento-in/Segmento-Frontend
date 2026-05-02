"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Cpu } from "lucide-react";

export function AIEngineHero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#0B0F1A]">
      {/* Animated mesh gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-60 -right-40 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(157,23,160,0.3) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Segmento Sense
          </Link>
        </motion.div>

        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
              Classifier Intelligence Engine
            </span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-5xl mb-8"
        >
          The AI Layer That Makes{" "}
          <span
            className="relative"
            style={{
              background: "linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #38BDF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Sense Unbeatable
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12"
        >
          18 specialized models. 5 detection layers. Every model runs exclusively on
          Segmento&apos;s private infrastructure —{" "}
          <span className="text-slate-200 font-semibold">
            your data never reaches a third-party AI provider.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#model-stack"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] active:scale-[0.98] group"
          >
            Explore All Models
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/8 hover:bg-white/12 text-white font-bold rounded-lg border border-white/15 hover:border-white/25 backdrop-blur-sm transition-all duration-200 active:scale-[0.98] group"
          >
            Try Sense Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Layer badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-2 mt-14"
        >
          {[
            { label: "4A · Primary NER", color: "#3B82F6" },
            { label: "4B · GLiNER", color: "#8B5CF6" },
            { label: "4C · Spatial Analysis", color: "#10B981" },
            { label: "4D · Lang Detection", color: "#F59E0B" },
            { label: "Framework", color: "#EC4899" },
          ].map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
              className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
              style={{
                color: layer.color,
                borderColor: `${layer.color}40`,
                backgroundColor: `${layer.color}12`,
              }}
            >
              {layer.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
