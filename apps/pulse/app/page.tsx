import { PulseBlogHomeClient } from "@/components/views/HomePageClient";
import { fetchNewsByCategory } from "@/lib/newsApi";

export default async function Page() {
    // Phase 1: Fetch multiple categories in parallel to speed up SSR
    const [
        latestNews,
        cloudNews,
        magazinesNews,
        dataNews,
        articlesNews,
        researchNews
    ] = await Promise.all([
        fetchNewsByCategory("latest-articles", 1, 15),
        fetchNewsByCategory("cloud", 1, 4),
        fetchNewsByCategory("magzines", 1, 4),
        fetchNewsByCategory("data", 1, 4),
        fetchNewsByCategory("articles", 1, 5),
        fetchNewsByCategory("research-papers", 1, 5),
    ]);

    // Split latestNews into Hero groupings (need 13 total)
    // Map them immediately to match the expected Client Component properties.
    const heroLeft = latestNews.slice(0, 3).map(a => ({ ...a, id: a.id as string, url: a.url as string, tag: a.tag || "News", author: a.source || a.author || "Pulse", date: a.published_at as string, views: a.views || 0, imgSrc: a.image_url as string, imgAlt: a.title }));
    const heroCenter = latestNews[3] ? { ...latestNews[3], id: latestNews[3].id as string, url: latestNews[3].url as string, tag: latestNews[3].tag || "News", author: latestNews[3].source || latestNews[3].author || "Pulse", date: latestNews[3].published_at as string, views: latestNews[3].views || 0, imgSrc: latestNews[3].image_url as string, imgAlt: latestNews[3].title } : undefined;
    const heroCenterBottom = latestNews.slice(4, 7).map(a => ({ ...a, id: a.id as string, url: a.url as string, tag: a.tag || "News", author: a.source || a.author || "Pulse", date: a.published_at as string, views: a.views || 0, imgSrc: a.image_url as string, imgAlt: a.title, comments: 0 }));
    const heroRight = latestNews.slice(7, 13).map(a => ({ ...a, id: a.id as string, url: a.url as string, tag: a.tag || "News", author: a.source || a.author || "Pulse", date: a.published_at as string, views: a.views || 0, imgSrc: a.image_url as string, imgAlt: a.title, trend: "up" }));

    // Format Topic Sections (aligning heavily with the specific DOM arrays the designers created)
    const topics = [
        {
            id: "cloud",
            tag: "CLOUD",
            title: "Explore Cloud Tech",
            description: "Build a solid foundation as you select the technologies and tools to help you build a great website faster.",
            articles: cloudNews.map(a => ({ ...a, id: a.id as string, imgSrc: a.image_url as string, imgAlt: a.title, date: a.published_at as string, author: a.source || a.author || "Pulse", views: a.views || 0, tag: a.tag || "CLOUD" }))
        },
        {
            id: "magzines",
            tag: "MAGZINES",
            title: "Dive into Magzines",
            description: "Streamline your content process to work smarter, maximize efficiency, and delight your users.",
            articles: magazinesNews.map(a => ({ ...a, id: a.id as string, imgSrc: a.image_url as string, imgAlt: a.title, date: a.published_at as string, author: a.source || a.author || "Pulse", views: a.views || 0, tag: a.tag || "MAGZINES" }))
        },
        {
            id: "data",
            tag: "DATA",
            title: "Harness Data & Analytics",
            description: "Create websites that engage your audience and achieve your business goals.",
            articles: dataNews.map(a => ({ ...a, id: a.id as string, imgSrc: a.image_url as string, imgAlt: a.title, date: a.published_at as string, author: a.source || a.author || "Pulse", views: a.views || 0, tag: a.tag || "DATA" }))
        }
    ];

    // Map Youtube strip to Articles/Research (Mocking Youtube videos using articles for now since the backend has no YouTube feature yet)
    const videos = [...articlesNews, ...researchNews].slice(0, 5).map(a => ({
        id: a.id || a.$id || "v",
        title: a.title,
        views: a.views || 0,
        date: a.published_at,
        tag: a.tag || "VIDEO",
        imgSrc: a.image_url,
        url: a.url,
        bg: "#f0f9ff"
    }));

    return (
        <PulseBlogHomeClient
            heroLeft={heroLeft.length > 0 ? heroLeft : undefined}
            heroCenter={heroCenter || undefined}
            heroCenterBottom={heroCenterBottom.length > 0 ? heroCenterBottom : undefined}
            heroRight={heroRight.length > 0 ? heroRight : undefined}
            topics={topics.length > 0 ? topics : undefined}
            videos={videos.length > 0 ? videos : undefined}
        />
    );
}
