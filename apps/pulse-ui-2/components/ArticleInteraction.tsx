'use client';

import { Heart, ThumbsDown, Eye, Share2 } from 'lucide-react';
import { useEngagement } from '@/hooks/useEngagement';

interface ArticleInteractionProps {
    articleUrl: string;
    articleTitle?: string;
    category?: string; // NEW: Pass category for strict routing
    articleId?: string; // NEW: Direct ID from backend
    onCommentClick?: () => void;
    autoTrackView?: boolean;
}

export default function ArticleInteraction({
    articleUrl,
    articleTitle,
    category,
    articleId,
    onCommentClick,
    autoTrackView = true
}: ArticleInteractionProps) {
    // Pass category, title, and image to hook to ensure backend can create article if missing
    // Pass articleId to bypass local generation if available
    const { stats, loading, like, dislike, error } = useEngagement(articleUrl, category, articleTitle, undefined, autoTrackView, articleId);

    // Share functionality
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: articleTitle || "Check out this article",
                    url: articleUrl,
                });
            } catch (err) {
                console.debug("Share cancelled:", err);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(articleUrl);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: "24px", padding: "16px 0",
            borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6", margin: "24px 0", width: "100%"
        }}>
            {/* Like Button */}
            <button
                onClick={like}
                disabled={loading}
                style={{
                    display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none",
                    color: "#6B7280", transition: "color 150ms", cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1, padding: "8px 0"
                }}
                aria-label="Like article"
                onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.color = "#EF4444"); }}
                onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.color = "#6B7280"); }}
            >
                <Heart size={20} />
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {loading ? "..." : (stats?.likes || 0)}
                </span>
            </button>

            {/* Dislike Button */}
            <button
                onClick={dislike}
                disabled={loading}
                style={{
                    display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none",
                    color: "#6B7280", transition: "color 150ms", cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1, padding: "8px 0"
                }}
                aria-label="Dislike article"
                onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.color = "#2563EB"); }}
                onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.color = "#6B7280"); }}
            >
                <ThumbsDown size={20} />
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {loading ? "..." : (stats?.dislikes || 0)}
                </span>
            </button>

            {/* Views Display */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6B7280" }}>
                <Eye size={20} />
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {loading ? "..." : (stats?.views || 0)}
                </span>
            </div>

            {/* Share Button */}
            <button
                onClick={handleShare}
                style={{
                    display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none",
                    color: "#6B7280", transition: "color 150ms", cursor: "pointer", marginLeft: "auto", padding: "8px 0"
                }}
                aria-label="Share article"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#10B981")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
                <Share2 size={20} />
                <span style={{ fontWeight: 500, fontSize: "14px" }}>Share</span>
            </button>

            {/* Error Display (development only) */}
            {error && process.env.NODE_ENV === 'development' && (
                <span style={{ fontSize: "12px", color: "#EF4444", marginLeft: "8px" }}>⚠️ {error}</span>
            )}
        </div>
    );
}
