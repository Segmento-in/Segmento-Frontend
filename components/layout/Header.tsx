"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"

type DropdownKey = "products" | "solutions" | "resources" | null

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const tabBase =
    "px-4 py-2 text-sm font-medium rounded-lg border border-transparent transition-all duration-300"

  const tabStyle =
    `${tabBase} text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:shadow-md`

  const dropdownBox =
    "absolute left-1/2 -translate-x-1/2 mt-3 w-64 rounded-xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden"

  const dropdownItem =
    "block px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 transition-all"

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-final.png"
              alt="Segmento"
              width={220}
              height={70}
              priority
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-2">
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
                <div className={dropdownBox}>
                  <Link href="/pulse" className={dropdownItem}>
                    Segmento Pulse
                  </Link>
                  <Link
                    href="/products/data-classification"
                    className={dropdownItem}
                  >
                    Segmento Sense
                  </Link>
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
                    <Link
                      key={id}
                      href={`/solutions#${id}`}
                      className={dropdownItem}
                    >
                      {label}
                    </Link>
                  ))}
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
                <div className={dropdownBox}>
                  <Link href="/blog" className={dropdownItem}>
                    Blog
                  </Link>
                </div>
              )}
            </div>

            <Link href="/pricing" className={tabStyle}>Pricing</Link>
            <Link href="/careers" className={tabStyle}>Careers</Link>
            <Link href="/contact" className={tabStyle}>Contact</Link>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-950 px-6 py-6 space-y-3">
          {[
            ["Home", "/"],
            ["About", "/about"],
            ["Pricing", "/pricing"],
            ["Careers", "/careers"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="block w-full text-center py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
