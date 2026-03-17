"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Menu, X, ArrowUpRight } from "lucide-react";

export function SenseNavbar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isInsideSense = pathname === "/pricing" || pathname?.includes('/demo');
    const backUrl = isInsideSense ? "/" : "https://segmento.in";
    const backText = isInsideSense ? "Back to Sense" : "Back to Segmento.in";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "https://segmento.in/contact", isExternal: true },
    ];

    if (!mounted) return <div className="h-16 bg-[#020617]" />;

    return (
        <nav className="fixed top-0 w-full z-[100] bg-[#020617]/70 backdrop-blur-xl border-b border-white/[0.04] py-3">
            <div className="container mx-auto px-6 flex items-center justify-between">
                
                {/* 1. DYNAMIC LOGO: Mesh Gradient & Pulse */}
                <Link href="/" className="flex items-center gap-3 group whitespace-nowrap">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-2xl border border-white/20">
                            <Zap size={18} className="text-white fill-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black text-lg tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                            SEGMENTO
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                            <span className="text-slate-500 font-bold text-[9px] tracking-[0.3em] uppercase group-hover:text-white transition-colors">
                                SENSE
                            </span>
                        </div>
                    </div>
                </Link>

                {/* 2. LIQUID TABS: Sliding Pill Animation */}
                <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full p-1.5 relative shadow-2xl">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const linkContent = (
                            <span className={`relative z-10 px-6 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 ${
                                isActive ? "text-white" : "text-slate-400 hover:text-white"
                            }`}>
                                {link.name}
                            </span>
                        );

                        return (
                            <div key={link.name} className="relative">
                                {link.isExternal ? (
                                    <a href={link.href}>{linkContent}</a>
                                ) : (
                                    <Link href={link.href}>{linkContent}</Link>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 3. HIGH-CONTRAST ACTIONS */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/demo">
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(255, 255, 255, 0.1)" }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-white text-[#020617] px-6 py-2.5 rounded-xl text-[12px] font-black shadow-2xl flex items-center gap-2 tracking-tight"
                        >
                            TRY FOR FREE
                            <ArrowUpRight size={14} strokeWidth={3} />
                        </motion.button>
                    </Link>

                    <Link
                        href={backUrl}
                        className="group flex items-center text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-blue-400 transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
                        {backText}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed inset-y-0 right-0 w-[300px] bg-[#020617] border-l border-white/10 p-10 flex flex-col gap-8 lg:hidden shadow-3xl z-[101]"
                    >
                        <div className="flex justify-end">
                            <button onClick={() => setMobileMenuOpen(false)}><X className="text-white" /></button>
                        </div>
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="text-3xl font-black text-white hover:text-blue-500 transition-colors uppercase italic">{link.name}</a>
                        ))}
                        <div className="mt-auto flex flex-col gap-4">
                            <Link href="/demo" className="w-full">
                                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg">TRY FOR FREE</button>
                            </Link>
                            <Link href={backUrl} className="text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                                {backText}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}