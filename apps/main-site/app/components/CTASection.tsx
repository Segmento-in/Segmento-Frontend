"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-4" style={{ background: "var(--theme-bg)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "linear-gradient(135deg, var(--product-resolve-bg) 0%, var(--product-sense-bg) 50%, var(--product-collect-bg) 100%)",
            border: "1px solid var(--theme-border)",
            borderRadius: "1.25rem",
            padding: "6rem 3rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "var(--shadow-tile)",
          }}
        >
          {/* Soft radial glow at center */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, var(--theme-brand-glow), transparent 70%)",
            }}
          />

          <div
            className="relative z-10 max-w-3xl mx-auto"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}
          >
            <span
              className="chip"
              style={{ borderColor: "var(--theme-brand)", color: "var(--theme-brand)" }}
            >
              Ready to start
            </span>

            <h2
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "var(--theme-fg)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Ready to take control
              <br />
              <span style={{ color: "var(--theme-brand)" }}>of your data?</span>
            </h2>

            <p
              style={{
                fontFamily: "var(--font-mona-sans, sans-serif)",
                fontSize: "1.0625rem",
                color: "var(--theme-fg-subtle)",
                lineHeight: 1.65,
                maxWidth: "28rem",
              }}
            >
              Start with one product. Or explore all five. Either way, your data
              will never be the same.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
              <Link href="/contact" className="btn-primary">
                Book a Demo →
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to Us
              </Link>
            </div>

            <p
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.6875rem",
                color: "var(--theme-fg-muted)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              No data leaves your environment · GDPR · HIPAA · DPDP Ready
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}