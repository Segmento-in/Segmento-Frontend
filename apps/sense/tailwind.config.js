/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        '../../packages/ui/src/**/*.{ts,tsx}',
        '../../packages/shared/**/*.{ts,tsx}',
    ],
    theme: {
        // Comprehensive breakpoint system for cross-device compatibility
        screens: {
            'xs': '320px',    // Small phones (iPhone SE, older Android)
            'sm': '375px',    // Standard phones (iPhone 14, Galaxy S21)
            'md': '430px',    // Large phones (iPhone Pro Max, Galaxy Ultra)
            'lg': '768px',    // Tablets (iPad, Galaxy Tab)
            'xl': '1024px',   // Small laptops, iPad Pro landscape
            '2xl': '1440px',  // Desktops, MacBooks
            '3xl': '1920px',  // Large desktops
            '4xl': '2560px',  // Ultra-wide displays
        },
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                xs: '0.75rem',
                sm: '1rem',
                md: '1.25rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '2.5rem',
            },
            screens: {
                'xs': '320px',
                'sm': '375px',
                'md': '430px',
                'lg': '768px',
                'xl': '1024px',
                '2xl': '1440px',
                '3xl': '1920px',
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#9D17A0",
                    50: "#F5E6F6",
                    100: "#DCBFFB",
                    200: "#C99EF7",
                    300: "#B57DF3",
                    400: "#A24AEF",
                    500: "#9D17A0",
                    600: "#7D1280",
                    700: "#5D0D60",
                    800: "#3E0840",
                    900: "#1E0420",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
                serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-up": {
                    from: { transform: "translateY(20px)", opacity: "0" },
                    to: { transform: "translateY(0)", opacity: "1" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.6s ease-out",
                "slide-up": "slide-up 0.5s ease-out",
            },
            backgroundImage: {
                'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
            // Responsive spacing scale
            spacing: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
            },
            // Responsive font sizes (mobile-first fluid typography)
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                // Fluid responsive sizes
                'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
                'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
                'fluid-lg': 'clamp(1.125rem, 3vw, 1.5rem)',
                'fluid-xl': 'clamp(1.25rem, 4vw, 2rem)',
                'fluid-2xl': 'clamp(1.5rem, 5vw, 2.5rem)',
                'fluid-3xl': 'clamp(1.875rem, 6vw, 3rem)',
            },
            // Minimum touch target sizes (WCAG AA)
            minHeight: {
                'touch': '44px',
                'touch-sm': '36px',
            },
            minWidth: {
                'touch': '44px',
                'touch-sm': '36px',
            },
            // Responsive max widths
            maxWidth: {
                'xs': '20rem',
                'sm': '24rem',
                'md': '28rem',
                'lg': '32rem',
                'xl': '36rem',
                '2xl': '42rem',
                '3xl': '48rem',
                '4xl': '56rem',
                '5xl': '64rem',
                '6xl': '72rem',
                '7xl': '80rem',
                'prose': '65ch',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
