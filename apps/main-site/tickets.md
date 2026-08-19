# Tickets: Contact Page 3D Integration

Implementation of the interactive 3D Globe background for the Contact Page using Originkit assets.

## 1. Remove Static Map Asset
**What to build:** Remove the static `Map_of_countries.png` and its associated bento tile from the bottom of the Contact Page to clean up the UI.
**Blocked by:** None — can start immediately.
- [x] Remove `mapImage` import.
- [x] Delete the "Global Presence & World Map" section JSX.

## 2. Inject 3D Stardust & Globe Background
**What to build:** Import and position the `MediaGlobe` and `MediaStardust` components as an absolute background behind the main contact form.
**Blocked by:** Ticket 1
- [x] Import `MediaGlobe` and `MediaStardust` from `@/components/originkit/ui/hero-23/media-globe`.
- [x] Wrap the `pt-24 pb-20` hero section in a relative container.
- [x] Add the 3D elements inside an absolute `inset-0 z-0` container.
- [x] Ensure the main content grid is elevated with `relative z-10`.

## 3. Apply Brand Theme Filtering & Z-Index Polish
**What to build:** Apply CSS filters to the 3D elements to match Segmento's brand cyan/blue in light mode, and verify that the contact form is fully clickable and unobstructed.
**Blocked by:** Ticket 2
- [x] Apply `hue-rotate`, `saturate`, and `contrast` classes for light mode.
- [x] Reset filters for dark mode using `dark:` modifiers.
- [x] Ensure pointer-events are configured correctly so the Globe is interactive but form inputs aren't blocked.
