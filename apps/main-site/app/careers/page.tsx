"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Search, Globe, Clock } from "lucide-react";
import Link from "next/link";

// Shared Layout Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const openRoles = [
  { id: 1, title: "Senior Frontend Engineer", team: "Product / Pulse", location: "Remote", type: "Full-time", color: "blue" },
  { id: 2, title: "AI Research Scientist", team: "Core / Sense", location: "Remote", type: "Full-time", color: "indigo" },
  { id: 3, title: "Data Infrastructure Engineer", team: "Platform / Collect", location: "Remote", type: "Full-time", color: "sky" },
  { id: 4, title: "UI/UX Product Designer", team: "Design", location: "Remote", type: "Contract", color: "purple" },
];

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = openRoles.filter(role => 
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-sky-50 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      
      {/* Spacer */}
      <div className="h-24" /> 

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        {/* --- HEADER SECTION --- */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-[#0F172A] pb-10"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                Open <span className="text-blue-600">Positions</span>
              </h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">
                Join the Segmento distributed team
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-sky-50 border-2 border-[#0F172A] uppercase tracking-widest text-[10px] outline-none transition-all focus:bg-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]" />
            </div>
          </motion.div>
        </header>

        {/* --- TABLE SECTION --- */}
        <div className="relative">
          <div className="border-2 border-[#0F172A] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0F172A] text-white">
                  <tr>
                    {/* Reduced font weight from black to medium for headers */}
                    <th className="px-8 py-4 text-[10px] font-medium uppercase tracking-[0.4em]">Role & Type</th>
                    <th className="px-8 py-4 text-[10px] font-medium uppercase tracking-[0.4em] hidden sm:table-cell">Location</th>
                    <th className="px-8 py-4 text-[10px] font-medium uppercase tracking-[0.4em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-sky-50">
                  <AnimatePresence mode="popLayout">
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((role, index) => (
                        <motion.tr 
                          key={role.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="group border-b-2 border-slate-100 last:border-b-0 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <td className="px-8 py-6">
                            {/* Changed from text-2xl font-black to text-lg font-medium */}
                            <h3 className="text-lg font-medium text-[#0F172A] group-hover:text-blue-600 transition-colors">
                              {role.title}
                            </h3>
                            {/* Changed from font-bold to font-normal */}
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-normal uppercase tracking-widest text-slate-400">
                               <span className="flex items-center gap-1 text-blue-500/60"><Clock className="w-3 h-3" /> {role.type}</span>
                               <span className="sm:hidden flex items-center gap-1"><MapPin className="w-3 h-3" /> Remote</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 hidden sm:table-cell">
                            {/* Changed from font-bold to font-normal */}
                            <div className="flex items-center gap-2 text-slate-600 font-normal uppercase tracking-widest text-[11px]">
                              <Globe className="w-4 h-4 text-blue-500" /> Remote
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <Link 
                              href={`/careers/${role.id}`} 
                              className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 font-medium text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-10 py-24 text-center">
                          <p className="font-medium text-slate-300 uppercase tracking-[0.3em] text-sm">
                            No matching positions found
                          </p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- SPONTANEOUS SECTION --- */}
        
      </main>

      <Footer />
    </div>
  );
}