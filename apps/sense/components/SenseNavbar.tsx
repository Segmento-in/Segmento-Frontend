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
        // Prevent scrolling when mobile menu is open
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
        { name: "Pricing", href: "/pricing" },
        { name: "Contact", href: "https://segmento.in/contact", isExternal: true },
    ];

    if (!mounted) return <div className="h-16 bg-[#020617]" />;

    return (
        <nav className="fixed top-0 w-full z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/[0.04] py-4">
            <div className="container mx-auto px-6 flex items-center justify-between">
                
                {/* LOGO */}
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
                        const linkContent = (
                            <span className={`relative z-10 px-6 py-1.5 rounded-full text-[13px] font-bold transition-all ${
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
                                        className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]"
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

                    <Link
                        href={backUrl}
                        className="group flex items-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 hover:text-blue-400 transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
                        {backText}
                    </Link>
                </div>

                {/* MOBILE TOGGLE - Enhanced Z-index */}
                <button 
                    className="lg:hidden z-[110] text-white p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-transform" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* MOBILE NAVIGATION OVERLAY */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop Blur */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[101] lg:hidden"
                        />
                        
                        {/* Slide-in Menu */}
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-[#020617] border-l border-white/10 p-8 flex flex-col z-[102] lg:hidden shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="mt-16 flex flex-col gap-4">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Navigation</p>
                                {navLinks.map((link) => (
                                    <a 
                                        key={link.name} 
                                        href={link.href} 
                                        className={`flex items-center justify-between py-4 border-b border-white/5 text-2xl font-black transition-colors ${
                                            pathname === link.href ? "text-blue-500" : "text-white"
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                        <ChevronRight size={20} className="text-slate-600" />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-auto flex flex-col gap-6">
                                <Link href="/demo" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                                        TRY FOR FREE
                                        <ArrowUpRight size={20} strokeWidth={3} />
                                    </button>
                                </Link>
                                
                                <Link 
                                    href={backUrl} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs py-2 hover:text-white"
                                >
                                    <ArrowLeft size={14} />
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