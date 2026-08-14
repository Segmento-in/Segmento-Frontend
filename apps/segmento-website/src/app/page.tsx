"use client";

import React from "react";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-background">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-display font-bold text-2xl tracking-tighter">Segmento</div>
        <button className="bg-white text-black px-6 py-2 rounded-full font-sans font-medium hover:scale-105 transition-transform duration-300 shadow-sm">
          Talk to Us
        </button>
      </nav>

      {/* HERO SECTION */}
      <Hero />

      {/* TRUST STRIP SECTION */}
      <TrustStrip />

      {/* INTEREST: Bento Grid placeholder */}
      <section className="w-full max-w-7xl mx-auto py-32 md:py-48 px-6 bg-background relative z-10">
        <h2 className="font-display text-4xl md:text-5xl font-medium mb-16 tracking-tight text-on-surface">Built different.<br/>By design.</h2>
        {/* Placeholder for Bento Grid */}
      </section>
    </main>
  );
}
