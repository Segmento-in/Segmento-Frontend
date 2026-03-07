'use client';

import { useState, useEffect } from 'react';
import { Eye, ThumbsUp } from 'lucide-react';
import { getArticleStats, type ArticleStats } from '@/lib/analytics';

interface CardEngagementStatsProps {
    articleUrl: string;
    articleId?: string;  // NEW: Authoritative ID from backend (recommended)
    category?: string;   // NEW: For strict routing
    className?: string;
    initialStats?: ArticleStats;
}

export default function CardEngagementStats({ articleUrl, articleId, category, className = '', initialStats }: CardEngagementStatsProps) {
    const [stats, setStats] = useState<ArticleStats>(initialStats || { viewCount: 0, likeCount: 0, dislikeCount: 0 });

    useEffect(() => {
        // If we have initial stats, don't fetch immediately
        // We could optionally set up a subscription or poll later
        if (initialStats) return;

        let isMounted = true;
        const fetchStats = async () => {
            const data = await getArticleStats(articleUrl, articleId, category);
            if (isMounted) setStats(data);
        };
        fetchStats();
        return () => { isMounted = false; };
    }, [articleUrl, articleId, category, initialStats]);

    return (
        <div className={`flex items-center gap-3 text-xs text-gray-500 ${className}`}>
            <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{stats.viewCount.toLocaleString()}</span>
            </div>
            {stats.likeCount > 0 && (
                <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{stats.likeCount.toLocaleString()}</span>
                </div>
            )}
        </div>
    );
}
