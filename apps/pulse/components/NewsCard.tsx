'use client';

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import TimeDisplay from "@/components/TimeDisplay";
import CardEngagementStats from "@/components/CardEngagementStats";
import { getFreshnessTag } from "@/lib/dateUtils";
import { type Article } from "@/lib/newsApi";
import AudioPlayer from "@/components/AudioPlayer";
import ArticleDetailView from "@/components/ArticleDetailView";

interface NewsCardProps {
    article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
    const freshness = getFreshnessTag(article.published_at);
    const safeImage = article.image_url && article.image_url !== "None" ? article.image_url : "/placeholder-news.svg";

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Hover Logic
    const handleMouseEnter = () => {
        // Start 2s timer
        timerRef.current = setTimeout(() => {
            setShowModal(true);
        }, 2000);
    };

    const handleMouseLeave = () => {
        // Cancel timer if mouse leaves before 2s
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Close modal
    const closeModal = () => setShowModal(false);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        if (showModal) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showModal]);

    // Construct the article URL params (legacy link)
    const articleLink = `/news/article?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description || '')}&image=${encodeURIComponent(safeImage)}&date=${encodeURIComponent(article.published_at)}&source=${encodeURIComponent(article.source)}&id=${article.$id || ''}&category=${article.category || ''}&audio_url=${encodeURIComponent(article.audio_url || '')}&text_summary=${encodeURIComponent(article.text_summary || '')}`;

    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                // THEME: Deep Navy Base #020617 with Subtle Indigo Glow
                className="group block bg-[#020617] rounded-2xl overflow-hidden relative border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:shadow-[0_0_45px_rgba(168,85,247,0.35)] transition-all duration-300"
            >
                <Link href={articleLink} className="block h-full">
                    {/* HEADER: Purple to Blue Gradient Overlay */}
                    <div className="relative h-28">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 z-10 opacity-90" />
                        
                        {/* Branding text often seen in your reference images */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <h3 className="text-white font-bold text-lg tracking-tight">Segmento Pulse</h3>
                        </div>

                        {/* Top UI Elements */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-30">
                            {/* Tag: Soft Mint / Cyan */}
                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-200 text-emerald-900">
                                Today's News
                            </span>

                            {/* External: White/Blur circle with icon */}
                            <div className="bg-white/20 backdrop-blur-md rounded-full p-2">
                                <ExternalLink className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* BODY: Indigo to Navy Gradient #1b1464 -> #0b102a */}
                    <div className="p-4 bg-gradient-to-b from-[#1b1464] via-[#1a1f6b] to-[#0b102a] space-y-3">
                        <h4 className="text-white font-semibold text-base line-clamp-2 group-hover:text-cyan-300 transition-colors">
                            {article.title}
                        </h4>
                        
                        <div className="flex items-center justify-between text-sm text-blue-600 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <AudioPlayer
                                    articleId={article.$id || article.url}
                                    articleUrl={article.url}
                                    initialAudioUrl={article.audio_url}
                                    title={article.title}
                                    image={safeImage}
                                    category={article.category || ''}
                                />
                                <div className="text-[11px] opacity-80">
                                    <TimeDisplay timestamp={article.published_at} />
                                </div>
                            </div>

                            <div className="scale-90 origin-right">
                                <CardEngagementStats
                                    articleUrl={article.url}
                                    articleId={article.$id}
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
            </div>

            {/* Portal for Hover Modal - Using the requested Navy/Indigo theme */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#1b1464] to-[#020617] rounded-2xl shadow-2xl border border-indigo-500/30 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                        onMouseLeave={() => {
                            setTimeout(closeModal, 500);
                        }}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <ArticleDetailView
                            article={{
                                url: article.url,
                                title: article.title,
                                description: article.description || '',
                                image_url: safeImage,
                                published_at: article.published_at,
                                source: article.source,
                                category: article.category || '',
                                id: article.$id || '',
                                audio_url: article.audio_url,
                                text_summary: article.text_summary
                            }}
                            isModal={true}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}