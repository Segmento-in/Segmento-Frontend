export async function generateArticleId(url: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return hashHex.substring(0, 32);
}

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

export function isValidArticleId(id: string): boolean {
    return /^[a-f0-9]{32}$/.test(id);
}
