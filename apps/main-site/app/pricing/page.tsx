"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const tiers = [
  {
    name: "Starter",
    price: 0,
    description: "Essential features for growing teams and early-stage projects.",
    features: [
      "Basic Connectors",
      "Segmento Pulse",
      "Segmento Sense",
      "Segmento Resolve",
      "Standard Analytics",
    ],
    cta: "Get Started",
    popular: false,
    theme: "white",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large-scale enterprise-grade features.",
    features: [
      "Custom Models",
      "Dedicated Support",
      "SLA Guarantees",
      "Enterprise Features",
      "Custom Privacy Models",
      "Global Compliance",
    ],
    cta: "Contact Sales",
    popular: false,
    theme: "navy",
  },
];

const faqs = [
  {
    question: "How secure is my data?",
    answer: "Your data is protected with bank-grade encryption and SOC 2 Type II compliance. Our security protocols keep your data isolated and encrypted at rest and in transit.",
  },
  {
    question: "What are the deployment options?",
    answer: "We support cloud, on-premise, and hybrid deployment models to fit your specific infrastructure requirements.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes, you can upgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Do you offer enterprise-wide licensing?",
    answer: "Absolutely. Our Enterprise plan is designed specifically for organization-wide deployment with custom pricing.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen" style={{ background: "var(--theme-bg)", color: "var(--theme-fg)" }}>
      <Navbar />

      <section className="pt-32 pb-16" style={{ background: "var(--theme-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-8 tracking-tight"
            style={{ color: "var(--theme-fg)" }}
          >
            Transparent Pricing 
          </motion.h1>

          

          <div className="grid md:grid-cols-2 gap-8 mb-28 items-stretch max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col text-left transition-all duration-300 bento-tile ${
                  tier.theme === "navy" ? "ring-2 ring-brand shadow-[0_0_30px_var(--theme-brand-glow)]" : ""
                }`}
                style={{ padding: "2.5rem", borderRadius: "1.5rem" }}
              >
                <h3 className="text-2xl font-black mb-2 text-foreground">
                  {tier.name}
                </h3>
                <p className="text-sm mb-8 leading-relaxed font-medium h-10 text-foreground-subtle">
                  {tier.description}
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-foreground">
                    {typeof tier.price === "number" ? `$${isAnnual ? Math.floor(tier.price * 0.8) : tier.price}` : tier.price}
                  </span>
                  {typeof tier.price === "number" && (
                    <span className="text-lg font-bold text-foreground-muted">
                      /mo
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-4 mb-12">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 rounded-full" style={{ background: "var(--theme-bg-surface-high)" }}>
                        <Check className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <span className="text-[14px] font-semibold text-foreground-subtle">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:-translate-y-1 active:scale-[0.98] ${
                    tier.theme === "navy"
                      ? "bg-brand text-white shadow-lg hover:opacity-90"
                      : "bg-surface-high text-foreground hover:text-brand border border-theme"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--theme-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "var(--theme-fg)" }}>
              Frequently Asked Questions
            </h2>
              <p className="text-lg text-foreground-subtle">
                Everything you need to know about our pricing and services.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bento-tile group" style={{ padding: 0 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-surface-high transition-colors"
                >
                  <span className="text-lg font-black text-foreground group-hover:text-brand transition-colors">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-foreground-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground-muted" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-sm text-foreground-subtle leading-relaxed font-medium">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}