'use client';

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchNewsByCategory, type Article } from "@/lib/newsApi";
import { BookOpen, Share2, ArrowDown } from "lucide-react";
import ResearchCard from "@/components/ResearchCard";

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

    const initialCategory = searchParams.get('category') || 'research';
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        } finally {
            setLoading(false);
        }
    }, [activeCategory, page, loading, hasMore]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const currentUrlCategory = params.get('category') || 'research';

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
        /* UI FIX: Paper White Background & Charcoal Text */
        <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A]">
            
            {/* Header / Sub-Nav */}
            <div className="bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#E5E2DA] sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-6">

                        {/* Title: Editorial Style */}
                        <div className="flex items-center gap-3">
                            <div className="bg-[#1A1A1A] p-2 rounded-full text-white shadow-lg">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-[#1A1A1A] font-serif italic tracking-tight">Research Papers</h1>
                        </div>

                        {/* Category Pills: Editorial Pill Style */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                            {RESEARCH_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`
                                        px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all border
                                        ${activeCategory === cat.id
                                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md active:scale-95"
                                            : "bg-white text-[#666] border-[#E5E2DA] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Intro Text: Clean Minimalist Typography */}
                <div className="mb-16 text-center md:text-left border-l-2 border-[#E5E2DA] pl-6">
                    <p className="text-[#666] max-w-3xl font-serif italic text-lg leading-relaxed">
                        Curated academic papers from ArXiv, categorized for easy discovery. 
                        Stay ahead with the latest research in AI, Cloud, and Data Engineering.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-12 text-red-700 text-center font-medium">
                        {error}
                        <button
                            onClick={() => window.location.reload()}
                            className="block mx-auto mt-3 text-xs uppercase tracking-widest font-bold hover:underline"
                        >
                            Retry Connection
                        </button>
                    </div>
                )}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {articles.map((article) => (
                        <div key={article.id || article.$id || article.url} className="h-full">
                            <ResearchCard article={article} sourceCategory={activeCategory} />
                        </div>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#1A1A1A]"></div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#666]">Retrieving Manuscripts</p>
                    </div>
                )}

                {/* No Results */}
                {!loading && articles.length === 0 && !error && (
                    <div className="col-span-full text-center py-32 bg-white/50 rounded-2xl border border-dashed border-[#E5E2DA]">
                        <BookOpen className="w-12 h-12 text-[#CCC] mx-auto mb-6" />
                        <h3 className="text-xl font-serif italic text-[#1A1A1A]">No papers found</h3>
                        <p className="text-[#666] mt-2 text-sm uppercase tracking-widest">The archives for this section are currently empty.</p>
                    </div>
                )}

                {/* Load More Trigger: Editorial Button Style */}
                {hasMore && !loading && (
                    <div className="mt-24 text-center pt-16 border-t border-[#E5E2DA]">
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={loading}
                            className="px-12 py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto group active:scale-95 disabled:opacity-30"
                        >
                            <span>Load More Research</span>
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* End of Feed */}
                {!hasMore && articles.length > 0 && (
                    <div className="mt-20 py-8 border-t border-[#E5E2DA] text-center">
                        <p className="text-[#666] font-serif italic text-lg">
                            You've reached the end of the research list.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ResearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#1A1A1A]"></div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[#666]">Opening Library</p>
            </div>
        }>
            <ResearchContent />
        </Suspense>
    );
}