"use client";
/**
 * HeroSection — Exact Prismic Blog Hero Replica
 *
 * Layout: 3-column CSS Grid [200px | 1fr | 220px]
 *
 * Column A (200px):  3 stacked article cards, each with a real SVG
 *                    illustration from Prismic's CDN.
 * Column B (1fr):    1 large featured card (SVG illustration top, full
 *                    text metadata below) + 3-card bottom row.
 * Column C (220px):  Numbered popularity list (01–06) with view counts
 *                    and trend arrows.
 *
 * Section background: #F6F7FB (light blue-gray, confirmed from live page)
 * Card background:    #FFFFFF with 1px solid #E5E7EB border
 * Page label:         "The Segmento Pulse Blog" — color #7C3AED (purple)
 * H1:                 "Nail your workflow." — ~52px, weight 900, tight tracking
 *
 * Illustrations:      Static SVG assets via plain <img> tags
 *                     Hosted on: prismic-main.cdn.prismic.io (publicly accessible)
 *                     Note: next.config.ts already allows hostname:"**"
 */

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import ArticleDetailView from "@/components/ArticleDetailView";

// ── BASE CDN ─────────────────────────────────────────────────
const CDN = "https://prismic-main.cdn.prismic.io/prismic-main";

// ── ARTICLE DATA ────────────────────────────────────────────

/** Left column — 3 stacked cards (no excerpt, illustration + badge + title) */
const LEFT_CARDS = [
    {
        id: "lc1",
        tag: "AI",
        title: "Building a GEO Benchmark Tool: What We Learned Polling LLMs at Scale",
        href: "#",
        imgSrc: `${CDN}/aXoyPAIvOtkhCCoN_GEO.svg`,
        imgAlt: "GEO Benchmark illustration",
    },
    {
        id: "lc2",
        tag: "CLOUD",
        title: "Headless CMS: A Complete Introduction",
        href: "#",
        imgSrc: `${CDN}/f5abde02-3112-4138-8de7-128e9e9f87a4_headless_intro.svg`,
        imgAlt: "Headless CMS introduction illustration",
    },
    {
        id: "lc3",
        tag: "DATA",
        title: "Headless CMS Explained: A Guide for Marketers and Developers",
        href: "#",
        imgSrc: `${CDN}/5ad3b8c6-fe07-46d1-8fcf-f0742ec3f650_headless.svg`,
        imgAlt: "Headless CMS explained illustration",
    },
];

/** Center — 1 large featured card */
const CENTER_FEATURED = {
    id: "cf1",
    tag: "CLOUD",
    date: "Jan 8, 2026",
    title: "4 Techniques for Balancing Performance and Server Costs with Next.js Cache Components",
    excerpt: "Discover four proven techniques for using Next.js Cache Components to optimize performance, reduce cache invalidations, and lower server costs.",
    author: "Angelo Ashmore",
    views: 266,
    href: "#",
    imgSrc: `${CDN}/aXujwgIvOtkhCGB4_nextjsCMS.svg`,
    imgAlt: "Next.js Cache Components illustration",
};

/** Center — 3 cards in bottom row */
const CENTER_BOTTOM = [
    {
        id: "cb1",
        tag: "AI",
        title: "The Shift From SEO to AI Search: What Marketers Need to Know to Grow Organically in 2026",
        author: "Lidija Kacar",
        views: 943,
        comments: 0,
        href: "#",
        imgSrc: `${CDN}/57f8d02b-eeee-47b4-b1f5-f15c43411b73_content_modeling.svg`,
        imgAlt: "Content modeling illustration",
    },
    {
        id: "cb2",
        tag: "MAGZINES",
        title: "Why Claude Code Changed My Mind About AI Development",
        author: "Angelo Ashmore",
        views: 10911,
        comments: 1,
        href: "#",
        imgSrc: `${CDN}/1dea46fd-52ba-49cb-958e-338b0cfdc15e_AI+Tools+for+Dev+Productivity.svg`,
        imgAlt: "AI Developer Productivity illustration",
    },
    {
        id: "cb3",
        tag: "ARTICLES",
        title: "How to Build a Winning ABM Strategy (in 2028) with Personalization at Scale",
        author: "Lidija Kacar",
        views: 555,
        comments: 0,
        href: "#",
        imgSrc: `${CDN}/3e264149-6310-4972-b382-a7eda0e98c5d_what-is-jamstack.svg`,
        imgAlt: "Jamstack illustration",
    },
];

