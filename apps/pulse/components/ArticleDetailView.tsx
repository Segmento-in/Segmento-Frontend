'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import TimeDisplay from '@/components/TimeDisplay';
import ArticleInteraction from '@/components/ArticleInteraction';
import CommentSection from '@/components/CommentSection';
import ViewCounter from '@/components/ViewCounter';
import { incrementArticleView } from '@/lib/analytics';
import AudioSummaryButton from '@/components/AudioSummaryButton';
import { Article } from '@/lib/newsApi';

interface ArticleDetailViewProps {
    article: {
        url: string;
        title: string;
        description: string;
        image_url: string;
        published_at: string;
        source: string;
        category: string;
        id: string; // Appwrite ID
        audio_url?: string;
        text_summary?: string;
    };
    isModal?: boolean; // If true, disables view tracking and back button
    onClose?: () => void;
    backLink?: string;
    backLabel?: string;
}

export default function ArticleDetailView({ article, isModal = false, onClose, ...props }: ArticleDetailViewProps) {
    const hasIncrementedRef = useRef(false);

    useEffect(() => {
        // Only track view if NOT in modal mode and haven't tracked yet
        if (!isModal && article.url && !hasIncrementedRef.current) {
            hasIncrementedRef.current = true;
            incrementArticleView(
                article.url,
                article.title,
                article.image_url,
                article.category,
                article.id
            );
        }
    }, [article, isModal]);

    return (
        // MODAL THEME: Deep Navy Background instead of White
        <div className={`container mx-auto px-3 xs:px-4 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl ${isModal ? 'bg-[#020617] rounded-2xl' : ''}`}>
            {/* Back Button - Only show if NOT a modal */}
            {!isModal && (
                <Link
                    href={props.backLink || "/news"}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{props.backLabel || "Back to News"}</span>
                </Link>
            )}

            {/* Article Container - Removed white bg and shadow for modal mode */}
            <article className={`bg-[#020617] rounded-2xl border border-indigo-500/30 overflow-hidden ${isModal ? 'shadow-none border-none' : 'shadow-2xl'}`}>
                {/* Image Header Area - Added Gradient for Theme */}
                <div className="relative h-[250px] xs:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "/pulse/placeholder-news.svg"; }}
                    />
                    {/* Updated Gradient: Deeper Indigo/Navy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-indigo-950/50 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-3 text-white/90 mb-3 text-sm">
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                                {article.source}
                            </span>
                            <TimeDisplay timestamp={article.published_at} className="text-white/80" />
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-white/60"></span>
                                <ViewCounter
                                    articleUrl={article.url}
                                    articleId={article.id}
                                    className="text-white/80"
                                />
                            </div>
                        </div>
                        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                            {article.title}
                        </h1>
                    </div>
                </div>

                {/* Content Area - Dark Theme */}
                <div className="p-8 bg-gradient-to-b from-[#0b102a] to-[#020617]">
                    <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed mb-6 sm:mb-8">
                        {article.description}
                    </p>

                    <div className="flex flex-col xs:flex-row justify-center mb-6 sm:mb-8 items-center gap-3 sm:gap-4">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full xs:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/20 inline-flex items-center justify-center gap-2 transform hover:-translate-y-0.5 min-h-touch"
                        >
                            <span className="hidden sm:inline">Read Full Article at Source</span>
                            <span className="inline sm:hidden">Read Article</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Audio Summary Button - Style remains handled by component */}
                        <AudioSummaryButton
                            articleId={article.id || article.url}
                            articleUrl={article.url}
                            initialAudioUrl={article.audio_url}
                            initialTextSummary={article.text_summary}
                            title={article.title}
                            image={article.image_url}
                            category={article.category}
                        />
                    </div>

                    <ArticleInteraction
                        articleUrl={article.url}
                        articleTitle={article.title}
                        category={article.category}
                        articleId={article.id}
                        autoTrackView={false} // Already handled by parent/page
                    />

                    {/* Comment Section - Using Dark Theme */}
                    <div className="mt-8 pt-8 border-t border-indigo-500/20">
                        <CommentSection articleUrl={article.url} />
                    </div>
                </div>
            </article>
        </div>
    );
}