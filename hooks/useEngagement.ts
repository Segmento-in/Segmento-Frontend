/**
 * Engagement Hook - Article Interactions
 * =======================================
 * 
 * React hook for managing article engagement (likes, dislikes, views).
 * Automatically generates SHA-256 IDs from article URLs.
 */

import { useState, useEffect, useCallback } from 'react';
import { generateArticleId } from '@/lib/idGenerator';

export interface EngagementStats {
    article_id: string;
    likes: number;
    dislikes: number;
    views: number;
    success: boolean;
}

export interface UseEngagementReturn {
    stats: EngagementStats | null;
    loading: boolean;
    error: string | null;
    like: () => Promise<void>;
    dislike: () => Promise<void>;
    trackView: () => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Hook for managing article engagement.
 * 
 * @param articleUrl - URL of the article
 * @param autoTrackView - Automatically track view on mount (default: true)
 * @returns Engagement stats and interaction functions
 * 
 * @example
 * ```tsx
 * const { stats, like, dislike, loading } = useEngagement(article.url);
 * 
 * return (
 *   <div>
 *     <button onClick={like}>❤️ {stats?.likes || 0}</button>
 *     <button onClick={dislike}>👎 {stats?.dislikes || 0}</button>
 *   </div>
 * );
 * ```
 */
export function useEngagement(
    articleUrl: string,
    autoTrackView: boolean = true
): UseEngagementReturn {
    const [articleId, setArticleId] = useState<string>('');
    const [stats, setStats] = useState<EngagementStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Generate article ID from URL
    useEffect(() => {
        if (articleUrl) {
            generateArticleId(articleUrl)
                .then(setArticleId)
                .catch((err) => {
                    console.error('Failed to generate article ID:', err);
                    setError('Failed to generate article ID');
                });
        }
    }, [articleUrl]);

    // Fetch engagement stats
    const fetchStats = useCallback(async () => {
        if (!articleId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/engagement/articles/${articleId}/stats`);

            if (!response.ok) {
                throw new Error(`Failed to fetch stats: ${response.statusText}`);
            }

            const data: EngagementStats = await response.json();
            setStats(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to fetch engagement stats:', errorMessage);
            setError(errorMessage);

            // Set default stats on error
            setStats({
                article_id: articleId,
                likes: 0,
                dislikes: 0,
                views: 0,
                success: false
            });
        } finally {
            setLoading(false);
        }
    }, [articleId]);

    // Like article
    const like = useCallback(async () => {
        if (!articleId) {
            console.warn('Cannot like: article ID not generated yet');
            return;
        }

        try {
            const response = await fetch(`/api/engagement/articles/${articleId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to like article');
            }

            const data = await response.json();

            // Update stats optimistically
            setStats((prev) =>
                prev ? { ...prev, likes: data.likes } : null
            );
        } catch (err) {
            console.error('Failed to like article:', err);
            setError('Failed to like article');
        }
    }, [articleId]);

    // Dislike article
    const dislike = useCallback(async () => {
        if (!articleId) {
            console.warn('Cannot dislike: article ID not generated yet');
            return;
        }

        try {
            const response = await fetch(`/api/engagement/articles/${articleId}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to dislike article');
            }

            const data = await response.json();

            // Update stats optimistically
            setStats((prev) =>
                prev ? { ...prev, dislikes: data.dislikes } : null
            );
        } catch (err) {
            console.error('Failed to dislike article:', err);
            setError('Failed to dislike article');
        }
    }, [articleId]);

    // Track view (silent - doesn't update UI)
    const trackView = useCallback(async () => {
        if (!articleId) return;

        try {
            await fetch(`/api/engagement/articles/${articleId}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Don't update UI for views (happens in background)
            // Refetch stats instead to get latest count
            await fetchStats();
        } catch (err) {
            // Silent failure for view tracking
            console.debug('Failed to track view (non-critical):', err);
        }
    }, [articleId, fetchStats]);

    // Auto-fetch stats when article ID is ready
    useEffect(() => {
        if (articleId) {
            fetchStats();
        }
    }, [articleId, fetchStats]);

    // Auto-track view on mount
    useEffect(() => {
        if (articleId && autoTrackView) {
            // Track view after a small delay to avoid tracking bots
            const timer = setTimeout(() => {
                trackView();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [articleId, autoTrackView, trackView]);

    return {
        stats,
        loading,
        error,
        like,
        dislike,
        trackView,
        refetch: fetchStats,
    };
}

/**
 * Hook for batch fetching engagement stats for multiple articles.
 * Useful for article lists/grids.
 * 
 * @param articleUrls - Array of article URLs
 * @returns Map of URL to engagement stats
 */
export function useBatchEngagement(articleUrls: string[]) {
    const [statsMap, setStatsMap] = useState<Map<string, EngagementStats>>(new Map());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!articleUrls.length) return;

        const fetchBatchStats = async () => {
            setLoading(true);
            const newStatsMap = new Map<string, EngagementStats>();

            await Promise.all(
                articleUrls.map(async (url) => {
                    try {
                        const articleId = await generateArticleId(url);
                        const response = await fetch(`/api/engagement/articles/${articleId}/stats`);

                        if (response.ok) {
                            const data = await response.json();
                            newStatsMap.set(url, data);
                        }
                    } catch (err) {
                        console.debug(`Failed to fetch stats for ${url}:`, err);
                    }
                })
            );

            setStatsMap(newStatsMap);
            setLoading(false);
        };

        fetchBatchStats();
    }, [articleUrls]);

    return { statsMap, loading };
}
