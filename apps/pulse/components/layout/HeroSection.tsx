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
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import ArticleDetailView from "@/components/ArticleDetailView";
import { formatDate } from "@/components/shared/AuthorMetaBlock";

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
            <span style={{ fontSize: "12px", color: "var(--pulse-color-text-secondary)" }}>By {name}</span>
        </div>
    );
}

/** Eye icon + view count */
function ViewCount({ count }: { count: number }) {
    return (
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--pulse-color-text-muted)", fontSize: "12px" }}>
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
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--pulse-color-text-muted)", fontSize: "12px" }}>
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

// ── HOVER HELPERS ────────────────────────────────────────────────
const CARD_BASE_CLASSES = "block bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl overflow-hidden text-slate-900 dark:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10";

const aestheticColors = [
    "bg-sky-50 dark:bg-sky-900/30",
    "bg-purple-50 dark:bg-purple-900/30",
    "bg-amber-50 dark:bg-amber-900/30",
    "bg-emerald-50 dark:bg-emerald-900/30",
    "bg-rose-50 dark:bg-rose-900/30"
];

// ── MAIN COMPONENT ───────────────────────────────────────────
export function HeroSection({
    leftCards = [],
    centerFeatured = null,
    centerBottom = [],
    rightList = []
}: HeroSectionProps = {}) {
    const { theme } = useTheme();
    const [hoveredArticle, setHoveredArticle] = useState<any | null>(null);
    const handleClickModal = (art: any) => {
        setHoveredArticle(art);
    };

    const handleCloseModal = () => {
        setHoveredArticle(null);
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
                background: "var(--pulse-color-bg-hero)",   // confirmed from live page
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
                        color: "var(--pulse-color-brand-purple)",
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
                        color: "var(--pulse-color-text-primary)",
                        marginBottom: "28px",
                    }}
                >
                    Real-time tech insights<br />and deep-dive analysis.
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_220px] gap-5 items-start">
                    {/* ═══════════════════════════════════════════
              COL A — 3 stacked small cards
              Each: SVG illustration (4:3) + badge + title
              ═══════════════════════════════════════════ */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                    >
                        {leftCards.map((card, idx) => (
                            <a
                                key={card.id || idx}
                                href={card.href || card.url || "#"}
                                className={`${CARD_BASE_CLASSES} min-h-[260px] flex flex-col bg-white dark:bg-slate-800`}
                                onClick={(e) => { e.preventDefault(); handleClickModal(card); }}
                            >
                                {/* Illustration — taller 3:2 aspect ratio */}
                                <div className={`aspect-[3/2] overflow-hidden flex items-center justify-center ${aestheticColors[idx % 5]}`}>
                                    <img
                                        src={card.imgSrc || "/pulse/placeholder-news.svg"}
                                        alt={card.imgAlt || "Article"}
                                        className="w-full h-full object-cover block"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/pulse/placeholder-news.svg";
                                        }}
                                    />
                                </div>

                                {/* Card body */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <CategoryBadge
                                            tag={card.tag}
                                            showDot
                                            style={{ marginBottom: "8px" }}
                                        />
                                        <p
                                            className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-white line-clamp-3"
                                        >
                                            {card.title}
                                        </p>
                                    </div>
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
                        {/* Large featured card */}
                        {centerFeatured && (
                            <a
                                href={centerFeatured.href || centerFeatured.url || "#"}
                                className={`${CARD_BASE_CLASSES} bg-white dark:bg-slate-800`}
                                onClick={(e) => { e.preventDefault(); handleClickModal(centerFeatured); }}
                            >
                                {/* Full-width SVG illustration — 16:9 */}
                                <div className={`aspect-[16/9] overflow-hidden flex items-center justify-center ${aestheticColors[3]}`}>
                                    <img
                                        src={centerFeatured.imgSrc || "/pulse/placeholder-news.svg"}
                                        alt={centerFeatured.imgAlt || "Featured Article"}
                                        className="w-full h-full object-cover block"
                                        loading="eager"
                                        fetchPriority="high"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/pulse/placeholder-news.svg";
                                        }}
                                    />
                                </div>

                                {/* Card body */}
                                <div className="p-5">
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
                                        <span style={{ fontSize: "13px", color: "var(--pulse-color-text-secondary)" }}>
                                            {formatDate(centerFeatured.date || centerFeatured.published_at) || "Just now"}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2
                                        className="text-xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white mb-2"
                                    >
                                        {centerFeatured.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p
                                        className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2"
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
                                        <AuthorAvatar name={centerFeatured.author || centerFeatured.source || "Pulse Staff"} />
                                        <ViewCount count={centerFeatured.views || 0} />
                                    </div>
                                </div>
                            </a>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {centerBottom.map((card, idx) => (
                                <a
                                    key={card.id || idx}
                                    href={card.href || card.url || "#"}
                                    className={`${CARD_BASE_CLASSES} bg-white dark:bg-slate-800`}
                                    onClick={(e) => { e.preventDefault(); handleClickModal(card); }}
                                >
                                    {/* Small illustration — 4:3 */}
                                    <div className={`aspect-[4/3] overflow-hidden flex items-center justify-center ${aestheticColors[(idx + 1) % 5]}`}>
                                        <img
                                            src={card.imgSrc || "/pulse/placeholder-news.svg"}
                                            alt={card.imgAlt || "Article"}
                                            className="w-full h-full object-cover block"
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/pulse/placeholder-news.svg";
                                            }}
                                        />
                                    </div>

                                    {/* Card body */}
                                    <div className="p-3">
                                        <CategoryBadge
                                            tag={card.tag}
                                            showDot
                                            style={{ marginBottom: "5px" }}
                                        />
                                        <p
                                            className="text-xs font-semibold leading-tight text-slate-900 dark:text-white mb-2 line-clamp-2"
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
                        {rightList && rightList.map((item, idx) => (
                            <a
                                key={item.id}
                                href={item.url || item.href || "#"}
                                className={`${CARD_BASE_CLASSES} flex items-start gap-3 p-3 py-2.5 mb-2.5 bg-white dark:bg-slate-800`}
                                onClick={(e) => { e.preventDefault(); handleClickModal(item); }}
                            >
                                {/* Index number */}
                                <span
                                    className="text-xs font-bold text-slate-400 dark:text-slate-500 pt-1 shrink-0 min-w-[20px]"
                                >
                                    {String(idx + 1).padStart(2, "0")}
                                </span>

                                {/* Title */}
                                <p
                                    className="flex-1 text-[13px] font-semibold leading-relaxed text-slate-900 dark:text-white line-clamp-2"
                                >
                                    {item.title}
                                </p>

                                {/* View count + trend */}
                                <div
                                    className="flex flex-col items-end gap-1 shrink-0 min-w-[36px]"
                                >
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            color: "var(--pulse-color-text-primary)",
                                        }}
                                    >
                                        {(item.views || 0).toLocaleString()}
                                    </span>
                                    <TrendArrow dir={item.trend || "up"} />
                                </div>
                            </a>
                        ))}
                    </motion.aside>
                </div>
            </div>

            {/* OVERLAY PORTAL FOR ARTICLE MODAL */}
            {hoveredArticle && typeof window !== 'undefined' && createPortal(
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 ${theme === 'dark' ? 'dark' : ''}`}
                    onClick={handleCloseModal}
                >
                    <div
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 dark:bg-white/50 dark:hover:bg-white/70 text-white dark:text-black rounded-full transition-colors"
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
