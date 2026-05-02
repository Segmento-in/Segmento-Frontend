"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

export function AIEngineCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Soft background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              See It In Action
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-5">
            Ready to see the AI engine work for your data?
          </h2>

          <p className="text-lg text-slate-500 leading-relaxed mb-10">
            Upload a document. Watch all 18 models work in concert. See exactly which model
            flagged what entity, and why — in real time.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_8px_30px_-8px_rgba(15,23,42,0.4)] active:scale-[0.98] group text-base"
            >
              Try the Live Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-slate-50 text-[#0F172A] font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 active:scale-[0.98] group text-base"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
