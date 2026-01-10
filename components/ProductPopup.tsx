"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setOpen(true), 1000); // show popup after 1 second
        return () => clearTimeout(timer);
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-8 relative animate-fade-in">

                {/* Close Button */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-2xl font-bold text-black hover:text-gray-700"
                >
                    ×
                </button>

                {/* Headline */}
                <h1 className="text-center text-sm md:text-base font-semibold text-black mb-2 uppercase tracking-wide">
                    Explore Our Product
                </h1>

                {/* Product Name */}
                <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#9D17A0] mb-4">
                    Segmento Sense
                </h2>

                {/* Description */}
                <p className="text-center text-gray-800 mb-6 text-sm md:text-base">
                    Segmento Sense helps businesses intelligently classify, secure, and analyze customer data
                    to unlock real-time insights and make smarter decisions.
                </p>

                {/* Explore Button */}
                <div className="flex justify-center">
                    <Link href="/products/data-classification">
                        <button className="px-6 py-3 bg-[#9D17A0] text-white rounded-lg font-semibold hover:opacity-90 transition">
                            Explore
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
