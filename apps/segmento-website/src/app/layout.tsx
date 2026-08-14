import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import React from "react";

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmMono = DM_Mono({
  weight: ["500", "400"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});



export const metadata: Metadata = {
  title: "Segmento | Data Intelligence Platform",
  description: "The AI-native platform that finds, protects, and orchestrates your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
