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
    <div className="bg-primary min-h-screen font-sans">
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

        {/* TABLE */}
        <div className="border-2 border-black overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              {/* HEADER */}
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-[0.4em]">
                    Role & Type
                  </th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-[0.4em] hidden sm:table-cell">
                    Location
                  </th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-[0.4em] text-right">
                    Action
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody
  style={{
    background: "var(--color-background-secondary)",
    color: "var(--color-heading)",
  }}
>
  <AnimatePresence>
    {filteredRoles.map((role, index) => (
      <motion.tr
        key={role.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className="border-b last:border-b-0 transition-all"
        style={{
          borderColor: "var(--color-border)",
        }}

        /* ✅ FIX HOVER PROPERLY FOR BOTH THEMES */
        onMouseEnter={(e) => {
          const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

          e.currentTarget.style.background = isDark
            ? "#e5e7eb"   // gray in dark mode (your requirement)
            : "#f8fafc";  // light mode hover

          e.currentTarget.style.color = isDark ? "#000000" : "inherit";
        }}

        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-heading)";
        }}
      >
        {/* ROLE */}
        <td className="px-8 py-6">
          <h3 className="text-lg font-medium">
            {role.title}
          </h3>

          <div className="flex items-center gap-3 mt-1 text-[10px] uppercase tracking-widest opacity-70">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {role.type}
            </span>
          </div>
        </td>

        {/* LOCATION */}
        <td className="px-8 py-6 hidden sm:table-cell">
          <div className="flex items-center gap-2 text-[11px] uppercase">
            <Globe className="w-4 h-4" /> Remote
          </div>
        </td>

        {/* BUTTON */}
        <td className="px-8 py-6 text-right">
          <Link
            href={`/careers/${role.id}`}
            className="
              inline-flex items-center gap-2
              px-5 py-2.5
              text-[10px] uppercase tracking-widest
              font-bold rounded
              transition-all
            "
            style={{
              backgroundColor: "#3b82f6", // ROYAL BLUE (dark mode fixed)
              color: "#ffffff",
            }}
          >
            Apply Now
            <ArrowRight className="w-3 h-3" />
          </Link>
        </td>
      </motion.tr>
    ))}
  </AnimatePresence>
</tbody>

            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}