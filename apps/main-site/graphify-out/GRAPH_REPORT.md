# Graph Report - main-site  (2026-08-21)

## Corpus Check
- 40 files · ~569,109 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 319 nodes · 356 edges · 28 communities (25 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f35c6df3`
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
- [[_COMMUNITY_SECTION 8 — CTA SECTION|SECTION 8 — CTA SECTION]]
- [[_COMMUNITY_route.ts|route.ts]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_SECTION 5 — HOW IT WORKS|SECTION 5 — HOW IT WORKS]]
- [[_COMMUNITY_stardust.tsx|stardust.tsx]]
- [[_COMMUNITY_globe.tsx|globe.tsx]]
- [[_COMMUNITY_DESIGN|DESIGN.md]]
- [[_COMMUNITY_SECTION 5 — HOW IT WORKS|SECTION 5 — HOW IT WORKS]]
- [[_COMMUNITY_spec|spec.md]]
- [[_COMMUNITY_Features.tsx|Features.tsx]]
- [[_COMMUNITY_Tickets Contact Page 3D Integration|Tickets: Contact Page 3D Integration]]
- [[_COMMUNITY_SECTION 1 — HERO|SECTION 1 — HERO]]
- [[_COMMUNITY_SECTION 9 — FOOTER|SECTION 9 — FOOTER]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_Ubiquitous Language — Segmento Main-Site|Ubiquitous Language — Segmento Main-Site]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Segmento Main-Site — Upgraded Content Blueprint v2.0` - 16 edges
3. `SECTION 3 — FEATURES ("Why Segmento?")` - 9 edges
4. `SECTION 6 — PRODUCT SHOWCASE` - 9 edges
5. `mapLinear()` - 8 edges
6. `SECTION 1 — HERO` - 8 edges
7. `SECTION 5 — HOW IT WORKS` - 8 edges
8. `SECTION 9 — FOOTER` - 8 edges
9. `Globe()` - 7 edges
10. `SECTION 8 — CTA SECTION` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `getAppwriteClient()`  [EXTRACTED]
  app/api/contact/route.ts → app/lib/db.ts

## Import Cycles
- None detected.

## Communities (28 total, 3 thin omitted)

### Community 0 - "Navbar.tsx"
Cohesion: 0.06
Nodes (17): director, milestones, team, openRoles, footerLinks, socialLinks, MegaFeatured, MegaItem (+9 more)

### Community 1 - "Segmento Main-Site — Upgraded Content Blueprint v2.0"
Cohesion: 0.06
Nodes (32): Caption (centered, below marquee), Column: Company, Column: Compliance, Column: Legal, Column: Products, COMPLETE SECTION ORDER (Final), Compliance badges row (bottom of footer), Copyright line (+24 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 4 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, d3-geo, framer-motion, lucide-react, next, next-themes, node-appwrite, react (+4 more)

### Community 5 - "layout.tsx"
Cohesion: 0.27
Nodes (5): Message, metadata, dmMono, monaSans, syne

### Community 6 - "Hero.tsx"
Cohesion: 0.17
Nodes (11): fadeUp(), Hero(), PID, PRODUCTS, CollectShell(), PulseShell(), ResolveShell(), S (+3 more)

### Community 7 - "include"
Cohesion: 0.29
Nodes (7): Heading, Layout, Primary Button, Secondary Button, SECTION 8 — CTA SECTION, Subtext, Trust micro-line (below buttons)

### Community 8 - "SECTION 8 — CTA SECTION"
Cohesion: 0.22
Nodes (9): BENTO GRID LAYOUT, HERO TILE — 100% Client-Side Processing, MEDIUM TILE — Explainable AI, SECTION 3 — FEATURES ("Why Segmento?"), Section Heading, Section Label (pill tag), Section Subtext, SMALL TILE — Zero-Trust Data Handling (+1 more)

### Community 9 - "route.ts"
Cohesion: 0.60
Nodes (3): ContactFormData, POST(), getAppwriteClient()

### Community 13 - "devDependencies"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/d3-geo, @types/node, @types/react (+11 more)

### Community 14 - "SECTION 5 — HOW IT WORKS"
Cohesion: 0.08
Nodes (23): inlineScale(), ScaleFrame(), AVATARS, Badge(), BIG_CARD, BIG_CARD_LEFT, BIG_CARD_RIGHT, BRAND_ART (+15 more)

### Community 15 - "stardust.tsx"
Cohesion: 0.13
Nodes (9): STARDUST, MediaGlobe(), MediaStardust(), useMediaQuery(), DEFAULTS, Particle, Rgba, Sparkles() (+1 more)

### Community 16 - "globe.tsx"
Cohesion: 0.19
Nodes (16): DotsConfig, Globe(), GlobeProps, mapDensityUiToSpacing(), mapDetailToStepSize(), mapDotSizeUiToMultiplier(), mapDragSpeedUiToSensitivity(), mapLinear() (+8 more)

### Community 17 - "DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 18 - "SECTION 5 — HOW IT WORKS"
Cohesion: 0.25
Nodes (8): Layout, SECTION 5 — HOW IT WORKS, Section Heading, Section Label (pill tag), Section Subtext, Step 1 — CONNECT, Step 2 — DETECT, Step 3 — CONTROL

### Community 19 - "spec.md"
Cohesion: 0.29
Nodes (6): Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 21 - "Tickets: Contact Page 3D Integration"
Cohesion: 0.40
Nodes (4): 1. Remove Static Map Asset, 2. Inject 3D Stardust & Globe Background, 3. Apply Brand Theme Filtering & Z-Index Polish, Tickets: Contact Page 3D Integration

### Community 23 - "SECTION 1 — HERO"
Cohesion: 0.25
Nodes (8): Announcement Badge (pill above headline), H1 Headline, Hero Visual — RIGHT SIDE (Critical), Primary CTA Button, Secondary CTA Button, SECTION 1 — HERO, Subheadline, Trust Line (small text below buttons)

### Community 24 - "SECTION 9 — FOOTER"
Cohesion: 0.33
Nodes (6): Caption text (small, centered below), Layout, Left Side — Compliance Badges (monochromatic icons), Right Side — Ecosystem Logos (grayed out, monochrome), SECTION 2 — TRUST STRIP, Separator

### Community 123 - "Ubiquitous Language — Segmento Main-Site"
Cohesion: 0.29
Nodes (6): Contact Page, Design Tokens (Nav-specific), Navigation, Products, Theming Architecture, Ubiquitous Language — Segmento Main-Site

## Knowledge Gaps
- **175 isolated node(s):** `director`, `team`, `milestones`, `ContactFormData`, `openRoles` (+170 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Segmento Main-Site — Upgraded Content Blueprint v2.0` connect `Segmento Main-Site — Upgraded Content Blueprint v2.0` to `include`, `SECTION 8 — CTA SECTION`, `SECTION 5 — HOW IT WORKS`, `SECTION 1 — HERO`, `SECTION 9 — FOOTER`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `MediaGlobe()` connect `stardust.tsx` to `SECTION 5 — HOW IT WORKS`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `MediaStardust()` connect `stardust.tsx` to `SECTION 5 — HOW IT WORKS`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `director`, `team`, `milestones` to the rest of the system?**
  _175 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Navbar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058029689608636977 - nodes in this community are weakly interconnected._
- **Should `Segmento Main-Site — Upgraded Content Blueprint v2.0` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._