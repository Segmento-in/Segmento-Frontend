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

    const activeTab = (source === 'linkedin' || source === 'medium') ? source : 'medium';

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12;

    useEffect(() => {
        setArticles([]);
        setPage(1);
        setHasMore(true);
    }, [activeTab]);

    useEffect(() => {
        if (source !== 'medium' && source !== 'linkedin') {
            router.replace('/articles/medium');
            return;
        }

        const loadArticles = async () => {
            setLoading(true);
            try {
                const category = activeTab === 'medium' ? 'medium-article' : 'linkedin-article';
                const data = await fetchNewsByCategory(category, 1, LIMIT);
                setArticles(data);
                setHasMore(data.length >= LIMIT);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setLoading(false);
            }
        };

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
        /* UI FIX: Paper White Background & Charcoal Text */
        <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A]">
            <div className="container mx-auto px-4 py-12">
                
                {/* Header: Editorial Typography (Matches News Style) */}
                <h1 className="text-4xl font-bold mb-12 text-center text-[#1A1A1A] tracking-tight font-serif italic">
                    Curated Articles
                </h1>

                {/* Filter Tabs: Pilled Editorial Navigation */}
                <div className="flex justify-center mb-12 border-b border-[#E5E2DA] pb-10">
                    <div className="inline-flex gap-2">
                        <Link
                            href="/articles/medium"
                            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all border ${
                                activeTab === 'medium'
                                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md"
                                    : "bg-white text-[#666] border-[#E5E2DA] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                            }`}
                        >
                            Medium Articles
                        </Link>
                        <Link
                            href="/articles/linkedin"
                            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all border ${
                                activeTab === 'linkedin'
                                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md"
                                    : "bg-white text-[#666] border-[#E5E2DA] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                            }`}
                        >
                            LinkedIn Articles
                        </Link>
                    </div>
                </div>

                {/* Content Grid */}
                {activeTab === 'linkedin' ? (
                    <div className="text-center py-20 border border-dashed border-[#E5E2DA] rounded-xl">
                        <div className="w-16 h-16 bg-[#1A1A1A]/5 text-[#1A1A1A] rounded-full flex items-center justify-center mb-4 text-2xl mx-auto">
                            💼
                        </div>
                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 uppercase tracking-widest text-[12px]">Integration Coming Soon</h3>
                        <p className="text-[#666] font-serif italic max-w-md mx-auto">
                            We are working on bringing you the best professional insights directly from top LinkedIn creators.
                        </p>
                    </div>
                ) : articles.length === 0 && !loading ? (
                    <div className="text-center py-20 bg-white/50 border border-[#E5E2DA] rounded-2xl">
                        <p className="text-[#666] font-serif italic">The archives for this section are currently empty.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {articles.map((article, i) => (
                                <NewsCard key={`${article.url}-${i}`} article={article} />
                            ))}
                        </div>

                        {/* Pagination: Editorial "Load More" (Matches News Page) */}
                        <div className="text-center mt-20 pt-16 border-t border-[#E5E2DA]">
                            {loading ? (
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#1A1A1A]"></div>
                            ) : hasMore ? (
                                <button
                                    onClick={loadMore}
                                    className="px-12 py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto"
                                >
                                    <span>Load More Articles</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                            ) : (
                                <p className="text-[10px] uppercase tracking-widest text-[#AAA] font-bold">You've reached the end of the collection</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="text-[#1A1A1A] font-serif italic text-2xl animate-pulse font-bold uppercase tracking-[0.25em]">Articles</div>
            </div>
        }>
            <ArticlesContent />
        </Suspense>
    );
}