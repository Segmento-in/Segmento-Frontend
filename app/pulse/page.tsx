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
    staticLabel,
    bgImage
  }: {
    category: string;
    title: string;
    icon: any;
    colSpan: string;
    height: string;
    gradient: string;
    staticLabel: string;
    bgImage: string;
  }) => {
    const news = getLatestNews(category);

    return (
      <Link
        href={`/pulse/news?category=${category}`}
        className={`${colSpan} ${height} relative group overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-[1.01] shadow-lg hover:shadow-2xl border border-white/10`}
      >
        {/* Actual Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        
        {/* Gradient Overlay to match the image styling */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-85 group-hover:opacity-75 transition-opacity`}></div>
        
        {/* Visual Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-left">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-8 h-8 text-white drop-shadow-md" />
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

          <div className="flex items-center gap-2 text-white/90 font-bold text-sm group-hover:gap-3 transition-all">
            <span>Explore More</span>
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-30 group-hover:opacity-10 transition-opacity"></div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Animation Styles for the "Pulse GIF" effect */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes breath {
          0%, 100% { opacity: 0.8; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.2); }
        }
        .animate-shimmer {
          animation: shimmer 3.5s infinite;
        }
        .animate-breath {
          animation: breath 3s ease-in-out infinite;
        }
      `}</style>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Hero Area with Pulse Shimmer Effect */}
        <div className="text-center mb-12">
          <div className="relative inline-block overflow-hidden px-2 py-1">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight animate-breath">
              Segmento Pulse
            </h1>
            {/* The Shimmer Beam Overlay */}
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-500 font-medium">
            Real-time technology insights
          </p>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-12 gap-5">
          
          {/* AI - Large Card */}
          <CategoryBox 
            category="ai" 
            title="Artificial Intelligence" 
            icon={Brain} 
            colSpan="col-span-12 md:col-span-5" 
            height="h-[360px]" 
            staticLabel="AI Breakthrough in Healthcare Innovations"
            gradient="from-purple-600 to-indigo-900" 
            bgImage="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80"
          />

          {/* Top Right Cluster */}
          <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-5">
            <CategoryBox 
              category="data-engineering" 
              title="Data Engineering" 
              icon={Workflow} 
              colSpan="col-span-1" 
              height="h-[170px]" 
              staticLabel="Building Scalable Data Pipelines"
              gradient="from-blue-600 to-blue-800"
              bgImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80"
            />
            <CategoryBox 
              category="data-governance" 
              title="Data Governance" 
              icon={Database} 
              colSpan="col-span-1" 
              height="h-[170px]" 
              staticLabel="New Compliance Frameworks"
              gradient="from-green-600 to-emerald-900"
              bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
            />
            <CategoryBox 
              category="data-privacy" 
              title="Data Privacy" 
              icon={Lock} 
              colSpan="col-span-2" 
              height="h-[166px]" 
              staticLabel="Navigating Global Privacy Laws"
              gradient="from-orange-500 to-amber-600"
              bgImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
            />
          </div>

          {/* Middle Row */}
          <CategoryBox 
            category="business-intelligence" 
            title="Business Intelligence" 
            icon={TrendingUp} 
            colSpan="col-span-12 md:col-span-3" 
            height="h-[280px]" 
            staticLabel="Top BI Trends 2024"
            gradient="from-blue-400 to-blue-600"
            bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
          />

          {/* Decorative image spacer */}
          <div className="col-span-12 md:col-span-4 h-[280px] rounded-2xl overflow-hidden shadow-lg relative">
             <img 
               src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
               className="w-full h-full object-cover" 
               alt="City Background" 
             />
             <div className="absolute inset-0 bg-orange-900/20"></div>
          </div>

          <CategoryBox 
            category="data-security" 
            title="Data Security" 
            icon={Shield} 
            colSpan="col-span-12 md:col-span-5" 
            height="h-[280px]" 
            staticLabel="Protecting Sensitive Data"
            gradient="from-red-700/80 to-black/90"
            bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"
          />

          {/* Bottom Row */}
          <CategoryBox 
            category="magazines" 
            title="Tech Magazines" 
            icon={BookOpen} 
            colSpan="col-span-12 md:col-span-4" 
            height="h-[220px]" 
            staticLabel="Top Reads This Month"
            gradient="from-stone-700/60 to-stone-900/90"
            bgImage="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80"
          />

          <CategoryBox 
            category="data-management" 
            title="Data Management" 
            icon={Database} 
            colSpan="col-span-12 md:col-span-4" 
            height="h-[220px]" 
            staticLabel="Mastering Data Integration"
            gradient="from-emerald-600 to-green-800"
            bgImage="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80"
          />

          <CategoryBox 
            category="cloud-computing" 
            title="Cloud Computing" 
            icon={Cloud} 
            colSpan="col-span-12 md:col-span-4" 
            height="h-[220px]" 
            staticLabel="The Future of Cloud Services"
            gradient="from-sky-600 to-indigo-900"
            bgImage="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80"
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