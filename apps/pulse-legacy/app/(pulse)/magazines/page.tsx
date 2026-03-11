'use client';

import { useEffect, useState } from "react";
import { fetchNewsByCategory, type Article } from "@/lib/newsApi";
import { BookOpen } from "lucide-react";
import NewsCard from "@/components/NewsCard";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function MagazinesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false); // Added for the button state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12;

    const loadMagazines = async () => {
        setLoading(true);
        try {
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
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
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
            setLoadingMore(false);
        }
    };

    return (
        /* UI FIX: Ronas IT Light Mode Base (Warm Background) */
        <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A]">
            <div className="container mx-auto px-4 py-12">
                
                {/* Header Section: Editorial Styling */}
                <div className="flex flex-col items-center justify-center gap-3 mb-12 border-b border-[#E5E2DA] pb-10">
                    <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] font-serif italic tracking-tight">
                        Tech Magazines
                    </h1>
                </div>

                {/* UI FIX: Grid Layout & Loading States */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#1A1A1A]"></div>
                        <p className="mt-4 text-[#666] uppercase tracking-widest text-[10px] font-bold">Refreshing Archives</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#E5E2DA] rounded-xl bg-white/30">
                        <p className="text-[#999] italic font-serif">The magazine collection is currently empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {articles.map((article, i) => (
                            <NewsCard key={`${article.url}-${i}`} article={article} />
                        ))}
                    </div>
                )}

                {/* UI FIX: Editorial "Load More" Button */}
                {!loading && articles.length > 0 && hasMore && (
                    <div className="text-center mt-20 pt-16 border-t border-[#E5E2DA]">
                        <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="px-12 py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 disabled:opacity-30 flex items-center gap-3 mx-auto group active:scale-95"
                        >
                            {loadingMore ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <span>Load More Magazines</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform">
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </>
                            )}
                        </button>
                        <p className="text-[9px] uppercase tracking-widest text-[#AAA] mt-6 font-bold">
                            Viewing {articles.length} issues — Collection Page {page}
                        </p>
                    </div>
                )}

                {/* UI FIX: Footer Divider Message */}
                {!loading && articles.length > 0 && !hasMore && (
                    <div className="text-center mt-20 py-8 border-t border-[#E5E2DA]">
                        <p className="text-[#666] font-serif italic text-lg">You've reached the end of the magazine archives.</p>
                    </div>
                )}
            </div>
        </div>
    );
}