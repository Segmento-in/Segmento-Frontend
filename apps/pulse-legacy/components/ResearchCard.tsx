'use client';

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { FileText, Cpu, Cloud, Database, Brain, X, Volume2, ArrowRight } from "lucide-react";
import TimeDisplay from "@/components/TimeDisplay";
import CardEngagementStats from "@/components/CardEngagementStats";
import { getFreshnessTag } from "@/lib/dateUtils";
import { type Article } from "@/lib/newsApi";
import ArticleDetailView from "@/components/ArticleDetailView";

interface ResearchCardProps {
    article: Article;
    sourceCategory?: string;
}

// UI FIX: Sophisticated, muted icon colors for Paper White theme
const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('ai') || cat.includes('ml')) return <Brain className="w-5 h-5 text-[#1A1A1A]" />;
    if (cat.includes('cloud')) return <Cloud className="w-5 h-5 text-[#1A1A1A]" />;
    if (cat.includes('data')) return <Database className="w-5 h-5 text-[#1A1A1A]" />;
    return <FileText className="w-5 h-5 text-[#1A1A1A]" />;
};

// UI FIX: Minimalist border-based colors instead of neon glows
const getCategoryColor = (category: string) => {
    return "bg-[#F0EEE6] border-[#E5E2DA]";
};

export default function ResearchCard({ article, sourceCategory }: ResearchCardProps) {
    const freshness = getFreshnessTag(article.published_at);
    const pdfUrl = article.url;

    const linkHref = {
        pathname: `/research/${article.id || article.$id}`,
        query: sourceCategory ? { category: sourceCategory } : undefined
    };

    const [showModal, setShowModal] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setShowModal(true);
        }, 2000);
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
                // UI FIX: Clean White Background with Sharp Charcoal Borders
                className="group block bg-white border border-[#E5E2DA] hover:border-[#1A1A1A] transition-all duration-500 h-full flex flex-col relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* --- UI FIX: Minimal Editorial Accent Bar --- */}
                <div className="h-[1px] w-0 group-hover:w-full bg-[#1A1A1A] transition-all duration-700"></div>

                <div className="p-6 flex flex-col h-full">
                    {/* Header: Label + Freshness */}
                    <div className="flex justify-between items-center mb-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getCategoryColor(article.category || '')}`}>
                            {getCategoryIcon(article.category || '')}
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                                {article.category || 'Research'}
                            </span>
                        </div>
                        
                        <div className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border border-current ${freshness.className}`}>
                            {freshness.text}
                        </div>
                    </div>

                    {/* Title: Editorial Serif Feel */}
                    <h3 className="font-serif italic text-xl mb-3 text-[#1A1A1A] group-hover:underline decoration-1 underline-offset-4 transition-all line-clamp-2">
                        {article.title}
                    </h3>

                    {/* Authors: Clean Sans */}
                    {article.author && (
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-4">
                            Authored by {article.author}
                        </p>
                    )}

                    {/* Abstract: Increased line-height for readability */}
                    <p className="text-sm text-[#666] leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {article.text_summary || article.description}
                    </p>

                    
                 {/* Footer: Modern Minimalist */}
<div 
    className="flex flex-col sm:flex-row items-center justify-between mt-auto bg-[#A66152] 
               /* Vertical size increased via padding */
               p-6 
               /* Negative margins to pull the color to the card edges */
               -mx-6 -mb-6 
               border-t border-[#F0EEE6] 
               transition-all duration-300"
>
    {/* Left Side: PDF Manuscript */}
    <div
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(pdfUrl, '_blank');
        }}
        className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.2em] text-white hover:text-[#1A1A1A] transition-colors cursor-pointer z-10"
    >
        <FileText className="w-5 h-5" />
        <span>PDF Manuscript</span>
    </div>

    {/* Right Side: Stats & Audio */}
    <div className="flex items-center gap-6 text-[11px] text-white font-bold mt-4 sm:mt-0">
    <div className="flex items-center gap-2">
        {/* Increased brightness for the icon to stand out on #A66152 */}
        <Volume2 className="w-4 h-4 text-white brightness-200" />
        
        {/* Ensure TimeDisplay component accepts a className or has white text internally */}
        <div className="text-white!">
            <TimeDisplay timestamp={article.published_at} />
        </div>
    </div>

    {/* Stats wrapper to force white icons/text on the Engagement component */}
    <div className="text-white [&_svg]:text-white [&_span]:text-white">
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
                </div>
            </Link>


            {/* Portal for Hover Modal */}
            {
                showModal && typeof window !== 'undefined' && createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F9F7F2]/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
                        onClick={closeModal}
                    >
                        <div
                            ref={modalRef}
                            // UI FIX: Modal matches the Paper White theme
                            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#F9F7F2] rounded-none border border-[#1A1A1A] shadow-[20px_20px_0px_rgba(26,26,26,0.05)] animate-in zoom-in-95 duration-300"
                            onClick={(e) => e.stopPropagation()}
                            onMouseLeave={() => setTimeout(closeModal, 500)}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 z-50 p-2 hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[#1A1A1A] transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <ArticleDetailView
                                article={{
                                    ...article,
                                    id: article.$id || '',
                                    image_url: article.image_url || '/pulse/placeholder-news.svg',
                                    category: article.category || 'Research',
                                    description: article.text_summary || article.description || '',
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