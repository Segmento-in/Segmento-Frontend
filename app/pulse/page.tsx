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
        'ai', 'data-security', 'data-governance', 'data-privacy', 'data-engineering',
        'business-intelligence', 'data-management', 'cloud-computing', 'magazines'
      ];

      try {
        const newsPromises = categories.map(async (cat) => {
          try {
            const articles = await fetchNewsByCategory(cat);
            return { category: cat, articles: articles.slice(0, 1) };
          } catch (error) {
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

  const CategoryBox = ({
    category,
    title,
    icon: Icon,
    colSpan,
    height,
    gradient,
    staticLabel
  }: {
    category: string;
    title: string;
    icon: any;
    colSpan: string;
    height: string;
    gradient: string;
    staticLabel: string;
  }) => {
    const news = getLatestNews(category);

    return (
      <Link
        href={`/pulse/news?category=${category}`}
        className={`${colSpan} ${height} relative group overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl border border-white/10`}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-110`}></div>
        
        {/* Abstract Pattern Overlay for texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between p-7 text-left">
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-6 group-hover:bg-white/30 transition-colors">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">{title}</h3>
            
            <div className="mt-2">
              <p className="text-base font-medium text-white/90 leading-snug line-clamp-3">
                {loading ? (
                  <span className="inline-block w-full h-4 bg-white/20 animate-pulse rounded"></span>
                ) : (
                  news?.title || staticLabel
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            <span>Explore</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Glossy Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 opacity-40 group-hover:opacity-60 transition-opacity"></div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Area */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight tracking-tighter">
            Segmento Pulse
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-semibold tracking-tight">
            Real-time technology insights
          </p>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Top Left: AI */}
          <CategoryBox 
            category="ai" 
            title="Artificial Intelligence" 
            icon={Brain} 
            colSpan="col-span-12 md:col-span-5" 
            height="h-[360px]" 
            staticLabel="AI Breakthrough in Healthcare Innovations"
            gradient="from-[#8E2DE2] to-[#4A00E0]" 
          />

          {/* Top Right Cluster */}
          <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-6">
            <CategoryBox 
              category="data-engineering" 
              title="Data Engineering" 
              icon={Workflow} 
              colSpan="col-span-1" 
              height="h-[170px]" 
              staticLabel="Scaling Modern Pipelines"
              gradient="from-[#1e3c72] to-[#2a5298]" 
            />
            <CategoryBox 
              category="data-governance" 
              title="Data Governance" 
              icon={Database} 
              colSpan="col-span-1" 
              height="h-[170px]" 
              staticLabel="New Frameworks 2026"
              gradient="from-[#11998e] to-[#38ef7d]" 
            />
            <CategoryBox 
              category="data-privacy" 
              title="Data Privacy" 
              icon={Lock} 
              colSpan="col-span-2" 
              height="h-[166px]" 
              staticLabel="Navigating Global Privacy Laws & Ethics"
              gradient="from-[#f12711] to-[#f5af19]" 
            />
          </div>

          {/* Middle Row */}
          <CategoryBox 
            category="business-intelligence" 
            title="Business Intelligence" 
            icon={TrendingUp} 
            colSpan="col-span-12 md:col-span-3" 
            height="h-[280px]" 
            staticLabel="Data-Driven Strategy Trends"
            gradient="from-[#00c6ff] to-[#0072ff]" 
          />

          <CategoryBox 
            category="magazines" 
            title="Tech Magazines" 
            icon={BookOpen} 
            colSpan="col-span-12 md:col-span-4" 
            height="h-[280px]" 
            staticLabel="Curated Reads for Leaders"
            gradient="from-[#30E8BF] to-[#FF8235]" 
          />

          <CategoryBox 
            category="data-security" 
            title="Data Security" 
            icon={Shield} 
            colSpan="col-span-12 md:col-span-5" 
            height="h-[280px]" 
            staticLabel="Cyber Resilience Strategies"
            gradient="from-[#ee0979] to-[#ff6a00]" 
          />

          {/* Bottom Row */}
          <CategoryBox 
            category="data-management" 
            title="Data Management" 
            icon={Database} 
            colSpan="col-span-12 md:col-span-7" 
            height="h-[220px]" 
            staticLabel="Mastering Hybrid Cloud Integration"
            gradient="from-[#DA22FF] to-[#9733EE]" 
          />

          <CategoryBox 
            category="cloud-computing" 
            title="Cloud Computing" 
            icon={Cloud} 
            colSpan="col-span-12 md:col-span-5" 
            height="h-[220px]" 
            staticLabel="The Future of Serverless Tech"
            gradient="from-[#0575E6] to-[#021B79]" 
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Tap to reveal the future
          </p>
        </div>
      </div>
    </div>
  );
}