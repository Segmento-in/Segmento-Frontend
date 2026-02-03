/**
 * Article ID Generator - SHA-256 Based
 * ====================================
 * 
 * Generates Appwrite-compatible article IDs (32 characters) from URLs.
 * Uses SHA-256 hash for deterministic, collision-resistant IDs.
 */

/**
 * Generate article ID from URL using SHA-256 hash.
 * Returns 32-character alphanumeric ID compatible with Appwrite.
 * 
 * @param url - Article URL
 * @returns Promise<string> - 32-character article ID
 * 
 * @example
 * const id = await generateArticleId("https://example.com/article");
 * console.log(id); // "a1b2c3d4e5f6..." (32 chars)
 */
export async function generateArticleId(url: string): Promise<string> {
    // Use Web Crypto API (available in browsers and Node.js 15+)
    const encoder = new TextEncoder();
    const data = encoder.encode(url);

    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert to hex string (64 characters)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // Take first 32 characters (sufficient uniqueness)
    return hashHex.substring(0, 32);
}

/**
 * Legacy base64 ID generation (for reference only).
 * DO NOT USE - kept for backwards compatibility testing.
 * 
 * @deprecated Use generateArticleId instead
 */
export function generateArticleIdLegacy(url: string): string {
    if (typeof window === 'undefined') {
        // Server-side (Node.js)
        return Buffer.from(url).toString('base64').replace(/=/g, '');
    } else {
        // Client-side (browser)
        return btoa(url).replace(/=/g, '');
    }
}

/**
 * Batch generate IDs for multiple URLs.
 * Useful for preloading engagement stats.
 * 
 * @param urls - Array of article URLs
 * @returns Promise<Map<string, string>> - Map of URL to article ID
 */
export async function generateArticleIds(urls: string[]): Promise<Map<string, string>> {
    const idMap = new Map<string, string>();

    await Promise.all(
        urls.map(async (url) => {
            const id = await generateArticleId(url);
            idMap.set(url, id);
        })
    );

    return idMap;
}

/**
 * Validate if a string looks like a valid article ID.
 * 
 * @param id - Potential article ID
 * @returns boolean - True if valid format
 */
export function isValidArticleId(id: string): boolean {
    // Valid Appwrite ID: 32 alphanumeric characters
    return /^[a-f0-9]{32}$/.test(id);
}
