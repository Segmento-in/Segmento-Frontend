"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type NavLink =
    | { href: string; label: string; external?: boolean }
    | { label: string; isDropdown: true; items: Array<{ href: string; label: string }> }

// Type guard function
function isDropdown(
    link: NavLink
): link is { label: string; isDropdown: true; items: Array<{ href: string; label: string }> } {
    return "isDropdown" in link && link.isDropdown === true
}

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
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
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? "bg-white/80 backdrop-blur-md border-b border-border/40"
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
                            className="h-20 md:h-24 lg:h-28 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation (CENTERED + SPACED) */}
                    <nav className="hidden md:flex items-center space-x-4 mx-auto">
                        {navLinks.map((link) => {
                            if (isDropdown(link)) {
                                return (
                                    <div key={link.label} className="relative group">
                                        <button className="px-3 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1 rounded-md">
                                            {link.label}
                                            <span className="text-xs">▼</span>
                                        </button>
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <div className="py-2">
                                                {link.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="block px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-primary/5 transition-colors"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="px-3 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors rounded-md"
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden ml-auto"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                        {navLinks.map((link) => {
                            if (isDropdown(link)) {
                                return (
                                    <div key={link.label} className="space-y-2">
                                        <div className="font-semibold text-sm text-foreground">
                                            {link.label}
                                        </div>
                                        <div className="pl-4 space-y-2">
                                            {link.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="block px-2 py-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
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
                                    className="px-2 py-1 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            )}
        </header>
    )
}
