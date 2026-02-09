'use client'

import Link from "next/link"
import { ShoppingCart, Building2, Heart, GraduationCap, Factory, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"

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
]

export default function SolutionsPage() {
  // Framer Motion animation variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: [0.33, 1, 0.68, 1] },
    }),
  }

  return (
    <div className="min-h-screen py-20">
      {/* Hero */}
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Industry Solutions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Tailored data security and intelligence solutions for your industry
            </p>
          </div>
        </div>
      </section> 

      {/* Industries */}
      {industries.map((industry, index) => {
        const Icon = industry.icon
        return (
          <section
            key={industry.id}
            id={industry.id}
            className={`py-12 ${index % 2 === 1 ? "bg-linear-to-br from-primary/5 to-purple-50" : ""}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-linear-to-br from-primary/10 to-purple-100">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">{industry.title}</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-8">{industry.intro}</p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Challenges */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Key Challenges</h3>
                    <ul className="space-y-3">
                      {industry.challenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span className="text-muted-foreground">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Our Solutions</h3>
                    <div className="space-y-4">
                      {industry.solutions.map((solution, i) => (
                        <motion.div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-border/50 shadow-sm hover:shadow-lg"
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          custom={i}
                        >
                          <div className="font-semibold text-primary mb-1">{solution.title}</div>
                          <div className="text-sm text-muted-foreground">{solution.desc}</div>
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

      {/* CTA */}
      <section className="py-16 bg-linear-to-r from-primary to-purple-600 text-white mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to secure your industry's data?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Contact us to learn how Segmento can protect your organization
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
