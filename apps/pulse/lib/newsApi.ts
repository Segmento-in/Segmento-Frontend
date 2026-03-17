// News API for Pulse
// All requests use relative paths (/api/*) which are proxied server-side
// by apps/pulse/app/api/[...path]/route.ts to avoid CORS issues.
// The proxy forwards requests to NEXT_PUBLIC_PULSE_API_URL (default: localhost:8000).

import { getArticleStats } from './analytics';

function getApiBase(): string {
    // Both client and server can use the direct endpoint based on the robust .env config
    if (typeof window !== 'undefined') {
        return ''; // Uses relative path, hitting our Next.js API proxy
    }
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

// Taxonomy Matrix to map UI-2 routing slugs to backend category strings.
//
// Rule:
//   ‣ Specific sub-category slugs (cloud-aws, data-security …)
//     pass through directly to the backend as-is.
//   ‣ Umbrella slugs ('data', 'cloud', 'research-papers', 'ai', 'magzines', 'articles')
//     are handled by UMBRELLA_CATEGORIES below — they fan out to all real sub-collections.
//
// ⚠ WHY THIS MATTERS:
//   The backend stores articles in specific Appwrite collections named exactly after the
//   CATEGORIES list in config.py.  There is NO aggregate collection for 'cloud' or 'data'.
//   Querying /api/news/cloud-computing or /api/news/data-articles returns 0 results because
//   those umbrella names are NOT in the backend CATEGORIES list.
export const TaxonomyMatrix: Record<string, string> = {
    // AI — direct mapping
    'ai': 'ai',
    // Magazines / Articles — direct mapping
    'magzines': 'magazines',
    'articles': 'medium-article',
    // Data sub-categories — pass-through (must match backend CATEGORIES exactly)
    'data-engineering': 'data-engineering',
    'data-governance': 'data-governance',
    'data-privacy': 'data-privacy',
    'data-management': 'data-management',
    'data-security': 'data-security',
    'data-laws': 'data-laws',
    'business-intelligence': 'business-intelligence',
    'business-analytics': 'business-analytics',
    'customer-data-platform': 'customer-data-platform',
    'data-centers': 'data-centers',
    // Cloud sub-categories — pass-through
    'cloud-computing': 'cloud-computing',
    'cloud-aws': 'cloud-aws',
    'cloud-azure': 'cloud-azure',
    'cloud-gcp': 'cloud-gcp',
    'cloud-oracle': 'cloud-oracle',
    'cloud-ibm': 'cloud-ibm',
    'cloud-alibaba': 'cloud-alibaba',
    'cloud-digitalocean': 'cloud-digitalocean',
    'cloud-huawei': 'cloud-huawei',
    'cloud-cloudflare': 'cloud-cloudflare',
};

// Umbrella slugs expand to ALL their real backend sub-category names.
// On an umbrella fetch, each sub-category is fetched in parallel, then results are merged.
const UMBRELLA_CATEGORIES: Record<string, string[]> = {
    'data': [
        'data-engineering', 'data-governance', 'data-privacy', 'data-management',
        'data-security', 'data-laws', 'business-intelligence', 'business-analytics',
        'customer-data-platform', 'data-centers',
    ],
    'cloud': [
        'cloud-computing', 'cloud-aws', 'cloud-azure', 'cloud-gcp',
        'cloud-oracle', 'cloud-ibm', 'cloud-alibaba', 'cloud-digitalocean',
        'cloud-huawei', 'cloud-cloudflare',
    ],
    'research-papers': [
        'research',
    ],
    'latest-articles': [
        'ai', 'data-engineering', 'data-security', 'cloud-computing',
        'business-analytics', 'magazines', 'medium-article',
    ],
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
        image_url: article.image_url || "/pulse/placeholder-news.svg",
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
        imgSrc: article.image_url || "/pulse/placeholder-news.svg",
        imgAlt: article.title || "Article Image",
        variant: getDeterministicVariant(safeId),
    };
}

/** Fetch a single real backend category (internal helper) */
async function _fetchSingleCategory(
    backendCategory: string,
    page: number,
    limit: number,
    API_BASE: string
): Promise<Article[]> {
    try {
        const response = await fetch(
            `${API_BASE}/api/news/${backendCategory}?page=${page}&limit=${limit}`,
            { cache: 'no-store' }
        );
        if (!response.ok) return [];
        const data = await response.json();
        const articles = data.articles || [];
        return Promise.all(articles.map(sanitizeArticlePayload));
    } catch {
        return [];
    }
}

export async function fetchNewsByCategory(
    category: string,
    page: number = 1,
    limit: number = 20
): Promise<Article[]> {
    try {
        const API_BASE = getApiBase();

        // ── Umbrella slug: fan out to all real sub-categories ────────────────
        const subCategories = UMBRELLA_CATEGORIES[category];
        if (subCategories) {
            // Fetch all sub-categories in parallel. Limit per sub-category is
            // smaller so we don't overshoot the total by 10x.
            const perCatLimit = Math.max(5, Math.ceil(limit / subCategories.length));
            const results = await Promise.all(
                subCategories.map(cat => _fetchSingleCategory(cat, 1, perCatLimit, API_BASE))
            );
            // Flatten, deduplicate by URL, sort newest-first
            const seen = new Set<string>();
            const merged: Article[] = [];
            for (const batch of results) {
                for (const article of batch) {
                    const key = article.url as string;
                    if (key && !seen.has(key)) {
                        seen.add(key);
                        merged.push(article);
                    }
                }
            }
            merged.sort((a, b) =>
                new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
            );
            return merged.slice(0, limit);
        }

        // ── Single specific category (pass-through) ──────────────────────────
        const backendCategory = TaxonomyMatrix[category] || category;
        return _fetchSingleCategory(backendCategory, page, limit, API_BASE);

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
