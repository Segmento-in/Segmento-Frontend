"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Stats Marquee Strip
// Design target: Dark separator strip between Hero and Feature cards.
// Left half: scrolling stats ticker (50+ PII Types, 100% Client-Side, etc.)
// Pure CSS marquee — no external library.
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "50+", label: "PII Types Detected" },
  { value: "100%", label: "Client-Side" },
  { value: "99.9%", label: "Accuracy" },
  { value: "0ms", label: "Cloud Egress" },
  { value: "400+", label: "Formats Supported" },
  { value: "GDPR", label: "Compliant" },
  { value: "HIPAA", label: "Ready" },
  { value: "DPDP", label: "Certified" },
  { value: "Real-Time", label: "Redaction" },
  { value: "18", label: "AI Models" },
];

// Separator glyph between items
function Dot() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "var(--theme-brand, rgba(124,58,237,0.5))",
        flexShrink: 0,
        margin: "0 32px",
        verticalAlign: "middle",
      }}
    />
  );
}

export default function StatsTicker() {
  return (
    <div
      style={{
        background: "var(--theme-bg-surface)",
        borderTop: "1px solid var(--theme-border)",
        borderBottom: "1px solid var(--theme-border)",
        overflow: "hidden",
        padding: "22px 0",
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Edge fade-out lens */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, var(--theme-bg-surface) 0%, transparent 8%, transparent 92%, var(--theme-bg-surface) 100%)",
        }}
      />

      {/* Marquee track — duplicated for seamless loop */}
      <div
        className="marquee-track"
        style={{ display: "flex", alignItems: "center", gap: 0 }}
      >
        {[...Array(2)].map((_, pass) => (
          <div
            key={pass}
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            {STATS.map((stat, i) => (
              <span
                key={`${pass}-${i}`}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                {/* Stat item */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 8,
                    padding: "0 6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-dm-mono, monospace)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--theme-brand, #7c3aed)",
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mona-sans, sans-serif)",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "var(--theme-fg-subtle, #374151)",
                      letterSpacing: "0.01em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stat.label}
                  </span>
                </span>
                <Dot />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}