"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Mail, MapPin, Globe, ShieldCheck,
  Lock, CheckCircle2, Building2, Smartphone,
  Zap, Command, Shield
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--theme-bg)", color: "var(--theme-fg)" }}>
      <Navbar />

      <section className="pt-24 pb-24" style={{ background: "var(--theme-bg)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* Left: Contact Form Card - BENTO TILE THEME */}
            <div className="bento-tile flex flex-col" style={{ padding: "3rem", borderRadius: "2rem" }}>
              <h1 className="text-[36px] leading-[1.1] font-bold text-foreground mb-8 tracking-tight">
                Contact Segmento
              </h1>

              <form className="space-y-5 flex-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-extrabold text-foreground-muted uppercase tracking-widest z-10" style={{ background: "var(--theme-bg-surface)" }}>
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter Your Full Name"
                        className="w-full px-4 py-3 border rounded-xl text-foreground placeholder:text-foreground-muted focus:border-brand outline-none transition-all font-medium text-sm"
                        style={{ background: "var(--theme-bg-surface-high)", borderColor: "var(--theme-border-subtle)" }}
                      />
                    </div>
                  </div>
                  <input
                    type="email"
                    placeholder="Work Email"
                    className="w-full px-4 py-3 border rounded-xl text-foreground placeholder:text-foreground-muted focus:border-brand outline-none transition-all font-medium text-sm"
                    style={{ background: "var(--theme-bg-surface-high)", borderColor: "var(--theme-border-subtle)" }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full px-4 py-3 border rounded-xl text-foreground placeholder:text-foreground-muted focus:border-brand outline-none transition-all font-medium text-sm"
                    style={{ background: "var(--theme-bg-surface-high)", borderColor: "var(--theme-border-subtle)" }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border rounded-xl text-foreground placeholder:text-foreground-muted focus:border-brand outline-none transition-all font-medium text-sm"
                    style={{ background: "var(--theme-bg-surface-high)", borderColor: "var(--theme-border-subtle)" }}
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="Message / Reason for Inquiry"
                  className="w-full px-4 py-3 border rounded-xl text-foreground placeholder:text-foreground-muted focus:border-brand outline-none transition-all resize-none font-medium text-sm"
                  style={{ background: "var(--theme-bg-surface-high)", borderColor: "var(--theme-border-subtle)" }}
                />

                <button className="w-full py-4 bg-brand text-white text-md font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mt-2 shadow-lg shadow-brand/20 uppercase tracking-wider">
                  Send Message
                </button>
              </form>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-6">

              {/* Main Info Card - ADJUSTED TO CONTENT */}
              <div className="bento-tile" style={{ padding: "2rem", borderRadius: "2rem" }}>
                <div className="mb-8">
                  <h3 className="text-[11px] font-black text-foreground-muted uppercase tracking-[0.3em] mb-6">Global Office Locations</h3>
                  <div className="grid sm:grid-cols-1 gap-8">
                    <LocationItem
                      icon={<MapPin className="w-5 h-5 text-brand" />}
                      city="Vishakhapatnam"
                      address={`Aathidyam Restaurant, Waltair Uplands\nRama Talkies Opposite Road, Vishakhapatnam`}
                    />
                  </div>
                </div>
              </div>

              {/* Support Card - BORDERED */}
              <div className="bento-tile flex items-center gap-6 group hover:border-brand hover:-translate-y-2 transition-all cursor-pointer" style={{ padding: "2rem", borderRadius: "1.5rem" }}>
                <div className="w-14 h-14 rounded-2xl border transition-transform group-hover:scale-110 flex items-center justify-center" style={{ background: "var(--theme-bg-surface-high)", borderColor: "var(--theme-border-subtle)" }}>
                  <Mail className="w-6 h-6 text-foreground group-hover:text-brand transition-colors" />
                </div>

                <div>
                  <p className="text-sm font-bold text-foreground">Direct Support</p>
                  <p className="text-base text-brand font-bold my-0.5">info@segmento.in</p>
                  <p className="text-xs text-foreground-subtle font-medium tracking-tight">24/7 Critical Support for Enterprise Clients</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* SUB COMPONENT */
function LocationItem({ icon, city, address }: { icon: React.ReactNode, city: string, address: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-brand">{icon}</div>
        <p className="text-[16px] font-black text-foreground tracking-tight">{city}</p>
      </div>
      <div className="text-[13px] text-foreground-subtle leading-relaxed font-medium pl-7">
        {address.split('\n').map((line, i) => (
          <span key={i} className="block whitespace-nowrap">
            {line.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}