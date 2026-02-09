'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"

type DropdownKey = "products" | "solutions" | "resources" | null

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState<DropdownKey>(null)

  /* TAB STYLE - hover colors applied permanently */
  const tabStyle =
    "px-5 py-2 text-sm font-medium transition-all duration-300 text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md"

  /* DROPDOWN STYLES */
  const dropdownWrapper = "absolute left-1/2 -translate-x-1/2 pt-4"
  const dropdownBox =
    "w-64 rounded-xl bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-600 shadow-2xl border border-white/20 overflow-hidden"
  const dropdownItem =
    "block px-5 py-3 text-sm text-white/90 hover:bg-white/10 transition-all"

  const toggleMobileDropdown = (key: DropdownKey) => {
    setMobileDropdown(prev => (prev === key ? null : key))
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-20">

          {/* LEFT: LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/logo-final.png"
              alt="Segmento"
              width={220}
              height={70}
              priority
            />
          </Link>

          {/* CENTER: NAV TABS (DESKTOP UNCHANGED) */}
          <div className="flex-1 hidden md:flex justify-center">
            <nav className="flex items-center gap-4">
              <Link href="/" className={tabStyle}>Home</Link>
              <Link href="/about" className={tabStyle}>About</Link>

              {/* PRODUCTS */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("products")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className={`${tabStyle} flex items-center gap-1`}>
                  Products <ChevronDown size={14} />
                </button>

                {openDropdown === "products" && (
                  <div className={dropdownWrapper}>
                    <div className={dropdownBox}>
                      <Link href="/pulse" className={dropdownItem}>Segmento Pulse</Link>
                      <Link href="/products/data-classification" className={dropdownItem}>Segmento Sense</Link>
                      <Link href="/products/resolve" className={dropdownItem}>Segmento Resolve [upcoming]</Link>
                      <Link href="/products/collect" className={dropdownItem}>Segmento Collect [upcoming]</Link>
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
                <button className={`${tabStyle} flex items-center gap-1`}>
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
                <button className={`${tabStyle} flex items-center gap-1`}>
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

              <Link href="/pricing" className={tabStyle}>Pricing</Link>
              <Link href="/careers" className={tabStyle}>Careers</Link>
              <Link href="/contact" className={tabStyle}>Contact</Link>
            </nav>
          </div>

          {/* RIGHT: MOBILE BUTTON */}
          <div className="flex justify-end md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (ONLY ADDITION) */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-950 px-6 py-6 space-y-4 text-white">

          <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>

          {/* MOBILE PRODUCTS */}
          <button onClick={() => toggleMobileDropdown("products")} className="flex w-full justify-between">
            Products <ChevronDown />
          </button>
          {mobileDropdown === "products" && (
            <div className="pl-4 space-y-2 text-sm text-gray-300">
              <Link href="/pulse">Segmento Pulse</Link>
              <Link href="/products/data-classification">Segmento Sense</Link>
              <p>Segmento Resolve [upcoming]</p>
              <p>Segmento Collect [upcoming]</p>
            </div>
          )}

          {/* MOBILE SOLUTIONS */}
          <button onClick={() => toggleMobileDropdown("solutions")} className="flex w-full justify-between">
            Solutions <ChevronDown />
          </button>
          {mobileDropdown === "solutions" && (
            <div className="pl-4 space-y-2 text-sm text-gray-300">
              <Link href="/solutions#ecommerce">eCommerce</Link>
              <Link href="/solutions#finance">Finance</Link>
              <Link href="/solutions#healthcare">Healthcare</Link>
              <Link href="/solutions#banking">Banking</Link>
            </div>
          )}

          {/* MOBILE RESOURCES */}
          <button onClick={() => toggleMobileDropdown("resources")} className="flex w-full justify-between">
            Resources <ChevronDown />
          </button>
          {mobileDropdown === "resources" && (
            <div className="pl-4 text-sm text-gray-300">
              <Link href="/blog">Blog</Link>
            </div>
          )}

          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/careers" onClick={() => setMobileOpen(false)}>Careers</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  )
}
