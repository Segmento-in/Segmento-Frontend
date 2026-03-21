"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, TrendingUp, BellRing, Lock, Search, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

type TimeSeriesData = number[];

const products = [
  {
    id: "pulse",
    name: "Segmento Pulse",
    title: "Real-time News & Trends Engine",
    description: "Harness global data intelligence with emerging headlines and real-time trend tracking. Stay ahead with our proprietary News & Trends engine designed for global data privacy updates.",
    link: "/products/pulse",
    color: "blue",
  },
  {
    id: "sense",
    name: "Segmento Sense",
    title: "Explainable AI & PII Classification",
    description: "Advanced text extraction and perimeter defense featuring client-side OCR and automated PII redaction. Experience the power of Explainable AI in every classification task.",
    link: "/products/sense",
    color: "indigo",
  },
];

export default function ProductShowcase() {
  const [pulseData, setPulseData] = useState<TimeSeriesData[]>([]);
  const [scanProg, setScanProg] = useState(0);

  useEffect(() => {
    const chart1 = Array.from({ length: 8 }, () => Math.floor(Math.random() * 80) + 10);
    const chart2 = Array.from({ length: 8 }, () => Math.floor(Math.random() * 80) + 10);
    setPulseData([chart1, chart2]);

    const interval = setInterval(() => {
      setScanProg((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Top Decorative Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-5xl lg:text-[64px] font-black text-[#0F172A] leading-[1.1] tracking-tight">
            Product <span className="text-[#2563EB]">Showcase</span>
          </h2>
        </div>

        <div className="space-y-24 md:space-y-40">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-[#2563EB] rounded-full text-[13px] font-black tracking-widest uppercase shadow-xs border border-blue-100/50">
                  {product.name}
                </div>
                <h3 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.1]">
                  {product.title}
                </h3>
                <p className="text-[19px] text-slate-500 leading-relaxed font-medium max-w-xl">
                  {product.description}
                </p>
                
                <div className="pt-4">
                  <Link
                    href={product.link}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#0F172A] text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-blue-900/10 active:scale-95 group"
                  >
                    <span>Explore {product.name.split(" ")[1]}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Preview Side */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  {/* Decorative Glow Background */}
                  <div className={`absolute -inset-4 rounded-4xl blur-3xl opacity-20 transition-opacity group-hover:opacity-30 ${
                    product.color === 'blue' ? 'bg-blue-400' : 'bg-indigo-400'
                  }`} />
                  
                  {/* Main Browser Window Mockup */}
                  <div className="relative bg-white rounded-4xl p-3 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.12)] border border-slate-200/60 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    
                    {/* Mock Browser Header */}
                    <div className="flex items-center gap-1.5 mb-4 px-3 py-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="ml-6 h-3 w-40 bg-slate-100 rounded-full" />
                    </div>

                    {/* Dynamic Preview Content */}
                    <div className="bg-[#F8FAFC] rounded-[1.5rem] p-6 min-h-[300px] border border-slate-100">
                      {product.id === "pulse" ? (
                        <div className="space-y-6">
                          <div className="h-24 bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                              <Activity className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="h-2 w-24 bg-blue-100 rounded-full" />
                              <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {pulseData.length > 0 && pulseData.map((data, i) => (
                              <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="h-2 w-12 bg-slate-100 rounded-full" />
                                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                                </div>
                                <div className="absolute inset-x-0 bottom-4 px-4 flex items-end justify-between h-12">
                                  {data.map((h, j) => (
                                    <div key={j} style={{ height: `${h}%` }} className="w-3 bg-blue-500/10 rounded-xs transition-all duration-1000" />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="h-56 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center p-6 relative overflow-hidden">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
                              <Lock className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="space-y-3 w-full max-w-[200px]">
                              <div className="h-2 w-full bg-slate-100 rounded-full" />
                              <div className="h-2 w-2/3 bg-slate-100 rounded-full mx-auto" />
                            </div>
                            
                            {/* Scanning Line */}
                            <motion.div 
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-0.5 bg-indigo-400/40 z-10" 
                            />
                            
                            {/* Progress Footer */}
                            <div className="absolute bottom-6 left-8 right-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-600 rounded-full transition-all duration-200" style={{ width: `${scanProg}%` }} />
                            </div>
                          </div>
                          <div className="flex gap-3 h-10">
                            <div className="flex-1 bg-white rounded-xl border border-slate-200" />
                            <div className="flex-1 bg-indigo-600 rounded-xl flex items-center justify-center">
                               <Zap className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Glass Shine */}
                    <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}