'use client'

import Link from "next/link"
import { ShoppingCart, Building2, Heart, GraduationCap, Factory, Radio, Tv, CreditCard } from "lucide-react"
import { Button } from "@/ui/button"
import { motion, Variants, easeOut } from "framer-motion"

// Industries data
const industries = [
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "eCommerce",
    intro: "Protect customer data and build trust in your online marketplace",
    challenges: [
      "Managing customer payment information securely",
      "Protecting personal data across multiple touchpoints",
      "Complying with PCI-DSS and regional privacy laws",
      "Preventing data breaches and fraud",
    ],
    solutions: [
      { title: "Payment Data Protection", desc: "Automated PCI-DSS compliance and tokenization" },
      { title: "Customer Profile Security", desc: "Classify and protect PII across databases" },
      { title: "Transaction Monitoring", desc: "Real-time fraud detection and data anomaly alerts" },
      { title: "Multi-channel Governance", desc: "Unified data protection across web, mobile, and marketplaces" },
    ],
  },
  {
    id: "finance",
    icon: Building2,
    title: "Finance",
    intro: "Meet regulatory compliance while enabling data-driven innovation",
    challenges: [
      "Adhering to GLBA, SOX, and international financial regulations",
      "Protecting sensitive financial records and transactions",
      "Managing data across legacy and modern systems",
      "Securing customer financial data from cyber threats",
    ],
    solutions: [
      { title: "Regulatory Compliance", desc: "Automated GLBA, PCI-DSS, and SOX compliance monitoring" },
      { title: "Financial Data Classification", desc: "Identify and tag sensitive financial information" },
      { title: "Access Control", desc: "Role-based governance for customer and internal data" },
      { title: "Audit Trails", desc: "Complete lineage and access logging for regulatory audits" },
    ],
  },
  {
    id: "healthcare",
    icon: Heart,
    title: "Healthcare",
    intro: "HIPAA-compliant data protection for patient privacy and trust",
    challenges: [
      "Ensuring HIPAA compliance across all systems",
      "Protecting PHI (Protected Health Information)",
      "Securing patient data across providers and partners",
      "Managing consent and access controls",
    ],
    solutions: [
      { title: "HIPAA Compliance Automation", desc: "Continuous monitoring and reporting" },
      { title: "PHI Discovery", desc: "Automatically identify and classify health records" },
      { title: "De-identification", desc: "Anonymize data for research and analytics" },
      { title: "Breach Prevention", desc: "Real-time alerts for unauthorized access attempts" },
    ],
  },
  {
    id: "higher-education",
    icon: GraduationCap,
    title: "Higher Education",
    intro: "Safeguard student data and ensure FERPA compliance",
    challenges: [
      "Complying with FERPA and protecting student records",
      "Managing data across multiple departments and systems",
      "Securing research data and intellectual property",
      "Balancing access with privacy requirements",
    ],
    solutions: [
      { title: "FERPA Compliance", desc: "Automated classification of educational records" },
      { title: "Student Data Protection", desc: "Secure PII across admissions, financial aid, and records" },
      { title: "Research Data Security", desc: "Protect sensitive research data and IP" },
      { title: "Access Management", desc: "Granular controls for faculty, staff, and students" },
    ],
  },
  {
    id: "manufacturing",
    icon: Factory,
    title: "Manufacturing",
    intro: "Protect intellectual property and secure supply chain data",
    challenges: [
      "Protecting proprietary designs and trade secrets",
      "Securing supply chain and vendor data",
      "Managing IoT and operational technology data",
      "Preventing industrial espionage",
    ],
    solutions: [
      { title: "IP Protection", desc: "Classify and secure design files, patents, and trade secrets" },
      { title: "Supply Chain Security", desc: "Protect vendor and partner data exchanges" },
      { title: "IoT Data Governance", desc: "Manage sensor and production data securely" },
      { title: "Access Controls", desc: "Role-based access to sensitive manufacturing data" },
    ],
  },
  {
    id: "telecommunication",
    icon: Radio,
    title: "Telecommunication",
    intro: "Secure customer communications and network data at scale",
    challenges: [
      "Protecting customer call detail records (CDRs)",
      "Managing massive volumes of subscriber data",
      "Complying with telecommunications regulations",
      "Securing network infrastructure data",
    ],
    solutions: [
      { title: "CDR Protection", desc: "Automated classification and encryption of call records" },
      { title: "Subscriber Data Security", desc: "Protect PII across billing and customer systems" },
      { title: "Network Data Governance", desc: "Secure infrastructure and operational data" },
      { title: "Compliance Automation", desc: "Meet regional telecom regulations automatically" },
    ],
  },
  // New Industry: Media
  {
    id: "media",
    icon: Tv,
    title: "Media",
    intro: "Secure media assets and user data across platforms",
    challenges: [
      "Protecting intellectual property and copyrights",
      "Managing subscriber information and preferences",
      "Preventing piracy and unauthorized distribution",
      "Ensuring compliance with media regulations",
    ],
    solutions: [
      { title: "Content Protection", desc: "Encrypt and classify media files to prevent unauthorized access" },
      { title: "Subscriber Data Security", desc: "Secure PII across subscriptions and platforms" },
      { title: "Piracy Prevention", desc: "Real-time monitoring and alerts for unauthorized usage" },
      { title: "Regulatory Compliance", desc: "Ensure adherence to regional media laws and guidelines" },
    ],
  },
  // New Industry: Banking
  {
    id: "banking",
    icon: CreditCard,
    title: "Banking",
    intro: "Protect sensitive financial and customer information in banks",
    challenges: [
      "Securing account and transaction data",
      "Preventing fraud and cyber attacks",
      "Complying with banking regulations",
      "Ensuring real-time monitoring of financial operations",
    ],
    solutions: [
      { title: "Account Security", desc: "Encrypt and classify all sensitive banking data" },
      { title: "Fraud Detection", desc: "AI-powered alerts for unusual transactions" },
      { title: "Regulatory Compliance", desc: "Automated monitoring for banking standards" },
      { title: "Transaction Monitoring", desc: "Real-time visibility into all banking operations" },
    ],
  },
]

