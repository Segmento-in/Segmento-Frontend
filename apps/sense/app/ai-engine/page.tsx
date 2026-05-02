import type { Metadata } from "next";
import { AIEngineHero } from "@/components/ai-engine/AIEngineHero";
import { ModelStats } from "@/components/ai-engine/ModelStats";
import { ModelCardGrid } from "@/components/ai-engine/ModelCardGrid";
import { ModelComparisonTable } from "@/components/ai-engine/ModelComparisonTable";
import { WhyChooseSense } from "@/components/ai-engine/WhyChooseSense";
import { IndustryContext } from "@/components/ai-engine/IndustryContext";
import { AIEngineCTA } from "@/components/ai-engine/AIEngineCTA";

export const metadata: Metadata = {
  title: "Segmento Sense AI Engine | 18 Self-Hosted Models",
  description:
    "Explore the 18 specialized AI models powering Segmento Sense's PII classifier. Every model runs exclusively on Segmento's private infrastructure — your data never reaches a third-party AI provider.",
  openGraph: {
    title: "Segmento Sense AI Engine | 18 Self-Hosted Models",
    description:
      "18 specialized models. 5 detection layers. 100% self-hosted. Zero third-party AI access.",
    type: "website",
  },
};

export default function AIEnginePage() {
  return (
    <main className="min-h-screen bg-white">
      <AIEngineHero />
      <ModelStats />
      <ModelCardGrid />
      <ModelComparisonTable />
      <WhyChooseSense />
      <IndustryContext />
      <AIEngineCTA />
    </main>
  );
}
