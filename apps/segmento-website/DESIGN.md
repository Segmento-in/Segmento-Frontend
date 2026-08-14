---
name: Segmento High-Performance UI (Website)
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd9e0'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2fa'
  surface-container: '#f0ecf4'
  surface-container-high: '#eae7ee'
  surface-container-highest: '#e4e1e9'
  on-surface: '#1b1b20'
  on-surface-variant: '#454654'
  inverse-surface: '#303036'
  inverse-on-surface: '#f3eff7'
  outline: '#757686'
  outline-variant: '#c5c5d7'
  surface-tint: '#384cd3'
  primary: '#384cd3'
  on-primary: '#ffffff'
  primary-container: '#5366ed'
  on-primary-container: '#fffbff'
  inverse-primary: '#bcc2ff'
  coral: '#E8734A'
  on-coral: '#ffffff'
  secondary-sky: '#e0f0fa'
  on-secondary-sky: '#1a3d52'
  secondary-sage: '#e2e8e0'
  on-secondary-sage: '#2c3b28'
  secondary-peach: '#faece8'
  on-secondary-peach: '#5c2d20'
  secondary-teal: '#dcf2f0'
  on-secondary-teal: '#1f4d4a'
  secondary: '#236582'
  on-secondary: '#ffffff'
  secondary-container: '#a0dcfd'
  on-secondary-container: '#1f627f'
  tertiary: '#5a5f3f'
  on-tertiary: '#ffffff'
  tertiary-container: '#737756'
  on-tertiary-container: '#fdffde'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  background: '#fcf8ff'
  on-background: '#1b1b20'
  surface-variant: '#e4e1e9'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Mona Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Mona Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  technical-data:
    fontFamily: DM Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  label-caps:
    fontFamily: DM Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
---

## Brand & Style

This design system is engineered for a technical B2B environment where clarity, speed, and precision are paramount. The aesthetic is rooted in **Soft Structuralism**—a style that prioritizes functional honesty and structural integrity but utilizes soft, rounded geometry, glassmorphism, and "Awwwards-tier" visual aesthetic over strict brutalism.

The brand personality is "The Sophisticated Architect": authoritative, secure, and unapologetically technical, yet highly polished and approachable.

## Colors

The color strategy relies on a "High-Contrast Light" foundation with a **Dual Accent Palette**.
- **Primary Canvas:** Off-white (#FCF8FF) is used for main content areas to maximize legibility without harsh glare.
- **Action & Identity:** Electric Indigo (#384CD3) serves as the primary driver for call-to-actions and active states. It is the ONLY CTA color.
- **Highlight Accent:** Coral (#E8734A) is a secondary accent explicitly reserved for hero sections and illustration highlights. It is NEVER used on a CTA.
- **Supporting Palette:** Soft, low-saturation tones like Sky, Sage, Peach, and Teal are used for tags, backgrounds, and bento accents.
- **Typography/Ink:** Near-black (#1B1B20) is the exclusive color for headings and primary body text.

## Typography

The typographic system creates a tension between expressive headlines and utilitarian data.
- **Headlines:** Syne is utilized for display elements (700-800 weight) to ground the aesthetic.
- **Body:** Mona Sans provides a modern, highly legible grotesk feel for all long-form descriptions and UI labels.
- **Technical/Data:** DM Mono is reserved for system outputs, code snippets, timestamps, and metadata.

## Layout & Spacing

The design system employs a **Fixed-Fluid Bento Grid** model.
- **The Bento Structure:** Views should be broken into distinct rectangular containers (tiles).
- **Rhythm:** Internal card padding should strictly adhere to 24px (Desktop) or 16px (Mobile).
- **Responsiveness:** On mobile, bento tiles stack vertically. Large Syne headlines should scale down to prevent awkward line breaks.

## Elevation & Depth

To maintain the high-end aesthetic:
- **Soft Shadows & Glass:** Physical separation is achieved through extremely soft shadow layers and glassmorphism (translucency + background blur).
- **Layering:** Crisp #FCF8FF backgrounds with slightly more pronounced borders and blur for nested UI components.

## Shapes

- **Bento Tiles:** Use soft corners (e.g. 1rem / 1.5rem) to define the primary containers of the interface. This creates a modern frame for technical data.
- **Inner Cards:** Nested elements use tighter radii to maintain visual nesting logic.
- **Buttons & Chips:** All interactive action elements (buttons, toggles, tags) are **pill-shaped** (fully rounded).

## Components

- **Buttons:** Primary buttons are pill-shaped, filled with Electric Indigo (#384CD3), and use white Mona Sans text.
- **Bento Tiles:** Each tile has a subtle border. Headers use Syne.
- **Chips/Status Tags:** Small pill-shaped containers with low-saturation supporting colors (Sky, Sage, Peach, Teal) and high-contrast text.
