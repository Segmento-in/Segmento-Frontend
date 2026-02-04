'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";
import NewsCard from "@/components/pulse/NewsCard";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/* =========================
   SHARED CATEGORY GROUPS
========================= */

// Cloud categories (defined ONCE)
const cloudCategories = [
  { id: "cloud", name: "All Cloud" },
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

// Data categories (defined ONCE)
const dataCategories = [
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

/* =========================
   CATEGORY RELATIONSHIPS
========================= */

const categoryRelationships: Record<
  string,
  Array<{ id: string; name: string }>
> = {
  // DATA (all behave the same)
  "data-laws": dataCategories,
  "business-analytics": dataCategories,
  "business-intelligence": dataCategories,
  "customer-data-platform": dataCategories,
  "data-centers": dataCategories,
  "data-engineering": dataCategories,
  "data-governance": dataCategories,
  "data-management": dataCategories,
  "data-privacy": dataCategories,
  "data-security": dataCategories,

  // CLOUD (all behave the same)
  "cloud": cloudCategories,
  "cloud-aws": cloudCategories,
  "cloud-gcp": cloudCategories,
  "cloud-azure": cloudCategories,
  "cloud-ibm": cloudCategories,
  "cloud-oracle": cloudCategories,
  "cloud-digitalocean": cloudCategories,
  "cloud-salesforce": cloudCategories,
  "cloud-alibaba": cloudCategories,
  "cloud-tencent": cloudCategories,
  "cloud-huawei": cloudCategories,
  "cloud-cloudflare": cloudCategories,

  // Others
  "ai": [{ id: "ai", name: "AI" }],
  "medium-article": [{ id: "medium-article", name: "Medium Article" }],
  "magazines": [{ id: "magazines", name: "Magazines" }],
};

/* =========================
   PAGE CONTENT
========================= */

function NewsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "ai";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [newsData, setNewsData] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(false);

  const categoriesToShow =
    categoryRelationships[activeCategory] || [
      { id: activeCategory, name: activeCategory },
    ];

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const articles = await fetchNewsByCategory(activeCategory, 1, 20);
        setNewsData((prev) => ({ ...prev, [activeCategory]: articles }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [activeCategory]);

  const articles = newsData[activeCategory] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* CATEGORY BUTTONS */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {categoriesToShow.map((cat) => {
          const isCloudProvider =
            cat.id.startsWith("cloud-") && cat.id !== "cloud";
          const providerName = cat.id.replace("cloud-", "");

          return (
            <Link
              key={cat.id}
              href={`/pulse/news?category=${cat.id}`}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {isCloudProvider && (
                <img
                  src={`/cloud-logos/${providerName}.svg`}
                  alt={cat.name}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-20">Loading news...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No news available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {articles.map((article, i) => (
            <NewsCard key={i} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   PAGE EXPORT
========================= */

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <NewsContent />
    </Suspense>
  );
}
