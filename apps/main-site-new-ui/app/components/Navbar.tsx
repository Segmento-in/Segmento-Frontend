"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    name: "Products",
    dropdown: [
      { name: "Segmento Pulse", href: "/#pulse" },
      { name: "Segmento Sense", href: "/#sense" },
      { name: "Segmento Resolve", href: "/#resolve" },
    ],
  },
  {
    name: "Solutions",
    dropdown: [
      { name: "By Industry", href: "/#industry" },
      { name: "By Use Case", href: "/#use-case" },
      { name: "Enterprise", href: "/#enterprise" },
    ],
  },
  {
    name: "Resources",
    dropdown: [
      { name: "Documentation", href: "/#docs" },
      { name: "API Reference", href: "/#api" },
      { name: "Case Studies", href: "/#cases" },
      { name: "Webinars", href: "/#webinars" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm border-b border-slate-100" : "bg-white/50 backdrop-blur-sm py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <span className="text-white font-extrabold text-xl">S</span>
            </div>
            <span className="text-[#0F172A] font-bold text-2xl tracking-tight">
              Segmento
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group/nav"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="px-4 py-2">
                  <Link
                    href={link.href || "#"}
                    className="text-slate-600 hover:text-slate-900 font-semibold transition-colors flex items-center space-x-1"
                  >
                    <span>{link.name}</span>
                    {link.dropdown && (
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                </div>

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 pt-2 z-50"
                    >
                      <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 p-2 min-w-[200px]">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#0F172A] text-white font-bold rounded-lg hover:bg-slate-800 transition-all hover:shadow-[0_4px_12px_rgba(15,23,42,0.2)] active:scale-[0.98]"
            >
              Contact Sales
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
                        {link.name}
                      </div>
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-lg font-semibold text-slate-700 active:bg-slate-50 rounded-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={link.href!}
                      className="block px-4 py-2 text-lg font-bold text-slate-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 px-2">
                <Link
                  href="/contact"
                  className="block w-full py-3 bg-[#0F172A] text-white text-center font-bold rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
