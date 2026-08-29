'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import TimeDisplay from '@/components/TimeDisplay';
import ArticleInteraction from '@/components/ArticleInteraction';
import CommentSection from '@/components/CommentSection';
import ViewCounter from '@/components/ViewCounter';
import { incrementArticleView } from '@/lib/analytics';
import AudioSummaryButton from '@/components/AudioSummaryButton';
import { ArticleImage } from '@/components/shared/ArticleImage';
import { cn } from '@/shared/utils';

interface ArticleDetailViewProps {
    article: {
        url: string;
        title: string;
        description: string;
        image_url: string;
        published_at: string;
        source: string;
        category: string;
        id: string; 
        audio_url?: string;
        text_summary?: string;
    };
    isModal?: boolean; 
    onClose?: () => void;
    backLink?: string;
    backLabel?: string;
}

export default function ArticleDetailView({ article, isModal = false, onClose, ...props }: ArticleDetailViewProps) {
    const { theme } = useTheme();
    const hasIncrementedRef = useRef(false);

    useEffect(() => {
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
        <div className={cn(
            "container mx-auto px-4 max-w-4xl py-8",
            isModal && "py-0 px-0 max-w-full"
        )}>
            
            {!isModal && (
                <Link
                    href={props.backLink || "/news"}
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-8 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{props.backLabel || "Back to News"}</span>
                </Link>
            )}

            <article className={cn(
                "bg-white dark:bg-zinc-950 overflow-hidden",
                isModal ? "rounded-none" : "rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800"
            )}>
                
                {/* HEADER SECTION (Editorial Layout) */}
                <div className="p-6 sm:p-10 pb-6">
                    <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                            {article.source}
                        </span>
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-tight text-xs">
                            <TimeDisplay timestamp={article.published_at} />
                        </div>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                        <div className="flex items-center gap-1 font-bold text-xs">
                            <ViewCounter
                                articleUrl={article.url}
                                articleId={article.id}
                            />
                        </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-zinc-900 dark:text-white mb-6 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif italic border-l-4 border-zinc-300 dark:border-zinc-700 pl-6">
                        {article.description}
                    </p>
                </div>

                {/* HERO IMAGE */}
                <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-900">
                    <ArticleImage
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* ACTION BAR */}
                <div className="px-6 sm:px-10 py-6 border-b border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-50 dark:bg-zinc-950/50">
                    <div className="flex items-center justify-start gap-4 flex-1">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-bold transition-all shadow-sm transform hover:-translate-y-0.5"
                        >
                            <span className="whitespace-nowrap">Read Article</span>
                            <ExternalLink className="w-4 h-4 hidden sm:inline-block" />
                        </a>

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
                    
                    <div className="flex items-center gap-2">
                        <ArticleInteraction
                            articleUrl={article.url}
                            articleTitle={article.title}
                            category={article.category}
                            articleId={article.id}
                            autoTrackView={false}
                        />
                    </div>
                </div>

                {/* COMMENT SECTION */}
                <div className="p-6 sm:p-10 bg-white dark:bg-zinc-950">
                    <CommentSection articleUrl={article.url} />
                </div>
                
            </article>
        </div>
    );
}