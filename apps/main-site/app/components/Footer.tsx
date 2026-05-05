"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Twitter, Facebook, Youtube, Linkedin, Github } from "lucide-react";

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { name: "Segmento Pulse", href: "/#pulse" },
      { name: "Segmento Sense", href: "/#sense" },
      { name: "Segmento Resolve", href: "/#resolve" },
      { name: "Segmento SprintIQ", href: "/#sprint" },
      { name: "Segmento Collect", href: "/#collect" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "eCommerce", href: "/solutions#ecommerce" },
      { name: "Finance", href: "/solutions#finance" },
      { name: "Healthcare", href: "/solutions#healthcare" },
      { name: "Higher Education", href: "/solutions#higher-education" },
      { name: "Manufacturing", href: "/solutions#manufacturing" },
      { name: "Telecommunication", href: "/solutions#telecommunication" },
      { name: "Media", href: "/solutions#media" },
      { name: "Banking", href: "/solutions#banking" },
    ],
  },
  {
    title: "Resources",
    links: [{ name: "Blog", href: "/blog" }],
  },
  {
    title: "Contact",
    links: [{ name: "Locations", href: "/contact" }],
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", size: "w-5 h-5" },
  { icon: Twitter, href: "#", size: "w-5 h-5" },
  { icon: Github, href: "https://github.com/Segmento-in", size: "w-5 h-5" },
  { icon: Youtube, href: "#", size: "w-6 h-6" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/segmento-india", size: "w-5 h-5" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper bg-slate-50 pt-16 pb-10 relative overflow-hidden border-t border-slate-200 transition-colors duration-500">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">

          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 lg:col-span-1"
          >
            <Link href="/" className="flex items-center mb-3">
              <Image
                src="/images/logo-final.png"
                alt="Segmento"
                width={180}
                height={28}
                priority
              />
            </Link>
          </motion.div>

          {/* LINKS */}
          {footerLinks.map((column, colIdx) => (
            <motion.div
              key={colIdx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="footer-title font-bold mb-5 text-[11px] uppercase tracking-[0.15em]">
                {column.title}
              </h4>

              <ul className="space-y-3">
                {column.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="footer-link text-[13px] font-semibold transition-colors flex items-center"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="pt-8 border-t flex flex-col items-center gap-6 footer-bottom">

          {/* SOCIAL */}
          <div className="flex space-x-6">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                whileHover={{ y: -3, scale: 1.1 }}
                className="social-icon transition-colors"
              >
                <social.icon className={`${social.size} fill-current`} />
              </motion.a>
            ))}
          </div>

          {/* LEGAL */}
          <div className="flex space-x-8 text-[12px] font-bold footer-legal">
            {["Legal", "Privacy", "Terms", "Help"].map((item) => (
              <Link key={item} href={`/#${item.toLowerCase()}`}>
                {item}
              </Link>
            ))}
          </div>

          {/* COPYRIGHT */}
          <p className="text-[11px] footer-copy text-center">
            © {currentYear} Segmento Inc. All rights reserved.
          </p>

        </div>
      </div>

      {/* 🌙 DARK MODE FIX USING YOUR DATA-THEME SYSTEM */}
      <style jsx global>{`

        /* BACKGROUND */
        [data-theme="dark"] .footer-wrapper {
          background: #000000 !important;
          border-color: #1f2937 !important;
        }

        /* HEADINGS */
        [data-theme="dark"] .footer-title {
          color: #ffffff !important;
        }

        /* LINKS */
        [data-theme="dark"] .footer-link {
          color: #d1d5db !important;
        }

        [data-theme="dark"] .footer-link:hover {
          color: #2563eb !important;
        }

        /* SOCIAL ICONS */
        [data-theme="dark"] .social-icon {
          color: #d1d5db !important;
        }

        [data-theme="dark"] .social-icon:hover {
          color: #2563eb !important;
        }

        /* LEGAL */
        [data-theme="dark"] .footer-legal {
          color: #d1d5db !important;
        }

        /* COPYRIGHT */
        [data-theme="dark"] .footer-copy {
          color: #ffffff !important;
        }

        /* BOTTOM BORDER */
        [data-theme="dark"] .footer-bottom {
          border-top: 1px solid #1f2937 !important;
        }

      `}</style>

    </footer>
  );
}