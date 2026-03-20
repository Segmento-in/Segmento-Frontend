"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-[15deg] translate-x-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl lg:text-[72px] font-bold text-[#0F172A] leading-[1.05] tracking-tight mb-8">
              AI-Driven <br />
              <span className="text-[#2563EB]">Data Solutions</span> <br />
              for Modern <br /> Enterprises
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-normal">
              Segmento delivers cutting-edge AI products that solve real
              enterprise challenges. From real-time data intelligence to
              advanced security solutions for global organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-[#0F172A] text-white font-bold rounded-lg hover:bg-slate-800 transition-all hover:shadow-[0_8px_20px_rgba(15,23,42,0.15)] active:scale-[0.98] text-center"
              >
                Explore Our Products
              </Link>
              <button className="px-8 py-4 bg-white text-[#0F172A] font-bold rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center space-x-2 active:scale-[0.98] shadow-sm">
                <Play className="w-4 h-4 text-slate-400" />
                <span>Watch Demo</span>
              </button>
            </div>
          </motion.div>

          {/* High-Fidelity CSS Monitor Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-[40px] p-4 shadow-[0_40px_100px_rgba(15,23,42,0.12)] border border-slate-200">
              <div className="w-full h-full bg-white rounded-[28px] border border-slate-200 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                {/* Mock UI Elements */}
                <div className="absolute top-0 left-0 w-full h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-6 space-x-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                
                <div className="text-center p-12">
                   <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <div className="w-10 h-10 border-2 border-blue-100 rounded-full flex items-center justify-center">
                         <div className="w-6 h-6 bg-blue-500/10 rounded-full animate-pulse" />
                      </div>
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Static Dashboard Placeholder</h3>
                   <p className="text-sm text-slate-500 max-w-[240px] mx-auto">Pixel-perfect CSS implementation for enterprise trust.</p>
                </div>

                {/* Subtle Reflection */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Monitor Stand Bottom */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-slate-200 rounded-b-3xl -z-10 shadow-lg border border-slate-300/50" />
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
