'use client'

import { motion } from 'framer-motion'
import { EyeOff, RefreshCw } from 'lucide-react'

// ── Step data — copy lives here, DOM mockups are inline ──────────────────────
const STEPS = [
  {
    step: '01',
    title: 'Connect',
    subtitle: 'Data source integrations.',
    description:
      'Ingest from any source — databases, APIs, cloud storage, or file uploads. Unified pipeline, zero manual wiring.',
    accent: '#06b6d4',
  },
  {
    step: '02',
    title: 'Detect',
    subtitle: 'AI scanning interface.',
    description:
      'Our 18-model AI engine scans every document and data stream for PII. Real-time, explainable, 99.8% accurate.',
    accent: '#8b5cf6',
  },
  {
    step: '03',
    title: 'Control',
    subtitle: 'Automation & policy dashboard.',
    description:
      'Define redaction rules, set compliance policies, and automate enforcement. Full audit trail for every action.',
    accent: '#5b6ef5',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden" style={{ padding: '6rem 0' }}>
      {/* Top / bottom dividers */}
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            [i === 0 ? 'top' : 'bottom']: 0,
            left: 0, right: 0, height: 1,
            background: 'var(--theme-border-subtle)',
          }}
        />
      ))}

      <div className="section-container">
        {/* ── Section header ── */}
        <motion.div
          className="text-center"
          style={{ marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="chip w-fit mx-auto" style={{ marginBottom: '1.25rem' }}>
            Process
          </div>
          <h2 className="text-headline-md" style={{ marginBottom: '0.75rem' }}>
            How it{' '}
            <span style={{ color: 'var(--theme-brand)' }}>Works</span>
          </h2>
          <p className="text-body-lg mx-auto" style={{ maxWidth: '32rem' }}>
            Three steps from raw data to full compliance. No professional services required.
          </p>
        </motion.div>

        {/* ── 3-column step grid ── */}
        <div className="bento-grid">
          {STEPS.map((s, i) => (
            <StepCard key={s.step} step={s} index={i} />
          ))}
        </div>

        {/* ── Connector line between cards (desktop only) ── */}
        <div
          aria-hidden
          className="hidden lg:block"
          style={{
            position: 'relative',
            marginTop: '-1px',
            height: 0,
          }}
        />
      </div>
    </section>
  )
}

// ── StepCard — one step with text + DOM mockup ────────────────────────────────
function StepCard({ step: s, index }: { step: typeof STEPS[0]; index: number }) {
  return (
    <motion.div
      className="bento-col-4 bento-tile flex flex-col gap-5"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Step number + accent dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          className="text-label-caps"
          style={{
            color: s.accent,
            fontSize: 11,
            letterSpacing: '0.1em',
          }}
        >
          STEP {s.step}
        </span>
        <div
          style={{
            flex: 1, height: 1,
            background: `linear-gradient(90deg, ${s.accent}40, transparent)`,
          }}
        />
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-headline-sm" style={{ marginBottom: '0.5rem' }}>
          {s.title}
        </h3>
        <p
          className="text-label-caps"
          style={{ color: s.accent, marginBottom: '0.75rem', letterSpacing: '0.05em' }}
        >
          {s.subtitle}
        </p>
        <p className="text-body-md">{s.description}</p>
      </div>

      {/* DOM mockup — routes to the correct mini UI */}
      <div style={{ marginTop: 'auto' }}>
        {s.step === '01' && <ConnectMockup accent={s.accent} />}
        {s.step === '02' && <DetectMockup accent={s.accent} />}
        {s.step === '03' && <ControlMockup accent={s.accent} />}
      </div>
    </motion.div>
  )
}

