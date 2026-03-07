// News API for Pulse
// All requests use relative paths (/api/*) which are proxied server-side
// by apps/pulse/app/api/[...path]/route.ts to avoid CORS issues.
// The proxy forwards requests to NEXT_PUBLIC_PULSE_API_URL (default: localhost:8000).

import { getArticleStats } from './analytics';

function getApiBase(): string {
    // Both client and server can use the direct endpoint based on the robust .env config
    return process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';
}

export interface Article {
    title: string;
    description: string;
    url: string;
    image_url: string;
    published_at: string;
    source: string;
    author?: string;
    likes?: number;
    dislikes?: number;
    views?: number;
    audio_url?: string;
    text_summary?: string;
    category?: string;
    $id?: string;
    id?: string; // Compatibility with standardized backend model

    // UI-2 Specific injected properties
    tag?: string;
    date?: string;
    imgSrc?: string;
    imgAlt?: string;
    variant?: "A" | "B" | "C" | "D" | "E" | "F";
}

// Taxonomy Matrix to map UI-2 routing slugs to UI-1 Backend Categories
export const TaxonomyMatrix: Record<string, string> = {
    'ai': 'ai',
    'data': 'data-articles',
    'cloud': 'cloud-computing',
    'magzines': 'magazines',
    'articles': 'medium-article',
    'research-papers': 'research',
    'latest-articles': 'ai' // Fallback for latest-articles list if needed
};

// Deterministic Hasher for WebGL Variants
export function getDeterministicVariant(id: string): "A" | "B" | "C" | "D" | "E" | "F" {
    if (!id) return "A";
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const variants: ("A" | "B" | "C" | "D" | "E" | "F")[] = ["A", "B", "C", "D", "E", "F"];
    return variants[Math.abs(hash) % variants.length];
}

// Payload Sanitizer mapping the backend format to strict UI-2 expectations
export async function sanitizeArticlePayload(article: any): Promise<Article> {
    const safeId = article.$id || article.id || Math.random().toString(36).substring(7);
    const safeUrl = article.url || "#";
    const safeCat = article.category || "News Articles";

    // Asynchronously hydrate live stats
    const stats = await getArticleStats(safeUrl, safeId, safeCat);

    return {
        // Core Appwrite properties
        $id: safeId,
        id: safeId,
        title: article.title || "Untitled Article",
        description: article.description || "",
        url: safeUrl,
        image_url: article.image_url || "/placeholder-news.svg",
        published_at: article.published_at || new Date().toISOString(),
        source: article.source || "Pulse",
        author: article.source || "Pulse",
        likes: stats.likeCount || article.likes || 0,
        dislikes: stats.dislikeCount || article.dislikes || 0,
        views: stats.viewCount || article.views || 0,
        audio_url: article.audio_url,
        text_summary: article.text_summary,
        category: article.category,

        // UI-2 required presentation properties
        tag: article.category || "News Articles",
        date: article.published_at || new Date().toISOString(),
        imgSrc: article.image_url || "/placeholder-news.svg",
        imgAlt: article.title || "Article Image",
        variant: getDeterministicVariant(safeId),
    };
}

export async function fetchNewsByCategory(
    category: string,
    page: number = 1,
    limit: number = 20
): Promise<Article[]> {
    try {
        const backendCategory = TaxonomyMatrix[category] || category;
        const API_BASE = getApiBase();
        const response = await fetch(
            `${API_BASE}/api/news/${backendCategory}?page=${page}&limit=${limit}`,
            {
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error('Failed to fetch news:', response.statusText);
            return [];
        }

        const data = await response.json();
        const articles = data.articles || [];
        return Promise.all(articles.map(sanitizeArticlePayload));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

export async function searchNews(query: string): Promise<Article[]> {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to search news:', response.statusText);
            return [];
        }

        const data = await response.json();
        const articles = data.articles || [];
        return Promise.all(articles.map(sanitizeArticlePayload));
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
}

// Fetch single research paper by ID
export async function fetchResearchPaperById(paperId: string): Promise<Article | null> {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/api/research/${paperId}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            console.error('Failed to fetch research paper:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data.paper ? sanitizeArticlePayload(data.paper) : null;
    } catch (error) {
        console.error("Error fetching research paper:", error);
        return null;
    }
}