/** Right column — numbered popularity ranking */
const RIGHT_LIST = [
    { id: "r1", title: "OpenAI Announces GPT-5: A New Era of Reasoning", views: 2584, trend: "up" },
    { id: "r2", title: "AWS Introduces Next-Gen Graviton Processors", views: 2000, trend: "up" },
    { id: "r3", title: "The State of Data Warehousing in 2026", views: 1204, trend: "down" },
    { id: "r4", title: "Google Cloud Spanner Adds Multi-Region Scaling", views: 1196, trend: "down" },
    { id: "r5", title: "Anthropic Claude 4 Exceeds Human Baselines", views: 744, trend: "down" },
    { id: "r6", title: "Snowflake's New AI-Driven Native Applications", views: 718, trend: "down" },
];

export interface HeroSectionProps {
    leftCards?: any[];
    centerFeatured?: any;
    centerBottom?: any[];
    rightList?: any[];
}

// ── SMALL SHARED COMPONENTS ──────────────────────────────────

/** Author avatar + name */
function AuthorAvatar({ name }: { name: string }) {
    // Generate initials from name
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    // Deterministic hue from name
    const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span
                aria-hidden="true"
                style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: `hsl(${hue},60%,48%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                }}
            >
                {initials}
            </span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>By {name}</span>
        </div>
    );
}

/** Eye icon + view count */
function ViewCount({ count }: { count: number }) {
    return (
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#9CA3AF", fontSize: "12px" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            {count.toLocaleString()}
        </span>
    );
}

/** Comment bubble icon + count */
function CommentCount({ count }: { count: number }) {
    if (count === 0) return null;
    return (
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#9CA3AF", fontSize: "12px" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {count}
        </span>
    );
}

/** Up / down trend arrow for the popularity list */
function TrendArrow({ dir }: { dir: string }) {
    const isUp = dir === "up";
    return (
        <svg
            width="9"
            height="9"
            fill="none"
            stroke={isUp ? "#10B981" : "#EF4444"}
            strokeWidth="2.5"
            viewBox="0 0 24 24"
        >
            {isUp
                ? <path d="M12 19V5M5 12l7-7 7 7" />
                : <path d="M12 5v14M5 12l7 7 7-7" />}
        </svg>
    );
}

// ── HOVER HELPERS ────────────────────────────────────────────
const onEnter = (sh: string) => (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.boxShadow = sh;
    el.style.transform = "translateY(-2px)";
};
const onLeave = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.boxShadow = "none";
    el.style.transform = "translateY(0)";
};

// ── SHARED CARD STYLE ────────────────────────────────────────
const CARD_BASE: React.CSSProperties = {
    display: "block",
    background: "#ffffff",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    transition: "box-shadow 180ms ease, transform 180ms ease",
};

// ── MAIN COMPONENT ───────────────────────────────────────────
export function HeroSection({
    leftCards = LEFT_CARDS,
    centerFeatured = CENTER_FEATURED,
    centerBottom = CENTER_BOTTOM,
    rightList = RIGHT_LIST
}: HeroSectionProps = {}) {
    const [hoveredArticle, setHoveredArticle] = useState<any | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnterModal = (art: any) => {
        timerRef.current = setTimeout(() => {
            setHoveredArticle(art);
        }, 2000);
    };

    const handleMouseLeaveModal = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setHoveredArticle(null);
        };
        if (hoveredArticle) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [hoveredArticle]);
    return (
        <section
            style={{
                background: "#F6F7FB",   // confirmed from live page
                paddingBlock: "44px 56px",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 24px",
                }}
            >
                {/* ── Page label ── */}
                <p
                    style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#7C3AED",
                        marginBottom: "10px",
                        letterSpacing: "0.01em",
                    }}
                >
                    The Segmento Pulse Blog
                </p>

                {/* ── H1 ── */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                        fontSize: "clamp(40px, 5vw, 56px)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.0,
                        color: "#111827",
                        marginBottom: "28px",
                    }}
                >
                    Real-time tech insights<br />and deep-dive analysis.
                </motion.h1>

                {/* ── 3-Column grid ── */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr 220px",
                        gap: "20px",
                        alignItems: "start",
                    }}
                >
                    {/* ═══════════════════════════════════════════
              COL A — 3 stacked small cards
              Each: SVG illustration (4:3) + badge + title
              ═══════════════════════════════════════════ */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
                    >
                        {leftCards.map((card, idx) => (
                            <a
                                key={card.id || idx}
                                href={card.href || card.url || "#"}
                                style={CARD_BASE}
                                onMouseEnter={(e) => { onEnter("0 4px 16px rgba(0,0,0,0.08)")(e); handleMouseEnterModal(card); }}
                                onMouseLeave={(e) => { onLeave(e); handleMouseLeaveModal(); }}
                            >
                                {/* Illustration — 4:3 aspect ratio */}
                                <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "#fff" }}>
                                    <img
                                        src={card.imgSrc}
                                        alt={card.imgAlt}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                        loading="lazy"
                                    />
                                </div>

                                {/* Card body */}
                                <div style={{ padding: "12px 13px 14px" }}>
                                    <CategoryBadge
                                        tag={card.tag}
                                        showDot
                                        style={{ marginBottom: "7px" }}
                                    />
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            lineHeight: 1.4,
                                            color: "#111827",
                                            /* line-clamp via -webkit- */
                                            overflow: "hidden",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical" as const,
                                        }}
                                    >
                                        {card.title}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </motion.div>

                    {/* ═══════════════════════════════════════════
              COL B — Large featured card + 3-card row
              ═══════════════════════════════════════════ */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
                    >

                        {/* Large featured card */}
                        <a
                            href={centerFeatured.href || centerFeatured.url || "#"}
                            style={CARD_BASE}
                            onMouseEnter={(e) => { onEnter("0 6px 24px rgba(0,0,0,0.09)")(e); handleMouseEnterModal(centerFeatured); }}
                            onMouseLeave={(e) => { onLeave(e); handleMouseLeaveModal(); }}
                        >
                            {/* Full-width SVG illustration — 16:9 */}
                            <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "#fff" }}>
                                <img
                                    src={centerFeatured.imgSrc}
                                    alt={centerFeatured.imgAlt}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>

                            {/* Card body */}
                            <div style={{ padding: "18px 20px 20px" }}>
                                {/* Badge + date on the same row (exact Prismic layout) */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        marginBottom: "11px",
                                    }}
                                >
                                    <CategoryBadge tag={centerFeatured.tag || "News"} showDot />
                                    <span style={{ fontSize: "13px", color: "#6B7280" }}>
                                        {centerFeatured.date || "Just now"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2
                                    style={{
                                        fontSize: "21px",
                                        fontWeight: 800,
                                        lineHeight: 1.25,
                                        letterSpacing: "-0.02em",
                                        color: "#111827",
                                        marginBottom: "9px",
                                    }}
                                >
                                    {centerFeatured.title}
                                </h2>

                                {/* Excerpt */}
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "#4B5563",
                                        lineHeight: 1.6,
                                        marginBottom: "16px",
                                        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const
                                    }}
                                >
                                    {centerFeatured.excerpt || centerFeatured.description}
                                </p>

                                {/* Author + view count */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <AuthorAvatar name={centerFeatured.author || "Pulse Staff"} />
                                    <ViewCount count={centerFeatured.views || 0} />
                                </div>
                            </div>
                        </a>

                        {/* 3-card bottom row */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "12px",
                            }}
                        >
                            {centerBottom.map((card, idx) => (
                                <a
                                    key={card.id || idx}
                                    href={card.href || card.url || "#"}
                                    style={CARD_BASE}
                                    onMouseEnter={(e) => { onEnter("0 4px 14px rgba(0,0,0,0.08)")(e); handleMouseEnterModal(card); }}
                                    onMouseLeave={(e) => { onLeave(e); handleMouseLeaveModal(); }}
                                >
                                    {/* Small illustration — 4:3 */}
                                    <div
                                        style={{ aspectRatio: "4/3", overflow: "hidden", background: "#fff" }}
                                    >
                                        <img
                                            src={card.imgSrc}
                                            alt={card.imgAlt}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Card body */}
                                    <div style={{ padding: "9px 11px 12px" }}>
                                        <CategoryBadge
                                            tag={card.tag}
                                            showDot
                                            style={{ marginBottom: "5px" }}
                                        />
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                lineHeight: 1.4,
                                                color: "#111827",
                                                marginBottom: "8px",
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical" as const,
                                            }}
                                        >
                                            {card.title}
                                        </p>

                                        {/* Author + stats row */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                flexWrap: "wrap",
                                                gap: "4px",
                                            }}
                                        >
                                            <AuthorAvatar name={card.author} />
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <ViewCount count={card.views} />
                                                <CommentCount count={card.comments} />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* ═══════════════════════════════════════════
              COL C — Numbered popularity list
              01–06, title + view count + trend arrow
              ═══════════════════════════════════════════ */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    >
                        {RIGHT_LIST.map((item, idx) => (
                            <a
                                key={item.id}
                                href="#"
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    padding: "11px 0",
                                    borderBottom: idx < RIGHT_LIST.length - 1
                                        ? "1px solid #F3F4F6"
                                        : "none",
                                    textDecoration: "none",
                                    color: "inherit",
                                    transition: "opacity 140ms",
                                }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.72")}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                            >
                                {/* Index number */}
                                <span
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        color: "#D1D5DB",
                                        minWidth: "20px",
                                        paddingTop: "2px",
                                        flexShrink: 0,
                                        lineHeight: 1,
                                    }}
                                >
                                    {String(idx + 1).padStart(2, "0")}
                                </span>

                                {/* Title */}
                                <p
                                    style={{
                                        flex: 1,
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        lineHeight: 1.4,
                                        color: "#111827",
                                        minWidth: 0,
                                    }}
                                >
                                    {item.title}
                                </p>

                                {/* View count + trend */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        gap: "3px",
                                        flexShrink: 0,
                                        minWidth: "36px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            color: "#111827",
                                        }}
                                    >
                                        {item.views.toLocaleString()}
                                    </span>
                                    <TrendArrow dir={item.trend} />
                                </div>
                            </a>
                        ))}
                    </motion.aside>
                </div>
            </div>

            {/* OVERLAY PORTAL FOR ARTICLE MODAL */}
            {hoveredArticle && typeof window !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setHoveredArticle(null)}
                >
                    <div
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setHoveredArticle(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <ArticleDetailView
                            article={{
                                url: hoveredArticle.url || hoveredArticle.id || "",
                                title: hoveredArticle.title,
                                description: hoveredArticle.excerpt || hoveredArticle.description || "Detailed summary omitted from this minimal view.",
                                image_url: hoveredArticle.imgSrc || hoveredArticle.image_url || "/pulse/placeholder-news.svg",
                                published_at: hoveredArticle.date || hoveredArticle.published_at || new Date().toISOString(),
                                source: hoveredArticle.author || hoveredArticle.source || "Pulse Staff",
                                category: hoveredArticle.tag || hoveredArticle.category || "News",
                                id: hoveredArticle.id || hoveredArticle.url || ""
                            }}
                            isModal={true}
                        />
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}
