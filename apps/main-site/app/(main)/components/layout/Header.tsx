"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"

type DropdownKey = "products" | "solutions" | "resources" | null

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState<DropdownKey>(null)

  /* ---------------- STYLES ---------------- */

  const navItem =
    "relative px-5 py-2 text-sm font-semibold text-gray-800 transition-all duration-300 rounded-md"

  // ✅ EXACT COLOR MATCH (NOT TOO DARK)
  const hoverEffect =
    "hover:text-white hover:bg-gradient-to-r hover:from-[#1B2B6F] hover:via-[#1F3A8A] hover:to-[#2745B5] hover:shadow-md"

  const dropdownWrapper = "absolute left-1/2 -translate-x-1/2 pt-4"
  const dropdownBox =
    "w-64 rounded-xl bg-gradient-to-br from-[#1B2B6F] via-[#1F3A8A] to-[#2745B5] shadow-xl border border-white/20 overflow-hidden"
  const dropdownItem =
    "block px-5 py-3 text-sm text-white/90 hover:bg-white/10 transition-all"

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/logo-final.png"
              alt="Segmento"
              width={220}
              height={70}
              priority
            />
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex items-center gap-3">
            <Link href="/" className={`${navItem} ${hoverEffect}`}>Home</Link>
            <Link href="/about" className={`${navItem} ${hoverEffect}`}>About</Link>

            {/* PRODUCTS */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("products")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`${navItem} ${hoverEffect} flex items-center gap-1`}>
                Products <ChevronDown size={14} />
              </button>

              {openDropdown === "products" && (
                <div className={dropdownWrapper}>
                  <div className={dropdownBox}>
                    <Link href="/pulse" className={dropdownItem}>Segmento Pulse</Link>
                    <Link href="/products/data-classification" className={dropdownItem}>Segmento Sense</Link>
                    <span className={dropdownItem}>Segmento Resolve (Upcoming)</span>
                    <span className={dropdownItem}>Segmento Collect (Upcoming)</span>
                     <span className={dropdownItem}>Segmento Enrich (Upcoming)</span>
                  </div>
                </div>
              )}
            </div>

            {/* SOLUTIONS */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("solutions")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`${navItem} ${hoverEffect} flex items-center gap-1`}>
                Solutions <ChevronDown size={14} />
              </button>

              {openDropdown === "solutions" && (
                <div className={dropdownWrapper}>
                  <div className={dropdownBox}>
                    {[
                      ["ecommerce", "eCommerce"],
                      ["finance", "Finance"],
                      ["healthcare", "Healthcare"],
                      ["higher-education", "Higher Education"],
                      ["manufacturing", "Manufacturing"],
                      ["telecommunication", "Telecommunication"],
                      ["media", "Media"],
                      ["banking", "Banking"],
                    ].map(([id, label]) => (
                      <Link key={id} href={`/solutions#${id}`} className={dropdownItem}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RESOURCES */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("resources")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`${navItem} ${hoverEffect} flex items-center gap-1`}>
                Resources <ChevronDown size={14} />
              </button>

              {openDropdown === "resources" && (
                <div className={dropdownWrapper}>
                  <div className={dropdownBox}>
                    <Link href="/blog" className={dropdownItem}>Blog</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className={`${navItem} ${hoverEffect}`}>Pricing</Link>
            <Link href="/careers" className={`${navItem} ${hoverEffect}`}>Careers</Link>
            <Link href="/contact" className={`${navItem} ${hoverEffect}`}>Contact</Link>
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1B2B6F] text-white px-6 py-6 space-y-4">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block">Home</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block">About</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block">Pricing</Link>
          <Link href="/careers" onClick={() => setMobileOpen(false)} className="block">Careers</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="block">Contact</Link>
        </div>
      )}
    </header>
  )
}