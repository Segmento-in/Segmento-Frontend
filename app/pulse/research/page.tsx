'use client';

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import { BookOpen, Share2 } from "lucide-react";
import ResearchCard from "@/components/pulse/ResearchCard";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const RESEARCH_CATEGORIES = [
    { id: "research", name: "All Research" },
    { id: "research-ai", name: "Artificial Intelligence" },
    { id: "research-ml", name: "Machine Learning" },
    { id: "research-cloud", name: "Cloud Computing" },
    { id: "research-data", name: "Data Engineering" },
];

function ResearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initial category from URL or default to 'research' (All)
    const initialCategory = searchParams.get('category') || 'research';
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    // State Management
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchNewsByCategory(activeCategory, 1, 12);
                setArticles(data);
                setPage(1);
                setHasMore(data.length >= 12);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch research papers.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitial();
    }, [activeCategory]);

    // Load More Callback
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const data = await fetchNewsByCategory(activeCategory, nextPage, 12);

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setArticles(prev => [...prev, ...data]);
                setPage(nextPage);
                setHasMore(data.length >= 12);
            }
        } catch (err) {
            console.error(err);
            // Don't set global error on load more failure, just stop
        } finally {
            setLoading(false);
        }
    }, [activeCategory, page, loading, hasMore]);

    // Infinite Scroll Hook Removed
    // const { lastElementRef } = useInfiniteScroll(loadMore, hasMore, loading);

    // Update URL when category changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const currentUrlCategory = params.get('category') || 'research';

        // Only update URL if the category actually changed
        if (currentUrlCategory !== activeCategory) {
            if (activeCategory === 'research') {
                params.delete('category');
            } else {
                params.set('category', activeCategory);
            }
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [activeCategory, router, searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Sub-Nav */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">

                        {/* Title */}
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Research Papers</h1>
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                            {RESEARCH_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                                        ${activeCategory === cat.id
                                            ? "bg-blue-600 text-white shadow-md active:scale-95"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Intro Text */}
                <div className="mb-8">
                    <p className="text-gray-600 max-w-3xl">
                        Curated academic papers from ArXiv, categorized for easy discovery.
                        Stay ahead with the latest research in AI, Cloud, and Data Engineering.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700 text-center">
                        {error}
                        <button
                            onClick={() => window.location.reload()}
                            className="block mx-auto mt-2 text-sm font-bold hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <div key={article.id || article.$id || article.url} className="h-full">
                            <ResearchCard article={article} sourceCategory={activeCategory} />
                        </div>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="col-span-full py-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* No Results */}
                {!loading && articles.length === 0 && !error && (
                    <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No papers found</h3>
                        <p className="text-gray-500 mt-1">Check back later or try a different category.</p>
                    </div>
                )}

                {/* Load More Trigger */}
                {hasMore && (
                    <div className="mt-12 text-center">
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Load More Papers'}
                        </button>
                    </div>
                )}

                {/* End of Feed */}
                {!hasMore && articles.length > 0 && (
                    <div className="mt-12 text-center text-gray-400 text-sm">
                        You've reached the end of the list.
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ResearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <ResearchContent />
        </Suspense>
    );
}
