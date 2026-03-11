import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    basePath: '/pulse',
    output: 'standalone',
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
