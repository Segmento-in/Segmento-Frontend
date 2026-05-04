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
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    }, [mobileMenuOpen]);

    const isInsideSense = pathname?.includes('/demo');
    const backUrl = isInsideSense ? "/" : "https://segmento.in";
    const backText = isInsideSense ? "BACK TO SENSE" : "BACK TO SEGMENTO";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Compare", href: "/#comparison-table" },
    ];

    if (!mounted) return <div className="h-16 bg-[#020617]" />;

    return (
        <nav className="fixed top-0 w-full z-[100] bg-[#020617] lg:bg-[#020617]/80 lg:backdrop-blur-xl border-b border-white/[0.04] py-4">
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

                {/* DESKTOP NAV */}
                <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full p-1 relative">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <div key={link.name} className="relative flex items-center">
                                <Link href={link.href}>
                                    <span className={`relative z-10 px-6 py-1.5 rounded-full text-[13px] font-bold ${isActive ? "text-white" : "text-slate-400 hover:text-white"
                                        }`}>
                                        {link.name}
                                    </span>
                                </Link>
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

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-2">

                    {/* MOBILE MENU BUTTON (FIRST) */}
                    <button
                        className="lg:hidden text-white p-2.5 bg-white/5 rounded-xl border border-white/10 order-1"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* MOBILE BACK BUTTON (AFTER MENU) */}
                    <a href={backUrl} className="md:hidden order-2">
                        <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
                            <ArrowLeft size={14} />

                            {/* Small screens */}
                            <span className="xs:hidden">Back to segmento</span>

                            {/* Normal mobile */}
                            <span className="hidden xs:inline">
                                {backText}
                            </span>
                        </button>
                    </a>

                    {/* DESKTOP ACTIONS */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/demo">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-white text-[#020617] px-6 py-2.5 rounded-xl text-[11px] font-black shadow-xl flex items-center gap-2"
                            >
                                TRY FOR FREE
                                <ArrowUpRight size={14} strokeWidth={3} />
                            </motion.button>
                        </Link>

                        <a href={backUrl}>
                            <motion.button
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black flex items-center gap-2"
                            >
                                <ArrowLeft size={14} strokeWidth={3} />
                                {backText}
                            </motion.button>
                        </a>
                    </div>
                </div>
            </div>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101]"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-[360px] bg-[#020617] border-l border-white/10 p-8 flex flex-col z-[102]"
                        >
                            <div className="mt-20 flex flex-col gap-2">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 pl-1">
                                    Menu
                                </p>

                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between py-5 px-1 border-b border-white/[0.03] group"
                                    >
                                        <span className={`text-xl font-bold ${pathname === link.href ? "text-blue-500" : "text-slate-300"
                                            }`}>
                                            {link.name}
                                        </span>
                                        <ChevronRight size={18} />
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <Link href="/demo" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full bg-white text-[#020617] py-5 rounded-2xl font-black text-lg">
                                        TRY FOR FREE
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}