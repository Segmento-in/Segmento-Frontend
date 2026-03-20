"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Brain, Globe, Users } from "lucide-react";

const team = [
  {
    name: "Dr. Elena Rostova",
    role: "CTO & Co-Founder",
    image: "/team-aruna.png",
    bio: "Elena is a visionary leader with 15+ years in AI and data privacy, pioneering perimeter defense.",
  },
  {
    name: "John Smith",
    role: "CEO",
    image: "/team-david.png",
    bio: "John leads Segmento with a focus on enterprise growth and strategic partnerships.",
  },
  {
    name: "Anya Sharma",
    role: "Chief Scientist",
    image: "/team-sarah.png",
    bio: "Anya spearheads our AI research, focusing on explainable and safe machine learning.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Security by Design",
    description: "Every line of code is written with security as the first priority.",
  },
  {
    icon: Brain,
    title: "Transparent AI",
    description: "We believe AI should be explainable, not a black box.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Empowering businesses worldwide to harness data safely.",
  },
  {
    icon: Users,
    title: "User Centric",
    description: "Building products that solve real problems for real people.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 tracking-tight leading-[1.1]">
              Securing the World's Data with <br /> Transparent AI
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed">
              Segmento is committed to engineering-first, explainable security, from real-world data intelligence for global organizations.
            </p>
            <div className="flex gap-4">
               <button className="px-8 py-4 bg-[#0F172A] text-white rounded-lg font-bold shadow-lg shadow-navy-500/20 active:scale-[0.98] transition-all">
                 Our Mission
               </button>
               <button className="px-8 py-4 border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-50 active:scale-[0.98] transition-all">
                 Meet the Team
               </button>
            </div>
          </div>

          {/* Brain Neural Graphic Placeholder */}
          <div className="relative aspect-square flex items-center justify-center">
             <div className="absolute inset-0 bg-blue-400/10 blur-[100px] rounded-full" />
             <div className="relative w-full h-full max-w-[480px] max-height-[480px] bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center overflow-hidden">
                {/* Mock Brain Graphic */}
                <div className="relative w-64 h-64 border-2 border-blue-100/30 rounded-full animate-pulse-slow">
                   <div className="absolute inset-4 border border-blue-200/20 rounded-full" />
                   <div className="absolute inset-8 border border-blue-300/10 rounded-full" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <Brain className="w-16 h-16 text-blue-500 opacity-60" />
                      <div className="mt-4 text-[10px] font-mono text-blue-400 opacity-50 uppercase tracking-[0.2em]">Neural Intelligence</div>
                   </div>
                   {/* Data Lines */}
                   <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
                   <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-slate-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-4xl font-bold text-[#0F172A] mb-12">Mission</h2>
           <div className="bg-white rounded-2xl p-16 shadow-sm border border-slate-100">
             <h3 className="text-3xl font-bold text-[#0F172A] mb-8">Our Mission: Moving Beyond Black-Box Security</h3>
             <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
               Segmento is transparent approach to enhance the data endure black-box security, and soscd enable all roomdeats, what alioit your ultra world that some orienting mares the data to mindent explainable security engineening, our global software resources overs the tinrh to choose and clear organization.
             </p>
           </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#0F172A]">Leadership</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-slate-50">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <Users className="w-12 h-12" />
                  </div>
                </div>
                <div className="p-8 text-center bg-white">
                   <h3 className="text-xl font-bold text-[#0F172A] mb-1">{member.name}</h3>
                   <p className="text-slate-500 text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-slate-50/50 rounded-2xl p-12 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
              <h2 className="text-4xl font-bold text-[#0F172A]">By the Numbers</h2>
              <div className="flex flex-wrap items-center justify-center gap-12">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                       <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#0F172A]">10B+</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanned</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                       <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#0F172A]">0</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Breaches</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                       <Brain className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#0F172A]">100%</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client-Side</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-24 px-4 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0F172A] rounded-2xl p-16 md:p-24 text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-600/5 blur-[120px] group-hover:bg-blue-600/10 transition-colors" />
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">
               Join Our Engineering-First Team
             </h2>
             <p className="text-blue-100/60 mb-12 relative z-10 max-w-xl mx-auto text-lg leading-relaxed">
               Build the future of secure AI and the future of segnanto.
             </p>
             <button className="px-10 py-5 bg-[#2563EB] text-white font-bold rounded-lg relative z-10 hover:bg-blue-600 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">
               View Open Roles
             </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
