'use client';

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { FileText, Cpu, Cloud, Database, Brain, X, Volume2 } from "lucide-react";
import TimeDisplay from "@/components/TimeDisplay";
import CardEngagementStats from "@/components/CardEngagementStats";
import { getFreshnessTag } from "@/lib/dateUtils";
import { type Article } from "@/lib/newsApi";
import ArticleDetailView from "@/components/ArticleDetailView";

interface ResearchCardProps {
    article: Article;
    sourceCategory?: string;
}

// Updated Icons for Dark Theme Visibility
const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('ai') || cat.includes('ml')) return <Brain className="w-8 h-8 text-purple-400" />;
    if (cat.includes('cloud')) return <Cloud className="w-8 h-8 text-blue-400" />;
    if (cat.includes('data')) return <Database className="w-8 h-8 text-cyan-400" />;
    return <FileText className="w-8 h-8 text-slate-400" />;
};

// Updated Colors for Dark Theme
const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('ai') || cat.includes('ml')) return "bg-purple-500/10 border-purple-500/20";
    if (cat.includes('cloud')) return "bg-blue-500/10 border-blue-500/20";
    if (cat.includes('data')) return "bg-cyan-500/10 border-cyan-500/20";
    return "bg-slate-500/10 border-slate-500/20";
};

export default function ResearchCard({ article, sourceCategory }: ResearchCardProps) {
    const freshness = getFreshnessTag(article.published_at);
    // Use PDF URL if available, fallback to article url
    const pdfUrl = article.url;

    const linkHref = {
        pathname: `/research/${article.id || article.$id}`,
        query: sourceCategory ? { category: sourceCategory } : undefined
    };

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Hover Logic (Unchanged)
    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setShowModal(true);
        }, 2000); // 2s delay
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const closeModal = () => setShowModal(false);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        if (showModal) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showModal]);

    return (
        <>
            <Link
                href={linkHref}
                // Updated Card Background to Deep Navy
                className="group block bg-[#1e293b]rounded-2xl shadow-xl hover:shadow-indigo-500/10 transition-all overflow-hidden border border-white/5 h-full flex flex-col relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* --- NEW: Gradient Top Bar --- */}
                <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>

                <div className="p-5 flex flex-col h-full">
                    {/* Header: Icon + Category + Freshness */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl border ${getCategoryColor(article.category || '')}`}>
                            {getCategoryIcon(article.category || '')}
                        </div>
                        {/* Updated Freshness Tag Style */}
                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-sm ${freshness.className}`}>
                            {freshness.text}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {article.title}
                    </h3>

                    {/* Authors */}
                    {article.author && (
                        <p className="text-sm text-slate-400 mb-3 italic">
                            By {article.author}
                        </p>
                    )}

                    {/* Abstract/Summary (Truncated) */}
                    <p className="text-sm text-slate-300 mb-4 line-clamp-3 flex-grow">
                        {article.text_summary || article.description}
                    </p>

                    {/* Footer: Read PDF + Stats */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(pdfUrl, '_blank');
                            }}
                            className="flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer z-10"
                        >
                            <FileText className="w-4 h-4" />
                            Read PDF
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            {/* --- NEW: Audio Icon to match Screenshot --- */}
                            <Volume2 className="w-4 h-4 text-slate-600" />
                            <TimeDisplay timestamp={article.published_at} />
                            <CardEngagementStats
                                articleUrl={article.url}
                                articleId={article.id || article.$id}
                                category={article.category}
                                initialStats={{
                                    viewCount: article.views || 0,
                                    likeCount: article.likes || 0,
                                    dislikeCount: article.dislikes || 0
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Link>


            {/* Portal for Hover Modal (Unchanged) */}
            {
                showModal && typeof window !== 'undefined' && createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                        onClick={closeModal}
                    >
                        <div
                            ref={modalRef}
                            // Updated Modal Card Style
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#020617] rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                            onMouseLeave={() => setTimeout(closeModal, 500)}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <ArticleDetailView
                                article={{
                                    ...article,
                                    id: article.$id || '',
                                    image_url: article.image_url || '/pulse/placeholder-news.svg',
                                    category: article.category || 'Research',
                                    description: article.text_summary || article.description || '', // Handle varied fields
                                }}
                                isModal={true}
                            />
                        </div>
                    </div>,
                    document.body
                )
            }
        </>
    );
}