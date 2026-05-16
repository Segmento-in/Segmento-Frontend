'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Activity, Clock, EyeOff, Database, RefreshCw, Ticket, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

// Maps a design span (4 / 8 / 12) → Tailwind responsive col-span classes.
// Mobile: always full width (col-span-12 on a 1-col grid = full width).
// Desktop (lg): restores the intended asymmetric span.
function getColClass(span: number): string {
  const map: Record<number, string> = {
    4:  'col-span-12 lg:col-span-4',
    8:  'col-span-12 lg:col-span-8',
    12: 'col-span-12',
  }
  return map[span] ?? 'col-span-12'
}

// ── Product data — keeps all copy in one place ──────────────────────────────
const PRODUCTS = [
  {
    id: 'pulse',
    name: 'Segmento Pulse',
    headline: 'Real-Time News & Intelligence Engine',
    description:
      'Harness global data intelligence with emerging headlines and real-time trend tracking. Built for data privacy professionals.',
    link: '/pulse',
    accent: '#3b82f6',       // blue
    glow: 'rgba(59,130,246,0.15)',
    tags: ['GDPR', 'DPDP'],
    // Bento col span (Tailwind native — bento-grid has 12 cols)
    span: 8,
  },
  {
    id: 'sense',
    name: 'Segmento Sense',
    headline: 'AI Classification & Redaction',
    description:
      'Automated PII detection and obfuscation. Explainable AI with 99.8% confidence. Fully client-side.',
    link: '/products/data-classification',
    accent: '#8b5cf6',       // violet
    glow: 'rgba(139,92,246,0.15)',
    tags: ['GDPR', 'DPDP'],
    span: 4,
  },
  {
    id: 'collect',
    name: 'Segmento Collect',
    headline: 'Universal Data Pipeline',
    description:
      'Securely ingest from any source to any destination. Built-in 24-hour recovery window.',
    link: 'https://segmento-collect.onrender.com',
    accent: '#06b6d4',       // cyan
    glow: 'rgba(6,182,212,0.15)',
    tags: ['GDPR', 'DPDP'],
    span: 4,
  },
  {
    id: 'resolve',
    name: 'Segmento Resolve',
    headline: 'DSAR Kanban Board',
    description:
      'Manage and fulfil data subject requests efficiently. Real-time cursors. 98% SLA.',
    link: 'https://ticket-management-frontend-tau.vercel.app/',
    accent: '#10b981',       // emerald
    glow: 'rgba(16,185,129,0.15)',
    tags: ['GDPR', 'DPDP'],
    span: 8,
  },
  {
    id: 'sprintql',
    name: 'Segmento SprintQL',
    headline: 'Collaborative Retrospectives',
    description:
      'Multiplayer retrospective board with real-time cursors. Capture feedback, collaborate live, and turn ideas into clear action items.',
    link: 'https://segmento-retro-omega.vercel.app/',
    accent: '#a855f7',       // purple
    glow: 'rgba(168,85,247,0.15)',
    tags: ['GDPR', 'DPDP'],
    span: 12,
  },
]

