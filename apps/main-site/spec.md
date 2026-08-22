## Problem Statement

The user wants to elevate the visual aesthetic of the Segmento Contact Page by incorporating the vibrant, multi-color palette found in the Segmento logo (and used in the main-site Hero section). Currently, the Contact Page utilizes a static, single fixed blue (`#354E87`). The design feels rigid compared to the dynamic, cinematic motion of the Hero page. The objective is to bring "high-end-visual-design" and "impeccable" frontend aesthetics to the page by cycling through the brand colors smoothly.

## Solution

We will extract the color-cycling logic used in the Hero page into a reusable React hook (`useBrandColorCycle`) to maintain DRY engineering standards. This hook will then be integrated into the Contact page to dynamically animate:
1. The `MediaGlobe` points and markers.
2. An ambient, subtle radial-gradient background wash behind the glassmorphism form.
3. A sleek, animated linear-gradient for the "Contact Segmento" header text.

All motion will adhere to strict, premium `cubic-bezier` timing functions to ensure liquid, haptic transitions rather than generic linear fading.

## User Stories

1. As a visitor, I want to see the "Contact Segmento" header text shift colors smoothly, so that the page feels alive, premium, and visually tied to the rest of the brand.
2. As a visitor, I want the 3D globe to softly transition its glow to match the header, ensuring visual cohesion across the components.
3. As a visitor, I want to experience a high-end, subtle background ambient wash that reacts to the color cycle, ensuring the page does not feel like a sterile white/grey box.
4. As an engineer, I want the color cycling logic to be abstracted into a hook, so that multiple pages can use it without duplicating `setInterval` code and product definitions.

## Implementation Decisions

- **Modules Built/Modified:**
  - `lib/hooks/useBrandColorCycle.ts` (NEW): Will encapsulate the 4000ms cycling logic and the exact hex codes used in the brand palette (`#00c6ff`, `#ff8a00`, `#00d2b4`, `#0072ff`, `#ff2a85`).
  - `app/contact/page.tsx` (MODIFIED): Will consume `useBrandColorCycle` and apply the active color to the DOM elements via inline styles with `transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)'`.
- **Architectural Decisions:** 
  - To prevent layout thrashing and maintain 60fps GPU performance, the background ambient wash will use a `pointer-events-none` absolute div with CSS `background` transitions. We will not use React state to drive continuous scroll values; we are only using it for discrete 4000ms interval ticks.
  - The text gradient will use `background-image: linear-gradient` mapped to the active color, clipped to the text using `WebkitBackgroundClip: 'text'`.

## Testing Decisions

- Ensure the `useBrandColorCycle` hook correctly increments and resets its index.
- Verify that the `MediaGlobe` component does not unmount or aggressively re-render the entire WebGL canvas when receiving a new color prop (it should gracefully accept the prop update).
- Verify accessibility (WCAG AA): The text gradient must maintain sufficient contrast against the `bg-[#F2F4F8]` and dark mode backgrounds.

## Out of Scope

- Refactoring the actual `Hero.tsx` component to use the new hook (we will only build the hook and apply it to the Contact page to ensure a tight, vertically sliced feature. Hero refactoring can happen in a later cleanup ticket).
- Adding complex scroll-driven physics to the Contact page.

## Further Notes

All styling must adhere to the `high-end-visual-design` principles: no raw `#000000` shadows, massive breathing room (whitespace), and Double-Bezel nested architecture where applicable.
