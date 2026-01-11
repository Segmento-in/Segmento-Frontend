'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import { Clock, ExternalLink } from "lucide-react";
import ViewCounter from "@/components/pulse/ViewCounter";

// Force dynamic rendering (for client components, only 'dynamic' is allowed)
export const dynamic = 'force-dynamic';

// Category relationship mapping - each category shows only its related subcategories
const categoryRelationships: Record<string, Array<{ id: string; name: string }>> = {
    // Data categories show all data subcategories
    'data-security': [
        { id: "data-security", name: "Data Security" },
        { id: "data-governance", name: "Data Governance" },
        { id: "data-privacy", name: "Data Privacy" },
        { id: "data-engineering", name: "Data Engineering" },
    ],
    'data-governance': [
        { id: "data-security", name: "Data Security" },
        { id: "data-governance", name: "Data Governance" },
        { id: "data-privacy", name: "Data Privacy" },
        { id: "data-engineering", name: "Data Engineering" },
    ],
    'data-privacy': [
        { id: "data-security", name: "Data Security" },
        { id: "data-governance", name: "Data Governance" },
        { id: "data-privacy", name: "Data Privacy" },
        { id: "data-engineering", name: "Data Engineering" },
    ],
    'data-engineering': [
        { id: "data-security", name: "Data Security" },
        { id: "data-governance", name: "Data Governance" },
        { id: "data-privacy", name: "Data Privacy" },
        { id: "data-engineering", name: "Data Engineering" },
    ],

    // AI shows only AI
    'ai': [{ id: "ai", name: "AI" }],

    // Cloud Computing shows cloud provider subcategories
    'cloud-computing': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
    ],
    'cloud-aws': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
    ],
    'cloud-gcp': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
    ],
    'cloud-azure': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
    ],
    'cloud-ibm': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
    ],
    'cloud-oracle': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
    ],
    'cloud-digitalocean': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
    ],

    // Magazines shows only magazines
    'magazines': [{ id: "magazines", name: "Magazines" }],
};

function NewsContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') || 'ai';

    const [newsData, setNewsData] = useState<Record<string, Article[]>>({});
    const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
    const [loading, setLoading] = useState<boolean>(false);

    // Get categories to show based on current category
    const categoriesToShow = categoryRelationships[activeCategory] || [{ id: activeCategory, name: activeCategory }];

    useEffect(() => {
        setActiveCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        const getNews = async () => {
            // Skip if already loaded and cache is fresh (within 2 minutes)
            const cached = newsData[activeCategory];
            if (cached && cached.length > 0) {
                const cacheAge = Date.now() - (cached as any)._timestamp;
                if (cacheAge < 120000) { // 2 minutes
                    return; // Use cached data
                }
            }

            try {
                setLoading(true);
                const articles = await fetchNewsByCategory(activeCategory);

                setNewsData((prev) => ({
                    ...prev,
                    [activeCategory]: Object.assign(articles, { _timestamp: Date.now() }),
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
                {categoriesToShow.map((cat) => {
                    // Check if this is a cloud provider category
                    const isCloudProvider = cat.id.startsWith('cloud-') && cat.id !== 'cloud-computing';
                    const providerName = cat.id.replace('cloud-', '');

                    return (
                        <Link
                            key={cat.id}
                            href={`/pulse/news?category=${cat.id}`}
                            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${activeCategory === cat.id
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {isCloudProvider && (
                                <img
                                    src={`/cloud-logos/${providerName}.svg`}
                                    alt={`${cat.name} logo`}
                                    className="w-5 h-5"
                                />
                            )}
                            <span>{cat.name}</span>
                        </Link>
                    );
                })}
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
                                <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                    {article.source && <span>• {article.source}</span>}
                                    <ViewCounter articleUrl={article.url} />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function NewsPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
        }>
            <NewsContent />
        </Suspense>
    );
}
