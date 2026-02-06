'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Database, Cloud, BookOpen, Brain, Shield, Workflow, Lock, TrendingUp, Zap } from "lucide-react";
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
    category, title, icon: Icon, colSpan, height, gradient, staticLabel, bgImage
  }: {
    category: string; title: string; icon: any; colSpan: string; height: string; gradient: string; staticLabel: string; bgImage: string;
  }) => {
    const news = getLatestNews(category);

    return (
      <Link
        href={`/pulse/news?category=${category}`}
        className={`${colSpan} ${height} relative group overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-[1.01] shadow-lg border border-white/10`}
      >
        {/* Exact Cover Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        
        {/* Gradient Overlay Matching the Reference */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-85 group-hover:opacity-80 transition-opacity`}></div>
        
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-left">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">{title}</h3>
            </div>
            
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                {loading ? (
                  <span className="inline-block w-full h-5 bg-white/20 animate-pulse rounded"></span>
                ) : (
                  news?.title || staticLabel
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
            <span>Explore</span>
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center overflow-x-hidden">
      {/* Global CSS for the GIF-like Animations */}
      <style jsx global>{`
        @keyframes scanLine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.8)); }
        }
        .animate-scan { animation: scanLine 3s linear infinite; }
        .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight tracking-tighter">
            Segmento Pulse
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-bold tracking-[0.2em] uppercase">
            Real-time technology insights
          </p>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-12 gap-5">
          
          <CategoryBox 
            category="ai" title="Artificial Intelligence" icon={Brain} 
            colSpan="col-span-12 md:col-span-5" height="h-[360px]" 
            staticLabel="AI Breakthrough in Healthcare Innovations"
            gradient="from-purple-700 to-indigo-900" 
            bgImage="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80"
          />

          <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-5">
            <CategoryBox 
              category="data-engineering" title="Data Engineering" icon={Workflow} 
              colSpan="col-span-1" height="h-[170px]" 
              staticLabel="Scaling Modern Pipelines"
              gradient="from-blue-600 to-blue-800"
              bgImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80"
            />
            <CategoryBox 
              category="data-governance" title="Data Governance" icon={Database} 
              colSpan="col-span-1" height="h-[170px]" 
              staticLabel="New Frameworks 2026"
              gradient="from-green-600 to-emerald-900"
              bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
            />
            <CategoryBox 
              category="data-privacy" title="Data Privacy" icon={Lock} 
              colSpan="col-span-2" height="h-[166px]" 
              staticLabel="Global Privacy Laws & Ethics"
              gradient="from-orange-500 to-amber-600"
              bgImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
            />
          </div>

          <CategoryBox 
            category="business-intelligence" title="Business Intelligence" icon={TrendingUp} 
            colSpan="col-span-12 md:col-span-3" height="h-[280px]" 
            staticLabel="Data-Driven Strategy Trends"
            gradient="from-cyan-500 to-blue-700"
            bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
          />

          {/* Decorative Spacer Image */}
          <div className="col-span-12 md:col-span-4 h-[280px] rounded-2xl overflow-hidden shadow-lg">
             <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Pulse View" />
          </div>

          <CategoryBox 
            category="data-security" title="Data Security" icon={Shield} 
            colSpan="col-span-12 md:col-span-5" height="h-[280px]" 
            staticLabel="Cyber Resilience Strategies"
            gradient="from-red-700/80 to-black/90"
            bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"
          />

          <CategoryBox 
            category="magazines" title="Tech Magazines" icon={BookOpen} 
            colSpan="col-span-12 md:col-span-4" height="h-[220px]" 
            staticLabel="Curated Reads for Leaders"
            gradient="from-stone-700 to-stone-950"
            bgImage="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80"
          />

          <CategoryBox 
            category="data-management" title="Data Management" icon={Database} 
            colSpan="col-span-12 md:col-span-4" height="h-[220px]" 
            staticLabel="Mastering Hybrid Cloud"
            gradient="from-emerald-600 to-green-800"
            bgImage="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80"
          />

          <CategoryBox 
            category="cloud-computing" title="Cloud Computing" icon={Cloud} 
            colSpan="col-span-12 md:col-span-4" height="h-[220px]" 
            staticLabel="Serverless Tech 2026"
            gradient="from-sky-600 to-indigo-900"
            bgImage="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80"
          />
        </div>

        {/* --- THE GIF-LIKE PULSE SECTION --- */}
        <div className="mt-32 flex flex-col items-center">
          <div className="relative group flex flex-col items-center">
            {/* Pulsating Zap Icon */}
            <Zap className="w-12 h-12 text-blue-500 mb-4 animate-pulse-glow" />
            
            <div className="relative overflow-hidden px-4 py-2 bg-gray-50 rounded-xl">
              {/* This is the name with a GIF-like scanning light beam */}
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-[0.3em] uppercase italic relative z-10">
                Segmento Pulse
              </h2>
              {/* Scanning light beam effect */}
              <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent -skew-x-12 animate-scan pointer-events-none"></div>
            </div>
            
            <p className="mt-4 text-xs font-black text-gray-400 tracking-[0.6em] uppercase">
              Powered by Segmento Data Intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}