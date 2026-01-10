'use client';

import { useEffect, useState } from "react";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import { BookOpen, ExternalLink, Clock } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function MagazinesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMagazines = async () => {
            try {
                const data = await fetchNewsByCategory('magazines');
                setArticles(data);
            } catch (error) {
                console.error("Failed to load magazines:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMagazines();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold">Tech Magazines</h1>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-muted-foreground">Loading magazines...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No magazines available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article, i) => (
                            <a
                                key={i}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                            >
                                <div className="relative h-64">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                                        <ExternalLink className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                        {article.source && <span>• {article.source}</span>}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
