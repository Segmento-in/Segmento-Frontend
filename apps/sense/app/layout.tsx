import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { SenseNavbar } from "@/components/SenseNavbar";
import ToastProvider from "@/components/ToastProvider";
import { AuthProvider } from "@/lib/authContext";

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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html
  lang="en"
  suppressHydrationWarning
  className={`${inter.variable} ${playfair.variable}`}
>
  <body
    className="
      antialiased
      min-h-screen
      flex
      flex-col
      bg-[var(--color-background)]
      text-[var(--color-foreground)]
    "
  >
        <AuthProvider>
          <SenseNavbar />
          <ToastProvider />

          <main className="grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}