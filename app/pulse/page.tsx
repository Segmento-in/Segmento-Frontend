'use client';

import Link from "next/link";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    author: string;
    date: string;
    featured?: boolean;
}

const newsData: NewsItem[] = [
    {
        id: "1",
        title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
        excerpt:
            "Researchers at MIT unveil revolutionary AI system that outperforms humans on complex reasoning tasks...",
        image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        category: "AI",
        author: "Dr. Sarah Chen",
        date: "Jan 8, 2026",
        featured: true,
    },
    {
        id: "2",
        title: "Quantum Computing Milestone: Error Correction Achieved",
        excerpt:
            "Google Quantum AI team demonstrates breakthrough in quantum error correction...",
        image:
            "https://images.unsplash.com/photo-1612178289449-b426724797ec?w=400&h=300&fit=crop",
        category: "Cloud Computing",
        author: "James Park",
        date: "Jan 7, 2026",
    },
    {
        id: "3",
        title: "Cybersecurity: Zero-Day Exploits Target Cloud Infrastructure",
        excerpt:
            "Critical vulnerabilities discovered in major cloud providers...",
        image:
            "https://images.unsplash.com/photo-1613977257592-6205e87d73a8?w=400&h=300&fit=crop",
        category: "Cyber Security",
        author: "Maria Lopez",
        date: "Jan 6, 2026",
    },
];

const categories = [
    "AI",
    "Data",
    "Cyber Security",
    "Cloud Computing",
    "Magazines",
];

export default function PulsePage() {
    const featuredNews = newsData.find((news) => news.featured);
    const latestNews = newsData.filter((news) => !news.featured);
    const trendingNews = newsData.slice(0, 5);

    return (
        <>
            {/* Hero Section */}
            <section className="py-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h1 className="text-4xl font-bold mb-2">Today's Headlines</h1>
                    <p className="text-muted-foreground mb-6">
                        Stay informed with the latest technology news
                    </p>

                    {featuredNews && (
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <img
                                src={featuredNews.image}
                                alt={featuredNews.title}
                                className="w-full h-72 object-cover rounded-xl mb-4"
                            />
                            <h2 className="text-2xl font-bold mb-2">{featuredNews.title}</h2>
                            <p className="text-muted-foreground mb-4">{featuredNews.excerpt}</p>
                            <span className="text-sm text-gray-500">
                                {featuredNews.author} • {featuredNews.date}
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="py-6 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl flex gap-3 overflow-x-auto">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={`/pulse/news?category=${cat.toLowerCase()}`}
                            className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-blue-50 whitespace-nowrap"
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Latest News */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="text-yellow-500" />
                        <h2 className="text-2xl font-bold">Latest News</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestNews.map((news) => (
                            <Link
                                key={news.id}
                                href={`/pulse/news/${news.id}`}
                                className="block bg-white rounded-xl shadow hover:shadow-lg transition"
                            >
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-48 object-cover rounded-t-xl"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold mb-2">{news.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{news.excerpt}</p>
                                    <span className="text-xs text-gray-500">
                                        {news.author} • {news.date}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending News */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-green-500" />
                        <h2 className="text-2xl font-bold">Trending Now</h2>
                    </div>

                    <div className="space-y-4">
                        {trendingNews.map((news, i) => (
                            <Link
                                key={news.id}
                                href={`/pulse/news/${news.id}`}
                                className="flex gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                            >
                                <span className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">
                                    {i + 1}
                                </span>
                                <div>
                                    <h3 className="font-semibold">{news.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {news.category} • {news.date}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
