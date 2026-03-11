<div align="center">
  <h1>Segmento Frontend Monorepo</h1>
  <p>The core frontend architecture powering <b>Segmento Sense</b> & <b>Segmento Pulse</b></p>
</div>

<br />

## 🪐 Ecosystem

This repository is structured as a powerful Next.js **Vercel Multi-Zone** Monorepo. 

By separating the applications into independently deployable zones, Segmento maintains perfectly isolated build pipelines while presenting a unified domain (`segmento.in`) to the end-user.

- **`apps/main-site`**: The central router and corporate landing page.
- **`apps/pulse`**: The dedicated application for Segmento Pulse (AI-curated news platform).
- **`apps/sense`**: The intelligent data classification and analysis enterprise application.

## 🚀 Getting Started

### Prerequisites

- Node.js `v20+`
- npm `v10+`

### Local Development

This monorepo utilizes explicit npm workspaces. You can run the development servers independently via the root package configurations:

```bash
# Run the Main Site Router (Proxy) on Port 3000
npm run dev:main

# Run Segmento Pulse independently on Port 3001
npm run dev:pulse
```

## 🏗️ Architecture Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI, Lucide React
- **Deployment**: Vercel Serverless Edge Network

---
*Built with passion by the Segmento Engineering Team.*
