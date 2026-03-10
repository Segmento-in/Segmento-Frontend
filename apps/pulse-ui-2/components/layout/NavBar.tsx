"use client";
/**
 * NavBar — Exact replica of Prismic blog navigation
 *
 * Two-tier structure (from live site inspection):
 *   Tier 1 (64px): Logo "prismic / Blog" | main links | Login | "Get started"
 *   Tier 2 (44px): Category tabs | 🔍 icon
 *
 * Styling notes (from live screenshot):
 *   - Both tiers sit on #FFFFFF background with a 1px bottom border on tier 2
 *   - Active category has no pill — just a font-weight change + bottom underline
 *   - "Get started" is a solid black pill button
 *   - Logo uses a square icon mark + "prismic / Blog" text
 *   - Main links are plain text, no background on hover — just color change
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { pulseAuth } from "@/lib/firebase";
import { PulseLogo } from "../HeartbeatLogo";
import NewsletterHub from "../NewsletterHub";
import ThemeToggle from "../shared/ThemeToggle";

// ── Main navigation items (Tier 1) ──────────────────────────
const MAIN_NAV = [
    { label: "Product", href: "#" },
    { label: "Solutions", href: "#" },
    { label: "Developers", href: "#" },
    { label: "Showcase", href: "#" },
    { label: "Resources", href: "#" },
    { label: "Pricing", href: "#" },
];

// ── Category tabs (Tier 2 subnav) ────────────────────────────
const CATEGORIES = [
    { label: "HOME", href: "/" },
    { label: "AI", href: "/category/ai" },
    { label: "DATA", href: "/category/data" },
    { label: "CLOUD", href: "/category/cloud" },
    { label: "MAGZINES", href: "/category/magzines" },
    { label: "ARTICLES", href: "/category/articles" },
    { label: "RESEARCH PAPERS", href: "/category/research-papers" },
];

export function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isNewsletterHubOpen, setIsNewsletterHubOpen] = useState(false);

    // Search state
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const timeoutRef = useRef<number | undefined>(undefined);

    const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (query.trim().length >= 2) {
            timeoutRef.current = window.setTimeout(() => {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            }, 500);
        }
    }, [router]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setIsSearchOpen(false);
        }
    };

    useEffect(() => {
        if (!pulseAuth) return;
        const unsubscribe = onAuthStateChanged(pulseAuth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            if (pulseAuth) await signOut(pulseAuth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "var(--pulse-color-card-bg)",
                borderBottom: "1px solid var(--pulse-color-border-subtle)",
            }}
        >
            {/* ── TIER 1: Brand + Main nav ── */}
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 24px",
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    gap: "32px",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        textDecoration: "none",
                        color: "inherit",
                        flexShrink: 0,
                    }}
                >
                    {/* Icon mark — PulseLogo imported from UI-1 */}
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginRight: "4px"
                        }}
                    >
                        <PulseLogo size="md" />
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--pulse-color-text-primary)" }}>
                        Segmento Pulse
                    </span>
                </Link>

                {/* Main links — removed per user instruction */}
                <div style={{ flex: 1 }} />

                {/* Right actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <ThemeToggle />
                    {user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="User" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                                ) : (
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--pulse-color-brand-purple)", color: "var(--pulse-color-text-inverse)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>
                                        {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--pulse-color-text-primary)" }}>Dashboard</span>
                            </Link>
                            <a href="#" onClick={handleLogout} style={{ fontSize: "13px", fontWeight: 500, color: "var(--pulse-color-text-secondary)", textDecoration: "none" }}>
                                Sign Out
                            </a>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "var(--pulse-color-text-primary)",
                                textDecoration: "none",
                            }}
                        >
                            Sign In
                        </Link>
                    )}
                    <button
                        onClick={() => setIsNewsletterHubOpen(true)}
                        style={{
                            padding: "8px 18px",
                            background: "var(--pulse-color-brand-accent)",
                            color: "var(--pulse-color-text-inverse)",
                            borderRadius: "9999px",
                            fontSize: "14px",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "opacity 150ms",
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                    >
                        Subscribe
                    </button>
                </div>
            </div>

            {/* ── TIER 2: Category subnav ── */}
            <div style={{ borderTop: "1px solid var(--pulse-color-border-subtle)" }}>
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "0 24px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0",
                    }}
                >
                    {/* Category tabs — no pill, underline on active */}
                    <div style={{ display: "flex", alignItems: "center", flex: 1, overflowX: "auto", scrollbarWidth: "none" }}>
                        {CATEGORIES.map(cat => {
                            const isActive = pathname === cat.href;
                            return (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        padding: "0 14px",
                                        height: "44px",
                                        fontSize: "13px",
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? "var(--pulse-color-text-primary)" : "var(--pulse-color-text-secondary)",
                                        textDecoration: "none",
                                        background: "transparent",
                                        borderBottom: isActive ? "2px solid var(--pulse-color-text-primary)" : "2px solid transparent",
                                        whiteSpace: "nowrap",
                                        transition: "color 120ms, border-color 120ms",
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive)
                                            (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-primary)";
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive)
                                            (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-secondary)";
                                    }}
                                >
                                    {cat.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Search Block */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {isSearchOpen ? (
                            <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    placeholder="Search news..."
                                    style={{
                                        width: "180px",
                                        height: "36px",
                                        padding: "0 12px",
                                        borderRadius: "6px",
                                        border: "1px solid var(--pulse-color-border-subtle)",
                                        fontSize: "13px",
                                        outline: "none",
                                        color: "var(--pulse-color-text-primary)",
                                        background: "transparent"
                                    }}
                                    autoFocus
                                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                                />
                            </form>
                        ) : (
                            <button
                                aria-label="Search"
                                onClick={() => setIsSearchOpen(true)}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "transparent",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    color: "var(--pulse-color-text-secondary)",
                                    transition: "background 120ms, color 120ms",
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = "var(--pulse-color-bg-hover)";
                                    el.style.color = "var(--pulse-color-text-primary)";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = "transparent";
                                    el.style.color = "var(--pulse-color-text-secondary)";
                                }}
                            >
                                <svg
                                    width="17"
                                    height="17"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Newsletter Hub Overlay */}
            {isNewsletterHubOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsNewsletterHubOpen(false)}
                >
                    <div
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800"
                        >
                            <button
                                onClick={() => setIsNewsletterHubOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 z-10 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="pt-4">
                                <NewsletterHub />
                            </div>
                        </div>
                    </div>
                )}
                </header>
            );
}
