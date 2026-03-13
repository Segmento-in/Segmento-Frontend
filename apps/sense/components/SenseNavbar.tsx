"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export function SenseNavbar() {
    const pathname = usePathname();
    
    // Updated logic: Check for both /demo and /pricing
    const isInsideSense = pathname === "/pricing" || pathname?.includes('/demo');

    // If on Pricing or Demo page, go back to Sense Marketing Page (/). Otherwise, go to main site.
    const backUrl = isInsideSense ? "/" : "https://segmento.in";
    const backText = isInsideSense ? "Back to Sense" : "Back to Segmento.in";

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-50 sticky top-0">
            <div className="flex items-center gap-4">
                {/* Placeholder for Segmento Sense Logo */}
                <div className="text-white font-bold text-xl tracking-tight hidden sm:block">
                    Segmento <span className="text-blue-400 font-light">Sense</span>
                </div>
            </div>

            <Link
                href={backUrl}
                className="group relative flex items-center text-sm font-semibold text-blue-400 transition-all 
                            bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-400 
                            px-5 py-2.5 rounded-full overflow-hidden"
            >
                {/* Subtle internal glow on hover */}
                <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                
                <span className="relative">
                    {backText}
                </span>
            </Link>
        </div>
    );
}