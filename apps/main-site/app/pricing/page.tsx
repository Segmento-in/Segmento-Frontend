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
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="min-h-screen bg-sky-50">
      <Navbar />

      <section className="pt-32 pb-24 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight"
          >
            Transparent Pricing for <br /> Enterprise Scale
          </motion.h1>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-6 mb-20 text-sm font-bold">
            <span className={!isAnnual ? "text-slate-900" : "text-slate-500"}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-white rounded-full relative p-1 shadow-inner border border-slate-300"
            >
              <div
                className={`w-5 h-5 bg-[#2563EB] rounded-full shadow-md transition-transform duration-300 ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className={isAnnual ? "text-slate-900" : "text-slate-500"}>Annual (Save 20%)</span>
          </div>

          {/* ✅ CENTERED 2 CARDS */}
          <div className="flex justify-center">
            <div className="grid md:grid-cols-2 gap-8 mb-32 max-w-4xl w-full">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-3xl p-10 flex flex-col text-left transition-all duration-300 ${
                    tier.theme === "navy"
                      ? "bg-slate-800 text-white shadow-2xl border-0"
                      : "bg-white border border-slate-300 shadow-xl"
                  }`}
                >
                  <h3 className={`text-2xl font-black mb-2 ${tier.theme === "navy" ? "text-white" : "text-slate-900"}`}>
                    {tier.name}
                  </h3>

                  <p className={`text-sm mb-8 leading-relaxed font-medium h-10 ${
                    tier.theme === "navy" ? "text-slate-300" : "text-slate-500"
                  }`}>
                    {tier.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className={`text-5xl font-black ${
                      tier.theme === "navy" ? "text-white" : "text-slate-900"
                    }`}>
                      {typeof tier.price === "number"
                        ? `$${isAnnual ? Math.floor(tier.price * 0.8) : tier.price}`
                        : tier.price}
                    </span>
                    {typeof tier.price === "number" && (
                      <span className="text-lg font-bold text-slate-400">/mo</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 mb-12">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`mt-1 p-0.5 rounded-full ${
                          tier.theme === "navy" ? "bg-blue-500/20" : "bg-blue-50"
                        }`}>
                          <Check className={`w-3.5 h-3.5 ${
                            tier.theme === "navy" ? "text-blue-400" : "text-[#2563EB]"
                          }`} />
                        </div>
                        <span className={`text-[14px] font-semibold ${
                          tier.theme === "navy" ? "text-slate-200" : "text-slate-700"
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider ${
                      tier.theme === "navy"
                        ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* बाकी code unchanged */}
        </div>
      </section>

      <Footer />
    </main>
  );
}