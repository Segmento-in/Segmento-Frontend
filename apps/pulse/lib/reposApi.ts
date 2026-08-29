import { getApiBase } from './apiBase';

export interface Repo {
    $id: string;
    id: string;
    name: string;
    owner: string;
    description: string;
    repo_url: string;
    language: string | null;
    stars: number;
    forks: number;
    last_synced_at: string;
    likes: number;
    dislikes: number;
    views: number;
    // UI-specific properties
    imgSrc: string;
    imgAlt: string;
}

export async function sanitizeRepoPayload(repo: any): Promise<Repo> {
    const safeId = repo.$id || repo.id || Math.random().toString(36).substring(7);
    const owner = repo.owner || "Unknown";
    const name = repo.name || "Unknown";
    
    // GitHub OpenGraph image as specified
    const imgSrc = `https://opengraph.githubassets.com/1/${owner}/${name}`;
    
    return {
        $id: safeId,
        id: safeId,
        name: name,
        owner: owner,
        description: repo.description || "",
        repo_url: repo.repo_url || `https://github.com/${owner}/${name}`,
        language: repo.language || null,
        stars: Number(repo.stars) || 0,
        forks: Number(repo.forks) || 0,
        last_synced_at: repo.last_synced_at || new Date().toISOString(),
        likes: Number(repo.likes) || 0,
        dislikes: Number(repo.dislikes) || 0,
        views: Number(repo.views) || 0,
        imgSrc: imgSrc,
        imgAlt: `${owner}/${name} repository graph`,
    };
}

export async function fetchTopRepos(): Promise<Repo[]> {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/api/repos/top`, {
            // Caching aligned with Next.js data-cache layer pattern
            next: { revalidate: 300 },
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'SegmentoPulse/1.0 (Vercel Frontend)'
            }
        });

        if (!response.ok) {
            console.error('[reposApi] Failed to fetch top repos:', response.statusText);
            return [];
        }

        const data = await response.json();
        
        if (!data.success || !data.repos) {
            console.error('[reposApi] Invalid response format:', data);
            return [];
        }

        return Promise.all(data.repos.map(sanitizeRepoPayload));
    } catch (error) {
        console.error('[reposApi] Error fetching top repos:', error);
        return [];
    }
}
