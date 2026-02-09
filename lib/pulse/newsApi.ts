// News API for Pulse - now uses FastAPI backend
const API_BASE = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';

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
    category?: string;
    $id?: string;
}

export async function fetchNewsByCategory(
    category: string,
    page: number = 1,
    limit: number = 20
): Promise<Article[]> {
    try {
        // Use FastAPI backend endpoint with pagination
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
        // Use FastAPI backend search endpoint
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
