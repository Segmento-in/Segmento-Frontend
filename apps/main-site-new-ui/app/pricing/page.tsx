"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const tiers = [
  {
    name: "Starter",
    price: 20,
    description: "",
    features: [
      "Basic Connectors",
      "Segmento Pulse",
      "Segmento Sense",
      "Segmento Resolve",
      "Segmento Resolve",
    ],
    cta: "Get Started",
    popular: false,
    theme: "white",
  },
  {
    name: "Professional",
    price: 399,
    description: "",
    features: [
      "Basic Connectors",
      "Segmento Sense",
      "Segmento Classification",
      "Segmento Sense",
      "Advanced AI models",
      "Real conacal models",
      "Eorinihrise Management",
    ],
    cta: "Get Started",
    popular: true,
    theme: "blue",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Custom and soreese pricing to enterprise-grade features.",
    features: [
      "Custom Models",
      "Dedicated Support",
      "SLA Guarantees",
      "SLA Guarantees",
      "Enterprise-grade Features",
      "Custom Privacy Models",
    ],
    cta: "Contact Sales",
    popular: false,
    theme: "navy",
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
    question: "What are the deployment options?",
    answer: "We support cloud, on-premise, and hybrid deployment models.",
  },
  {
    question: "What secure lo8xx is my data?",
    answer: "Our security protocols keep your data isolated and encrypted at rest and in transit.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-8 tracking-tight">
            Transparent Pricing for <br /> Enterprise Scale
          </h1>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-6 mb-20 text-sm font-bold">
            <span className={!isAnnual ? "text-[#0F172A]" : "text-slate-400"}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-slate-200 rounded-full relative p-1 transition-colors"
            >
              <div
                className={`w-4 h-4 bg-slate-600 rounded-full transition-transform duration-200 ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={isAnnual ? "text-[#0F172A]" : "text-slate-400"}>Annual</span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-32 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl p-10 flex flex-col text-left transition-all ${
                  tier.theme === "navy"
                    ? "bg-[#64748B] text-white border-0"
                    : tier.theme === "blue"
                    ? "bg-white border-2 border-[#2563EB] shadow-xl shadow-blue-500/5 scale-[1.02] z-10"
                    : "bg-white border border-slate-100 shadow-sm"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`text-2xl font-bold mb-4 ${tier.theme === "navy" ? "text-white" : "text-slate-900"}`}>
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-5xl font-bold ${tier.theme === "navy" ? "text-white" : "text-slate-900"}`}>
                    {typeof tier.price === "number" ? `$${tier.price}` : tier.price}
                  </span>
                  {typeof tier.price === "number" && (
                    <span className={`text-lg font-medium ${tier.theme === "navy" ? "text-blue-100" : "text-slate-400"}`}>
                      /month
                    </span>
                  )}
                </div>

                {tier.description && (
                  <p className={`text-sm mb-10 leading-relaxed ${tier.theme === "navy" ? "text-blue-50" : "text-slate-500"}`}>
                    {tier.description}
                  </p>
                )}

                <div className="flex-1 space-y-4 mb-12 mt-4">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 ${tier.theme === "navy" ? "text-blue-200" : "text-slate-900"}`} />
                      <span className={`text-sm font-medium ${tier.theme === "navy" ? "text-white" : "text-slate-600"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 px-6 rounded-lg font-bold text-center transition-all active:scale-[0.98] ${
                    tier.theme === "navy"
                      ? "bg-white text-slate-900 hover:bg-slate-50 shadow-sm"
                      : tier.theme === "blue"
                      ? "bg-[#0F172A] text-white hover:bg-slate-800 shadow-lg shadow-navy-500/20"
                      : "bg-white text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mb-40">
            <div className="overflow-hidden border border-slate-100 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 font-bold text-slate-900 text-sm">Features</th>
                    <th className="p-6 font-bold text-slate-900 text-sm text-center">Starter</th>
                    <th className="p-6 font-bold text-slate-900 text-sm text-center">Professional</th>
                    <th className="p-6 font-bold text-slate-900 text-sm text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* Data Connectors */}
                  <tr><td colSpan={4} className="p-4 px-6 bg-slate-50/30 font-bold text-[10px] uppercase tracking-widest text-slate-400">Data Connectors</td></tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Data Connectors</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4 opacity-70" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Data Engine</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4 opacity-70" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Data Detection</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Data Rnx Toels</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>

                  {/* AI Models */}
                  <tr><td colSpan={4} className="p-4 px-6 bg-slate-50/30 font-bold text-[10px] uppercase tracking-widest text-slate-400">AI Models</td></tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Advanced AI Models</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4 opacity-70" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Advanced PII Engine</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4 opacity-70" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Advanced AI Models</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>

                  {/* Security & Compliance */}
                  <tr><td colSpan={4} className="p-4 px-6 bg-slate-50/30 font-bold text-[10px] uppercase tracking-widest text-slate-400">Security & Compliance</td></tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Security & Compliance</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Security Grarantee</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>

                  {/* Support */}
                  <tr><td colSpan={4} className="p-4 px-6 bg-slate-50/30 font-bold text-[10px] uppercase tracking-widest text-slate-400">Support</td></tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">Dedicated Support</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4 text-center opacity-70" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-6 text-slate-600 font-medium text-sm">SLA Guarantees</td>
                    <td className="p-6 text-center text-slate-300 font-light">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4 opacity-70" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-4 h-4" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-32">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-16 tracking-tight">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-white border border-slate-100 rounded-lg overflow-hidden transition-colors shadow-sm"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between text-left group hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-left text-slate-600 text-sm leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}