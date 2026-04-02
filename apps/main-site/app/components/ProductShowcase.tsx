"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Lock, Shield, Zap, Activity, EyeOff, Search, Clock, 
  TrendingUp, Users, MessageSquare, CheckCircle2, Ticket, ListChecks, 
  ChevronRight, Filter, Database, RefreshCw, Layers
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const products = [
  {
    id: "pulse",
    name: "Segmento Pulse",
    title: "Real-time News & Trends Engine",
    description: "Harness global data intelligence with emerging headlines and real-time trend tracking. Stay ahead with our proprietary News & Trends engine designed for global data privacy updates.",
    link: "/pulse",
    color: "blue",
  },
  {
    id: "sense",
    name: "Segmento Sense",
    title: "Explainable AI Enabled Data Classification",
    description: "Advanced text extraction and perimeter defense featuring client-side OCR and automated PII redaction. Experience the power of Explainable AI in every classification task.",
    link: "/products/data-classification",
    color: "indigo",
  },
  {
    id: "collector",
    name: "Segmento Collect",
    title: "AI-Powered Data Collection Platform",
    description: "Segmento Collector enables seamless data aggregation from multiple sources through intelligent connectors. Automate data ingestion, unify workflows, and transform raw inputs into actionable insights with AI-driven orchestration. Built-in recovery mechanisms ensure data continuity, including a 24-hour recovery window.",
    link: "/collector",
    color: "sky",
  },
  {
    id: "resolve",
    name: "Segmento Resolve",
    title: "Data Request & Ticket Management Platform",
    description: "Segmento Resolve helps manage data requests and tickets in a simple and organized way. It allows tracking and clear visibility to ensure smooth and efficient operations.",
    link: "https://segmento-resolve.vercel.app/",
    color: "emerald",
  },
  {
    id: "sprintiq",
    name: "Segmento Sprintiq",
    title: "Collaborative Retrospective Management Platform",
    description: "Segmento Sprintiq helps you run retrospectives in a simple and organized way. Capture feedback, collaborate in real time, and turn ideas into clear action items for continuous improvement.",
    link: "https://segmento-retro-omega.vercel.app/",
    color: "purple",
  },
];

