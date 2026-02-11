'use client';

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import TimeDisplay from "@/components/pulse/TimeDisplay";
import CardEngagementStats from "@/components/pulse/CardEngagementStats";
import { getFreshnessTag } from "@/lib/pulse/dateUtils";
import { type Article } from "@/lib/pulse/newsApi";

interface NewsCardProps {
    article: Article;
}

import AudioPlayer from "@/components/pulse/AudioPlayer";

export default function NewsCard({ article }: NewsCardProps) {
    const freshness = getFreshnessTag(article.published_at);

    // Construct the article URL params
    const safeImage = article.image_url && article.image_url !== "None" ? article.image_url : "/placeholder-news.svg";
    const articleLink = `/pulse/news/article?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description || '')}&image=${encodeURIComponent(safeImage)}&date=${encodeURIComponent(article.published_at)}&source=${encodeURIComponent(article.source)}&id=${article.$id || ''}&category=${article.category || ''}&audio_url=${encodeURIComponent(article.audio_url || '')}&text_summary=${encodeURIComponent(article.text_summary || '')}`;

    return (
        <Link
            href={articleLink}
            className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden relative"
        >
            {/* Image Section */}
            <div className="relative h-32">
                <img
                    src={article.image_url && article.image_url !== "None" ? article.image_url : "/placeholder-news.svg"}
                    onError={(e) => { e.currentTarget.src = "/placeholder-news.svg"; }}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Freshness Tag */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm ${freshness.className}`}>
                    {freshness.text}
                </div>

                {/* External Link Icon */}
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>

                {/* Source Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                            Source: {article.source}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3">
                <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                    <div className="flex items-center gap-2">
                        <AudioPlayer
                            articleId={article.$id || article.url}
                            articleUrl={article.url}
                            initialAudioUrl={article.audio_url}
                            title={article.title}
                            image={safeImage}
                            category={article.category || ''}
                        />
                        <TimeDisplay timestamp={article.published_at} />
                    </div>
                    <CardEngagementStats
                        articleUrl={article.url}
                        articleId={article.$id}  // NEW: Use authoritative backend ID
                        initialStats={{
                            viewCount: article.views || 0,
                            likeCount: article.likes || 0,
                            dislikeCount: article.dislikes || 0
                        }}
                    />
                </div>
            </div>
        </Link>
    );
}
