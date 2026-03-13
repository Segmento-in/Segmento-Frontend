"use client";
/**
 * Segmento Pulse — Blog Homepage
 *
 * Component-by-component replica of https://prismic.io/blog
 * Hero section built with real Prismic CDN SVG illustration assets.
 *
 * Page sections (top to bottom):
 *   1. NavBar          — Two-tier sticky nav (brand + subnav)
 *   2. HeroSection     — 3-col: stacked cards | large featured + 3-row | popularity list
 *   3. YouTube strip   — Dark horizontal scroll of video cards
 *   4–6. Topic sections — Sticky header (25%) + 3-col article grid (75%)
 *   7. NewsletterCTA   — Email signup band
 *   8. Articles by topic
 *   9. Changelog strip
 *  10. Bottom CTA band
 *
 * No footer (removed per user directive).
 */

import { useRef } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { HeroSection } from "@/components/layout/HeroSection";
import { NewsletterCTA } from "@/components/layout/NewsletterCTA";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { ArticlesByTopic } from "@/components/layout/ArticlesByTopic";
import { formatDate } from "@/components/shared/AuthorMetaBlock";

// ── TOPIC SECTIONS DATA ─────────────────────────────────────────────
const CDN = "https://prismic-main.cdn.prismic.io/prismic-main";

type TopicArticle = {
    id: string;
    tag: string;
    title: string;
    author: string;
    date: string;
    imgSrc: string;
    imgAlt: string;
    url?: string;
    views?: number;
};

export interface HomePageClientProps {
    heroLeft?: any[];
    heroCenter?: any;
    heroCenterBottom?: any[];
    heroRight?: any[];
    topics?: Array<{
        id: string;
        tag: string;
        title: string;
        description: string;
        articles: TopicArticle[];
    }>;
    videos?: Array<{
        id: string;
        title: string;
        views: number | string;
        date: string;
        tag: string;
        imgSrc: string;
        bg: string;
        url?: string;
    }>;
}

