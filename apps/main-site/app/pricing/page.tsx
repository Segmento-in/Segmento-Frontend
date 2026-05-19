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
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme === "dark");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

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
        </div>
      </section>

      {/* PRICING */}
      <section className="pb-24 relative overflow-hidden">
        {/* Decorative Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto px-6">
          {/* Added pt-8 to ensure there is enough top-clearance so the card top doesn't clip when translating up on hover */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto pt-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col text-left transition-all duration-500 ease-out bento-tile ${
                  tier.name === "Enterprise" 
                    ? "ring-2 ring-brand shadow-[0_0_40px_rgba(59,130,246,0.08)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.16)] hover:-translate-y-2" 
                    : "hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2"
                }`}
                style={{ padding: "3rem 2.5rem", borderRadius: "2rem" }}
              >
                {/* Visual Accent for Enterprise */}
                {tier.name === "Enterprise" && (
                  <div className="absolute top-0 right-0 left-0 h-[4px] bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500" />
                )}

                <div className="mb-6 flex justify-between items-start">
                  <h3 className="text-3xl font-black tracking-tight text-foreground">
                    {tier.name}
                  </h3>
                  {tier.name === "Enterprise" && (
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-brand/10 text-brand rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-sm mb-8 leading-relaxed font-medium min-h-[48px] text-foreground-subtle">
                  {tier.description}
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-foreground tracking-tight">
                    {typeof tier.price === "number" ? `$${tier.price}` : tier.price}
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
                      <div className="mt-1 p-0.5 rounded-full shrink-0" style={{ background: "var(--theme-bg-surface-high)" }}>
                        <Check className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <span className="text-[14px] font-semibold text-foreground-subtle leading-normal">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer ${
                    tier.name === "Enterprise"
                      ? "bg-brand text-white shadow-lg shadow-blue-500/20 hover:bg-brand-hover hover:shadow-blue-500/30"
                      : "bg-surface-high text-foreground hover:text-brand border border-theme hover:bg-surface-high/80"
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

          <div className="grid md:grid-cols-2 gap-6">
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