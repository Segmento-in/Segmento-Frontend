// app/page.tsx
import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Segmento | Secure Data. Smarter Insights.",
  description:
    "Segmento provides enterprise-grade AI-driven solutions for data intelligence and security. Explore Segmento Pulse and Segmento Sense.",
};

export default function Page() {
  return <HomeClient />;
}
