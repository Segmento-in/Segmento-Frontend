"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: "pulse",
    name: "Segmento Pulse",
    title: "Real-time news & trends engine",
    description: "Real-time news at trends engine with emerging headlines: Global Data Privacy Update 2024.",
    image: "/pulse-preview.png",
    link: "/products/pulse",
  },
  {
    id: "sense",
    name: "Segmento Sense",
    title: "Explainable AI & PII Classification",
    description: "Highlighting Explainable AI, Client-Side OCR for secure text extraction, and advanced perimeter defense.",
    image: "/sense-preview.png",
    link: "/products/sense",
  },
];

export default function ProductShowcase() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Product Showcase
          </h2>
        </div>

        <div className="space-y-12">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-50 rounded-xl p-8 lg:p-12 border border-slate-100 flex flex-col lg:flex-row items-center gap-12 group"
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-bold">
                  {product.name}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {product.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed font-normal">
                  {product.description}
                </p>
                <Link
                  href={product.link}
                  className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-bold rounded-lg border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md active:scale-[0.98] group/btn"
                >
                  <span>Explore {product.name.split(" ")[1]}</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Image Preview (Browser/Mock UI Window) */}
              <div className="flex-1 w-full max-w-xl">
                 <div className="relative bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-shadow duration-500">
                    <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 space-x-1.5">
                       <div className="w-2 h-2 rounded-full bg-slate-200" />
                       <div className="w-2 h-2 rounded-full bg-slate-200" />
                       <div className="w-2 h-2 rounded-full bg-slate-200" />
                    </div>
                    <div className="p-2">
                       <div className="aspect-[16/10] bg-slate-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                          {/* Placeholder for actual image */}
                          <div className="text-slate-300 font-bold text-sm tracking-widest">{product.name} PREVIEW</div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
