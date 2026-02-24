// News API for Pulse
// All requests use relative paths (/api/*) which are proxied server-side
// by apps/pulse/app/api/[...path]/route.ts to avoid CORS issues.
// The proxy forwards requests to NEXT_PUBLIC_PULSE_API_URL (default: localhost:8000).

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
}

export async function fetchNewsByCategory(
    category: string,
    page: number = 1,
    limit: number = 20
): Promise<Article[]> {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(
            `${API_BASE}/api/news/${category}?page=${page}&limit=${limit}`,
            {
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error('Failed to fetch news:', response.statusText);
            return [];
        }

        const data = await response.json();
        return data.articles || [];
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
        return data.articles || [];
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
        return data.paper;
    } catch (error) {
        console.error("Error fetching research paper:", error);
        return null;
    }
}
