/** @type {import('tailwindcss').Config} */

/**
 * pulse-ui-2 Tailwind Configuration
 * 
 * This config is the Tailwind layer of the Design Token Engine.
 * The authoritative source-of-truth is app/globals.css (CSS custom properties).
 * This config maps those properties into Tailwind utility classes, enabling
 * usage of both `var(--pulse-color-bg-canvas)` and `bg-canvas` for DRY consistency.
 *
 * All values are derived directly from PRD-1: Phase 1 — Design Tokens.
 * PRD source references are cited inline.
 */
module.exports = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],

    theme: {
        // ===========================================================
        // BREAKPOINTS — Mobile First (PRD §Phase 1.3: 24px mobile padding → 48px desktop)
        // ===========================================================
        screens: {
            sm: "640px",   // Small tablet / large phone
            md: "768px",   // Tablet
            lg: "1024px",  // Laptop
            xl: "1280px",  // Desktop — matches PRD container max-width of 1280px
            "2xl": "1536px",
        },

        // ===========================================================
        // CONTAINER — PRD §Phase 1.3: Max 1280px, 24px mobile / 48px desktop padding
        // ===========================================================
        container: {
            center: true,
            padding: {
                DEFAULT: "24px",    // PRD: "24px padding on mobile"
                lg: "48px",    // PRD: "48px on desktop"
            },
            screens: {
                xl: "1280px",       // PRD: "Container Max-Width: 1280px"
            },
        },

        extend: {
            // ===========================================================
            // COLORS — PRD §Phase 1.1: Chromatic Architecture
            // Maps CSS custom properties to Tailwind utilities
            // ===========================================================
            colors: {
                // bg-canvas        → bg-canvas
                canvas: "var(--pulse-color-bg-canvas)",
                // bg-surface-dark  → bg-surface-dark
                "surface-dark": "var(--pulse-color-bg-surface-dark)",
                // bg-surface-tint  → bg-surface-tint
                "surface-tint": "var(--pulse-color-bg-surface-tint)",
                // text-primary     → text-primary / bg-primary
                primary: "var(--pulse-color-text-primary)",
                // text-secondary   → text-secondary
                secondary: "var(--pulse-color-text-secondary)",
                // text-inverse     → text-inverse
                inverse: "var(--pulse-color-text-inverse)",
                // border-subtle    → border-subtle
                "border-subtle": "var(--pulse-color-border-subtle)",
                // brand-accent     → bg-accent / text-accent
                accent: "var(--pulse-color-brand-accent)",
            },

            // ===========================================================
            // FONT FAMILIES — PRD §Phase 1.2: "System UI / Inter"
            // ===========================================================
            fontFamily: {
                // Loaded via next/font/google in layout.tsx, injected as --font-inter CSS var
                sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
            },

            // ===========================================================
            // FONT SIZES — PRD §Phase 1.2: Typographic Scale
            // Format: [fontSize, { lineHeight, fontWeight, letterSpacing }]
            // ===========================================================
            fontSize: {
                // PRD: Display (H1): 56px / LH: 1.1 / W: 800 / Track: -0.02em
                "pulse-display": ["56px", { lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.02em" }],
                // PRD: Heading Large (H2): 40px / LH: 1.2 / W: 700 / Track: -0.01em
                "pulse-h2": ["40px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }],
                // PRD: Heading Medium (H3): 24px / LH: 1.3 / W: 600
                "pulse-h3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
                // PRD: Heading Small (H4): 18px / LH: 1.4 / W: 600
                "pulse-h4": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
                // PRD: Body Base: 16px / LH: 1.5 / W: 400
                "pulse-body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
                // PRD: Meta / Small: 14px / LH: 1.5 / W: 500
                "pulse-meta": ["14px", { lineHeight: "1.5", fontWeight: "500" }],
                // PRD: Label: 12px / LH: 1.0 / W: 600 / Uppercase
                "pulse-label": ["12px", { lineHeight: "1.0", fontWeight: "600" }],
            },

            // ===========================================================
            // BORDER RADIUS — PRD §Phase 1.3: Standard 8px / Pill 9999px
            // ===========================================================
            borderRadius: {
                // PRD: "Standard Border Radius: 8px (Cards, images)"
                card: "8px",
                // PRD: "Pill Border Radius: 9999px (Badges, primary buttons)"
                pill: "9999px",
            },

            // ===========================================================
            // SPACING — PRD §Phase 1.3: "Base Unit: 8px"
            // Extends default scale. pulse-unit = 8px, then multiples of 8.
            // ===========================================================
            spacing: {
                "pulse-1": "8px",    // 1 base unit
                "pulse-2": "16px",   // 2 base units
                "pulse-3": "24px",   // 3 base units — used in container mobile padding
                "pulse-4": "32px",   // 4 base units
                "pulse-5": "40px",   // 5 base units
                "pulse-6": "48px",   // 6 base units — desktop container padding
                "pulse-8": "64px",   // 8 base units — YouTube section vertical padding
            },

            // ===========================================================
            // MAX WIDTH — PRD §Phase 1.3: Container Max-Width: 1280px
            // ===========================================================
            maxWidth: {
                "pulse-container": "1280px",
            },

            // ===========================================================
            // BOX SHADOW — PRD §Phase 1.3: Hover Elevation
            // ===========================================================
            boxShadow: {
                // PRD: "Hover Elevation: 0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                "pulse-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                // Premium layered shadow (ui-ux-pro-max skill: "Layer multiple shadows")
                "pulse-card": "0 1px 2px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)",
            },

            // ===========================================================
            // Z-INDEX — PRD §Phase 4.1: Navigation "z-index: 50"
            // Defined here for Phase 4, but won't be used until then.
            // ===========================================================
            zIndex: {
                "nav": "50",
            },

            // ===========================================================
            // KEYFRAMES & ANIMATIONS
            // (ui-ux-pro-max skill: "Entrance Animations / Micro-interactions")
            // ===========================================================
            keyframes: {
                "pulse-fade-in": {
                    from: { opacity: "0", transform: "translateY(8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "pulse-scale-in": {
                    from: { opacity: "0", transform: "scale(0.96)" },
                    to: { opacity: "1", transform: "scale(1)" },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "pulse-fade-in": "pulse-fade-in 0.4s ease-out both",
                "pulse-scale-in": "pulse-scale-in 0.3s ease-out both",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },

    plugins: [require("tailwindcss-animate")],
};
