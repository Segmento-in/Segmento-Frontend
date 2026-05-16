'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle2, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'

// The mockup is drawn at this fixed internal size.
// We scale it down with CSS transform to fit any container width.
const DESIGN_W = 600
const DESIGN_H = 400

// Reusable fade-up variant for staggered entrance animations
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // ResizeObserver: keep mockup scale in sync with its container width.
  // The mockup is fixed at DESIGN_W px; we scale it down to always fit.
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      setScale(Math.min(el.offsetWidth / DESIGN_W, 1))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '5rem' }}
    >
      {/* Subtle background glow — does not distract, adds depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 72% 30%, rgba(91,110,245,0.09), transparent),' +
            'radial-gradient(ellipse 40% 30% at 15% 80%, rgba(160,220,253,0.04), transparent)',
        }}
      />

      <div className="section-container w-full relative z-10">
        {/* 12-column bento grid — 5 cols text / 7 cols mockup */}
        <div className="bento-grid items-center">

          {/* ══════════════ LEFT — Text + CTAs (6 / 12) ══════════════ */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-7">

            {/* Eyebrow chip */}
            <motion.div {...fadeUp(0.05)}>
              <div className="chip border-ai w-fit">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--theme-success)' }}
                />
                AI-Native · GDPR · DPDP Ready
              </div>
            </motion.div>

            {/* H1 — Syne 800 per DESIGN.md display-lg */}
            <motion.h1 className="text-display-lg" {...fadeUp(0.12)}>
              The complete data<br />
              intelligence platform.<br />
              <span style={{ color: 'var(--theme-brand)' }}>
                Built for what&apos;s next.
              </span>
            </motion.h1>

            {/* Subtext — Mona Sans body-lg */}
            <motion.p className="text-body-lg" style={{ maxWidth: '28rem' }} {...fadeUp(0.2)}>
              AI-native PII detection, regulatory automation, and zero-trust
              security for modern enterprises. No data leaves your environment.
            </motion.p>

            {/* CTA pills */}
            <motion.div className="flex flex-wrap gap-3" {...fadeUp(0.28)}>
              <Link href="/contact" className="btn-primary">
                Book a Demo <ArrowRight size={15} />
              </Link>
            </motion.div>

            {/* Compliance trust badges */}
            <motion.div className="flex flex-wrap gap-2 pt-1" {...fadeUp(0.36)}>
              {(['GDPR · Ready', 'HIPAA · Compliant', 'DPDP · Certified'] as const).map((b) => (
                <span key={b} className="chip">
                  <CheckCircle2 size={10} style={{ color: 'var(--theme-success)', flexShrink: 0 }} />
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ══════════════ RIGHT — AppShell Mockup (6 / 12) ══════════════ */}
          <motion.div
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/*
              Scale wrapper pattern:
              - wrapperRef div measures the real available width
              - Its height is locked to scaled mockup height (so no layout gap)
              - Inner div is fixed at DESIGN_W × DESIGN_H, then CSS-scaled to fit
            */}
            <div
              ref={wrapperRef}
              className="w-full overflow-hidden"
              style={{ height: `${DESIGN_H * scale}px` }}
            >
              <div
                style={{
                  width: DESIGN_W,
                  height: DESIGN_H,
                  transformOrigin: 'top left',
                  transform: `scale(${scale})`,
                }}
              >
                <AppShellMockup />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APPSHELL MOCKUP — 100% pure HTML + inline styles. Zero static images.
// Structure: [Browser Chrome] / [Sidebar | Document Pane]
// ─────────────────────────────────────────────────────────────────────────────
function AppShellMockup() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        borderRadius: '10px',
        border: '1px solid var(--theme-border)',
        background: 'var(--theme-bg-surface)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(91,110,245,0.12)',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <BrowserChrome />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AppSidebar />
        <DocumentPane />
      </div>
    </div>
  )
}

// Browser chrome: traffic lights + fake URL bar
function BrowserChrome() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: 'var(--theme-bg-surface-high)',
      borderBottom: '1px solid var(--theme-border-subtle)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
      </div>
      <div style={{
        flex: 1, margin: '0 12px',
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 5,
        background: 'var(--theme-bg)',
        border: '1px solid var(--theme-border-subtle)',
      }}>
        <Lock size={8} color="var(--theme-fg-muted)" />
        <span style={{ fontSize: 10, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>
          app.segmento.in/sense
        </span>
      </div>
    </div>
  )
}

