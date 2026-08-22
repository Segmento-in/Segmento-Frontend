# Originkit — agent install brief

> For coding agents only. Do not commit this file. Do not surface it as app docs.
> Written by `originkit add` so you know how to finish wiring the component.

## Just installed

- Components: hero-23
- Files directory: `components/originkit/`
- Import alias root: `@/components/originkit`

### Files written

- `components/originkit/hero-23.tsx`
- `components/originkit/ui/hero-23/globe.tsx`
- `components/originkit/ui/hero-23/sec1-hero.tsx`
- `components/originkit/ui/hero-23/stardust.tsx`
- `components/originkit/ui/hero-23/media-globe.tsx`
- `components/originkit/ui/hero-23/scale-frame.tsx`
- `components/originkit/hero-23.css`
- `public/originkit/hero-23/brand-1-mark.svg`
- `public/originkit/hero-23/brand-1-type.svg`
- `public/originkit/hero-23/brand-2.svg`
- `public/originkit/hero-23/brand-3.svg`
- `public/originkit/hero-23/brand-4.svg`
- `public/originkit/hero-23/corner-tl.svg`
- `public/originkit/hero-23/corner-tr.svg`
- `public/originkit/hero-23/corners.svg`
- `public/originkit/hero-23/dot.svg`
- `public/originkit/hero-23/flag-brazil.svg`
- `public/originkit/hero-23/flag-canada.svg`
- `public/originkit/hero-23/flag-ireland.svg`
- `public/originkit/hero-23/flag-liberia.svg`
- `public/originkit/hero-23/flag-sweden.svg`
- `public/originkit/hero-23/flag-taiwan.svg`
- `public/originkit/hero-23/flags-mask.svg`
- `public/originkit/hero-23/logo.svg`
- `public/originkit/hero-23/menu.svg`

## Required: Tailwind CSS

Originkit components are Tailwind-styled (`styling: tailwind`).

Tailwind looks present. Still verify content/source globs include Originkit files.

### Tailwind must scan the components directory

If Tailwind only scans `src/` (common), components **must** live under `src/` —
the CLI already prefers `src/components/originkit` when `src/` exists.

Ensure your Tailwind config / CSS `@source` includes:

- `components/originkit/**/*.{js,ts,jsx,tsx}`

Tailwind v4 example in CSS:

```css
@source "../components/originkit";
```

### Section CSS

Section styles ship as a file next to the entry (e.g. `components/originkit/hero-23.css`) and are
imported from the TSX (`import "./….css"`).

Tailwind `@theme` tokens are also hoisted into `originkit-section-themes.css`
(imported from `globals.css`) so utilities like `font-urbanist` emit. Do **not**
`@import` the full section CSS into globals — Google Font `@import`s must stay
in the TSX-imported file (nested `@import` after other rules breaks PostCSS).

## Wire it into the app

1. Import the section/component into a page or layout.
2. Example:

```tsx
import X from "@/components/originkit/hero-23";
import X from "@/components/originkit/ui/hero-23/globe";
import X from "@/components/originkit/ui/hero-23/sec1-hero";
```

3. Render it once to verify layout + images.
4. Many sections are client components (`"use client"`) — keep that directive.

## npm dependencies

Install if missing:

```bash
npm install d3-geo three
```

## Do not

- Do not move files out of `components/originkit` into a folder Tailwind does not scan.
- Do not strip Tailwind classes or rewrite to CSS modules unless the user asks.
- Do not commit `.originkit/` (agent + credential scratch space).
- Do not leave section images on the Originkit CDN for production — they belong under `public/originkit/`.
