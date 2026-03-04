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

export const dynamic = 'force-dynamic';



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

    const categoriesToShow = categoryRelationships[activeCategory] || [{ id: activeCategory, name: activeCategory }];

    useEffect(() => {
        setActiveCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        const getNews = async () => {
            const cached = newsData[activeCategory];
            if (cached && cached.length > 0) {
                const cacheAge = Date.now() - (cached as any)._timestamp;
                if (cacheAge < 120000) return;
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
        /* UI FIX: Ronas IT Light Mode Base (Warm Background) */
        <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A]">
            <div className="container mx-auto px-4 py-12">
                
                {/* UI FIX: Pilled Navigation with Editorial Styling */}
                <div className="flex gap-2 mb-12 flex-wrap justify-center border-b border-[#E5E2DA] pb-10">
                    {categoriesToShow.map((cat) => {
                        const isCloudProvider = cat.id.startsWith('cloud-') && cat.id !== 'cloud-computing';
                        const providerName = cat.id.replace('cloud-', '');
                        const isActive = activeCategory === cat.id;

                        return (
                            <Link
                                key={cat.id}
                                href={`/news?category=${cat.id}`}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all border ${
                                    isActive
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md"
                                        : "bg-white text-[#666] border-[#E5E2DA] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                                } flex items-center gap-2`}
                            >
                                {isCloudProvider && (
                                    <img
                                        src={`/cloud-logos/${providerName}.${['salesforce', 'alibaba', 'tencent', 'huawei'].includes(providerName) ? 'png' : 'svg'}`}
                                        alt=""
                                        className={`w-3.5 h-3.5 object-contain ${isActive ? 'brightness-0 invert' : ''}`}
                                    />
                                )}
                                <span>{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* UI FIX: Grid Layout & Loading States */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#1A1A1A]"></div>
                        <p className="mt-4 text-[#666] uppercase tracking-widest text-[10px] font-bold">Refreshing Feed</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#E5E2DA] rounded-xl">
                        <p className="text-[#999] italic font-serif">The archives for this section are currently empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {articles.map((article, i) => (
                            <NewsCard key={i} article={article} />
                        ))}
                    </div>
                )}

                {/* UI FIX: Editorial "Load More" Button */}
                {!loading && articles.length > 0 && hasMore[activeCategory] && (
                    <div className="text-center mt-20 pt-16 border-t border-[#E5E2DA]">
                        <button
                            onClick={loadMoreNews}
                            disabled={loadingMore}
                            className="px-12 py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 disabled:opacity-30 flex items-center gap-3 mx-auto"
                        >
                            {loadingMore ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Load More Articles</span>
                            )}
                        </button>
                        <p className="text-[9px] uppercase tracking-widest text-[#AAA] mt-6 font-bold">
                            Viewing {articles.length} pieces — Page {currentPage[activeCategory] || 1}
                        </p>
                    </div>
                )}

                {/* UI FIX: Footer Divider Message */}
                {!loading && articles.length > 0 && !hasMore[activeCategory] && (
                    <div className="text-center mt-20 py-8 border-t border-[#E5E2DA]">
                        <p className="text-[#666] font-serif italic text-lg">Reached End of {activeCategory} archives.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NewsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="text-[#1A1A1A] font-serif italic text-2xl animate-pulse">The Daily News</div>
            </div>
        }>
            <NewsContent />
        </Suspense>
    );
}