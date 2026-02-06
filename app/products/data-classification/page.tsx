import { HeroSection } from "@/components/home/HeroSection"
import { CounterSection } from "@/components/home/CounterSection"
import { DocumentFeatures } from "@/components/home/DocumentFeatures"
import { FeaturesOverview } from "@/components/home/FeaturesOverview"
import { IndustryUseCases } from "@/components/home/IndustryUseCases"
import { ProcessFlow } from "@/components/home/ProcessFlow"
import { FeatureGrid } from "@/components/home/FeatureGrid"
import { ComparisonCTA } from "@/components/home/ComparisonCTA"
import { EnterpriseSection } from "@/components/home/EnterpriseSection"
import { FAQSection } from "@/components/home/FAQSection"
import { CTASection } from "@/components/home/CTASection"



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
