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
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// ── Mini Data-Flow Diagram (inside the large card) ──────────────────────────
function DataFlowDiagram() {
  const nodes = [
    { label: "Data", icon: <Database size={14} />, x: "10%", color: "#5b6ef5" },
    { label: "Secure local processes", icon: <Lock size={14} />, x: "45%", color: "#10e898" },
    { label: "Secure local environment", icon: <Cloud size={14} />, x: "78%", color: "#a0dcfd" },
  ];

  return (
    <div
      style={{
        marginTop: "1.5rem",
        position: "relative",
        height: 120,
        background: "rgba(10,10,15,0.7)",
        borderRadius: 10,
        border: "1px solid rgba(91,110,245,0.15)",
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
            "linear-gradient(rgba(91,110,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(91,110,245,0.04) 1px, transparent 1px)",
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
            background: "linear-gradient(90deg, rgba(91,110,245,0.5), rgba(16,232,152,0.5))",
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
              borderLeft: "6px solid rgba(16,232,152,0.7)",
              borderTop: "3px solid transparent",
              borderBottom: "3px solid transparent",
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
              background: `${node.color}18`,
              border: `1px solid ${node.color}40`,
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
              color: "rgba(160,160,181,0.8)",
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

// ── AI Brain Visual (inside Explainable AI card) ─────────────────────────────
function BrainVisual() {
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
            border: `1px solid rgba(91,110,245,${0.35 - i * 0.1})`,
            animation: `pulse-ring ${1.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      {/* Core icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(91,110,245,0.18)",
          border: "1px solid rgba(91,110,245,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Brain size={22} color="#5b6ef5" />
      </div>
    </div>
  );
}

// ── Small card icon badge ────────────────────────────────────────────────────
function IconBadge({ icon, color = "#5b6ef5" }: { icon: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        marginBottom: "1rem",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
  );
}

// ── Category label chip ──────────────────────────────────────────────────────
function CategoryChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: 9999,
        background: "rgba(91,110,245,0.1)",
        border: "1px solid rgba(91,110,245,0.2)",
        fontFamily: "var(--font-dm-mono, monospace)",
        fontSize: "0.6875rem",
        fontWeight: 600,
        color: "#5b6ef5",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
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
      style={{
        background: "var(--theme-bg)",
        paddingTop: "5rem",
        paddingBottom: "5rem",
      }}
    >
      <div className="section-container">

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
            Enterprise-grade privacy,<br />
            <span style={{ color: "var(--theme-brand)" }}>without leaving your perimeter.</span>
          </h2>
        </motion.div>

        {/* ── Bento grid ─────────────────────────────────────────────── */}
        <div className="bento-grid">

          {/* ══ CARD 1 — Large: 100% Client-Side Processing (4 cols, 2 rows) ══ */}
          <motion.div
            className="bento-col-4 bento-tile md:row-span-2"
            {...fadeUp(0.08)}
            style={{ display: "flex", flexDirection: "column", minHeight: 280 }}
          >
            <IconBadge icon={<Database size={18} />} color="#5b6ef5" />
            <h3
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--theme-fg)",
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              100% Client-Side Processing
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mona-sans, sans-serif)",
                fontSize: "0.9375rem",
                color: "var(--theme-fg-subtle)",
                lineHeight: 1.6,
                maxWidth: "36rem",
              }}
            >
              Data never leaves your perimeter. Process everything on-prem or in
              your private cloud with zero cloud egress.
            </p>
            <DataFlowDiagram />
          </motion.div>

          {/* ══ CARD 2 — Explainable AI (8 cols) ══ */}
          <motion.div
            className="bento-col-8 bento-tile"
            {...fadeUp(0.14)}
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: 280,
            }}
          >
            <IconBadge icon={<Brain size={18} />} color="#a0dcfd" />
            <h3
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--theme-fg)",
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              Explainable AI
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mona-sans, sans-serif)",
                fontSize: "0.875rem",
                color: "var(--theme-fg-subtle)",
                lineHeight: 1.6,
              }}
            >
              Audit trails for every detection. Know the why behind each decision.
            </p>
            <BrainVisual />
          </motion.div>

          {/* ══ CARD 3 — Zero-Trust Security (4 cols) ══ */}
          <motion.div
            className="bento-col-4 bento-tile"
            {...fadeUp(0.2)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              minHeight: 180,
            }}
          >
            <IconBadge icon={<Shield size={18} />} color="#10e898" />
            <h3
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--theme-fg)",
                letterSpacing: "-0.02em",
              }}
            >
              Zero-Trust Security
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mona-sans, sans-serif)",
                fontSize: "0.875rem",
                color: "var(--theme-fg-subtle)",
                lineHeight: 1.6,
              }}
            >
              Enterprise sentry architecture and zero-trust security for your entire
              data environment. GDPR, HIPAA, SOC2 ready from day one.
            </p>
          </motion.div>

          {/* ══ CARD 4 — Enterprise Scale (4 cols) ══ */}
          <motion.div
            className="bento-col-4 bento-tile"
            {...fadeUp(0.26)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              minHeight: 180,
            }}
          >
            <IconBadge icon={<BarChart3 size={18} />} color="#f59e0b" />
            <h3
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--theme-fg)",
                letterSpacing: "-0.02em",
              }}
            >
              Enterprise Scale
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mona-sans, sans-serif)",
                fontSize: "0.875rem",
                color: "var(--theme-fg-subtle)",
                lineHeight: 1.6,
              }}
            >
              Enterprise scale inits and zero-trust environment. Designed to process
              millions of data points per second with consistent performance.
            </p>
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