// ── STEP 1 — Connect: source nodes → animated lines → central hub ─────────────
function ConnectMockup({ accent }: { accent: string }) {
  const sources = [
    { label: '🗄 SQL DB',   top: '10%' },
    { label: '☁️ S3 Bucket', top: '38%' },
    { label: '📡 REST API', top: '66%' },
  ]
  return (
    <div
      className="bento-tile-inner"
      style={{ position: 'relative', height: 130, overflow: 'hidden' }}
    >
      {/* Source nodes */}
      <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        {sources.map((src) => (
          <div
            key={src.label}
            style={{
              padding: '4px 8px', borderRadius: 5,
              background: 'var(--theme-bg)',
              border: '1px solid var(--theme-border)',
              fontSize: 9, color: 'var(--theme-fg-subtle)',
              fontFamily: 'monospace', whiteSpace: 'nowrap',
            }}
          >
            {src.label}
          </div>
        ))}
      </div>

      {/* Animated connector lines */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        {[22, 50, 78].map((y, i) => (
          <g key={i}>
            <line x1="95" y1={`${y}%`} x2="62%" y2="50%" stroke={`${accent}30`} strokeWidth="1" strokeDasharray="3 3" />
            {/* Animated dot travelling along the line */}
            <motion.circle
              r="2.5" fill={accent}
              animate={{
                cx: ['95', '62%'],
                cy: [`${y}%`, '50%'],
              }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.45, ease: 'easeInOut' }}
            />
          </g>
        ))}
      </svg>

      {/* Central hub */}
      <div
        style={{
          position: 'absolute', left: '62%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: `${accent}18`,
          border: `1px solid ${accent}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}>
          <RefreshCw size={14} color={accent} />
        </motion.div>
      </div>

      {/* Output arrow + destination */}
      <div
        style={{
          position: 'absolute', right: 0, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        <div style={{ width: 20, height: 1, background: `${accent}50` }} />
        <div
          style={{
            padding: '4px 7px', borderRadius: 5,
            background: `${accent}14`,
            border: `1px solid ${accent}40`,
            fontSize: 9, color: accent,
            fontFamily: 'monospace', whiteSpace: 'nowrap',
          }}
        >
          🎯 Unified
        </div>
      </div>

      {/* Live badge */}
      <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10e898', display: 'inline-block' }} className="animate-pulse" />
        <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 600, color: '#10e898' }}>LIVE</span>
      </div>
    </div>
  )
}

// ── STEP 2 — Detect: document with scanning line + PII chips ──────────────────
function DetectMockup({ accent }: { accent: string }) {
  const rows: Array<{ label?: string; chips?: string[]; barWidth?: number }> = [
    { label: 'Name',    chips: ['NAME', 'SURNAME'] },
    { label: 'Email',   chips: ['EMAIL'] },
    { label: 'Address', chips: ['STREET', 'CITY'] },
    { barWidth: 85 },
    { barWidth: 60 },
  ]
  return (
    <div
      className="bento-tile-inner"
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 5 }}
    >
      {/* Scanner sweep line */}
      <div className="scanner-line" style={{ '--scanner-color': accent } as React.CSSProperties} />

      {/* Doc title bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 9 }}>📄</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--theme-fg)', fontFamily: 'monospace' }}>
            report.pdf
          </span>
        </div>
        <EyeOff size={10} color={accent} />
      </div>

      {/* Document rows */}
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          {row.label && (
            <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'var(--theme-fg-muted)', minWidth: 42 }}>
              {row.label}:
            </span>
          )}
          {row.chips?.map((chip) => (
            <span key={chip} className="chip-redacted">
              <EyeOff size={7} />{chip}
            </span>
          ))}
          {row.barWidth && (
            <div
              style={{
                height: 6, width: `${row.barWidth}%`, borderRadius: 2,
                background: 'var(--theme-border)',
              }}
            />
          )}
        </div>
      ))}

      {/* Confidence strip */}
      <div
        style={{
          marginTop: 4, padding: '4px 8px', borderRadius: 5,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: `${accent}0e`, border: `1px solid ${accent}25`,
        }}
      >
        <span style={{ fontSize: 8, color: accent, fontFamily: 'monospace', fontWeight: 600 }}>
          AI Confidence
        </span>
        <span style={{ fontSize: 9, color: '#10e898', fontFamily: 'monospace', fontWeight: 700 }}>
          99.8%
        </span>
      </div>
    </div>
  )
}

// ── STEP 3 — Control: policy rules dashboard with toggles ─────────────────────
const POLICIES = [
  { label: 'Auto-redact PII on ingest',      enabled: true  },
  { label: 'Flag low-confidence detections', enabled: true  },
  { label: 'DPDP compliance mode',           enabled: true  },
  { label: 'Export audit logs to SIEM',      enabled: false },
]

function ControlMockup({ accent }: { accent: string }) {
  return (
    <div
      className="bento-tile-inner"
      style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--theme-fg)', fontFamily: 'monospace' }}>
          Policy Rules
        </span>
        <span
          style={{
            fontSize: 8, padding: '2px 7px', borderRadius: 999,
            background: `${accent}14`, color: accent,
            fontFamily: 'monospace', fontWeight: 600,
          }}
        >
          4 Active
        </span>
      </div>

      {/* Policy toggle rows */}
      {POLICIES.map((p) => (
        <div
          key={p.label}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 8, padding: '5px 8px', borderRadius: 5,
            background: 'var(--theme-bg)',
            border: `1px solid ${p.enabled ? `${accent}30` : 'var(--theme-border-subtle)'}`,
          }}
        >
          <span style={{ fontSize: 8.5, color: p.enabled ? 'var(--theme-fg)' : 'var(--theme-fg-muted)', fontFamily: 'system-ui', flex: 1 }}>
            {p.label}
          </span>
          {/* Toggle pill */}
          <div
            style={{
              width: 26, height: 14, borderRadius: 999, flexShrink: 0,
              background: p.enabled ? accent : 'var(--theme-border)',
              position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                position: 'absolute', top: 2,
                left: p.enabled ? 14 : 2,
                width: 10, height: 10, borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </div>
        </div>
      ))}

      {/* Audit log strip */}
      <div
        style={{
          marginTop: 2, padding: '4px 8px', borderRadius: 5,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(16,232,152,0.06)',
          border: '1px solid rgba(16,232,152,0.2)',
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10e898', display: 'inline-block', flexShrink: 0 }} className="animate-pulse" />
        <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#10e898', fontWeight: 600 }}>
          Full audit trail active — 1,284 events logged
        </span>
      </div>
    </div>
  )
}
