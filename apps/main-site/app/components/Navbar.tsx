"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, ChevronDown,
  Newspaper, Shield, Database, Ticket, Users,
  ShoppingCart, Heart, Monitor, Building2, Factory,
  GraduationCap, Radio, BookOpen, FileText,
  Briefcase, Phone, Info, Rss, ArrowRight, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MegaItem {
  name: string;
  subtitle?: string;
  href: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  isExternal?: boolean;
}

interface MegaSection {
  label: string;
  items: MegaItem[];
}

interface MegaFeatured {
  label: string;
  title: string;
  description: string;
  gradient: string;
  badge?: string;
  href: string;
}

interface NavLink {
  name: string;
  href?: string;
  megaMenu?: {
    sections: MegaSection[];
    featured?: MegaFeatured;
  };
}

// ─── Nav Data ─────────────────────────────────────────────────────────────────

const navLinks: NavLink[] = [
  {
    name: "Products",
    megaMenu: {
      sections: [
        {
          label: "Data Intelligence",
          items: [
            { name: "Segmento Pulse", subtitle: "Real-time news & trends engine", href: "/pulse", icon: Newspaper },
            { name: "Segmento Sense", subtitle: "AI-enabled data classification", href: "/sense", icon: Shield },
            { name: "Segmento Collect", subtitle: "AI-powered data collection platform", href: "/collect", icon: Database },
          ],
        },
        {
          label: "Workflow Tools",
          items: [
            { name: "Segmento Resolve", subtitle: "Data request & ticket management", href: "/resolve", icon: Ticket },
            { name: "Segmento SprintQL", subtitle: "Collaborative retrospective management", href: "/sprintql", icon: Users },
          ],
        },
      ],
      featured: {
        label: "What's New",
        title: "Segmento AI Suite v2",
        description: "Explore our latest AI-powered data intelligence upgrades and new product features.",
        gradient: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#38bdf8 100%)",
        badge: "New Release",
        href: "/pulse",
      },
    },
  },
  {
    name: "Solutions",
    megaMenu: {
      sections: [
        {
          label: "By Industry",
          items: [
            { name: "Finance", subtitle: "Automate financial data workflows", href: "/solutions#finance", icon: Building2 },
            { name: "Healthcare", subtitle: "HIPAA-compliant data intelligence", href: "/solutions#healthcare", icon: Heart },
            { name: "Media", subtitle: "Content intelligence at scale", href: "/solutions#media", icon: Monitor },
            { name: "Banking", subtitle: "Secure banking data operations", href: "/solutions#banking", icon: Briefcase },
            { name: "eCommerce", subtitle: "Customer data & privacy compliance", href: "/solutions#ecommerce", icon: ShoppingCart },
            { name: "Manufacturing", subtitle: "Operational data intelligence", href: "/solutions#manufacturing", icon: Factory },
          ],
        },
        {
          label: "By Function",
          items: [
            { name: "Higher Education", subtitle: "Research data compliance", href: "/solutions#higher-education", icon: GraduationCap },
            { name: "Telecommunication", subtitle: "Network data governance", href: "/solutions#telecommunication", icon: Radio },
          ],
        },
      ],
    },
  },
  {
    name: "Resources",
    megaMenu: {
      sections: [
        {
          label: "Learn",
          items: [
            { name: "Blog", subtitle: "Data privacy news & insights", href: "/blog", icon: Rss },
            { name: "Case Studies", subtitle: "Real-world implementation stories", href: "/case-studies", icon: FileText },
            { name: "Documentation", subtitle: "Technical guides & API reference", href: "/docs", icon: BookOpen },
          ],
        },
        {
          label: "Company",
          items: [
            { name: "Careers", subtitle: "Join our growing team", href: "/careers", icon: Briefcase },
            { name: "About", subtitle: "Our mission & story", href: "/about", icon: Info },
          ],
        },
      ],
      featured: {
        label: "Featured",
        title: "Global Data Compliance Guide",
        description: "Free resource: navigate privacy regulations across 40+ countries.",
        gradient: "linear-gradient(135deg,#0f172a 0%,#1e293b 55%,#334155 100%)",
        badge: "Free Guide",
        href: "/blog",
      },
    },
  },
  { name: "Contact", href: "/contact" },
];