const newsUpdates = [
  { tag: "Privacy", title: "EU Parliament updates Data Act...", time: "2m ago" },
  { tag: "Global", title: "Emerging tech trends in APAC markets", time: "5m ago" },
  { tag: "Tech", title: "New Encryption standards detected", time: "12m ago" },
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="ProductShowcase" 
      className="py-24 md:py-32 bg-slate-200 relative overflow-hidden transition-colors duration-500"
    >
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
                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-black tracking-widest uppercase shadow-sm border ${
                  product.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  product.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                  product.color === 'sky' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                  product.color === 'purple' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                  'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
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
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#0F172A] text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg active:scale-95 group"
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
                    product.color === 'blue' ? 'bg-blue-400' : 
                    product.color === 'indigo' ? 'bg-indigo-400' : 
                    product.color === 'sky' ? 'bg-sky-400' : 
                    product.color === 'purple' ? 'bg-purple-400' : 'bg-emerald-400'
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

                    <div className="bg-slate-50/50 rounded-[1.8rem] p-5 min-h-[340px] border border-slate-100 relative overflow-hidden">
                      
                      {/* --- PULSE PREVIEW --- */}
                      {product.id === "pulse" && (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Intelligence</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              {newsUpdates.map((news, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                  <div className="px-2 py-0.5 rounded-md bg-blue-50 text-[8px] font-black text-blue-600 uppercase">{news.tag}</div>
                                  <div className="flex-1 text-[11px] font-semibold text-slate-700 truncate">{news.title}</div>
                                  <div className="text-[9px] text-slate-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{news.time}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="h-24 bg-slate-900 rounded-2xl p-4 relative overflow-hidden">
                            <Activity className="w-4 h-4 text-blue-400 mb-2" />
                            <div className="absolute inset-x-0 bottom-0 h-10 flex items-end">
                              {[...Array(15)].map((_, i) => (
                                <motion.div key={i} animate={{ height: [5, 25, 10, 20, 5] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }} className="flex-1 bg-blue-500/30 border-t border-blue-400/50" />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --- SENSE PREVIEW --- */}
                      {product.id === "sense" && (
                        <div className="h-full flex flex-col gap-4">
                          <div className="bg-slate-900 p-5 border border-slate-800 shadow-2xl relative overflow-hidden flex-1">
                            <div className="flex items-center gap-2 mb-4">
                              <Search className="w-3 h-3 text-indigo-400" />
                              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">PII Scanner Active</span>
                            </div>
                            <div className="font-mono text-[11px] space-y-3">
                              <div className="text-slate-400 flex items-center gap-2"><span className="text-indigo-500">→</span> Analyzing file...</div>
                              <div className="p-3 bg-slate-800/50 border border-slate-700/50 relative">
                                <p className="text-slate-300">Email: <span className="bg-red-500/20 text-red-300 px-1 rounded inline-flex items-center gap-1"><EyeOff className="w-2 h-2" /> REDACTED</span></p>
                                <motion.div animate={{ top: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-px bg-indigo-400 shadow-[0_0_10px_indigo] opacity-50" />
                              </div>
                            </div>
                          </div>
                          <div className="h-16 bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Confidence</div>
                             <div className="text-sm font-black text-slate-900">99.8%</div>
                          </div>
                        </div>
                      )}

                      {/* --- COLLECTOR PREVIEW --- */}
                      {product.id === "collector" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-2">
                             <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-sky-600" />
                                <span className="text-xs font-black text-slate-800">Pipeline Status</span>
                             </div>
                             <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Live
                             </div>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden">
                             <div className="grid grid-cols-3 gap-2 mb-4">
                                {[1,2,3].map(i => (
                                  <div key={i} className="h-12 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-1">
                                    <div className="w-4 h-1 bg-sky-200 rounded-full" />
                                    <div className="w-6 h-1 bg-slate-200 rounded-full" />
                                  </div>
                                ))}
                             </div>
                             <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t-2 border-dashed border-sky-100" />
                                </div>
                                <div className="relative flex justify-center">
                                  <div className="bg-sky-600 p-2 rounded-lg shadow-lg">
                                    <RefreshCw className="w-4 h-4 text-white animate-spin-slow" />
                                  </div>
                                </div>
                             </div>
                             <div className="mt-4 flex items-center justify-center gap-2">
                                <Layers className="w-3 h-3 text-sky-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unifying 12+ Sources</span>
                             </div>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-xl flex items-center justify-between text-white border border-slate-800">
                             <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3 text-sky-400" />
                                <span className="text-[9px] font-bold uppercase">24h Recovery Window Active</span>
                             </div>
                             <div className="text-[10px] font-mono text-sky-400">00:00:00</div>
                          </div>
                        </div>
                      )}

                      {/* --- RESOLVE PREVIEW --- */}
                      {product.id === "resolve" && (
                        <div className="h-full flex flex-col gap-4">
                          <div className="flex items-center justify-between px-2">
                             <div className="flex items-center gap-2">
                                <Ticket className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-black text-slate-800">Requests Dashboard</span>
                             </div>
                             <Filter className="w-3 h-3 text-slate-400" />
                          </div>
                          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex-1">
                            <table className="w-full text-left text-[10px]">
                              <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                  <th className="px-3 py-2 font-bold text-slate-400">ID</th>
                                  <th className="px-3 py-2 font-bold text-slate-400">Status</th>
                                  <th className="px-3 py-2 font-bold text-slate-400">Priority</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {['#721', '#724', '#728'].map((id, i) => (
                                  <tr key={id}>
                                    <td className="px-3 py-3 font-bold text-slate-900">{id}</td>
                                    <td className="px-3 py-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {i === 0 ? 'Resolved' : 'In Progress'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 text-slate-400 font-medium">High</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-3 bg-emerald-600 rounded-xl flex items-center justify-between text-white">
                             <div className="flex items-center gap-2">
                               <ListChecks className="w-4 h-4" />
                               <span className="text-[10px] font-bold uppercase tracking-wider">98% Service Level</span>
                             </div>
                          </div>
                        </div>
                      )}

                      {/* --- SPRINTIQ PREVIEW --- */}
                      {product.id === "sprintiq" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-black text-slate-800">Q1 Retrospective</span>
                            </div>
                            <div className="flex -space-x-2">
                              {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white border border-purple-100 rounded-xl shadow-sm">
                              <div className="text-[9px] font-bold text-purple-600 mb-2 uppercase">Went Well</div>
                              <div className="space-y-2">
                                <div className="h-1.5 w-full bg-purple-50 rounded" />
                                <div className="h-1.5 w-4/5 bg-purple-50 rounded" />
                              </div>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <div className="text-[9px] font-bold text-slate-400 mb-2 uppercase">Action Items</div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <div className="h-1.5 w-full bg-slate-100 rounded" />
                              </div>
                            </div>
                          </div>
                          <div className="bg-purple-600 p-4 rounded-xl flex items-center justify-between text-white shadow-lg shadow-purple-200">
                             <div className="flex items-center gap-3">
                               <MessageSquare className="w-4 h-4" />
                               <span className="text-[11px] font-bold">12 Active Comments</span>
                             </div>
                             <ChevronRight className="w-4 h-4 opacity-50" />
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