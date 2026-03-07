/**
 * Engagement Analytics - Now powered by Appwrite
 * Phase 3: Migrated from Firebase to Appwrite backend
 * Performance optimized: Reduced polling frequency for better backend responsiveness
 */

import { generateArticleId } from '@/shared/idGenerator';

const API_BASE_URL = process.env.NEXT_PUBLIC_PULSE_API_URL || 'https://workwithshafisk-segmentopulse-backend.hf.space';

export interface ArticleStats {
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
}

export interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: number;
}

// Simple cache to reduce redundant API calls
const statsCache = new Map<string, { data: ArticleStats; timestamp: number }>();
const CACHE_TTL = 60000; // 60 seconds cache (increased from 5s for better performance)

// Fetch with timeout to prevent hanging
// Fetch with timeout to prevent hanging
async function fetchWithTimeout(url: string, timeout = 15000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(new Error('Request timed out')), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * Get article stats from Appwrite via backend API
 * Optimized with caching and timeout
 * 
 * @param articleUrl - Article URL (used for fallback ID generation)
 * @param articleId - Optional authoritative ID from backend (recommended)
 */
export async function getArticleStats(
    articleUrl: string,
    articleId?: string,
    category?: string
): Promise<ArticleStats> {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await generateArticleId(articleUrl);

        // Check cache first
        const cached = statsCache.get(id);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }

        const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
        const response = await fetchWithTimeout(`${API_BASE_URL}/api/engagement/articles/${id}/stats${queryParams}`);

        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        const stats = {
            viewCount: data.views || 0,
            likeCount: data.likes || 0,
            dislikeCount: data.dislikes || 0
        };

        // Cache the result
        statsCache.set(id, { data: stats, timestamp: Date.now() });

        return stats;
    } catch (error: any) {
        if (error.name === 'AbortError' || error.message.includes('timed out')) {
            console.warn(`Stats fetch timed out for ${articleUrl.slice(-20)}`);
        } else {
            console.error('Failed to get article stats:', error);
        }
        // Return zeros instead of failing, but log the error
        return { viewCount: 0, likeCount: 0, dislikeCount: 0 };
    }
}

/**
 * Increment view count for an article
 * 
 * @param articleUrl - Article URL (used for fallback ID generation)
 * @param title - Article title
 * @param image - Article image URL
 * @param category - Article category
 * @param articleId - Optional authoritative ID from backend (recommended)
 */
export async function incrementArticleView(
    articleUrl: string,
    title?: string,
    image?: string,
    category?: string,
    articleId?: string
): Promise<number> {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await generateArticleId(articleUrl);
        const response = await fetch(`${API_BASE_URL}/api/engagement/articles/${id}/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: articleUrl,
                title: title || "Unknown Article",
                image: image || "",
                category: category || "wildcard"
            }),
            signal: AbortSignal.timeout(8000)
        });

        if (!response.ok) {
            throw new Error('Failed to increment view');
        }

        const data = await response.json();
        // Invalidate cache for this article
        statsCache.delete(id);
        return data.views || 1;
    } catch (error: any) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            console.debug('View tracking timed out (non-critical)');
        } else {
            console.error('Failed to increment view count:', error);
        }
        return 0;
    }
}

/**
 * Toggle like for an article
 * 
 * @param articleUrl - Article URL (used for fallback ID generation)
 * @param incrementVal - Whether to increment (true) or decrement (false)
 * @param articleId - Optional authoritative ID from backend (recommended)
 */
export async function toggleLike(
    articleUrl: string,
    incrementVal: boolean,
    articleId?: string
): Promise<void> {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await generateArticleId(articleUrl);

        // For now, only increment (no decrement support yet)
        if (incrementVal) {
            const response = await fetch(`${API_BASE_URL}/api/engagement/articles/${id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: articleUrl }), // Send URL for auto-creation
                signal: AbortSignal.timeout(8000)
            });

            if (!response.ok) {
                throw new Error('Failed to like article');
            }

            // Invalidate cache for this article
            statsCache.delete(id);
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            console.error('Failed to toggle like:', error);
        }
    }
}

/**
 * Toggle dislike for an article
 * 
 * @param articleUrl - Article URL (used for fallback ID generation)
 * @param incrementVal - Whether to increment (true) or decrement (false)
 * @param articleId - Optional authoritative ID from backend (recommended)
 */
export async function toggleDislike(
    articleUrl: string,
    incrementVal: boolean,
    articleId?: string
): Promise<void> {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await generateArticleId(articleUrl);

        // For now, only increment (no decrement support yet)
        if (incrementVal) {
            const response = await fetch(`${API_BASE_URL}/api/engagement/articles/${id}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: articleUrl }), // Send URL for auto-creation
                signal: AbortSignal.timeout(8000)
            });

            if (!response.ok) {
                throw new Error('Failed to dislike article');
            }

            // Invalidate cache for this article
            statsCache.delete(id);
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            console.error('Failed to toggle dislike:', error);
        }
    }
}

/**
 * Subscribe to article stats (polling-based since we're not using Firebase anymore)
 * Optimized: Polls every 30 seconds to reduce backend load
 * @param articleUrl - Article URL
 * @param callback - Callback function to receive stats
 * @returns Unsubscribe function
 */
export function subscribeToArticleStats(
    articleUrl: string,
    callback: (stats: ArticleStats) => void
): () => void {
    let intervalId: NodeJS.Timeout | null = null;
    let isSubscribed = true;

    // Poll every 30 seconds (reduced from 5s for better performance)
    const poll = async () => {
        if (!isSubscribed) return;
        const stats = await getArticleStats(articleUrl);
        if (isSubscribed) callback(stats);
    };

    // Initial fetch
    poll();

    // Set up polling - Reduced frequency to prevent backend overload
    intervalId = setInterval(poll, 30000);

    // Return unsubscribe function
    return () => {
        isSubscribed = false;
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
}

/**
 * Get article view count (backward compatibility)
 * 
 * @param articleUrl - Article URL (used for fallback ID generation)
 * @param articleId - Optional authoritative ID from backend (recommended)
 */
export async function getArticleViewCount(
    articleUrl: string,
    articleId?: string
): Promise<number> {
    const stats = await getArticleStats(articleUrl, articleId);
    return stats.viewCount;
}

/**
 * Get trending articles from backend
 */
export async function getTrendingArticles(hours: number = 24, limit: number = 10): Promise<any[]> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/engagement/articles/trending?hours=${hours}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch trending articles');
        }

        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Failed to get trending articles:', error);
        return [];
    }
}

// NOTE: Comments functionality removed - not implemented in Appwrite backend yet
// If needed in future, implement via Appwrite backend API

export async function addComment(articleUrl: string, text: string, userName: string = 'Anonymous'): Promise<void> {
    console.warn('Comments feature not yet implemented in Appwrite backend');
    // TODO: Implement when backend supports comments
}

export function subscribeToComments(
    articleUrl: string,
    callback: (comments: Comment[]) => void
): () => void {
    console.warn('Comments feature not yet implemented in Appwrite backend');
    // TODO: Implement when backend supports comments
    return () => { };
}
