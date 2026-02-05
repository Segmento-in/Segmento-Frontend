'use client';

import Link from "next/link";
import { Brain, Workflow, Database, Lock, Shield, Cloud, BookOpen, TrendingUp } from "lucide-react";

export default function PulsePage() {
  // Hardcoded static categories and images to match your uploaded design
  const categories = [
    {
      key: "ai",
      title: "Artificial Intelligence",
      icon: Brain,
      image: "/images/ai-cover.png", // replace with actual image path
      gradient: "from-purple-500 to-pink-500",
      colSpan: "col-span-12 md:col-span-4",
      height: "h-[280px]",
    },
    {
      key: "data-engineering",
      title: "Data Engineering",
      icon: Workflow,
      image: "/images/data-engineering.png",
      gradient: "from-indigo-500 to-blue-500",
      colSpan: "col-span-6 md:col-span-4",
      height: "h-[280px]",
    },
    {
      key: "data-governance",
      title: "Data Governance",
      icon: Database,
      image: "/images/data-governance.png",
      gradient: "from-green-500 to-teal-500",
      colSpan: "col-span-6 md:col-span-4",
      height: "h-[280px]",
    },
    {
      key: "business-intelligence",
      title: "Business Intelligence",
      icon: TrendingUp,
      image: "/images/business-intelligence.png",
      gradient: "from-blue-500 to-cyan-500",
      colSpan: "col-span-12 md:col-span-3",
      height: "h-[220px]",
    },
    {
      key: "data-privacy",
      title: "Data Privacy",
      icon: Lock,
      image: "/images/data-privacy.png",
      gradient: "from-amber-500 to-orange-500",
      colSpan: "col-span-12 md:col-span-3",
      height: "h-[220px]",
    },
    {
      key: "data-security",
      title: "Data Security",
      icon: Shield,
      image: "/images/data-security.png",
      gradient: "from-red-500 to-pink-500",
      colSpan: "col-span-12 md:col-span-3",
      height: "h-[220px]",
    },
    {
      key: "cloud-computing",
      title: "Cloud Computing",
      icon: Cloud,
      image: "/images/cloud-computing.png",
      gradient: "from-cyan-500 to-blue-600",
      colSpan: "col-span-12 md:col-span-3",
      height: "h-[220px]",
    },
    {
      key: "magazines",
      title: "Tech Magazines",
      icon: BookOpen,
      image: "/images/magazines.png",
      gradient: "from-gray-700 to-gray-900",
      colSpan: "col-span-12 md:col-span-6",
      height: "h-[220px]",
    },
    {
      key: "data-management",
      title: "Data Management",
      icon: Database,
      image: "/images/data-management.png",
      gradient: "from-green-500 to-emerald-600",
      colSpan: "col-span-12 md:col-span-6",
      height: "h-[220px]",
    },
  ];

  const CategoryBox = ({ category }: { category: typeof categories[0] }) => {
    const Icon = category.icon;
    return (
      <Link
        href={`/pulse/news?category=${category.key}`}
        className={`${category.colSpan} relative group overflow-hidden rounded-2xl ${category.height} transition-all duration-500 transform hover:scale-[1.02]`}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${category.image})` }}
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/20 transition-colors duration-500"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6">
          <div>
            <div className="inline-block p-3 bg-white/20 backdrop-blur-md rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
            <p className="text-white/90 text-sm line-clamp-3">Explore the latest insights in {category.title}.</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
            <span className="text-sm font-medium">Explore More</span>
            <TrendingUp className="w-4 h-4" />
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
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Segmento Pulse
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Real-time technology insights
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-4">
          {categories.map((cat) => (
            <CategoryBox key={cat.key} category={cat} />
          ))}
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
