'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import TimeDisplay from '@/components/pulse/TimeDisplay';
import ArticleInteraction from '@/components/pulse/ArticleInteraction';
import CommentSection from '@/components/pulse/CommentSection';
import ViewCounter from '@/components/pulse/ViewCounter';
import { incrementArticleView } from '@/lib/pulse/analytics';
import AudioPlayer from '@/components/pulse/AudioPlayer';

export const dynamic = 'force-dynamic';

function ArticleContent() {
    const searchParams = useSearchParams();

    // Retrieve metadata from URL params
    const url = searchParams.get('url') || '';
    const title = searchParams.get('title') || 'Untitled Article';
    const description = searchParams.get('description') || '';
    const image = searchParams.get('image') || '';
    const date = searchParams.get('date') || new Date().toISOString();
    const source = searchParams.get('source') || 'Unknown Source';
    const category = searchParams.get('category') || '';
    const id = searchParams.get('id') || ''; // NEW: Get authoritative ID from URL

    // CRITICAL: View Count Fix
    // Use a ref to ensure we strictly only increment once per mount per URL
    const hasIncrementedRef = useRef(false);

    useEffect(() => {
        if (url && !hasIncrementedRef.current) {
            hasIncrementedRef.current = true;
            // Pass full metadata to ensure article creation on backend
            // NEW: Pass authoritative ID from query params
            incrementArticleView(url, title, image, category, id);
        }
    }, [url, title, image, category, id]);

    if (!url) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p>Article not found.</p>
                <Link href="/pulse/news" className="text-blue-600 hover:underline mt-4 inline-block">
                    Return to News
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back Button */}
            <Link
                href="/pulse/news"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to News</span>
            </Link>

            {/* Article Header */}
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-[400px] w-full">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-3 text-white/90 mb-3 text-sm">
                            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                                {source}
                            </span>
                            <TimeDisplay timestamp={date} className="text-white/90" />
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-white/60"></span>
                                <ViewCounter
                                    articleUrl={url}
                                    articleId={id}
                                    className="text-white/90"
                                />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                            {title}
                        </h1>
                    </div>
                </div>

                <div className="p-8">
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                        {description}
                    </p>

                    <div className="flex justify-center mb-8 flex-col items-center gap-4">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/20 inline-flex items-center gap-2 transform hover:-translate-y-1"
                        >
                            <span>Read Full Article at Source</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Audio Player Integration */}
                        <div className="w-full max-w-md bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="text-center mb-2 text-sm font-medium text-gray-500">Listen to Summary</div>
                            <div className="flex justify-center">
                                <AudioPlayer
                                    articleId={id || url}
                                    articleUrl={url}
                                    initialAudioUrl={searchParams.get('audio_url') || undefined}
                                    title={title}
                                    image={image}
                                    category={category}
                                />
                            </div>
                        </div>
                    </div>

                    <ArticleInteraction
                        articleUrl={url}
                        articleTitle={title}
                        category={category}
                        articleId={id}
                        autoTrackView={false}
                    />

                    <CommentSection articleUrl={url} />
                </div>
            </article>
        </div>
    );
}

export default function ArticlePage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ArticleContent />
        </Suspense>
    );
}
