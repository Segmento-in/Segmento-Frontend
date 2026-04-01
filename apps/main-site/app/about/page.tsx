"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Shield, 
  Brain, 
  Globe, 
  Users, 
  Linkedin, 
  Database, 
  Lock as LockIcon, // Renamed to avoid conflict with built-in TS 'Lock' type
  Laptop 
} from "lucide-react";

const director = {
  name: "Geetha Reddy K",
  role: "Executive Director at Segmento",
  bio: "Geetha Reddy K is the Executive Director of Segmento, a data technology startup established in 2025, focused on building innovative and privacy-centric data products. She is also the Founder of Aathidyam Restaurants, a recognised hospitality brand based in Visakhapatnam, showcasing her entrepreneurial drive across industries. Geeta holds a Bachelor of Arts (BA) in Public Administration from Andhra University, providing a strong foundation in governance, administration, and strategic leadership. In addition, she completed a Certification in Desktop Administration in 2000, reflecting her early exposure to technology and systems management. With a strong passion for business and entrepreneurship, she actively contributes to shaping Segmento's vision, values, and long-term growth. Alongside her professional accomplishments, she is also a homemaker, successfully balancing leadership responsibilities with family life through discipline and dedication.",
  image: "/images/director1.png",
  linkedin: "https://www.linkedin.com/in/geeta-reddy-karri-0126163a3",
};

const team = [
  {
    name: "Anuksha Shirgave",
    role: "Web & UI Developer",
    bio: "Anuksha Shirgave is a UI & Web Developer at Segmento, focused on building clean, responsive, and user-friendly web interfaces. She specializes in transforming ideas and designs into high-performance websites using modern frontend technologies.",
    image: "/images/mem2.jpeg",
    linkedin: "https://www.linkedin.com/in/anuksha-shirgave-703058232",
  },
  {
    name: "Adam Shafi",
    role: "Data and Ai Technologies Developer",
    bio: "Adam Shafi is a Data & AI Technologies Engineer at Segmento, focused on building intelligent, data-driven solutions that solve real-world business problems. He specializes in developing AI-powered systems.",
    image: "/images/shafi-profile.jpg",
    linkedin: "http://www.linkedin.com/in/shafisk",
  },
  {
    name: "Thambabattula Mohan",
    role: "Data Developer",
    bio: "Thambabattula Mohan is a Data Developer at Segmento, focused on designing and building robust data pipelines, databases, and analytical systems that support data-driven decision-making.",
    image: "/images/mohan.png",
    linkedin: "http://www.linkedin.com/in/mohan-thambabattula",
  },
  {
    name: "Maddila Vijayalakshmi",
    role: "Full Stack Developer",
    bio: "Maddila Vijayalakshmi is a Full Stack Developer at Segmento, focused on building scalable, secure, and high-performance web applications.",
    image: "/images/vijayalakshmi.png",
    linkedin: "http://www.linkedin.com/in/maddila-vijayalakshmi-3320ba29a",
  },
  {
    name: "Vedhagiri Thejesh Naidu",
    role: "Intern",
    bio: "Vedhagiri Thejesh Naidu is a Intern at Segmento, focused on learning and supporting data analysis, processing, and visualization tasks.",
    image: "/images/thejesh.png",
    linkedin: "http://www.linkedin.com/in/thejesh-naidu-4439a0304",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-blue-100">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-blue-100">
        <div className="absolute top-0 right-0 w-125 h-125 bg-blue-50/50 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left animate-in fade-in slide-in-from-left-4 duration-1000">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] mb-8 tracking-tight leading-[1.05]">
              Securing the World's Data with <br />
              <span className="text-blue-500">Transparent AI</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed font-medium">
              Segmento is committed to engineering-first, explainable security, from real-world data intelligence for global organizations.
            </p>
            <div className="flex flex-wrap gap-4">
              
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center rounded-full overflow-hidden">
              <div className="absolute inset-12 bg-blue-100/30 blur-[80px] rounded-full" />
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0 border border-blue-100 rounded-full" 
              />
              <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                <img
                  src="/brain1.png"
                  alt="Neural Network Intelligence"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.25)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative overflow-hidden bg-blue-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-12 tracking-tight">Mission</h2>
          <div className="relative group p-1.5 rounded-3xl bg-transparent transition-all duration-500 overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.08)]">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-20 bg-linear-to-r from-blue-300 via-white to-blue-200 opacity-0 group-hover:opacity-100 blur-[20px] transition-opacity duration-700"
            />
            <div className="relative z-10 bg-blue-100rounded-3xl p-12 border border-slate-100 group-hover:border-transparent transition-all duration-500">
              <h3 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-8 leading-[1.15]">
                Our Mission: Moving Beyond <br />
                <span className="text-slate-900 group-hover:text-blue-600 transition-colors duration-500">Black-Box Security</span>
              </h3>
              <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
                Segmento is transparent approach to enhance the data endure black-box security, and soscd enable all roomdeats, what alioit your ultra world that some orienting mares the data to mindent explainable security engineening, our global software resources overs the tinrh to choose and clear organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-32 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">Leadership</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">The visionary team behind Segmento's privacy-centric data intelligence.</p>
          </div>

          {/* Featured Director Card - Colorful and Balanced */}
          <div className="mb-20">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="grid md:grid-cols-3 items-center">
                <div className="md:col-span-1 aspect-square relative overflow-hidden bg-slate-200">
                  <img 
                    src={director.image} 
                    alt={director.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="md:col-span-2 p-8 md:p-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0F172A] mb-1">{director.name}</h3>
                      <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">{director.role}</p>
                    </div>
                    <a href={director.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0077b5]">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{director.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Grid - Reduced height, Colorful, and Full Bio Display */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* aspect-[16/10] makes the image shorter and wider */}
                <div className="aspect-[16/16] w-full relative overflow-hidden bg-slate-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-[#0077b5] transition-all">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                  <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-3">{member.role}</p>
                  {/* line-clamp removed to show full info */}
                  <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-10 md:p-14 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 blur-[100px] rounded-full -z-10" />
            
            <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
              By the Numbers
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
              {/* Stat 1: Scanned */}
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                   <Database className="w-6 h-6 text-[#0F172A] group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#0F172A] tracking-tighter">10B+</div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">Scanned</div>
                </div>
              </div>

              {/* Stat 2: Breaches */}
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                   <LockIcon className="w-6 h-6 text-[#0F172A] group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#0F172A] tracking-tighter">0</div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">Breaches</div>
                </div>
              </div>

              {/* Stat 3: Client-Side */}
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                   <Laptop className="w-6 h-6 text-[#0F172A] group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#0F172A] tracking-tighter">100%</div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">Client-Side</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-24 px-4 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0F172A] rounded-2xl p-12 md:p-20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-600/5 blur-[120px] group-hover:bg-blue-600/10 transition-colors" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10 tracking-tight">
                Join Our Engineering-First Team
              </h2>
              <button className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-lg relative z-10 hover:bg-blue-600 shadow-xl transition-all">
                View Open Roles
              </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}