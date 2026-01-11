// News API for Pulse - uses server-side routes to avoid CORS/426 errors

export interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source: string;
    author: string;
}

export async function fetchNewsByCategory(category: string): Promise<Article[]> {
    try {
        // Check if it's a cloud category - use existing RSS API route
        if (category.startsWith('cloud-') || category === 'cloud-computing') {
            const response = await fetch(`/api/pulse/rss?category=${category}`, {
                cache: 'no-store',
            });
            const data = await response.json();
            return data.articles || [];
        }

        // For non-cloud categories, use Google News RSS API route
        const response = await fetch(`/api/pulse/google-news?category=${category}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to fetch Google News:', response.statusText);
            return [];
        }

        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}
