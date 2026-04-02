"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-4 bg-slate-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0F172A] rounded-xl py-24 px-12 md:px-24 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 max-w-3xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Ready to Transform Your Data Security?
            </h2>

            <div className="flex justify-center">
              <Link
                href="/contact"
                className="px-10 py-4 bg-[#2563EB] text-white font-bold text-lg rounded-lg hover:bg-blue-600 transition-all hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
              >
                contact us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
