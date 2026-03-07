import type { NextConfig } from "next";

/**
 * pulse-ui-2: Parallel migration build.
 * Intentionally minimal — no basePath, no rewrites.
 * Runs on port 3002 (live pulse on 3001) for conflict-free parallel testing.
 * Will be extended in later phases once architecture is validated.
 */
const nextConfig: NextConfig = {
    images: {
        // Allow any remote image domain during parallel testing.
        // Tighten to specific domains before production swap.
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
