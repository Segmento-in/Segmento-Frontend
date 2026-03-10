'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchNewsByCategory, type Article } from "@/lib/newsApi";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Clock, ExternalLink } from "lucide-react";
import ViewCounter from "@/components/ViewCounter";
import TimeDisplay from "@/components/TimeDisplay";
import CardEngagementStats from "@/components/CardEngagementStats";
import NewsCard from "@/components/NewsCard";

// Force dynamic rendering (for client components, only 'dynamic' is allowed)
export const dynamic = 'force-dynamic';

// Custom-ordered pill list for all Data sub-pages.
// "All Data Articles" sits first (the master button), then core data topics,
// then business topics, then infrastructure. No alphabetical sort applied.
const DATA_PILLS = [
    { id: "data-articles", name: "All Data Articles" },
    { id: "data-engineering", name: "Data Engineering" },
    { id: "data-governance", name: "Data Governance" },
    { id: "data-management", name: "Data Management" },
    { id: "data-privacy", name: "Data Privacy" },
    { id: "data-security", name: "Data Security" },
    { id: "data-laws", name: "Data Laws" },
    { id: "customer-data-platform", name: "Customer Data Platform" },
    { id: "business-intelligence", name: "Business Intelligence" },
    { id: "business-analytics", name: "Business Analytics" },
    { id: "data-centers", name: "Data Centers" },
];

// Category relationship mapping - each category shows only its related subcategories
const categoryRelationships: Record<string, Array<{ id: string; name: string }>> = {
    // All data categories share the same custom-ordered DATA_PILLS list.
    'data-articles': DATA_PILLS,
    'data-security': DATA_PILLS,
    'data-governance': DATA_PILLS,
    'data-privacy': DATA_PILLS,
    'data-engineering': DATA_PILLS,
    'business-analytics': DATA_PILLS,
    'business-intelligence': DATA_PILLS,
    'customer-data-platform': DATA_PILLS,
    'data-centers': DATA_PILLS,
    'data-management': DATA_PILLS,
    'data-laws': DATA_PILLS,

    // AI shows only AI (label updated to match the navbar rename)
    'ai': [{ id: "ai", name: "Artificial Intelligence" }],

    // Medium Article shows only Medium Article
    'medium-article': [{ id: "medium-article", name: "Medium Article" }],

    // Cloud Computing shows cloud provider subcategories
    'cloud-computing': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-aws': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-gcp': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-azure': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-ibm': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-oracle': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-digitalocean': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-salesforce': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-alibaba': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-tencent': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-huawei': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
    ],
    'cloud-cloudflare': [
        { id: "cloud-computing", name: "All Cloud" },
        { id: "cloud-aws", name: "AWS" },
        { id: "cloud-gcp", name: "GCP" },
        { id: "cloud-azure", name: "Azure" },
        { id: "cloud-ibm", name: "IBM Cloud" },
        { id: "cloud-oracle", name: "Oracle" },
        { id: "cloud-digitalocean", name: "DigitalOcean" },
        { id: "cloud-salesforce", name: "Salesforce" },
        { id: "cloud-alibaba", name: "Alibaba Cloud" },
        { id: "cloud-tencent", name: "Tencent Cloud" },
        { id: "cloud-huawei", name: "Huawei Cloud" },
        { id: "cloud-cloudflare", name: "Cloudflare" },
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
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
    const [hasMore, setHasMore] = useState<Record<string, boolean>>({});

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
                const articles = await fetchNewsByCategory(activeCategory, 1, 20);

                setNewsData((prev) => ({
                    ...prev,
                    [activeCategory]: Object.assign(articles, { _timestamp: Date.now() }),
                }));

                setCurrentPage((prev) => ({ ...prev, [activeCategory]: 1 }));
                setHasMore((prev) => ({ ...prev, [activeCategory]: articles.length >= 20 }));
            } catch (error) {
                console.error("News fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        getNews();
    }, [activeCategory]);

    const loadMoreNews = async () => {
        const nextPage = (currentPage[activeCategory] || 1) + 1;

        try {
            setLoadingMore(true);
            const newArticles = await fetchNewsByCategory(activeCategory, nextPage, 20);

            if (newArticles.length > 0) {
                setNewsData((prev) => ({
                    ...prev,
                    [activeCategory]: Object.assign([...prev[activeCategory], ...newArticles], { _timestamp: Date.now() }),
                }));

                setCurrentPage((prev) => ({ ...prev, [activeCategory]: nextPage }));
                setHasMore((prev) => ({ ...prev, [activeCategory]: newArticles.length >= 20 }));
            } else {
                setHasMore((prev) => ({ ...prev, [activeCategory]: false }));
            }
        } catch (error) {
            console.error("Load more error:", error);
        } finally {
            setLoadingMore(false);
        }
    };

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
                            href={`/news?category=${cat.id}`}
                            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${activeCategory === cat.id
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {isCloudProvider && (
                                <img
                                    src={`/cloud-logos/${providerName}.${['salesforce', 'alibaba', 'tencent', 'huawei'].includes(providerName) ? 'png' : 'svg'}`}
                                    alt={`${cat.name} logo`}
                                    className="w-5 h-5 object-contain"
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {articles.map((article, i) => (
                        <NewsCard key={i} article={article} />
                    ))}
                </div>
            )}

            {/* Load More Button - shown when there are more articles */}
            {!loading && articles.length > 0 && hasMore[activeCategory] && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMoreNews}
                        disabled={loadingMore}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {loadingMore ? (
                            <>
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Loading more...</span>
                            </>
                        ) : (
                            <span>Load More Articles</span>
                        )}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                        Showing {articles.length} articles • Page {currentPage[activeCategory] || 1}
                    </p>
                </div>
            )}

            {/* End of articles message */}
            {!loading && articles.length > 0 && !hasMore[activeCategory] && (
                <div className="text-center mt-8 py-4">
                    <p className="text-gray-500">You've reached the end of {activeCategory} news</p>
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
