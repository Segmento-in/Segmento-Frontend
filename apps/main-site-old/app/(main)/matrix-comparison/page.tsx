"use client"

import * as React from "react"
import { ComparisonMatrix } from "@/app/(main)/components/comparison"

export default function MatrixComparisonPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-6 py-10">
                <ComparisonMatrix />
            </div>
        </div>
    )
}
