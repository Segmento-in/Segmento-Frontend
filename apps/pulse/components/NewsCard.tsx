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
    const articleLink = `/pulse/news/article?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description || '')}&image=${encodeURIComponent(safeImage)}&date=${encodeURIComponent(article.published_at)}&source=${encodeURIComponent(article.source)}&id=${article.$id || ''}&category=${article.category || ''}&audio_url=${encodeURIComponent(article.audio_url || '')}&text_summary=${encodeURIComponent(article.text_summary || '')}`;

    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden relative"
            >
                {/* Wrap content in Link but handle click to avoid double nav if desired? 
                      Actually, clicking should still go to page if modal hasn't opened yet.
                  */}
                <Link href={articleLink} className="block h-full">
                    {/* Image Section */}
                    <div className="relative h-32">
                        <img
                            src={safeImage}
                            onError={(e) => { e.currentTarget.src = "/pulse/placeholder-news.svg"; }}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Freshness Tag */}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm ${freshness.className}`}>
                            {freshness.text}
                        </div>

                        {/* External Link Icon */}
                        <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2">
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                        </div>

                        {/* Source Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                                <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                                    Source: {article.source}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3">
                        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {article.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                            <div className="flex items-center gap-2">
                                <AudioPlayer
                                    articleId={article.$id || article.url}
                                    articleUrl={article.url}
                                    initialAudioUrl={article.audio_url}
                                    title={article.title}
                                    image={safeImage}
                                    category={article.category || ''}
                                />
                                <TimeDisplay timestamp={article.published_at} />
                            </div>
                            <CardEngagementStats
                                articleUrl={article.url}
                                articleId={article.$id}  // NEW: Use authoritative backend ID
                                initialStats={{
                                    viewCount: article.views || 0,
                                    likeCount: article.likes || 0,
                                    dislikeCount: article.dislikes || 0
                                }}
                            />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Portal for Hover Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={closeModal} // Close on backdrop click
                >
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
                        onMouseLeave={() => {
                            // Grace period close on mouse leave from MODAL itself?
                            // User requirement: "Mouse leave the Modal Area ... closes it after a short grace period (0.5s)"
                            setTimeout(closeModal, 500);
                        }}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
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
