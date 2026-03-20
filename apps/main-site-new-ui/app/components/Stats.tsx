"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "99.99% Uptime SLA",
    label: "",
    large: true,
  },
  {
    value: "0%",
    label: "Data Egress",
    large: false,
  },
  {
    value: "400+",
    label: "Formats Supported",
    large: false,
  },
];

export default function Stats() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Large Stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-xl p-12 border border-slate-100 shadow-[0_10px_40px_rgba(15,23,42,0.03)] flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-[#2563EB] tracking-tight">
              99.99% Uptime SLA
            </h2>
          </motion.div>

          {/* Individual Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center"
          >
            <div className="text-6xl font-bold text-slate-900 mb-3 tracking-tight">0%</div>
            <div className="text-slate-500 font-semibold text-lg uppercase tracking-wide">Data Egress</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-10 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center"
          >
            <div className="text-6xl font-bold text-slate-900 mb-3 tracking-tight">400+</div>
            <div className="text-slate-500 font-semibold text-lg uppercase tracking-wide">Formats Supported</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
