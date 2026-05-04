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
    <main className="min-h-screen bg-sky-50">
      <Navbar />

      <section className="pt-24 pb-24 bg-sky-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            
            {/* Left: Contact Form Card - SOFT SLATE THEME & REDUCED HEIGHT */}
            <div className="bg-[#334155] rounded-[2rem] px-10 py-8 lg:px-12 lg:py-10 shadow-2xl border border-slate-500/30 flex flex-col">
              <h1 className="text-[36px] leading-[1.1] font-bold text-white mb-8 tracking-tight">
                Contact Segmento
              </h1>
              
              <form className="space-y-5 flex-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-1 bg-[#334155] text-[10px] font-extrabold text-slate-300 uppercase tracking-widest z-10">
                      Full Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        className="w-full px-4 py-3 bg-slate-400/10 border border-slate-400/30 rounded-xl text-white placeholder:text-slate-400 focus:border-blue-400 outline-none transition-all font-medium text-sm" 
                      />
                    </div>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Work Email" 
                    className="w-full px-4 py-3 bg-slate-400/10 border border-slate-400/30 rounded-xl text-white placeholder:text-slate-400 focus:bg-slate-400/20 focus:border-blue-400 outline-none transition-all font-medium text-sm" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    className="w-full px-4 py-3 bg-slate-400/10 border border-slate-400/30 rounded-xl text-white placeholder:text-slate-400 focus:bg-slate-400/20 focus:border-blue-400 outline-none transition-all font-medium text-sm" 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full px-4 py-3 bg-slate-400/10 border border-slate-400/30 rounded-xl text-white placeholder:text-slate-400 focus:bg-slate-400/20 focus:border-blue-400 outline-none transition-all font-medium text-sm" 
                  />
                </div>

                <textarea 
                  rows={4} 
                  placeholder="Message / Reason for Inquiry" 
                  className="w-full px-4 py-3 bg-slate-400/10 border border-slate-400/30 rounded-xl text-white placeholder:text-slate-400 focus:bg-slate-400/20 focus:border-blue-400 outline-none transition-all resize-none font-medium text-sm" 
                />

                <button className="w-full py-4 bg-blue-600 text-white text-md font-bold rounded-xl hover:bg-blue-500 active:scale-[0.98] transition-all mt-2 shadow-lg shadow-blue-900/20 uppercase tracking-wider">
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Side: Info & Trusted */}
            <div className="flex flex-col gap-6">
              
              {/* Main Info Card - ADJUSTED TO CONTENT */}
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                <div className="mb-8">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Global Office Locations</h3>
                  <div className="grid sm:grid-cols-1 gap-8">
                    <LocationItem 
                      icon={<MapPin className="w-5 h-5 text-blue-600" />} 
                      city="Vishakhapatnam" 
                      address={`Aathidyam Restaurant, Waltair Uplands\nRama Talkies Opposite Road, Vishakhapatnam`} 
                    />
                  </div>
                </div>

                <div>
                  <div className="max-w-2xl">
                  </div>
                </div>
              </div>

              {/* Support Card - BORDERED */}
              <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 flex items-center gap-6 group hover:shadow-lg transition-all cursor-pointer">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">Direct Support</p>
                  <p className="text-base text-blue-600 font-bold my-0.5">info@segmento.in</p>
                  <p className="text-xs text-slate-400 font-medium tracking-tight">24/7 Critical Support for Enterprise Clients</p>
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

// Sub-components
function LocationItem({ icon, city, address }: { icon: React.ReactNode, city: string, address: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-blue-600">{icon}</div>
        <p className="text-[16px] font-black text-[#0F172A] tracking-tight">{city}</p>
      </div>
      <div className="text-[13px] text-slate-500 leading-relaxed font-medium pl-7">
        {address.split('\n').map((line, i) => (
          <span key={i} className="block whitespace-nowrap">
            {line.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}