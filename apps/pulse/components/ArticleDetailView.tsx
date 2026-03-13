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

    // Theme Colors
    const darkBrown = "#5C3A31";
    const paperWhite = "#F9F7F2";

    return (
        <div className={`container mx-auto px-3 xs:px-4 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl ${isModal ? `bg-[${darkBrown}] rounded-2xl` : ''}`}>
            
            {!isModal && (
                <Link
                    href={props.backLink || "/news"}
                    className="inline-flex items-center gap-2 text-[#5C3A31]/70 hover:text-[#5C3A31] mb-8 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{props.backLabel || "Back to News"}</span>
                </Link>
            )}

            <article className={`bg-[${darkBrown}] rounded-2xl overflow-hidden ${isModal ? 'shadow-none' : 'shadow-2xl border border-[#E5E2DA]'}`}>
                
                {/* Image Header Area */}
                <div className="relative h-[250px] xs:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "/pulse/placeholder-news.svg"; }}
                    />
                    {/* Gradient: Transitions from the dark brown up to transparent */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5C3A31] via-[#5C3A31]/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-[#A66152] px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                {article.source}
                            </span>
                            <div className="[&&_*]:!text-white/80 text-xs font-bold uppercase tracking-tight">
                                <TimeDisplay timestamp={article.published_at} />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                                <ViewCounter
                                    articleUrl={article.url}
                                    articleId={article.id}
                                    className="text-white/80 text-xs font-bold"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F9F7F2] mb-2 leading-tight">
                            {article.title}
                        </h1>
                    </div>
                </div>

                {/* Content Area - Dark Brown Theme */}
                <div className="p-6 sm:p-10 bg-[#5C3A31]">
                    <p className="text-lg sm:text-xl text-[#F9F7F2]/90 font-serif leading-relaxed mb-8 italic border-l-4 border-[#A66152] pl-6">
                        {article.description}
                    </p>

                    <div className="flex flex-col xs:flex-row justify-center mb-10 items-center gap-4">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full xs:w-auto bg-[#F9F7F2] text-[#5C3A31] hover:bg-white px-8 py-3 rounded-full font-bold transition-all shadow-xl inline-flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <span>Read Full Article</span>
                            <ExternalLink className="w-2 h-4" />
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
                    
                    {/* Interactions (Likes/Shares) - Styled to pop on brown */}
                   {/* Initial State: Forced White icons and text.
  Hover State: Keeps your existing logic.
*/}
{/* Initial State: Forced White icons (killing the powder blue).
  Hover States: Specific colors for each interaction type.
*/}
<div className="bg-white/10 rounded-2xl p-4 mb-8 border border-white/10 transition-all duration-300">
    <div className="
        /* 1. FORCE WHITE INITIALLY (Kills Powder Blue) */
        [&&_*]:!text-white [&&_svg]:!stroke-white [&&_svg]:!text-white 
        
        /* 2. TARGET INDIVIDUAL HOVERS (Specific Colors) */
        /* Note: This assumes the internal buttons are in order or identifiable by their hover targets */
        /* Like: Blue */
        [&_button:nth-child(1):hover_*]:!text-blue-400 [&_button:nth-child(1):hover_svg]:!stroke-blue-400
        
        /* Dislike: Red */
        [&_button:nth-child(2):hover_*]:!text-red-500 [&_button:nth-child(2):hover_svg]:!stroke-red-500
        
        /* Share: Green */
        [&_button:last-child:hover_*]:!text-emerald-400 [&_button:last-child:hover_svg]:!stroke-emerald-400
        
        opacity-90 transition-all">
        
        <ArticleInteraction
            articleUrl={article.url}
            articleTitle={article.title}
            category={article.category}
            articleId={article.id}
            autoTrackView={false}
        />
    </div>
</div>

                    {/* Comment Section */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        
                        <CommentSection articleUrl={article.url} />
                    </div>
                </div>
            </article>
        </div>
    );
}