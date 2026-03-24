"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, TrendingUp, Lock, Shield, Zap, Activity, Eye, EyeOff, Search, Newspaper, Clock } from "lucide-react";
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

// Mock news data for the Pulse Feed
const newsUpdates = [
  { tag: "Privacy", title: "EU Parliament updates Data Act...", time: "2m ago" },
  { tag: "Global", title: "Emerging tech trends in APAC markets", time: "5m ago" },
  { tag: "Tech", title: "New Encryption standards detected", time: "12m ago" },
];

export default function ProductShowcase() {
  const [pulseData, setPulseData] = useState<TimeSeriesData[]>([]);
  const [scanProg, setScanProg] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const chart1 = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 10);
    const chart2 = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 10);
    setPulseData([chart1, chart2]);

    const interval = setInterval(() => {
      setScanProg((prev) => (prev >= 100 ? 0 : prev + 1));
      setActiveTab((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="ProductShowcase" 
      className="py-24 md:py-32 bg-white relative overflow-hidden"
    >
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
                  <div className={`absolute -inset-4 rounded-4xl blur-3xl opacity-20 transition-opacity group-hover:opacity-30 ${
                    product.color === 'blue' ? 'bg-blue-400' : 'bg-indigo-400'
                  }`} />
                  
                  <div className="relative bg-white rounded-4xl p-3 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.12)] border border-slate-200/60 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    
                    {/* Mock Browser Header */}
                    <div className="flex items-center gap-1.5 mb-4 px-3 py-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="ml-6 h-3 w-40 bg-slate-50 rounded-full border border-slate-100 flex items-center px-2">
                        <Lock className="w-2 h-2 text-slate-300 mr-2" />
                        <div className="w-20 h-1 bg-slate-100 rounded-full" />
                      </div>
                    </div>

                    {/* Dynamic Preview Content */}
                    <div className="bg-slate-50/50 rounded-[1.8rem] p-5 min-h-[340px] border border-slate-100 relative overflow-hidden">
                      
                      {product.id === "pulse" ? (
                        /* DYNAMIC PULSE PREVIEW - NEW ENHANCED VERSION */
                        <div className="space-y-4">
                          {/* Live Feed Header */}
                          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Intelligence Hub</span>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                              </div>
                            </div>
                            
                            {/* News Stream */}
                            <div className="space-y-3">
                              {newsUpdates.map((news, idx) => (
                                <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.2 }}
                                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                >
                                  <div className="px-2 py-0.5 rounded-md bg-blue-50 text-[8px] font-black text-blue-600 uppercase">
                                    {news.tag}
                                  </div>
                                  <div className="flex-1 text-[11px] font-semibold text-slate-700 truncate">
                                    {news.title}
                                  </div>
                                  <div className="text-[9px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    {news.time}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Pulse Visualizer & Analytics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-32 bg-slate-900 rounded-2xl p-4 shadow-lg overflow-hidden relative">
                              <div className="flex justify-between items-start">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <span className="text-[9px] font-bold text-blue-400/50 uppercase">Network Pulse</span>
                              </div>
                              <div className="absolute inset-x-0 bottom-0 h-16 flex items-end">
                                {[...Array(20)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [10, 40, 15, 30, 10] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                                    className="flex-1 bg-blue-500/30 border-t border-blue-400/50"
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="h-32 bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex flex-col justify-between">
                              <div className="flex justify-between items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                <div className="text-[14px] font-black text-slate-900">+12.4%</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Trend Score</div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    animate={{ width: ["30%", "85%", "60%"] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="h-full bg-emerald-500" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* DYNAMIC SENSE PREVIEW */
                        <div className="h-full flex flex-col gap-4">
                          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden flex-1">
                            <div className="flex items-center gap-2 mb-4">
                              <Search className="w-3 h-3 text-indigo-400" />
                              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">PII Scanner Active</span>
                            </div>
                            
                            <div className="font-mono text-[11px] space-y-3">
                              <div className="text-slate-400 flex items-center gap-2">
                                <span className="text-indigo-500">→</span> Analyzing document_v2.pdf
                              </div>
                              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 relative">
                                <p className="text-slate-300 leading-relaxed">
                                  User Session: <span className="bg-indigo-500/20 text-indigo-300 px-1 rounded">Admin_User</span> <br />
                                  Email: <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-red-500/20 text-red-300 px-1 rounded inline-flex items-center gap-1">
                                    <EyeOff className="w-2 h-2" /> REDACTED_INFO
                                  </motion.span>
                                </p>
                                {/* Scanning Line Overlay */}
                                <motion.div 
                                  animate={{ top: ['0%', '100%'] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                  className="absolute left-0 right-0 h-px bg-indigo-400 shadow-[0_0_10px_indigo] opacity-50"
                                />
                              </div>
                            </div>

                            <div className="absolute bottom-4 right-5 flex gap-2">
                                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                                  <Shield className="w-2 h-2" /> HIPAA READY
                                </div>
                            </div>
                          </div>

                          <div className="h-16 bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                             <div className="flex gap-2">
                                {[0, 1, 2].map(t => (
                                  <div key={t} className={`h-2 w-8 rounded-full transition-colors duration-500 ${t === activeTab ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                                ))}
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Confidence</div>
                                <div className="text-sm font-black text-slate-900">99.8%</div>
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