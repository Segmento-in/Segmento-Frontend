"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const tiers = [
  {
    name: "Starter",
    price: 20,
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
    name: "Professional",
    price: 399,
    description: "Advanced intelligence tools for scaling data operations.",
    features: [
      "Basic Connectors",
      "Segmento Sense",
      "Segmento Classification",
      "Advanced AI models",
      "Real Canonical Models",
      "Enterprise Management",
    ],
    cta: "Get Started",
    popular: true,
    theme: "blue",
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
    <main className="min-h-screen bg-slate-200">
      <Navbar />

      <section className="pt-32 pb-24">
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
              className="w-14 h-7 bg-white rounded-full relative p-1 shadow-inner border border-slate-300 transition-colors"
            >
              <div
                className={`w-5 h-5 bg-[#2563EB] rounded-full shadow-md transition-transform duration-300 ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className={isAnnual ? "text-slate-900" : "text-slate-500"}>Annual (Save 20%)</span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-32 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-10 flex flex-col text-left transition-all duration-300 ${
                  tier.theme === "navy"
                    ? "bg-slate-800 text-white shadow-2xl border-0"
                    : tier.theme === "blue"
                    ? "bg-white border-4 border-[#2563EB] shadow-[0_20px_50px_rgba(37,99,235,0.15)] scale-[1.05] z-10"
                    : "bg-white border border-slate-300 shadow-xl"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#2563EB] text-white text-[11px] font-black rounded-full shadow-lg uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`text-2xl font-black mb-2 ${tier.theme === "navy" ? "text-white" : "text-slate-900"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mb-8 leading-relaxed font-medium h-10 ${tier.theme === "navy" ? "text-slate-300" : "text-slate-500"}`}>
                  {tier.description}
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className={`text-5xl font-black ${tier.theme === "navy" ? "text-white" : "text-slate-900"}`}>
                    {typeof tier.price === "number" ? `$${isAnnual ? Math.floor(tier.price * 0.8) : tier.price}` : tier.price}
                  </span>
                  {typeof tier.price === "number" && (
                    <span className={`text-lg font-bold ${tier.theme === "navy" ? "text-slate-400" : "text-slate-400"}`}>
                      /mo
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-4 mb-12">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1 p-0.5 rounded-full ${tier.theme === "navy" ? "bg-blue-500/20" : "bg-blue-50"}`}>
                        <Check className={`w-3.5 h-3.5 ${tier.theme === "navy" ? "text-blue-400" : "text-[#2563EB]"}`} />
                      </div>
                      <span className={`text-[14px] font-semibold ${tier.theme === "navy" ? "text-slate-200" : "text-slate-700"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:-translate-y-1 active:scale-[0.98] ${
                    tier.theme === "navy"
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40"
                      : tier.theme === "blue"
                      ? "bg-[#0F172A] text-white hover:bg-slate-800 shadow-xl shadow-blue-500/20"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Light & High Contrast Comparison Table */}
          <div className="mb-40">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center uppercase tracking-widest">Full Feature Comparison</h2>
            <div className="overflow-hidden border border-slate-300 rounded-[2rem] shadow-xl bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-8 font-black text-[12px] uppercase tracking-widest text-slate-500">Platform Capabilities</th>
                    <th className="p-8 font-black text-[14px] uppercase tracking-widest text-center text-slate-900">Starter</th>
                    <th className="p-8 font-black text-[14px] uppercase tracking-widest text-center text-[#2563EB] bg-blue-50/30">Professional</th>
                    <th className="p-8 font-black text-[14px] uppercase tracking-widest text-center text-slate-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Category 1 */}
                  <tr className="bg-white"><td colSpan={4} className="p-4 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-blue-600/80 bg-slate-50/50">Connectivity & Data</td></tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 px-8 text-slate-700 font-bold text-sm">Standard Data Connectors</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-5 h-5" /></td>
                    <td className="p-6 text-center bg-blue-50/20"><Check className="mx-auto text-[#2563EB] w-5 h-5" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-900 w-5 h-5" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 px-8 text-slate-700 font-bold text-sm">Real-time Data Engine</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-400 w-5 h-5" /></td>
                    <td className="p-6 text-center bg-blue-50/20"><Check className="mx-auto text-[#2563EB] w-5 h-5" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-900 w-5 h-5" /></td>
                  </tr>

                  {/* Category 2 */}
                  <tr className="bg-white"><td colSpan={4} className="p-4 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-blue-600/80 bg-slate-50/50">Intelligence & AI</td></tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 px-8 text-slate-700 font-bold text-sm">Advanced PII Detection</td>
                    <td className="p-6 text-center font-bold text-slate-300">—</td>
                    <td className="p-6 text-center bg-blue-50/20"><Check className="mx-auto text-[#2563EB] w-5 h-5" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-900 w-5 h-5" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 px-8 text-slate-700 font-bold text-sm">Custom AI Model Training</td>
                    <td className="p-6 text-center font-bold text-slate-300">—</td>
                    <td className="p-6 text-center bg-blue-50/20 font-bold text-slate-300">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-900 w-5 h-5" /></td>
                  </tr>

                  {/* Category 3 */}
                  <tr className="bg-white"><td colSpan={4} className="p-4 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-blue-600/80 bg-slate-50/50">Service & Compliance</td></tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 px-8 text-slate-700 font-bold text-sm">Global Compliance Suite</td>
                    <td className="p-6 text-center font-bold text-slate-300">—</td>
                    <td className="p-6 text-center bg-blue-50/20"><Check className="mx-auto text-[#2563EB] w-5 h-5" /></td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-900 w-5 h-5" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 px-8 text-slate-700 font-bold text-sm">Dedicated Success Manager</td>
                    <td className="p-6 text-center font-bold text-slate-300">—</td>
                    <td className="p-6 text-center bg-blue-50/20 font-bold text-slate-300">—</td>
                    <td className="p-6 text-center"><Check className="mx-auto text-slate-900 w-5 h-5" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-32">
            <h2 className="text-4xl font-black text-slate-900 mb-16 tracking-tight text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-white border border-slate-300 rounded-2xl overflow-hidden transition-all shadow-lg hover:shadow-xl"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between text-left group hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-black text-slate-900 pr-4">{faq.question}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-left text-slate-600 text-sm leading-relaxed font-medium"
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