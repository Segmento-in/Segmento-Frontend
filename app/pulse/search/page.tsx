'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, ExternalLink, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchNews, type Article } from "@/lib/pulse/newsApi";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);

        try {
            const articles = await searchNews(query.trim());
            setResults(articles);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Search News</h1>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Search for news..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 h-12 text-lg"
                        />
                        <Button type="submit" size="lg" disabled={loading}>
                            <SearchIcon className="mr-2 h-5 w-5" />
                            Search
                        </Button>
                    </div>
                </form>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-muted-foreground">Searching...</p>
                    </div>
                ) : searched && results.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No results found for "{query}"</p>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <p className="text-sm text-gray-600 mb-4">Found {results.length} results</p>
                        <div className="space-y-4">
                            {results.map((article, i) => (
                                <a
                                    key={i}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-white rounded-lg shadow hover:shadow-lg transition-all p-4"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-32 h-24 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {article.title}
                                                <ExternalLink className="inline-block ml-2 w-4 h-4" />
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {article.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                                {article.source && <span>• {article.source}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
