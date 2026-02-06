'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Database, Cloud, BookOpen, Brain, Shield, Workflow, Lock, TrendingUp, Zap } from "lucide-react";
// Assuming fetchNewsByCategory is your custom internal API
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
        
        {/* Animated Data "Pulse" Overlay - This creates the GIF-like interesting effect */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-[pulse_3s_ease-in-out_infinite] transform -skew-y-12 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-[2000ms]"></div>
        </div>

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
            <Sparkles className="w-5 h-5 animate-pulse text-yellow-300" />
          </div>
        </div>

        {/* Glossy Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 opacity-40 group-hover:opacity-60 transition-opacity"></div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Hero Area with "Pulse" Text Effect */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full animate-pulse"></div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight tracking-tighter">
            Segmento Pulse
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <p className="text-xl md:text-2xl text-gray-400 font-semibold tracking-tight">
              Real-time technology insights
            </p>
          </div>
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

        {/* Final Interactive Footer */}
        <div className="mt-20 text-center group cursor-default">
          <div className="inline-flex flex-col items-center">
             <Zap className="w-8 h-8 text-yellow-400 animate-bounce mb-2" />
             <h2 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors uppercase tracking-[0.3em]">
               Segmento Pulse
             </h2>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
               Powered by Real-Time Data Intelligence
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}