// Left sidebar: Segmento logo + nav items
function AppSidebar() {
  const items = [
    { emoji: '📊', label: 'Dashboard' },
    { emoji: '🛡', label: 'Solutions', active: true },
    { emoji: '📁', label: 'Resources' },
    { emoji: '⚙️', label: 'Settings' },
    { emoji: '🤖', label: 'Automation' },
  ]
  return (
    <div style={{
      width: 110, flexShrink: 0,
      background: '#0d0d14',
      borderRight: '1px solid var(--theme-border-subtle)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo row */}
      <div style={{
        padding: '10px 10px', display: 'flex', alignItems: 'center', gap: 6,
        borderBottom: '1px solid var(--theme-border-subtle)',
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 4, background: '#5b6ef5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, color: '#fff', fontWeight: 700,
        }}>S</div>
        <span style={{ fontSize: 9, fontWeight: 600, color: '#f0f0f5', letterSpacing: '0.04em' }}>
          Segmento
        </span>
      </div>
      {/* Nav items */}
      <nav style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 6px', borderRadius: 5,
            background: item.active ? 'rgba(91,110,245,0.18)' : 'transparent',
            cursor: 'default',
          }}>
            <span style={{ fontSize: 10 }}>{item.emoji}</span>
            <span style={{
              fontSize: 9, fontWeight: item.active ? 600 : 400,
              color: item.active ? '#5b6ef5' : '#6b6b82',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  )
}

// Main document pane with PII redaction chips
function DocumentPane() {
  return (
    <div style={{ flex: 1, background: '#f6f8ff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Pane header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 14px',
        background: '#ffffff', borderBottom: '1px solid #e2e4ef',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 18, height: 22, borderRadius: 3,
            background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8,
          }}>📄</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1b1b20' }}>
            Q3 Financial Report.pdf
          </span>
        </div>
        <ScannedBadge />
      </div>

      {/* Document body */}
      <div style={{ flex: 1, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
        {/* Animated PII scanner line */}
        <div className="scanner-line" />

        {/* Doc header */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 8, fontWeight: 600, color: '#9090a0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
            CONFIDENTIAL — INTERNAL USE ONLY
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1b1b20' }}>Q3 Financial Report</div>
        </div>

        {/* Fields with PII chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <FieldRow label="Name">
            <PIIChip tag="NAME" /> <PIIChip tag="SURNAME" />
          </FieldRow>
          <FieldRow label="DOB">
            <PIIChip tag="DATE" />
          </FieldRow>
          <FieldRow label="Address">
            <PIIChip tag="STREET" /> <PIIChip tag="CITY" />
          </FieldRow>
          <FieldRow label="Email">
            <PIIChip tag="EMAIL" />
          </FieldRow>
        </div>

        {/* Paragraph lines with inline redactions */}
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <InlineLine blocks={[50, 'PII', 60]} />
          <InlineLine blocks={[40, 'DNI', 35, 'EMAIL', 30]} />
          <InlineLine blocks={[85]} />
          <InlineLine blocks={[30, 'ACCOUNT', 55]} />
        </div>

        {/* AI confidence strip */}
        <div style={{
          position: 'absolute', bottom: 10, left: 14, right: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', borderRadius: 8,
          background: 'rgba(91,110,245,0.06)',
          border: '1px solid rgba(91,110,245,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#10e898',
              display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: '#5b6ef5', fontFamily: 'monospace' }}>
              18 AI Models · Self-Hosted
            </span>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#10e898', fontFamily: 'monospace' }}>
            99.8% Confidence
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Atoms ──────────────────────────────────────────────────────────────────

function ScannedBadge() {
  return (
    <div style={{
      padding: '2px 8px', borderRadius: 999, fontSize: 8, fontWeight: 600,
      background: 'rgba(16,232,152,0.1)', border: '1px solid rgba(16,232,152,0.25)',
      color: '#10e898', fontFamily: 'monospace',
    }}>✓ Scanned</div>
  )
}

// A PII redaction chip — green, matches blueprint exactly
function PIIChip({ tag }: { tag: string }) {
  return (
    <span className="chip-redacted">
      <EyeOff size={7} />
      {tag}
    </span>
  )
}

// A key-value document row with a label and PII chip children
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        fontSize: 9, fontWeight: 600, color: '#9090a0', fontFamily: 'monospace',
        minWidth: 46,
      }}>
        {label}:
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{children}</div>
    </div>
  )
}

// A filler line with alternating text blocks and PII chips
// blocks: number = grey bar width (%), string = PII chip tag
function InlineLine({ blocks }: { blocks: (number | string)[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {blocks.map((b, i) =>
        typeof b === 'number' ? (
          // Grey filler text bar
          <div
            key={i}
            style={{
              height: 7, width: `${b}px`, borderRadius: 2,
              background: 'rgba(100,100,120,0.15)',
            }}
          />
        ) : (
          <PIIChip key={i} tag={b} />
        )
      )}
    </div>
  )
}