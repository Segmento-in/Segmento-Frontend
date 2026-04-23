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
    links: [
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Contact",
    links: [
      { name: "Locations", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", size: "w-5 h-5" },
  { icon: Twitter, href: "#", size: "w-5 h-5" },
  { icon: Github, href: "https://github.com/Segmento-in", size: "w-5 h-5" }, // Added GitHub
  { icon: Youtube, href: "#", size: "w-6 h-6" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/segmento-india", size: "w-5 h-5" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 pt-16 pb-10 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 lg:col-span-1"
          >
            <Link href="/" className="flex items-center shrink-0 mb-3">
              <Image
                src="/images/logo-final.png"
                alt="Segmento"
                width={180}
                height={28}
                priority
              />
            </Link>
            {/* <p className="text-slate-500 font-medium text-[12px] leading-relaxed max-w-[180px]">
              Empowering enterprises with intelligent data classification and privacy insights.
            </p> */}
          </motion.div>

          {/* Links Grid */}
          {footerLinks.map((column, colIdx) => (
            <motion.div 
              key={`footer-col-${colIdx}-${column.title}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIdx * 0.05 }}
              className="col-span-1"
            >
              <h4 className="font-bold text-slate-900 mb-5 text-[11px] uppercase tracking-[0.15em]">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, linkIdx) => (
                  <li key={`${column.title}-link-${linkIdx}`}>
                    <Link
                      href={link.href}
                      className="text-slate-500 hover:text-[#2563EB] transition-colors text-[13px] font-semibold group flex items-center"
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[#2563EB] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col items-center justify-center gap-6">
          
          {/* Social Icons */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                whileHover={{ y: -3, scale: 1.1 }}
                className="text-slate-400 hover:text-[#2563EB] transition-colors p-1"
              >
                <social.icon className={`${social.size} fill-current`} />
              </motion.a>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 w-full">
            {/* Legal Links */}
            <div className="flex items-center justify-center space-x-8 text-[12px] font-bold text-slate-500">
              {['Legal', 'Privacy', 'Terms', 'Help'].map((item) => (
                <Link 
                  key={item} 
                  href={`/#${item.toLowerCase()}`} 
                  className="hover:text-[#2563EB] transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-300 transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-slate-400 text-[11px] font-medium text-center">
              © {currentYear} Segmento Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}