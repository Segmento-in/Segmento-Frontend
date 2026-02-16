'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchResearchPaperById, type Article } from '@/lib/pulse/newsApi';
import ArticleDetailView from '@/components/pulse/ArticleDetailView';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [paper, setPaper] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Get category from URL query params for "Back" button history
    // We need to use useSearchParams to get the query string
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const category = searchParams ? searchParams.get('category') : null;

    useEffect(() => {
        const loadPaper = async () => {
            try {
                if (!id) return;

                const data = await fetchResearchPaperById(id);
                if (!data) {
                    setError("Paper not found");
                } else {
                    setPaper(data);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load paper");
            } finally {
                setLoading(false);
            }
        };

        loadPaper();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !paper) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                <div className="text-red-600">{error || "Paper not found"}</div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <ArticleDetailView
            article={{
                ...paper,
                id: paper.id || paper.$id || '',
                // Ensure category is a string
                category: paper.category || 'Research',
                // Map summary if description is empty, though backend should handle this
                description: paper.description || paper.text_summary || '',
                url: paper.url || '',
                title: paper.title || 'Untitled',
                image_url: paper.image_url || '/placeholder-news.svg',
                published_at: paper.published_at || new Date().toISOString(),
                source: paper.source || 'Research'
            }}
            isModal={false}
            backLink={`/pulse/research${category ? `?category=${category}` : ''}`}
            backLabel={category ? "Back to Category" : "Back to Research Papers"}
        />
    );
}
