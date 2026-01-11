"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if current route is under /pulse
    const isPulsePage = pathname?.startsWith('/pulse');

    // For Pulse pages, render only children (Pulse has its own layout)
    if (isPulsePage) {
        return <>{children}</>;
    }

    // For other pages, include Header and Footer
    return (
        <>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    );
}
