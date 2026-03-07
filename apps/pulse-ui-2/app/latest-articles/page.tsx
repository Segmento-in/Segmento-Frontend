import { CategoryPageTemplate } from "@/components/templates/CategoryPage";
import { fetchNewsByCategory } from "@/lib/newsApi";

const TAGS = [
    "AI", "DATA", "CLOUD", "MAGZINES", "ARTICLES", "RESEARCH PAPERS"
];

export default async function LatestArticlesPage() {
    // 1. Await fetch during the server render phase
    const articles = await fetchNewsByCategory("latest-articles", 1, 30);

    // 2. Slice the arrays according to UI-2 buckets
    const featuredArticles = articles.slice(0, 2).map(a => ({ ...a, id: a.id as string, url: a.url as string, tag: a.tag || "News", author: a.source || a.author || "Pulse", date: a.published_at as string, views: a.views || 0, imgSrc: a.image_url as string, imgAlt: a.title }));
    const listArticles = articles.slice(2).map(a => ({ ...a, id: a.id as string, url: a.url as string, tag: a.tag || "News", author: a.source || a.author || "Pulse", date: a.published_at as string, views: a.views || 0, imgSrc: a.image_url as string, imgAlt: a.title }));

    // 3. Mount pure client UI components
    return (
        <CategoryPageTemplate
            title="Latest Articles"
            subtitle="Stay up-to-date with our latest posts to optimize your tech skills, tech stack, career, and more!"
            heroBgColor="#F4EAFF" // Exact hex from user screenshots
            tags={TAGS}
            featuredArticles={featuredArticles}
            listArticles={listArticles}
            categorySlug="latest-articles"
        />
    );
}
