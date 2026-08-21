# Tickets: Article Image Fallback Banner

Implement graceful image fallback across all article-image render sites in Segmento Pulse.
Source spec: `SPEC_article_image_fallback.md`.

Work the **frontier**: any ticket whose blockers are all done. Tickets 2–5 can start in
parallel once Ticket 1 is done. Clear context between tickets.

---

## Ticket 1 — Build + unit-test `ArticleImage` shared component

**What to build:** A new `components/shared/ArticleImage.tsx` component that is the single
source of truth for rendering article images with Article Fallback Banner support. Install the
test runner, write failing tests first (red), then implement (green). The component must pass
all tests before any call site migration begins.

**Blocked by:** None — can start immediately.

- [ ] Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`,
      and `@vitejs/plugin-react` as devDependencies
- [ ] Add `vitest.config.ts` at pulse root configured for jsdom + React
- [ ] Add test script `"test": "vitest run"` to `package.json`
- [ ] Write `components/shared/ArticleImage.test.tsx` with ALL tests in RED (failing) state:
      - `src` undefined → fallback renders
      - `src` empty string → fallback renders
      - `src` valid URL → real src renders
      - `src` valid URL + `onError` fires → fallback renders
      - `src` changes to new URL → resets failure, shows new src
      - `className` prop → img carries that class
      - `loading` prop → img carries that attribute
- [ ] Implement `components/shared/ArticleImage.tsx` (minimum code to turn all tests GREEN)
- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [ ] All 7 tests pass (`npm test`)

---

## Ticket 2 — Migrate `ArticleDetailView.tsx` to `ArticleImage`

**What to build:** Replace the single inline `<img>` in the article detail hero area with
`<ArticleImage>`. The existing `onError` src-swap is removed; the shared component handles
fallback. Visual output for working images must be pixel-identical to today.

**Blocked by:** Ticket 1.

- [ ] Import `ArticleImage` in `ArticleDetailView.tsx`
- [ ] Replace the `<img src={article.image_url} … onError={…} />` with
      `<ArticleImage src={article.image_url} … />` preserving all className/style props
- [ ] Remove the old `onError` handler (no longer needed)
- [ ] Verify: working `image_url` → real image renders (unchanged)
- [ ] Verify: undefined/empty `image_url` → Article Fallback Banner shows immediately
- [ ] Verify: dead `image_url` → Article Fallback Banner swaps in on load failure
- [ ] TypeScript compiles with zero errors
- [ ] All existing tests still pass

---

## Ticket 3 — Migrate `CategoryPage.tsx` to `ArticleImage` (2 spots)

**What to build:** Replace both inline `<img>` tags in `CategoryPageTemplate` — the featured
article grid and the list article rows — with `<ArticleImage>`. Neither spot has any fallback
today; this ticket adds net-new graceful degradation for both.

**Blocked by:** Ticket 1.

- [ ] Import `ArticleImage` in `CategoryPage.tsx`
- [ ] Replace featured-grid `<img src={art.imgSrc} … />` with `<ArticleImage src={art.imgSrc} … />`
- [ ] Replace list-row `<img src={art.imgSrc} … />` with `<ArticleImage src={art.imgSrc} … />`
- [ ] Preserve each spot's existing `style={{ width, height, objectFit }}` on the new component
- [ ] Verify: working `imgSrc` → real image renders (unchanged)
- [ ] Verify: undefined/empty `imgSrc` → Article Fallback Banner shows immediately (both spots)
- [ ] Verify: dead `imgSrc` → Article Fallback Banner swaps in on load failure (both spots)
- [ ] TypeScript compiles with zero errors
- [ ] All existing tests still pass

---

## Ticket 4 — Migrate `ArticlesByTopic.tsx` to `ArticleImage` (1 spot)

**What to build:** Replace the single inline `<img>` in the scrollable topic card grid with
`<ArticleImage>`. No fallback exists here today; this ticket adds net-new graceful degradation.

**Blocked by:** Ticket 1.

- [ ] Import `ArticleImage` in `ArticlesByTopic.tsx`
- [ ] Replace `<img src={art.imgSrc} … />` with `<ArticleImage src={art.imgSrc} … />`
- [ ] Preserve existing `className="w-[80%] h-[80%] object-contain"` on the new component
- [ ] Verify: working `imgSrc` → real image renders (unchanged)
- [ ] Verify: undefined/empty `imgSrc` → Article Fallback Banner shows immediately
- [ ] Verify: dead `imgSrc` → Article Fallback Banner swaps in on load failure
- [ ] TypeScript compiles with zero errors
- [ ] All existing tests still pass

---

## Ticket 5 — Migrate `HeroSection.tsx` to `ArticleImage` (3 spots)

**What to build:** Replace all three inline `<img>` tags in `HeroSection` — left stacked cards,
large center featured card, center bottom row cards — with `<ArticleImage>`. The existing
`onError` src-swaps are removed and superseded by the shared component. Behavior must be
equal-or-better (no flash vs. the current flash-risk pattern).

**Blocked by:** Ticket 1.

- [ ] Import `ArticleImage` in `HeroSection.tsx`
- [ ] Replace left-cards `<img src={card.imgSrc || fallback} onError={…} />` with
      `<ArticleImage src={card.imgSrc} … />` — no more manual `|| fallback` or `onError`
- [ ] Replace center-featured `<img src={…imgSrc || fallback} onError={…} />` with
      `<ArticleImage src={centerFeatured.imgSrc} … />`
- [ ] Replace center-bottom `<img src={…imgSrc || fallback} onError={…} />` with
      `<ArticleImage src={card.imgSrc} … />`
- [ ] Remove all three old `onError` handlers and `|| fallback` inline ternaries
- [ ] Preserve each spot's existing `className` and `loading`/`fetchPriority` props
- [ ] Verify: working `imgSrc` → real image renders (unchanged)
- [ ] Verify: undefined/empty `imgSrc` → Article Fallback Banner shows immediately, no flash
- [ ] Verify: dead `imgSrc` → Article Fallback Banner swaps in on load failure, no double-flash
- [ ] TypeScript compiles with zero errors
- [ ] All existing tests still pass
