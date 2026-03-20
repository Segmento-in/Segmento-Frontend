"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, MapPin, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]/50">
      <Navbar />

      <section className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Contact Form Card */}
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 flex flex-col">
              <h2 className="text-4xl font-bold text-[#0F172A] mb-12 tracking-tight">
                Contact Segmento <br /> Sales & Support
              </h2>
              <form className="space-y-6 flex-1">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="absolute -top-2.5 left-4 px-1 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider z-10">Full Name</label>
                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <input type="email" placeholder="Work Email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Company Name" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                  <input type="tel" placeholder="Phone Number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="relative">
                   <textarea rows={5} placeholder="Message / Reason for Inquiry" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" />
                </div>
                <button className="w-full py-5 bg-[#0F172A] text-white font-bold rounded-lg shadow-lg shadow-navy-500/10 hover:bg-slate-800 active:scale-[0.99] transition-all mt-4">
                  Send Message
                </button>
              </form>
            </div>

            {/* Info and Trusted Card */}
            <div className="space-y-6 flex flex-col">
              <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm flex-1">
                <h2 className="text-4xl font-bold text-[#0F172A] mb-12 tracking-tight">Trusted by Global <br /> Enterprises & CISOs</h2>
                
                <div className="mb-12">
                   <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Global Office Locations</h3>
                   <div className="grid sm:grid-cols-3 gap-8">
                      <div className="space-y-3">
                         <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-slate-400" />
                           <p className="text-sm font-bold text-[#0F172A]">San Francisco (HQ)</p>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pl-6">1239 Francisco Ave.,<br />Suite 72350</p>
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center gap-2">
                           <Globe className="w-4 h-4 text-slate-400" />
                           <p className="text-sm font-bold text-[#0F172A]">New York</p>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pl-6">300 Horak Ave.,<br />Suite 23009</p>
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center gap-2">
                           <Globe className="w-4 h-4 text-slate-400" />
                           <p className="text-sm font-bold text-[#0F172A]">London</p>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pl-6">London Street.,<br />Suite 23890</p>
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted By</h3>
                   <div className="grid grid-cols-4 sm:grid-cols-6 gap-y-10 gap-x-4 grayscale opacity-40">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex items-center justify-center">
                           <div className="w-10 h-10 border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-300">LOGO</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Direct Support Item */}
              <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 flex items-center gap-6 group hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                   <Mail className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                   <p className="text-sm font-bold text-[#0F172A]">Direct Support</p>
                   <p className="text-sm text-blue-600 font-medium my-0.5">support@segmento.com</p>
                   <p className="text-xs text-slate-400">24/7 Critical Support for Enterprise Clients</p>
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
