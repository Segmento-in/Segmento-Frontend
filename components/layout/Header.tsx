"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type NavLink =
  | { href: string; label: string; external?: boolean }
  | { label: string; isDropdown: true; items: Array<{ href: string; label: string }> }

function isDropdown(
  link: NavLink
): link is { label: string; isDropdown: true; items: Array<{ href: string; label: string }> } {
  return "isDropdown" in link
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    {
      label: "Products",
      isDropdown: true,
      items: [
        { href: "/pulse", label: "Segmento Pulse" },
        { href: "/products/data-classification", label: "Segmento Sense" },
      ],
    },
    {
      label: "Solutions",
      isDropdown: true,
      items: [
        { href: "/solutions#ecommerce", label: "eCommerce" },
        { href: "/solutions#finance", label: "Finance" },
        { href: "/solutions#healthcare", label: "Healthcare" },
        { href: "/solutions#higher-education", label: "Higher Education" },
        { href: "/solutions#manufacturing", label: "Manufacturing" },
        { href: "/solutions#telecommunication", label: "Telecommunication" },
        { href: "/solutions#media", label: "Media" },
        { href: "/solutions#banking", label: "Banking" },
      ],
    },
    {
      label: "Resources",
      isDropdown: true,
      items: [{ href: "/blog", label: "Blog" }],
    },
    { href: "/pricing", label: "Pricing" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-final.png"
              alt="Segmento"
              width={400}
              height={140}
              className="h-20 md:h-24 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 mx-auto">
            {navLinks.map((link) => {
              if (isDropdown(link)) {
                return (
                  <div key={link.label} className="relative group">
                    <button className="relative text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                      {link.label}
                      <span className="absolute left-0 -bottom-1 h-[2px] w-full scale-x-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
                    </button>

                    <div className="absolute left-0 mt-4 w-64 rounded-xl bg-white shadow-xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {link.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full scale-x-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-transform duration-300 hover:scale-x-100" />
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:opacity-90">
              Get a Demo
            </Button>
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-6 py-6 space-y-4">
            {navLinks.map((link) =>
              isDropdown(link) ? (
                <div key={link.label}>
                  <p className="font-semibold mb-2">{link.label}</p>
                  {link.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 text-sm text-slate-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-sm font-medium text-slate-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
