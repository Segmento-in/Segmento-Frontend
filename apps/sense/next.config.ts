import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    basePath: '/products/data-classification',
    output: 'standalone',
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