const DEFAULT_TOPIC_SECTIONS: Array<{
    id: string;
    tag: string;
    title: string;
    description: string;
    articles: TopicArticle[];
}> = [
        {
            id: "cloud",
            tag: "CLOUD",
            title: "Explore Cloud Tech",
            description:
                "Build a solid foundation as you select the technologies and tools to help you build a great website faster.",
            articles: [
                {
                    id: "ts1",
                    tag: "CLOUD",
                    title: "Best Next.js Headless CMS Platforms in 2026",
                    author: "Coner Murphy",
                    date: "Mar 2, 2026",
                    imgSrc: `${CDN}/f5abde02-3112-4138-8de7-128e9e9f87a4_headless_intro.svg`,
                    imgAlt: "Headless CMS platforms",
                },
                {
                    id: "ts2",
                    tag: "CLOUD",
                    title: "4 Techniques for Balancing Performance and Server Costs with Next.js",
                    author: "Angelo Ashmore",
                    date: "Feb 28, 2026",
                    imgSrc: `${CDN}/aXujwgIvOtkhCGB4_nextjsCMS.svg`,
                    imgAlt: "Next.js performance",
                },
                {
                    id: "ts3",
                    tag: "CLOUD",
                    title: "Tailwind CSS Grid: Complete Guide & Examples",
                    author: "Coner Murphy",
                    date: "Feb 24, 2026",
                    imgSrc: `${CDN}/5ad3b8c6-fe07-46d1-8fcf-f0742ec3f650_headless.svg`,
                    imgAlt: "Tailwind CSS guide",
                },
                {
                    id: "ts4",
                    tag: "CLOUD",
                    title: "Why You Should Adopt a Headless CMS",
                    author: "Lucie Haberer",
                    date: "Feb 20, 2026",
                    imgSrc: `${CDN}/1dea46fd-52ba-49cb-958e-338b0cfdc15e_AI+Tools+for+Dev+Productivity.svg`,
                    imgAlt: "Headless CMS advantages",
                },
            ],
        },
        {
            id: "magzines",
            tag: "MAGZINES",
            title: "Dive into Magzines",
            description:
                "Streamline your content process to work smarter, maximize efficiency, and delight your users.",
            articles: [
                {
                    id: "w1",
                    tag: "MAGZINES",
                    title: "Content Modeling: Best Practices & How to Get Started",
                    author: "Alison Brunk",
                    date: "Mar 1, 2026",
                    imgSrc: `${CDN}/57f8d02b-eeee-47b4-b1f5-f15c43411b73_content_modeling.svg`,
                    imgAlt: "Content modeling",
                },
                {
                    id: "w2",
                    tag: "AI",
                    title: "AI Tools for Developer Productivity",
                    author: "Lea Thomas",
                    date: "Feb 27, 2026",
                    imgSrc: `${CDN}/1dea46fd-52ba-49cb-958e-338b0cfdc15e_AI+Tools+for+Dev+Productivity.svg`,
                    imgAlt: "AI developer tools",
                },
                {
                    id: "w3",
                    tag: "CLOUD",
                    title: "Everything You Need to Understand Jamstack",
                    author: "Coner Murphy",
                    date: "Feb 23, 2026",
                    imgSrc: `${CDN}/3e264149-6310-4972-b382-a7eda0e98c5d_what-is-jamstack.svg`,
                    imgAlt: "Jamstack explained",
                },
                {
                    id: "w4",
                    tag: "MAGZINES",
                    title: "Building Modern UIs with Server Components",
                    author: "Angelo Ashmore",
                    date: "Feb 15, 2026",
                    imgSrc: `${CDN}/aXoyPAIvOtkhCCoN_GEO.svg`,
                    imgAlt: "Server components",
                },
            ],
        },
        {
            id: "data",
            tag: "DATA",
            title: "Harness Data & Analytics",
            description:
                "Create websites that engage your audience and achieve your business goals.",
            articles: [
                {
                    id: "p1",
                    tag: "DATA",
                    title: "Serving Images in Next-Gen Formats",
                    author: "Nefe Emadamerho-Atori",
                    date: "Feb 26, 2026",
                    imgSrc: `${CDN}/aXoyPAIvOtkhCCoN_GEO.svg`,
                    imgAlt: "Next-gen image formats",
                },
                {
                    id: "p2",
                    tag: "DATA",
                    title: "Minimizing Web Fonts for Better Core Web Vitals",
                    author: "Nefe Emadamerho-Atori",
                    date: "Feb 22, 2026",
                    imgSrc: `${CDN}/f5abde02-3112-4138-8de7-128e9e9f87a4_headless_intro.svg`,
                    imgAlt: "Web fonts optimization",
                },
                {
                    id: "p3",
                    tag: "CLOUD",
                    title: "UX Quick Start for Developers: Key Concepts, Testing & Tips",
                    author: "Nefe Emadamerho-Atori",
                    date: "Feb 18, 2026",
                    imgSrc: `${CDN}/5ad3b8c6-fe07-46d1-8fcf-f0742ec3f650_headless.svg`,
                    imgAlt: "UX for developers",
                },
                {
                    id: "p4",
                    tag: "DATA",
                    title: "Optimizing LCP score for eCommerce sites",
                    author: "Stuart Ross",
                    date: "Feb 10, 2026",
                    imgSrc: `${CDN}/aXujwgIvOtkhCGB4_nextjsCMS.svg`,
                    imgAlt: "LCP Optimization",
                },
            ],
        },
    ];

// ── YOUTUBE VIDEOS ─────────────────────────────────────────────
const YOUTUBE_VIDEOS = [
    { id: "y1", title: "They hacked web fonts?", views: "218", date: "Mar 6, 2026", tag: "CLOUD", imgSrc: `${CDN}/5ad3b8c6-fe07-46d1-8fcf-f0742ec3f650_headless.svg`, bg: "#f0f9ff" },
    { id: "y2", title: "AI Bots are turning against devs - OpenClaw", views: "555", date: "Feb 21, 2026", tag: "AI", imgSrc: `${CDN}/1dea46fd-52ba-49cb-958e-338b0cfdc15e_AI+Tools+for+Dev+Productivity.svg`, bg: "#f5f3ff" },
    { id: "y3", title: "OpenClaw has ruined hacking forever", views: "6.4k", date: "Jan 31, 2026", tag: "RESEARCH PAPERS", imgSrc: `${CDN}/aXoyPAIvOtkhCCoN_GEO.svg`, bg: "#fff7ed" },
    { id: "y4", title: "How Hackers REALLY discovered React2Shell", views: "1.0k", date: "Jan 16, 2026", tag: "RESEARCH PAPERS", imgSrc: `${CDN}/aXujwgIvOtkhCGB4_nextjsCMS.svg`, bg: "#f0fdf4" },
    { id: "y5", title: "Did Cursor copy Webflow?", views: "964", date: "Dec 23, 2025", tag: "CLOUD", imgSrc: `${CDN}/3e264149-6310-4972-b382-a7eda0e98c5d_what-is-jamstack.svg`, bg: "#fdf2f8" },
];

