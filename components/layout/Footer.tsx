import Link from "next/link"
import { Twitter, Linkedin, Youtube, Instagram, MapPin, Phone } from "lucide-react"

export function Footer() {
    const footerLinks = {
        product: [
            { label: "Data Classification", href: "/products/data-classification" },
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Solutions", href: "/solutions" },
        ],
        company: [
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
        social: [
            { label: "X/Twitter", href: "https://twitter.com/segmento", icon: Twitter },
            { label: "LinkedIn", href: "https://linkedin.com/company/segmento", icon: Linkedin },
            { label: "YouTube", href: "https://youtube.com/@segmento", icon: Youtube },
            { label: "Instagram", href: "https://instagram.com/segmento", icon: Instagram },
        ],
        legal: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Security", href: "/security" },
        ],
    }

    return (
        <footer className="bg-gradient-to-b from-slate-900 to-black text-white">
            <div className="container mx-auto px-4 py-16">
                {/* Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Company Description */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-4">Segmento</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Privacy-first, AI-driven data products that solve real enterprise challenges.
                            Transform how you protect and analyze sensitive information.
                        </p>

                        {/* Contact Sales */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Contact Sales</h4>
                            <div className="flex items-start gap-2 text-sm text-gray-400">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Rama talkies, Opposite Road, Waltair Uplands, Vishakapatnam</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Phone className="h-4 w-4" />
                                <a href="tel:+919908727027" className="hover:text-primary transition-colors">
                                    +91 990 872 7027
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Products</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-primary-100 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-primary-100 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social & Legal */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Social</h4>
                        <ul className="space-y-3 mb-6">
                            {footerLinks.social.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-primary-100 transition-colors flex items-center gap-2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.icon && <link.icon className="h-4 w-4" />}
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h4 className="text-sm font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-primary-100 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8">
                    <p className="text-sm text-gray-400 text-center">
                        Segmento © 2025. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
