'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import { Clock, ExternalLink } from "lucide-react";

// Force dynamic rendering (required for useSearchParams and API calls)
export const dynamic = 'force-dynamic';

const categories = [
    { id: "ai", name: "AI" },
    { id: "data-security", name: "Data" },
    { id: "cyber-security", name: "Security" },
    { id: "blockchain", name: "Blockchain" },
    { id: "cloud-computing", name: "Cloud" },
    { id: "magazines", name: "Magazines" },
];

export default function NewsPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') || 'ai';

    const [newsData, setNewsData] = useState<Record<string, Article[]>>({});
    const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setActiveCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        const getNews = async () => {
            // Skip if already loaded
            if (newsData[activeCategory]) return;

            try {
                setLoading(true);
                const articles = await fetchNewsByCategory(activeCategory);

                setNewsData((prev) => ({
                    ...prev,
                    [activeCategory]: articles,
                }));
            } catch (error) {
                console.error("News fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        getNews();
    }, [activeCategory]);

    const articles = newsData[activeCategory] || [];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Category Buttons */}
            <div className="flex gap-3 mb-8 flex-wrap justify-center">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/pulse/news?category=${cat.id}`}
                        className={`px-6 py-2 rounded-full transition-all ${activeCategory === cat.id
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-muted-foreground">Loading news...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500">No news available for this category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, i) => (
                        <a
                            key={i}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                        >
                            <div className="relative h-48">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2">
                                    <ExternalLink className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {article.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    {article.source && <span>• {article.source}</span>}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
