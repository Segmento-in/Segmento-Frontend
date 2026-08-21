'use client';

/**
 * ArticleImage
 *
 * Canonical article image component for Segmento Pulse.
 * Renders the Article Fallback Banner (`placeholder-news.svg`) whenever
 * the image URL is missing, empty, or fails to load — no broken-image
 * icon is ever shown to the reader.
 *
 * Usage:
 *   <ArticleImage src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
 *   <ArticleImage src={art.imgSrc} alt={art.imgAlt} className="w-full h-full object-cover" loading="lazy" />
 *
 * The `src` prop is named neutrally so both `image_url` and `imgSrc` call
 * sites can map their field in without any prop renaming.
 */

import { useState, useEffect } from 'react';

/** Path to the Article Fallback Banner — canonical, not caller-configurable. */
const FALLBACK = '/pulse/placeholder-news.svg';

export interface ArticleImageProps {
    /** The image URL. May be undefined, null, or empty — all treated as "no image". */
    src?: string | null;
    /** Alt text — required for accessibility. */
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    loading?: 'lazy' | 'eager';
    fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Renders an article image with automatic Article Fallback Banner support.
 *
 * - No src → Fallback Banner renders immediately (no network request, no flash).
 * - src present, load fails → Fallback Banner swaps in on `onError`.
 * - src present, load succeeds → real image renders, identical to a plain <img>.
 */
export function ArticleImage({
    src,
    alt,
    className,
    style,
    loading,
    fetchPriority,
}: ArticleImageProps) {
    const [failed, setFailed] = useState(false);

    // Reset failure state whenever the src prop changes (e.g. list navigation).
    useEffect(() => {
        setFailed(false);
    }, [src]);

    const effectiveSrc = !src || failed ? FALLBACK : src;

    return (
        <img
            src={effectiveSrc}
            alt={alt}
            className={className}
            style={style}
            loading={loading}
            // fetchPriority is a valid HTML attribute but not yet in React's types for all versions;
            // cast to avoid TS noise on older @types/react.
            {...(fetchPriority ? { fetchPriority } : {})}
            onError={() => setFailed(true)}
        />
    );
}
