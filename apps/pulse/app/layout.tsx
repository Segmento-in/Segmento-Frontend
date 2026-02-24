import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
    title: "Segmento Pulse | Real-time Tech Intelligence",
    description:
        "Real-time technology insights powered by AI. Stay ahead with curated news on AI, Data Engineering, Cloud Computing, and more.",
};

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
    display: "swap",
});

const playfair = Playfair_Display({
    variable: "--font-serif",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className="antialiased min-h-screen flex flex-col">
                {children}
                <Analytics />
            </body>
        </html>
    );
}
