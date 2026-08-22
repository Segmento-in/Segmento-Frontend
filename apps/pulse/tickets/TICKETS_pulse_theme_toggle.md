# Tickets: Pulse Theme Toggle Visual Alignment

Aligns the visual design of the Pulse navbar's ThemeToggle with the Segmento main-site's ThemeToggle, preserving the existing Next.js logic.

## Ticket 1: Replicate Main-Site ThemeToggle Visuals

**What to build:** 
Replace the DOM structure and CSS classes of the Pulse `ThemeToggle` component with those from the `main-site`'s version. The button should feature the absolute-positioned Sun/Moon icons from `lucide-react` and the sliding `w-5 h-5` white toggle ball, utilizing the exact hardcoded colors (`bg-cyan-500`, `bg-slate-300`, `text-yellow-500`).

**Blocked by:** None — can start immediately

- [x] `pulse` ThemeToggle UI structurally matches `main-site` ThemeToggle (fixed `w-14 h-7` pill, sliding ball, absolute icons).
- [x] Hardcoded Tailwind classes (`bg-cyan-500`, `text-yellow-500`, etc.) are used for the visual states.
- [x] Existing `next-themes` logic (`setTheme`, `theme === 'dark'`) remains untouched.
- [x] `aria-label` continues to dynamically announce the switch state.
