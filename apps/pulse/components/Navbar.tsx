'use client';

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, User, ChevronDown, LogOut, Mail } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useRouter } from "next/navigation";
import { pulseAuth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import '../app/(pulse)/heartbeat.css';
import './rainbow-shimmer.css';
import './navbar-compact.css';
import './navbar-animations.css';

export default function PulseNavbar({ onSubscribeClick }: { onSubscribeClick?: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
    const [isCloudDropdownOpen, setIsCloudDropdownOpen] = useState(false);
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
        if (!pulseAuth) return;

        const unsubscribe = onAuthStateChanged(pulseAuth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            if (pulseAuth) {
                await signOut(pulseAuth);
            }
            setIsUserMenuOpen(false);
            router.push('');
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
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                    setIsSearchOpen(false);
                }, 500);
            }
        },
        [router]
    );

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
            setIsCloudDropdownOpen(false);
        }, 150); // 150ms delay prevents tunnel issue
    };

    const dataSubcategories = [
        // "All Data Articles" is the master button — same role as "Cloud Computing" in the Cloud menu.
        // It routes to the data_articles collection so users see everything in one place.
        { name: "All Data Articles", path: "/news?category=data-articles", icon: "🗂️" },
        { name: "Data Engineering", path: "/news?category=data-engineering", icon: "🔧" },
        { name: "Data Governance", path: "/news?category=data-governance", icon: "⚖️" },
        { name: "Data Management", path: "/news?category=data-management", icon: "📊" },
        { name: "Data Privacy", path: "/news?category=data-privacy", icon: "🔒" },
        { name: "Data Security", path: "/news?category=data-security", icon: "🛡️" },
        { name: "Data Laws", path: "/news?category=data-laws", icon: "📜" },
        { name: "Customer Data Platform", path: "/news?category=customer-data-platform", icon: "👥" },
        { name: "Business Intelligence", path: "/news?category=business-intelligence", icon: "💡" },
        { name: "Business Analytics", path: "/news?category=business-analytics", icon: "📈" },
        { name: "Data Centers", path: "/news?category=data-centers", icon: "🏢" },
    ];

    const cloudSubcategories = [
        { name: "Cloud Computing", path: "/news?category=cloud-computing", icon: "☁️", isEmoji: true },
        { name: "AWS", path: "/news?category=cloud-aws", icon: "/cloud-logos/aws.svg", isEmoji: false },
        { name: "Azure", path: "/news?category=cloud-azure", icon: "/cloud-logos/azure.svg", isEmoji: false },
        { name: "Google Cloud", path: "/news?category=cloud-gcp", icon: "/cloud-logos/gcp.svg", isEmoji: false },
        { name: "IBM Cloud", path: "/news?category=cloud-ibm", icon: "/cloud-logos/ibm.svg", isEmoji: false },
        { name: "Oracle Cloud", path: "/news?category=cloud-oracle", icon: "/cloud-logos/oracle.svg", isEmoji: false },
        { name: "Cloudflare", path: "/news?category=cloud-cloudflare", icon: "/cloud-logos/cloudflare.svg", isEmoji: false },
        { name: "DigitalOcean", path: "/news?category=cloud-digitalocean", icon: "/cloud-logos/digitalocean.svg", isEmoji: false },
        { name: "Salesforce", path: "/news?category=cloud-salesforce", icon: "/cloud-logos/salesforce.svg", isEmoji: false },
        { name: "Alibaba Cloud", path: "/news?category=cloud-alibaba", icon: "/cloud-logos/alibaba.svg", isEmoji: false },
        { name: "Tencent Cloud", path: "/news?category=cloud-tencent", icon: "/cloud-logos/tencent.svg", isEmoji: false },
        { name: "Huawei Cloud", path: "/news?category=cloud-huawei", icon: "/cloud-logos/huawei.svg", isEmoji: false },
    ];

    const navLinks = [
        { name: "Home", path: "/" },
        // Display label changed to 'Artificial Intelligence' — the route /news?category=ai
        // is unchanged so no backend API calls are affected.
        { name: "Artificial Intelligence", path: "/news?category=ai" },
        { name: "Data", path: "#", hasDropdown: true, dropdownType: "data" },
        { name: "Cloud", path: "#", hasDropdown: true, dropdownType: "cloud" },
        { name: "Articles", path: "/articles/medium" },
        { name: "Magazines", path: "/magazines" },
        { name: 'Research', path: '/research' },
        { name: "Upcoming", path: "/upcoming" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
            <div className="container flex h-14 xs:h-14 sm:h-15 lg:h-16 items-center justify-between">
                {/* Logo - Responsive Sizing */}
                <Link href="https://segmento.in" className="flex items-center gap-1.5 xs:gap-2">
                    {/* Animated Heartbeat Logo - Scales with screen size */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg heartbeat-glow"></div>
                        <div className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center">
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
                    <span className="font-display text-base xs:text-lg sm:text-xl lg:text-xl font-bold">
                        Segmento<span className="text-blue-600">Pulse</span>
                    </span>
                </Link>

                {/* Desktop Navigation - Enhanced with Premium Animations */}
                {/* Show full nav on xl+ (1024px+) for better tablet experience */}
                <nav className="hidden xl:flex items-center gap-0.5">
                    {navLinks.map((link) => (
                        link.hasDropdown ? (
                            <div key={link.name} className="relative group">
                                <button
                                    onClick={() => {
                                        if (link.dropdownType === 'data') {
                                            setIsDataDropdownOpen(!isDataDropdownOpen);
                                            setIsCloudDropdownOpen(false);
                                        } else if (link.dropdownType === 'cloud') {
                                            setIsCloudDropdownOpen(!isCloudDropdownOpen);
                                            setIsDataDropdownOpen(false);
                                        }
                                    }}
                                    onMouseEnter={() => {
                                        if (link.dropdownType === 'data') {
                                            setIsDataDropdownOpen(true);
                                            setIsCloudDropdownOpen(false);
                                        } else if (link.dropdownType === 'cloud') {
                                            clearTimeout(closeTimeoutRef.current);
                                            setIsCloudDropdownOpen(true);
                                            setIsDataDropdownOpen(false);
                                        }
                                    }}
                                    onMouseLeave={handleDropdownMouseLeave}
                                    className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg flex items-center gap-1 transition-all duration-300 ease-in-out hover:bg-gray-50 hover:scale-105"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${(link.dropdownType === 'data' && isDataDropdownOpen) ||
                                        (link.dropdownType === 'cloud' && isCloudDropdownOpen)
                                        ? 'rotate-180' : ''
                                        }`} />
                                    {/* Animated underline */}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out w-0 group-hover:w-3/4" />
                                </button>

                                {/* Data Dropdown */}
                                {link.dropdownType === 'data' && isDataDropdownOpen && (
                                    <div
                                        onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
                                        onMouseLeave={handleDropdownMouseLeave}
                                        className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-dropdown-in"
                                    >
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                {dataSubcategories.map((subcat, index) => (
                                                    <Link
                                                        key={subcat.name}
                                                        href={subcat.path}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group animate-dropdown-item"
                                                        style={{ animationDelay: `${index * 30}ms` }}
                                                        onClick={() => setIsDataDropdownOpen(false)}
                                                    >
                                                        <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{subcat.icon}</span>
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{subcat.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Cloud Dropdown */}
                                {link.dropdownType === 'cloud' && isCloudDropdownOpen && (
                                    <div
                                        onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
                                        onMouseLeave={handleDropdownMouseLeave}
                                        className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-dropdown-in"
                                    >
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                {cloudSubcategories.map((subcat, index) => (
                                                    <Link
                                                        key={subcat.name}
                                                        href={subcat.path}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group animate-dropdown-item"
                                                        style={{ animationDelay: `${index * 30}ms` }}
                                                        onClick={() => setIsCloudDropdownOpen(false)}
                                                    >
                                                        {subcat.isEmoji ? (
                                                            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                                                                {subcat.icon}
                                                            </span>
                                                        ) : (
                                                            <Image
                                                                src={subcat.icon}
                                                                alt={subcat.name}
                                                                width={24}
                                                                height={24}
                                                                className="group-hover:scale-110 transition-transform duration-200"
                                                            />
                                                        )}
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{subcat.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-50 hover:scale-105 group"
                            >
                                <span className="relative z-10">{link.name}</span>
                                {/* Animated underline */}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out w-0 group-hover:w-3/4" />
                            </Link>
                        )
                    ))}

                    {/* Get back to Segmento button - Enhanced */}
                    <Link
                        href="https://segmento.in"
                        className="ml-2 px-4 py-2 text-sm font-medium bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
                    >
                        Get back to Segmento
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden xl:flex items-center gap-1.5">
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
                                className="hover:scale-110 transition-transform duration-300"
                            >
                                <Search className="h-4 w-4 hover:rotate-12 transition-transform duration-300" />
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
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="h-4 w-4" />
                                        Dashboard
                                    </Link>
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
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}

                    {/* Visual Divider */}
                    <div className="h-4 w-px bg-gray-300 mx-2"></div>

                    {/* Subscribe to Newsletter - Responsive Text */}
                    <button
                        className="rainbow-shimmer-btn min-h-touch flex items-center justify-center"
                        onClick={() => {
                            if (onSubscribeClick) {
                                onSubscribeClick();
                            }
                        }}
                    >
                        <Mail className="h-4 w-4 mr-0 xl:mr-2" />
                        <span className="hidden 2xl:inline">Subscribe to Newsletter</span>
                        <span className="hidden xl:inline 2xl:hidden">Subscribe</span>
                    </button>
                </div>

                {/* Mobile Buttons - Show on screens < 1024px */}
                <div className="flex xl:hidden gap-2">
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
                    <div className="xl:hidden border-t p-3 sm:p-4">
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

            {/* Mobile Menu Overlay - Fixed Responsiveness */}
            {
                isMenuOpen && (
                    <div className="xl:hidden fixed inset-0 top-14 xs:top-14 sm:top-15 lg:top-16 z-50 overflow-y-auto bg-white pb-32 border-t animate-in slide-in-from-top-5 duration-200">
                        <nav className="container py-4 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                link.hasDropdown ? (
                                    <div key={link.name} className="border-b last:border-0 border-gray-100">
                                        <button
                                            onClick={() => {
                                                if (link.dropdownType === 'data') setIsDataDropdownOpen(!isDataDropdownOpen);
                                                if (link.dropdownType === 'cloud') setIsCloudDropdownOpen(!isCloudDropdownOpen);
                                            }}
                                            className="flex items-center justify-between w-full px-4 py-3 font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            {link.name}
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${(link.dropdownType === 'data' && isDataDropdownOpen) || (link.dropdownType === 'cloud' && isCloudDropdownOpen) ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Content - Single column on xs, 2 columns on sm+ */}
                                        {((link.dropdownType === 'data' && isDataDropdownOpen) || (link.dropdownType === 'cloud' && isCloudDropdownOpen)) && (
                                            <div className="pl-2 sm:pl-4 pb-2 space-y-1 bg-gray-50/50 rounded-b-lg">
                                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1">
                                                    {(link.dropdownType === 'data' ? dataSubcategories : cloudSubcategories).map((subcat) => (
                                                        <Link
                                                            key={subcat.name}
                                                            href={subcat.path}
                                                            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3 text-sm rounded-lg hover:bg-white hover:shadow-sm transition-all min-h-touch-sm"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {/* Icon Logic: Handle both Emojis and Next.js Images */}
                                                            {(subcat as any).isEmoji !== false ? (
                                                                <span className="text-lg sm:text-xl shrink-0">{subcat.icon}</span>
                                                            ) : (
                                                                <div className="relative w-5 h-5 sm:w-6 sm:h-6 shrink-0">
                                                                    <Image
                                                                        src={subcat.icon}
                                                                        alt={subcat.name}
                                                                        fill
                                                                        className="object-contain"
                                                                    />
                                                                </div>
                                                            )}
                                                            <span className="text-gray-700 font-medium text-xs sm:text-sm">{subcat.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className="block px-4 py-3 rounded-lg hover:bg-secondary font-medium text-gray-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}

                            <div className="mt-6 pt-6 border-t flex flex-col gap-3 px-2">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm font-medium text-gray-500">
                                            Signed in as <span className="text-gray-900">{user.email}</span>
                                        </div>
                                        <Button variant="outline" onClick={handleLogout} className="justify-start">
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" asChild className="justify-start">
                                            <Link href="/login">
                                                <User className="h-4 w-4 mr-2" />
                                                Login
                                            </Link>
                                        </Button>
                                        <Button asChild className="justify-start">
                                            <Link href="/register">Register</Link>
                                        </Button>
                                    </>
                                )}
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 justify-start"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        if (onSubscribeClick) onSubscribeClick();
                                    }}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Subscribe
                                </Button>

                                {/* Get back to Segmento - Mobile Version */}
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 justify-start"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Link href="https://segmento.in">
                                        Get back to Segmento
                                    </Link>
                                </Button>
                            </div>
                        </nav>
                    </div>
                )
            }
        </header >
    );
}
