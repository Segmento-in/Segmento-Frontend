import {
    ref,
    get,
    set,
    update,
    onValue,
    increment,
    serverTimestamp
} from 'firebase/database';
import { database } from './firebase';

const DB_PATH = 'pulse/article_views';

export interface ArticleViewData {
    url: string;
    viewCount: number;
    lastUpdated: number;
}

/**
 * Increment view count for an article
 */
export async function incrementArticleView(articleUrl: string): Promise<void> {
    try {
        // Use article URL as key (sanitized)
        const articleId = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 100);
        const articleRef = ref(database, `${DB_PATH}/${articleId}`);

        // Check if article exists
        const snapshot = await get(articleRef);

        if (snapshot.exists()) {
            // Increment existing count using increment
            await update(articleRef, {
                viewCount: increment(1),
                lastUpdated: serverTimestamp(),
            });
        } else {
            // Create new entry
            await set(articleRef, {
                url: articleUrl,
                viewCount: 1,
                lastUpdated: serverTimestamp(),
            });
        }
    } catch (error) {
        console.error('Failed to increment view count:', error);
    }
}

/**
 * Get current view count for an article
 */
export async function getArticleViewCount(articleUrl: string): Promise<number> {
    try {
        const articleId = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 100);
        const articleRef = ref(database, `${DB_PATH}/${articleId}`);
        const snapshot = await get(articleRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            return data.viewCount || 0;
        }
        return 0;
    } catch (error) {
        console.error('Failed to get view count:', error);
        return 0;
    }
}

/**
 * Subscribe to real-time view count updates
 */
export function subscribeToViewCount(
    articleUrl: string,
    callback: (count: number) => void
): () => void {
    const articleId = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 100);
    const articleRef = ref(database, `${DB_PATH}/${articleId}`);

    const unsubscribe = onValue(articleRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            callback(data.viewCount || 0);
        } else {
            callback(0);
        }
    });

    return unsubscribe;
}

/**
 * Track article views in batch (for homepage category boxes)
 */
export async function trackMultipleArticleViews(articleUrls: string[]): Promise<void> {
    const promises = articleUrls.map(url => incrementArticleView(url));
    await Promise.all(promises);
}

