"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
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
  image: "/images/Female-placeholder.jpg",
  linkedin: "https://www.linkedin.com/in/geeta-reddy-karri-0126163a3",
};

const team = [
  {
    name: "Anuksha Shirgave",
    role: "Web & UI Developer",
    bio: "Anuksha Shirgave is a UI & Web Developer at Segmento, focused on building clean, responsive, and user-friendly web interfaces. She specializes in transforming ideas and designs into high-performance websites using modern frontend technologies.",
    image: "/images/Female-placeholder.jpg",
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
    image: "/images/male-placeholder.jpg",
    linkedin: "http://www.linkedin.com/in/mohan-thambabattula",
  },
  {
    name: "Maddila Vijayalakshmi",
    role: "Full Stack Developer",
    bio: "Maddila Vijayalakshmi is a Full Stack Developer at Segmento, focused on building scalable, secure, and high-performance web applications.",
    image: "/images/Female-placeholder.jpg",
    linkedin: "http://www.linkedin.com/in/maddila-vijayalakshmi-3320ba29a",
  },

];

const milestones = [
  {
    month: "NOV",
    year: "2025",
    title: "Segmento is Founded",
    description:
      "On November 27, 2025, Segmento was incorporated with a bold mandate: build privacy-first, AI-native data products for the modern enterprise — where data finds itself, protects itself, and works for you.",
    color: "#5b6ef5",
  },
  {
    month: "DEC",
    year: "2025",
    title: "Segmento Sense v1 Ships",
    description:
      "Our first product — an AI-powered data classification and PII redaction engine — reaches production. 99.8% AI confidence. Fully client-side processing. No sensitive data ever leaves your environment.",
    color: "#8b5cf6",
  },
  {
    month: "JAN",
    year: "2026",
    title: "Segmento Pulse Goes Live",
    description:
      "Segmento Pulse launches on January 10, 2026 — a real-time technology intelligence hub delivering curated AI, cloud, and data privacy news directly to enterprise teams worldwide.",
    color: "#3b82f6",
  },
  {
    month: "FEB",
    year: "2026",
    title: "Collect & Resolve Join the Platform",
    description:
      "Segmento Collect (universal data pipeline with 24-hour recovery window) and Segmento Resolve (DSAR Kanban board with 98% SLA) expand the suite — giving enterprises a full end-to-end data governance stack.",
    color: "#06b6d4",
  },
  {
    month: "MAY",
    year: "2026",
    title: "Five Products. One Platform.",
    description:
      "Segmento SprintQL — a multiplayer collaborative retrospectives board — completes the platform suite. Five AI-native products, one shared privacy-first foundation, built to power the modern data-driven enterprise.",
    color: "#10b981",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--theme-bg)", color: "var(--theme-fg)" }}>
      <Navbar />

      {/* Hero Section — Investate-inspired */}
      <section className="pt-32 pb-0 relative overflow-hidden" style={{ background: "var(--theme-bg)" }}>

        {/* Subtle brand glow top-left */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[400px] -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top left, var(--theme-brand-glow), transparent 70%)" }}
        />

        <div className="section-container">

          {/* ── Row 1: Brand label + Headline | Description ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-14"
          >
            {/* Brand eyebrow label */}
            <p
              className="text-label-caps mb-6"
              style={{ color: "var(--theme-brand)" }}
            >
              We are Segmento
            </p>

            {/* 2-column: headline left, description right */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end">

              {/* Left — big punchy headline (DOM first = mobile stacks correctly) */}
              <h1 className="text-display-lg leading-[1.08]" style={{ color: "var(--theme-fg)" }}>
                We set out to build{" "}
                <span style={{ color: "var(--theme-fg-subtle)" }}>
                  a new kind of data intelligence.
                </span>
              </h1>

              {/* Right — short description (DOM second = sits right on desktop) */}
              <p
                className="text-body-lg lg:pb-2"
                style={{ color: "var(--theme-fg-subtle)" }}
              >
                Together — the engineers and enterprises of Segmento — we are
                reinventing how sensitive data is found, protected, and
                orchestrated, end-to-end.
              </p>
            </div>
          </motion.div>

          {/* ── Row 2: Two side-by-side photos ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="grid grid-cols-2 gap-4 lg:gap-6"
          >
            {/* Photo left — team celebration */}
            <div className="relative overflow-hidden rounded-xl lg:rounded-2xl aspect-[4/3] w-full">
              <img
                src="/hero-team.png"
                alt="Segmento team celebrating a milestone"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Thin brand-tinted overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                style={{ background: "var(--theme-brand-glow)" }}
              />
            </div>

            {/* Photo right — collaboration / workspace */}
            <div className="relative overflow-hidden rounded-xl lg:rounded-2xl aspect-[4/3] w-full">
              <img
                src="/hero-workspace.png"
                alt="Segmento team collaborating at work"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                style={{ background: "var(--theme-brand-glow)" }}
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Our Story Section — editorial asymmetric layout */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: "var(--theme-bg)" }}>

        {/* Faint divider line top */}
        <div className="section-container">
          <div
            className="w-full h-px mb-16"
            style={{ background: "var(--theme-border)" }}
          />
        </div>

        <div className="section-container">
          {/* Asymmetric grid: 2fr left (heading) | 3fr right (content) */}
          <div className="grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20">

            {/* ── LEFT: Section heading ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2
                className="text-headline-md lg:text-4xl font-bold tracking-tight flex items-center gap-2"
                style={{ color: "var(--theme-fg)", fontFamily: "var(--font-syne)" }}
              >
                Our Story
                <span
                  className="text-2xl font-light"
                  style={{ color: "var(--theme-brand)" }}
                >
                  ↗
                </span>
              </h2>
            </motion.div>

            {/* ── RIGHT: Story paragraphs + founder quote ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              {/* Story body paragraphs */}
              <div className="space-y-5 mb-10">
                <p
                  className="text-body-lg leading-relaxed"
                  style={{ color: "var(--theme-fg-subtle)" }}
                >
                  Segmento was born on{" "}
                  <span style={{ color: "var(--theme-fg)", fontWeight: 600 }}>
                    November 27, 2025
                  </span>{" "}
                  — an auspicious day that marked the beginning of something
                  different. Our mission from day one was unambiguous: build
                  privacy-first, AI-native data products that solve real
                  enterprise challenges without compromise.
                </p>

                <p
                  className="text-body-lg leading-relaxed"
                  style={{ color: "var(--theme-fg-subtle)" }}
                >
                  We started by asking a hard question: why should an enterprise
                  have to send raw sensitive data to a third party just to
                  understand it? Every existing tool required data to leave its
                  origin — creating a hidden liability. Segmento&apos;s answer was
                  to build the world&apos;s first fully{" "}
                  <span style={{ color: "var(--theme-fg)", fontWeight: 600 }}>
                    client-side data intelligence platform
                  </span>
                  . Data finds, classifies, and governs itself — without ever
                  leaving your environment.
                </p>

                <p
                  className="text-body-lg leading-relaxed"
                  style={{ color: "var(--theme-fg-subtle)" }}
                >
                  Within weeks of launch, we shipped{" "}
                  <span style={{ color: "var(--theme-fg)", fontWeight: 600 }}>
                    Segmento Sense
                  </span>{" "}
                  — our AI-native data classification framework — and followed in
                  January 2026 with{" "}
                  <span style={{ color: "var(--theme-fg)", fontWeight: 600 }}>
                    Segmento Pulse
                  </span>
                  , a real-time technology intelligence hub. Both products share
                  the same foundation: intelligence that works for you, not
                  against your privacy.
                </p>
              </div>

              {/* Thin separator */}
              <div
                className="w-full h-px mb-8"
                style={{ background: "var(--theme-border-subtle)" }}
              />

              {/* Founder chip: avatar + name + role */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border"
                  style={{
                    borderColor: "var(--theme-border)",
                    background: "var(--theme-bg-surface-high)",
                  }}
                >
                  <img
                    src="/images/Female-placeholder.jpg"
                    alt="Geetha Reddy K"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm leading-tight"
                    style={{ color: "var(--theme-fg)", fontFamily: "var(--font-mona-sans)" }}
                  >
                    Geetha Reddy K
                  </p>
                  <p
                    className="text-label-caps mt-0.5"
                    style={{ color: "var(--theme-fg-muted)" }}
                  >
                    Executive Director &amp; Founder
                  </p>
                </div>
              </div>

              {/* Pull quote */}
              <blockquote
                className="text-body-md italic leading-relaxed"
                style={{
                  color: "var(--theme-fg-subtle)",
                  fontFamily: "var(--font-mona-sans)",
                  borderLeft: "2px solid var(--theme-brand)",
                  paddingLeft: "1.25rem",
                }}
              >
                &ldquo;We didn&apos;t build Segmento to add another tool to the
                stack. We built it to give enterprises the foundation they never
                had — one where data finds itself, protects itself, and works for
                you.&rdquo;
              </blockquote>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Leadership Section — Nectar-style glassmorphism grid */}
      <section className="py-24 lg:py-32" style={{ background: "var(--theme-bg-surface)" }}>
        <div className="section-container">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <p
              className="text-label-caps mb-3"
              style={{ color: "var(--theme-brand)" }}
            >
              Founder &amp; Leadership Team
            </p>
            <h2
              className="text-headline-md lg:text-4xl font-bold tracking-tight mb-4"
              style={{ color: "var(--theme-fg)", fontFamily: "var(--font-syne)" }}
            >
              Meet the People Behind Segmento
            </h2>
            <p
              className="text-body-md mx-auto"
              style={{ color: "var(--theme-fg-subtle)", maxWidth: "520px" }}
            >
              From strategy to culture, our team inspires innovation and growth
              every step of the way.
            </p>
          </motion.div>

          {/* ── Featured Director card — horizontal ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <div
              className="bento-tile overflow-hidden group"
              style={{ padding: 0 }}
            >
              <div className="grid md:grid-cols-[300px_1fr]">
                {/* Photo */}
                <div
                  className="relative overflow-hidden"
                  style={{ minHeight: "320px" }}
                >
                  <img
                    src={director.image}
                    alt={director.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Info */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <p
                    className="text-label-caps mb-3"
                    style={{ color: "var(--theme-brand)" }}
                  >
                    Executive Director &amp; Founder
                  </p>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: "var(--theme-fg)", fontFamily: "var(--font-syne)" }}
                  >
                    {director.name}
                  </h3>
                  <div
                    className="w-8 h-px mb-5"
                    style={{ background: "var(--theme-brand)" }}
                  />
                  <p
                    className="text-body-md leading-relaxed mb-6"
                    style={{ color: "var(--theme-fg-subtle)" }}
                  >
                    {director.bio}
                  </p>
                  <a
                    href={director.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-fit transition-opacity hover:opacity-70"
                    style={{ color: "var(--theme-fg-muted)" }}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-label-caps">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Team grid — 4 members, glassmorphism photo cards ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
                className="relative overflow-hidden rounded-2xl group cursor-pointer"
                style={{
                  aspectRatio: "3/4",
                  border: "1px solid var(--theme-border)",
                }}
              >
                {/* Photo — object-top biases crop toward face */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Permanent gradient — ensures text legibility always */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)",
                  }}
                />

                {/* Glassmorphism name card — bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{
                    background: "rgba(10, 10, 15, 0.50)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3
                    className="font-semibold text-sm leading-tight mb-0.5"
                    style={{
                      color: "#ffffff",
                      fontFamily: "var(--font-mona-sans)",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-label-caps mb-2.5"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {member.role}
                  </p>
                  {/* LinkedIn — slides in on hover */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: "var(--theme-brand)" }}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span className="text-label-caps">Connect</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* Journey Timeline Section — Nectar-exact alternating single-row */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: "var(--theme-bg)" }}>
        <div className="section-container">

          {/* Top rule */}
          <div className="w-full h-px mb-16" style={{ background: "var(--theme-border)" }} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <span className="chip mb-4 inline-flex" style={{ borderColor: "var(--theme-brand)", color: "var(--theme-brand)" }}>
              Milestones
            </span>
            <h2 className="text-headline-md lg:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--theme-fg)", fontFamily: "var(--font-syne)" }}>
              The Journey of Segmento
            </h2>
            <p className="text-body-md mx-auto" style={{ color: "var(--theme-fg-subtle)", maxWidth: "520px" }}>
              Our journey is more than just dates — it&apos;s a story of growth, innovation,
              and relentless dedication to building AI-native data intelligence for the modern enterprise.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">

            {/* Desktop centre spine */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
              style={{ width: "1.5px", background: "var(--theme-border)" }}
            />
            {/* Mobile left spine */}
            <div
              className="md:hidden absolute top-0 bottom-0"
              style={{ left: "28px", width: "1.5px", background: "var(--theme-border)" }}
            />

            <div>
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={m.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.1 }}
                    className="relative"
                    style={{ paddingBottom: "52px" }}
                  >
                    {/* ── DESKTOP ── */}
                    <div className="hidden md:grid md:grid-cols-2" style={{ minHeight: "100px" }}>

                      {isLeft ? (
                        <>
                          {/* LEFT col: text + [badge][line][▶] flush right */}
                          <div className="flex items-center justify-end">
                            {/* Text block */}
                            <div className="text-right" style={{ maxWidth: "300px", paddingRight: "20px" }}>
                              <p
                                className="mb-1.5"
                                style={{ color: m.color, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}
                              >
                                {m.month} {m.year}
                              </p>
                              <h3
                                className="mb-2"
                                style={{ color: "var(--theme-fg)", fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 700, lineHeight: 1.35 }}
                              >
                                {m.title}
                              </h3>
                              <p style={{ color: "var(--theme-fg-subtle)", fontSize: "13.5px", lineHeight: 1.65 }}>
                                {m.description}
                              </p>
                            </div>
                            {/* Badge */}
                            <div
                              className="flex flex-col items-center justify-center rounded-xl flex-shrink-0"
                              style={{ background: m.color, padding: "10px 18px", minWidth: "74px" }}
                            >
                              <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}>
                                {m.month}
                              </span>
                              <span style={{ color: "#fff", fontSize: "40px", fontWeight: 800, lineHeight: 1.05, fontFamily: "var(--font-dm-mono)" }}>
                                {m.year.slice(2)}
                              </span>
                            </div>
                            {/* Connector line */}
                            <div style={{ width: "52px", height: "2px", background: m.color, flexShrink: 0 }} />
                            {/* Triangle → pointing right toward spine */}
                            <div style={{
                              width: 0, height: 0, flexShrink: 0,
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderLeft: `10px solid ${m.color}`,
                            }} />
                          </div>
                          {/* RIGHT col: empty */}
                          <div />
                        </>
                      ) : (
                        <>
                          {/* LEFT col: empty */}
                          <div />
                          {/* RIGHT col: [◀][line][badge] then text */}
                          <div className="flex items-center justify-start">
                            {/* Triangle ◀ pointing left toward spine */}
                            <div style={{
                              width: 0, height: 0, flexShrink: 0,
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderRight: `10px solid ${m.color}`,
                            }} />
                            {/* Connector line */}
                            <div style={{ width: "52px", height: "2px", background: m.color, flexShrink: 0 }} />
                            {/* Badge */}
                            <div
                              className="flex flex-col items-center justify-center rounded-xl flex-shrink-0"
                              style={{ background: m.color, padding: "10px 18px", minWidth: "74px" }}
                            >
                              <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}>
                                {m.month}
                              </span>
                              <span style={{ color: "#fff", fontSize: "40px", fontWeight: 800, lineHeight: 1.05, fontFamily: "var(--font-dm-mono)" }}>
                                {m.year.slice(2)}
                              </span>
                            </div>
                            {/* Text block */}
                            <div className="text-left" style={{ maxWidth: "300px", paddingLeft: "20px" }}>
                              <p
                                className="mb-1.5"
                                style={{ color: m.color, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}
                              >
                                {m.month} {m.year}
                              </p>
                              <h3
                                className="mb-2"
                                style={{ color: "var(--theme-fg)", fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 700, lineHeight: 1.35 }}
                              >
                                {m.title}
                              </h3>
                              <p style={{ color: "var(--theme-fg-subtle)", fontSize: "13.5px", lineHeight: 1.65 }}>
                                {m.description}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* ── MOBILE: stacked with left spine ── */}
                    <div className="md:hidden relative" style={{ paddingLeft: "56px" }}>
                      {/* Mobile spine dot */}
                      <div
                        className="absolute z-10 rounded-full"
                        style={{
                          left: "22px", top: "14px",
                          width: "12px", height: "12px",
                          background: m.color,
                          boxShadow: `0 0 10px ${m.color}80`,
                          border: "2px solid var(--theme-bg)",
                        }}
                      />
                      {/* Mobile badge */}
                      <div
                        className="inline-flex flex-col items-center justify-center rounded-lg mb-3"
                        style={{ background: m.color, padding: "6px 14px", minWidth: "58px" }}
                      >
                        <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-dm-mono)" }}>
                          {m.month}
                        </span>
                        <span style={{ color: "#fff", fontSize: "30px", fontWeight: 800, lineHeight: 1.05, fontFamily: "var(--font-dm-mono)" }}>
                          {m.year.slice(2)}
                        </span>
                      </div>
                      <h3 className="mb-1.5" style={{ color: "var(--theme-fg)", fontFamily: "var(--font-syne)", fontSize: "15px", fontWeight: 700 }}>
                        {m.title}
                      </h3>
                      <p style={{ color: "var(--theme-fg-subtle)", fontSize: "13px", lineHeight: 1.65 }}>
                        {m.description}
                      </p>
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>
      </section>











      {/* Join Team CTA */}
      <section className="py-24 px-4 mb-24 dark-careers-section">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0F172A] rounded-2xl p-12 md:p-20 text-center relative overflow-hidden group dark-careers-box">
            <div className="absolute inset-0 bg-blue-600/5 blur-[120px] group-hover:bg-blue-600/10 transition-colors" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10 tracking-tight dark-careers-text">
              Join Our Engineering-First Team
            </h2>
            <Link href="/careers">
              <button
                className="px-8 py-4 text-white font-bold rounded-lg relative z-10 shadow-xl transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-button)",
                }}
              >
                View Open Roles
              </button>
            </Link>
          </div>
        </div>

        {/* ✅ DARK MODE FIX */}
        <style jsx global>{`
          [data-theme="dark"] .dark-careers-section {
            background: #000000 !important; /* section black */
          }

          [data-theme="dark"] .dark-careers-box {
            background: #e5e7eb !important; /* GRAY box (what you want) */
          }

          [data-theme="dark"] .dark-careers-text {
            color: #000000 !important; /* black text on gray box */
          }
        `}</style>
      </section>

      <Footer />
    </main>
  );
}