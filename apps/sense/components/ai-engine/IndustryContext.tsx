"use client";

import { motion } from "framer-motion";
import { Cloud, Building2, Bot, ShieldCheck } from "lucide-react";

const INDUSTRY_CATEGORIES = [
  {
    icon: Cloud,
    label: "Cloud Platforms",
    examples: "AWS Macie, Google Cloud DLP, Microsoft Purview",
    note: "Data leaves your perimeter",
    color: "#3B82F6",
  },
  {
    icon: Building2,
    label: "Enterprise DLP",
    examples: "Symantec, Trellix, Spirion, Digital Guardian",
    note: "Complex, expensive, opaque",
    color: "#8B5CF6",
  },
  {
    icon: Bot,
    label: "AI-First SaaS Tools",
    examples: "Nightfall, Private AI, BigID, Varonis",
    note: "Training on your sensitive data",
    color: "#EC4899",
  },
];

export function IndustryContext() {
  return (
    <section className="py-20 bg-[#0B0F1A] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366F1, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #9D17A0, transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Bold statement */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
              The Industry Reality
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Every major vendor{" "}
              <span className="text-slate-400">sends your data to the cloud.</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #818CF8, #C084FC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                We built Sense to be the exception.
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Whether it&apos;s a cloud platform charging per GB, an enterprise DLP tool requiring
              weeks of setup, or an AI-first SaaS that runs your sensitive documents through
              external model APIs — the industry&apos;s default is to move your data.
            </p>

            {/* Callout box */}
            <div className="flex items-start gap-4 p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/8 backdrop-blur-sm">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="text-white font-bold block mb-1">
                  Segmento Sense runs all 18 models on your private infrastructure.
                </span>
                Zero third-party AI access. Zero data egress. Zero compliance risk from
                vendor-side breaches. Your PII stays where it belongs — with you.
              </p>
            </div>
          </motion.div>

          {/* Right — Industry category tiles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-4"
          >
            {INDUSTRY_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm hover:bg-white/6 hover:border-white/12 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm mb-1">{cat.label}</div>
                    <div className="text-slate-500 text-xs mb-2">{cat.examples}</div>
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: cat.color, backgroundColor: `${cat.color}15` }}
                    >
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: cat.color }} />
                      {cat.note}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Bottom contrast line */}
            <div className="pt-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
                vs Segmento Sense
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-emerald-500/25 bg-emerald-500/8">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm mb-1">Segmento Sense</div>
                <div className="text-slate-400 text-xs mb-2">
                  18 self-hosted models · Full offline capability · Zero third-party AI
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                  Your data stays with you
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
