# Spec: Article Image Fallback Banner

## Problem Statement

When a reader opens any article card or detail view in Segmento Pulse, and the article has no
image URL or its image URL fails to load (dead link, hotlink block, CDN error), the browser
renders a broken-image icon. This looks unprofessional, is inconsistent with the brand, and
is 100% preventable in the rendering layer.

The backend makes a best-effort attempt to attach an image at ingestion time, but that promise
can never be guaranteed forever: URLs expire, sources move, CDNs fail. The frontend must degrade
gracefully regardless of what the backend provides.

Additionally, two files today carry partial, manual fallback logic (an `onError` src-swap) that
suffers from a flash-of-broken-image risk because the browser must first attempt the broken URL,
paint the error state, then re-render. The same broken logic is duplicated in multiple places
with no shared contract.

## Solution

Extract a single, independently testable shared component — `ArticleImage` — that owns all
image-rendering and fallback logic for article images across the application. Every call site
renders images through this component instead of inline `<img>` tags.

Behavior contract:
- No `src` (undefined, null, empty string) → Article Fallback Banner renders immediately, no
  network request attempted, no broken-image flash.
- `src` present but load fails → Article Fallback Banner swaps in the moment load fails
  (via React state + `onError`, no double-flash because the fallback is always the same asset).
- `src` present and loads → real image renders, identical to today.

The Article Fallback Banner is the canonical branded SVG asset `placeholder-news.svg`
(the Heartbeat Brand Mark on a gradient background), served at `/pulse/placeholder-news.svg`.

## User Stories

1. As a reader browsing article cards, I want missing-image slots to show the branded Pulse
   fallback banner, so that the page looks polished even when articles lack images.
2. As a reader browsing article cards, I want dead image URLs to swap to the fallback banner
   instantly, so that I never see a broken-image icon.
3. As a reader viewing an article detail page, I want the hero image area to show the fallback
   banner if the image is missing or broken, so that the detail layout doesn't collapse or show
   errors.
4. As a reader browsing category pages, I want both the featured article grid and the list rows
   to show the fallback banner for missing images, so that layout proportions are preserved.
5. As a reader on the Articles by Topic section, I want article cards to show the fallback
   banner rather than a broken icon, so that the scrollable card row looks consistent.
6. As a reader on the HeroSection, I want all three image slots (left stacked cards, large
   featured card, center bottom row) to show the fallback banner instead of broken icons.
7. As a developer, I want a single `ArticleImage` component that owns all fallback logic, so
   that fixing a rendering bug or swapping the fallback asset requires one change, not five.
8. As a developer, I want `ArticleImage` to be independently unit-testable at its public
   interface (props in → rendered output), so that fallback behavior is regression-protected
   automatically.
9. As a developer, I want TypeScript to compile with zero errors after every ticket, so that
   CI is never broken by this change.
10. As a developer, I want no new runtime dependencies introduced, so that bundle size is
    unaffected.

## Implementation Decisions

- **New shared component** `ArticleImage` lives in `components/shared/`. It is a named export.
- **Props interface** (decision-critical shape, from prototype):
  ```ts
  interface ArticleImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    loading?: 'lazy' | 'eager';
    fetchPriority?: 'high' | 'low' | 'auto';
  }
  ```
  `src` is intentionally typed `string | null | undefined` — callers pass whatever their field
  holds; the component treats any falsy value as "no image". Named `src` (neutral) so both
  `image_url` and `imgSrc` call sites can map in without prop renaming.
- **Fallback constant** inside the component: `const FALLBACK = "/pulse/placeholder-news.svg"`.
  Not a prop — the Article Fallback Banner is app-wide canonical, not caller-configurable.
- **State**: one boolean `useState` — `failed`. Starts `false`. Flips to `true` in `onError`.
  When `!src || failed`, render fallback `<img src={FALLBACK}>`. When `src && !failed`, render
  real `<img src={src}>` with the same `onError` attached.
- **No flash guarantee**: because the fallback is a local public asset (not another remote URL),
  the `onError` → state update → re-render cycle is a single React flush; no double-broken-icon
  state is painted to the user.
- **`src` change reset**: use `useEffect` with `src` as dependency to reset `failed` to `false`
  whenever the src prop changes (prevents stale failure state across list navigation).
- **Sizing**: `ArticleImage` renders an `<img>` with no size opinions of its own. All
  `className`, `style`, `width`, `height`, `objectFit` etc. come from call-site props, so each
  call site stays pixel-identical to today.
- **Call site mapping**:
  - `ArticleDetailView` passes `article.image_url`
  - `CategoryPage` (both spots) passes `art.imgSrc`
  - `ArticlesByTopic` passes `art.imgSrc`
  - `HeroSection` (all three spots) passes `card.imgSrc` / `centerFeatured.imgSrc`
- **Test runner**: vitest + `@testing-library/react` installed as devDependencies. Tests live
  alongside the component (`components/shared/ArticleImage.test.tsx`).
- **No changes to**: any data-fetching logic, API types, field names, layout, padding, aspect
  ratios, or any file outside the 4 named call sites + the 1 new shared component.

## Testing Decisions

Good tests verify behavior through the public interface — props in, rendered DOM out. They do
not test internal state variable names or implementation structure.

**Seam**: the `ArticleImage` component's rendered output given specific props.

**Test cases (all at the public seam)**:
1. Given `src` is undefined → renders an `<img>` whose `src` equals the fallback path.
2. Given `src` is an empty string → renders fallback (same as above).
3. Given `src` is a valid URL → renders an `<img>` with that URL as `src`.
4. Given `src` is a valid URL and the image fires `onError` → renders fallback.
5. Given `src` changes from a valid URL to a new URL → resets failure state (shows new URL,
   not fallback, assuming new load succeeds).
6. Given `className` prop → the rendered `<img>` carries that class.
7. Given `loading="lazy"` → the rendered `<img>` has `loading="lazy"`.

**Prior art**: no existing tests in this repo — vitest will be bootstrapped from scratch.
Test file: `components/shared/ArticleImage.test.tsx`.

## Out of Scope

- Backend image enrichment pipeline (`image_enricher.py`, background jobs) — untouched.
- Any API field renaming, type unification across `Article` types, or data-layer changes.
- Changing the visual design of the Article Fallback Banner SVG itself.
- Making `ArticleImage` a Next.js `<Image>` component — plain `<img>` is intentional (avoids
  Next.js Image constraints around external domains and fixed dimensions).
- Loading skeletons, shimmer effects, or progressive loading — those are separate features.
- Any file not listed in the 4 call sites + 1 new shared component.

## Further Notes

- `sanitizeArticlePayload` in `newsApi.ts` already pre-fills `imgSrc` and `image_url` with
  `/pulse/placeholder-news.svg` as a data-layer safety net. `ArticleImage` adds a rendering-
  layer safety net on top. Both layers are correct and complementary.
- The SVG is at `public/placeholder-news.svg`, served at `/pulse/placeholder-news.svg`
  (Next.js `publicRuntimeConfig` basePath = `/pulse`). The FALLBACK constant must use the
  full `/pulse/` prefix.
- `placeholder-news.svg` is `400×200`, `viewBox="0 0 400 200"`. It renders correctly at any
  aspect ratio because SVGs scale. No special handling needed.
