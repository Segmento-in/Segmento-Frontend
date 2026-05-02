"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";

const LAYER_BADGES = [
  { label: "4A · Primary NER", color: "#3B82F6", bg: "rgba(59,130,246,0.18)" },
  { label: "4B · GLiNER", color: "#8B5CF6", bg: "rgba(139,92,246,0.18)" },
  { label: "4C · Spatial", color: "#10B981", bg: "rgba(16,185,129,0.18)" },
  { label: "4D · Lang Detect", color: "#F59E0B", bg: "rgba(245,158,11,0.18)" },
  { label: "Framework", color: "#EC4899", bg: "rgba(236,72,153,0.18)" },
];

// Animated model layer visualization
function LayerStack() {
  const bars = [
    { label: "Framework", width: "95%", color: "#EC4899", active: true, delay: 0 },
    { label: "4A · Primary NER", width: "88%", color: "#3B82F6", active: true, delay: 0.15 },
    { label: "4B · GLiNER", width: "78%", color: "#8B5CF6", active: true, delay: 0.3 },
    { label: "4C · Spatial", width: "60%", color: "#10B981", active: false, delay: 0.45 },
    { label: "4D · Lang Detect", width: "45%", color: "#F59E0B", active: false, delay: 0.6 },
  ];

  return (
    <div className="space-y-3">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{bar.label}</span>
            {bar.active ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                Live
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-600 uppercase">Soon</span>
            )}
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: bar.width }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: bar.delay, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${bar.color}60, ${bar.color})`,
                boxShadow: bar.active ? `0 0 8px ${bar.color}60` : "none",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AIEngineTeaser() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#0D1226] to-indigo-950 border border-white/8">
          {/* Background orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
              style={{ background: "radial-gradient(circle, #6366F1, transparent)" }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full opacity-10 blur-3xl"
              style={{ background: "radial-gradient(circle, #9D17A0, transparent)" }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-10 sm:p-14">
            {/* Left — Content */}
            <div className="flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  Classifier Intelligence
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-white leading-[1.1] tracking-tight mb-4">
                18 AI Models.{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #818CF8 0%, #C084FC 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  One Unified Intelligence Layer.
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-slate-400 text-base leading-relaxed mb-7">
                Sense doesn&apos;t rely on a single model. Our classifier routes every document
                through a precision ensemble — from Primary NER to Spatial Analysis to Language
                Detection. All self-hosted. All yours. Zero data leaves your perimeter.
              </p>

              {/* Layer badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {LAYER_BADGES.map((badge) => (
                  <span
                    key={badge.label}
                    className="px-3 py-1 rounded-full text-[11px] font-bold"
                    style={{ color: badge.color, backgroundColor: badge.bg }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div>
                <Link
                  href="/ai-engine"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] active:scale-[0.98] group"
                >
                  Explore the Full Model Stack
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right — Layer stack visualization */}
            <div className="flex flex-col justify-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Model Layer Activity
                  </span>
                </div>

                <LayerStack />

                {/* Bottom stat row */}
                <div className="grid grid-cols-3 gap-3 mt-7 pt-6 border-t border-white/8">
                  {[
                    { val: "18", label: "Models" },
                    { val: "7", label: "Live" },
                    { val: "0.996", label: "Peak F1" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xl font-black text-white">{stat.val}</div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
