"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { fetchNewsByCategory, type Article } from "@/lib/newsApi";
import ArticleDetailView from "@/components/ArticleDetailView";

const CDN = "https://prismic-main.cdn.prismic.io/prismic-main";

const TOPICS = [
    { id: "ai", label: "AI", tagColor: "#F97316", icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "data", label: "DATA", tagColor: "#10B981", icon: <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "cloud", label: "CLOUD", tagColor: "#EC4899", icon: <path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "magzines", label: "MAGZINES", tagColor: "#3B82F6", icon: <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "articles", label: "ARTICLES", tagColor: "#F59E0B", icon: <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
    { id: "research-papers", label: "RESEARCH PAPERS", tagColor: "#8B5CF6", icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> }
];

export function ArticlesByTopic() {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState("ai");
    const [articlesData, setArticlesData] = useState<Record<string, Article[]>>({});
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        let isMounted = true;

        async function loadArticles() {
            if (articlesData[activeTab]) return; // Use cache
            setLoading(true);
            try {
                const data = await fetchNewsByCategory(activeTab, 1, 4);
                if (isMounted) {
                    setArticlesData(prev => ({ ...prev, [activeTab]: data }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadArticles();

        return () => { isMounted = false; };
    }, [activeTab]);

    const activeArticles = articlesData[activeTab] || [];
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollCards = (dir: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
        }
    };

    return (
        <section style={{ paddingBlock: "80px", borderTop: "1px solid var(--pulse-color-border-subtle)", background: "var(--pulse-color-bg-canvas)" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

                {/* Section Header */}
                <h2 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--pulse-color-text-primary)", marginBottom: "12px" }}>
                    Articles by topic
                </h2>
                <p style={{ fontSize: "15px", color: "var(--pulse-color-text-secondary)", maxWidth: "600px", lineHeight: "1.6", marginBottom: "40px" }}>
                    Dive into our top content categories like headless CMS, Jamstack, CSS frameworks, technical SEO, and more - learn from industry experts.
                </p>

                {/* Tabs Row */}
                <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "12px", marginBottom: "32px", scrollbarWidth: "none" }}>
                    {TOPICS.map(topic => {
                        const isActive = activeTab === topic.id;
                        return (
                            <button
                                key={topic.id}
                                onClick={() => setActiveTab(topic.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    padding: "10px 16px",
                                    borderRadius: "8px",
                                    border: isActive ? `1px solid ${topic.tagColor}` : "1px solid var(--pulse-color-border-subtle)",
                                    background: "var(--pulse-color-card-bg)",
                                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                                    cursor: "pointer",
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: "13px",
                                    color: isActive ? "var(--pulse-color-text-primary)" : "var(--pulse-color-text-secondary)",
                                    flexShrink: 0,
                                    transition: "all 0.2s"
                                }}
                            >
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    width: "20px", height: "20px",
                                    color: isActive ? topic.tagColor : "var(--pulse-color-text-muted)",
                                    background: isActive ? `${topic.tagColor}15` : "var(--pulse-color-bg-canvas)",
                                    borderRadius: "4px"
                                }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                        {topic.icon}
                                    </svg>
                                </div>
                                {topic.label}
                            </button>
                        );
                    })}
                </div>

                {/* Sub-tags and Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingLeft: "4px" }}>
                    <div style={{ display: "flex", gap: "24px" }}>
                        <button style={{
                            background: "none", border: "none", fontSize: "14px", fontWeight: 700,
                            color: "#F97316", paddingBottom: "4px", borderBottom: "2px solid #F97316", cursor: "pointer"
                        }}>
                            All
                        </button>
                        <button style={{
                            background: "none", border: "none", fontSize: "14px", fontWeight: 600,
                            color: "var(--pulse-color-text-muted)", cursor: "pointer"
                        }}>
                            AI
                        </button>
                    </div>
                    {/* Circular pagination arrows */}
                    <div style={{ display: "flex", gap: "8px" }}>
                        {["ΓåÉ", "ΓåÆ"].map(arrow => (
                            <button
                                key={arrow}
                                onClick={() => scrollCards(arrow === "ΓåÉ" ? "left" : "right")}
                                style={{
                                    width: "32px", height: "32px",
                                    border: "1px solid var(--pulse-color-border-subtle)", borderRadius: "50%",
                                    background: arrow === "ΓåÉ" ? "var(--pulse-color-bg-canvas)" : "var(--pulse-color-card-bg)",
                                    cursor: "pointer", fontSize: "14px", lineHeight: 1,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: arrow === "ΓåÉ" ? "var(--pulse-color-text-muted)" : "var(--pulse-color-text-primary)",
                                    fontFamily: "inherit",
                                }}
                            >
                                {arrow}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                <div ref={scrollRef} style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px", scrollbarWidth: "none" }}>
                    {activeArticles.map((art, idx) => (
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                            key={art.$id || idx} href={art.url || "#"} target="_blank" rel="noopener noreferrer" style={{
                                display: "block", width: "280px", flexShrink: 0,
                                border: "1px solid var(--pulse-color-border-subtle)", borderRadius: "10px", overflow: "hidden",
                                textDecoration: "none", background: "var(--pulse-color-card-bg)", color: "var(--pulse-color-text-primary)",
                                transition: "box-shadow 0.2s",
                            }} onMouseEnter={e => { ((e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"); handleMouseEnterModal(art); }}
                            onMouseLeave={e => { ((e.currentTarget as HTMLElement).style.boxShadow = "none"); handleMouseLeaveModal(); }}>

                            <div style={{
                                height: "160px", background: "var(--pulse-color-bg-canvas)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                borderBottom: "1px solid var(--pulse-color-border-subtle)"
                            }}>
                                {/* Simulating the specific grid + 3d cube vector pattern */}
                                <img src={art.imgSrc} alt={art.title} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                            </div>

                            <div style={{ padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F97316" }} />
                                        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--pulse-color-text-secondary)" }}>{art.tag?.substring(0, 15)}</span>
                                    </div>
                                    <span style={{ fontSize: "11px", color: "var(--pulse-color-text-muted)", fontWeight: 500 }}>{art.date ? new Date(art.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today"}</span>
                                </div>
                                <h3 style={{
                                    fontSize: "15px", fontWeight: 700, color: "var(--pulse-color-text-primary)", lineHeight: 1.4, marginBottom: "20px",
                                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                                }}>
                                    {art.title}
                                </h3>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#111827", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                    </div>
                                    <span style={{ fontSize: "12px", color: "var(--pulse-color-text-secondary)", fontWeight: 500 }}>By {art.author}</span>
                                </div>
                            </div>
                        </motion.a>
                    ))}

                    {/* Explore More Card */}
                    <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                        href="/latest-articles"
                        style={{
                            display: "flex", flexDirection: "column", justifyContent: "space-between",
                            width: "280px", flexShrink: 0, padding: "24px",
                            border: "1px solid var(--pulse-color-accent-orange-light)", borderRadius: "10px",
                            background: "var(--pulse-color-accent-orange-bg)", textDecoration: "none", color: "var(--pulse-color-accent-orange)"
                        }}>
                        <div>
                            <div style={{
                                width: "32px", height: "32px", borderRadius: "8px", background: "var(--pulse-color-accent-orange-light)",
                                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "var(--pulse-color-accent-orange)"
                            }}>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--pulse-color-accent-orange)", lineHeight: 1.4 }}>
                                Explore more articles about What&apos;s next
                            </h3>
                        </div>
                        <div style={{
                            background: "var(--pulse-color-accent-orange)", color: "#fff", display: "inline-block",
                            padding: "8px 16px", borderRadius: "99px", fontSize: "12px",
                            fontWeight: 600, width: "max-content"
                        }}>
                            Explore more
                        </div>
                    </motion.a>
                </div>
            </div>

            {/* OVERLAY PORTAL FOR ARTICLE MODAL */}
            {hoveredArticle && typeof window !== 'undefined' && createPortal(
                <div
                    className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 ${theme === 'dark' ? 'dark' : ''}`}
                    onClick={() => setHoveredArticle(null)}
                >
                    <div
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
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
                                description: hoveredArticle.description || "Detailed summary omitted from this minimal view.",
                                image_url: hoveredArticle.image_url || "/pulse/placeholder-news.svg",
                                published_at: hoveredArticle.published_at || new Date().toISOString(),
                                source: hoveredArticle.source || "Pulse Staff",
                                category: hoveredArticle.category || "News",
                                id: hoveredArticle.$id || hoveredArticle.url || ""
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
