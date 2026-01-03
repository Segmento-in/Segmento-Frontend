import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";

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
  title: "Segmento Sense | Enterprise PII Detection & Data Security",
  description: "Discover, classify, and protect personally identifiable information with industry-leading accuracy. Enterprise-grade PII detection for compliance and data security.",
  keywords: ["PII detection", "data security", "GDPR compliance", "HIPAA", "data privacy", "data classification"],
  openGraph: {
    title: "Segmento Sense | Enterprise PII Detection & Data Security",
    description: "Discover, classify, and protect personally identifiable information with industry-leading accuracy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}