export default function SolutionsPage() {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: easeOut },
    }),
  }

  const headlineVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0f3b]">
  {/* Hero Section */}
  <motion.section
    variants={headlineVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="mb-15 py-20"
  >
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
        Industry Solutions
      </h1>
      <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
        Tailored data security and intelligence solutions for your industry
      </p>
    </div>
  </motion.section>

{/* Industries Section */}
{industries.map((industry, index) => {
  const Icon = industry.icon
  // index % 2 === 0 makes the FIRST section (index 0) LIGHT (White)
  const isDark = index % 2 !== 0

  return (
    <section
      key={industry.id}
      id={industry.id}
      className={`py-20 relative overflow-hidden ${
        isDark 
          ? "bg-[#0b0f3b] text-white" 
          : "bg-white text-slate-900"
      }`}
    >
      {/* Subtle mesh background for white sections */}
      {!isDark && (
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-50 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-50 rounded-full blur-[120px]" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className={`p-4 rounded-2xl shadow-sm ${
              isDark 
                ? "bg-white/10" 
                : "bg-indigo-600"
            }`}>
              <Icon className={`w-8 h-8 ${isDark ? "text-cyan-400" : "text-white"}`} />
            </div>
            <motion.h2
              variants={headlineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold tracking-tight"
            >
              {industry.title}
            </motion.h2>
          </div>

          <motion.p
            variants={headlineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`text-base md:text-lg mb-12 leading-relaxed max-w-3xl ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {industry.intro}
          </motion.p>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Challenges Column */}
            <motion.div
              variants={headlineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className={`text-lg md:text-xl font-bold mb-6 flex items-center gap-2 ${
                isDark ? "text-cyan-400" : "text-indigo-600"
              }`}>
                
                Key Challenges
              </h3>
              <ul className="space-y-4">
                {industry.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      isDark ? "bg-red-400" : "bg-red-500"
                    }`} />
                    <span className={`text-sm md:text-base transition-colors ${
                      isDark ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900"
                    }`}>
                      {challenge}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions Column */}
            <div>
              <motion.h3
                variants={headlineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`text-lg md:text-xl font-bold mb-6 flex items-center gap-2 ${
                  isDark ? "text-cyan-400" : "text-indigo-600"
                }`}
              >
                
                Our Solutions
              </motion.h3>
              <div className="grid gap-4">
                {industry.solutions.map((solution, i) => (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className={`rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 ${
                      isDark 
                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg" 
                        : "bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100"
                    }`}
                  >
                    <div className={`font-bold mb-1.5 text-sm md:text-base ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {solution.title}
                    </div>
                    <div className={`text-xs md:text-sm leading-relaxed ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {solution.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})}

    

{/* Final CTA Section - Dark Aesthetic Card UI */}
<section className="bg-white py-24">
    <div className="container mx-auto px-4 text-center">
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headlineVariants}
            className="max-w-5xl mx-auto p-12 md:p-16 [3rem] bg-[#0f172a] border border-slate-800 shadow-2xl relative overflow-hidden"
        >
            {/* Decorative glows to match branding */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

            <motion.h2
                variants={headlineVariants}
                className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 relative z-10 tracking-tight"
            >
                Ready to secure your industry's data?
            </motion.h2>
            
            <motion.p
                variants={headlineVariants}
                transition={{ delay: 0.2 }}
                className="text-slate-400 mb-10 font-medium text-lg max-w-2xl mx-auto relative z-10 leading-relaxed"
            >
                Contact us to learn how Segmento can protect your organization with tailored intelligence.
            </motion.p>

            <motion.div 
                variants={headlineVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center relative z-10 items-center w-full"
            >
                <Link 
                    href="/contact" 
                    className="px-10 py-4 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 transition-transform hover:scale-105 active:scale-95 text-center min-w-[200px]"
                >
                    Get Started
                </Link>
                <Link 
                    href="/careers" 
                    className="px-10 py-4 border-2 border-cyan-400/50 text-cyan-400 rounded-xl font-bold hover:bg-cyan-400/10 transition-all shadow-lg hover:border-cyan-400 text-center min-w-[200px]"
                >
                    View Careers
                </Link>
            </motion.div>
        </motion.div>
    </div>
</section>
    </div>
  )
}
