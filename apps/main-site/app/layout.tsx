import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

/**
 * Import our three fonts from the font registry.
 * Each font object carries a .variable property which is the CSS variable
 * name we defined (e.g., "--font-syne"). We attach these to <html> so
 * every component in the app can access them.
 */
import { syne, monaSans, dmMono } from "./lib/fonts";

export const metadata: Metadata = {
  title: "Segmento - AI-Powered Data Intelligence Platform",
  description:
    "Transform your data into actionable insights with Segmento's AI-powered platform for data classification, analysis, and intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * We join all three font variable class names together.
   * This makes --font-syne, --font-mona-sans, and --font-dm-mono
   * available as CSS variables anywhere inside <html>.
   *
   * data-theme="dark" sets dark mode as the default for the whole site.
   * Our CSS will read this attribute to switch color tokens.
   */
  const fontClasses = [syne.variable, monaSans.variable, dmMono.variable].join(" ");

  return (
    <html lang="en" data-theme="dark" className={fontClasses}>
      <body className="antialiased">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}

