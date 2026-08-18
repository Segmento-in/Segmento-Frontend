# Graph Report - main-site  (2026-08-18)

## Corpus Check
- 31 files · ~668,955 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 231 nodes · 242 edges · 21 communities (20 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dfd17003`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Navbar.tsx|Navbar.tsx]]
- [[_COMMUNITY_Segmento Main-Site — Upgraded Content Blueprint v2.0|Segmento Main-Site — Upgraded Content Blueprint v2.0]]
- [[_COMMUNITY_apppage.tsx|app/page.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_Hero.tsx|Hero.tsx]]
- [[_COMMUNITY_include|include]]
- [[_COMMUNITY_route.ts|route.ts]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_SECTION 5 — HOW IT WORKS|SECTION 5 — HOW IT WORKS]]
- [[_COMMUNITY_DESIGN|DESIGN.md]]
- [[_COMMUNITY_SECTION 1 — HERO|SECTION 1 — HERO]]
- [[_COMMUNITY_SECTION 9 — FOOTER|SECTION 9 — FOOTER]]
- [[_COMMUNITY_SECTION 3 — FEATURES (Why Segmento)|SECTION 3 — FEATURES ("Why Segmento?")]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_Ubiquitous Language — Segmento Main-Site|Ubiquitous Language — Segmento Main-Site]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Segmento Main-Site — Upgraded Content Blueprint v2.0` - 16 edges
3. `SECTION 3 — FEATURES ("Why Segmento?")` - 9 edges
4. `SECTION 6 — PRODUCT SHOWCASE` - 9 edges
5. `SECTION 1 — HERO` - 8 edges
6. `SECTION 5 — HOW IT WORKS` - 8 edges
7. `SECTION 9 — FOOTER` - 8 edges
8. `SECTION 8 — CTA SECTION` - 7 edges
9. `Ubiquitous Language — Segmento Main-Site` - 6 edges
10. `SECTION 2 — TRUST STRIP` - 6 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `getAppwriteClient()`  [EXTRACTED]
  app/api/contact/route.ts → app/lib/db.ts

## Import Cycles
- None detected.

## Communities (21 total, 1 thin omitted)

### Community 0 - "Navbar.tsx"
Cohesion: 0.07
Nodes (16): director, milestones, team, openRoles, footerLinks, socialLinks, MegaFeatured, MegaItem (+8 more)

### Community 1 - "Segmento Main-Site — Upgraded Content Blueprint v2.0"
Cohesion: 0.07
Nodes (28): Caption (centered, below marquee), Caption text (small, centered below), COMPLETE SECTION ORDER (Final), Design Notes, DESIGN TOKENS (Non-negotiable), DRIBBBLE / MOBBIN MASTER SEARCH LIST, FULL PAGE FLOW, Heading (+20 more)

### Community 2 - "app/page.tsx"
Cohesion: 0.10
Nodes (5): fadeUp(), Features(), POLICIES, STEPS, STATS

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, framer-motion, lucide-react, next, next-themes, node-appwrite, react, react-dom (+8 more)

### Community 5 - "layout.tsx"
Cohesion: 0.27
Nodes (5): Message, metadata, dmMono, monaSans, syne

### Community 6 - "Hero.tsx"
Cohesion: 0.17
Nodes (11): fadeUp(), Hero(), PID, PRODUCTS, CollectShell(), PulseShell(), ResolveShell(), S (+3 more)

### Community 7 - "include"
Cohesion: 0.22
Nodes (9): Product 1 — Segmento Pulse *(Left text / Right visual)*, Product 2 — Segmento Sense *(Right text / Left visual — alternates)*, Product 3 — Segmento Collect *(Left text / Right visual)*, Product 4 — Segmento Resolve *(Right text / Left visual — alternates)*, Product 5 — Segmento SprintQL *(Left text / Right visual)*, SECTION 6 — PRODUCT SHOWCASE, Section Heading, Section Label (+1 more)

### Community 9 - "route.ts"
Cohesion: 0.60
Nodes (3): ContactFormData, POST(), getAppwriteClient()

### Community 13 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 14 - "SECTION 5 — HOW IT WORKS"
Cohesion: 0.25
Nodes (8): Layout, SECTION 5 — HOW IT WORKS, Section Heading, Section Label (pill tag), Section Subtext, Step 1 — CONNECT, Step 2 — DETECT, Step 3 — CONTROL

### Community 17 - "DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 23 - "SECTION 1 — HERO"
Cohesion: 0.25
Nodes (8): Announcement Badge (pill above headline), H1 Headline, Hero Visual — RIGHT SIDE (Critical), Primary CTA Button, Secondary CTA Button, SECTION 1 — HERO, Subheadline, Trust Line (small text below buttons)

### Community 24 - "SECTION 9 — FOOTER"
Cohesion: 0.25
Nodes (8): Column: Company, Column: Compliance, Column: Legal, Column: Products, Compliance badges row (bottom of footer), Copyright line, SECTION 9 — FOOTER, Tagline under logo

### Community 25 - "SECTION 3 — FEATURES ("Why Segmento?")"
Cohesion: 0.22
Nodes (9): BENTO GRID LAYOUT, HERO TILE — 100% Client-Side Processing, MEDIUM TILE — Explainable AI, SECTION 3 — FEATURES ("Why Segmento?"), Section Heading, Section Label (pill tag), Section Subtext, SMALL TILE — Zero-Trust Data Handling (+1 more)

### Community 123 - "Ubiquitous Language — Segmento Main-Site"
Cohesion: 0.29
Nodes (6): Contact Page, Design Tokens (Nav-specific), Navigation, Products, Theming Architecture, Ubiquitous Language — Segmento Main-Site

## Knowledge Gaps
- **137 isolated node(s):** `director`, `team`, `milestones`, `ContactFormData`, `openRoles` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Segmento Main-Site — Upgraded Content Blueprint v2.0` connect `Segmento Main-Site — Upgraded Content Blueprint v2.0` to `include`, `SECTION 5 — HOW IT WORKS`, `SECTION 1 — HERO`, `SECTION 9 — FOOTER`, `SECTION 3 — FEATURES ("Why Segmento?")`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `SECTION 3 — FEATURES ("Why Segmento?")` connect `SECTION 3 — FEATURES ("Why Segmento?")` to `Segmento Main-Site — Upgraded Content Blueprint v2.0`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `SECTION 6 — PRODUCT SHOWCASE` connect `include` to `Segmento Main-Site — Upgraded Content Blueprint v2.0`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `director`, `team`, `milestones` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Navbar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0677361853832442 - nodes in this community are weakly interconnected._
- **Should `Segmento Main-Site — Upgraded Content Blueprint v2.0` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._