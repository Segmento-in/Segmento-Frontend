/**
 * Engagement Hook - Article Interactions
 * =======================================
 * 
 * React hook for managing article engagement (likes, dislikes, views).
 * Automatically generates SHA-256 IDs from article URLs.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateArticleId } from '@/shared/idGenerator';

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
    category?: string,
    title?: string,
    image?: string,
    autoTrackView: boolean = true,
    initialArticleId?: string
): UseEngagementReturn {
    // ... (state) ...
    const [articleId, setArticleId] = useState<string>(initialArticleId || '');
    const [stats, setStats] = useState<EngagementStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ... (useEffect for ID generation) ...
    useEffect(() => {
        if (initialArticleId) {
            setArticleId(initialArticleId);
            return;
        }

        if (articleUrl) {
            generateArticleId(articleUrl)
                .then(setArticleId)
                .catch((err) => {
                    console.error('Failed to generate article ID:', err);
                    setError('Failed to generate article ID');
                });
        }
    }, [articleUrl]);

    // Base API URL
    const API_BASE = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';

    // Helper to get request body
    const getRequestBody = () => ({
        url: articleUrl,
        title: title || "Unknown Article",
        image: image || "",
        category: category || "wildcard"
    });

    // Fetch engagement stats (GET request, no body needed)
    const fetchStats = useCallback(async () => {
        if (!articleId) return;

        setLoading(true);
        setError(null);

        try {
            // Append category to help backend route to correct collection
            const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
            const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/stats${queryParams}`);

            if (!response.ok) {
                // If 404, it just means no stats yet, return 0s
                if (response.status === 404) {
                    setStats({
                        article_id: articleId,
                        likes: 0,
                        dislikes: 0,
                        views: 0,
                        success: true
                    });
                    return;
                }
                throw new Error(`Failed to fetch stats: ${response.statusText}`);
            }

            const data: EngagementStats = await response.json();
            setStats(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to fetch engagement stats:', errorMessage);
            setError(errorMessage);
            // Non-blocking error for stats
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
    }, [articleId, API_BASE]);

    // Like article
    const like = useCallback(async () => {
        if (!articleId) return;

        try {
            const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(getRequestBody()),
            });

            if (!response.ok) throw new Error('Failed to like article');
            const data = await response.json();
            setStats((prev) => prev ? { ...prev, likes: data.likes } : null);
        } catch (err) {
            console.error('Failed to like article:', err);
            setError('Failed to like article');
        }
    }, [articleId, API_BASE, articleUrl, title, image, category]);

    // Dislike article
    const dislike = useCallback(async () => {
        if (!articleId) return;

        try {
            const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/dislike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(getRequestBody()),
            });

            if (!response.ok) throw new Error('Failed to dislike article');
            const data = await response.json();
            setStats((prev) => prev ? { ...prev, dislikes: data.dislikes } : null);
        } catch (err) {
            console.error('Failed to dislike article:', err);
            setError('Failed to dislike article');
        }
    }, [articleId, API_BASE, articleUrl, title, image, category]);

    // Track view
    const trackView = useCallback(async () => {
        if (!articleId) return;

        try {
            await fetch(`${API_BASE}/api/engagement/articles/${articleId}/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(getRequestBody()),
            });
            await fetchStats();
        } catch (err) {
            console.debug('Failed to track view:', err);
        }
    }, [articleId, API_BASE, fetchStats, articleUrl, title, image, category]);

    // Auto-fetch stats when article ID is ready
    useEffect(() => {
        if (articleId) {
            fetchStats();
        }
    }, [articleId, fetchStats]);

    // Auto-track view on mount
    // Auto-track view on mount (deduplicated)
    const viewTrackedRef = useRef(false);

    useEffect(() => {
        // Reset tracker if articleId changes
        viewTrackedRef.current = false;
    }, [articleId]);

    useEffect(() => {
        if (articleId && autoTrackView && !viewTrackedRef.current) {
            // Track view after a small delay to avoid tracking bots
            const timer = setTimeout(() => {
                if (!viewTrackedRef.current) {
                    trackView();
                    viewTrackedRef.current = true;
                }
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

            const API_BASE = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';
            await Promise.all(
                articleUrls.map(async (url) => {
                    try {
                        const articleId = await generateArticleId(url);
                        const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/stats`);

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
