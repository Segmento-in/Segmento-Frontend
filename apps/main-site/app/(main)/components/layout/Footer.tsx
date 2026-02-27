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
      { label: "Segmento Resolve(upcoming)", href: "" },
      { label: "Segmento Collect(upcoming) ", href: "" },
      { label: "Segmento Enrich(upcoming)", href: "" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    social: [
      { label: "X/Twitter", href: "/404", icon: Twitter },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/segmento-pte-ltd/",
        icon: Linkedin,
      },
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
    <footer className="bg-[#020617] border-t border-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Segmento
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
              Privacy-first, AI-driven data products that solve real enterprise challenges.
              Transform how you protect and analyze sensitive information.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Social
            </h4>

            {/* Icons */}
            <div className="flex flex-wrap gap-4 mb-6">
              {footerLinks.social.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  aria-label={link.label}
                  className="
                    group inline-flex items-center justify-center
                    w-10 h-10 rounded-full
                    bg-slate-900 border border-slate-700
                    hover:bg-slate-800
                    transition-all duration-300 ease-out
                    hover:-translate-y-1 hover:scale-110
                    hover:shadow-md
                  "
                >
                  {link.icon && (
                    <link.icon className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  )}
                </Link>
              ))}
            </div>

            <h4 className="text-sm font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <div className="text-center text-sm text-slate-500">
            Segmento © {new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}