'use client';

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ExternalLink, X, Clock } from "lucide-react";
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

    const articleLink = `/news/article?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description || '')}&image=${encodeURIComponent(safeImage)}&date=${encodeURIComponent(article.published_at)}&source=${encodeURIComponent(article.source)}&id=${article.$id || ''}&category=${article.category || ''}&audio_url=${encodeURIComponent(article.audio_url || '')}&text_summary=${encodeURIComponent(article.text_summary || '')}`;

    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group block bg-white rounded-xl overflow-hidden relative border border-[#E5E2DA] hover:border-[#1A1A1A] transition-all duration-500 shadow-sm hover:shadow-xl"
            >
                <Link href={articleLink} className="block h-full">
                    {/* HEADER */}
                    <div className="relative h-44 overflow-hidden">
                        <img 
                            src={safeImage} 
                            alt="" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        <div className="absolute top-0 left-0 z-30">
                            {(() => {
                                const newsDate = new Date(article.published_at);
                                const today = new Date();
                                const yesterday = new Date();
                                today.setHours(0, 0, 0, 0);
                                yesterday.setDate(today.getDate() - 1);
                                yesterday.setHours(0, 0, 0, 0);
                                newsDate.setHours(0, 0, 0, 0);

                                if (newsDate.getTime() === today.getTime()) {
                                    return (
                                        <div className="bg-[#1A1A1A] text-white px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-br-lg shadow-md">
                                            Today's News
                                        </div>
                                    );
                                }
                                if (newsDate.getTime() === yesterday.getTime()) {
                                    return (
                                        <div className="bg-[#E5E2DA] text-[#1A1A1A] px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-br-lg shadow-md">
                                            Yesterday
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>

                    {/* LOWER PART: Compact & High Contrast */}
                    <div className="p-4 bg-[#A66152] space-y-2">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">
                                    {article.source || "NEWS SOURCE"}
                                </span>
                                <div className="h-[0.5px] flex-grow bg-white/10"></div>
                            </div>
                            <h4 className="text-[#F9F7F2] font-serif text-[15px] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                                {article.title}
                            </h4>
                        </div>
                        
                        {/* Compact Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                {/* Small Audio Button */}
                                <div className="scale-75 -ml-1">
                                    <div className="p-1 rounded-full bg-white/10 text-#5C3A31 border-[#A66152]">
                                        <AudioPlayer
                                            articleId={article.$id || article.url}
                                            articleUrl={article.url}
                                            initialAudioUrl={article.audio_url}
                                            title={article.title}
                                            image={safeImage}
                                            category={article.category || ''}
                                        />
                                    </div>
                                </div>
                                
                                {/* Compact Contrast Date/Time */}
                               <div className="flex flex-col leading-tight [&&_*]:!text-white/70">
                                    <div className="text-[1px] font-black ">
                                        <TimeDisplay timestamp={article.published_at} />
                                    </div>
                                </div>
                            </div>

                            {/* Ultra Compact Stats */}
                            <div className="scale-[1] origin-right brightness-0 invert opacity-60">
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

            {/* Modal remains unchanged to preserve logic */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden bg-white rounded-2xl shadow-2xl border border-[#E5E2DA]"
                        onClick={(e) => e.stopPropagation()}
                        onMouseLeave={() => {
                            setTimeout(closeModal, 500);
                        }}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 z-50 p-2 bg-[#F9F7F2] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="overflow-y-auto h-full max-h-[85vh]">
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
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}