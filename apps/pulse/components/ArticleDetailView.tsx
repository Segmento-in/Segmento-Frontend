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
        <div className={`container mx-auto px-3 xs:px-4 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl ${isModal ? 'bg-white rounded-2xl' : ''}`}>
            {/* Back Button - Only show if NOT a modal */}
            {!isModal && (
                <Link
                    href={props.backLink || "/news"}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{props.backLabel || "Back to News"}</span>
                </Link>
            )}

            {/* Article Header */}
            <article className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${isModal ? 'shadow-none border-none' : ''}`}>
                <div className="relative h-[250px] xs:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "/pulse/placeholder-news.svg"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-3 text-white/90 mb-3 text-sm">
                            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                                {article.source}
                            </span>
                            <TimeDisplay timestamp={article.published_at} className="text-white/90" />
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-white/60"></span>
                                <ViewCounter
                                    articleUrl={article.url}
                                    articleId={article.id}
                                    className="text-white/90"
                                />
                            </div>
                        </div>
                        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                            {article.title}
                        </h1>
                    </div>
                </div>

                <div className="p-8">
                    <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8">
                        {article.description}
                    </p>

                    <div className="flex flex-col xs:flex-row justify-center mb-6 sm:mb-8 items-center gap-3 sm:gap-4">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full xs:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/20 inline-flex items-center justify-center gap-2 transform hover:-translate-y-1 min-h-touch"
                            onClick={(e) => {
                                // If in modal, maybe we want to close it when they go to source?
                                // For now, let's keep it open or let default behavior happen
                            }}
                        >
                            <span className="hidden sm:inline">Read Full Article at Source</span>
                            <span className="inline sm:hidden">Read Article</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Audio Summary Button */}
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

                    {/* Only show comments if NOT in modal to keep it lightweight? 
                        User asked for "Same component", but comments in a hover modal might be too much.
                        Let's include it for now to be faithful to "exact same component" request.
                    */}
                    <CommentSection articleUrl={article.url} />
                </div>
            </article>
        </div>
    );
}
