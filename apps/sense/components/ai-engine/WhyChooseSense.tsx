"use client";

import { motion } from "framer-motion";
import { Eye, SlidersHorizontal, WifiOff, TestTube2, Wrench } from "lucide-react";

const DIFFERENTIATORS = [
  {
    number: "01",
    icon: Eye,
    title: "You Always Know Why — Not Just What",
    body: "Most PII tools hand you a list of findings and leave you guessing. Sense shows you which model flagged each entity, which rule triggered it, and the exact text span that caused it. Transparency isn't a feature — it's the foundation.",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.06)",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "You Control Precision vs. Recall",
    body: "A single model is a single threshold. Our Consensus Engine lets you dial a confidence slider: low confidence flags aggressively (maximizes recall for regulated environments), high confidence flags conservatively (minimizes false positives for high-throughput pipelines). You choose the tradeoff.",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.06)",
  },
  {
    number: "03",
    icon: WifiOff,
    title: "Works Completely Offline — No Cloud Required",
    body: "Banks, hospitals, and defense contractors cannot use SaaS tools. Sense runs all 18 models on your own private infrastructure with zero external API calls. Air-gap deployments are fully supported. Your data never crosses a network boundary it shouldn't.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.06)",
  },
  {
    number: "04",
    icon: TestTube2,
    title: "Replace Real PII With Valid Synthetic Data",
    body: "Redacting PII for test environments usually breaks data integrity. Sense replaces real PII with structurally valid synthetic data — SSNs that pass Luhn checks, IBANs with correct checksums, email addresses that match real domains. Your test data stays usable.",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.06)",
  },
  {
    number: "05",
    icon: Wrench,
    title: "Generate SQL & Python Fix Scripts Automatically",
    body: 'Sense bridges the gap between the Security team that finds PII and the Data Engineering team that fixes it. One click generates a ready-to-run remediation script for the exact columns and tables flagged. No more "we found 3,000 PII fields" without a path forward.',
    color: "#EC4899",
    bg: "rgba(236,72,153,0.06)",
  },
];

export function WhyChooseSense() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
            Why Segmento Sense
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-4">
            Built different. By design.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            These aren&apos;t marketing checkboxes. They are deliberate architectural decisions that
            took 18 months to get right.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFFERENTIATORS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="group relative bg-white border border-slate-200/80 rounded-2xl p-7 overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] hover:border-slate-300/80 transition-all duration-300"
              >
                {/* Background blob */}
                <div
                  className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: item.color }}
                />

                {/* Number */}
                <div
                  className="text-5xl font-black mb-5 leading-none opacity-15"
                  style={{ color: item.color }}
                >
                  {item.number}
                </div>

                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-[#0F172A] mb-3 leading-snug">
                  {item.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
