"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MODEL_STATS } from "@/lib/ai-engine-data";
import { Brain, CheckCircle2, TrendingUp, Zap } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
  isNumeric?: boolean;
}

function useCountUp(target: number, duration: number = 1800, active: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

function StatCard({ label, value, prefix, suffix, icon, gradient, delay, isNumeric }: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const numericTarget = isNumeric ? Number(value) : 0;
  const count = useCountUp(numericTarget, 1600, inView && isNumeric === true);

  const displayValue = isNumeric ? count.toString() : value;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="relative bg-white border border-slate-200/80 rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(15,23,42,0.15)] hover:border-slate-300/80">
        {/* Gradient accent top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: gradient }}
        />

        {/* Background gradient blob */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.06] blur-2xl"
          style={{ background: gradient }}
        />

        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
          style={{ background: `${gradient}18` }}
        >
          <div style={{ color: gradient.match(/#[0-9A-Fa-f]+/)?.[0] }}>{icon}</div>
        </div>

        {/* Value */}
        <div className="text-4xl font-black text-[#0F172A] tracking-tight mb-1">
          {prefix}
          {displayValue}
          {suffix}
        </div>

        {/* Label */}
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export function ModelStats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
            By The Numbers
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            An ensemble built for precision
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Models in Stack"
            value={MODEL_STATS.total}
            icon={<Brain className="w-5 h-5" />}
            gradient="linear-gradient(135deg, #6366F1, #8B5CF6)"
            delay={0}
            isNumeric
          />
          <StatCard
            label="Currently Deployed"
            value={MODEL_STATS.deployed}
            icon={<Zap className="w-5 h-5" />}
            gradient="linear-gradient(135deg, #10B981, #059669)"
            delay={0.1}
            isNumeric
          />
          <StatCard
            label="Fully Trainable"
            value={MODEL_STATS.trainable}
            icon={<CheckCircle2 className="w-5 h-5" />}
            gradient="linear-gradient(135deg, #3B82F6, #1D4ED8)"
            delay={0.2}
            isNumeric
          />
          <StatCard
            label="Peak F1 Score"
            value={MODEL_STATS.peakF1}
            icon={<TrendingUp className="w-5 h-5" />}
            gradient="linear-gradient(135deg, #9D17A0, #C084FC)"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
