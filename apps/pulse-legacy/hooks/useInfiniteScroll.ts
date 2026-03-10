/**
 * useInfiniteScroll Hook
 * 
 * A reusable hook to detect when the user scrolls to the bottom of the page
 * and trigger a callback to load more content.
 * 
 * Usage:
 * const { lastElementRef, isLoading } = useInfiniteScroll(loadMore, hasMore);
 * 
 * Then attach the ref to the last element in your list:
 * <div ref={lastElementRef}>Last Item</div>
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number; // 0-1, how much of element should be visible (default: 1.0 = 100%)
    rootMargin?: string; // Margin around the root (default: '0px')
}

export function useInfiniteScroll(
    callback: () => void | Promise<void>,
    hasMore: boolean,
    isLoading: boolean = false,
    options: UseInfiniteScrollOptions = {}
) {
    const { threshold = 1.0, rootMargin = '0px' } = options;

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            // Disconnect existing observer
            if (observer.current) observer.current.disconnect();

            // Don't observe if loading or no more data
            if (isLoading || !hasMore) return;

            // Create new observer
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !isLoading) {
                        callback();
                    }
                },
                { threshold, rootMargin }
            );

            // Start observing the node
            if (node) observer.current.observe(node);
        },
        [callback, hasMore, isLoading, threshold, rootMargin]
    );

    return { lastElementRef };
}

// Export for use in components
export default useInfiniteScroll;
