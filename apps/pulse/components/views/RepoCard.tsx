"use client";

import React from "react";
import { Repo } from "@/lib/reposApi";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { Star, GitFork, Eye, Heart, ThumbsDown } from "lucide-react";
import { useEngagement } from "@/hooks/useEngagement";

export interface RepoCardProps {
    repo: Repo;
    idx?: number;
    className?: string;
    // Follow the ArticleCard design pattern
    variant?: "featured" | "list";
}

const aestheticColors = [
    "bg-sky-50 dark:bg-sky-900/20",
    "bg-purple-50 dark:bg-purple-900/20",
    "bg-amber-50 dark:bg-amber-900/20",
    "bg-emerald-50 dark:bg-emerald-900/20",
    "bg-rose-50 dark:bg-rose-900/20",
];

const CARD_BASE_CLASSES = "block bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-[10px] overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:-translate-y-1 cursor-pointer text-inherit no-underline";

function StatBadge({ icon: Icon, count }: { icon: any, count: number }) {
    return (
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#6B7280", fontSize: "13px", fontWeight: 600 }}>
            <Icon size={14} strokeWidth={2.5} className="text-slate-400" />
            {count.toLocaleString()}
        </span>
    );
}

export function RepoCard({ repo, idx = 0, className = "", variant = "list" }: RepoCardProps) {
    const isFeatured = variant === "featured";
    const containerClasses = isFeatured
        ? `${CARD_BASE_CLASSES} ${className}`
        : `${CARD_BASE_CLASSES} flex flex-col sm:flex-row h-auto sm:h-[180px] ${className}`;

    const colorClass = aestheticColors[idx % aestheticColors.length];
    
    // Engagement hook (disable auto-track on mount, track on click instead)
    const { stats, loading, like, dislike, trackView } = useEngagement(
        repo.repo_url,
        "top-git-repositories",
        repo.name,
        undefined, // image
        false, // autoTrackView = false
        repo.$id // use strict backend document ID
    );

    const handleCardClick = () => {
        trackView(); // Track view before navigating to GitHub in a new tab
    };
    
    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        like();
    };
    
    const handleDislikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dislike();
    };

    return (
        <a href={repo.repo_url} target="_blank" rel="noopener noreferrer" className={containerClasses} onClick={handleCardClick}>
            <div
                className={
                    isFeatured
                        ? `aspect-[16/10] overflow-hidden ${colorClass}`
                        : `w-full sm:w-[35%] h-[180px] sm:h-full overflow-hidden border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-slate-700/50 ${colorClass}`
                }
            >
                <ArticleImage
                    src={repo.imgSrc}
                    alt={repo.imgAlt}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
            
            <div className={isFeatured ? "p-5" : "w-full sm:w-[65%] p-5 sm:p-6 flex flex-col justify-center"}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                    <CategoryBadge tag={repo.language || "Open Source"} showDot />
                    <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>
                        {repo.owner}
                    </span>
                </div>
                
                <h3
                    style={{
                        fontSize: isFeatured ? "22px" : "18px",
                        fontWeight: 800,
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                        marginBottom: isFeatured ? "12px" : "8px",
                        color: "#111827",
                    }}
                    className="dark:text-white line-clamp-1"
                >
                    {repo.name}
                </h3>
                
                <p 
                    style={{ 
                        fontSize: "14px", 
                        color: "#4B5563", 
                        lineHeight: 1.5,
                        marginBottom: isFeatured ? "24px" : "16px",
                    }}
                    className="dark:text-slate-300 line-clamp-2"
                >
                    {repo.description || "No description provided."}
                </p>
                
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "auto", flexWrap: "wrap" }}>
                    {/* Existing static repository metrics */}
                    <StatBadge icon={Star} count={repo.stars} />
                    <StatBadge icon={GitFork} count={repo.forks} />
                    <StatBadge icon={Eye} count={repo.views} />
                    
                    {/* Interactive Engagement Metrics */}
                    <div style={{ display: "flex", gap: "16px", marginLeft: "auto" }}>
                        <button
                            onClick={handleLikeClick}
                            disabled={loading}
                            className="flex items-center gap-2 transition-colors text-gray-500 hover:text-red-500 disabled:opacity-50 group dark:text-gray-400 dark:hover:text-red-400"
                            aria-label="Like repository"
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.color = "#EF4444"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.color = "#6B7280"); }}
                        >
                            <Heart size={16} />
                            <span style={{ fontWeight: 600, fontSize: "13px" }}>
                                {loading ? "..." : (stats?.likes || 0)}
                            </span>
                        </button>

                        <button
                            onClick={handleDislikeClick}
                            disabled={loading}
                            className="flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600 disabled:opacity-50 group dark:text-gray-400 dark:hover:text-blue-400"
                            aria-label="Dislike repository"
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.color = "#2563EB"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.color = "#6B7280"); }}
                        >
                            <ThumbsDown size={16} />
                            <span style={{ fontWeight: 600, fontSize: "13px" }}>
                                {loading ? "..." : (stats?.dislikes || 0)}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </a>
    );
}

