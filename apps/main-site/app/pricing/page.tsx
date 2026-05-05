"use client";

import { useState, useEffect } from "react";
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
  },
];

const faqs = [
  {
    question: "How secure is my data?",
    answer: "Your data is protected with bank-grade encryption and SOC 2 Type II compliance.",
  },
  {
    question: "What are the deployment options?",
    answer: "We support cloud, on-premise, and hybrid deployment models.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes, you can upgrade anytime.",
  },
  {
    question: "Do you offer enterprise-wide licensing?",
    answer: "Yes, our Enterprise plan supports full organization deployment.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  // 🔥 Detect theme from HTML
  useEffect(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    setIsDark(theme === "dark");
  }, []);

  return (
    <main className="min-h-screen bg-primary">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-8"
            style={{ color: isDark ? "#000" : "var(--color-heading)" }}
          >
            Transparent Pricing
          </motion.h1>
        </div>
      </section>

      {/* PRICING */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">

            {tiers.map((tier) => {
              const isEnterprise = tier.name === "Enterprise";

              return (
                <div
                  key={tier.name}
                  className={`rounded-3xl p-10 flex flex-col transition-all ${
                    isEnterprise
                      ? "bg-slate-900 text-white"
                      : "card-3d"
                  }`}
                >
                  {/* TITLE */}
                  <h3
                    className="text-2xl font-black mb-2"
                    style={{
                      color: isEnterprise
                        ? "#fff"
                        : isDark
                        ? "#000" // 🔥 FORCE BLACK
                        : "var(--color-heading)",
                    }}
                  >
                    {tier.name}
                  </h3>

                  {/* DESC */}
                  <p
                    className="text-sm mb-6"
                    style={{
                      color: isEnterprise
                        ? "#cbd5e1"
                        : isDark
                        ? "#000" // 🔥 FORCE BLACK
                        : "var(--color-body)",
                    }}
                  >
                    {tier.description}
                  </p>

                  {/* PRICE */}
                  <div
                    className="text-5xl font-black mb-6"
                    style={{
                      color: isEnterprise
                        ? "#fff"
                        : isDark
                        ? "#000" // 🔥 FORCE BLACK
                        : "var(--color-heading)",
                    }}
                  >
                    {typeof tier.price === "number" ? `$${tier.price}` : tier.price}
                  </div>

                  {/* FEATURES */}
                  <div className="flex-1 space-y-3 mb-10">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-[var(--color-brand)]" />
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color: isEnterprise
                              ? "#e2e8f0"
                              : isDark
                              ? "#000" // 🔥 FORCE BLACK
                              : "var(--color-body)",
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-3d-primary py-4 text-sm font-bold uppercase">
                    {tier.cta}
                  </button>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2
              className="text-3xl font-black mb-4"
              style={{ color: isDark ? "#000" : "var(--color-heading)" }}
            >
              FAQs
            </h2>
            <p style={{ color: isDark ? "#000" : "var(--color-body)" }}>
              Everything you need to know.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card-3d overflow-hidden">

                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex justify-between items-center"
                >
                  <span
                    className="font-bold"
                    style={{ color: isDark ? "#000" : "var(--color-heading)" }}
                  >
                    {faq.question}
                  </span>

                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted" />
                  )}
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div
                        className="px-6 pb-6 text-sm"
                        style={{ color: isDark ? "#000" : "var(--color-body)" }}
                      >
                        {faq.answer}
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