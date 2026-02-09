'use client';

import { useEffect, useState } from "react";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import { BookOpen } from "lucide-react";
import NewsCard from "@/components/pulse/NewsCard";

// Force dynamic rendering (for client components, only 'dynamic' is allowed)
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
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {articles.map((article, i) => (
                            <NewsCard key={i} article={article} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
