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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Left: Contact Form Card */}
            <div className="bg-white rounded-[2rem] p-10 lg:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
              <h1 className="text-[44px] leading-[1.1] font-bold text-[#0F172A] mb-12 tracking-tight">
                Contact Segmento <br /> 
                <span className="text-slate-900">Sales & Support</span>
              </h1>
              
              <form className="space-y-6 flex-1">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-1 bg-white text-[10px] font-extrabold text-slate-400 uppercase tracking-widest z-10">
                      Full Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        defaultValue="Anuksha" 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-500 outline-none transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Work Email" 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                </div>

                <textarea 
                  rows={6} 
                  placeholder="Message / Reason for Inquiry" 
                  className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none font-medium" 
                />

                <button className="w-full py-5 bg-[#030B26] text-white text-lg font-bold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all mt-4 shadow-xl shadow-blue-900/10">
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Side: Info & Trusted */}
            <div className="flex flex-col gap-6">
              
              {/* Main Info Card */}
             <div className="bg-white rounded-[2rem] p-10 lg:p-14 border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex-1">
  <h2 className="text-[40px] leading-[1.1] font-bold text-[#0F172A] mb-10 tracking-tight">
    Trusted by Global <br /> Enterprises & CISOs
  </h2>
  
  <div className="mb-14">
    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Global Office Locations</h3>
    <div className="grid sm:grid-cols-2 gap-8">
      <LocationItem 
        icon={<MapPin className="w-5 h-5 text-blue-600" />} 
        city="Vishakhapatnam" 
        address={`Aathidyam Restaurant, Waltair Uplands\nRama Talkies Opposite Road, Vishakhapatnam`} 
      />
    </div>
  </div>

  <div>
    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Enterprise Trust</h3>
    <div className="max-w-2xl">
      <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
        Segmento is committed to delivering world-class data intelligence and privacy solutions. 
        Our platform is engineered to handle the complex security, compliance, and 
        governance needs of global enterprises, ensuring your data remains secure and 
        actionable across every region we serve.
      </p>
    </div>
  </div>
</div>
              {/* Support Card */}
              <div className="bg-slate-50/80 rounded-[1.5rem] p-8 border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
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

function BrandLogo({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
      <div className="text-slate-900 mb-1">
        {icon}
      </div>
      <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
    </div>
  );
}