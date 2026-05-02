import path from "path";

const nextConfig: any = {
    basePath: '/products/data-classification',
    output: 'standalone',

    // REMOVED: outputFileTracingRoot — was causing doubled Vercel path:
    //   /vercel/path0/path0/apps/sense/.next/routes-manifest.json  ← WRONG
    // Vercel handles file tracing for standalone deployments internally.
    // Setting this explicitly with a monorepo-relative path causes the
    // tracer to compute an incorrect relative path for the .next directory.

    // Next.js 16: turbopack config moved from experimental.turbo to top-level
    // turbopack key. Both `next dev` and `next build` use Turbopack in v16.
    turbopack: {
        root: path.resolve(__dirname, '../../../'),
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/products/data-classification',
                basePath: false,
                permanent: false,
            }
        ];
    },
};

export default nextConfig;