// ── SHARED ─────────────────────────────────────────────────────
const CARD_BASE_CLASSES = "block bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl overflow-hidden text-slate-900 dark:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10";

// Fun aesthetic color combos for article image backgrounds
const aestheticColors = [
    "bg-sky-50 dark:bg-sky-900/30",
    "bg-purple-50 dark:bg-purple-900/30",
    "bg-amber-50 dark:bg-amber-900/30",
    "bg-emerald-50 dark:bg-emerald-900/30",
    "bg-rose-50 dark:bg-rose-900/30"
];

// ── PAGE ───────────────────────────────────────────────────────
export function PulseBlogHomeClient({
    heroLeft,
    heroCenter,
    heroCenterBottom,
    heroRight,
    topics = [],
    videos = []
}: HomePageClientProps) {
    const ytScrollRef = useRef<HTMLDivElement>(null);
    const topicRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollYT = (dir: "left" | "right") => {
        if (ytScrollRef.current) {
            ytScrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
        }
    };

    const scrollTopic = (index: number, dir: "left" | "right") => {
        const el = topicRefs.current[index];
        if (el) {
            el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
        }
    };

    return (
        <>
            {/* ━━━ 1. NAV ━━━ */}
            <NavBar />

            <main>
                {/* ━━━ 2. HERO (3-column, real SVG assets) ━━━ */}
                <HeroSection
                    leftCards={heroLeft}
                    centerFeatured={heroCenter}
                    centerBottom={heroCenterBottom}
                    rightList={heroRight}
                />

                {/* ━━━ 3. YOUTUBE DARK STRIP ━━━ */}
                {videos.length > 0 && (
                    <section style={{ background: "var(--pulse-color-bg-surface-dark)", paddingBlock: "52px" }}>
                        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--pulse-color-text-inverse)", letterSpacing: "-0.01em" }}>
                                    Latest Medium articles
                                </span>
                                {/* Circular pagination arrows */}
                                <div style={{ display: "flex", gap: "8px" }}>
                                    {["←", "→"].map(arrow => (
                                        <button
                                            key={arrow}
                                            onClick={() => scrollYT(arrow === "←" ? "left" : "right")}
                                            style={{
                                                width: "32px", height: "32px",
                                                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%",
                                                background: arrow === "←" ? "rgba(255,255,255,0.05)" : "var(--pulse-color-text-inverse)",
                                                cursor: "pointer", fontSize: "14px", lineHeight: 1,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: arrow === "←" ? "var(--pulse-color-text-muted)" : "var(--pulse-color-text-primary)",
                                                fontFamily: "inherit",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {arrow}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div ref={ytScrollRef} style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "32px", paddingTop: "12px", scrollbarWidth: "none" }}>
                                {videos.map((vid, idx) => (
                                    <a
                                        key={vid.id}
                                        href={vid.url || "#"}
                                        className={`${CARD_BASE_CLASSES} flex-shrink-0 w-[300px] border-white/10 dark:border-white/10 bg-white dark:bg-slate-800`}
                                    >
                                        <div className={`aspect-[4/3] overflow-hidden ${aestheticColors[idx % 5]}`}>
                                            <img src={vid.imgSrc} alt={vid.title} loading="lazy" className="w-full h-full object-cover" />
                                        </div>
                                        <div style={{ padding: "16px 20px" }}>
                                            <CategoryBadge tag={vid.tag} showDot style={{ marginBottom: "10px" }} />
                                            <h4 style={{
                                                fontSize: "15px", fontWeight: 600, lineHeight: 1.4, color: "var(--pulse-color-text-primary)", marginBottom: "12px",
                                                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const
                                            }}>
                                                {vid.title}
                                            </h4>
                                            <span style={{ fontSize: "13px", color: "var(--pulse-color-text-secondary)", fontWeight: 500 }}>{vid.views} views · {formatDate(vid.date) || vid.date}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ━━━ 4–6. TOPIC SECTIONS (3 blocks) ━━━ */}
                {topics.map((section, sIdx) => (
                    <section
                        key={section.id}
                        style={{ paddingBlock: "60px", borderTop: "1px solid var(--pulse-color-border-subtle)" }}
                    >
                        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "40px", alignItems: "start" }}>

                                {/* Left sticky header */}
                                <div style={{ position: "sticky", top: "120px" }}>
                                    <CategoryBadge tag={section.tag} style={{ marginBottom: "14px" }} />
                                    <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: "10px", color: "var(--pulse-color-text-primary)" }}>
                                        {section.title}
                                    </h2>
                                    <p style={{ fontSize: "14px", color: "var(--pulse-color-text-secondary)", lineHeight: 1.65, marginBottom: "18px" }}>
                                        {section.description}
                                    </p>
                                    <a href={`/category/${section.id}`} style={{
                                        display: "inline-flex", alignItems: "center", gap: "5px",
                                        fontSize: "13px", fontWeight: 600, color: "var(--pulse-color-text-primary)",
                                        textDecoration: "none", borderBottom: "1.5px solid var(--pulse-color-text-primary)",
                                        paddingBottom: "1px", marginBottom: "20px",
                                    }}>
                                        Read more →
                                    </a>
                                    {/* Circular pagination arrows */}
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {["←", "→"].map(arrow => (
                                            <button
                                                key={arrow}
                                                onClick={() => scrollTopic(sIdx, arrow === "←" ? "left" : "right")}
                                                style={{
                                                    width: "32px", height: "32px",
                                                    border: "1px solid var(--pulse-color-border-subtle)", borderRadius: "50%",
                                                    background: arrow === "←" ? "var(--pulse-color-bg-canvas)" : "var(--pulse-color-card-bg)",
                                                    cursor: "pointer", fontSize: "14px", lineHeight: 1,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: arrow === "←" ? "var(--pulse-color-text-muted)" : "var(--pulse-color-text-primary)",
                                                    fontFamily: "inherit",
                                                }}
                                            >
                                                {arrow}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right 3-col grid (changed to scrollable flex to support the arrows) */}
                                <div
                                    ref={(el) => {
                                        topicRefs.current[sIdx] = el;
                                    }}
                                    style={{ display: "flex", gap: "16px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "10px" }}
                                >
                                    {section.articles.map((art, aIdx) => (
                                        <a key={art.id} href={art.url || "#"} className={`${CARD_BASE_CLASSES} flex-shrink-0 w-[calc(33.333%-11px)] min-w-[260px] bg-white dark:bg-slate-800`}>
                                            <div className={`aspect-[4/3] overflow-hidden ${aestheticColors[aIdx % 5]} flex items-center justify-center`}>
                                                <img src={art.imgSrc} alt={art.imgAlt} loading="lazy"
                                                    className="w-full h-full object-cover" />
                                            </div>
                                            <div style={{ padding: "12px 14px 16px" }}>
                                                <CategoryBadge tag={art.tag} showDot style={{ marginBottom: "7px" }} />
                                                <h4 style={{
                                                    fontSize: "13px", fontWeight: 600, lineHeight: 1.4, marginBottom: "10px", color: "var(--pulse-color-text-primary)",
                                                    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const
                                                }}>
                                                    {art.title}
                                                </h4>
                                                <span style={{ fontSize: "12px", color: "var(--pulse-color-text-muted)" }}>{art.author} · {formatDate(art.date) || art.date}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* ━━━ 7. NEWSLETTER CTA ━━━ */}
                <NewsletterCTA />

                {/* ━━━ 8. ARTICLES BY TOPIC ━━━ */}
                <ArticlesByTopic />

            </main>
        </>
    );
}
