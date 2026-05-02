import path from "path";

// Using `any` type mirrors frontend/apps/sense/next.config.ts exactly.
// NextConfig type rejects `experimental.turbo` in Next.js 16 typings, but
// the runtime still accepts it — same approach that works for the Sense app.
const nextConfig: any = {
  // Fix: Turbopack monorepo workspace root resolution (mirrors sense/next.config.ts)
  outputFileTracingRoot: path.resolve(__dirname, "../../../"),
  experimental: {
    turbo: {
      root: path.resolve(__dirname, "../../../"),
    },
  },

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
        destination: `${process.env.PULSE_URL || (process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:3001'
          : 'https://pulse.segmento.in')}/pulse`,
      },
      {
        source: '/pulse/:path*',
        missing: [
          {
            type: 'host',
            value: 'pulse.segmento.in',
          },
        ],
        destination: `${process.env.PULSE_URL || (process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:3001'
          : 'https://pulse.segmento.in')}/pulse/:path*`,
      },
      {
        source: '/products/data-classification',
        missing: [
          {
            type: 'host',
            value: 'sense.segmento.in',
          },
        ],
        destination: `${process.env.SENSE_URL || (process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:3002'
          : 'https://sense.segmento.in')}/products/data-classification`,
      },
      {
        source: '/products/data-classification/:path*',
        missing: [
          {
            type: 'host',
            value: 'sense.segmento.in',
          },
        ],
        destination: `${process.env.SENSE_URL || (process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:3002'
          : 'https://sense.segmento.in')}/products/data-classification/:path*`,
      },
    ];
  },

  // ✅ ADD THIS PART
  async redirects() {
    return [
      {
        source: '/products/segmento-resolve',
        destination: 'https://ticket-management-frontend-tau.vercel.app/',
        permanent: false,
      },
      {
        source: '/products/segmento-sprintq',
        destination: 'https://segmento-retro-omega.vercel.app',
        permanent: false,
      },
      {
        source: '/products/segmento-collect',
        destination: 'https://segmento-collect.onrender.com',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;