import { CategoryPageTemplate } from "@/components/templates/CategoryPage";
import { notFound } from "next/navigation";
import { fetchNewsByCategory } from "@/lib/newsApi";
import { use } from "react";

// ── CATEGORY UI METADATA ────────────────────────────────────
// We strictly preserve the aesthetic definitions (Colors, SVG Icons, Titles) designed for UI-2.
type CategoryUI = {
    title: string;
    subtitle: string;
    heroBgColor: string;
    heroIconShapeColor?: string;
    heroIconSVG: React.ReactNode;
    tags: string[];
};

const CATEGORY_UI_METADATA: Record<string, CategoryUI> = {
    "ai": {
        title: "AI",
        subtitle: "The latest breakthroughs in Artificial Intelligence, LLMs, and Generative tech.",
        heroBgColor: "#FFEAF0",
        heroIconShapeColor: "#FF8EAB",
        heroIconSVG: (
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        tags: ["Artificial Intelligence"],
    },
    "data": {
        title: "DATA",
        subtitle: "In-depth insights, benchmarks, and data engineering patterns.",
        heroBgColor: "#F4EAFF",
        heroIconShapeColor: "#B28CFF",
        heroIconSVG: (
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        tags: ["All Data Articles", "Data Engineering", "Data Governance", "Data Management", "Data Privacy", "Data Security", "Data Laws", "Customer Data Platform", "Business Intelligence", "Business Analytics", "Data Centers"],
    },
    "cloud": {
        title: "CLOUD",
        subtitle: "Cloud infrastructure, serverless architectures, and deployment scale.",
        heroBgColor: "#E6F5FF",
        heroIconShapeColor: "#80C5FF",
        heroIconSVG: (
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M6 9h12M6 15h12" />
            </svg>
        ),
        tags: ["All Cloud", "AWS", "GCP", "Azure", "IBM Cloud", "Oracle", "DigitalOcean", "Salesforce", "Alibaba Cloud", "Tencent Cloud", "Huawei Cloud", "Cloudflare"],
    },
    "magzines": {
        title: "MAGZINES",
        subtitle: "Weekly tech digests, developer interviews, and team spotlights.",
        heroBgColor: "#FFEAF0",
        heroIconShapeColor: "#FF8EAB",
        heroIconSVG: (
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
        ),
        tags: ["Magazine"],
    },
    "articles": {
        title: "ARTICLES",
        subtitle: "Real-time updates, tutorials, and deep-dive technical articles.",
        heroBgColor: "#FFF0E4",
        heroIconShapeColor: "#FFB380",
        heroIconSVG: (
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        tags: ["Medium Article"],
    },
    "research-papers": {
        title: "RESEARCH PAPERS",
        subtitle: "Academic papers, algorithm breakdowns, and advanced research.",
        heroBgColor: "#E3F1ED",
        heroIconShapeColor: "#8ED1C1",
        heroIconSVG: (
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
        ),
        tags: ["Research Paper"],
    }
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    const uiData = CATEGORY_UI_METADATA[resolvedParams.slug];
    if (!uiData) notFound();

    // ── SSR Data Fetching ──────────────────────────────────────────
    const articles = await fetchNewsByCategory(resolvedParams.slug, 1, 30);

    // Split payload for the UI template format
    const featuredArticles = articles.slice(0, 2).map(a => ({ ...a, id: a.id as string, url: a.url as string, tag: a.tag || "News", author: a.source || a.author || "Pulse", date: a.published_at as string, views: a.views || 0, imgSrc: a.image_url as string, imgAlt: a.title }));
    const listArticles = articles.slice(2).map(a => ({ ...a, id: a.id as string, url: a.url as string, tag: a.tag || "News", author: a.source || a.author || "Pulse", date: a.published_at as string, views: a.views || 0, imgSrc: a.image_url as string, imgAlt: a.title }));

    return (
        <CategoryPageTemplate
            title={uiData.title}
            subtitle={uiData.subtitle}
            heroBgColor={uiData.heroBgColor}
            heroIconShapeColor={uiData.heroIconShapeColor}
            heroIcon={uiData.heroIconSVG}
            tags={uiData.tags}
            featuredArticles={featuredArticles}
            listArticles={listArticles}
            categorySlug={resolvedParams.slug}
        />
    );
}
