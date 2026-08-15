# Graph Report - main-site  (2026-08-15)

## Corpus Check
- 31 files · ~747,446 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 255 nodes · 285 edges · 23 communities (22 shown, 1 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d17feaa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Navbar.tsx
- Segmento Main-Site — Upgraded Content Blueprint v2.0
- app/page.tsx
- compilerOptions
- dependencies
- layout.tsx
- Hero.tsx
- include
- SECTION 8 — CTA SECTION
- route.ts
- devDependencies
- SECTION 5 — HOW IT WORKS
- SECTION 2 — TRUST STRIP
- DESIGN.md
- SECTION 1 — HERO
- SECTION 9 — FOOTER
- SECTION 3 — FEATURES ("Why Segmento?")
- next.config.ts
- Ubiquitous Language — Segmento Main-Site

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Segmento Main-Site — Upgraded Content Blueprint v2.0` - 16 edges
3. `SECTION 3 — FEATURES ("Why Segmento?")` - 9 edges
4. `SECTION 6 — PRODUCT SHOWCASE` - 9 edges
5. `SECTION 1 — HERO` - 8 edges
6. `SECTION 5 — HOW IT WORKS` - 8 edges
7. `SECTION 9 — FOOTER` - 8 edges
8. `Footer()` - 7 edges
9. `Navbar()` - 7 edges
10. `include` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `getAppwriteClient()`  [EXTRACTED]
  app/api/contact/route.ts → app/lib/db.ts

## Import Cycles
- None detected.

## Communities (23 total, 1 thin omitted)

### Community 0 - "Navbar.tsx"
Cohesion: 0.09
Nodes (18): director, milestones, team, openRoles, Footer(), footerLinks, socialLinks, MegaFeatured (+10 more)

### Community 1 - "Segmento Main-Site — Upgraded Content Blueprint v2.0"
Cohesion: 0.08
Nodes (24): Caption (centered, below marquee), COMPLETE SECTION ORDER (Final), Design Notes, DESIGN TOKENS (Non-negotiable), DRIBBBLE / MOBBIN MASTER SEARCH LIST, FULL PAGE FLOW, KEY DESIGN RULES (Locked), Layout (+16 more)

### Community 2 - "app/page.tsx"
Cohesion: 0.11
Nodes (8): CTASection(), fadeUp(), Features(), HowItWorks(), POLICIES, STEPS, STATS, StatsTicker()

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "dependencies"
Cohesion: 0.08
Nodes (23): framer-motion, lucide-react, next, next-themes, node-appwrite, dependencies, framer-motion, lucide-react (+15 more)

### Community 5 - "layout.tsx"
Cohesion: 0.29
Nodes (6): Chatbot(), Message, metadata, dmMono, monaSans, syne

### Community 6 - "Hero.tsx"
Cohesion: 0.17
Nodes (12): fadeUp(), Hero(), PID, PRODUCTS, CollectShell(), PulseShell(), ResolveShell(), S (+4 more)

### Community 7 - "include"
Cohesion: 0.20
Nodes (9): .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, tailwind.config.js, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 8 - "SECTION 8 — CTA SECTION"
Cohesion: 0.29
Nodes (7): Heading, Layout, Primary Button, Secondary Button, SECTION 8 — CTA SECTION, Subtext, Trust micro-line (below buttons)

### Community 9 - "route.ts"
Cohesion: 0.60
Nodes (3): ContactFormData, POST(), getAppwriteClient()

### Community 13 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 14 - "SECTION 5 — HOW IT WORKS"
Cohesion: 0.25
Nodes (8): Layout, SECTION 5 — HOW IT WORKS, Section Heading, Section Label (pill tag), Section Subtext, Step 1 — CONNECT, Step 2 — DETECT, Step 3 — CONTROL

### Community 15 - "SECTION 2 — TRUST STRIP"
Cohesion: 0.33
Nodes (6): Caption text (small, centered below), Layout, Left Side — Compliance Badges (monochromatic icons), Right Side — Ecosystem Logos (grayed out, monochrome), SECTION 2 — TRUST STRIP, Separator

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
- **144 isolated node(s):** `director`, `team`, `milestones`, `ContactFormData`, `openRoles` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Segmento Main-Site — Upgraded Content Blueprint v2.0` connect `Segmento Main-Site — Upgraded Content Blueprint v2.0` to `SECTION 8 — CTA SECTION`, `SECTION 5 — HOW IT WORKS`, `SECTION 2 — TRUST STRIP`, `SECTION 1 — HERO`, `SECTION 9 — FOOTER`, `SECTION 3 — FEATURES ("Why Segmento?")`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `SECTION 3 — FEATURES ("Why Segmento?")` connect `SECTION 3 — FEATURES ("Why Segmento?")` to `Segmento Main-Site — Upgraded Content Blueprint v2.0`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `director`, `team`, `milestones` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Navbar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0855614973262032 - nodes in this community are weakly interconnected._
- **Should `Segmento Main-Site — Upgraded Content Blueprint v2.0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._