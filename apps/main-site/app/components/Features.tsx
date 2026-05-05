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
    <section
      className="py-32 transition-colors duration-300"
      style={{ background: "var(--color-background)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "var(--color-heading)" }}
          >
            Why Choose Segmento?
          </h2>
        </div>

        {/* Cards */}
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
              <div
                className="h-full rounded-xl p-10 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-8 bg-white shadow-md group-hover:scale-110 transition-transform duration-300">
                  <reason.icon className="w-6 h-6 text-blue-600" />
                </div>

                {/* 🔥 FORCE DARK TEXT (THIS FIXES YOUR ISSUE) */}
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-black">
                  {reason.title}
                </h3>

                <p className="leading-relaxed font-normal text-gray-700">
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