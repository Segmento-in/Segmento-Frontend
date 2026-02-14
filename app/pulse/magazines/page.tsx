'use client';

import { useEffect, useState } from "react";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import { BookOpen } from "lucide-react";
import NewsCard from "@/components/pulse/NewsCard";

// Force dynamic rendering (for client components, only 'dynamic' is allowed)
export const dynamic = 'force-dynamic';

export default function MagazinesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12;

    const loadMagazines = async () => {
        setLoading(true);
        try {
            // Initial load
            const data = await fetchNewsByCategory('magazines', 1, LIMIT);
            setArticles(data);
            setHasMore(data.length >= LIMIT);
        } catch (error) {
            console.error("Failed to load magazines:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMagazines();
    }, []);

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const data = await fetchNewsByCategory('magazines', nextPage, LIMIT);

            if (data.length > 0) {
                setArticles(prev => [...prev, ...data]);
                setPage(nextPage);
                setHasMore(data.length >= LIMIT);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more magazines:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-3 xs:px-4 sm:px-4 lg:px-6 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" />
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold">Tech Magazines</h1>
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
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                            {articles.map((article, i) => (
                                <NewsCard key={`${article.url}-${i}`} article={article} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-12">
                            {loading ? (
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            ) : hasMore ? (
                                <button
                                    onClick={loadMore}
                                    className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center gap-2 group"
                                >
                                    <span>Load More Magazines</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                            ) : (
                                <p className="text-gray-400 text-sm">You've reached the end</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
