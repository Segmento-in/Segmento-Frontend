"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { NavBar } from "@/components/organisms/NavBar";
import ArticleDetailView from "@/components/ArticleDetailView";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { fetchNewsByCategory } from "@/lib/newsApi";

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
};

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

const onEnter = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
    el.style.transform = "translateY(-2px)";
};
const onLeave = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.boxShadow = "none";
    el.style.transform = "translateY(0)";
};

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
    heroIcon, tags, featuredArticles, listArticles, categorySlug,
}: CategoryPageProps) {
    const [selectedTag, setSelectedTag] = useState<string>("All");

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

    const { lastElementRef } = useInfiniteScroll(loadMore, hasMore, isLoadingMore);

    // Modal Hover State Handlers
    const [hoveredArticle, setHoveredArticle] = useState<Article | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnterModal = (art: Article) => {
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

    const filteredFeatured = selectedTag === "All"
        ? featuredArticles
        : featuredArticles.filter(a => a.tag === selectedTag);

    const filteredList = selectedTag === "All"
        ? clientListArticles
        : clientListArticles.filter(a => a.tag === selectedTag);

    const dynamicTags = Array.from(new Set([
        ...featuredArticles.map(a => a.tag),
        ...clientListArticles.map(a => a.tag)
    ]));

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

                    {/* ── TAG FILTER BAR ── */}
                    <div style={{ marginBottom: "32px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827", display: "block", marginBottom: "12px" }}>
                            Filter by tag
                        </span>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <div
                                style={{
                                    display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none",
                                    msOverflowStyle: "none", paddingBottom: "8px",
                                }}
                            >
                                <button
                                    onClick={() => setSelectedTag("All")}
                                    style={{
                                        padding: "6px 16px",
                                        background: selectedTag === "All" ? "#7C3AED" : "#F3F4F6",
                                        color: selectedTag === "All" ? "#ffffff" : "#4B5563",
                                        borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                                        border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                        transition: "background 150ms, color 150ms",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedTag === "All") return;
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = "#E5E7EB"; el.style.color = "#111827";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedTag === "All") return;
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = "#F3F4F6"; el.style.color = "#4B5563";
                                    }}
                                >
                                    All
                                </button>
                                {dynamicTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        style={{
                                            padding: "6px 16px",
                                            background: selectedTag === tag ? "#7C3AED" : "#F3F4F6",
                                            color: selectedTag === tag ? "#ffffff" : "#4B5563",
                                            borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                                            border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                            transition: "background 150ms, color 150ms",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedTag === tag) return;
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.background = "#E5E7EB"; el.style.color = "#111827";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedTag === tag) return;
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.background = "#F3F4F6"; el.style.color = "#4B5563";
                                        }}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── FEATURED GRID (Top 2) ── */}
                    <div
                        style={{
                            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                            gap: "24px", marginBottom: "24px",
                        }}
                    >
                        {filteredFeatured.map((art) => (
                            <a key={art.id} href="#" style={CARD_BASE}
                                onMouseEnter={(e) => { onEnter(e); handleMouseEnterModal(art); }}
                                onMouseLeave={(e) => { onLeave(e); handleMouseLeaveModal(); }}>
                                <div style={{ aspectRatio: "16/10", background: "#f9fafb", overflow: "hidden" }}>
                                    <img
                                        src={art.imgSrc} alt={art.imgAlt} loading="lazy"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={{ padding: "20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                                        <CategoryBadge tag={art.tag} showDot />
                                        <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>{art.date}</span>
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
                        {filteredList.map((art) => (
                            <a key={art.id} href="#" style={{ ...CARD_BASE, display: "flex", flexDirection: "row", height: "180px" }}
                                onMouseEnter={(e) => { onEnter(e); handleMouseEnterModal(art); }}
                                onMouseLeave={(e) => { onLeave(e); handleMouseLeaveModal(); }}>
                                <div style={{ width: "35%", height: "100%", background: "#f9fafb", overflow: "hidden", borderRight: "1px solid #E5E7EB" }}>
                                    <img
                                        src={art.imgSrc} alt={art.imgAlt} loading="lazy"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={{ width: "65%", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                                        <CategoryBadge tag={art.tag} showDot />
                                        <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>{art.date}</span>
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

                    {/* ── LOAD MORE SPINNER/DETECTOR ── */}
                    <div ref={lastElementRef} style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                        {isLoadingMore && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6B7280" }}>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span style={{ fontSize: "14px", fontWeight: 500 }}>Loading more articles...</span>
                            </div>
                        )}
                        {!hasMore && clientListArticles.length > 0 && (
                            <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 500 }}>
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
