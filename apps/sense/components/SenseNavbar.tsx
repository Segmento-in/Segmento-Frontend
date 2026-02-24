"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SenseNavbar() {
    const mainSiteUrl = "https://segmento.in";

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-50 sticky top-0">
            <div className="flex items-center gap-4">
                {/* Placeholder for Segmento Sense Logo - styling to match main-site/pulse */}
                <div className="text-white font-bold text-xl tracking-tight hidden sm:block">
                    Segmento <span className="text-blue-400 font-light">Sense</span>
                </div>
            </div>

            <Link
                href={mainSiteUrl}
                className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-md"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Segmento.in
            </Link>
        </div>
    );
}
