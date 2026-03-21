"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Activity, Shield } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  // Fix for Hydration: Store random heights in state
  const [barHeights, setBarHeights] = useState<number[]>([]);

  useEffect(() => {
    // Generate heights only on the client side
    const randomHeights = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 20);
    setBarHeights(randomHeights);
  }, []);

  return (
    <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 overflow-hidden bg-white">
      {/* Background soft blue wash and glow */}
      <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-linear-to-bl from-blue-50/60 via-indigo-50/20 to-transparent -z-10" />
      <div className="absolute top-10 right-10 w-100 h-100 bg-blue-100/30 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-4 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <h1 className="text-5xl lg:text-[74px] font-black text-[#0F172A] leading-[1.05] tracking-tight mb-8">
              AI-Driven <br />
              <span className="text-[#2563EB]">Data Solutions</span> <br />
              for Modern <br /> Enterprises
            </h1>
            <p className="text-[20px] text-slate-500 mb-10 max-w-lg leading-relaxed font-normal">
              Segmento delivers cutting-edge AI products that solve real
              enterprise challenges. From real-time data intelligence to
              advanced security solutions for global organizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-9 py-4 bg-[#0F172A] text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-center"
              >
                Explore Our Products
              </Link>
              <button className="px-9 py-4 bg-white text-[#0F172A] font-bold rounded-full border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center space-x-3 active:scale-95 shadow-sm">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-slate-800 text-slate-800 ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
          </motion.div>

          {/* Right: Dashboard / Monitor Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-2.5 rounded-4xl shadow-[0_50px_100px_-20px_rgba(15,23,42,0.18)] border border-slate-100">
              <div className="w-full aspect-16/10 bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 flex relative">
                
                {/* Sidebar Nav */}
                <div className="w-[18%] h-full bg-white border-r border-slate-100 p-4 flex flex-col gap-5">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg mb-4 flex items-center justify-center" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-2 w-full bg-slate-100 rounded-full" />
                  ))}
                </div>

                {/* Dashboard Main Content */}
                <div className="flex-1 p-5 bg-[#F8FAFC]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-200" />
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-200" />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                       <div className="flex items-center gap-2 mb-4">
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">PII Detected</span>
                       </div>
                       <div className="space-y-3">
                          <div className="h-2 w-full bg-slate-50 rounded" />
                          <div className="h-2 w-[85%] bg-slate-50 rounded" />
                          <div className="h-2 w-[40%] bg-blue-100 rounded" />
                       </div>
                    </div>

                    <div className="col-span-2 flex flex-col gap-4">
                       <div className="flex-1 bg-red-50/50 p-4 rounded-2xl border border-red-100">
                          <p className="text-red-500 font-bold text-[10px] uppercase">Alerts</p>
                          <p className="text-3xl font-black text-red-600">326</p>
                       </div>
                       <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                          <Activity className="w-4 h-4 text-blue-500 mb-2" />
                          <p className="text-lg font-bold text-slate-800 leading-none">400+</p>
                          <p className="text-[10px] text-slate-400">Sources</p>
                       </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTIVITY CHART - FIX APPLIED HERE */}
                  <div className="mt-4 h-24 bg-white rounded-2xl border border-slate-200 p-4 relative overflow-hidden">
                     <div className="w-full h-full border-b border-slate-100 flex items-end justify-between">
                        {barHeights.map((height, i) => (
                           <div 
                              key={i} 
                              className="w-2 bg-blue-500/10 rounded-t-sm transition-all duration-700" 
                              style={{ height: `${height}%` }} 
                           />
                        ))}
                     </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              </div>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="w-32 h-14 bg-linear-to-b from-slate-200 to-slate-300 rounded-b-xl shadow-lg -mt-1.25 z-0" />
              <div className="w-56 h-3 bg-slate-900/5 blur-md rounded-full mt-2" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}