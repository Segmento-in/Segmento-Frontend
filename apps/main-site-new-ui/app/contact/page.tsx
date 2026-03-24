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
import { triggerWelcomeEmail } from "../lib/emailService";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      // Mapping Phone to Message for schema compatibility if needed, 
      // or just sending it as part of the payload if schema supports it or we combine it.
      // Based on legacy audit, phone isn't a separate field in Appwrite.
      // We'll append phone to message for the backend ingestion.
      const payload = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: `Phone: ${formData.phone}\n\n${formData.message}`,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        triggerWelcomeEmail(formData.name, formData.email);
        setStatus("success");
        setFormData({ name: "", email: "", company: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Failed to send message. Please check your connection.");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <section className="pt-32 pb-24 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-4">Message Sent!</h1>
            <p className="text-slate-500 mb-8">
              Thank you for reaching out. Our team will get back to you within 24 hours.
            </p>
            <button 
              onClick={() => setStatus("idle")}
              className="w-full py-4 bg-[#030B26] text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Send Another Message
            </button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Left: Contact Form Card */}
            <div className="bg-white rounded-[2rem] p-10 lg:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
              <h1 className="text-[44px] leading-[1.1] font-bold text-[#0F172A] mb-12 tracking-tight">
                Contact Segmento <br /> 
                <span className="text-slate-900">Sales & Support</span>
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {status === "error" && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-1 bg-white text-[10px] font-extrabold text-slate-400 uppercase tracking-widest z-10">
                      Full Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-blue-500 outline-none transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Work Email" 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Name" 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number" 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                </div>

                <textarea 
                  name="message"
                  required
                  rows={6} 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message / Reason for Inquiry" 
                  className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none font-medium" 
                />

                <button 
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-5 bg-[#030B26] text-white text-lg font-bold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all mt-4 shadow-xl shadow-blue-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Sending..." : "Send Message"}
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
                  <div className="grid sm:grid-cols-3 gap-8">
                  <LocationItem 
  icon={<MapPin className="w-4 h-4" />} 
  city="Vishakhapatnam" 
  address={`Aathidyam Restaurant, Waltair Uplands \n Rama Talkies Opposite Road, Vishakhapatnam`} 
/>
                   
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Trusted By</h3>
                  
                  {/* High Fidelity Icon Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-y-10 gap-x-6 items-center">
                    <BrandLogo icon={<ShieldCheck className="w-6 h-6" />} label="SOC2" />
                    <BrandLogo icon={<CheckCircle2 className="w-6 h-6" />} label="GDPR" />
                    <BrandLogo icon={<Command className="w-6 h-6" />} label="SNOW" />
                    <BrandLogo icon={<Building2 className="w-6 h-6" />} label="SAP" />
                    <BrandLogo icon={<Zap className="w-6 h-6" />} label="CORE" />
                    <BrandLogo icon={<Globe className="w-6 h-6" />} label="NBC" />
                    
                    <span className="text-[12px] font-black text-slate-400 tracking-tighter">xfınity</span>
                    <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">SAMSUNG</span>
                    <BrandLogo icon={<Building2 className="w-5 h-5" />} label="MSFT" />
                    <BrandLogo icon={<Shield className="w-6 h-6" />} label="SAFE" />
                    <BrandLogo icon={<Lock className="w-6 h-6" />} label="SECURE" />
                    <BrandLogo icon={<CheckCircle2 className="w-6 h-6" />} label="OS" />
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
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <p className="text-[13px] font-extrabold text-[#0F172A]">{city}</p>
      </div>
      <p className="text-[12px] text-slate-500 leading-relaxed font-medium pl-6">
        {address.split(',').map((line, i) => (
          <span key={i} className="block">{line.trim()}</span>
        ))}
      </p>
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