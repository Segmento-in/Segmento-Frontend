"use client"

import { ComparisonMatrix } from "@/app/(main)/components/comparison"

export default function ComparePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Clean Comparison Matrix - Full Page */}
            <section className="container mx-auto px-4 py-4">
                <ComparisonMatrix />
            </section>
        </div>
    )
}
