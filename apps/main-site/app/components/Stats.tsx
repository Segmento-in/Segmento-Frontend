"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu, Lock, Activity, ChevronRight } from "lucide-react";

const statsData = [
  { value: "99.99%", label: "Uptime SLA", icon: <Zap className="w-4 h-4" /> },
  { value: "0%", label: "Data Egress", icon: <ShieldCheck className="w-4 h-4" /> },
  { value: "400+", label: "Formats", icon: <Cpu className="w-4 h-4" /> },
  { value: "100%", label: "Data Privacy", icon: <Lock className="w-4 h-4" /> },
  { value: "50ms", label: "Avg Latency", icon: <Activity className="w-4 h-4" /> },
];

export default function StatsTicker() {
  return (
    <section className="py-8 bg-white overflow-hidden border-y border-slate-100 group">
      <div className="relative flex items-center">
        {/* The "Lens" Overlay - Creates the fade-in/out effect at edges */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none" 
          style={{
            background: 'linear-gradient(90deg, white 0%, transparent 10%, transparent 90%, white 100%)'
          }}
        />

        {/* The Infinite Scrolling Track */}
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20, // Speed of the ticker
            repeat: Infinity,
            ease: "linear",
          }}
          // Optional: Pauses the ticker on hover for better readability
          whileHover={{ transition: { duration: 60 } }} 
        >
          {/* Duplicate the array for a seamless loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {statsData.map((stat, index) => (
                <div
                  key={`${i}-${index}`}
                  className="flex items-center gap-8 px-12"
                >
                  {/* Icon & Value Group */}
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600 opacity-80 group-hover:scale-110 transition-transform duration-500">
                      {stat.icon}
                    </div>
                    <span className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter">
                      {stat.value}
                    </span>
                  </div>

                  {/* Label Group */}
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                      {stat.label}
                    </span>
                    <div className="h-0.5 w-6 bg-blue-600 mt-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Geometric Divider (The "Round and Round" element) */}
                  <div className="ml-4 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full border-2 border-slate-200" />
                    <ChevronRight className="w-4 h-4 text-slate-200 -ml-1" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}