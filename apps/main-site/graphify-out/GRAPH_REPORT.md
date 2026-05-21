# Graph Report - frontend\apps\main-site  (2026-05-21)

## Corpus Check
- 29 files · ~986,406 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 166 nodes · 171 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3691a11`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Pages & About|Pages & About]]
- [[_COMMUNITY_TSConfig Setup|TSConfig Setup]]
- [[_COMMUNITY_Components & Main Page|Components & Main Page]]
- [[_COMMUNITY_Dependencies|Dependencies]]
- [[_COMMUNITY_Product Showcase UI|Product Showcase UI]]
- [[_COMMUNITY_Layout & Chatbot|Layout & Chatbot]]
- [[_COMMUNITY_Hero Component|Hero Component]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Solutions Page|Solutions Page]]
- [[_COMMUNITY_API & DB Backend|API & DB Backend]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `devDependencies` - 9 edges
3. `dependencies` - 8 edges
4. `scripts` - 5 edges
5. `getAppwriteClient()` - 3 edges
6. `paths` - 2 edges
7. `POST()` - 2 edges
8. `fadeUp()` - 2 edges
9. `Features()` - 2 edges
10. `fadeUp()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `getAppwriteClient()`  [EXTRACTED]
  app/api/contact/route.ts → app/lib/db.ts

## Communities (19 total, 4 thin omitted)

### Community 0 - "Pages & About"
Cohesion: 0.07
Nodes (15): openRoles, footerLinks, socialLinks, MegaFeatured, MegaItem, MegaSection, NavItem, NavLink (+7 more)

### Community 1 - "TSConfig Setup"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, framer-motion, lucide-react, next, next-themes, node-appwrite, react, react-dom (+8 more)

### Community 4 - "Product Showcase UI"
Cohesion: 0.18
Nodes (4): BentoCard(), getColClass(), NEWS_ITEMS, PRODUCTS

### Community 5 - "Layout & Chatbot"
Cohesion: 0.27
Nodes (5): metadata, Message, dmMono, monaSans, syne

### Community 7 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 9 - "API & DB Backend"
Cohesion: 0.6
Nodes (3): ContactFormData, POST(), getAppwriteClient()

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (3): fadeUp(), Features(), reasons

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 18 - "Community 18"
Cohesion: 0.4
Nodes (3): director, milestones, team

## Knowledge Gaps
- **75 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Dependencies`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Pages & About` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `TSConfig Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._