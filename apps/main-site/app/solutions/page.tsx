"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  ShoppingCart, Building2, Heart, GraduationCap, 
  Factory, Radio, Tv, CreditCard, ArrowRight, 
  ShieldCheck, AlertCircle
} from "lucide-react";

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
];

// Animation Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" as const 
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Time between each solution card appearing
    }
  }
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-44 pb-24 bg-[var(--color-background)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-6"
          >
            <h1 className="text-6xl lg:text-7xl font-bold text-[var(--color-heading)] tracking-tighter">
              Industry <span className="text-[var(--color-brand)]">Specializations</span>
            </h1>
            <p className="text-xl text-[var(--color-body)] max-w-2xl mx-auto font-medium leading-relaxed">
              Tailored data intelligence for the sectors that drive the global economy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industry Scroll List */}
      <div className="flex flex-col">
        {industries.map((industry, index) => {
          const isReversed = index % 2 !== 0;
          const Icon = industry.icon;

          return (
            <section
              key={industry.id}
              id={industry.id}
              className={`py-28 lg:py-36 border-t border-[var(--color-border-light)] ${
                isReversed
                  ? "bg-[var(--color-background)]"
                  : "bg-[var(--color-background-secondary)]"
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

  {/* Problem Column */}
  <div className={isReversed ? "lg:order-2" : "lg:order-1"}>
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className="space-y-10 relative z-10"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-[var(--card-bg)] shadow-[var(--shadow-card)] border border-[var(--color-border)] text-[var(--color-brand)]">
            <Icon size={32} />
          </div>
          <h2 className="text-4xl font-bold text-[var(--color-heading)] tracking-tight">
            {industry.title}
          </h2>
        </div>

        <p className="text-2xl font-bold text-[var(--color-heading)] leading-tight">
          {industry.intro}
        </p>

        <div className="space-y-4 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-subtle)]">
            Industry Challenges
          </h4>

          <div className="grid gap-3">
            {industry.challenges.map((challenge, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--color-border-light)]"
              >
                <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                <span className="text-slate-600 dark:!text-black font-bold text-sm leading-relaxed">
                  {challenge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </div>

  {/* Solutions Column */}
  <div className={isReversed ? "lg:order-1" : "lg:order-2"}>
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="space-y-6 relative z-10"
    >
      <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-subtle)]">
        Our Solutions
      </h4>

      <div className="grid gap-4">
        {industry.solutions.map((sol, i) => (
          <motion.div
            variants={staggerItem}
            whileHover={{ x: isReversed ? -5 : 5 }}
            key={i}
            className="p-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--color-border-light)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-brand)]">
                <ShieldCheck size={18} />
              </div>

              <h4 className="text-base font-bold text-[#0F172A] dark:!text-black group-hover:text-blue-600 transition-colors">
  {sol.title}
</h4>
</div>
<p className="text-slate-500 dark:!text-black font-medium leading-relaxed text-xs">
  {sol.desc}
</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>

</div>
              </div>
            </section>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}