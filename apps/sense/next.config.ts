import path from "path";

const nextConfig: any = {
    basePath: '/products/data-classification',
    output: 'standalone',
    outputFileTracingRoot: path.resolve(__dirname, '../../../'),
    experimental: {
        turbo: {
            root: path.resolve(__dirname, '../../../'),
        },
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
