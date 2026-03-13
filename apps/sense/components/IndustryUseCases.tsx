"use client"

import { 
    Building2, 
    Heart, 
    Shield, 
    Scale, 
    ShoppingCart, 
    Code, 
    CheckCircle2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

const industries = [
    {
        id: "finance",
        label: "Finance",
        icon: Building2,
        color: "#4F46E5", // Indigo
        title: "Protect financial data with confidence",
        description: "Extract key insights from investor decks, spreadsheets, and SEC filings while protecting customer PII.",
        features: [
            "Detect SSNs and account numbers",
            "SOX and GLBA compliance",
            "PCI-DSS data protection",
            "Automated data masking",
        ]
    },
    {
        id: "healthcare",
        label: "Healthcare",
        icon: Heart,
        color: "#E11D48", // Rose
        title: "HIPAA-compliant patient protection",
        description: "Automatically detect and protect PHI across all systems with comprehensive patient data security.",
        features: [
            "PHI detection across sources",
            "HIPAA compliance automation",
            "Patient records protection",
            "Automated de-identification",
        ]
    },
    {
        id: "legal",
        label: "Legal",
        icon: Scale,
        color: "#8B5CF6", // Violet
        title: "Attorney-client privilege protection",
        description: "Protect sensitive legal documents, case files, and client communications with precision PII detection.",
        features: [
            "Document classification",
            "Client data privacy",
            "Case file security",
            "Matter-based access control",
        ]
    },
    {
        id: "insurance",
        label: "Insurance",
        icon: Shield,
        color: "#0891B2", // Cyan
        title: "Policy holder data security",
        description: "Secure policy holder information, claims data, and underwriting documents across all systems.",
        features: [
            "Policy holder PII protection",
            "Claims data security",
            "Underwriting protection",
            "Regulatory compliance",
        ]
    },
    {
        id: "retail",
        label: "Retail",
        icon: ShoppingCart,
        color: "#F59E0B", // Amber
        title: "Customer data protection",
        description: "CCPA and GDPR compliance for customer data with automated PII detection and protection.",
        features: [
            "Customer PII detection",
            "CCPA and GDPR compliance",
            "Payment data protection",
            "Marketing data governance",
        ]
    },
    {
        id: "technology",
        label: "Technology",
        icon: Code,
        color: "#10B981", // Emerald
        title: "User data governance at scale",
        description: "API security and user data governance for tech companies building data-intensive applications.",
        features: [
            "User data discovery",
            "API security scanning",
            "Dev environment protection",
            "DevOps integration",
        ]
    },
]

export function IndustryUseCases() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background pattern for the white theme */}
            <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

            <div className="container relative mx-auto px-4">
                
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                        Powering the world's <br />
                        <span className="text-slate-400">best security teams.</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Trusted across industries where data privacy matters. Segmento Sense is the standard for high-accuracy PII protection.
                    </p>
                </div>

                <Tabs defaultValue="finance" className="w-full">
                    {/* Navigation Pills */}
                    <div className="relative max-w-5xl mx-auto mb-20">
                        <TabsList className="bg-transparent h-auto flex flex-wrap justify-center gap-3">
                            {industries.map((industry) => (
                                <TabsTrigger 
                                    key={industry.id} 
                                    value={industry.id}
                                    style={{ '--active-color': industry.color } as React.CSSProperties}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-500 data-[state=active]:bg-[var(--active-color)] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-lg data-[state=active]:shadow-[var(--active-color)]/20 transition-all text-sm font-bold"
                                >
                                    <industry.icon className="h-4 w-4" />
                                    {industry.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        {industries.map((industry) => (
                            <TabsContent key={industry.id} value={industry.id} className="mt-0 outline-none">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-5xl mx-auto"
                                >
                                    <div className="text-center space-y-12">
                                        <div className="max-w-3xl mx-auto">
                                            <h3 
                                                className="text-3xl md:text-5xl font-black mb-6 tracking-tight transition-colors duration-500"
                                                style={{ color: industry.color }}
                                            >
                                                {industry.title}
                                            </h3>
                                            <p className="text-slate-500 text-lg font-medium">
                                                {industry.description}
                                            </p>
                                        </div>

                                        {/* Features Grid */}
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                                            {industry.features.map((feature, idx) => (
                                                <motion.div 
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4"
                                                >
                                                    <div 
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                        style={{ backgroundColor: `${industry.color}15` }}
                                                    >
                                                        <CheckCircle2 className="h-5 w-5" style={{ color: industry.color }} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 leading-snug">
                                                        {feature}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </TabsContent>
                        ))}
                    </AnimatePresence>
                </Tabs>
            </div>
        </section>
    )
}