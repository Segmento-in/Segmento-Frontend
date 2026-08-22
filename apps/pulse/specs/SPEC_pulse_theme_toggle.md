## Problem Statement

The `ThemeToggle` button in the Segmento Pulse navbar features a different visual design than the `ThemeToggle` button used on the Segmento main-site. This creates visual inconsistency as users navigate between the core marketing site and the Pulse platform.

## Solution

Replicate the exact visual design (DOM structure and Tailwind classes) of the main-site's `ThemeToggle` component into the Pulse `ThemeToggle` component, while preserving Pulse's existing `next-themes` logic.

## User Stories

1. As a user navigating between the Segmento main-site and Pulse, I want the theme toggle button to look and behave visually identically, so that the platform feels cohesive and professional.
2. As a user, I want the toggle to visually indicate the current theme using the familiar sun/moon iconography and sliding ball animation present on the main site.

## Implementation Decisions

- **Target Module:** `apps/pulse/components/shared/ThemeToggle.tsx`
- **Reference Module:** `apps/main-site/app/components/ThemeToggle.tsx`
- **State Management:** Retain the `next-themes` hook (`useTheme`) in the Pulse component to manage theme switching and system preference hydration. Do NOT port the `sessionStorage` manual logic from the main-site.
- **Visuals:** Copy the JSX structure from the main-site. This includes the `w-14 h-7` container, the `w-5 h-5` sliding white ball, and the absolute positioned `Sun` and `Moon` icons from `lucide-react`.
- **Colors:** Use the exact hardcoded Tailwind classes from the main-site (`bg-cyan-500`, `bg-slate-300`, `text-yellow-500`, `text-white`) instead of mapping to local Pulse CSS variables, ensuring a 1:1 visual match.
- **Accessibility:** Retain the dynamic `aria-label` from the existing Pulse implementation to ensure screen readers announce the action correctly.

## Testing Decisions

- **Visual Match:** Ensure the component visually mirrors the main-site component in both light and dark modes.
- **Functionality:** Verify that clicking the toggle still correctly calls `setTheme` and applies the theme to the DOM.

## Out of Scope

- Migrating the main-site to use `next-themes`.
- Changing other aspects of the Pulse navbar.
- Altering any logic related to user preferences outside of visual representation.

## Further Notes

The combination of main-site visuals and Pulse's `next-themes` logic provides the best of both worlds: identical UI with robust, modern Next.js state management.
