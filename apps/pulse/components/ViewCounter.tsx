'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { getArticleViewCount } from '@/lib/analytics';

interface ViewCounterProps {
    articleUrl: string;
    articleId?: string;  // NEW: Authoritative ID from backend (recommended)
    className?: string;
}

export default function ViewCounter({ articleUrl, articleId, className = '' }: ViewCounterProps) {
    const [viewCount, setViewCount] = useState<number>(0);
    // Remove loading state for cleaner UI in lists (optional, or keep it)

    useEffect(() => {
        let isMounted = true;
        const fetchCount = async () => {
            const count = await getArticleViewCount(articleUrl, articleId);
            if (isMounted) setViewCount(count);
        };
        fetchCount();
        return () => { isMounted = false; };
    }, [articleUrl, articleId]);

    return (
        <div className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
            <Eye className="w-3 h-3" />
            <span>{viewCount.toLocaleString()}</span>
        </div>
    );
}
