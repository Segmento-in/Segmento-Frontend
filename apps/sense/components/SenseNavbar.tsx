"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Menu, X, ArrowUpRight, ChevronRight } from "lucide-react";

export function SenseNavbar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    const isInsideSense = pathname === "/pricing" || pathname?.includes('/demo');
    const backUrl = isInsideSense ? "/" : "https://segmento.in";
    const backText = isInsideSense ? "Back to Sense" : "Back to Segmento.in";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Compare", href: "/#comparison-table" },
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "/contact", isExternal: true },
    ];

    if (!mounted) return <div className="h-16 bg-[#020617]" />;

    return (
        <nav className="fixed top-0 w-full z-[100] bg-[#020617] lg:bg-[#020617]/80 lg:backdrop-blur-xl border-b border-white/[0.04] py-4">
            <div className="container mx-auto px-6 flex items-center justify-between">
                
                {/* LOGO SECTION */}
                <Link href="/" className="flex items-center gap-3 group whitespace-nowrap z-[110]">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 blur-lg opacity-40 group-hover:opacity-80 transition-opacity" />
                        <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center border border-white/20">
                            <Zap size={18} className="text-white fill-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black text-lg tracking-tighter leading-none uppercase">
                            SEGMENTO
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                            <span className="text-slate-500 font-bold text-[9px] tracking-[0.3em] uppercase">
                                SENSE
                            </span>
                        </div>
                    </div>
                </Link>

                {/* DESKTOP NAV TABS */}
                <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full p-1 relative">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <div key={link.name} className="relative">
                                {link.isExternal ? (
                                    <a href={link.href} className={`relative z-10 px-6 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                                        isActive ? "text-white" : "text-slate-400 hover:text-white"
                                    }`}>
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link href={link.href} className={`relative z-10 px-6 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                                        isActive ? "text-white" : "text-slate-400 hover:text-white"
                                    }`}>
                                        {link.name}
                                    </Link>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-blue-600 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* DESKTOP ACTIONS */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/demo">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-[#020617] px-5 py-2 rounded-xl text-[11px] font-black shadow-xl flex items-center gap-2"
                        >
                            TRY FOR FREE
                            <ArrowUpRight size={14} strokeWidth={3} />
                        </motion.button>
                    </Link>
                </div>

                {/* MOBILE TOGGLE */}
                <button 
                    className="lg:hidden z-[110] text-white p-2.5 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* MOBILE NAVIGATION OVERLAY */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] lg:hidden"
                        />
                        
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-[360px] bg-[#020617] border-l border-white/10 p-8 flex flex-col z-[102] lg:hidden shadow-2xl"
                        >
                            <div className="mt-20 flex flex-col gap-2">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 pl-1">Menu</p>
                                {navLinks.map((link) => (
                                    link.isExternal ? (
                                        <a 
                                            key={link.name} 
                                            href={link.href} 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center justify-between py-5 px-1 border-b border-white/[0.03] group`}
                                        >
                                            <span className={`text-xl font-bold tracking-tight transition-colors ${
                                                pathname === link.href ? "text-blue-500" : "text-slate-300"
                                            }`}>
                                            {link.name}
                                        </span>
                                        <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                                    {link.isExternal ? </a> : </Link>}
                                ))}
                            </div>

                            <div className="mt-auto flex flex-col gap-4">
                                <Link href="/demo" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(37,99,235,0.2)] active:scale-95 transition-transform flex items-center justify-center gap-3">
                                        TRY FOR FREE
                                        <ArrowUpRight size={20} strokeWidth={3} />
                                    </button>
                                </Link>
                                
                                <Link 
                                    href={backUrl} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={12} />
                                    {backText}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}