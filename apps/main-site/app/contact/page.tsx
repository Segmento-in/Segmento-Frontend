"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { MediaGlobe } from "@/components/originkit/ui/hero-23/media-globe";
import { Mail, MapPin } from "lucide-react";
import { useBrandColorCycle } from "../lib/hooks/useBrandColorCycle";

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}`;
}

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const { activeColor } = useBrandColorCycle();

  useEffect(() => {
    setMounted(true);
    
    // Check initial theme
    const checkTheme = () => {
      setIsLightMode(document.documentElement.dataset.theme === "light");
    };
    checkTheme();

    // Observe html element for data-theme attribute changes (triggered by ThemeToggle)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const globeProps = isLightMode
    ? {
        dots: { color: activeColor, size: 5, density: 8, allDots: false },
        markerConfig: { markers: [], color: activeColor, size: 40 },
        graticuleColor: `rgba(${hexToRgb(activeColor)}, 0.15)`,
      }
    : {};

  const activeColorRgb = hexToRgb(activeColor);

  return (
    <main 
      className="min-h-[100dvh] relative flex flex-col bg-white dark:bg-[#060606] transition-colors duration-700"
      style={{ '--brand-rgb': isLightMode ? activeColorRgb : '53, 78, 135' } as React.CSSProperties}
    >
      <Navbar />

      <section className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden w-full">
        
        {/* ============================================================== */}
        {/* 3D SPLINE GLOBE BACKGROUND                                     */}
        {/* ============================================================== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Ambient Color Wash */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: isLightMode ? `radial-gradient(circle at 50% 50%, rgba(${activeColorRgb}, 0.04), transparent 70%)` : 'none',
              transition: 'background 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />

          {/* Half-Globe rising from the bottom */}
          <div className="absolute bottom-[-10%] left-1/2 aspect-[898/447] w-[180%] sm:w-[120%] lg:w-[80%] -translate-x-1/2 overflow-clip pointer-events-auto transition-all duration-1000 z-0">
            <div className="absolute left-1/2 top-0 aspect-[898/900] w-full -translate-x-1/2 overflow-clip rounded-[999px]">
              <MediaGlobe query="(min-width: 0px)" {...globeProps} />
            </div>
          </div>
          
          {/* Subtle bottom gradient to ground the globe */}
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white dark:from-[#060606] to-transparent z-10 transition-colors duration-700" />
        </div>

        {/* ============================================================== */}
        {/* FLOATING FORM (Foreground Z-10)                                */}
        {/* ============================================================== */}
        <div className="max-w-6xl w-full mx-auto px-6 lg:px-8 relative z-20 flex-1 flex flex-col justify-center">
          
          <div className="text-center mb-10 mt-8 lg:mt-0">
            <h1 
              className="text-[40px] lg:text-[56px] leading-[1.1] font-bold text-[rgb(var(--brand-rgb))] dark:text-white tracking-tight drop-shadow-xl transition-colors"
              style={isLightMode ? {
                backgroundImage: `linear-gradient(135deg, ${activeColor}, rgb(var(--brand-rgb)))`,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                transition: 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
              } : undefined}
            >
              Contact Segmento
            </h1>
            <p className="text-[16px] lg:text-[18px] text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4 drop-shadow-md transition-colors">
              Get in touch with our global team. We're here to help you transform your data into actionable intelligence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start relative">
            
            {/* Left: Contact Form Card - SOLID PROFESSIONAL */}
            <div className="flex flex-col bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group transition-colors duration-700" style={{ padding: "3rem", borderRadius: "1.5rem" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--brand-rgb),0.02)] dark:from-white/[0.02] to-transparent pointer-events-none transition-colors" />
              
              <h2 className="text-[24px] leading-[1.1] font-bold text-gray-900 dark:text-white mb-8 tracking-tight relative z-10 transition-colors">
                Send us a message
              </h2>

              <form className="space-y-5 flex-1 relative z-10">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="relative group/input">
                    <label className="absolute -top-2.5 left-4 px-1 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest z-10 bg-white dark:bg-[#0f0f0f] rounded-sm transition-colors">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter Your Full Name"
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[rgb(var(--brand-rgb))] dark:focus:border-[rgb(var(--brand-rgb))] outline-none transition-all font-medium text-sm focus:ring-1 focus:ring-[rgb(var(--brand-rgb))]"
                      />
                    </div>
                  </div>
                  <input
                    type="email"
                    placeholder="Work Email"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[rgb(var(--brand-rgb))] dark:focus:border-[rgb(var(--brand-rgb))] outline-none transition-all font-medium text-sm focus:ring-1 focus:ring-[rgb(var(--brand-rgb))]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[rgb(var(--brand-rgb))] dark:focus:border-[rgb(var(--brand-rgb))] outline-none transition-all font-medium text-sm focus:ring-1 focus:ring-[rgb(var(--brand-rgb))]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[rgb(var(--brand-rgb))] dark:focus:border-[rgb(var(--brand-rgb))] outline-none transition-all font-medium text-sm focus:ring-1 focus:ring-[rgb(var(--brand-rgb))]"
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="Message / Reason for Inquiry"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[rgb(var(--brand-rgb))] dark:focus:border-[rgb(var(--brand-rgb))] outline-none transition-all resize-none font-medium text-sm focus:ring-1 focus:ring-[rgb(var(--brand-rgb))]"
                />

                <button className="w-full py-4 mt-2 relative flex items-center justify-center rounded-xl bg-[rgb(var(--brand-rgb))] dark:bg-white text-white dark:text-[#060606] font-bold text-sm tracking-wide transition-all hover:opacity-90 hover:-translate-y-[1px] active:scale-[0.98] shadow-xl">
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* RIGHT SIDE: Information Cards */}
            <div className="flex flex-col gap-6">

              {/* Main Info Card - SOLID PROFESSIONAL */}
              <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden transition-colors duration-700" style={{ padding: "2.5rem", borderRadius: "1.5rem" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--brand-rgb),0.02)] dark:from-white/[0.02] to-transparent pointer-events-none transition-colors" />
                <div className="relative z-10">
                  <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 transition-colors">
                    Global Office Locations
                    <div className="h-px bg-gray-200 dark:bg-white/5 flex-1 transition-colors" />
                  </h3>
                  <div className="grid sm:grid-cols-1 gap-8">
                    <LocationItem
                      icon={<MapPin className="w-5 h-5 text-[rgb(var(--brand-rgb))] dark:text-white" />}
                      city="Vishakhapatnam"
                      address={`Aathidyam Restaurant, Waltair Uplands\nRama Talkies Opposite Road, Vishakhapatnam`}
                    />
                  </div>
                </div>
              </div>

              {/* Support Card - SOLID PROFESSIONAL */}
              <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden flex items-center gap-6 group hover:border-[rgba(var(--brand-rgb),0.3)] dark:hover:border-white/10 hover:-translate-y-1 transition-all cursor-pointer duration-700" style={{ padding: "2rem", borderRadius: "1.5rem" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--brand-rgb),0.02)] dark:from-white/[0.02] to-transparent pointer-events-none transition-colors" />
                
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[rgba(var(--brand-rgb),0.05)] dark:bg-white/5 border border-[rgba(var(--brand-rgb),0.1)] dark:border-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Mail className="w-6 h-6 text-[rgb(var(--brand-rgb))] dark:text-white transition-colors" />
                </div>

                <div className="relative z-10">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 transition-colors">Direct Support</p>
                  <p className="text-base text-gray-900 dark:text-white font-bold my-0.5 group-hover:text-[rgba(var(--brand-rgb),0.7)] dark:group-hover:text-gray-300 transition-colors">info@segmento.in</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-medium tracking-tight transition-colors">24/7 Critical Support for Enterprise Clients</p>
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
        <div className="w-10 h-10 rounded-full bg-[rgba(var(--brand-rgb),0.05)] dark:bg-white/5 flex items-center justify-center border border-[rgba(var(--brand-rgb),0.1)] dark:border-white/5 transition-colors">
          {icon}
        </div>
        <p className="text-[18px] font-bold text-gray-900 dark:text-white tracking-tight transition-colors">{city}</p>
      </div>
      <div className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium pl-13 ml-[52px] transition-colors">
        {address.split('\n').map((line, i) => (
          <span key={i} className="block whitespace-nowrap">
            {line.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}