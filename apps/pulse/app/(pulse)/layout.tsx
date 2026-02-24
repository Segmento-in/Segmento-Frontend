'use client';

import { useState } from "react";
import PulseNavbar from "@/components/Navbar";
import NewsletterHub from "@/components/NewsletterHub";
import { Dialog, DialogContent } from "@/ui/dialog";
import "./pulse-animations.css";

export default function PulseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PulseNavbar onSubscribeClick={() => setIsNewsletterOpen(true)} />
            <main className="flex-1 bg-gray-50">
                {children}
            </main>
            <footer className="border-t mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    © 2026 Segmento
                </div>
            </footer>

            {/* Newsletter Subscription Modal */}
            <Dialog open={isNewsletterOpen} onOpenChange={setIsNewsletterOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <NewsletterHub />
                </DialogContent>
            </Dialog>
        </div>
    );
}