export default function ProductShowcase() {
  return (
    <section id="ProductShowcase" className="relative overflow-hidden" style={{ padding: '6rem 0' }}>
      {/* Top divider */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--theme-border-subtle)' }} />

      <div className="section-container">
        {/* Section header */}
        <motion.div
          className="text-center"
          style={{ marginBottom: '4rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="chip w-fit mx-auto" style={{ marginBottom: '1.25rem' }}>Platform</div>
          <h2 className="text-headline-md" style={{ marginBottom: '0.75rem' }}>
            Five products.{' '}
            <span style={{ color: 'var(--theme-brand)' }}>One platform.</span>
          </h2>
          <p className="text-body-lg mx-auto" style={{ maxWidth: '36rem' }}>
            Every tool in the Segmento suite is built around a single principle:
            your data stays yours.
          </p>
        </motion.div>

        {/* ── Bento grid: 12 columns ── */}
        <div className="bento-grid">
          {PRODUCTS.map((p, i) => (
            <BentoCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── BentoCard — renders one product tile at its configured col-span ─────────
function BentoCard({ product: p, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const isWide = p.span >= 8   // col-8 and col-12 get side-by-side on desktop
  const isFull = p.span === 12

  return (
    <motion.div
      /**
       * Grid span: Tailwind responsive classes only — NO inline gridColumn.
       * Mobile  → col-span-12 (full width, 1-column grid from bento-grid CSS)
       * Desktop → lg:col-span-4 / 8 / 12 (restores asymmetric layout)
       *
       * Flex direction:
       * Mobile  → flex-col (text on top, preview below — always visible)
       * Desktop → lg:flex-row for wide cards, flex-col for narrow
       */
      className={`bento-tile flex flex-col gap-5 relative overflow-hidden ${
        getColClass(p.span)
      } ${
        isWide ? 'lg:flex-row lg:items-center lg:gap-8' : ''
      }`}
      style={{ minHeight: isFull ? 260 : isWide ? 220 : 300 }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle accent glow — decorative, pointer-events off */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: p.glow, filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Text side ── */}
      <div
        className="relative z-10"
        style={{ flex: isFull ? '0 0 40%' : isWide ? '0 0 45%' : undefined }}
      >
        {/* Product name chip + compliance chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
          <span
            className="text-label-caps"
            style={{
              padding: '3px 10px', borderRadius: 999,
              border: `1px solid ${p.accent}`,
              color: p.accent, fontSize: 10,
              background: `${p.accent}14`,
            }}
          >
            {p.name}
          </span>
          {p.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        {/* Headline — Syne */}
        <h3 className="text-headline-sm" style={{ marginBottom: '0.75rem' }}>{p.headline}</h3>

        {/* Description — Mona Sans */}
        <p className="text-body-md" style={{ marginBottom: '1.25rem', maxWidth: '26rem' }}>
          {p.description}
        </p>

        {/* CTA pill */}
        <Link
          href={p.link}
          className="btn-secondary"
          style={{ fontSize: 13, padding: '0.5rem 1.25rem' }}
        >
          Explore <ArrowRight size={13} />
        </Link>
      </div>

      {/* ── Preview side ──
          Always visible. On mobile: full-width below text.
          PreviewScaler ensures the preview shrinks gracefully on small screens
          instead of overflowing — same ResizeObserver pattern as Hero mockup.
      */}
      <div className="flex-1 min-w-0 relative z-10">
        <PreviewRouter id={p.id} accent={p.accent} wide={isWide} />
      </div>
    </motion.div>
  )
}

// ── Routes to the correct inline UI preview ──────────────────────────────────
function PreviewRouter({ id, accent, wide }: { id: string; accent: string; wide: boolean }) {
  switch (id) {
    case 'pulse':    return <PulsePreview accent={accent} />
    case 'sense':    return <SensePreview accent={accent} />
    case 'collect':  return <CollectPreview accent={accent} />
    case 'resolve':  return <ResolvePreview accent={accent} />
    case 'sprintql': return <SprintQLPreview accent={accent} wide={wide} />
    default:         return null
  }
}

// ── PULSE: live news feed ─────────────────────────────────────────────────────
const NEWS_ITEMS = [
  { tag: 'Privacy', title: 'EU Parliament updates Data Act enforcement rules', time: '2m ago' },
  { tag: 'Global',  title: 'Emerging tech trends shifting in APAC markets',   time: '5m ago' },
  { tag: 'Tech',    title: 'New encryption standards detected in enterprise',  time: '12m ago' },
]

function PulsePreview({ accent }: { accent: string }) {
  return (
    <div className="bento-tile-inner" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, display: 'inline-block' }} className="animate-pulse" />
        <span className="text-label-caps" style={{ color: accent }}>Live Intelligence</span>
      </div>
      {NEWS_ITEMS.map((n) => (
        <div
          key={n.tag}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 8px', borderRadius: 6,
            background: 'var(--theme-bg)',
            border: '1px solid var(--theme-border-subtle)',
          }}
        >
          <span
            style={{
              padding: '1px 6px', borderRadius: 999, fontSize: 8, fontWeight: 700,
              background: `${accent}18`, color: accent, fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
          >
            {n.tag}
          </span>
          <span style={{ flex: 1, fontSize: 10, fontWeight: 500, color: 'var(--theme-fg-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {n.title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <Clock size={8} color="var(--theme-fg-muted)" />
            <span style={{ fontSize: 8, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>{n.time}</span>
          </div>
        </div>
      ))}
      {/* Mini activity bar */}
      <div style={{ marginTop: 4, height: 28, background: 'var(--theme-bg)', borderRadius: 6, border: '1px solid var(--theme-border-subtle)', display: 'flex', alignItems: 'flex-end', padding: '4px 6px', gap: 2, overflow: 'hidden' }}>
        <Activity size={10} color={accent} style={{ flexShrink: 0, marginRight: 4 }} />
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            style={{ flex: 1, background: `${accent}50`, borderRadius: 1 }}
            animate={{ height: [4, 14, 6, 18, 4] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.08 }}
          />
        ))}
      </div>
    </div>
  )
}

// ── SENSE: PII scanner output ─────────────────────────────────────────────────
function SensePreview({ accent }: { accent: string }) {
  return (
    <div className="bento-tile-inner" style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
      <div className="scanner-line" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <EyeOff size={11} color={accent} />
        <span className="text-label-caps" style={{ color: accent }}>PII Scanner Active</span>
      </div>
      {/* Redacted lines */}
      {[['Name', 'NAME', 'SURNAME'], ['Email', 'EMAIL'], ['Address', 'STREET']].map(([label, ...tags]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--theme-fg-muted)', fontFamily: 'monospace', minWidth: 40 }}>{label}:</span>
          {tags.map((t) => (
            <span key={t} className="chip-redacted"><EyeOff size={7} />{t}</span>
          ))}
        </div>
      ))}
      <div style={{ marginTop: 4, padding: '5px 8px', borderRadius: 6, background: `${accent}0e`, border: `1px solid ${accent}25`, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: accent, fontFamily: 'monospace', fontWeight: 600 }}>AI Confidence</span>
        <span style={{ fontSize: 9, color: '#10e898', fontFamily: 'monospace', fontWeight: 700 }}>99.8%</span>
      </div>
    </div>
  )
}

// ── COLLECT: pipeline flow ────────────────────────────────────────────────────
function CollectPreview({ accent }: { accent: string }) {
  const sources = ['📊 CSV', '🗄 SQL', '☁️ S3']
  return (
    <div className="bento-tile-inner" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Database size={11} color={accent} />
          <span className="text-label-caps" style={{ color: accent }}>Pipeline Status</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, fontWeight: 700, color: '#10e898', fontFamily: 'monospace' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10e898', display: 'inline-block' }} />
          LIVE
        </span>
      </div>
      {/* Source → Collector → Dest */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sources.map((s) => (
            <div key={s} style={{ padding: '3px 7px', borderRadius: 4, background: 'var(--theme-bg)', border: '1px solid var(--theme-border-subtle)', fontSize: 8, color: 'var(--theme-fg-subtle)', whiteSpace: 'nowrap' }}>
              {s}
            </div>
          ))}
        </div>
        {/* Animated connector line */}
        <div style={{ flex: 1, height: 1, borderTop: `1px dashed ${accent}50`, position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{ position: 'absolute', top: -2, width: 8, height: 5, borderRadius: 2, background: accent }}
            animate={{ left: ['-10%', '110%'] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          />
        </div>
        {/* Collector hub */}
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${accent}18`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}>
            <RefreshCw size={12} color={accent} />
          </motion.div>
        </div>
        {/* Animated out line */}
        <div style={{ flex: 1, height: 1, borderTop: `1px dashed ${accent}50`, position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{ position: 'absolute', top: -2, width: 8, height: 5, borderRadius: 2, background: accent }}
            animate={{ left: ['-10%', '110%'] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear', delay: 0.7 }}
          />
        </div>
        <div style={{ padding: '3px 7px', borderRadius: 4, background: 'var(--theme-bg)', border: '1px solid var(--theme-border-subtle)', fontSize: 8, color: 'var(--theme-fg-subtle)', whiteSpace: 'nowrap' }}>
          🎯 Dest
        </div>
      </div>
      <div style={{ fontSize: 8, fontFamily: 'monospace', color: accent, fontWeight: 600 }}>24h Recovery Window Active</div>
    </div>
  )
}

// ── RESOLVE: ticket board ─────────────────────────────────────────────────────
function ResolvePreview({ accent }: { accent: string }) {
  const tickets = [
    { id: '#721', status: 'Resolved',     priority: 'High',   statusColor: '#10e898' },
    { id: '#724', status: 'In Progress',  priority: 'High',   statusColor: '#f59e0b' },
    { id: '#728', status: 'In Progress',  priority: 'Medium', statusColor: '#f59e0b' },
  ]
  return (
    <div className="bento-tile-inner" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Ticket size={11} color={accent} />
          <span className="text-label-caps" style={{ color: accent }}>DSAR Requests</span>
        </div>
        <span style={{ fontSize: 8, color: '#10e898', fontFamily: 'monospace', fontWeight: 700 }}>98% SLA</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {tickets.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 8px', borderRadius: 5,
              background: 'var(--theme-bg)',
              border: '1px solid var(--theme-border-subtle)',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--theme-fg)', fontFamily: 'monospace', minWidth: 28 }}>{t.id}</span>
            <span style={{ flex: 1, fontSize: 8, padding: '1px 6px', borderRadius: 999, background: `${t.statusColor}18`, color: t.statusColor, fontWeight: 600, fontFamily: 'monospace' }}>
              {t.status}
            </span>
            <span style={{ fontSize: 8, color: 'var(--theme-fg-muted)', fontFamily: 'monospace' }}>{t.priority}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SPRINTQL: retro board (full width) ───────────────────────────────────────
function SprintQLPreview({ accent, wide }: { accent: string; wide: boolean }) {
  const cols = [
    { title: 'Went Well',    color: '#10e898', items: ['CI pipeline 40% faster', 'Zero regressions this sprint'] },
    { title: 'To Improve',   color: '#f59e0b', items: ['Review cycle too long', 'More async standups'] },
    { title: 'Action Items', color: accent,    items: ['Add PR template', 'Schedule retro for Week 6'] },
  ]
  return (
    <div
      className="bento-tile-inner"
      style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(3, 1fr)' : '1fr', gap: 8 }}
    >
      {cols.map((c) => (
        <div key={c.title} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: c.color, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {c.title}
            </span>
          </div>
          {c.items.map((item) => (
            <div
              key={item}
              style={{
                padding: '5px 8px', borderRadius: 5, fontSize: 9,
                color: 'var(--theme-fg-subtle)',
                background: 'var(--theme-bg)',
                border: '1px solid var(--theme-border-subtle)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <CheckCircle2 size={8} color={c.color} style={{ flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}