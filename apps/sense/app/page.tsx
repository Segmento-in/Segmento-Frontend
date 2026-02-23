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
      <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-start z-50 sticky top-0">
        <Link
          href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || "http://localhost:3000"}
          className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Segmento.in
        </Link>
      </div>
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
