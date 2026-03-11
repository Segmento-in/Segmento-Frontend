"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { NavBar } from "@/components/layout/NavBar";
import ArticleDetailView from "@/components/ArticleDetailView";
import Link from "next/link";
import { fetchNewsByCategory } from "@/lib/newsApi";
import { formatDate } from "@/components/shared/AuthorMetaBlock";

export type Article = {
    id: string;
    tag: string;
    title: string;
    author: string;
    date: string;
    views: number;
    imgSrc: string;
    imgAlt: string;
    url?: string;
};

export type CategoryPageProps = {
    title: string;
    subtitle: string;
    heroBgColor: string;
    heroIconShapeColor?: string;
    heroIcon?: React.ReactNode;
    tags: string[];
    featuredArticles: Article[];
    listArticles: Article[];
    categorySlug?: string;
    subCategories?: Array<{ id: string; name: string }>;
};

const CARD_BASE_CLASSES = "block bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-[10px] overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:-translate-y-1 cursor-pointer text-inherit no-underline";

const aestheticColors = [
    "bg-sky-50 dark:bg-sky-900/20",
    "bg-purple-50 dark:bg-purple-900/20",
    "bg-amber-50 dark:bg-amber-900/20",
    "bg-emerald-50 dark:bg-emerald-900/20",
    "bg-rose-50 dark:bg-rose-900/20",
];

function AuthorAvatar({ name }: { name: string }) {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span
                aria-hidden="true"
                style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: `hsl(${hue},60%,48%)`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "10px", fontWeight: 700,
                    color: "#fff", flexShrink: 0,
                }}
            >
                {initials}
            </span>
            <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>By {name}</span>
        </div>
    );
}

function ViewCount({ count }: { count: number }) {
    return (
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#9CA3AF", fontSize: "12px", fontWeight: 600 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            {count.toLocaleString()}
        </span>
    );
}

