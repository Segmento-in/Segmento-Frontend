'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import TimeDisplay from '@/components/TimeDisplay';
import ArticleInteraction from '@/components/ArticleInteraction';
import CommentSection from '@/components/CommentSection';
import ViewCounter from '@/components/ViewCounter';
import { incrementArticleView } from '@/lib/analytics';
import AudioSummaryButton from '@/components/AudioSummaryButton';
import { Article } from '@/lib/newsApi';

interface ArticleDetailViewProps {
    article: {
        url: string;
        title: string;
        description: string;
        image_url: string;
        published_at: string;
        source: string;
        category: string;
        id: string; // Appwrite ID
        audio_url?: string;
        text_summary?: string;
    };
    isModal?: boolean; // If true, disables view tracking and back button
    onClose?: () => void;
    backLink?: string;
    backLabel?: string;
}

export default function ArticleDetailView({ article, isModal = false, onClose, ...props }: ArticleDetailViewProps) {
    const hasIncrementedRef = useRef(false);

    useEffect(() => {
        // Track view immediately when the article modal/page mounts
        if (article.url && !hasIncrementedRef.current) {
            hasIncrementedRef.current = true;
            incrementArticleView(
                article.url,
                article.title,
                article.image_url,
                article.category,
                article.id
            );
        }
    }, [article, isModal]);

    return (
        <div style={{ margin: "0 auto", padding: "16px", maxWidth: "896px", background: isModal ? "#ffffff" : "transparent", borderRadius: isModal ? "16px" : "0" }}>
            {/* Back Button - Only show if NOT a modal */}
            {!isModal && (
                <Link
                    href={props.backLink || "/news"}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        color: "#6B7280", marginBottom: "32px", textDecoration: "none",
                        fontWeight: 500, transition: "color 150ms"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                >
                    <ArrowLeft size={16} />
                    <span>{props.backLabel || "Back to News"}</span>
                </Link>
            )}

            {/* Article Header */}
            <article style={{
                background: "#ffffff", borderRadius: isModal ? "0" : "16px",
                boxShadow: isModal ? "none" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                border: isModal ? "none" : "1px solid #F3F4F6", overflow: "hidden"
            }}>
                <div style={{ position: "relative", height: "360px", width: "100%" }}>
                    <img
                        src={article.image_url}
                        alt={article.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.currentTarget.src = "/pulse/placeholder-news.svg"; }}
                    />
                    <div style={{
                        position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                        display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.9)", marginBottom: "12px", fontSize: "14px", flexWrap: "wrap" }}>
                            <span style={{ background: "#2563EB", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, color: "#fff" }}>
                                {article.source}
                            </span>
                            <TimeDisplay timestamp={article.published_at} />
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.6)" }}></span>
                                <ViewCounter
                                    articleUrl={article.url}
                                    articleId={article.id}
                                />
                            </div>
                        </div>
                        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#ffffff", marginBottom: "8px", lineHeight: 1.2 }}>
                            {article.title}
                        </h1>
                    </div>
                </div>

                <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <p style={{ fontSize: "18px", color: "#374151", lineHeight: 1.6 }}>
                        {article.description}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: "#2563EB", color: "#ffffff", padding: "12px 32px", borderRadius: "12px",
                                fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
                                transition: "all 150ms", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                            }}
                            onMouseEnter={(e) => { (e.currentTarget.style.background = "#1D4ED8"); (e.currentTarget.style.transform = "translateY(-2px)"); }}
                            onMouseLeave={(e) => { (e.currentTarget.style.background = "#2563EB"); (e.currentTarget.style.transform = "translateY(0)"); }}
                        >
                            <span>Read Full Article at Source</span>
                            <ExternalLink size={16} />
                        </a>

                        {/* Audio Summary Button */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <AudioSummaryButton
                                articleId={article.id || article.url}
                                articleUrl={article.url}
                                initialAudioUrl={article.audio_url}
                                initialTextSummary={article.text_summary}
                                title={article.title}
                                image={article.image_url}
                                category={article.category}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", paddingBottom: "24px", borderBottom: "1px solid #E5E7EB" }}>
                        <ArticleInteraction
                            articleUrl={article.url}
                            articleTitle={article.title}
                            category={article.category}
                            articleId={article.id}
                            autoTrackView={false} // Already handled by parent/page
                        />
                    </div>

                    <div style={{ marginTop: "16px" }}>
                        <CommentSection articleUrl={article.url} />
                    </div>
                </div>
            </article>
        </div>
    );
}
