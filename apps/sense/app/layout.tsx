import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
    title: "Segmento Sense | Intelligent Data Classification",
    description: "Automate Data Classification with AI",
};

import { SenseNavbar } from "@/components/SenseNavbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className="antialiased min-h-screen flex flex-col">
                <SenseNavbar />
                <main className="grow">{children}</main>
            </body>
        </html>
    );
}