// ─── Featured Card ─────────────────────────────────────────────────────────────

function FeaturedCard({ f }: { f: MegaFeatured }) {
  return (
    <div style={{ width: 220, flexShrink: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--mega-label)", marginBottom: 12 }}>
        {f.label}
      </p>
      <Link href={f.href} style={{ display: "block", textDecoration: "none" }}>
        <div style={{ background: f.gradient, height: 126, borderRadius: 12, position: "relative", marginBottom: 10, overflow: "hidden" }}>
          {f.badge && (
            <span style={{ position: "absolute", top: 10, left: 12, fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {f.badge}
            </span>
          )}
          <div style={{ position: "absolute", bottom: 12, left: 14, display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles style={{ width: 13, height: 13, color: "rgba(255,255,255,0.8)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Explore →</span>
          </div>
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--mega-title)", lineHeight: 1.3, marginBottom: 6 }}>{f.title}</p>
        <p style={{ fontSize: 11.5, color: "var(--mega-subtitle)", lineHeight: 1.5, margin: 0 }}>{f.description}</p>
      </Link>
    </div>
  );
}

// ─── Mega Panel ────────────────────────────────────────────────────────────────

function MegaPanel({
  menu, left, arrowLeft, onMouseEnter, onMouseLeave,
}: {
  menu: NonNullable<NavLink["megaMenu"]>;
  left: number;
  arrowLeft: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.985 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left,
        zIndex: 50,
        minWidth: menu.featured ? 740 : 560,
        maxWidth: "min(920px, calc(100vw - 48px))",
      }}
    >
      {/* Arrow caret — tracks trigger center */}
      <div style={{
        position: "absolute",
        top: -7,
        left: arrowLeft - 7,
        width: 14,
        height: 14,
        transform: "rotate(45deg)",
        background: "var(--mega-bg)",
        borderLeft: "1px solid var(--mega-border)",
        borderTop: "1px solid var(--mega-border)",
        boxShadow: "-2px -2px 4px rgba(0,0,0,0.04)",
        zIndex: 2,
      }} />

      {/* Panel body */}
      <div style={{
        background: "var(--mega-bg)",
        border: "1px solid var(--mega-border)",
        borderRadius: 20,
        padding: "28px 32px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.14), 0 4px 20px rgba(0,0,0,0.07)",
        display: "flex",
        gap: 0,
      }}>
        {/* Sections */}
        <div style={{ display: "flex", gap: 36, flex: 1 }}>
          {menu.sections.map((section) => (
            <div key={section.label} style={{ minWidth: 185, flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--mega-label)", marginBottom: 10, paddingLeft: 10 }}>
                {section.label}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const Comp = item.isExternal ? "a" : Link;
                  const props = item.isExternal
                    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                    : { href: item.href };
                  return (
                    <Comp key={item.name} {...(props as any)} className="mega-item">
                      <div className="mega-icon-box">
                        <Icon style={{ width: 15, height: 15, color: "var(--mega-icon-color)" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--mega-title)", lineHeight: 1.25, margin: 0 }}>{item.name}</p>
                        {item.subtitle && (
                          <p style={{ fontSize: 11.5, color: "var(--mega-subtitle)", marginTop: 2, lineHeight: 1.4, margin: 0 }}>{item.subtitle}</p>
                        )}
                      </div>
                    </Comp>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Featured column */}
        {menu.featured && (
          <>
            <div style={{ width: 1, background: "var(--mega-border)", margin: "0 28px", flexShrink: 0 }} />
            <FeaturedCard f={menu.featured} />
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
  const [panelLeft, setPanelLeft] = useState(0);
  const [arrowLeft, setArrowLeft] = useState(0);
  // Track dark/light for logo switching — driven by MutationObserver on html[data-theme]
  const [isDarkTheme, setIsDarkTheme] = useState(true); // default dark (matches layout.tsx)

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sync logo to data-theme — works on mount AND whenever ThemeToggle changes it
  useEffect(() => {
    const html = document.documentElement;
    // Set initial state from whatever data-theme is on <html> right now
    setIsDarkTheme(html.dataset.theme !== "light");

    const observer = new MutationObserver(() => {
      setIsDarkTheme(html.dataset.theme !== "light");
    });
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const computePosition = useCallback((name: string) => {
    const trigger = triggerRefs.current.get(name);
    const container = containerRef.current;
    if (!trigger || !container) return;

    const tRect = trigger.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const triggerCenter = tRect.left - cRect.left + tRect.width / 2;

    const menu = navLinks.find(l => l.name === name)?.megaMenu;
    const panelW = menu?.featured ? 740 : 560;

    let left = triggerCenter - panelW / 2;
    left = Math.max(0, Math.min(left, cRect.width - panelW));

    setPanelLeft(left);
    setArrowLeft(triggerCenter - left);
  }, []);

  const handleEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(name);
    computePosition(name);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 300);
  };

  const activeMenu = navLinks.find(l => l.name === activeDropdown)?.megaMenu;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-nav backdrop-blur-xl py-2 shadow-sm border-b border-[var(--color-border)]" : "bg-transparent py-4"
        }`}>
        {/* Container — relative anchor for mega panels */}
        <div ref={containerRef} className="max-w-7xl mx-auto px-6" style={{ position: "relative" }}>
          <div className="flex items-center justify-between h-14">

            {/* Logo — src driven by React state, not CSS, so it works reliably on all pages + toggle */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src={isDarkTheme ? "/images/logo-final1.png" : "/images/logo-final.png"}
                alt="Segmento"
                width={180}
                height={28}
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-0.5">
              {navLinks.map((link) => {
                const isActive = activeDropdown === link.name;
                if (link.megaMenu) {
                  return (
                    <div key={link.name} onMouseEnter={() => handleEnter(link.name)} onMouseLeave={handleLeave}>
                      <button
                        ref={(el) => { if (el) triggerRefs.current.set(link.name, el); }}
                        className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive ? "bg-black/8 text-[var(--nav-text)]" : "text-[var(--nav-text)] hover:bg-black/5"
                          }`}
                        style={{ background: isActive ? "rgba(0,0,0,0.07)" : undefined }}
                      >
                        <span>{link.name}</span>
                        <motion.span animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                        </motion.span>
                      </button>
                    </div>
                  );
                }
                return (
                  <Link key={link.name} href={link.href!}
                    className="px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 text-[var(--nav-text)] hover:bg-black/5"
                    style={{ color: "var(--nav-text)" }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <ThemeToggle />
              <Link href="/contact"
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-200 active:scale-[0.97] text-white shadow-sm"
                style={{ background: "var(--color-brand)" }}
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button className="p-2" style={{ color: "var(--nav-text)" }} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mega Panel — rendered in container for accurate positioning */}
          <AnimatePresence>
            {activeDropdown && activeMenu && (
              <MegaPanel
                key={activeDropdown}
                menu={activeMenu}
                left={panelLeft}
                arrowLeft={arrowLeft}
                onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
                onMouseLeave={handleLeave}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 top-[64px] md:hidden z-40 overflow-y-auto border-t"
              style={{ background: "var(--color-background)", borderColor: "var(--color-border-light)" }}
            >
              <div className="p-6 space-y-4">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b pb-4 last:border-0" style={{ borderColor: "var(--color-border-light)" }}>
                    {link.megaMenu ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => setMobileMenuOpen(mobileMenuOpen === link.name ? null : link.name)}
                          className="w-full flex items-center justify-between text-xl font-black px-2"
                          style={{ color: "var(--color-heading)" }}
                        >
                          <span>{link.name}</span>
                          <motion.div animate={{ rotate: mobileMenuOpen === link.name ? 180 : 0 }}>
                            <ChevronDown className="w-5 h-5 opacity-50" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {mobileMenuOpen === link.name && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="grid grid-cols-1 gap-1 pt-2">
                                {link.megaMenu.sections.flatMap(s => s.items).map((item) => (
                                  <Link key={item.name} href={item.href}
                                    className="block px-4 py-3 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: "var(--color-background-secondary)", color: "var(--color-body)" }}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link href={link.href!}
                        className="block px-2 text-xl font-black"
                        style={{ color: "var(--color-heading)" }}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4">
                  <Link href="/contact"
                    className="block w-full py-4 text-white text-center font-black rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
                    style={{ background: "var(--color-brand)" }}
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}