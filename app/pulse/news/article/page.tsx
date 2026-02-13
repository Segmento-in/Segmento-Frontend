'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ArticleDetailView from '@/components/pulse/ArticleDetailView';

export const dynamic = 'force-dynamic';

function ArticleContent() {
    const searchParams = useSearchParams();

    // Retrieve metadata from URL params
    const url = searchParams.get('url') || '';
    const title = searchParams.get('title') || 'Untitled Article';
    const description = searchParams.get('description') || '';
    const image_url = searchParams.get('image') || '';
    const published_at = searchParams.get('date') || new Date().toISOString();
    const source = searchParams.get('source') || 'Unknown Source';
    const category = searchParams.get('category') || '';
    const id = searchParams.get('id') || '';
    const audio_url = searchParams.get('audio_url') || undefined;
    const text_summary = searchParams.get('text_summary') || undefined;

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

    // Construct article object for the view
    const articleData = {
        url,
        title,
        description,
        image_url,
        published_at,
        source,
        category,
        id,
        audio_url,
        text_summary
    };

    return <ArticleDetailView article={articleData} isModal={false} />;
}

export default function ArticlePage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ArticleContent />
        </Suspense>
    );
}
