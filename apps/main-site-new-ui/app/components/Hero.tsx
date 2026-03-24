'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Globe, Lock, Cpu, Search } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  const [activeScan, setActiveScan] = useState(0);

  useEffect(() => {
    const randomHeights = Array.from({ length: 15 }, () => Math.floor(Math.random() * 60) + 20);
    setBarHeights(randomHeights);

    // Rotate through "AI Scanning" states
    const interval = setInterval(() => {
      setActiveScan((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 overflow-hidden bg-white">
      {/* Background soft blue wash */}
      <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-linear-to-bl from-blue-50/60 via-indigo-50/20 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-4 items-center">
          
          {/* Left: Text Content (Simplified for brevity, keep your original text here) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10">
            <h1 className="text-5xl lg:text-[74px] font-black text-[#0F172A] leading-[1.05] tracking-tight mb-8">
              AI-Driven <br /> <span className="text-[#2563EB]">Data Solutions</span> <br /> for Modern Enterprises
            </h1>
            <p className="text-[20px] text-slate-500 mb-10 max-w-lg leading-relaxed">
              Segmento delivers cutting-edge AI products like <strong>Pulse</strong> and <strong>Sense</strong> to solve real-time enterprise data challenges.
            </p>
           <button
  onClick={() => {
    const element = document.getElementById("ProductShowcase");
    if (element) {
      // Offset of 100px ensures the title isn't hidden by your Navbar
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }}
  className="px-9 py-4 bg-[#0F172A] text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 group cursor-pointer border-none outline-hidden active:scale-95"
>
  <span>Explore Our Products</span>
  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
</button>
          </motion.div>

          {/* Right: DYNAMIC Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-2.5 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.18)] border border-slate-100">
              <div className="w-full aspect-16/11 bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 flex relative">
                
                {/* 1. Sidebar Nav (Static) */}
                <div className="w-[12%] h-full bg-white border-r border-slate-100 flex flex-col items-center py-6 gap-6">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg shadow-blue-200 shadow-lg" />
                  {[Cpu, Globe, Lock, Activity, Shield].map((Icon, i) => (
                    <Icon key={i} className={`w-5 h-5 ${i === 0 ? 'text-blue-600' : 'text-slate-300'}`} />
                  ))}
                </div>

                {/* 2. Main Dashboard Content (Dynamic) */}
                <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                  
                  {/* Top Row: AI Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Confidence</p>
                        <div className="flex items-end gap-2">
                           <span className="text-xl font-black text-slate-800">99.2%</span>
                           <motion.div 
                             animate={{ height: ["20%", "80%", "40%"] }} 
                             transition={{ repeat: Infinity, duration: 2 }} 
                             className="w-1 bg-emerald-400 rounded-full mb-1" 
                           />
                        </div>
                    </div>
                    <div className="col-span-2 bg-slate-900 p-4 rounded-2xl flex justify-between items-center relative overflow-hidden">
                        <div className="z-10">
                            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Pulse Monitor</p>
                            <p className="text-white font-medium text-xs">Live Data Streams Active</p>
                        </div>
                        <Activity className="text-blue-500 w-8 h-8 animate-pulse z-10" />
                        {/* Animated Grid Background */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
                    </div>
                  </div>

                  {/* Middle Row: Segmento "SENSE" PII Scanning Simulation */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Search className="w-3 h-3 text-blue-600" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Segmento Sense™ AI Scanner</span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-mono">Process ID: x89_Data_Intelligence</p>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        </div>
                    </div>

                    {/* Simulated Code/Data Scanning */}
                    <div className="space-y-3 relative">
                        {[0, 1, 2].map((i) => (
                           <div key={i} className="relative">
                               <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                   <motion.div 
                                      animate={{ x: ["-100%", "200%"] }}
                                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                                      className="h-full w-1/3 bg-linear-to-r from-transparent via-blue-400 to-transparent opacity-30" 
                                   />
                               </div>
                               <div className="flex gap-2 mt-2">
                                  <div className={`h-1.5 w-16 rounded-full ${i === activeScan ? 'bg-blue-500' : 'bg-slate-100'} transition-colors duration-500`} />
                                  <div className={`h-1.5 w-10 rounded-full ${i === activeScan ? 'bg-indigo-400' : 'bg-slate-100'} transition-colors duration-500`} />
                               </div>
                           </div>
                        ))}
                        
                        {/* Dynamic Floating Tooltip */}
                        <AnimatePresence mode="wait">
                           <motion.div 
                             key={activeScan}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="absolute right-0 top-0 bg-blue-600 text-white text-[8px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1"
                           >
                             <Shield className="w-2 h-2" /> PII CLASSIFIED
                           </motion.div>
                        </AnimatePresence>
                    </div>
                  </div>

                  {/* Bottom Row: Activity Chart */}
                  <div className="h-20 bg-white rounded-2xl border border-slate-200 p-4 flex items-end justify-between gap-1 shadow-inner-sm">
                    {barHeights.map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ 
                            duration: 1, 
                            repeat: Infinity, 
                            repeatType: 'reverse', 
                            delay: i * 0.1 
                        }}
                        className={`w-full rounded-t-sm ${i % 3 === 0 ? 'bg-blue-600' : 'bg-blue-100'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Visual Glass Glare Overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              </div>
            </div>

            {/* Desktop Stand Base */}
            <div className="relative flex flex-col items-center">
              <div className="w-32 h-14 bg-linear-to-b from-slate-200 to-slate-300 rounded-b-xl shadow-lg -mt-1 z-0" />
              <div className="w-64 h-4 bg-slate-900/10 blur-xl rounded-full mt-2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}