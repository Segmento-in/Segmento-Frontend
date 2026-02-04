'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import NewsCard from "@/components/pulse/NewsCard";

export const dynamic = 'force-dynamic';

/* ---------------- CATEGORY RELATIONSHIPS ---------------- */

const CLOUD_SUBCATEGORIES = [
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
];

const DATA_SUBCATEGORIES = [
  { id: "data-laws", name: "Data Laws" },
  { id: "business-analytics", name: "Business Analytics" },
  { id: "business-intelligence", name: "Business Intelligence" },
  { id: "customer-data-platform", name: "Customer Data Platform" },
  { id: "data-centers", name: "Data Centers" },
  { id: "data-engineering", name: "Data Engineering" },
  { id: "data-governance", name: "Data Governance" },
  { id: "data-management", name: "Data Management" },
  { id: "data-privacy", name: "Data Privacy" },
  { id: "data-security", name: "Data Security" },
];

const categoryRelationships: Record<string, Array<{ id: string; name: string }>> = {
  ...Object.fromEntries(DATA_SUBCATEGORIES.map(d => [d.id, DATA_SUBCATEGORIES])),
  ...Object.fromEntries(CLOUD_SUBCATEGORIES.map(c => [c.id, CLOUD_SUBCATEGORIES])),

  ai: [{ id: "ai", name: "AI" }],
  "medium-article": [{ id: "medium-article", name: "Medium Article" }],
  magazines: [{ id: "magazines", name: "Magazines" }],
};

/* ---------------- PAGE CONTENT ---------------- */

function NewsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "ai";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [newsData, setNewsData] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<Record<string, number>>({});
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({});

  // ✅ CRITICAL FIX
  const normalizedCategory =
    activeCategory.startsWith("cloud-")
      ? "cloud-computing"
      : activeCategory;

  const categoriesToShow =
    categoryRelationships[normalizedCategory] || [
      { id: activeCategory, name: activeCategory },
    ];

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const articles = await fetchNewsByCategory(activeCategory, 1, 20);

      setNewsData(prev => ({ ...prev, [activeCategory]: articles }));
      setPage(prev => ({ ...prev, [activeCategory]: 1 }));
      setHasMore(prev => ({ ...prev, [activeCategory]: articles.length >= 20 }));
      setLoading(false);
    };

    load();
  }, [activeCategory]);

  const loadMore = async () => {
    const next = (page[activeCategory] || 1) + 1;
    const more = await fetchNewsByCategory(activeCategory, next, 20);

    setNewsData(prev => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), ...more],
    }));

    setPage(prev => ({ ...prev, [activeCategory]: next }));
    setHasMore(prev => ({ ...prev, [activeCategory]: more.length >= 20 }));
  };

  const articles = newsData[activeCategory] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {categoriesToShow.map(cat => (
          <Link
            key={cat.id}
            href={`/pulse/news?category=${cat.id}`}
            className={`px-6 py-2 rounded-full ${
              activeCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center py-20">Loading…</p>
      ) : articles.length === 0 ? (
        <p className="text-center py-20 text-gray-500">
          No news available
        </p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {articles.map((a, i) => (
            <NewsCard key={i} article={a} />
          ))}
        </div>
      )}

      {hasMore[activeCategory] && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading…</p>}>
      <NewsContent />
    </Suspense>
  );
}
