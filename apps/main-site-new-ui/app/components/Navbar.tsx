"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href?: string;
  dropdown?: NavItem[];
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Products",
    dropdown: [
      { name: "Segmento Pulse", href: "/#pulse" },
      { name: "Segmento Sense", href: "/#sense" },
      { name: "Segmento Resolve", href: "/#resolve" },
      { name: "Segmento SprintIQ", href: "/#sprint" },
      { name: "Segmento Collect", href: "/#collect" },
      { name: "Segmento Enrich", href: "/#enrich" },
    ],
  },
  {
    name: "Solutions",
    dropdown: [
      { name: "eCommerce", href: "/solutions#ecommerce" },
      { name: "Finance", href: "/solutions#finance" },
      { name: "Healthcare", href: "/solutions#healthcare" },
      { name: "Higher Education", href: "/solutions#higher-education" },
      { name: "Manufacturing", href: "/solutions#manufacturing" },
      { name: "Telecommunication", href: "/solutions#telecommunication" },
      { name: "Media", href: "/solutions#media" },
      { name: "Banking", href: "/solutions#banking" },
    ],
  },
  {
    name: "Resources",
    dropdown: [
      { name: "Blog", href: "/blog" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // Separate state for mobile dropdown toggles
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl py-3 shadow-sm border-b border-slate-100"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-6 shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-[#0F172A] font-black text-2xl tracking-tighter">
              Segmento
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="px-4 py-2">
                  <Link
                    href={link.href || "#"}
                    className={`text-sm font-bold transition-all duration-200 flex items-center space-x-1 ${
                      activeDropdown === link.name
                        ? "text-[#2563EB]"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.dropdown && (
                      <motion.span
                        animate={{ rotate: activeDropdown === link.name ? 180 : 0 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </motion.span>
                    )}
                  </Link>
                </div>

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 pt-2 z-50 min-w-56"
                    >
                      <div className="bg-white rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-100 p-1.5 overflow-hidden">
                        <div className="flex flex-col">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="group/item flex items-center px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <span className="text-sm font-semibold text-slate-600 group-hover/item:text-[#2563EB] transition-colors whitespace-nowrap">
                                {item.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex shrink-0">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#0F172A] text-white text-sm font-black rounded-xl hover:bg-[#2563EB] transition-all duration-300 active:scale-[0.96]"
            >
              Get Started
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[72px] md:hidden bg-white z-40 overflow-y-auto border-t border-slate-100"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-slate-50 pb-4 last:border-0">
                  {link.dropdown ? (
                    <div className="space-y-2">
                      <button 
                        onClick={() => setMobileMenuOpen(mobileMenuOpen === link.name ? null : link.name)}
                        className="w-full flex items-center justify-between text-xl font-black text-slate-900 px-2"
                      >
                        <span>{link.name}</span>
                        <motion.div
                          animate={{ rotate: mobileMenuOpen === link.name ? 180 : 0 }}
                        >
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {mobileMenuOpen === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 gap-1 pt-2">
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="block px-4 py-3 bg-slate-50 rounded-xl text-slate-600 font-bold active:bg-blue-50 active:text-[#2563EB] transition-all text-sm"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href!}
                      className="block px-2 text-xl font-black text-slate-900 active:text-[#2563EB]"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="block w-full py-4 bg-[#2563EB] text-white text-center font-black rounded-2xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}