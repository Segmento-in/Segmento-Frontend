import type { NextConfig } from "next";

/**
 * pulse-ui-2: Parallel migration build.
 * Intentionally minimal — no basePath, no rewrites.
 * Runs on port 3002 (live pulse on 3001) for conflict-free parallel testing.
 * Will be extended in later phases once architecture is validated.
 */
const nextConfig: NextConfig = {
    basePath: '/pulse',
    // Allow any remote image domain during parallel testing.
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/pulse',
                basePath: false,
                permanent: false,
            }
        ];
    },
};

export default nextConfig;
