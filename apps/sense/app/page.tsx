import { HeroSection } from "@/components/HeroSection"
import { CounterSection } from "@/components/CounterSection"
import { DocumentFeatures } from "@/components/DocumentFeatures"
import { FeaturesOverview } from "@/components/FeaturesOverview"
import { IndustryUseCases } from "@/components/IndustryUseCases"
import { ProcessFlow } from "@/components/ProcessFlow"
import { FeatureGrid } from "@/components/FeatureGrid"
import { ComparisonCTA } from "@/components/ComparisonCTA"
import { EnterpriseSection } from "@/components/EnterpriseSection"
import { FAQSection } from "@/components/FAQSection"
import { CTASection } from "@/components/CTASection"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DataClassificationPage() {
  return (
    <>
      <HeroSection />
      <ComparisonCTA />
      <CounterSection />
      <DocumentFeatures />
      <FeaturesOverview />
      <IndustryUseCases />
      <ProcessFlow />
      <FeatureGrid />
      <EnterpriseSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
