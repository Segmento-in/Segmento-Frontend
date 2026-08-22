# Tickets: Dynamic Logo Colors Integration

Integration of the dynamic, cycling brand colors into the Contact Page to match the high-end visual aesthetics of the Hero section.

## 1. Create `useBrandColorCycle` Hook
**What to build:** A reusable React hook in `lib/hooks/useBrandColorCycle.ts` that provides the active brand color and index, cycling every 4000ms.
**Blocked by:** None — can start immediately.
- [x] Define the 5 brand hex codes (`#00c6ff`, `#ff8a00`, `#00d2b4`, `#0072ff`, `#ff2a85`).
- [x] Implement a `setInterval` that cycles the index safely.
- [x] Return `{ activeColor, activeIndex }`.

## 2. Apply Dynamic Colors to Contact Page
**What to build:** Update `app/contact/page.tsx` to consume the hook and apply the active color to the header text, a background ambient wash, and the `MediaGlobe` component using premium `cubic-bezier` transitions.
**Blocked by:** Ticket 1.
- [x] Import and call `useBrandColorCycle()` in the Contact page.
- [x] Replace the static `#354E87` globe color with `activeColor`.
- [x] Apply a `linear-gradient` to the "Contact Segmento" `<h1>` that transitions smoothly.
- [x] Inject an absolute `pointer-events-none` ambient wash using `radial-gradient` that tracks the `activeColor`, matching the "Soft Structuralism" design aesthetic.
