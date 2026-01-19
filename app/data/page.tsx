"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DataRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to data classification product page
        router.replace("/products/data-classification");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
}
