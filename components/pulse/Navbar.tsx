'use client';

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, User, ChevronDown, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { pulseAuth } from "@/lib/pulse/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import '@/app/pulse/heartbeat.css';
import './rainbow-shimmer.css';
import './navbar-compact.css';

export default function PulseNavbar({ onSubscribeClick }: { onSubscribeClick?: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSubscribeDropdownOpen, setIsSubscribeDropdownOpen] = useState(false);
    const [subscriptionType, setSubscriptionType] = useState<'daily' | 'weekly' | null>(null);
    const [dailyTime, setDailyTime] = useState<'morning' | 'afternoon' | 'evening' | null>(null);
    const router = useRouter();

    const timeoutRef = useRef<number | undefined>(undefined);
    const closeTimeoutRef = useRef<number | undefined>(undefined);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(pulseAuth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(pulseAuth);
            setIsUserMenuOpen(false);
            router.push('/pulse');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

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

    // Hover handlers with delay to prevent flicker
    const handleDropdownMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        setIsDataDropdownOpen(true);
    };

    const handleDropdownMouseLeave = () => {
        closeTimeoutRef.current = window.setTimeout(() => {
            setIsDataDropdownOpen(false);
        }, 150); // 150ms delay prevents tunnel issue
    };

    const dataSubcategories = [
        { name: "Data Engineering", path: "/pulse/news?category=data-engineering" },
        { name: "Data Governance", path: "/pulse/news?category=data-governance" },
        { name: "Data Privacy", path: "/pulse/news?category=data-privacy" },
        { name: "Data Security", path: "/pulse/news?category=data-security" },
        { name: "Business Intelligence", path: "/pulse/news?category=business-intelligence" },
        { name: "Business Analytics", path: "/pulse/news?category=business-analytics" },
        { name: "Customer Data Platform", path: "/pulse/news?category=customer-data-platform" },
        { name: "Data Centers", path: "/pulse/news?category=data-centers" },
    ];

    const navLinks = [
        { name: "Home", path: "/pulse" },
        { name: "AI", path: "/pulse/news?category=ai" },
        { name: "Data", path: "#", hasDropdown: true },
        { name: "Cloud", path: "/pulse/news?category=cloud-computing" },
        { name: "Medium Articles", path: "/pulse/news?category=medium-article" },
        { name: "Magazines", path: "/pulse/magazines" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
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
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                    className="px-4 py-2 pb-3 text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                    {link.name}
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {isDataDropdownOpen && (
                                    <div
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                        className="absolute top-full left-0 -mt-1 pt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 overflow-y-auto max-h-96"
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

                    {/* Get back to Segmento button */}
                    <Link
                        href="/"
                        className="ml-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Get back to Segmento
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-1.5">
                    {/* Visual Divider */}
                    <div className="h-4 w-px bg-gray-300 mx-2"></div>

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

                    {/* Conditional rendering based on auth state */}
                    {user ? (
                        // Logged-in state
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2"
                            >
                                <User className="h-4 w-4" />
                                {user.email?.split('@')[0] || 'Profile'}
                                <ChevronDown className="h-3 w-3" />
                            </Button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Logged-out state
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/pulse/login">Sign In</Link>
                        </Button>
                    )}

                    {/* Visual Divider */}
                    <div className="h-4 w-px bg-gray-300 mx-2"></div>

                    {/* Subscribe to Newsletter - White with Rainbow Shimmer + Dropdown */}
                    <div className="relative">
                        <button
                            className="rainbow-shimmer-btn"
                            onClick={() => setIsSubscribeDropdownOpen(!isSubscribeDropdownOpen)}
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Subscribe to Newsletter
                        </button>

                        {isSubscribeDropdownOpen && (
                            <div className="subscription-dropdown">
                                {/* Daily Option */}
                                <div
                                    className={`subscription-option ${subscriptionType === 'daily' ? 'active' : ''}`}
                                    onClick={() => setSubscriptionType(subscriptionType === 'daily' ? null : 'daily')}
                                >
                                    📅 Daily
                                </div>

                                {/* Daily Sub-options */}
                                {subscriptionType === 'daily' && (
                                    <div className="sub-options">
                                        <div
                                            className={`sub-option ${dailyTime === 'morning' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setDailyTime('morning');
                                                setIsSubscribeDropdownOpen(false);
                                                if (onSubscribeClick) onSubscribeClick();
                                            }}
                                        >
                                            🌅 Morning
                                        </div>
                                        <div
                                            className={`sub-option ${dailyTime === 'afternoon' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setDailyTime('afternoon');
                                                setIsSubscribeDropdownOpen(false);
                                                if (onSubscribeClick) onSubscribeClick();
                                            }}
                                        >
                                            ☀️ Afternoon
                                        </div>
                                        <div
                                            className={`sub-option ${dailyTime === 'evening' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setDailyTime('evening');
                                                setIsSubscribeDropdownOpen(false);
                                                if (onSubscribeClick) onSubscribeClick();
                                            }}
                                        >
                                            🌙 Evening
                                        </div>
                                    </div>
                                )}

                                {/* Weekly Option */}
                                <div
                                    className={`subscription-option ${subscriptionType === 'weekly' ? 'active' : ''}`}
                                    onClick={() => {
                                        setSubscriptionType('weekly');
                                        setDailyTime(null);
                                        setIsSubscribeDropdownOpen(false);
                                        if (onSubscribeClick) onSubscribeClick();
                                    }}
                                >
                                    📆 Weekly
                                </div>
                            </div>
                        )}
                    </div>
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
            {
                isSearchOpen && (
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
                )
            }

            {/* Mobile Menu */}
            {
                isMenuOpen && (
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
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm text-gray-600">
                                            {user.email}
                                        </div>
                                        <Button variant="outline" onClick={handleLogout}>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" asChild>
                                            <Link href="/pulse/login">
                                                <User className="h-4 w-4 mr-2" />
                                                Login
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href="/pulse/register">Register</Link>
                                        </Button>
                                    </>
                                )}
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={onSubscribeClick}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Subscribe
                                </Button>
                            </div>
                        </nav>
                    </div>
                )
            }
        </header >
    );
}
