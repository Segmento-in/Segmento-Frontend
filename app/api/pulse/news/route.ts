import { NextRequest, NextResponse } from 'next/server';

const API_KEY_NEWS = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!API_KEY_NEWS) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Map categories to search queries - specific terms for accurate results
    const categoryQueries: Record<string, string> = {
        'ai': 'artificial intelligence',
        'data-security': '"data security" OR "data breach" OR "data protection"',
        'data-governance': '"data governance" OR "data management" OR "data quality"',
        'data-privacy': '"data privacy" OR "privacy regulation" OR GDPR OR CCPA',
        'data-engineering': '"data engineering" OR "data pipeline" OR "data architecture"',
        'cloud-computing': 'cloud computing',
        'magazines': 'technology magazine',
    };

    const query = categoryQueries[category] || 'technology';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Failed to fetch news' }, { status: res.status });
        }

        const rawArticles = data.articles || [];
        const normalized = rawArticles.map((article: any) => ({
            title: article.title || "No title",
            description: article.description || "",
            url: article.url,
            image: article.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source?.name || "",
            author: article.author || "",
        }));

        return NextResponse.json({ articles: normalized });
    } catch (error) {
        console.error('News API error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
