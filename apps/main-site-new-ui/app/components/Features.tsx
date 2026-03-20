"use client";

import { motion } from "framer-motion";
import { Shield, Brain, BarChart3 } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description:
      "Built with security and compliance at the core. GDPR, HIPAA, and SOC2 readiness from day one.",
  },
  {
    icon: Brain,
    title: "Explainable AI",
    description:
      "Advanced machine learning models that provide transparent insights and understandable results for all stakeholders.",
  },
  {
    icon: BarChart3,
    title: "Enterprise Scale",
    description:
      "Designed to process millions of data points per second with consistent performance and reliability.",
  },
];

export default function Features() {
  return (
    <section className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Why Choose Segmento?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white rounded-xl p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <reason.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
