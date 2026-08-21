# Segmento Pulse — Ubiquitous Language

This file defines the canonical shared vocabulary for the Segmento Pulse frontend codebase.
All engineers, agents, and reviewers use these exact terms in code, comments, specs, tickets,
and commit messages. When a term here conflicts with an alias listed below, the canonical term wins.

---

## Pulse News & Media

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Heartbeat Brand Mark** | The canonical ECG waveform SVG asset representing real-time telemetry and pulse of tech intelligence. Used as the standalone brand icon and animated fallback visual. | Heartbeat icon, ECG line, Pulse waveform |
| **Article Fallback Banner** | The canonical branded vector SVG (`placeholder-news.svg`) rendering the Pulse Heartbeat mark across all article cards and detail views whenever an external article image URL is missing or fails to load. | Image placeholder, placeholder banner, missing image box |

---

## Mobile Navigation

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Nested Category Drill-Down** | The two-tier collapsible accordion within the mobile navigation drawer that groups product offerings under expandable category rows (e.g., Data Intelligence, Workflow Tools, News and Updates) with single-open state management. | Mobile subcategories, subsection draw down, product subnav |
| **Category Row Indicator** | The rotatable chevron token (`ChevronDown`) indicating the expanded/collapsed state of a nested product subcategory in mobile view. | Submenu arrow, toggle caret |

---

## Article Rendering

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **ArticleImage** | The canonical shared React component (`components/shared/ArticleImage.tsx`) responsible for rendering all article images across the application. Accepts a neutral `src` prop (mapped from either `image_url` or `imgSrc` at each call site), shows the Article Fallback Banner immediately when `src` is missing or empty, and swaps to the Article Fallback Banner on load failure (`onError`) with no flash of a broken-image icon. No call site should render an article image via an inline `<img>` tag — all image rendering goes through `ArticleImage`. | Inline img tag, article img, fallback image component |

---

## Newsletter Acquisition

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Persuade Banner** | The `NewsletterCTA.tsx` component rendered on the homepage. Designed for maximum conversion using high-fidelity motion, gradients, and persuasive copy (Persuade mode). Not to be confused with the quiet "Subscribe" button in the NavBar. | NewsletterCTA, Signup Banner |
| **Global Newsletter Hub Overlay** | The modal overlay containing `NewsletterHub.tsx`, triggered by either the Persuade Banner or the NavBar's quiet Subscribe button. Displays `NewsletterCard`s for frequency selection. | Hub Modal, Signup Overlay |
