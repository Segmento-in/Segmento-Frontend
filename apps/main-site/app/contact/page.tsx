"use client";

import React from "react";
import Navbar from "../components/Navbar";
import { MediaGlobe, MediaStardust } from "@/components/originkit/ui/hero-23/media-globe";
import { Mail, MapPin } from "lucide-react";

const STARDUST = {
  particleDensity: 10,
  minSize: 1,
  maxSize: 1,
  speed: 10,
  particleSpeed: 1,
  movement: 6,
  angle: 184,
  particleColor: "#FFFFFF33",
  background: "transparent",
} as const;

export default function ContactPage() {
  return (
    <main className="min-h-[100dvh] relative flex flex-col" style={{ background: "#060606", color: "var(--theme-fg)" }}>
      <Navbar />

      <section className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden w-full">
        
        {/* ============================================================== */}
        {/* 3D SPLINE GLOBE BACKGROUND (Matches Image-2 Arc perfectly)     */}
        {/* ============================================================== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Stardust */}
          <div className="absolute inset-0 opacity-50 dark:opacity-100 transition-all duration-1000 -hue-rotate-90 saturate-150 contrast-125 dark:hue-rotate-0 dark:saturate-100 dark:contrast-100">
            <MediaStardust query="(min-width: 0px)" {...STARDUST} />
          </div>

          {/* Half-Globe rising from the bottom */}
          <div className="absolute bottom-[-10%] left-1/2 aspect-[898/447] w-[180%] sm:w-[120%] lg:w-[80%] -translate-x-1/2 overflow-clip pointer-events-auto transition-all duration-1000 -hue-rotate-90 saturate-150 contrast-125 dark:hue-rotate-0 dark:saturate-100 dark:contrast-100 z-0">
            <div className="absolute left-1/2 top-0 aspect-[898/900] w-full -translate-x-1/2 overflow-clip rounded-[999px]">
              <MediaGlobe query="(min-width: 0px)" />
            </div>
          </div>
          
          {/* Subtle bottom gradient to ground the globe */}
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#060606] to-transparent z-10" />
        </div>

        {/* ============================================================== */}
        {/* FLOATING GLASSMORPHIC FORM (Foreground Z-10)                   */}
        {/* ============================================================== */}
        <div className="max-w-6xl w-full mx-auto px-6 lg:px-8 relative z-20 flex-1 flex flex-col justify-center">
          
          <div className="text-center mb-10 mt-8 lg:mt-0">
            <h1 className="text-[40px] lg:text-[56px] leading-[1.1] font-bold text-white tracking-tight drop-shadow-xl">
              Contact Segmento
            </h1>
            <p className="text-[16px] lg:text-[18px] text-white/60 max-w-2xl mx-auto mt-4 drop-shadow-md">
              Get in touch with our global team. We're here to help you transform your data into actionable intelligence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start relative">
            
            {/* Left: Contact Form Card - LIQUID GLASS THEME */}
            <div className="flex flex-col bg-[#0f0f0f]/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group" style={{ padding: "3rem", borderRadius: "1.5rem" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              
              <h2 className="text-[24px] leading-[1.1] font-bold text-white mb-8 tracking-tight relative z-10">
                Send us a message
              </h2>

              <form className="space-y-5 flex-1 relative z-10">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-extrabold text-white/60 uppercase tracking-widest z-10 bg-[#0f0f0f]/80 backdrop-blur-md rounded-sm">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter Your Full Name"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/40 focus:bg-white/10 outline-none transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                  <input
                    type="email"
                    placeholder="Work Email"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/40 focus:bg-white/10 outline-none transition-all font-medium text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/40 focus:bg-white/10 outline-none transition-all font-medium text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/40 focus:bg-white/10 outline-none transition-all font-medium text-sm"
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="Message / Reason for Inquiry"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/40 focus:bg-white/10 outline-none transition-all resize-none font-medium text-sm"
                />

                <button className="w-full py-4 mt-2 relative flex items-center justify-center rounded-xl bg-white text-[#060606] font-bold text-sm tracking-wide transition-all hover:opacity-90 hover:-translate-y-[1px] active:scale-[0.98] shadow-xl">
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* RIGHT SIDE: Information Cards */}
            <div className="flex flex-col gap-6">

              {/* Main Info Card - LIQUID GLASS */}
              <div className="bg-[#0f0f0f]/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden" style={{ padding: "2.5rem", borderRadius: "1.5rem" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    Global Office Locations
                    <div className="h-px bg-white/10 flex-1" />
                  </h3>
                  <div className="grid sm:grid-cols-1 gap-8">
                    <LocationItem
                      icon={<MapPin className="w-5 h-5 text-white" />}
                      city="Vishakhapatnam"
                      address={`Aathidyam Restaurant, Waltair Uplands\nRama Talkies Opposite Road, Vishakhapatnam`}
                    />
                  </div>
                </div>
              </div>

              {/* Support Card - LIQUID GLASS */}
              <div className="bg-[#0f0f0f]/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex items-center gap-6 group hover:border-white/30 hover:-translate-y-1 transition-all cursor-pointer" style={{ padding: "2rem", borderRadius: "1.5rem" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Mail className="w-6 h-6 text-white transition-colors" />
                </div>

                <div className="relative z-10">
                  <p className="text-sm font-bold text-white/80">Direct Support</p>
                  <p className="text-base text-white font-bold my-0.5 group-hover:text-[#a0a0a0] transition-colors">info@segmento.in</p>
                  <p className="text-xs text-white/50 font-medium tracking-tight">24/7 Critical Support for Enterprise Clients</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* SUB COMPONENT */
function LocationItem({ icon, city, address }: { icon: React.ReactNode, city: string, address: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
          {icon}
        </div>
        <p className="text-[18px] font-bold text-white tracking-tight">{city}</p>
      </div>
      <div className="text-[14px] text-white/60 leading-relaxed font-medium pl-13 ml-[52px]">
        {address.split('\n').map((line, i) => (
          <span key={i} className="block whitespace-nowrap">
            {line.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}