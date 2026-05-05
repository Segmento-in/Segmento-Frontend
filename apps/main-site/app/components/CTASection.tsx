"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="py-24 px-4 bg-sky-50 transition-colors duration-500 dark-section"
    >
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}

          className="cta-box bg-[#0F172A] rounded-xl py-24 px-12 md:px-24 text-center relative overflow-hidden shadow-2xl transition-colors duration-500"
        >

          <div className="relative z-10 max-w-3xl mx-auto space-y-12">

            <h2 className="cta-text text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Ready to Transform Your Data Journey?
            </h2>

            <div className="flex justify-center">

              <Link
                href="/contact"
                className="
                  px-10 py-4
                  bg-[#2563EB]
                  text-white
                  font-bold text-lg
                  rounded-lg
                  hover:bg-blue-600
                  transition-all
                  hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]
                  active:scale-[0.98]
                "
              >
                contact us
              </Link>

            </div>

          </div>

        </motion.div>

        {/* ✅ DARK MODE OVERRIDES (IMPORTANT PART) */}
        <style jsx global>{`
          
          /* FULL SECTION DARK BACKGROUND */
          [data-theme="dark"] .dark-section {
            background: #0f172a !important;
          }

          /* CTA BOX becomes gray in dark mode */
          [data-theme="dark"] .cta-box {
            background: #e2e8f0 !important;
          }

          /* TEXT becomes black in dark mode */
          [data-theme="dark"] .cta-text {
            color: #000000 !important;
          }

        `}</style>

      </div>
    </section>
  );
}