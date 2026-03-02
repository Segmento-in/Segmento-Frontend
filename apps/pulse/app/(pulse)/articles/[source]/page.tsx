'use client';

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchNewsByCategory, type Article } from "@/lib/newsApi";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";

function ArticlesContent() {
    const params = useParams();
    const router = useRouter();
    const source = params.source as string;

    // Map URL param to API category
    // Default to 'medium' if invalid
    const activeTab = (source === 'linkedin' || source === 'medium') ? source : 'medium';

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12; // Adjusted limit for better grid layout

    // Reset state when tab changes
    useEffect(() => {
        setArticles([]);
        setPage(1);
        setHasMore(true);
    }, [activeTab]);

    useEffect(() => {
        // If invalid source, redirect to medium
        if (source !== 'medium' && source !== 'linkedin') {
            router.replace('/articles/medium');
            return;
        }

        const loadArticles = async () => {
            setLoading(true);
            try {
                // Map logical tab to API category
                const category = activeTab === 'medium' ? 'medium-article' : 'linkedin-article';
                // Initial load: page 1
                const data = await fetchNewsByCategory(category, 1, LIMIT);
                setArticles(data);
                setHasMore(data.length >= LIMIT);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only load if articles are empty (initial load after tab switch)
        loadArticles();
    }, [activeTab, source, router]);

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const category = activeTab === 'medium' ? 'medium-article' : 'linkedin-article';
            const nextPage = page + 1;
            const data = await fetchNewsByCategory(category, nextPage, LIMIT);

            if (data.length > 0) {
                setArticles(prev => [...prev, ...data]);
                setPage(nextPage);
                setHasMore(data.length >= LIMIT);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more articles:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container bg-[#020617] mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
                Curated Articles
            </h1>

            {/* Filter Tabs - Now using Links for Explicit Routing */}
            <div className="flex justify-center mb-10">
                <div className="bg-gray-300 p-1 rounded-xl inline-flex">
                    <Link
                        href="/articles/medium"
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'medium'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Medium Articles
                    </Link>
                    <Link
                        href="/articles/linkedin"
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'linkedin'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        LinkedIn Articles
                    </Link>
                </div>
            </div>

            {/* Content Grid */}
            {activeTab === 'linkedin' ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-300 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl">
                        💼
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">LinkedIn Integration Coming Soon</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        We are working on bringing you the best professional insights directly from top LinkedIn creators. Stay tuned!
                    </p>
                </div>
            ) : articles.length === 0 && !loading ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500">No articles found for this section yet.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {articles.map((article, i) => (
                            <NewsCard key={`${article.url}-${i}`} article={article} />
                        ))}
                    </div>

                    {/* Pagination / Load More */}
                    <div className="flex justify-center mt-12">
                        {loading ? (
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        ) : hasMore ? (
                            <button
                                onClick={loadMore}
                                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 group"
                            >
                                <span>Load More Articles</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                        ) : (
                            <p className="text-gray-400 text-sm">You've reached the end</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ArticlesContent />
        </Suspense>
    );
}
