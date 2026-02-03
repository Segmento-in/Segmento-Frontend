'use client';

import { Heart, ThumbsDown, Eye, Share2 } from 'lucide-react';
import { useEngagement } from '@/hooks/useEngagement';

interface ArticleInteractionProps {
    articleUrl: string;
    articleTitle?: string;
    onCommentClick?: () => void;
}

export default function ArticleInteraction({
    articleUrl,
    articleTitle,
    onCommentClick
}: ArticleInteractionProps) {
    const { stats, loading, like, dislike, error } = useEngagement(articleUrl, true);

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
        <div className="flex items-center gap-6 py-4 border-y border-gray-100 my-6">
            {/* Like Button */}
            <button
                onClick={like}
                disabled={loading}
                className="flex items-center gap-2 transition-colors text-gray-500 hover:text-red-500 disabled:opacity-50 group"
                aria-label="Like article"
            >
                <Heart
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
                <span className="font-medium text-sm">
                    {loading ? "..." : (stats?.likes || 0)}
                </span>
            </button>

            {/* Dislike Button */}
            <button
                onClick={dislike}
                disabled={loading}
                className="flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600 disabled:opacity-50 group"
                aria-label="Dislike article"
            >
                <ThumbsDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">
                    {loading ? "..." : (stats?.dislikes || 0)}
                </span>
            </button>

            {/* Views Display */}
            <div className="flex items-center gap-2 text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="font-medium text-sm">
                    {loading ? "..." : (stats?.views || 0)}
                </span>
            </div>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group ml-auto"
                aria-label="Share article"
            >
                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Share</span>
            </button>

            {/* Error Display (development only) */}
            {error && process.env.NODE_ENV === 'development' && (
                <span className="text-xs text-red-500 ml-2">⚠️ {error}</span>
            )}
        </div>
    );
}
