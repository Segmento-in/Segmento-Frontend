import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

/**
 * Inter font loaded via next/font/google.
 *
 * Why next/font and NOT @import url() in globals.css:
 *   - next/font self-hosts the font files at build time (zero external network
 *     requests at runtime → eliminates render-blocking and layout shift).
 *   - The CSS variable --font-inter is injected into <html> by Next.js,
 *     which is then consumed by globals.css and tailwind.config.js.
 *   - This is the approved engineering approach for optimal Core Web Vitals.
 *
 * PRD §Phase 1.2: "System UI / Inter"
 * Weights loaded: PRD-required 400, 500, 600, 700, 800 only — no unnecessary
 * weight loading (web-design-guidelines skill: "Limit the number of font weights loaded").
 */
const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Segmento Pulse",
    description:
        "Segmento Pulse — Real-time enterprise tech news aggregator. Stay ahead with curated AI, Cloud, and Data intelligence.",
    keywords: ["tech news", "AI", "cloud", "enterprise", "data", "Segmento"],
    openGraph: {
        title: "Segmento Pulse",
        description: "Real-time enterprise tech news aggregator.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
   

return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="bg-white text-gray-900 dark:bg-black dark:text-white transition-colors duration-300">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </body>
    </html>
);
}
