"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
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

// utility to darken hex colors for dark mode
function darkenColor(hex: string, amount: number) {
    let c = hex.replace('#','');
    if (c.length === 3) c = c.split('').map(ch=>ch+ch).join('');
    const num = parseInt(c, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
    r = Math.round(r * (1 - amount));
    g = Math.round(g * (1 - amount));
    b = Math.round(b * (1 - amount));
    return `rgb(${r}, ${g}, ${b})`;
}

// utility to create attractive dark mode gradients
function getDarkModeHeroGradient(brandColor: string): string {
    return `linear-gradient(135deg, #0a0a0a 0%, ${brandColor}15 30%, ${brandColor}10 70%, #0a0a0a 100%)`;
}

const CARD_BASE: React.CSSProperties = {
    display: "block",
    background: "var(--pulse-color-card-bg)",
    border: "1px solid var(--pulse-color-border-subtle)",
    borderRadius: "10px",
    overflow: "hidden",
    textDecoration: "none",
    color: "var(--pulse-color-text-primary)",
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

export function CategoryPageTemplate({
    title, subtitle, heroBgColor, heroIconShapeColor = "rgba(255,255,255,0.4)",
    heroIcon, tags, featuredArticles, listArticles, categorySlug,
}: CategoryPageProps) {
    const { theme } = useTheme();

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
                <span style={{ fontSize: "12px", color: "var(--pulse-color-text-muted)", fontWeight: 500 }}>By {name}</span>
            </div>
        );
    }

    function ViewCount({ count }: { count: number }) {
        return (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--pulse-color-text-muted)", fontSize: "12px", fontWeight: 600 }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                {count.toLocaleString()}
            </span>
        );
    }

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

    // Modal Click State Handlers
    const [hoveredArticle, setHoveredArticle] = useState<Article | null>(null);

    const handleClickModal = (art: Article) => {
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
                        position: "relative",
                        background: theme === "dark"
                            ? getDarkModeHeroGradient(heroIconShapeColor || "#7C3AED")
                            : `linear-gradient(135deg, ${heroBgColor} 0%, ${darkenColor(heroBgColor, 0.1)} 100%)`,
                        padding: "80px 24px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflow: "hidden",
                        minHeight: "320px",
                    }}
                >
                    {/* Decorative background elements */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-50px",
                            right: "-50px",
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${heroIconShapeColor}${theme === "dark" ? "30" : "20"} 0%, transparent 70%)`,
                            animation: "float 6s ease-in-out infinite",
                            filter: theme === "dark" ? "blur(1px)" : "none",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-30px",
                            left: "-30px",
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${heroIconShapeColor}${theme === "dark" ? "25" : "15"} 0%, transparent 70%)`,
                            animation: "float 8s ease-in-out infinite reverse",
                            filter: theme === "dark" ? "blur(1px)" : "none",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "20%",
                            left: "10%",
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${heroIconShapeColor}${theme === "dark" ? "20" : "10"} 0%, transparent 70%)`,
                            animation: "float 7s ease-in-out infinite",
                            filter: theme === "dark" ? "blur(0.5px)" : "none",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "60%",
                            right: "15%",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${heroIconShapeColor}${theme === "dark" ? "22" : "12"} 0%, transparent 70%)`,
                            animation: "float 5s ease-in-out infinite reverse",
                            filter: theme === "dark" ? "blur(0.5px)" : "none",
                        }}
                    />
                    {theme === "dark" && (
                        <>
                            <div
                                style={{
                                    position: "absolute",
                                    top: "10%",
                                    right: "20%",
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle, ${heroIconShapeColor}15 0%, transparent 80%)`,
                                    animation: "float 9s ease-in-out infinite",
                                    filter: "blur(2px)",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "15%",
                                    left: "20%",
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle, ${heroIconShapeColor}12 0%, transparent 75%)`,
                                    animation: "float 10s ease-in-out infinite reverse",
                                    filter: "blur(1.5px)",
                                }}
                            />
                        </>
                    )}

                    {/* Main content container */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 2,
                            maxWidth: "600px",
                            margin: "0 auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            animation: "fadeInUp 0.8s ease-out",
                        }}
                    >
                        {heroIcon && (
                            <div
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    background: `linear-gradient(135deg, ${heroIconShapeColor} 0%, ${darkenColor(heroIconShapeColor, 0.2)} 100%)`,
                                    borderRadius: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "24px",
                                    color: "var(--pulse-color-text-inverse)",
                                    boxShadow: theme === "dark" 
                                        ? `0 8px 32px ${heroIconShapeColor}60, 0 0 30px ${heroIconShapeColor}80, 0 0 60px ${heroIconShapeColor}40` 
                                        : `0 8px 32px ${heroIconShapeColor}40`,
                                    transform: "rotate(-5deg)",
                                    animation: "iconBounce 2s ease-in-out infinite",
                                }}
                            >
                                {heroIcon}
                            </div>
                        )}
                        <h1
                            style={{
                                fontSize: "clamp(42px, 5vw, 56px)",
                                fontWeight: 900,
                                color: "var(--pulse-color-text-primary)",
                                letterSpacing: "-0.04em",
                                marginBottom: "20px",
                                lineHeight: 1.1,
                                textShadow: theme === "dark" ? "0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)" : "none",
                                animation: "fadeInUp 0.8s ease-out 0.2s both",
                            }}
                        >
                            {title}
                        </h1>
                        <p
                            style={{
                                fontSize: "18px",
                                color: "var(--pulse-color-text-secondary)",
                                maxWidth: "500px",
                                lineHeight: 1.6,
                                margin: "0 auto",
                                animation: "fadeInUp 0.8s ease-out 0.4s both",
                            }}
                        >
                            {subtitle}
                        </p>
                    </div>
                </section>

                {/* ── CONTENT CONTAINER ── */}
                <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>

                    {/* ── TAG FILTER BAR ── */}
                    <div style={{ marginBottom: "32px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--pulse-color-text-primary)", display: "block", marginBottom: "12px" }}>
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
                                        background: selectedTag === "All" ? "#7C3AED" : "var(--pulse-color-bg-canvas)",
                                        color: selectedTag === "All" ? "#ffffff" : "var(--pulse-color-text-secondary)",
                                        borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                                        border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                        transition: "background 150ms, color 150ms",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedTag === "All") return;
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = "var(--pulse-color-bg-hover)"; el.style.color = "var(--pulse-color-text-primary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedTag === "All") return;
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = "var(--pulse-color-bg-canvas)"; el.style.color = "var(--pulse-color-text-secondary)";
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
                                            background: selectedTag === tag ? "#7C3AED" : "var(--pulse-color-bg-canvas)",
                                            color: selectedTag === tag ? "#ffffff" : "var(--pulse-color-text-secondary)",
                                            borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                                            border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                            transition: "background 150ms, color 150ms",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedTag === tag) return;
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.background = "var(--pulse-color-bg-hover)"; el.style.color = "var(--pulse-color-text-primary)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedTag === tag) return;
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.background = "var(--pulse-color-bg-canvas)"; el.style.color = "var(--pulse-color-text-secondary)";
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
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                            gap: "24px", 
                            marginBottom: "40px",
                            gridAutoRows: "auto",
                        }}
                    >
                        {filteredFeatured.map((art) => (
                            <a key={art.id} href="#" style={{...CARD_BASE, display: "flex", flexDirection: "column", height: "100%"}}
                                onClick={(e) => { e.preventDefault(); handleClickModal(art); }}
                                onMouseEnter={onEnter}
                                onMouseLeave={onLeave}>
                                <div style={{ aspectRatio: "4/3", background: "var(--pulse-color-bg-secondary)", overflow: "hidden", flexShrink: 0 }}>
                                    <img
                                        src={art.imgSrc} alt={art.imgAlt} loading="lazy"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center", gap: "8px" }}>
                                        <CategoryBadge tag={art.tag} showDot />
                                        <span style={{ fontSize: "11px", color: "var(--pulse-color-text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>{art.date}</span>
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: "18px", fontWeight: 800, lineHeight: 1.4,
                                            letterSpacing: "-0.01em", marginBottom: "auto", color: "var(--pulse-color-text-primary)",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {art.title}
                                    </h3>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", gap: "8px" }}>
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
                                onClick={(e) => { e.preventDefault(); handleClickModal(art); }}
                                onMouseEnter={onEnter}
                                onMouseLeave={onLeave}>
                                <div style={{ width: "35%", height: "100%", background: "var(--pulse-color-bg-secondary)", overflow: "hidden", borderRight: "1px solid var(--pulse-color-border)" }}>
                                    <img
                                        src={art.imgSrc} alt={art.imgAlt} loading="lazy"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={{ width: "65%", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center", background: heroBgColor }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                                        <CategoryBadge tag={art.tag} showDot />
                                        <span style={{ fontSize: "12px", color: theme === 'dark' ? '#111827' : 'var(--pulse-color-text-muted)', fontWeight: 500 }}>{art.date}</span>
                                    </div>
                                    <h4
                                        style={{
                                            fontSize: "18px", fontWeight: 700, lineHeight: 1.3,
                                            letterSpacing: "-0.01em", marginBottom: "16px", color: theme === 'dark' ? '#111827' : 'var(--pulse-color-text-primary)',
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
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--pulse-color-text-muted)" }}>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span style={{ fontSize: "14px", fontWeight: 500 }}>Loading more articles...</span>
                            </div>
                        )}
                        {!hasMore && clientListArticles.length > 0 && (
                            <span style={{ fontSize: "14px", color: "var(--pulse-color-text-muted)", fontWeight: 500 }}>
                                You've reached the end
                            </span>
                        )}
                    </div>
                </section>
            </main>

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
