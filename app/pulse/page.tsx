'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Sparkles,
    Database,
    Cloud,
    BookOpen,
    Brain,
    Shield,
    Workflow,
    Lock,
    TrendingUp
} from "lucide-react";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";

export default function PulsePage() {
    const [newsData, setNewsData] = useState<Record<string, Article[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFirstNews = async () => {
            const categories = [
                'ai', 'data-security', 'data-governance', 'data-privacy',
                'data-engineering', 'business-intelligence', 'data-management',
                'cloud-computing', 'magazines', 'business-analytics',
                'customer-data-platform', 'data-centers'
            ];

            try {
                const newsPromises = categories.map(async (cat) => {
                    try {
                        const articles = await fetchNewsByCategory(cat);
                        return { category: cat, articles: articles.slice(0, 1) };
                    } catch (error) {
                        console.error(`Failed to fetch ${cat}:`, error);
                        return { category: cat, articles: [] };
                    }
                });

                const results = await Promise.all(newsPromises);
                const newsMap: Record<string, Article[]> = {};
                results.forEach(({ category, articles }) => {
                    newsMap[category] = articles;
                });

                setNewsData(newsMap);
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFirstNews();
    }, []);

    const getLatestNews = (category: string) => {
        return newsData[category]?.[0];
    };

    const CategoryBox = ({
        category,
        title,
        icon: Icon,
        colSpan,
        rowSpan = 1,
        height,
        fallbackGradient
    }: {
        category: string;
        title: string;
        icon: any;
        colSpan: string;
        rowSpan?: number;
        height: string;
        fallbackGradient: string;
    }) => {
        const news = getLatestNews(category);
        const imageUrl = news?.image || '';

        return (
            <Link
                href={`/pulse/news?category=${category}`}
                className={`${colSpan} ${rowSpan > 1 ? 'row-span-2' : ''} group relative overflow-hidden rounded-2xl ${height} transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]`}
            >
                {/* Background Image with Dark Overlay */}
                {imageUrl && !loading ? (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        ></div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500"></div>
                    </>
                ) : (
                    <div className={`absolute inset-0 bg-linear-to-br ${fallbackGradient}`}></div>
                )}

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0ZXJuPjw2ZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

                <div className="relative h-full flex flex-col justify-between p-6">
                    <div>
                        <div className="inline-block p-2.5 bg-white/20 backdrop-blur-sm rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Icon className={`${rowSpan > 1 ? 'w-8 h-8' : 'w-6 h-6'} text-white`} />
                        </div>
                        <h3 className={`${rowSpan > 1 ? 'text-2xl md:text-3xl' : 'text-lg'} font-bold text-white mb-2`}>
                            {title}
                        </h3>

                        {loading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-3 bg-white/20 rounded w-full"></div>
                                <div className="h-3 bg-white/10 rounded w-4/5"></div>
                            </div>
                        ) : news ? (
                            <div className="animate-fade-in">
                                <p className={`text-white/90 ${rowSpan > 1 ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'} leading-relaxed`}>
                                    {news.title}
                                </p>
                                {rowSpan > 1 && (
                                    <div className="flex items-center gap-1.5 mt-3">
                                        <TrendingUp className="w-3.5 h-3.5 text-white/80" />
                                        <span className="text-xs text-white/80 font-medium">Latest Update</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-white/70 text-xs">No news available</p>
                        )}
                    </div>

                    {rowSpan > 1 && (
                        <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors mt-4">
                            <span className="text-sm font-medium">Explore More</span>
                            <Sparkles className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
                {/* Hero Text */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                        Segmento Pulse
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Real-time technology insights
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-3">
                    {/* Large Box - AI */}
                    <CategoryBox
                        category="ai"
                        title="Artificial Intelligence"
                        icon={Brain}
                        colSpan="col-span-12 md:col-span-5"
                        height="h-[480px] md:h-[710px]"
                        fallbackGradient="from-purple-400 via-pink-500 to-indigo-600"
                    />

                    {/* Right Column Nested Grid */}
                    <div className="col-span-12 md:col-span-7 grid grid-cols-7 gap-3">
                        <CategoryBox category="data-engineering" title="Data Engineering" icon={Workflow} colSpan="col-span-7 md:col-span-3" height="h-[170px]" fallbackGradient="from-indigo-500 to-purple-600" />
                        <CategoryBox category="data-governance" title="Data Governance" icon={Database} colSpan="col-span-7 md:col-span-4" height="h-[170px]" fallbackGradient="from-emerald-500 to-teal-600" />

                        <CategoryBox category="business-intelligence" title="Business Intelligence" icon={TrendingUp} colSpan="col-span-7 md:col-span-3" height="h-[170px]" fallbackGradient="from-blue-500 to-cyan-600" />
                        <CategoryBox category="data-privacy" title="Data Privacy" icon={Lock} colSpan="col-span-7 md:col-span-4" height="h-[170px]" fallbackGradient="from-amber-500 to-orange-600" />

                        <CategoryBox category="data-security" title="Data Security" icon={Shield} colSpan="col-span-7 md:col-span-3" height="h-[170px]" fallbackGradient="from-red-500 to-pink-600" />
                        <CategoryBox category="data-centers" title="Data Centers" icon={Database} colSpan="col-span-7 md:col-span-4" height="h-[170px]" fallbackGradient="from-gray-600 to-slate-700" />

                        <CategoryBox category="business-analytics" title="Business Analytics" icon={TrendingUp} colSpan="col-span-7 md:col-span-3" height="h-[170px]" fallbackGradient="from-violet-500 to-purple-600" />
                        <CategoryBox category="customer-data-platform" title="Customer Data Platform" icon={Database} colSpan="col-span-7 md:col-span-4" height="h-[170px]" fallbackGradient="from-pink-500 to-rose-600" />
                    </div>

                    {/* Bottom Row */}
                    <CategoryBox category="data-management" title="Data Management" icon={Database} colSpan="col-span-12 md:col-span-4" height="h-[180px]" fallbackGradient="from-green-500 to-emerald-600" />
                    <CategoryBox category="cloud-computing" title="Cloud Computing" icon={Cloud} colSpan="col-span-12 md:col-span-4" height="h-[180px]" fallbackGradient="from-cyan-500 to-blue-600" />
                    <CategoryBox category="magazines" title="Tech Magazines" icon={BookOpen} colSpan="col-span-12 md:col-span-4" height="h-[180px]" fallbackGradient="from-gray-700 to-gray-900" />
                </div>

                {/* Footer Text */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Click any category to explore the latest news and insights
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
        </div>
    );
}
