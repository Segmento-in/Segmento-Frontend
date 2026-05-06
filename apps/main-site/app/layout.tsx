import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "./components/Chatbot";

export const metadata: Metadata = {
  title: "Segmento - AI-Powered Data Intelligence Platform",
  description:
    "Transform your data into actionable insights with Segmento's AI-powered platform for data classification, analysis, and intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🔥 THEME FIX (MOST IMPORTANT) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('site-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = theme ? theme === 'dark' : prefersDark;

                  if (isDark) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="antialiased bg-sky-50 dark:bg-primary text-body">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}