export function CategoryPageTemplate({
    title, subtitle, heroBgColor, heroIconShapeColor = "rgba(255,255,255,0.4)",
    heroIcon, tags, featuredArticles, listArticles, categorySlug, subCategories = [],
}: CategoryPageProps) {
    // Infinite Scroll State
    const [clientListArticles, setClientListArticles] = useState<Article[]>(listArticles);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(listArticles.length >= 28); // Standard heuristic for "more exists"
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMore = useCallback(async () => {
        if (!categorySlug || isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        try {
            const data = await fetchNewsByCategory(categorySlug, page, 30);
            if (!data || data.length === 0) {
                setHasMore(false);
            } else {
                const mappedArticles = data.map((a: any) => ({
                    ...a,
                    id: String(a.id || a.$id || a.url),
                    tag: String(a.tag || a.category || "News"),
                    author: String(a.source || a.author || "Pulse"),
                    date: String(a.published_at || new Date().toISOString()),
                    views: Number(a.views || 0),
                    imgSrc: String(a.image_url || "/pulse/placeholder-news.svg"),
                    imgAlt: String(a.title || "Article Image"),
                    url: String(a.url || "#")
                }));
                // Use a functional update to avoid missing updates
                setClientListArticles(prev => {
                    // Prevent duplicates in case of strict mode double-firing
                    const existingIds = new Set(prev.map(p => p.id));
                    const newUnique = mappedArticles.filter(m => !existingIds.has(m.id));
                    return [...prev, ...newUnique];
                });
                setPage(p => p + 1);
                if (data.length < 30) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Infinite scroll fetch error:", error);
            setHasMore(false);
        } finally {
            setIsLoadingMore(false);
        }
    }, [categorySlug, isLoadingMore, hasMore, page]);

    // Modal Hover State Handlers
    const [hoveredArticle, setHoveredArticle] = useState<Article | null>(null);
    const handleClickModal = (e: React.MouseEvent, art: Article) => {
        e.preventDefault();
        setHoveredArticle(art);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setHoveredArticle(null);
        };
        if (hoveredArticle) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [hoveredArticle]);

    return (
        <>
            <NavBar />
            <main style={{ minHeight: "100vh", paddingBottom: "80px" }}>

                {/* ── HERO BANNER ── */}
                <section
                    style={{
                        background: heroBgColor,
                        padding: "64px 24px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {heroIcon && (
                        <div
                            style={{
                                width: "48px", height: "48px", background: heroIconShapeColor,
                                borderRadius: "12px", display: "flex", alignItems: "center",
                                justifyContent: "center", marginBottom: "16px", color: "#111827",
                            }}
                        >
                            {heroIcon}
                        </div>
                    )}
                    <h1
                        style={{
                            fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 800, color: "#111827",
                            letterSpacing: "-0.03em", marginBottom: "16px",
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            fontSize: "16px", color: "#4B5563", maxWidth: "500px", lineHeight: 1.6,
                        }}
                    >
                        {subtitle}
                    </p>
                </section>

                {/* ── CONTENT CONTAINER ── */}
                <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>

                    {/* ── SUB-CATEGORIES ROUTING BAR (Premium UI) ── */}
                    {subCategories.length > 0 && (
                        <div style={{ marginBottom: "24px" }}>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <div
                                    style={{
                                        display: "flex", gap: "10px", overflowX: "auto", scrollbarWidth: "none",
                                        msOverflowStyle: "none", paddingBottom: "12px", flexWrap: "wrap", justifyContent: "center", width: "100%"
                                    }}
                                >
                                    {/* Mapped Subcategories to API Endpoints */}
                                    {subCategories.map((cat) => {
                                        const isActive = categorySlug === cat.id;
                                        const providerName = cat.id.replace('cloud-', '');
                                        const cloudProviders = ['aws', 'gcp', 'azure', 'ibm', 'oracle', 'digitalocean', 'salesforce', 'alibaba', 'tencent', 'huawei', 'cloudflare'];
                                        const isCloudProvider = cat.id.startsWith('cloud-') && cloudProviders.includes(providerName);

                                        return (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.id}`}
                                                style={{
                                                    padding: "8px 16px",
                                                    background: isActive ? heroIconShapeColor : "#F8FAFC",
                                                    color: isActive ? "#ffffff" : "#334155",
                                                    borderRadius: "8px", fontSize: "14px", fontWeight: isActive ? 600 : 500,
                                                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                                                    transition: "background 150ms, color 150ms",
                                                    textDecoration: "none"
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (isActive) return;
                                                    const el = e.currentTarget as HTMLElement;
                                                    el.style.background = "#F1F5F9"; el.style.color = "#0F172A";
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (isActive) return;
                                                    const el = e.currentTarget as HTMLElement;
                                                    el.style.background = "#F8FAFC"; el.style.color = "#334155";
                                                }}
                                            >
                                                {isCloudProvider && (
                                                    <img
                                                        src={`/pulse/cloud-logos/${providerName.toLowerCase()}.svg`}
                                                        alt={`${cat.name} logo`}
                                                        style={{ width: "16px", height: "16px", objectFit: "contain" }}
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = `/pulse/cloud-logos/${providerName.toLowerCase()}.png`;
                                                        }}
                                                    />
                                                )}
                                                {cat.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {featuredArticles.length === 0 && clientListArticles.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 20px" }}>
                            <svg style={{ margin: "0 auto 16px", width: "48px", height: "48px", color: "#D1D5DB" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p style={{ color: "#6B7280", fontSize: "16px", fontWeight: 500 }}>No news available for this category</p>
                        </div>
                    ) : (
                        <>
                            {/* ── FEATURED GRID (Top 2) ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {featuredArticles.map((art, idx) => (
                                    <a key={art.id} href={art.url || "#"} className={CARD_BASE_CLASSES}
                                        onClick={(e) => handleClickModal(e, art)}>
                                        <div className={`aspect-[16/10] overflow-hidden ${aestheticColors[idx % aestheticColors.length]}`}>
                                            <img
                                                src={art.imgSrc} alt={art.imgAlt} loading="lazy"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div style={{ padding: "20px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                                                <CategoryBadge tag={art.tag} showDot />
                                                <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>{formatDate(art.date) || art.date}</span>
                                            </div>
                                            <h3
                                                style={{
                                                    fontSize: "22px", fontWeight: 800, lineHeight: 1.3,
                                                    letterSpacing: "-0.01em", marginBottom: "24px",
                                                }}
                                            >
                                                {art.title}
                                            </h3>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <AuthorAvatar name={art.author} />
                                                <ViewCount count={art.views} />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* ── LIST ARTICLES (Horizontal Row Cards) ── */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                                {clientListArticles.map((art, idx) => (
                                    <a key={art.id} href={art.url || "#"} className={`${CARD_BASE_CLASSES} flex flex-col sm:flex-row h-auto sm:h-[180px]`}
                                        onClick={(e) => handleClickModal(e, art)}>
                                        <div className={`w-full sm:w-[35%] h-[180px] sm:h-full overflow-hidden border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-slate-700/50 ${aestheticColors[(idx + featuredArticles.length) % aestheticColors.length]}`}>
                                            <img
                                                src={art.imgSrc} alt={art.imgAlt} loading="lazy"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div className="w-full sm:w-[65%] p-5 sm:p-6 flex flex-col justify-center">
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                                                <CategoryBadge tag={art.tag} showDot />
                                                <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>{formatDate(art.date) || art.date}</span>
                                            </div>
                                            <h4
                                                style={{
                                                    fontSize: "18px", fontWeight: 700, lineHeight: 1.3,
                                                    letterSpacing: "-0.01em", marginBottom: "16px",
                                                }}
                                            >
                                                {art.title}
                                            </h4>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                                                <AuthorAvatar name={art.author} />
                                                <ViewCount count={art.views} />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── LOAD MORE SPINNER/DETECTOR ── */}
                    <div style={{ display: "flex", justifyContent: "center", padding: "20px", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        {hasMore && clientListArticles.length > 0 && (
                            <button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                style={{
                                    padding: "12px 24px", background: "#111827", color: "#ffffff",
                                    border: "none", borderRadius: "12px", fontWeight: 600,
                                    cursor: isLoadingMore ? "not-allowed" : "pointer",
                                    opacity: isLoadingMore ? 0.7 : 1, transition: "all 150ms",
                                    display: "flex", alignItems: "center", gap: "8px"
                                }}
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Loading more...</span>
                                    </>
                                ) : (
                                    <span>Load More Articles</span>
                                )}
                            </button>
                        )}
                        {!hasMore && clientListArticles.length > 0 && (
                            <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 500, marginTop: "16px" }}>
                                You've reached the end
                            </span>
                        )}
                    </div>
                </section>
            </main>

            {/* OVERLAY PORTAL FOR ARTICLE MODAL */}
            {hoveredArticle && typeof window !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setHoveredArticle(null)}
                >
                    <div
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
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
                                url: hoveredArticle.url || hoveredArticle.id,
                                title: hoveredArticle.title,
                                description: "Detailed summary omitted from this minimal view. The full details would populate beautifully here.",
                                image_url: hoveredArticle.imgSrc,
                                published_at: hoveredArticle.date,
                                source: hoveredArticle.author,
                                category: hoveredArticle.tag,
                                id: hoveredArticle.id
                            }}
                            isModal={true}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
