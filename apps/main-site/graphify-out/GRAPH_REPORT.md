# Graph Report - main-site  (2026-05-22)

## Corpus Check
- 31 files · ~991,139 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 308 nodes · 317 edges · 23 communities (22 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `63757dc8`
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
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Segmento Main-Site — Upgraded Content Blueprint v2.0` - 16 edges
3. `devDependencies` - 9 edges
4. `SECTION 3 — FEATURES ("Why Segmento?")` - 9 edges
5. `SECTION 6 — PRODUCT SHOWCASE` - 9 edges
6. `dependencies` - 8 edges
7. `SECTION 1 — HERO` - 8 edges
8. `SECTION 5 — HOW IT WORKS` - 8 edges
9. `SECTION 9 — FOOTER` - 8 edges
10. `SECTION 8 — CTA SECTION` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `getAppwriteClient()`  [EXTRACTED]
  app/api/contact/route.ts → app/lib/db.ts

## Communities (23 total, 1 thin omitted)

### Community 0 - "Pages & About"
Cohesion: 0.06
Nodes (18): director, milestones, team, openRoles, footerLinks, socialLinks, MegaFeatured, MegaItem (+10 more)

### Community 1 - "TSConfig Setup"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Components & Main Page"
Cohesion: 0.09
Nodes (7): fadeUp(), Features(), reasons, POLICIES, STEPS, STATS, statsData

### Community 3 - "Dependencies"
Cohesion: 0.08
Nodes (25): dependencies, framer-motion, lucide-react, next, next-themes, node-appwrite, react, react-dom (+17 more)

### Community 4 - "Product Showcase UI"
Cohesion: 0.18
Nodes (4): BentoCard(), getColClass(), NEWS_ITEMS, PRODUCTS

### Community 5 - "Layout & Chatbot"
Cohesion: 0.21
Nodes (5): metadata, Message, dmMono, monaSans, syne

### Community 6 - "Hero Component"
Cohesion: 0.11
Nodes (10): fadeUp(), Hero(), PID, PRODUCTS, CollectShell(), PulseShell(), ResolveShell(), S (+2 more)

### Community 7 - "Dev Dependencies"
Cohesion: 0.09
Nodes (21): Caption (centered, below marquee), code:block1 (NAVBAR), code:block2 ([Segmento Logo]  Home  About  Products ▾  Solutions ▾  Resou), code:block26 (5 Products  ·  50+ PII Types Detected  ·  100% Client-Side P), code:block49 (Connects with your entire stack), code:block50 (Row 1: AWS · Snowflake · Google Cloud · Azure · Databricks ·), code:block51 (12+ source types. Native connectors. Zero custom engineering), COMPLETE SECTION ORDER (Final) (+13 more)

### Community 8 - "Solutions Page"
Cohesion: 0.09
Nodes (22): code:block36 (Our Products), code:block37 (Five tools. One platform.), code:block38 (Each product solves a specific problem.), code:block39 (Know what's happening before it hits you.), code:block40 (Pulse tracks global data privacy news, regulatory changes,), code:block41 (Find sensitive data. Before someone else does.), code:block42 (Sense uses explainable AI to detect, classify, and redact PI), code:block43 (Every source. One pipeline.) (+14 more)

### Community 9 - "API & DB Backend"
Cohesion: 0.6
Nodes (3): ContactFormData, POST(), getAppwriteClient()

### Community 16 - "Community 16"
Cohesion: 0.1
Nodes (21): BENTO GRID LAYOUT, code:block14 (Why Segmento), code:block15 (Built different. By design.), code:block16 (We didn't bolt security on after. We started with it.), code:block17 (┌──────────────────────────────┬───────────────────┐), code:block18 (Your data never leaves your walls.), code:block19 (Every scan, every classification, every redaction runs entir), code:block20 (AI that explains itself.) (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (17): code:block27 (How It Works), code:block28 (Up and running in minutes.), code:block29 (Three steps. Zero complexity. Full control.), code:block30 (Connect), code:block31 (Plug into your stack in minutes. 12+ source types,), code:block32 (Detect), code:block33 (Sense finds every PII entity, credential, and sensitive), code:block34 (Control) (+9 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (15): Announcement Badge (pill above headline), code:block3 (⚡ Now live: Segmento Sense 2.0 — AI PII Detection), code:block4 (The complete data intelligence platform.), code:block5 (The AI-native platform that finds, protects, and orchestrate), code:block6 (Get Started  →), code:block7 (Explore Products), code:block8 (GDPR · HIPAA · DPDP Ready  ·  100% Client-Side Processing  ·), code:block9 (┌─────────────────────────────────────────────┐) (+7 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (12): code:block52 (Ready to take control of your data?), code:block53 (Start with one product. Or explore all five.), code:block54 (Get Started  →), code:block55 (Talk to Us), code:block56 (No data leaves your environment · GDPR · HIPAA · DPDP Ready), Heading, Layout, Primary Button (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (11): code:block57 (The complete data intelligence platform.), code:block58 ([GDPR] [HIPAA] [DPDP] [SOC 2] [ISO 27001]), code:block59 (© 2025 Segmento. Built in India 🇮🇳. All rights reserved.), Column: Company, Column: Compliance, Column: Legal, Column: Products, Compliance badges row (bottom of footer) (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.2
Nodes (10): Caption text (small, centered below), code:block10 ([GDPR]  [HIPAA]  [DPDP Act]  [SOC 2]  [ISO 27001]), code:block11 (·), code:block12 ([AWS]  [Snowflake]  [Google Cloud]  [Azure]  [Databricks]  [), code:block13 (Compliance-ready from day one. Connects with your existing s), Layout, Left Side — Compliance Badges (monochromatic icons), Right Side — Ecosystem Logos (grayed out, monochrome) (+2 more)

## Knowledge Gaps
- **151 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+146 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Segmento Main-Site — Upgraded Content Blueprint v2.0` connect `Dev Dependencies` to `Solutions Page`, `Community 16`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `SECTION 6 — PRODUCT SHOWCASE` connect `Solutions Page` to `Dev Dependencies`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `SECTION 3 — FEATURES ("Why Segmento?")` connect `Community 16` to `Dev Dependencies`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _151 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Pages & About` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `TSConfig Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Components & Main Page` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._