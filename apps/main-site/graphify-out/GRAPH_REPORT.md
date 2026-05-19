# Graph Report - ./frontend/apps/main-site  (2026-05-15)

## Corpus Check
- Large corpus: 63 files ╖ ~520,540 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 139 nodes · 143 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `devDependencies` - 9 edges
3. `dependencies` - 7 edges
4. `scripts` - 5 edges
5. `getAppwriteClient()` - 3 edges
6. `paths` - 2 edges
7. `POST()` - 2 edges
8. `fadeUp()` - 2 edges
9. `Hero()` - 2 edges
10. `getColClass()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `getAppwriteClient()`  [EXTRACTED]
  app/api/contact/route.ts → app/lib/db.ts

## Communities (16 total, 2 thin omitted)

### Community 0 - "Pages & About"
Cohesion: 0.1
Nodes (9): director, team, footerLinks, socialLinks, NavItem, NavLink, navLinks, faqs (+1 more)

### Community 1 - "TSConfig Setup"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Components & Main Page"
Cohesion: 0.12
Nodes (4): reasons, POLICIES, STEPS, statsData

### Community 3 - "Dependencies"
Cohesion: 0.12
Nodes (15): dependencies, framer-motion, lucide-react, next, node-appwrite, react, react-dom, name (+7 more)

### Community 4 - "Product Showcase UI"
Cohesion: 0.18
Nodes (4): BentoCard(), getColClass(), NEWS_ITEMS, PRODUCTS

### Community 5 - "Layout & Chatbot"
Cohesion: 0.21
Nodes (5): metadata, Message, dmMono, monaSans, syne

### Community 7 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 8 - "Solutions Page"
Cohesion: 0.33
Nodes (4): fadeUp, industries, staggerContainer, staggerItem

### Community 9 - "API & DB Backend"
Cohesion: 0.6
Nodes (3): ContactFormData, POST(), getAppwriteClient()

## Knowledge Gaps
- **61 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Dependencies`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Pages & About` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `TSConfig Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Components & Main Page` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._