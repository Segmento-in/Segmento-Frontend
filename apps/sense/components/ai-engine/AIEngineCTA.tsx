"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

export function AIEngineCTA() {
  return (
    <section className="py-24 bg-white dark:bg-[#020617] relative overflow-hidden transition-colors duration-500">
      
      {/* Soft background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Dark mode glow */}
      <div className="absolute inset-0 pointer-events-none dark:block hidden">
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 mb-6 transition-colors duration-500">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest transition-colors duration-500">
              See It In Action
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight mb-5 transition-colors duration-500">
            Ready to see the AI engine work for your data?
          </h2>

          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 transition-colors duration-500">
            Upload a document. Watch all 18 models work in concert. See exactly
            which model flagged what entity, and why — in real time.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            
            {/* Primary Button */}
            <Link
              href="/demo"
              className="inline-flex items-center gap-2.5 px-8 py-4 
              bg-[#0F172A] dark:bg-white 
              hover:bg-slate-800 dark:hover:bg-slate-200 
              text-white dark:text-[#020617] 
              font-bold rounded-xl transition-all duration-300 
              hover:shadow-[0_8px_30px_-8px_rgba(15,23,42,0.4)] 
              dark:hover:shadow-[0_8px_30px_-8px_rgba(255,255,255,0.15)]
              active:scale-[0.98] group text-base"
            >
              Try the Live Demo

              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Secondary Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 
              bg-white dark:bg-slate-900/80 
              hover:bg-slate-50 dark:hover:bg-slate-800 
              text-[#0F172A] dark:text-white 
              font-bold rounded-xl 
              border border-slate-200 dark:border-slate-700 
              hover:border-slate-300 dark:hover:border-slate-600 
              transition-all duration-300 
              active:scale-[0.98] group text-base backdrop-blur-sm"
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