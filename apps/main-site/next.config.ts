import path from "path";

// Next.js 16 moved turbopack config to a TOP-LEVEL `turbopack` key.
// `experimental.turbo` is the old (pre-16) pattern and is now invalid.
// Both `next dev` AND `next build` use Turbopack in Next.js 16, so this
// setting is required in all environments.
//
// `outputFileTracingRoot` is intentionally NOT set — it is only valid for
// apps with `output: 'standalone'`. Without it Next.js tracing works
// correctly. Setting it caused a doubled Vercel path:
//   /vercel/path0/path0/apps/main-site/.next/routes-manifest.json ← WRONG
const nextConfig: any = {
  // Tell Turbopack the monorepo root so it can resolve next/package.json
  // correctly from within the monorepo's apps subdirectory.
  turbopack: {
    root: path.resolve(__dirname, "../../../"),
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
        source: '/sense',
        missing: [
          {
            type: 'host',
            value: 'sense.segmento.in',
          },
        ],
        destination: `${process.env.SENSE_URL || (process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:3002'
          : 'https://sense.segmento.in')}/sense`,
      },
      {
        source: '/sense/:path*',
        missing: [
          {
            type: 'host',
            value: 'sense.segmento.in',
          },
        ],
        destination: `${process.env.SENSE_URL || (process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:3002'
          : 'https://sense.segmento.in')}/sense/:path*`,
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