# Ubiquitous Language

## Core Systems

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Main-Site (Legacy)** | The existing Next.js codebase for the Segmento main website (`apps/main-site`). | Old site, current site |
| **Segmento Website** | The new Next.js codebase being built to replace the legacy main-site (`apps/segmento-website`). | New site, new UI |
| **Data Intelligence Platform** | The collective suite of Segmento products (Pulse, Sense, Collect, Resolve, SprintQL). | The platform, suite |

## Products

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Segmento Pulse** | Tracks global data privacy news and regulatory changes. | Pulse |
| **Segmento Sense** | Explainable AI that detects, classifies, and redact PII. | Sense |
| **Segmento Collect** | Aggregates data from 12+ source types through intelligent pipelines. | Collect |
| **Segmento Resolve** | Turns data requests into structured, trackable tickets. | Resolve |
| **Segmento SprintQL** | Collaborative tool for actionable retrospectives. | SprintQL |

## Example dialogue

> **Dev:** "Are we modifying the **Main-Site (Legacy)** directly for the redesign?"
> **Domain expert:** "No, we are building the **Segmento Website** in a completely new folder. Once it's ready and mirrors the functionality of the **Data Intelligence Platform** products, we will delete the legacy one."
> **Dev:** "Got it. So I'll reference the **Main-Site (Legacy)** for content but write all new code in **Segmento Website**."

## Design & Architecture

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Dual Accent palette** | Segmento's color strategy: Electric Indigo (`#384CD3`) is the sole CTA/action color; Coral (`#E8734A`) is a secondary accent reserved for hero and illustration highlights only, never for CTAs. | Two-tone theme, accent colors |
| **Particle Field Hero** | The Hero section's 3D element: a field of nodes that resolves from scattered to clustered on load/scroll, visualizing "find it → protect it." Replaces the earlier Torus Knot. | 3D background, torus knot |
| **Light-primary / dark-toggle** | The site's theming foundation: light mode is the default rendered state; dark mode is an explicit user-toggled variant, not the default. | Dark-mode-first |


## Flagged ambiguities

- "main-site" was used to refer to both the current codebase and the overall public-facing website concept. We will use **Main-Site (Legacy)** for the old code and **Segmento Website** for the new implementation.
