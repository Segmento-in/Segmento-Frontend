'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Database, Cloud, BookOpen, Brain, Shield, Workflow, Lock, TrendingUp } from "lucide-react";
import { fetchNewsByCategory, type Article } from "@/lib/pulse/newsApi";

export default function PulsePage() {
  const [newsData, setNewsData] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirstNews = async () => {
      const categories = [
        'ai','data-security','data-governance','data-privacy','data-engineering',
        'business-intelligence','data-management','cloud-computing','magazines',
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

  const getLatestNews = (category: string) => newsData[category]?.[0];

  // Category Card Component
  const CategoryBox = ({
    category,
    title,
    icon: Icon,
    colSpan,
    height,
    fallbackGradient
  }: {
    category: string;
    title: string;
    icon: any;
    colSpan: string;
    height: string;
    fallbackGradient: string;
  }) => {
    const news = getLatestNews(category);
    const imageUrl = news?.image || '';

    return (
      <Link
        href={`/pulse/news?category=${category}`}
        className={`${colSpan} relative group overflow-hidden rounded-2xl ${height} transition-all duration-500 transform hover:scale-[1.02]`}
      >
        {/* Background Image / Gradient */}
        {imageUrl && !loading ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`}></div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/20 transition-colors duration-500"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6">
          <div>
            <div className="inline-block p-3 bg-white/20 backdrop-blur-md rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-white/20 rounded w-full"></div>
                <div className="h-3 bg-white/10 rounded w-4/5"></div>
              </div>
            ) : news ? (
              <p className="text-white/90 text-sm line-clamp-3">{news.title}</p>
            ) : (
              <p className="text-white/70 text-sm">No news available</p>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
            <span className="text-sm font-medium">Explore More</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Segmento Pulse
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Real-time technology insights
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-4">
          <CategoryBox category="ai" title="Artificial Intelligence" icon={Brain} colSpan="col-span-12 md:col-span-4" height="h-[280px]" fallbackGradient="from-purple-500 to-pink-500" />
          <CategoryBox category="data-engineering" title="Data Engineering" icon={Workflow} colSpan="col-span-6 md:col-span-4" height="h-[280px]" fallbackGradient="from-indigo-500 to-blue-500" />
          <CategoryBox category="data-governance" title="Data Governance" icon={Database} colSpan="col-span-6 md:col-span-4" height="h-[280px]" fallbackGradient="from-green-500 to-teal-500" />
          <CategoryBox category="business-intelligence" title="Business Intelligence" icon={TrendingUp} colSpan="col-span-12 md:col-span-3" height="h-[220px]" fallbackGradient="from-blue-500 to-cyan-500" />
          <CategoryBox category="data-privacy" title="Data Privacy" icon={Lock} colSpan="col-span-12 md:col-span-3" height="h-[220px]" fallbackGradient="from-amber-500 to-orange-500" />
          <CategoryBox category="data-security" title="Data Security" icon={Shield} colSpan="col-span-12 md:col-span-3" height="h-[220px]" fallbackGradient="from-red-500 to-pink-500" />
          <CategoryBox category="cloud-computing" title="Cloud Computing" icon={Cloud} colSpan="col-span-12 md:col-span-3" height="h-[220px]" fallbackGradient="from-cyan-500 to-blue-600" />
          <CategoryBox category="magazines" title="Tech Magazines" icon={BookOpen} colSpan="col-span-12 md:col-span-6" height="h-[220px]" fallbackGradient="from-gray-700 to-gray-900" />
          <CategoryBox category="data-management" title="Data Management" icon={Database} colSpan="col-span-12 md:col-span-6" height="h-[220px]" fallbackGradient="from-green-500 to-emerald-600" />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Click any category to explore the latest news and insights
          </p>
        </div>
      </div>
    </div>
  );
}
