import Link from "next/link";
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
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "By Industry", href: "/#industry" },
      { name: "By Use Case", href: "/#use-case" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/#docs" },
      { name: "API", href: "/#api" },
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
          {/* Logo & Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2.5 mb-8">
              <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-extrabold text-xl">S</span>
              </div>
              <span className="text-slate-900 font-bold text-2xl tracking-tight">
                Segmento
              </span>
            </Link>
          </div>

          {/* Links Grid */}
          {footerLinks.map((column) => (
            <div key={column.title} className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-8 text-lg">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-slate-900 transition-colors text-base font-semibold"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-8">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Facebook className="w-5 h-5 fill-current" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Twitter className="w-5 h-5 fill-current" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Youtube className="w-6 h-6 fill-current" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Linkedin className="w-5 h-5 fill-current" />
            </a>
          </div>

          <div className="flex items-center space-x-8 text-sm font-bold text-slate-500">
            <Link href="/#legal" className="hover:text-slate-900">Legal</Link>
            <Link href="/#privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/#terms" className="hover:text-slate-900">Terms</Link>
            <Link href="/#help" className="hover:text-slate-900">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
