'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { PulseShell, SenseShell, CollectShell, ResolveShell, SprintQLShell } from './HeroShells'

// Component to dynamically scale the 600x400 AppShell to fit any container
function ShellScaler({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const DESIGN_W = 600
  const DESIGN_H = 400

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      // We want to center it, so we measure width and scale down if needed
      setScale(Math.min(el.offsetWidth / DESIGN_W, 1))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="w-full overflow-hidden flex justify-center"
      style={{ height: `${DESIGN_H * scale}px` }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

const PRODUCTS = [
  {
    id: 'pulse',
    name: 'Segmento Pulse',
    label: 'Real-time Intelligence',
    headline: 'Know what\'s happening before it hits you.',
    description: 'Pulse tracks global data privacy news, regulatory changes, and emerging threats in real time. Built for compliance leads who can\'t afford to be caught off guard.',
    link: '/pulse',
    accent: '#3b82f6',
    tags: ['GDPR', 'DPDP', 'EU AI Act'],
    Shell: PulseShell,
  },
  {
    id: 'sense',
    name: 'Segmento Sense',
    label: 'AI Classification',
    headline: 'Find sensitive data. Before someone else does.',
    description: 'Sense uses explainable AI to detect, classify, and redact PII across documents and datasets — with client-side OCR that keeps your data on your infrastructure.',
    link: '/sense',
    accent: '#8b5cf6',
    tags: ['HIPAA', 'GDPR', 'DPDP', 'Client-Side OCR'],
    Shell: SenseShell,
  },
  {
    id: 'collect',
    name: 'Segmento Collect',
    label: 'Data Pipelines',
    headline: 'Every source. One pipeline.',
    description: 'Collect aggregates data from 12+ source types through intelligent connectors. Automate ingestion, unify workflows, and recover anything within a 24-hour window.',
    link: 'collect',
    accent: '#06b6d4',
    tags: ['GDPR', 'DPDP'],
    Shell: CollectShell,
  },
  {
    id: 'resolve',
    name: 'Segmento Resolve',
    label: 'Request Management',
    headline: 'No more lost tickets. No more missed SLAs.',
    description: 'Resolve turns chaotic data requests into a structured, trackable pipeline. Your team sees everything. Nothing slips through.',
    link: 'resolve',
    accent: '#10b981',
    tags: ['DSAR', 'GDPR', 'HIPAA', 'DPDP'],
    Shell: ResolveShell,
  },
  {
    id: 'sprintql',
    name: 'Segmento SprintQL',
    label: 'Team Workflows',
    headline: 'Retrospectives that actually drive change.',
    description: 'SprintQL makes retros fast, collaborative, and actionable. Capture feedback, vote on ideas, and convert decisions into items your team will actually follow through on.',
    link: 'sprintql',
    accent: '#a855f7',
    tags: ['Team', 'Agile', 'Collaborative'],
    Shell: SprintQLShell,
  },
]

export default function ProductShowcase() {
  return (
    <section id="ProductShowcase" className="relative overflow-hidden" style={{ padding: '8rem 0' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--theme-border-subtle)' }} />

      <div className="section-container">
        {/* Section header */}
        <motion.div
          className="text-center"
          style={{ marginBottom: '6rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="chip w-fit mx-auto" style={{ marginBottom: '1.25rem' }}>Our Products</div>
          <h2 className="text-headline-md" style={{ marginBottom: '0.75rem' }}>
            Five tools.{' '}
            <span style={{ color: 'var(--theme-brand)' }}>One platform.</span>
          </h2>
          <p className="text-body-lg mx-auto" style={{ maxWidth: '36rem' }}>
            Each product solves a specific problem. Together, they cover your entire data lifecycle.
          </p>
        </motion.div>

        {/* Product Rows */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {PRODUCTS.map((p, i) => {
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={p.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* ── Text side ── */}
                {/* On mobile, order-1 ensures text is always on top. On lg, resets to default document flow. */}
                <div className={`col-span-1 lg:col-span-5 flex flex-col items-start gap-6 order-1 ${isEven ? 'lg:order-none' : 'lg:order-2'}`}>
                  {/* Eyebrow */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span
                      className="text-label-caps"
                      style={{
                        padding: '4px 12px', borderRadius: 999,
                        border: `1px solid ${p.accent}50`,
                        color: p.accent, fontSize: 11,
                        background: `${p.accent}14`,
                      }}
                    >
                      {p.name} · {p.label}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-headline-sm lg:text-4xl leading-tight text-[var(--theme-fg)]">
                    {p.headline}
                  </h3>

                  {/* Description */}
                  <p className="text-body-lg" style={{ color: 'var(--theme-fg-subtle)' }}>
                    {p.description}
                  </p>

                  {/* Compliance Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '0.5rem' }}>
                    {p.tags.map(tag => (
                      <span key={tag} className="chip">
                        <CheckCircle2 size={10} style={{ color: p.accent, flexShrink: 0 }} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={p.link}
                    className="btn-primary mt-2"
                    style={{ background: p.accent, color: '#fff', boxShadow: `0 4px 24px ${p.accent}40`, border: 'none' }}
                  >
                    Explore {p.name.replace('Segmento ', '')} <ArrowRight size={16} />
                  </Link>
                </div>

                {/* ── AppShell side ── */}
                <div className={`col-span-1 lg:col-span-7 order-2 ${isEven ? 'lg:order-none' : 'lg:order-1'}`}>
                  {/* Subtle background glow behind the AppShell */}
                  <div className="relative w-full">
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '80%', height: '80%', borderRadius: '50%',
                        background: p.accent, filter: 'blur(100px)', opacity: 0.15,
                        pointerEvents: 'none', zIndex: 0
                      }}
                    />
                    <div className="relative z-10 w-full rounded-[12px] overflow-hidden" style={{ boxShadow: `0 20px 60px -10px ${p.accent}30` }}>
                      <ShellScaler>
                        <p.Shell />
                      </ShellScaler>
                    </div>
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
