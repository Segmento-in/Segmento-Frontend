---
name: Segmento High-Performance UI
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
  surface-tint: '#3b4ed6'
  primary: '#384cd3'
  on-primary: '#ffffff'
  primary-container: '#5366ed'
  on-primary-container: '#fffbff'
  inverse-primary: '#bcc2ff'
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
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bcc2ff'
  on-primary-fixed: '#000c61'
  on-primary-fixed-variant: '#1c32be'
  secondary-fixed: '#c1e8ff'
  secondary-fixed-dim: '#92ceef'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d67'
  tertiary-fixed: '#e2e6be'
  tertiary-fixed-dim: '#c6caa3'
  on-tertiary-fixed: '#1a1d05'
  on-tertiary-fixed-variant: '#45492c'
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

This design system is engineered for a technical B2B environment where clarity, speed, and precision are paramount. The aesthetic is rooted in **Brutalist Minimalism**—a style that prioritizes functional honesty and structural integrity without the clutter of traditional enterprise software.

The brand personality is "The Sophisticated Architect": authoritative, secure, and unapologetically technical. It avoids soft gradients and decorative fluff in favor of high-contrast layouts, rigorous grid alignment, and "AI-native" affordances that suggest a platform capable of handling complex data processing with ease. The visual language uses sharp typographic hierarchy and a restrained palette to evoke a sense of high-end engineering.

## Colors

The color strategy relies on a "High-Contrast Light" foundation. 
- **Primary Canvas:** Pure white (#FFFFFF) is used for main content areas to maximize legibility. A very light gray (#F7F9FB) provides subtle structural differentiation for sidebars, gutters, and secondary background layers.
- **Action & Identity:** Electric Indigo (#5B6EF5) serves as the primary driver for call-to-actions and active states, providing a vibrant, high-energy contrast against the monochrome base.
- **Accents:** Secondary colors (#A0DCFD and #D1D5AE) are used sparingly for data visualization, status indicators, or subtle tag backgrounds, adding a technical "instrument panel" feel.
- **Typography:** Deep Charcoal (#0A0A0F) is the exclusive color for headings and primary body text, ensuring AAA accessibility and a premium, ink-on-paper feel.

## Typography

The typographic system creates a tension between expressive headlines and utilitarian data.
- **Headlines:** Syne is utilized for its wide, geometric architecture. Use heavy weights (700-800) and tight tracking for display elements to ground the brutalist vibe.
- **Body:** Mona Sans (100% weight variant) provides a modern, highly legible grotesk feel for all long-form descriptions and UI labels.
- **Technical/Data:** DM Mono is reserved for system outputs, code snippets, timestamps, and metadata. This font transition signals to the user when they are interacting with raw "machine" data versus "human" narrative.

## Layout & Spacing

The design system employs a **Fixed-Fluid Bento Grid** model. 
- **The Bento Structure:** Large dashboard views should be broken into distinct rectangular containers (tiles) that snap to a 12-column grid. 
- **Gutters:** A consistent 24px gutter creates "breathing room" between high-density data tiles.
- **Rhythm:** Spacing follows a 4px baseline, but internal card padding should strictly adhere to 24px (Desktop) or 16px (Mobile) to maintain a professional, airy feel.
- **Responsiveness:** On mobile, bento tiles stack vertically. Large Syne headlines should scale down using the mobile-specific tokens to prevent awkward line breaks.

## Elevation & Depth

To maintain the brutalist minimalist aesthetic, this system rejects heavy drop shadows and faux-3D effects.
- **Borders over Shadows:** Physical separation is primarily achieved through 1px solid borders (#E2E8F0).
- **Subtle Depth:** A single, extremely soft shadow layer (0px 4px 20px rgba(0,0,0, 0.04)) may be applied to the primary "Bento Tiles" to lift them slightly off the #F7F9FB background.
- **Active State:** Elements that are being hovered or dragged should see their border color darken to #0A0A0F or their border width increase, rather than gaining a larger shadow.
- **Layering:** Modals and dropdowns use a crisp #FFFFFF background with a slightly more pronounced border and no backdrop blur, keeping the UI feeling "flat and fast."

## Shapes

The shape language is a deliberate mix of geometric precision and modern approachability:
- **Bento Tiles:** Use a 12px radius to define the primary containers of the interface. This creates a soft, modern frame for technical data.
- **Inner Cards:** Elements nested within bento tiles use a tighter 8px radius to maintain visual nesting logic.
- **Buttons & Chips:** All interactive action elements (buttons, toggles, tags) are **pill-shaped** (fully rounded). This high contrast between the rectangular grid and the circular buttons makes interactive zones instantly recognizable.

## Components

- **Buttons:** Primary buttons are pill-shaped, filled with Electric Indigo (#5B6EF5), and use white Mona Sans bold text. Secondary buttons use a 1px border of #E2E8F0 with Charcoal text.
- **Bento Tiles:** Each tile must have a subtle #E2E8F0 border. The header of a tile should use Syne (Small) for the title and DM Mono for the subtitle or metric.
- **Input Fields:** Rectangular with an 8px radius. Use a #F7F9FB fill and #E2E8F0 border. On focus, the border shifts to #5B6EF5.
- **Data Tables:** Row-based with no vertical borders. Use DM Mono for cell data and Syne (X-Small) for column headers in all-caps.
- **Chips/Status Tags:** Small pill-shaped containers with low-saturation backgrounds (using #A0DCFD or #D1D5AE at 20% opacity) and high-contrast text.
- **AI-Native Elements:** Features driven by AI should be highlighted with a subtle 1px gradient border using Primary and Secondary brand colors, signaling an "active intelligence" layer.