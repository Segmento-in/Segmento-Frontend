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

      <body className="antialiased text-body transition-colors duration-300">
        {/* Fixed background blob layer */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'visible',
          pointerEvents: 'none',
        }}>
          {/* Blue blob — top left */}
          <div style={{
            position: 'absolute',
            top: '-300px',
            left: '-300px',
            width: '1000px',
            height: '900px',
            borderRadius: '50%',
            background: 'rgba(147, 210, 255, 0.20)',
            filter: 'blur(160px)',
          }}/>
          {/* Green blob — top right */}
          <div style={{
            position: 'absolute',
            top: '-250px',
            right: '-300px',
            width: '950px',
            height: '850px',
            borderRadius: '50%',
            background: 'rgba(180, 240, 200, 0.16)',
            filter: 'blur(160px)',
          }}/>
          {/* Yellow blob — bottom center */}
          <div style={{
            position: 'absolute',
            bottom: '-300px',
            right: '-200px',
            width: '900px',
            height: '800px',
            borderRadius: '50%',
            background: 'rgba(255, 240, 170, 0.14)',
            filter: 'blur(160px)',
          }}/>
        </div>

        {/* All page content sits above the blob layer */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
          <Chatbot />
        </div>
      </body>
    </html>
  );
}