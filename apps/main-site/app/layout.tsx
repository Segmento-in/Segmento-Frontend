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
        {/* THEME SCRIPT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const savedTheme = sessionStorage.getItem("theme");

                if (savedTheme === "dark") {
                  document.documentElement.dataset.theme = "dark";
                } else {
                  document.documentElement.dataset.theme = "light";
                }
              })();
            `,
          }}
        />

        {/* GOOGLE FONTS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="antialiased bg-sky-50 text-body transition-colors duration-300">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}