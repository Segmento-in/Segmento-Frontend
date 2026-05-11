"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Search, Globe, Clock } from "lucide-react";
import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const openRoles = [
  { id: 1, title: "Senior Frontend Engineer", team: "Product / Pulse", location: "Remote", type: "Full-time" },
  { id: 2, title: "AI Research Scientist", team: "Core / Sense", location: "Remote", type: "Full-time" },
  { id: 3, title: "Data Infrastructure Engineer", team: "Platform / Collect", location: "Remote", type: "Full-time" },
  { id: 4, title: "UI/UX Product Designer", team: "Design", location: "Remote", type: "Contract" },
];

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = openRoles.filter(role =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <div className="h-24" />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">

        {/* HEADER */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-black pb-10"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-primary uppercase">
                Open <span className="text-[var(--color-brand)]">Positions</span>
              </h1>

              <p className="text-muted text-sm font-bold uppercase tracking-widest mt-2">
                Join the Segmento distributed team
              </p>
            </div>

            {/* SEARCH BOX */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-4
                  bg-secondary text-primary
                  border-2 border-black
                  uppercase tracking-widest text-[10px]
                  outline-none transition-all
                  focus:bg-white
                "
                style={{
                  backgroundColor: "var(--color-background-secondary)",
                  color: "var(--color-heading)"
                }}
              />

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            </div>
          </motion.div>
        </header>

        {/* CARDS GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-3d p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 group"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start mb-6">
                  {/* Pill Tag */}
                  <div className="pill-tag">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]"></span>
                    {role.team}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-subtle)] uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5" /> {role.location}
                  </div>
                </div>

                {/* Role Info */}
                <h3 className="text-2xl font-black text-[var(--color-heading)] mb-2">
                  {role.title}
                </h3>
                <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-[var(--color-body)]">
                  <Clock className="w-4 h-4 text-[var(--color-brand)]" /> {role.type}
                </div>

                {/* Action */}
                <div className="mt-auto pt-4 border-t border-[var(--color-border-light)]">
                  <Link
                    href={`/careers/${role.id}`}
                    className="inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-brand)] uppercase tracking-widest group-hover:gap-3 transition-all"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>

      <Footer />
    </div>
  );
}