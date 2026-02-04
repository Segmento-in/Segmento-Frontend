import Link from "next/link"
import {
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Github,
} from "lucide-react"

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
  </svg>
)

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-950 to-black text-slate-300">
      <div className="container mx-auto px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Segmento</h3>
            <p className="text-sm leading-relaxed max-w-md">
              Privacy-first, AI-driven data products that help enterprises
              discover, protect, and unlock the true value of sensitive data.
            </p>
          </div>

          {[
            {
              title: "Products",
              links: [
                { label: "Segmento Pulse", href: "/pulse" },
                { label: "Segmento Sense", href: "/products/data-classification" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Social</h4>
            <div className="flex flex-wrap gap-4">
              {[Twitter, Linkedin, Youtube, Instagram, Facebook, Github, TikTokIcon].map(
                (Icon, i) => (
                  <Icon
                    key={i}
                    className="h-5 w-5 hover:text-white transition"
                  />
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm">
          © 2025 Segmento. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
