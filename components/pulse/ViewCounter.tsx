'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { getArticleViewCount, incrementArticleView } from '@/lib/pulse/analytics';

interface ViewCounterProps {
    articleUrl: string;
    className?: string;
}

export default function ViewCounter({ articleUrl, className = '' }: ViewCounterProps) {
    const [viewCount, setViewCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initializeCounter = async () => {
            try {
                // Fetch current view count
                const count = await getArticleViewCount(articleUrl);

                if (isMounted) {
                    setViewCount(count);
                    setLoading(false);
                }

                // Increment view count (article is now visible)
                // This happens in background, user sees current count immediately
                const newCount = await incrementArticleView(articleUrl);

                // Update to new count after increment completes
                if (isMounted && newCount !== undefined) {
                    setViewCount(count + 1);
                }
            } catch (error) {
                console.error('ViewCounter error:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        initializeCounter();

        return () => {
            isMounted = false;
        };
    }, [articleUrl]);

    if (loading) {
        return (
            <div className={`flex items-center gap-1 text-xs text-gray-400 ${className}`}>
                <Eye className="w-3 h-3" />
                <span>...</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
            <Eye className="w-3 h-3" />
            <span>{viewCount.toLocaleString()}</span>
        </div>
    );
}
