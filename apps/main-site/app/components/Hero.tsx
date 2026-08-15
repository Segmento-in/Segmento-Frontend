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
  { id: 'sense', name: 'Segmento Sense', label: 'AI Classification', blurb: 'AI-native PII detection, classification and redaction. 50+ types. Zero data leaves your environment.', color: '#00c6ff', Shell: SenseShell },
  { id: 'pulse', name: 'Segmento Pulse', label: 'Real-time Intelligence', blurb: 'Global privacy and regulatory intelligence in real time. Know what\'s changing before it hits you.', color: '#ff8a00', Shell: PulseShell },
  { id: 'collect', name: 'Segmento Collect', label: 'Data Pipelines', blurb: 'Unified data pipelines from 12+ source types. Ingest, unify, and deliver automatically.', color: '#00d2b4', Shell: CollectShell },
  { id: 'resolve', name: 'Segmento Resolve', label: 'Request Management', blurb: 'Structured DSAR and compliance request management. No missed SLAs. Full audit trail.', color: '#0072ff', Shell: ResolveShell },
  { id: 'sprintql', name: 'Segmento SprintQL', label: 'Team Workflows', blurb: 'Real-time collaborative retrospectives and action workflows. Multiplayer by default.', color: '#ff2a85', Shell: SprintQLShell },
] as const;

type PID = typeof PRODUCTS[number]['id'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
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
    <section className="relative flex flex-col justify-center overflow-hidden hero-gradient-theme min-h-[calc(100vh-48px)] pt-20 pb-8 md:pt-24 md:pb-10">
      {/* Ambient background glow from Segmento logo spectrum */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 45% at 50% 10%, ${product.color}18, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 40%, rgba(255,42,133,0.10), transparent 60%), radial-gradient(ellipse 45% 40% at 15% 75%, rgba(0,198,255,0.10), transparent 55%)`,
        transition: 'background 0.5s ease',
      }} />

      <div className="section-container w-full relative z-10 py-2 my-auto">
        <div className="bento-grid items-center gap-8 md:gap-12 lg:gap-14 xl:gap-16">

          {/* LEFT */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-7 md:gap-8 lg:gap-9">
            <motion.div {...fadeUp(0.05)}>
              <div className="chip w-fit py-1.5 px-3.5 text-xs md:text-sm" style={{ borderColor: 'rgba(0, 210, 180, 0.4)', background: 'rgba(0, 210, 180, 0.08)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#00d2b4', boxShadow: '0 0 8px #00d2b4' }} />
                <span style={{ color: 'var(--theme-fg)', fontWeight: 500 }}>AI-Native · DPDP · GDPR Ready</span>
              </div>
            </motion.div>

            <motion.h1 className="text-display-lg" style={{ lineHeight: 1.15 }} {...fadeUp(0.12)}>
              The Data Platform<br />
              <span style={{
                background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 35%, #ff2a85 70%, #ff8a00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}>
                Built for what&apos;s next
              </span>
            </motion.h1>

            {/* Product tabs + animated blurb */}
            <motion.div {...fadeUp(0.18)} className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2.5">
                {PRODUCTS.map(p => {
                  const isSelected = active === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActive(p.id)}
                      style={{
                        padding: '7px 18px',
                        borderRadius: 999,
                        fontSize: 13.5,
                        fontWeight: isSelected ? 600 : 400,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        border: `1px solid ${isSelected ? p.color : 'var(--theme-border)'}`,
                        background: isSelected ? `${p.color}22` : 'transparent',
                        color: isSelected ? p.color : 'var(--theme-fg-muted)',
                        boxShadow: isSelected ? `0 0 16px ${p.color}33` : 'none',
                      }}
                    >
                      {p.name.replace('Segmento ', '')}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-1.5 pt-1"
                >
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: product.color, fontFamily: 'var(--font-mono)' }}>
                    {product.name} · {product.label}
                  </span>
                  <p className="text-body-lg" style={{ maxWidth: '30rem', lineHeight: 1.65 }}>{product.blurb}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div className="flex flex-wrap gap-4 pt-1" {...fadeUp(0.28)}>
              <Link
                href="/contact"
                className="btn-primary group relative overflow-hidden shadow-lg shadow-blue-500/25"
                style={{
                  background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 50%, #ff2a85 100%)',
                  border: 'none',
                  color: '#ffffff',
                }}
              >
                <span className="relative z-10 flex items-center gap-2 font-semibold">Book a Demo <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" /></span>
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </Link>
            </motion.div>

            <motion.div className="flex flex-wrap gap-2.5 pt-1" {...fadeUp(0.36)}>
              {(['GDPR · Ready', 'HIPAA · Compliant', 'DPDP · Certified'] as const).map(b => (
                <span key={b} className="chip py-1 px-3 text-xs">
                  <CheckCircle2 size={12} style={{ color: '#00d2b4', flexShrink: 0 }} />{b}
                </span>
              ))}
            </motion.div>

            {/* Auto-cycle progress dots */}
            <motion.div {...fadeUp(0.42)} className="flex gap-2.5 items-center pt-2">
              {PRODUCTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  style={{
                    width: active === p.id ? 28 : 7,
                    height: 7,
                    borderRadius: 999,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: active === p.id ? p.color : 'var(--theme-border)',
                    boxShadow: active === p.id ? `0 0 10px ${p.color}88` : 'none',
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* RIGHT — hidden on mobile */}
          <motion.div
            className="col-span-12 lg:col-span-6 hidden lg:flex items-center justify-center p-2 lg:p-4"
            initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Double Bezel Outer Shell with Dynamic Logo Aura */}
            <div
              className="w-full p-2.5 rounded-[2.25rem] bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 shadow-2xl relative"
              style={{
                boxShadow: `0 24px 60px -15px ${product.color}25, 0 0 0 1px ${product.color}30`,
                transition: 'box-shadow 0.4s ease',
              }}
            >
              <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-tr from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
              {/* Double Bezel Inner Core */}
              <div className="relative rounded-[1.75rem] bg-[var(--theme-bg-surface)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden border border-[var(--theme-border)]">
                <div ref={wrapperRef} className="w-full overflow-hidden" style={{ height: `${DESIGN_H * scale}px` }}>
                  <div style={{ width: DESIGN_W, height: DESIGN_H, transformOrigin: 'top left', transform: `scale(${scale})` }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <product.Shell />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}