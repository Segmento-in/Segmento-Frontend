import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/pulse',
                missing: [
                    {
                        type: 'host',
                        value: 'pulse.segmento.in',
                    },
                ],
                destination: `${process.env.PULSE_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3001' : 'https://pulse.segmento.in')}/pulse`,
            },
            {
                source: '/pulse/:path*',
                missing: [
                    {
                        type: 'host',
                        value: 'pulse.segmento.in',
                    },
                ],
                destination: `${process.env.PULSE_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3001' : 'https://pulse.segmento.in')}/pulse/:path*`,
            },
            {
                source: '/products/data-classification',
                missing: [
                    {
                        type: 'host',
                        value: 'sense.segmento.in',
                    },
                ],
                destination: `${process.env.SENSE_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3002' : 'https://sense.segmento.in')}/products/data-classification`,
            },
            {
                source: '/products/data-classification/:path*',
                missing: [
                    {
                        type: 'host',
                        value: 'sense.segmento.in',
                    },
                ],
                destination: `${process.env.SENSE_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3002' : 'https://sense.segmento.in')}/products/data-classification/:path*`,
            },
        ];
    },
};

export default nextConfig;
