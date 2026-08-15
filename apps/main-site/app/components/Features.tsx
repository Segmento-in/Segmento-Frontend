"use client";

import { motion } from "framer-motion";
import { Brain, Shield, BarChart3, Database, Cloud, Lock } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Features Section — Premium Dark Bento Cards
// Design target:
//   Row 1: [Large card — Client-Side Processing (8 cols)] [Explainable AI (4 cols)]
//   Row 2: [Zero-Trust Security (6 cols)] [Enterprise Scale (6 cols)]
//
// All cards use the established .bento-tile system from globals.css.
// Dark surfaces, brand-colored icons, micro-animations.
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// ── Mini Data-Flow Diagram (inside the large card) ──────────────────────────
function DataFlowDiagram() {
  const nodes = [
    { label: "Data", icon: <Database size={14} />, x: "10%", color: "var(--theme-brand)" },
    { label: "Secure local processes", icon: <Lock size={14} />, x: "45%", color: "var(--theme-success)" },
    { label: "Secure local environment", icon: <Cloud size={14} />, x: "78%", color: "var(--product-resolve-accent)" },
  ];

  return (
    <div
      style={{
        marginTop: "1.5rem",
        position: "relative",
        height: 120,
        background: "var(--theme-bg-surface-high)",
        borderRadius: 10,
        border: "1px solid var(--theme-border)",
        overflow: "hidden",
      }}
    >
      {/* Animated grid lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--theme-brand-glow) 1px, transparent 1px), linear-gradient(90deg, var(--theme-brand-glow) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Connector lines */}
      {nodes.slice(0, -1).map((_, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: `calc(${nodes[i].x} + 36px)`,
            width: `calc(${nodes[i + 1].x} - ${nodes[i].x} - 36px)`,
            height: 1,
            background: `linear-gradient(90deg, ${nodes[i].color}, ${nodes[i + 1].color})`,
            opacity: 0.5,
            transform: "translateY(-50%)",
          }}
        >
          {/* Arrow head */}
          <div
            style={{
              position: "absolute",
              right: -4,
              top: -3,
              width: 0,
              height: 0,
              borderLeft: `6px solid ${nodes[i + 1].color}`,
              borderTop: "3px solid transparent",
              borderBottom: "3px solid transparent",
              opacity: 0.8,
            }}
          />
        </div>
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.label}
          style={{
            position: "absolute",
            top: "50%",
            left: node.x,
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "var(--theme-bg-surface)",
              border: `1px solid ${node.color}`,
              opacity: 0.9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: node.color,
            }}
          >
            {node.icon}
          </div>
          <span
            style={{
              fontSize: 9,
              fontFamily: "var(--font-dm-mono, monospace)",
              color: "var(--theme-fg-muted)",
              textAlign: "center",
              maxWidth: 70,
              lineHeight: 1.3,
              letterSpacing: "0.03em",
            }}
          >
            {node.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── AI Brain Visual (inside Explainable AI card) ──────────────────────────
function BrainVisual({ accent = "var(--theme-brand)" }: { accent?: string }) {
  return (
    <div
      style={{
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 100,
        position: "relative",
      }}
    >
      {/* Glow rings */}
      {[60, 80, 100].map((size, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `1px solid ${accent}`,
            opacity: 0.35 - i * 0.1,
            animation: `pulse-ring ${1.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      {/* Core icon */}
      <div
        style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "var(--theme-bg-surface)",
          border: `1px solid ${accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 1,
        }}
      >
        <Brain size={22} color={accent} />
      </div>
    </div>
  );
}


// ── Category label chip ──────────────────────────────────────────────────────
function CategoryChip({ label }: { label: string }) {
  return (
    <span
      className="chip"
      style={{
        background: "var(--theme-brand-glow)",
        border: "1px solid var(--theme-brand)",
        color: "var(--theme-brand)",
        marginBottom: "0.75rem",
      }}
    >
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Features() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--theme-bg)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >
      {/* Dynamic ambient wash that reveals as you scroll into the features */}
      <motion.div 
        aria-hidden 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5 }}
        style={{
          background: `
            radial-gradient(circle at 10% 20%, var(--theme-brand-glow), transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(0, 198, 255, 0.05), transparent 40%)
          `
        }}
      />
      <div className="section-container relative z-10">

        {/* ── Section heading ─────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          style={{ marginBottom: "3rem" }}
        >
          <CategoryChip label="Why Segmento" />
          <h2
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "var(--theme-fg)",
              lineHeight: 1.15,
              marginTop: "0.5rem",
            }}
          >
            Built different.<br />
            <span style={{ color: "var(--theme-brand)" }}>By design.</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-mona-sans, sans-serif)",
            fontSize: "1.0625rem",
            color: "var(--theme-fg-subtle)",
            marginTop: "0.75rem",
            maxWidth: "32rem",
            lineHeight: 1.6,
          }}>
            We didn&apos;t bolt security on after. We started with it.
          </p>
        </motion.div>

        {/* ── Bento grid ─────────────────────────────────────────────── */}
        <div className="bento-grid">

          {/* ══ CARD 1 — 100% Client-Side (Resolve/Cobalt — largest tile) ══ */}
          <motion.div
            className="bento-col-4 md:row-span-2 group"
            {...fadeUp(0.08)}
          >
            <motion.div 
              className="double-bezel-shell h-full flex flex-col relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Internal Wash Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--product-resolve-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="bento-tile bento-tile-resolve h-full flex flex-col min-h-[300px] grow relative z-10">
                <Database size={22} style={{ color: "var(--product-resolve-accent)", marginBottom: "1rem" }} />
                <CategoryChip label="Architecture" />
                <h3 style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontSize: "1.4rem", fontWeight: 800,
                  color: "var(--theme-fg)", letterSpacing: "-0.02em",
                  marginBottom: "0.5rem", marginTop: "0.5rem",
                }}>
                  Your data never leaves your walls.
                </h3>
                <p style={{
                  fontFamily: "var(--font-mona-sans, sans-serif)",
                  fontSize: "0.9rem", color: "var(--theme-fg-subtle)", lineHeight: 1.65,
                }}>
                  Every scan, every classification, every redaction runs entirely on
                  your infrastructure. No raw data ever touches our servers.
                </p>
                <DataFlowDiagram />
              </div>
            </motion.div>
          </motion.div>

          {/* ══ CARD 2 — Explainable AI (Sense/Violet) ══ */}
          <motion.div
            className="bento-col-8 group"
            {...fadeUp(0.14)}
          >
            <motion.div 
              className="double-bezel-shell h-full flex flex-col relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Internal Wash Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--product-sense-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="bento-tile bento-tile-sense h-full flex flex-col min-h-[200px] grow relative z-10">
                <Brain size={22} style={{ color: "var(--product-sense-accent)", marginBottom: "1rem" }} />
                <CategoryChip label="AI" />
                <h3 style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontSize: "1.25rem", fontWeight: 800,
                  color: "var(--theme-fg)", letterSpacing: "-0.02em",
                  marginBottom: "0.5rem", marginTop: "0.5rem",
                }}>
                  AI that explains itself.
                </h3>
                <p style={{
                  fontFamily: "var(--font-mona-sans, sans-serif)",
                  fontSize: "0.875rem", color: "var(--theme-fg-subtle)", lineHeight: 1.6,
                }}>
                  No black boxes. Every classification comes with a clear reason your
                  team can trust, audit, and defend to regulators.
                </p>
                <BrainVisual accent="var(--product-sense-accent)" />
              </div>
            </motion.div>
          </motion.div>

          {/* ══ CARD 3 — Zero-Trust (Collect/Emerald) ══ */}
          <motion.div
            className="bento-col-4 group"
            {...fadeUp(0.2)}
          >
            <motion.div 
              className="double-bezel-shell h-full flex flex-col relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Internal Wash Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--product-collect-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="bento-tile bento-tile-collect h-full flex flex-col gap-2 min-h-[180px] grow relative z-10">
                <Shield size={22} style={{ color: "var(--product-collect-accent)", marginBottom: "0.5rem" }} />
                <CategoryChip label="Privacy" />
                <h3 style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontSize: "1.2rem", fontWeight: 800,
                  color: "var(--theme-fg)", letterSpacing: "-0.02em", marginTop: "0.25rem",
                }}>
                  Zero-trust by default.
                </h3>
                <p style={{
                  fontFamily: "var(--font-mona-sans, sans-serif)",
                  fontSize: "0.875rem", color: "var(--theme-fg-subtle)", lineHeight: 1.6,
                }}>
                  GDPR, HIPAA, and DPDP-ready from day one.
                  Your compliance posture, automated.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ══ CARD 4 — Enterprise Scale (Pulse/Amber) ══ */}
          <motion.div
            className="bento-col-4 group"
            {...fadeUp(0.26)}
          >
            <motion.div 
              className="double-bezel-shell h-full flex flex-col relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Internal Wash Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--product-pulse-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="bento-tile bento-tile-pulse h-full flex flex-col gap-2 min-h-[180px] grow relative z-10">
                <BarChart3 size={22} style={{ color: "var(--product-pulse-accent)", marginBottom: "0.5rem" }} />
                <CategoryChip label="Scale" />
                <h3 style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontSize: "1.2rem", fontWeight: 800,
                  color: "var(--theme-fg)", letterSpacing: "-0.02em", marginTop: "0.25rem",
                }}>
                  Built to scale with you.
                </h3>
                <p style={{
                  fontFamily: "var(--font-mona-sans, sans-serif)",
                  fontSize: "0.875rem", color: "var(--theme-fg-subtle)", lineHeight: 1.6,
                }}>
                  From 10 users to 10,000 — process millions of data events per second.
                  The architecture doesn’t flinch.
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Pulse ring keyframes for brain visual */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.12); opacity: 0.25; }
        }
      `}</style>
    </section>
  );
}