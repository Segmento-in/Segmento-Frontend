import { NextRequest, NextResponse } from 'next/server';

interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source: string;
    author: string;
}

// Optimized cloud provider RSS feeds
const cloudProviderFeeds = {
    aws: 'https://aws.amazon.com/blogs/aws/feed/',
    azure: 'https://azure.microsoft.com/en-us/blog/feed/',
    gcp: 'https://cloudblog.withgoogle.com/rss/',
    ibm: 'https://www.ibm.com/blogs/cloud-computing/feed/',
    oracle: 'https://blogs.oracle.com/cloud-infrastructure/rss',
    digitalocean: 'https://www.digitalocean.com/blog/rss.xml',
};

// Simple in-memory cache with TTL
const cache = new Map<string, { data: Article[]; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute cache

// Fast RSS parsing with timeout
async function fetchRSSFeed(url: string, source: string): Promise<Article[]> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SegmentoPulse/1.0)',
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`HTTP ${response.status} for ${source}`);
            return [];
        }

        const xmlText = await response.text();
        const articles = parseRSSXML(xmlText, source);

        return articles.slice(0, 15); // Limit to 15 for speed
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error(`Timeout fetching ${source}`);
        } else {
            console.error(`Error fetching ${source}:`, error);
        }
        return [];
    }
}

// Fast XML parsing without heavy libraries
function parseRSSXML(xml: string, source: string): Article[] {
    const articles: Article[] = [];

    try {
        // Extract items using regex (faster than XML parser for simple RSS)
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const matches = xml.matchAll(itemRegex);

        for (const match of matches) {
            const item = match[1];

            const title = extractTag(item, 'title') || 'No title';
            const link = extractTag(item, 'link') || '';
            const description = extractTag(item, 'description') || extractTag(item, 'content:encoded') || '';
            const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date') || new Date().toISOString();
            const creator = extractTag(item, 'dc:creator') || extractTag(item, 'author') || source;

            // Extract image from various sources
            let image = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop';
            const mediaContent = item.match(/<media:content[^>]*url="([^"]+)"/);
            const mediaThumbnail = item.match(/<media:thumbnail[^>]*url="([^"]+)"/);
            const enclosure = item.match(/<enclosure[^>]*url="([^"]+)"/);
            const imgTag = description.match(/<img[^>]*src="([^"]+)"/);

            if (mediaContent) image = mediaContent[1];
            else if (mediaThumbnail) image = mediaThumbnail[1];
            else if (enclosure) image = enclosure[1];
            else if (imgTag) image = imgTag[1];

            articles.push({
                title: cleanHTML(title),
                description: cleanHTML(description).substring(0, 200),
                url: link,
                image,
                publishedAt: pubDate,
                source: source.toUpperCase(),
                author: creator,
            });

            if (articles.length >= 15) break; // Early exit for performance
        }
    } catch (error) {
        console.error(`Error parsing XML for ${source}:`, error);
    }

    return articles;
}

function extractTag(xml: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : null;
}

function cleanHTML(html: string): string {
    return html
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Provider mapping
    const providerMap: Record<string, string[]> = {
        'cloud-computing': ['aws', 'azure', 'gcp', 'ibm', 'oracle', 'digitalocean'],
        'cloud-aws': ['aws'],
        'cloud-gcp': ['gcp'],
        'cloud-azure': ['azure'],
        'cloud-ibm': ['ibm'],
        'cloud-oracle': ['oracle'],
        'cloud-digitalocean': ['digitalocean'],
    };

    const providers = providerMap[category];

    if (!providers) {
        return NextResponse.json({ error: 'RSS only available for cloud categories' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `rss_${category}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
        console.log(`✓ Cache hit for ${category}`);
        return NextResponse.json({
            articles: cached.data,
            count: cached.data.length,
            sources: providers,
            cached: true,
        });
    }

    try {
        // Fetch feeds in parallel for speed
        const feedPromises = providers.map(provider =>
            fetchRSSFeed(
                cloudProviderFeeds[provider as keyof typeof cloudProviderFeeds],
                provider
            )
        );

        const feedResults = await Promise.all(feedPromises);
        const allArticles = feedResults.flat();

        // Sort by date
        allArticles.sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        // Update cache
        cache.set(cacheKey, { data: allArticles, timestamp: now });

        // Clean old cache entries
        if (cache.size > 20) {
            const oldestKey = Array.from(cache.keys())[0];
            cache.delete(oldestKey);
        }

        return NextResponse.json({
            articles: allArticles,
            count: allArticles.length,
            sources: providers,
            cached: false,
        });
    } catch (error) {
        console.error('RSS aggregation error:', error);
        return NextResponse.json({
            error: 'Failed to fetch RSS feeds',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
