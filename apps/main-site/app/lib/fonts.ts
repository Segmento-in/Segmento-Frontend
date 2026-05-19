/**
 * fonts.ts — Segmento Design System: Font Registry
 *
 * Think of this file like a "font store". Every font the website uses
 * is defined here ONE time, then shared across the whole app.
 *
 * THREE fonts, THREE jobs:
 *   1. Syne       → Big display headlines (the "wow" titles)
 *   2. Mona Sans  → Normal reading text (paragraphs, labels)
 *   3. DM Mono    → Code, data, numbers (machine-style text)
 *
 * Each font gets a CSS variable name (like --font-syne). Tailwind CSS
 * then uses these variable names so you can write: font-[family-name:--font-syne].
 */

import { Inter, Poppins, DM_Mono } from "next/font/google";

export const monaSans = Inter({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  display: "swap",
  preload: true,
});

export const syne = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
  preload: false,
});
