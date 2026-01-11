'use client';

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import '@/app/pulse/heartbeat.css';

export default function PulseNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
    const router = useRouter();

    const timeoutRef = useRef<number | undefined>(undefined);

    const handleSearchInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value;
            setSearchQuery(query);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (query.trim().length >= 2) {
                timeoutRef.current = window.setTimeout(() => {
                    router.push(`/pulse/search?q=${encodeURIComponent(query.trim())}`);
                    setIsSearchOpen(false);
                }, 500);
            }
        },
        [router]
    );

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/pulse/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleSearchClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    const dataSubcategories = [
        { name: "Data Engineering", path: "/pulse/news?category=data-engineering" },
        { name: "Data Governance", path: "/pulse/news?category=data-governance" },
        { name: "Data Privacy", path: "/pulse/news?category=data-privacy" },
        { name: "Data Security", path: "/pulse/news?category=data-security" },
    ];

    const navLinks = [
        { name: "Home", path: "/pulse" },
        { name: "AI", path: "/pulse/news?category=ai" },
        { name: "Data", path: "#", hasDropdown: true },
        { name: "Cloud", path: "/pulse/news?category=cloud-computing" },
        { name: "Magazines", path: "/pulse/magazines" },
        { name: "Segmento.in", path: "/" }, // Link back to main platform
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/pulse" className="flex items-center gap-2">
                    {/* Animated Heartbeat Logo */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg heartbeat-glow"></div>
                        <div className="relative w-9 h-9 flex items-center justify-center">
                            <svg
                                viewBox="0 0 100 50"
                                className="w-full h-full text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M 0 25 L 15 25 L 18 12 L 22 38 L 26 18 L 30 25 L 45 25 L 48 12 L 52 38 L 56 18 L 60 25 L 75 25 L 78 12 L 82 38 L 86 18 L 90 25 L 100 25"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="heartbeat-line"
                                />
                            </svg>
                        </div>
                    </div>
                    <span className="font-display text-xl font-bold">
                        Segmento<span className="text-blue-600">Pulse</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        link.hasDropdown ? (
                            <div key={link.name} className="relative">
                                <button
                                    onClick={() => setIsDataDropdownOpen(!isDataDropdownOpen)}
                                    onMouseEnter={() => setIsDataDropdownOpen(true)}
                                    onMouseLeave={() => setIsDataDropdownOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                    {link.name}
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {isDataDropdownOpen && (
                                    <div
                                        onMouseEnter={() => setIsDataDropdownOpen(true)}
                                        onMouseLeave={() => setIsDataDropdownOpen(false)}
                                        className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                                    >
                                        {dataSubcategories.map((subcat) => (
                                            <Link
                                                key={subcat.name}
                                                href={subcat.path}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsDataDropdownOpen(false)}
                                            >
                                                {subcat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        {isSearchOpen ? (
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    type="search"
                                    placeholder="Search news..."
                                    className="w-64 h-9"
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    autoFocus
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSearchClose}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button variant="outline" size="sm" asChild>
                        <Link href="/pulse/login">Login</Link>
                    </Button>

                    <Button size="sm" asChild>
                        <Link href="/pulse/register">Register</Link>
                    </Button>

                    <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                        Subscribe
                    </Button>
                </div>

                {/* Mobile Buttons */}
                <div className="flex lg:hidden gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* Mobile Search */}
            {isSearchOpen && (
                <div className="lg:hidden border-t p-4">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                        <Input
                            type="search"
                            placeholder="Search news..."
                            value={searchQuery}
                            onChange={handleSearchInput}
                        />
                        <Button type="submit" variant="ghost" size="icon">
                            <Search />
                        </Button>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t">
                    <nav className="container py-4 flex flex-col gap-2">
                        {navLinks.map((link) => (
                            link.hasDropdown ? (
                                <div key={link.name}>
                                    <div className="px-4 py-2 font-semibold text-gray-900">
                                        {link.name}
                                    </div>
                                    <div className="pl-4">
                                        {dataSubcategories.map((subcat) => (
                                            <Link
                                                key={subcat.name}
                                                href={subcat.path}
                                                className="block px-4 py-2 text-sm rounded-lg hover:bg-secondary"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {subcat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="px-4 py-3 rounded-lg hover:bg-secondary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}

                        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/pulse/login">
                                    <User className="h-4 w-4 mr-2" />
                                    Login
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/pulse/register">Register</Link>
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

