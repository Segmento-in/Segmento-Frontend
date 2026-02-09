'use client';

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import NewsCard from "@/components/pulse/NewsCard";
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

    useEffect(() => {
        // If invalid source, redirect to medium
        if (source !== 'medium' && source !== 'linkedin') {
            router.replace('/pulse/articles/medium');
            return;
        }

        const loadArticles = async () => {
            setLoading(true);
            try {
                // Map logical tab to API category
                // CRITICAL: Ensure exact mapping to Backend Category
                const category = activeTab === 'medium' ? 'medium-article' : 'linkedin-article';
                const data = await fetchNewsByCategory(category, 1, 20);
                setArticles(data);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setLoading(false);
            }
        };
        loadArticles();
    }, [activeTab, source, router]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
                Curated Articles
            </h1>

            {/* Filter Tabs - Now using Links for Explicit Routing */}
            <div className="flex justify-center mb-10">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                    <Link
                        href="/pulse/articles/medium"
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'medium'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Medium Articles
                    </Link>
                    <Link
                        href="/pulse/articles/linkedin"
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
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl">
                        💼
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">LinkedIn Integration Coming Soon</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        We are working on bringing you the best professional insights directly from top LinkedIn creators. Stay tuned!
                    </p>
                </div>
            ) : loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-muted-foreground">Loading expert insights...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500">No articles found for this section yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {articles.map((article, i) => (
                        <NewsCard key={i} article={article} />
                    ))}
                </div>
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
