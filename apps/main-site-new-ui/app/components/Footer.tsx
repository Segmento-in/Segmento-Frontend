"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Facebook, Youtube, Linkedin } from "lucide-react";

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
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
      { name: "Segmento Enrich", href: "/#enrich" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "By Industry", href: "/#industry" },
      { name: "By Use Case", href: "/#use-case" },
      { name: "Enterprise", href: "/#enterprise" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/#docs" },
      { name: "API Reference", href: "/#api" },
      { name: "Case Studies", href: "/#cases" },
      { name: "Webinars", href: "/#webinars" },
    ],
  },
  {
    title: "Contact",
    links: [
      { name: "Sales", href: "/contact" },
      { name: "Support", href: "/#support" },
      { name: "Locations", href: "/#locations" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", size: "w-5 h-5" },
  { icon: Twitter, href: "#", size: "w-5 h-5" },
  { icon: Youtube, href: "#", size: "w-6 h-6" },
  { icon: Linkedin, href: "#", size: "w-5 h-5" },
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
            <Link href="/" className="group flex items-center space-x-2.5 mb-4 w-fit">
              <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-slate-900 font-bold text-2xl tracking-tight">
                Segmento
              </span>
            </Link>
            <p className="text-slate-500 font-medium text-[12px] leading-relaxed max-w-[180px]">
              Empowering enterprises with intelligent data classification and privacy insights.
            </p>
          </motion.div>

          {/* Links Grid */}
          {footerLinks.map((column, colIdx) => (
            <motion.div 
              key={column.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIdx * 0.05 }}
              className="col-span-1"
            >
              <h4 className="font-bold text-slate-900 mb-5 text-[11px] uppercase tracking-[0.15em]">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
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