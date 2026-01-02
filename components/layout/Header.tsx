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
function isDropdown(link: NavLink): link is { label: string; isDropdown: true; items: Array<{ href: string; label: string }> } {
    return 'isDropdown' in link && link.isDropdown === true
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
                { href: "/products/data-classification", label: "Data Classification (Segmento Sense)" },
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
            ],
        },
        {
            label: "Resources",
            isDropdown: true,
            items: [
                { href: "/blog", label: "Blog" },
            ],
        },
        { href: "/pricing", label: "Pricing" },
        { href: "/careers", label: "Careers" },
        { href: "/contact", label: "Contact" },
    ]

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? "bg-white/80 backdrop-blur-md border-b border-border/40"
                : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/segmento-logo.png"
                            alt="Segmento"
                            width={180}
                            height={45}
                            className="w-auto h-10 md:h-11"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => {
                            if (isDropdown(link)) {
                                return (
                                    <div key={link.label} className="relative group">
                                        <button className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1">
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
                                    className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/contact">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
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
                                                    className="block text-sm text-foreground/60 hover:text-foreground transition-colors"
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
                                    className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                        <div className="flex flex-col space-y-2 pt-4 border-t">
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full">Get Started</Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
