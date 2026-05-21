"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { SenseShell, PulseShell, CollectShell, ResolveShell, SprintQLShell } from './HeroShells';

const DESIGN_W = 600;
const DESIGN_H = 400;
const CYCLE_MS = 4000;

const PRODUCTS = [
  { id: 'sense', name: 'Segmento Sense', label: 'AI Classification', blurb: 'AI-native PII detection, classification and redaction. 50+ types. Zero data leaves your environment.', Shell: SenseShell },
  { id: 'pulse', name: 'Segmento Pulse', label: 'Real-time Intelligence', blurb: 'Global privacy and regulatory intelligence in real time. Know what\'s changing before it hits you.', Shell: PulseShell },
  { id: 'collect', name: 'Segmento Collect', label: 'Data Pipelines', blurb: 'Unified data pipelines from 12+ source types. Ingest, unify, and deliver — automatically.', Shell: CollectShell },
  { id: 'resolve', name: 'Segmento Resolve', label: 'Request Management', blurb: 'Structured DSAR and compliance request management. No missed SLAs. Full audit trail.', Shell: ResolveShell },
  { id: 'sprintql', name: 'Segmento SprintQL', label: 'Team Workflows', blurb: 'Real-time collaborative retrospectives and action workflows. Multiplayer by default.', Shell: SprintQLShell },
] as const;

type PID = typeof PRODUCTS[number]['id'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [active, setActive] = useState<PID>('sense');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setScale(Math.min(el.offsetWidth / DESIGN_W, 1)));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const startCycle = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActive(prev => {
        const idx = PRODUCTS.findIndex(p => p.id === prev);
        return PRODUCTS[(idx + 1) % PRODUCTS.length].id;
      });
    }, CYCLE_MS);
  }, []);

  useEffect(() => {
    startCycle();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, startCycle]);

  const product = PRODUCTS.find(p => p.id === active)!;

  return (
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '5rem' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 65% 55% at 72% 30%, rgba(91,110,245,0.09), transparent),radial-gradient(ellipse 40% 30% at 15% 80%, rgba(160,220,253,0.04), transparent)' }} />

      <div className="section-container w-full relative z-10">
        <div className="bento-grid items-center">

          {/* LEFT */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            <motion.div {...fadeUp(0.05)}>
              <div className="chip border-ai w-fit">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-success)' }} />
                AI-Native · GDPR · DPDP Ready
              </div>
            </motion.div>

            <motion.h1 className="text-display-lg" {...fadeUp(0.12)}>
              The complete data<br />intelligence platform.<br />
              <span style={{ color: 'var(--theme-brand)' }}>Built for what&apos;s next.</span>
            </motion.h1>

            {/* Product tabs + animated blurb */}
            <motion.div {...fadeUp(0.18)} className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {PRODUCTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActive(p.id)}
                    style={{
                      padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: active === p.id ? 600 : 400,
                      fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s ease',
                      border: `1px solid ${active === p.id ? 'rgba(91,110,245,0.6)' : 'var(--theme-border)'}`,
                      background: active === p.id ? 'rgba(91,110,245,0.12)' : 'transparent',
                      color: active === p.id ? 'var(--theme-brand)' : 'var(--theme-fg-muted)',
                    }}
                  >
                    {p.name.replace('Segmento ', '')}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-1"
                >
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--theme-brand)', fontFamily: 'var(--font-mono)' }}>
                    {product.name} · {product.label}
                  </span>
                  <p className="text-body-lg" style={{ maxWidth: '28rem' }}>{product.blurb}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div className="flex flex-wrap gap-3" {...fadeUp(0.28)}>
              <Link href="/contact" className="btn-primary">Book a Demo <ArrowRight size={15} /></Link>
            </motion.div>

            <motion.div className="flex flex-wrap gap-2" {...fadeUp(0.36)}>
              {(['GDPR · Ready', 'HIPAA · Compliant', 'DPDP · Certified'] as const).map(b => (
                <span key={b} className="chip">
                  <CheckCircle2 size={10} style={{ color: 'var(--theme-success)', flexShrink: 0 }} />{b}
                </span>
              ))}
            </motion.div>

            {/* Auto-cycle progress dots */}
            <motion.div {...fadeUp(0.42)} className="flex gap-2 items-center">
              {PRODUCTS.map(p => (
                <button key={p.id} onClick={() => setActive(p.id)} style={{ width: active === p.id ? 20 : 6, height: 6, borderRadius: 999, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', background: active === p.id ? 'var(--theme-brand)' : 'var(--theme-border)' }} />
              ))}
            </motion.div>
          </div>

          {/* RIGHT — hidden on mobile */}
          <motion.div
            className="col-span-12 lg:col-span-6 hidden lg:block"
            initial={{ opacity: 0, scale: 0.97, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div ref={wrapperRef} className="w-full overflow-hidden" style={{ height: `${DESIGN_H * scale}px` }}>
              <div style={{ width: DESIGN_W, height: DESIGN_H, transformOrigin: 'top left', transform: `scale(${scale})` }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <product.Shell />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}