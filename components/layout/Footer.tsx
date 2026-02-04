import Link from "next/link"
import {
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Github,
} from "lucide-react"

// Custom TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className={className}
    fill="currentColor"
  >
    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
  </svg>
)

export function Footer() {
  const footerLinks = {
    product: [
      { label: "Segmento Pulse", href: "/pulse" },
      { label: "Segmento Sense", href: "/products/data-classification" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    social: [
      { label: "X/Twitter", href: "/404", icon: Twitter },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/segmento-pte-ltd/", icon: Linkedin },
      { label: "YouTube", href: "/404", icon: Youtube },
      { label: "Instagram", href: "/404", icon: Instagram },
      { label: "Facebook", href: "/404", icon: Facebook },
      { label: "GitHub", href: "https://github.com/Segmento-in", icon: Github },
      { label: "TikTok", href: "/404", icon: TikTokIcon },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Segmento</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Privacy-first, AI-driven data products that solve real enterprise challenges.
              Transform how you protect and analyze sensitive information.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={`${link.label}-${link.href}`}>
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

          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={`${link.label}-${link.href}`}>
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

          <div>
            <h4 className="text-sm font-semibold mb-4">Social</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.social.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary-100 transition-colors flex items-center gap-2"
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
                <li key={`${link.label}-${link.href}`}>
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

        <div className="border-t border-gray-800 pt-8">
          <div className="text-center text-sm text-gray-400">
            Segmento © 2025. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
