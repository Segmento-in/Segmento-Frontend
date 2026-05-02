import { HeroSection } from "@/components/HeroSection"
import { CounterSection } from "@/components/CounterSection"
import { DocumentFeatures } from "@/components/DocumentFeatures"
import { FeaturesOverview } from "@/components/FeaturesOverview"
import { IndustryUseCases } from "@/components/IndustryUseCases"
import { ProcessFlow } from "@/components/ProcessFlow"
import { FeatureGrid } from "@/components/FeatureGrid"
import { SenseComparisonTable } from "@/components/SenseComparisonTable"
import { EnterpriseSection } from "@/components/EnterpriseSection"
import FAQSection  from "@/components/FAQSection"
import  CTASection  from "@/components/CTASection"
import { AIEngineTeaser } from "@/components/AIEngineTeaser"

export default function DataClassificationPage() {
  return (
    <>
      <HeroSection />
      <SenseComparisonTable />
      {/* Entry Point 2: AI Engine Teaser — customer curiosity peaks after seeing the comparison table */}
      <AIEngineTeaser />
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
