import { NextRequest, NextResponse } from 'next/server';

// Google News RSS feeds by category
const googleNewsFeeds: Record<string, string> = {
    'ai': 'https://news.google.com/rss/search?q=artificial+intelligence+OR+machine+learning&hl=en-US&gl=US&ceid=US:en',
    'data-security': 'https://news.google.com/rss/search?q=data+security+OR+cybersecurity+OR+data+breach&hl=en-US&gl=US&ceid=US:en',
    'data-governance': 'https://news.google.com/rss/search?q=data+governance+OR+data+management&hl=en-US&gl=US&ceid=US:en',
    'data-privacy': 'https://news.google.com/rss/search?q=data+privacy+OR+GDPR+OR+privacy+regulation&hl=en-US&gl=US&ceid=US:en',
    'data-engineering': 'https://news.google.com/rss/search?q=data+engineering+OR+data+pipeline+OR+big+data&hl=en-US&gl=US&ceid=US:en',
    'magazines': 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en',
};

interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source: string;
    author: string;
}

// In-memory cache
const cache = new Map<string, { articles: Article[]; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

async function fetchGoogleNewsRSS(url: string, source: string): Promise<Article[]> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SegmentoPulse/1.0)',
            },
            next: { revalidate: 60 },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`HTTP ${response.status} for ${source}`);
            return [];
        }

        const xmlText = await response.text();
        return parseXMLToArticles(xmlText, source);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error(`Timeout fetching ${source}`);
        } else {
            console.error(`Error fetching ${source}:`, error);
        }
        return [];
    }
}

function parseXMLToArticles(xml: string, source: string): Article[] {
    const articles: Article[] = [];

    try {
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const matches = xml.matchAll(itemRegex);

        for (const match of matches) {
            const item = match[1];

            const title = extractTag(item, 'title') || 'No title';
            const link = extractTag(item, 'link') || extractTag(item, 'guid') || '';
            const description = extractTag(item, 'description') || extractTag(item, 'content:encoded') || '';
            const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'published') || new Date().toISOString();
            const creator = extractTag(item, 'dc:creator') || extractTag(item, 'author') || 'Google News';

            // Extract image from multiple possible sources
            let image = '';

            // 1. Try enclosure tag
            const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]+)"/);
            if (enclosureMatch) image = enclosureMatch[1];

            // 2. Try media:content or media:thumbnail
            if (!image) {
                const mediaMatch = item.match(/<media:(content|thumbnail)[^>]*url="([^"]+)"/);
                if (mediaMatch) image = mediaMatch[2];
            }

            // 3. Try img tag in description
            if (!image) {
                const imgMatch = description.match(/<img[^>]*src="([^"]+)"/);
                if (imgMatch) image = imgMatch[1];
            }

            // 4. Use category-specific fallback images
            if (!image) {
                const fallbacks: Record<string, string> = {
                    'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
                    'data-security': 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=200&fit=crop',
                    'data-governance': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
                    'data-privacy': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=200&fit=crop',
                    'data-engineering': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
                    'magazines': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop',
                };
                // Use a hash of the title to pick a consistent fallback
                const defaultImages = Object.values(fallbacks);
                const index = Math.abs(title.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)) % defaultImages.length;
                image = defaultImages[index];
            }

            // Extract source name from description BEFORE cleaning (needs HTML)
            // Google News format: <a href="link">Source Name</a>&nbsp;text content...
            const sourceMatch = description.match(/<a[^>]*>([^<]+)<\/a>/);
            const articleSource = sourceMatch ? sourceMatch[1] : source;

            // CRITICAL FIX: Google News RSS descriptions ONLY contain article links, not actual summaries
            // The description field looks like: <a href="https://news.google.com/rss/articles/...">
            // There is NO actual readable content - just a Google News redirect URL
            // Solution: Leave description empty for Google News articles

            let cleanedDescription = '';

            // Check if this is a Google News link-only description
            const isGoogleNewsLink = description.includes('news.google.com/rss/articles');

            if (!isGoogleNewsLink) {
                // Not a Google News link - try to extract real content
                const afterLinkMatch = description.match(/<\/a>([\s\S]*)/);
                if (afterLinkMatch) {
                    const extracted = cleanHTML(afterLinkMatch[1]);
                    if (extracted.length > 30) {
                        cleanedDescription = extracted.substring(0, 200);
                    }
                }

                // Fallback: clean the entire description if we got something meaningful
                if (!cleanedDescription) {
                    const fullClean = cleanHTML(description);
                    if (fullClean.length > 30 && !fullClean.startsWith('http')) {
                        cleanedDescription = fullClean.substring(0, 200);
                    }
                }
            }

            // For Google News or if no valid description, leave it empty
            // The UI will handle empty descriptions gracefully

            articles.push({
                title: cleanHTML(title),
                description: cleanedDescription,
                url: link,
                image,
                publishedAt: pubDate,
                source: cleanHTML(articleSource),
                author: cleanHTML(creator),
            });

            if (articles.length >= 20) break;
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
    let text = html;

    // Remove CDATA
    text = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');

    // Multiple passes to remove all HTML tags
    // Pass 1: Remove complete tags
    text = text.replace(/<[^>]+>/g, '');

    // Pass 2: Remove any remaining < followed by characters (incomplete tags)
    text = text.replace(/<[^>]*/g, '');

    // Pass 3: Remove any remaining > (closing brackets without opening)
    text = text.replace(/>/g, '');

    // Decode HTML entities
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&amp;/gi, '&');
    text = text.replace(/&lt;/gi, '<');
    text = text.replace(/&gt;/gi, '>');
    text = text.replace(/&quot;/gi, '"');
    text = text.replace(/&#39;/gi, "'");
    text = text.replace(/&apos;/gi, "'");
    text = text.replace(/&hellip;/gi, '...');
    text = text.replace(/&mdash;/gi, '—');
    text = text.replace(/&ndash;/gi, '–');

    // Remove any numeric HTML entities
    text = text.replace(/&#\d+;/g, '');

    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ');
    text = text.trim();

    return text;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'ai';

    // Check cache first
    const cached = cache.get(category);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({ articles: cached.articles });
    }

    const feedUrl = googleNewsFeeds[category];
    if (!feedUrl) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const articles = await fetchGoogleNewsRSS(feedUrl, 'Google News');

    // Cache results
    cache.set(category, { articles, timestamp: Date.now() });

    return NextResponse.json({ articles });
}
