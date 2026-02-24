module.exports = [
"[project]/apps/pulse/lib/newsApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchNewsByCategory",
    ()=>fetchNewsByCategory,
    "fetchResearchPaperById",
    ()=>fetchResearchPaperById,
    "searchNews",
    ()=>searchNews
]);
// News API for Pulse
// All requests use relative paths (/api/*) which are proxied server-side
// by apps/pulse/app/api/[...path]/route.ts to avoid CORS issues.
// The proxy forwards requests to NEXT_PUBLIC_PULSE_API_URL (default: localhost:8000).
function getApiBase() {
    // Both client and server can use the direct endpoint based on the robust .env config
    return ("TURBOPACK compile-time value", "https://workwithshafisk-segmentopulse-backend.hf.space") || 'http://localhost:8000';
}
async function fetchNewsByCategory(category, page = 1, limit = 20) {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/api/news/${category}?page=${page}&limit=${limit}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error('Failed to fetch news:', response.statusText);
            return [];
        }
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}
async function searchNews(query) {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error('Failed to search news:', response.statusText);
            return [];
        }
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
}
async function fetchResearchPaperById(paperId) {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/api/research/${paperId}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            if (response.status === 404) return null;
            console.error('Failed to fetch research paper:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data.paper;
    } catch (error) {
        console.error("Error fetching research paper:", error);
        return null;
    }
}
}),
"[project]/apps/pulse/components/TimeDisplay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TimeDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
;
;
function TimeDisplay({ timestamp, className = "" }) {
    let formattedTime = "Invalid Date";
    try {
        if (!timestamp) throw new Error("No timestamp");
        formattedTime = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(new Date(timestamp));
    } catch (e) {
        console.error("Invalid time value:", timestamp);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-2 text-sm text-gray-500 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/apps/pulse/components/TimeDisplay.tsx",
                lineNumber: 27,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    formattedTime,
                    " IST"
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/TimeDisplay.tsx",
                lineNumber: 28,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/components/TimeDisplay.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, this);
}
}),
"[project]/packages/shared/src/idGenerator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Article ID Generator - SHA-256 Based
 * ====================================
 * 
 * Generates Appwrite-compatible article IDs (32 characters) from URLs.
 * Uses SHA-256 hash for deterministic, collision-resistant IDs.
 */ /**
 * Generate article ID from URL using SHA-256 hash.
 * Returns 32-character alphanumeric ID compatible with Appwrite.
 * 
 * @param url - Article URL
 * @returns Promise<string> - 32-character article ID
 * 
 * @example
 * const id = await generateArticleId("https://example.com/article");
 * console.log(id); // "a1b2c3d4e5f6..." (32 chars)
 */ __turbopack_context__.s([
    "generateArticleId",
    ()=>generateArticleId,
    "generateArticleIds",
    ()=>generateArticleIds,
    "isValidArticleId",
    ()=>isValidArticleId
]);
async function generateArticleId(url) {
    // Use Web Crypto API (available in browsers and Node.js 15+)
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // Convert to hex string (64 characters)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b)=>b.toString(16).padStart(2, '0')).join('');
    // Take first 32 characters (sufficient uniqueness)
    return hashHex.substring(0, 32);
}
async function generateArticleIds(urls) {
    const idMap = new Map();
    await Promise.all(urls.map(async (url)=>{
        const id = await generateArticleId(url);
        idMap.set(url, id);
    }));
    return idMap;
}
function isValidArticleId(id) {
    // Valid Appwrite ID: 32 alphanumeric characters
    return /^[a-f0-9]{32}$/.test(id);
}
}),
"[project]/apps/pulse/lib/analytics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addComment",
    ()=>addComment,
    "getArticleStats",
    ()=>getArticleStats,
    "getArticleViewCount",
    ()=>getArticleViewCount,
    "getTrendingArticles",
    ()=>getTrendingArticles,
    "incrementArticleView",
    ()=>incrementArticleView,
    "subscribeToArticleStats",
    ()=>subscribeToArticleStats,
    "subscribeToComments",
    ()=>subscribeToComments,
    "toggleDislike",
    ()=>toggleDislike,
    "toggleLike",
    ()=>toggleLike
]);
/**
 * Engagement Analytics - Now powered by Appwrite
 * Phase 3: Migrated from Firebase to Appwrite backend
 * Performance optimized: Reduced polling frequency for better backend responsiveness
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/idGenerator.ts [app-ssr] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://workwithshafisk-segmentopulse-backend.hf.space") || 'https://workwithshafisk-segmentopulse-backend.hf.space';
// Simple cache to reduce redundant API calls
const statsCache = new Map();
const CACHE_TTL = 60000; // 60 seconds cache (increased from 5s for better performance)
// Fetch with timeout to prevent hanging
// Fetch with timeout to prevent hanging
async function fetchWithTimeout(url, timeout = 15000) {
    const controller = new AbortController();
    const id = setTimeout(()=>controller.abort(new Error('Request timed out')), timeout);
    try {
        const response = await fetch(url, {
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}
async function getArticleStats(articleUrl, articleId, category) {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateArticleId"])(articleUrl);
        // Check cache first
        const cached = statsCache.get(id);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }
        const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
        const response = await fetchWithTimeout(`${API_BASE_URL}/api/engagement/articles/${id}/stats${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        const stats = {
            viewCount: data.views || 0,
            likeCount: data.likes || 0,
            dislikeCount: data.dislikes || 0
        };
        // Cache the result
        statsCache.set(id, {
            data: stats,
            timestamp: Date.now()
        });
        return stats;
    } catch (error) {
        if (error.name === 'AbortError' || error.message.includes('timed out')) {
            console.warn(`Stats fetch timed out for ${articleUrl.slice(-20)}`);
        } else {
            console.error('Failed to get article stats:', error);
        }
        // Return zeros instead of failing, but log the error
        return {
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0
        };
    }
}
async function incrementArticleView(articleUrl, title, image, category, articleId) {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateArticleId"])(articleUrl);
        const response = await fetch(`${API_BASE_URL}/api/engagement/articles/${id}/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: articleUrl,
                title: title || "Unknown Article",
                image: image || "",
                category: category || "wildcard"
            }),
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) {
            throw new Error('Failed to increment view');
        }
        const data = await response.json();
        // Invalidate cache for this article
        statsCache.delete(id);
        return data.views || 1;
    } catch (error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            console.debug('View tracking timed out (non-critical)');
        } else {
            console.error('Failed to increment view count:', error);
        }
        return 0;
    }
}
async function toggleLike(articleUrl, incrementVal, articleId) {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateArticleId"])(articleUrl);
        // For now, only increment (no decrement support yet)
        if (incrementVal) {
            const response = await fetch(`${API_BASE_URL}/api/engagement/articles/${id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: articleUrl
                }),
                signal: AbortSignal.timeout(8000)
            });
            if (!response.ok) {
                throw new Error('Failed to like article');
            }
            // Invalidate cache for this article
            statsCache.delete(id);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Failed to toggle like:', error);
        }
    }
}
async function toggleDislike(articleUrl, incrementVal, articleId) {
    try {
        // Use provided ID or generate from URL
        const id = articleId || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateArticleId"])(articleUrl);
        // For now, only increment (no decrement support yet)
        if (incrementVal) {
            const response = await fetch(`${API_BASE_URL}/api/engagement/articles/${id}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: articleUrl
                }),
                signal: AbortSignal.timeout(8000)
            });
            if (!response.ok) {
                throw new Error('Failed to dislike article');
            }
            // Invalidate cache for this article
            statsCache.delete(id);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Failed to toggle dislike:', error);
        }
    }
}
function subscribeToArticleStats(articleUrl, callback) {
    let intervalId = null;
    let isSubscribed = true;
    // Poll every 30 seconds (reduced from 5s for better performance)
    const poll = async ()=>{
        if (!isSubscribed) return;
        const stats = await getArticleStats(articleUrl);
        if (isSubscribed) callback(stats);
    };
    // Initial fetch
    poll();
    // Set up polling - Reduced frequency to prevent backend overload
    intervalId = setInterval(poll, 30000);
    // Return unsubscribe function
    return ()=>{
        isSubscribed = false;
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
}
async function getArticleViewCount(articleUrl, articleId) {
    const stats = await getArticleStats(articleUrl, articleId);
    return stats.viewCount;
}
async function getTrendingArticles(hours = 24, limit = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/engagement/articles/trending?hours=${hours}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch trending articles');
        }
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Failed to get trending articles:', error);
        return [];
    }
}
async function addComment(articleUrl, text, userName = 'Anonymous') {
    console.warn('Comments feature not yet implemented in Appwrite backend');
// TODO: Implement when backend supports comments
}
function subscribeToComments(articleUrl, callback) {
    console.warn('Comments feature not yet implemented in Appwrite backend');
    // TODO: Implement when backend supports comments
    return ()=>{};
}
}),
"[project]/apps/pulse/components/CardEngagementStats.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CardEngagementStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thumbs-up.js [app-ssr] (ecmascript) <export default as ThumbsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/lib/analytics.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function CardEngagementStats({ articleUrl, articleId, category, className = '', initialStats }) {
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialStats || {
        viewCount: 0,
        likeCount: 0,
        dislikeCount: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // If we have initial stats, don't fetch immediately
        // We could optionally set up a subscription or poll later
        if (initialStats) return;
        let isMounted = true;
        const fetchStats = async ()=>{
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getArticleStats"])(articleUrl, articleId, category);
            if (isMounted) setStats(data);
        };
        fetchStats();
        return ()=>{
            isMounted = false;
        };
    }, [
        articleUrl,
        articleId,
        category,
        initialStats
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-3 text-xs text-gray-500 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                        className: "w-3 h-3"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/CardEngagementStats.tsx",
                        lineNumber: 35,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: stats.viewCount.toLocaleString()
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/CardEngagementStats.tsx",
                        lineNumber: 36,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/CardEngagementStats.tsx",
                lineNumber: 34,
                columnNumber: 13
            }, this),
            stats.likeCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__["ThumbsUp"], {
                        className: "w-3 h-3"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/CardEngagementStats.tsx",
                        lineNumber: 40,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: stats.likeCount.toLocaleString()
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/CardEngagementStats.tsx",
                        lineNumber: 41,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/CardEngagementStats.tsx",
                lineNumber: 39,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/components/CardEngagementStats.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/pulse/lib/dateUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFreshnessTag",
    ()=>getFreshnessTag
]);
function getFreshnessTag(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    // Reset times to compare dates only
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = n.getTime() - d.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days
    if (diffDays <= 0) {
        return {
            text: "Today's News",
            className: "bg-green-100 text-green-800 border-green-200"
        };
    } else if (diffDays === 1) {
        return {
            text: "Yesterday's News",
            className: "bg-orange-100 text-orange-800 border-orange-200"
        };
    } else {
        return {
            text: "Previous News",
            className: "bg-amber-100 text-amber-800 border-amber-200"
        };
    }
}
}),
"[project]/apps/pulse/components/AudioPlayer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AudioPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/headphones.js [app-ssr] (ecmascript) <export default as Headphones>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.js [app-ssr] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function AudioPlayer({ articleId, articleUrl, initialAudioUrl, title, image, category, className }) {
    const [audioUrl, setAudioUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialAudioUrl || null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fileUrl, setFileUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(''); // For view url param
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialize audio element
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!audioRef.current) {
            audioRef.current = new Audio();
            // Handle playback ended
            audioRef.current.onended = ()=>{
                setIsPlaying(false);
            };
            // Handle errors
            audioRef.current.onerror = ()=>{
                console.error("Audio playback error");
                setIsPlaying(false);
                setIsLoading(false);
            };
        }
        return ()=>{
            // Cleanup
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);
    const togglePlay = async (e)=>{
        e.preventDefault(); // Prevent navigating if inside a Link
        e.stopPropagation();
        if (isLoading) return;
        // If playing, pause
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }
        // If audio user/url exists but stopped, play
        if (audioUrl && audioRef.current) {
            if (audioRef.current.src !== audioUrl) {
                audioRef.current.src = audioUrl;
            }
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Play failed", err);
            }
            return;
        }
        // Need to generate audio
        setIsLoading(true);
        try {
            const API_BASE = ("TURBOPACK compile-time value", "https://workwithshafisk-segmentopulse-backend.hf.space") || 'http://localhost:8000';
            const response = await fetch(`${API_BASE}/api/audio/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    article_url: articleUrl,
                    title: title,
                    image_url: image,
                    category: category
                })
            });
            const data = await response.json();
            if (data.success && data.audio_url) {
                setAudioUrl(data.audio_url);
                if (audioRef.current) {
                    audioRef.current.src = data.audio_url;
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } else {
                // Handle both FastAPI error format (detail) and custom format (message)
                const errorMsg = data.message || data.detail || "Unknown error occurred";
                console.error("Audio generation failed", errorMsg);
            }
        } catch (error) {
            console.error("Audio fetch error", error);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: togglePlay,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500", isPlaying && "bg-purple-100 text-purple-600 ring-2 ring-purple-500 ring-opacity-50", className),
        title: isPlaying ? "Pause Summary" : "Play Audio Summary",
        "aria-label": isPlaying ? "Pause Audio Summary" : "Play Audio Summary",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            mode: "wait",
            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.8
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: 0.8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-4 h-4 animate-spin text-purple-600"
                }, void 0, false, {
                    fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                    lineNumber: 136,
                    columnNumber: 25
                }, this)
            }, "loading", false, {
                fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                lineNumber: 130,
                columnNumber: 21
            }, this) : isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.8
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: 0.8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                        className: "w-4 h-4 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                        lineNumber: 145,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-20 animate-ping inset-0"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                        lineNumber: 147,
                        columnNumber: 25
                    }, this)
                ]
            }, "pause", true, {
                fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                lineNumber: 139,
                columnNumber: 21
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.8
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: 0.8
                },
                children: audioUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                    className: "w-4 h-4 ml-0.5"
                }, void 0, false, {
                    fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                    lineNumber: 157,
                    columnNumber: 37
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                    lineNumber: 157,
                    columnNumber: 75
                }, this)
            }, "play", false, {
                fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
                lineNumber: 150,
                columnNumber: 21
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
            lineNumber: 128,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/pulse/components/AudioPlayer.tsx",
        lineNumber: 118,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/pulse/hooks/useEngagement.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBatchEngagement",
    ()=>useBatchEngagement,
    "useEngagement",
    ()=>useEngagement
]);
/**
 * Engagement Hook - Article Interactions
 * =======================================
 * 
 * React hook for managing article engagement (likes, dislikes, views).
 * Automatically generates SHA-256 IDs from article URLs.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/idGenerator.ts [app-ssr] (ecmascript)");
;
;
function useEngagement(articleUrl, category, title, image, autoTrackView = true, initialArticleId) {
    // ... (state) ...
    const [articleId, setArticleId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialArticleId || '');
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // ... (useEffect for ID generation) ...
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialArticleId) {
            setArticleId(initialArticleId);
            return;
        }
        if (articleUrl) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateArticleId"])(articleUrl).then(setArticleId).catch((err)=>{
                console.error('Failed to generate article ID:', err);
                setError('Failed to generate article ID');
            });
        }
    }, [
        articleUrl
    ]);
    // Base API URL
    const API_BASE = ("TURBOPACK compile-time value", "https://workwithshafisk-segmentopulse-backend.hf.space") || 'http://localhost:8000';
    // Helper to get request body
    const getRequestBody = ()=>({
            url: articleUrl,
            title: title || "Unknown Article",
            image: image || "",
            category: category || "wildcard"
        });
    // Fetch engagement stats (GET request, no body needed)
    const fetchStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!articleId) return;
        setLoading(true);
        setError(null);
        try {
            // Append category to help backend route to correct collection
            const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
            const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/stats${queryParams}`);
            if (!response.ok) {
                // If 404, it just means no stats yet, return 0s
                if (response.status === 404) {
                    setStats({
                        article_id: articleId,
                        likes: 0,
                        dislikes: 0,
                        views: 0,
                        success: true
                    });
                    return;
                }
                throw new Error(`Failed to fetch stats: ${response.statusText}`);
            }
            const data = await response.json();
            setStats(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to fetch engagement stats:', errorMessage);
            setError(errorMessage);
            // Non-blocking error for stats
            setStats({
                article_id: articleId,
                likes: 0,
                dislikes: 0,
                views: 0,
                success: false
            });
        } finally{
            setLoading(false);
        }
    }, [
        articleId,
        API_BASE
    ]);
    // Like article
    const like = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!articleId) return;
        try {
            const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getRequestBody())
            });
            if (!response.ok) throw new Error('Failed to like article');
            const data = await response.json();
            setStats((prev)=>prev ? {
                    ...prev,
                    likes: data.likes
                } : null);
        } catch (err) {
            console.error('Failed to like article:', err);
            setError('Failed to like article');
        }
    }, [
        articleId,
        API_BASE,
        articleUrl,
        title,
        image,
        category
    ]);
    // Dislike article
    const dislike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!articleId) return;
        try {
            const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getRequestBody())
            });
            if (!response.ok) throw new Error('Failed to dislike article');
            const data = await response.json();
            setStats((prev)=>prev ? {
                    ...prev,
                    dislikes: data.dislikes
                } : null);
        } catch (err) {
            console.error('Failed to dislike article:', err);
            setError('Failed to dislike article');
        }
    }, [
        articleId,
        API_BASE,
        articleUrl,
        title,
        image,
        category
    ]);
    // Track view
    const trackView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!articleId) return;
        try {
            await fetch(`${API_BASE}/api/engagement/articles/${articleId}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getRequestBody())
            });
            await fetchStats();
        } catch (err) {
            console.debug('Failed to track view:', err);
        }
    }, [
        articleId,
        API_BASE,
        fetchStats,
        articleUrl,
        title,
        image,
        category
    ]);
    // Auto-fetch stats when article ID is ready
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (articleId) {
            fetchStats();
        }
    }, [
        articleId,
        fetchStats
    ]);
    // Auto-track view on mount
    // Auto-track view on mount (deduplicated)
    const viewTrackedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Reset tracker if articleId changes
        viewTrackedRef.current = false;
    }, [
        articleId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (articleId && autoTrackView && !viewTrackedRef.current) {
            // Track view after a small delay to avoid tracking bots
            const timer = setTimeout(()=>{
                if (!viewTrackedRef.current) {
                    trackView();
                    viewTrackedRef.current = true;
                }
            }, 1000);
            return ()=>clearTimeout(timer);
        }
    }, [
        articleId,
        autoTrackView,
        trackView
    ]);
    return {
        stats,
        loading,
        error,
        like,
        dislike,
        trackView,
        refetch: fetchStats
    };
}
function useBatchEngagement(articleUrls) {
    const [statsMap, setStatsMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!articleUrls.length) return;
        const fetchBatchStats = async ()=>{
            setLoading(true);
            const newStatsMap = new Map();
            const API_BASE = ("TURBOPACK compile-time value", "https://workwithshafisk-segmentopulse-backend.hf.space") || 'http://localhost:8000';
            await Promise.all(articleUrls.map(async (url)=>{
                try {
                    const articleId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$idGenerator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateArticleId"])(url);
                    const response = await fetch(`${API_BASE}/api/engagement/articles/${articleId}/stats`);
                    if (response.ok) {
                        const data = await response.json();
                        newStatsMap.set(url, data);
                    }
                } catch (err) {
                    console.debug(`Failed to fetch stats for ${url}:`, err);
                }
            }));
            setStatsMap(newStatsMap);
            setLoading(false);
        };
        fetchBatchStats();
    }, [
        articleUrls
    ]);
    return {
        statsMap,
        loading
    };
}
}),
"[project]/apps/pulse/components/ArticleInteraction.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ArticleInteraction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thumbs-down.js [app-ssr] (ecmascript) <export default as ThumbsDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$hooks$2f$useEngagement$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/hooks/useEngagement.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function ArticleInteraction({ articleUrl, articleTitle, category, articleId, onCommentClick, autoTrackView = true }) {
    // Pass category, title, and image to hook to ensure backend can create article if missing
    // Pass articleId to bypass local generation if available
    const { stats, loading, like, dislike, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$hooks$2f$useEngagement$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEngagement"])(articleUrl, category, articleTitle, undefined, autoTrackView, articleId);
    // Share functionality
    const handleShare = async ()=>{
        if (navigator.share) {
            try {
                await navigator.share({
                    title: articleTitle || "Check out this article",
                    url: articleUrl
                });
            } catch (err) {
                console.debug("Share cancelled:", err);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(articleUrl);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-6 py-4 border-y border-gray-100 my-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: like,
                disabled: loading,
                className: "flex items-center gap-2 transition-colors text-gray-500 hover:text-red-500 disabled:opacity-50 group",
                "aria-label": "Like article",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                        className: "w-5 h-5 group-hover:scale-110 transition-transform"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-sm",
                        children: loading ? "..." : stats?.likes || 0
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 61,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                lineNumber: 52,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: dislike,
                disabled: loading,
                className: "flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600 disabled:opacity-50 group",
                "aria-label": "Dislike article",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsDown$3e$__["ThumbsDown"], {
                        className: "w-5 h-5 group-hover:scale-110 transition-transform"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-sm",
                        children: loading ? "..." : stats?.dislikes || 0
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 74,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                lineNumber: 67,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                        className: "w-5 h-5"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 81,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-sm",
                        children: loading ? "..." : stats?.views || 0
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 82,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                lineNumber: 80,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleShare,
                className: "flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group ml-auto",
                "aria-label": "Share article",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                        className: "w-5 h-5 group-hover:scale-110 transition-transform"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 93,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-sm",
                        children: "Share"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                        lineNumber: 94,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                lineNumber: 88,
                columnNumber: 13
            }, this),
            error && ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-red-500 ml-2",
                children: [
                    "⚠️ ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
                lineNumber: 99,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/components/ArticleInteraction.tsx",
        lineNumber: 50,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/pulse/components/CommentSection.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommentSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/lib/analytics.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function CommentSection({ articleUrl }) {
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeToComments"])(articleUrl, (updatedComments)=>{
            setComments(updatedComments);
        });
        return ()=>unsubscribe();
    }, [
        articleUrl
    ]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addComment"])(articleUrl, newComment.trim());
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment', error);
        } finally{
            setIsSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-8 bg-gray-50 rounded-xl p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-bold mb-6",
                children: [
                    "Discussion (",
                    comments.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "mb-8 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: newComment,
                        onChange: (e)=>setNewComment(e.target.value),
                        placeholder: "Share your thoughts...",
                        className: "w-full p-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none bg-white min-h-25"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: !newComment.trim() || isSubmitting,
                        className: "absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                            lineNumber: 55,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                        lineNumber: 50,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                lineNumber: 43,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: comments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-gray-500 py-4",
                    children: "Be the first to comment!"
                }, void 0, false, {
                    fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                    lineNumber: 62,
                    columnNumber: 21
                }, this) : comments.map((comment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0",
                                children: comment.userName.charAt(0)
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                                lineNumber: 66,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-sm",
                                                children: comment.userName
                                            }, void 0, false, {
                                                fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                                                lineNumber: 71,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-400",
                                                children: new Date(comment.createdAt).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                                                lineNumber: 72,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                                        lineNumber: 70,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-700 text-sm whitespace-pre-wrap",
                                        children: comment.text
                                    }, void 0, false, {
                                        fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                                        lineNumber: 76,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                                lineNumber: 69,
                                columnNumber: 29
                            }, this)
                        ]
                    }, comment.id, true, {
                        fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                        lineNumber: 65,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/pulse/components/CommentSection.tsx",
                lineNumber: 60,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/components/CommentSection.tsx",
        lineNumber: 39,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/pulse/components/ViewCounter.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewCounter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/lib/analytics.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ViewCounter({ articleUrl, articleId, className = '' }) {
    const [viewCount, setViewCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // Remove loading state for cleaner UI in lists (optional, or keep it)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        const fetchCount = async ()=>{
            const count = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getArticleViewCount"])(articleUrl, articleId);
            if (isMounted) setViewCount(count);
        };
        fetchCount();
        return ()=>{
            isMounted = false;
        };
    }, [
        articleUrl,
        articleId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-1 text-xs text-gray-500 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                className: "w-3 h-3"
            }, void 0, false, {
                fileName: "[project]/apps/pulse/components/ViewCounter.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: viewCount.toLocaleString()
            }, void 0, false, {
                fileName: "[project]/apps/pulse/components/ViewCounter.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/components/ViewCounter.tsx",
        lineNumber: 28,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/pulse/components/AudioSummaryButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AudioSummaryButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/headphones.js [app-ssr] (ecmascript) <export default as Headphones>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-ssr] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.js [app-ssr] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const CATCHY_MESSAGES = [
    "🎧 Too lazy to read? We got you!",
    "👂 Your ears will thank you",
    "🎶 Turn words into vibes",
    "⚡ 5 min summary, 0 effort",
    "🔥 Listen while you scroll",
    "✨ Audio magic incoming",
    "🚀 From article to audio in seconds",
    "💫 Multitask like a boss"
];
const MUSIC_EMOJIS = [
    "🎵",
    "🎶",
    "🎼",
    "♪",
    "♫",
    "🎧"
];
function AudioSummaryButton({ articleId, articleUrl, initialAudioUrl, initialTextSummary, title, image, category, className }) {
    const [audioUrl, setAudioUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialAudioUrl || null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messageIndex, setMessageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isFading, setIsFading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [floatingNotes, setFloatingNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showPulseRing, setShowPulseRing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const noteIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const spawnInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // If it's a research paper (category starts with 'research-'), disable and show "Coming Soon"
    const isResearch = category?.toLowerCase().startsWith('research') || false;
    // Initialize audio element
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.onended = ()=>setIsPlaying(false);
            audioRef.current.onerror = ()=>{
                console.error("Audio playback error");
                setIsPlaying(false);
                setIsLoading(false);
            };
        }
        return ()=>{
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);
    // Rotate messages every 3.5 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const messageTimer = setInterval(()=>{
            setIsFading(true);
            setTimeout(()=>{
                setMessageIndex((prev)=>(prev + 1) % CATCHY_MESSAGES.length);
                setIsFading(false);
            }, 400); // Fade duration
        }, 3500);
        return ()=>clearInterval(messageTimer);
    }, []);
    // Spawn floating notes continuously
    const spawnNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const note = {
            id: noteIdCounter.current++,
            emoji: MUSIC_EMOJIS[Math.floor(Math.random() * MUSIC_EMOJIS.length)],
            x: Math.random() * 100 - 50,
            y: Math.random() * 80 + 40,
            rotate: Math.random() * 360
        };
        setFloatingNotes((prev)=>[
                ...prev,
                note
            ]);
        // Auto-cleanup after 2 seconds
        setTimeout(()=>{
            setFloatingNotes((prev)=>prev.filter((n)=>n.id !== note.id));
        }, 2000);
    }, []);
    // Continuous note spawning based on state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let interval = 700; // Default
        if (isLoading) interval = 150;
        else if (isHovered) interval = 300;
        if (spawnInterval.current) clearInterval(spawnInterval.current);
        spawnInterval.current = setInterval(spawnNote, interval);
        return ()=>{
            if (spawnInterval.current) clearInterval(spawnInterval.current);
        };
    }, [
        isLoading,
        isHovered,
        spawnNote
    ]);
    // Cleanup old notes (safety check)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const cleanup = setInterval(()=>{
            setFloatingNotes((prev)=>prev.slice(-14)); // Keep max 14
        }, 1000);
        return ()=>clearInterval(cleanup);
    }, []);
    const burstNotes = ()=>{
        const angles = [
            0,
            45,
            90,
            135,
            180,
            225,
            270,
            315
        ];
        const distance = 80;
        angles.forEach((angle)=>{
            const rad = angle * Math.PI / 180;
            const note = {
                id: noteIdCounter.current++,
                emoji: MUSIC_EMOJIS[Math.floor(Math.random() * MUSIC_EMOJIS.length)],
                x: Math.cos(rad) * distance,
                y: Math.sin(rad) * distance,
                rotate: angle
            };
            setFloatingNotes((prev)=>[
                    ...prev,
                    note
                ]);
            setTimeout(()=>{
                setFloatingNotes((prev)=>prev.filter((n)=>n.id !== note.id));
            }, 2000);
        });
    };
    const [textSummary, setTextSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialAudioUrl && initialTextSummary ? initialTextSummary : null);
    // If initialAudioUrl is present, set textSummary if provided
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialAudioUrl && initialTextSummary) {
            setTextSummary(initialTextSummary);
        }
    }, [
        initialAudioUrl,
        initialTextSummary
    ]);
    // Check status on mount if data is missing (Automatic Retrieval)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!initialAudioUrl && !initialTextSummary) {
            const checkStatus = async ()=>{
                try {
                    const encodedUrl = encodeURIComponent(articleUrl);
                    const encodedCategory = category ? encodeURIComponent(category) : '';
                    const API_BASE = ("TURBOPACK compile-time value", "https://workwithshafisk-segmentopulse-backend.hf.space") || 'http://localhost:8000';
                    const res = await fetch(`${API_BASE}/api/audio/status?article_url=${encodedUrl}&category=${encodedCategory}`);
                    const data = await res.json();
                    if (data.success) {
                        if (data.audio_url) setAudioUrl(data.audio_url);
                        if (data.text_summary) setTextSummary(data.text_summary);
                    }
                } catch (err) {
                    console.error("Failed to check audio status", err);
                }
            };
            checkStatus();
        }
    }, [
        articleUrl,
        category,
        initialAudioUrl,
        initialTextSummary
    ]);
    const handleClick = async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (isResearch) {
            return;
        }
        if (isLoading) return;
        // Show pulse ring
        setShowPulseRing(true);
        setTimeout(()=>setShowPulseRing(false), 1000);
        // Burst notes
        burstNotes();
        // If playing, pause
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }
        // If audio exists but stopped, play
        if (audioUrl && audioRef.current) {
            if (audioRef.current.src !== audioUrl) {
                audioRef.current.src = audioUrl;
            }
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Play failed", err);
            }
            return;
        }
        // Generate audio
        setIsLoading(true);
        try {
            const API_BASE = ("TURBOPACK compile-time value", "https://workwithshafisk-segmentopulse-backend.hf.space") || 'http://localhost:8000';
            const response = await fetch(`${API_BASE}/api/audio/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    article_url: articleUrl,
                    title: title,
                    image_url: image,
                    category: category
                })
            });
            const data = await response.json();
            if (data.success && data.audio_url) {
                setAudioUrl(data.audio_url);
                if (data.text_summary) setTextSummary(data.text_summary);
                if (audioRef.current) {
                    audioRef.current.src = data.audio_url;
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } else {
                const errorMsg = data.message || data.detail || "Unknown error occurred";
                console.error("Audio generation failed", errorMsg);
            }
        } catch (error) {
            console.error("Audio fetch error", error);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-2 py-6", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -top-14 -right-12 hidden md:block z-20",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-4 py-2 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm transition-all duration-400", isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium text-gray-700 whitespace-nowrap",
                                    children: CATCHY_MESSAGES[messageIndex]
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                    lineNumber: 282,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                lineNumber: 276,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-4 -bottom-1.5 w-3 h-3 bg-gradient-to-br from-pink-50 to-purple-50 border-b border-r border-purple-200 rotate-45 transform"
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                lineNumber: 287,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 275,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 rounded-2xl blur-xl animate-glow-pulse pointer-events-none",
                        style: {
                            background: 'var(--gradient-audio)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 291,
                        columnNumber: 17
                    }, this),
                    showPulseRing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 rounded-2xl animate-pulse-ring pointer-events-none",
                        style: {
                            background: 'var(--gradient-audio)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 296,
                        columnNumber: 21
                    }, this),
                    floatingNotes.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-4xl animate-float-note",
                            style: {
                                '--float-x': `${note.x}px`,
                                '--float-y': `${note.y}px`,
                                '--float-rotate': `${note.rotate}deg`,
                                zIndex: 10
                            },
                            children: note.emoji
                        }, note.id, false, {
                            fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                            lineNumber: 302,
                            columnNumber: 21
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleClick,
                        onMouseEnter: ()=>setIsHovered(true),
                        onMouseLeave: ()=>setIsHovered(false),
                        disabled: isResearch,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative px-7 py-3.5 rounded-2xl font-semibold text-gray-800 border border-purple-200/50", "transition-all duration-300 ease-out", "hover:scale-105 hover:-translate-y-0.5", "active:scale-100 active:translate-y-0", "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2", "animate-button-breathe flex items-center gap-3", isResearch ? "opacity-70 cursor-not-allowed" : ""),
                        style: {
                            background: 'var(--gradient-audio)'
                        },
                        "aria-label": "Play Audio Summary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(isLoading ? "animate-spin" : "animate-gentle-bob"),
                                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                    lineNumber: 337,
                                    columnNumber: 29
                                }, this) : isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                    lineNumber: 339,
                                    columnNumber: 29
                                }, this) : audioUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                    lineNumber: 341,
                                    columnNumber: 29
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                    lineNumber: 343,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                lineNumber: 335,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isLoading ? "Generating..." : isPlaying ? "Pause" : audioUrl ? "Resume" : "Audio Summary"
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                lineNumber: 348,
                                columnNumber: 21
                            }, this),
                            !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-0.5 h-4",
                                children: [
                                    0,
                                    1,
                                    2,
                                    3
                                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[3px] rounded-full bg-purple-500 animate-eq-bar",
                                        style: {
                                            animationDelay: `${i * 0.15}s`
                                        }
                                    }, i, false, {
                                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                        lineNumber: 359,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                lineNumber: 357,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 317,
                        columnNumber: 17
                    }, this),
                    isResearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50",
                        children: "Coming Soon"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 371,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                lineNumber: 273,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500 mt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                        className: "w-3.5 h-3.5 animate-gentle-bob"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 379,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Tap to listen 150 words summary"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 380,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                lineNumber: 378,
                columnNumber: 13
            }, this),
            textSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md mt-4 p-5 rounded-xl bg-purple-50/60 border border-purple-100/50 backdrop-blur-sm text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold text-purple-900 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base",
                                children: "📝"
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                                lineNumber: 387,
                                columnNumber: 25
                            }, this),
                            "Quick Summary"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 386,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "whitespace-pre-wrap",
                        children: textSummary
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                        lineNumber: 390,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
                lineNumber: 385,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/components/AudioSummaryButton.tsx",
        lineNumber: 271,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/pulse/components/ArticleDetailView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ArticleDetailView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$TimeDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/TimeDisplay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$ArticleInteraction$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/ArticleInteraction.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$CommentSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/CommentSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$ViewCounter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/ViewCounter.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/lib/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$AudioSummaryButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/AudioSummaryButton.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
function ArticleDetailView({ article, isModal = false, onClose, ...props }) {
    const hasIncrementedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Only track view if NOT in modal mode and haven't tracked yet
        if (!isModal && article.url && !hasIncrementedRef.current) {
            hasIncrementedRef.current = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["incrementArticleView"])(article.url, article.title, article.image_url, article.category, article.id);
        }
    }, [
        article,
        isModal
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `container mx-auto px-3 xs:px-4 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl ${isModal ? 'bg-white rounded-2xl' : ''}`,
        children: [
            !isModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: props.backLink || "/news",
                className: "inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                        lineNumber: 58,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: props.backLabel || "Back to News"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                        lineNumber: 59,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                lineNumber: 54,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                className: `bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${isModal ? 'shadow-none border-none' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative h-[250px] xs:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: article.image_url,
                                alt: article.title,
                                className: "w-full h-full object-cover",
                                onError: (e)=>{
                                    e.currentTarget.src = "/pulse/placeholder-news.svg";
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                lineNumber: 66,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 text-white/90 mb-3 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white",
                                                children: article.source
                                            }, void 0, false, {
                                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                lineNumber: 74,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$TimeDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                timestamp: article.published_at,
                                                className: "text-white/90"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                lineNumber: 77,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1 h-1 rounded-full bg-white/60"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$ViewCounter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        articleUrl: article.url,
                                                        articleId: article.id,
                                                        className: "text-white/90"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                lineNumber: 78,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                        lineNumber: 73,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight",
                                        children: article.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                        lineNumber: 87,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                lineNumber: 72,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                        lineNumber: 65,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8",
                                children: article.description
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                lineNumber: 94,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col xs:flex-row justify-center mb-6 sm:mb-8 items-center gap-3 sm:gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: article.url,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "w-full xs:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/20 inline-flex items-center justify-center gap-2 transform hover:-translate-y-1 min-h-touch",
                                        onClick: (e)=>{
                                        // If in modal, maybe we want to close it when they go to source?
                                        // For now, let's keep it open or let default behavior happen
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: "Read Full Article at Source"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                lineNumber: 109,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline sm:hidden",
                                                children: "Read Article"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                lineNumber: 110,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                                lineNumber: 111,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                        lineNumber: 99,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$AudioSummaryButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        articleId: article.id || article.url,
                                        articleUrl: article.url,
                                        initialAudioUrl: article.audio_url,
                                        initialTextSummary: article.text_summary,
                                        title: article.title,
                                        image: article.image_url,
                                        category: article.category
                                    }, void 0, false, {
                                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                        lineNumber: 115,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$ArticleInteraction$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                articleUrl: article.url,
                                articleTitle: article.title,
                                category: article.category,
                                articleId: article.id,
                                autoTrackView: false
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                lineNumber: 126,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$CommentSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                articleUrl: article.url
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                                lineNumber: 138,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                        lineNumber: 93,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
                lineNumber: 64,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/components/ArticleDetailView.tsx",
        lineNumber: 51,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/pulse/components/NewsCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$TimeDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/TimeDisplay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$CardEngagementStats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/CardEngagementStats.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/lib/dateUtils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$AudioPlayer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/AudioPlayer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$ArticleDetailView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/ArticleDetailView.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
function NewsCard({ article }) {
    const freshness = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFreshnessTag"])(article.published_at);
    const safeImage = article.image_url && article.image_url !== "None" ? article.image_url : "/placeholder-news.svg";
    // Modal State
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Hover Logic
    const handleMouseEnter = ()=>{
        // Start 2s timer
        timerRef.current = setTimeout(()=>{
            setShowModal(true);
        }, 2000);
    };
    const handleMouseLeave = ()=>{
        // Cancel timer if mouse leaves before 2s
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
    // Close modal
    const closeModal = ()=>setShowModal(false);
    // Close on Escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleEsc = (e)=>{
            if (e.key === 'Escape') closeModal();
        };
        if (showModal) {
            window.addEventListener('keydown', handleEsc);
        }
        return ()=>window.removeEventListener('keydown', handleEsc);
    }, [
        showModal
    ]);
    // Construct the article URL params (legacy link)
    const articleLink = `/news/article?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description || '')}&image=${encodeURIComponent(safeImage)}&date=${encodeURIComponent(article.published_at)}&source=${encodeURIComponent(article.source)}&id=${article.$id || ''}&category=${article.category || ''}&audio_url=${encodeURIComponent(article.audio_url || '')}&text_summary=${encodeURIComponent(article.text_summary || '')}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                className: "group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: articleLink,
                    className: "block h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative h-32",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: safeImage,
                                    onError: (e)=>{
                                        e.currentTarget.src = "/pulse/placeholder-news.svg";
                                    },
                                    alt: article.title,
                                    className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                    lineNumber: 73,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm ${freshness.className}`,
                                    children: freshness.text
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                    lineNumber: 81,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-2 right-2 bg-white/90 rounded-full p-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                        className: "w-4 h-4 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                        lineNumber: 87,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                    lineNumber: 86,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white px-4 py-2 rounded-lg shadow-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-gray-900 text-sm whitespace-nowrap",
                                            children: [
                                                "Source: ",
                                                article.source
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                            lineNumber: 93,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                        lineNumber: 92,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                    lineNumber: 91,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                            lineNumber: 72,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors",
                                    children: article.title
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                    lineNumber: 102,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 mb-2 line-clamp-2",
                                    children: article.description
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                    lineNumber: 105,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-xs text-gray-500 mt-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$AudioPlayer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    articleId: article.$id || article.url,
                                                    articleUrl: article.url,
                                                    initialAudioUrl: article.audio_url,
                                                    title: article.title,
                                                    image: safeImage,
                                                    category: article.category || ''
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                                    lineNumber: 110,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$TimeDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    timestamp: article.published_at
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                            lineNumber: 109,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$CardEngagementStats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            articleUrl: article.url,
                                            articleId: article.$id,
                                            initialStats: {
                                                viewCount: article.views || 0,
                                                likeCount: article.likes || 0,
                                                dislikeCount: article.dislikes || 0
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                            lineNumber: 120,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                    lineNumber: 108,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                            lineNumber: 101,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                    lineNumber: 70,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this),
            showModal && ("TURBOPACK compile-time value", "undefined") !== 'undefined' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200",
                onClick: closeModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: modalRef,
                    className: "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200",
                    onClick: (e)=>e.stopPropagation(),
                    onMouseLeave: ()=>{
                        // Grace period close on mouse leave from MODAL itself?
                        // User requirement: "Mouse leave the Modal Area ... closes it after a short grace period (0.5s)"
                        setTimeout(closeModal, 500);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: closeModal,
                            className: "absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                                lineNumber: 154,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                            lineNumber: 150,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$ArticleDetailView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            article: {
                                url: article.url,
                                title: article.title,
                                description: article.description || '',
                                image_url: safeImage,
                                published_at: article.published_at,
                                source: article.source,
                                category: article.category || '',
                                id: article.$id || '',
                                audio_url: article.audio_url,
                                text_summary: article.text_summary
                            },
                            isModal: true
                        }, void 0, false, {
                            fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                            lineNumber: 157,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                    lineNumber: 140,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/pulse/components/NewsCard.tsx",
                lineNumber: 136,
                columnNumber: 17
            }, this), document.body)
        ]
    }, void 0, true);
}
}),
"[project]/apps/pulse/app/(pulse)/news/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$newsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/lib/newsApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$NewsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/pulse/components/NewsCard.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const dynamic = 'force-dynamic';
// Category relationship mapping - each category shows only its related subcategories
const categoryRelationships = {
    // Data categories show all data subcategories
    'data-security': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    'data-governance': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    'data-privacy': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    'data-engineering': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    'business-analytics': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    'business-intelligence': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    'customer-data-platform': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    'data-centers': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    // Add data-management itself
    'data-management': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    // Add data-laws itself
    'data-laws': [
        {
            id: "data-laws",
            name: "Data Laws"
        },
        {
            id: "business-analytics",
            name: "Business Analytics"
        },
        {
            id: "business-intelligence",
            name: "Business Intelligence"
        },
        {
            id: "customer-data-platform",
            name: "Customer Data Platform"
        },
        {
            id: "data-centers",
            name: "Data Centers"
        },
        {
            id: "data-engineering",
            name: "Data Engineering"
        },
        {
            id: "data-governance",
            name: "Data Governance"
        },
        {
            id: "data-management",
            name: "Data Management"
        },
        {
            id: "data-privacy",
            name: "Data Privacy"
        },
        {
            id: "data-security",
            name: "Data Security"
        }
    ],
    // AI shows only AI
    'ai': [
        {
            id: "ai",
            name: "AI"
        }
    ],
    // Medium Article shows only Medium Article
    'medium-article': [
        {
            id: "medium-article",
            name: "Medium Article"
        }
    ],
    // Cloud Computing shows cloud provider subcategories
    'cloud-computing': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-aws': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-gcp': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-azure': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-ibm': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-oracle': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-digitalocean': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-salesforce': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-alibaba': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-tencent': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-huawei': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    'cloud-cloudflare': [
        {
            id: "cloud-computing",
            name: "All Cloud"
        },
        {
            id: "cloud-aws",
            name: "AWS"
        },
        {
            id: "cloud-gcp",
            name: "GCP"
        },
        {
            id: "cloud-azure",
            name: "Azure"
        },
        {
            id: "cloud-ibm",
            name: "IBM Cloud"
        },
        {
            id: "cloud-oracle",
            name: "Oracle"
        },
        {
            id: "cloud-digitalocean",
            name: "DigitalOcean"
        },
        {
            id: "cloud-salesforce",
            name: "Salesforce"
        },
        {
            id: "cloud-alibaba",
            name: "Alibaba Cloud"
        },
        {
            id: "cloud-tencent",
            name: "Tencent Cloud"
        },
        {
            id: "cloud-huawei",
            name: "Huawei Cloud"
        },
        {
            id: "cloud-cloudflare",
            name: "Cloudflare"
        }
    ],
    // Magazines shows only magazines
    'magazines': [
        {
            id: "magazines",
            name: "Magazines"
        }
    ]
};
function NewsContent() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const categoryParam = searchParams.get('category') || 'ai';
    const [newsData, setNewsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(categoryParam);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [hasMore, setHasMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // Get categories to show based on current category
    const categoriesToShow = categoryRelationships[activeCategory] || [
        {
            id: activeCategory,
            name: activeCategory
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setActiveCategory(categoryParam);
    }, [
        categoryParam
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const getNews = async ()=>{
            // Skip if already loaded and cache is fresh (within 2 minutes)
            const cached = newsData[activeCategory];
            if (cached && cached.length > 0) {
                const cacheAge = Date.now() - cached._timestamp;
                if (cacheAge < 120000) {
                    return; // Use cached data
                }
            }
            try {
                setLoading(true);
                const articles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$newsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchNewsByCategory"])(activeCategory, 1, 20);
                setNewsData((prev)=>({
                        ...prev,
                        [activeCategory]: Object.assign(articles, {
                            _timestamp: Date.now()
                        })
                    }));
                setCurrentPage((prev)=>({
                        ...prev,
                        [activeCategory]: 1
                    }));
                setHasMore((prev)=>({
                        ...prev,
                        [activeCategory]: articles.length >= 20
                    }));
            } catch (error) {
                console.error("News fetch error:", error);
            } finally{
                setLoading(false);
            }
        };
        getNews();
    }, [
        activeCategory
    ]);
    const loadMoreNews = async ()=>{
        const nextPage = (currentPage[activeCategory] || 1) + 1;
        try {
            setLoadingMore(true);
            const newArticles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$lib$2f$newsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchNewsByCategory"])(activeCategory, nextPage, 20);
            if (newArticles.length > 0) {
                setNewsData((prev)=>({
                        ...prev,
                        [activeCategory]: Object.assign([
                            ...prev[activeCategory],
                            ...newArticles
                        ], {
                            _timestamp: Date.now()
                        })
                    }));
                setCurrentPage((prev)=>({
                        ...prev,
                        [activeCategory]: nextPage
                    }));
                setHasMore((prev)=>({
                        ...prev,
                        [activeCategory]: newArticles.length >= 20
                    }));
            } else {
                setHasMore((prev)=>({
                        ...prev,
                        [activeCategory]: false
                    }));
            }
        } catch (error) {
            console.error("Load more error:", error);
        } finally{
            setLoadingMore(false);
        }
    };
    const articles = newsData[activeCategory] || [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 mb-8 flex-wrap justify-center",
                children: categoriesToShow.map((cat)=>{
                    // Check if this is a cloud provider category
                    const isCloudProvider = cat.id.startsWith('cloud-') && cat.id !== 'cloud-computing';
                    const providerName = cat.id.replace('cloud-', '');
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/news?category=${cat.id}`,
                        className: `px-6 py-2 rounded-full transition-all flex items-center gap-2 ${activeCategory === cat.id ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200"}`,
                        children: [
                            isCloudProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: `/cloud-logos/${providerName}.${[
                                    'salesforce',
                                    'alibaba',
                                    'tencent',
                                    'huawei'
                                ].includes(providerName) ? 'png' : 'svg'}`,
                                alt: `${cat.name} logo`,
                                className: "w-5 h-5 object-contain"
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                                lineNumber: 421,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: cat.name
                            }, void 0, false, {
                                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                                lineNumber: 427,
                                columnNumber: 29
                            }, this)
                        ]
                    }, cat.id, true, {
                        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                        lineNumber: 412,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                lineNumber: 405,
                columnNumber: 13
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                        lineNumber: 436,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-muted-foreground",
                        children: "Loading news..."
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                        lineNumber: 437,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                lineNumber: 435,
                columnNumber: 17
            }, this) : articles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500",
                    children: "No news available for this category"
                }, void 0, false, {
                    fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                    lineNumber: 441,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                lineNumber: 440,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4",
                children: articles.map((article, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$pulse$2f$components$2f$NewsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        article: article
                    }, i, false, {
                        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                        lineNumber: 446,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                lineNumber: 444,
                columnNumber: 17
            }, this),
            !loading && articles.length > 0 && hasMore[activeCategory] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: loadMoreNews,
                        disabled: loadingMore,
                        className: "px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2",
                        children: loadingMore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                                    lineNumber: 461,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Loading more..."
                                }, void 0, false, {
                                    fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                                    lineNumber: 462,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Load More Articles"
                        }, void 0, false, {
                            fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                            lineNumber: 465,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                        lineNumber: 454,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 mt-2",
                        children: [
                            "Showing ",
                            articles.length,
                            " articles • Page ",
                            currentPage[activeCategory] || 1
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                        lineNumber: 468,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                lineNumber: 453,
                columnNumber: 17
            }, this),
            !loading && articles.length > 0 && !hasMore[activeCategory] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mt-8 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500",
                    children: [
                        "You've reached the end of ",
                        activeCategory,
                        " news"
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                    lineNumber: 477,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                lineNumber: 476,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
        lineNumber: 403,
        columnNumber: 9
    }, this);
}
function NewsPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-20 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                }, void 0, false, {
                    fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                    lineNumber: 488,
                    columnNumber: 17
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-muted-foreground",
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
                    lineNumber: 489,
                    columnNumber: 17
                }, void 0)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
            lineNumber: 487,
            columnNumber: 13
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NewsContent, {}, void 0, false, {
            fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
            lineNumber: 492,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/pulse/app/(pulse)/news/page.tsx",
        lineNumber: 486,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=_88ae9b49._.js.map