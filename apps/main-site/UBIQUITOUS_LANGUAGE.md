# Ubiquitous Language — Segmento Main-Site

> This file is the canonical glossary for the main-site frontend codebase.
> All contributors must use these exact terms in code, comments, and discussions.
> Update this file at the end of every task that introduces new canonical terms.

---

## Navigation

| Term | Definition |
|------|------------|
| **Navbar** | The fixed, top-level navigation bar shared across every page via `layout.tsx`. Single shared component — never duplicated per-page. |
| **Mega-menu** | The full-width dropdown panel that appears when hovering a top-level nav item (e.g., "Products"). Contains sections and an optional featured card. |
| **Mega-menu column** | One vertical grouping within the mega-menu panel. Each column has a header label and a list of items. Rendered by mapping over the `sections[]` array in `navLinks`. |
| **Products mega-menu** | The specific mega-menu under the "Products" nav trigger. Contains 3 content columns + 1 featured banner card (4 visual regions total). |
| **Data Intelligence column** | The first mega-menu column under Products. Contains: Data Discovery And Classification, Segmento Collect. |
| **Workflow Tools column** | The second mega-menu column under Products. Contains: Segmento Resolve, Segmento SprintQL. |
| **News and Updates column** | The third mega-menu column under Products (introduced Task 1). Contains Segmento Pulse as its sole item. Positioned between Workflow Tools and the What's New banner card. |
| **What's New banner card** | The featured card on the far right of the Products mega-menu. Rendered by the `FeaturedCard` component. Currently promotes Segmento Pulse with a brand-primary indigo gradient. |
| **Featured card** | Generic term for the `MegaFeatured` data structure + `FeaturedCard` React component. Appears as a visual highlight tile on the right side of any mega-menu panel that has a `featured` property. |
| **MegaSection** | TypeScript interface representing one mega-menu column (`label` + `items[]`). |
| **MegaItem** | TypeScript interface representing one row inside a mega-menu column (`name`, `subtitle`, `href`, `icon`). |

---

## Products

| Term | Definition |
|------|------------|
| **Segmento Pulse** | Real-time data privacy news tracking product. Nav icon: `Newspaper` (lucide-react). Href: `/pulse`. Canonical subtitle: "Real-time news". Lives in the **News and Updates** column as of Task 1. |
| **Data Discovery And Classification** | AI-enabled data classification product (Segmento Sense). Nav icon: `Shield`. Href: `/sense`. Lives in the **Data Intelligence** column. |
| **Segmento Collect** | AI-powered data collection platform. Nav icon: `Database`. Href: `/collect`. Lives in the **Data Intelligence** column. |
| **Segmento Resolve** | Data request & ticket management product. Nav icon: `Ticket`. Href: `/resolve`. Lives in the **Workflow Tools** column. |
| **Segmento SprintQL** | Collaborative retrospective management product. Nav icon: `Users`. Href: `/sprintql`. Lives in the **Workflow Tools** column. |

---

## Design Tokens (Nav-specific)

| Term | Definition |
|------|------------|
| **Electric Indigo** | Primary brand color. `primary: #384cd3` / `surface-tint: #3b4ed6` per `DESIGN.md`. Used for the What's New banner gradient and brand CTAs. Do NOT modify in `DESIGN.md`. |
| **`--mega-bg`** | CSS variable for mega-menu panel background. |
| **`--mega-border`** | CSS variable for mega-menu panel border color. |
| **`--mega-label`** | CSS variable for column header label color (small uppercase text). |
| **`--mega-title`** | CSS variable for item name / featured card title color. |
| **`--mega-subtitle`** | CSS variable for item subtitle color. |
| **`--mega-icon-color`** | CSS variable for icon color inside item rows. |
| **Dark-mode surface tint** | The navy-blue color cast applied to all dark-mode background layers (`--theme-bg`, `--theme-bg-surface`, `--theme-bg-surface-high`). Values live in `[data-theme="dark"]` block in `globals.css`. Do NOT use neutral black/grey as dark backgrounds — always use the navy family (`#080d1a` canvas, `#0d1225` surface, `#141930` inner card). |
| **`--theme-bg`** | The base page canvas background CSS variable. Dark: `#080d1a` (deep navy). Source of truth: `app/globals.css` `[data-theme="dark"]` block. |
| **`--theme-bg-surface`** | Bento tile / card background variable. Dark: `#0d1225`. |
| **`--theme-bg-surface-high`** | Nested inner card background variable. Dark: `#141930`. |

---

## Theming Architecture

| Term | Definition |
|------|------------|
| **Theming mechanism** | Custom, NOT `next-themes`. `layout.tsx` sets `data-theme="dark"` on `<html>` as server default. `ThemeToggle.tsx` reads/writes `document.documentElement.dataset.theme` + persists to `sessionStorage`. |
| **`[data-theme="dark"]`** | The CSS selector block in `globals.css` that owns all dark-mode CSS custom property values. Single source of truth for the dark palette — do not scatter dark colors inline in components. |
| **`[data-theme="light"]`** | The CSS selector block in `globals.css` that owns all light-mode CSS custom property values. Derived from `DESIGN.md` frontmatter. Do not modify without updating `DESIGN.md` first. |
| **Hybrid B+C architecture** | The dark-mode implementation strategy: (B) `@theme inline` proxies pointing to `[data-theme]` vars for Tailwind utility classes, + (C) `@custom-variant dark` escape hatch for structural `dark:` prefixes. Background/surface colors should always use (B). |
| **`isExternal: true`** | Flag on a `MegaItem` that causes the render to use `<a target="_blank" rel="noopener noreferrer">` instead of `<Link>`. Set on all 5 product nav items so product pages open in a new tab. Do NOT set on Solutions or Resources items. |
| **`newTab: true`** | Flag on a footer link object in `footerLinks[]` in `Footer.tsx`. Causes a conditional `target="_blank" rel="noopener noreferrer"` spread on the shared `<Link>` renderer. Set only on Products column links. |
