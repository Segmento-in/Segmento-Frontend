"use client"

import * as React from "react"
import { X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"
import {
    COMPARISON_DATA,
    getCompetitorById,
    type ComparisonCategory,
} from "@/lib/comparison-data"

interface ComparisonTableProps {
    selectedCompetitors: string[]
    onRemoveCompetitor: (competitorId: string) => void
}

const CATEGORY_CONFIG: Record<
    ComparisonCategory,
    { label: string; color: string }
> = {
    Architecture: { label: "Architecture", color: "bg-blue-50 border-blue-200" },
    Performance: { label: "Performance", color: "bg-green-50 border-green-200" },
    Cost: { label: "Cost", color: "bg-purple-50 border-purple-200" },
}

export function ComparisonTable({
    selectedCompetitors,
    onRemoveCompetitor,
}: ComparisonTableProps) {
    const competitors = selectedCompetitors
        .map((id) => getCompetitorById(id))
        .filter(Boolean)

    // Group rows by category
    const groupedData = React.useMemo(() => {
        const groups: Record<ComparisonCategory, typeof COMPARISON_DATA> = {
            Architecture: [],
            Performance: [],
            Cost: [],
        }

        COMPARISON_DATA.forEach((row) => {
            groups[row.category].push(row)
        })

        return groups
    }, [])

    if (selectedCompetitors.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                    <Sparkles className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                    Start Comparing Competitors
                </h3>
                <p className="text-muted-foreground">
                    Add competitors to see how Segmento Sense compares across architecture,
                    performance, and cost.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-background border-b-2 border-gray-200 pb-4 mb-6">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `250px repeat(${selectedCompetitors.length + 1}, 1fr)` }}>
                        {/* Empty cell for criteria column */}
                        <div></div>

                        {/* Segmento Sense Header (Always First) */}
                        <div className="relative group">
                            <div className="h-full rounded-lg border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 shadow-md">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-bold text-lg text-primary-900">
                                        Segmento Sense
                                    </h3>
                                </div>
                                <p className="text-sm text-primary-700 font-medium">
                                    Your Selection ✨
                                </p>
                            </div>
                        </div>

                        {/* Competitor Headers */}
                        {competitors.map((competitor) => (
                            <div key={competitor!.id} className="relative group">
                                <button
                                    onClick={() => onRemoveCompetitor(competitor!.id)}
                                    className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                    aria-label={`Remove ${competitor!.name}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="h-full rounded-lg border-2 border-gray-300 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-lg text-foreground mb-2">
                                        {competitor!.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {competitor!.tagline}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Rows by Category */}
                <div className="space-y-8">
                    {(Object.keys(groupedData) as ComparisonCategory[]).map((category) => {
                        const rows = groupedData[category]
                        const config = CATEGORY_CONFIG[category]

                        return (
                            <div key={category}>
                                {/* Category Header */}
                                <div
                                    className={cn(
                                        "px-4 py-3 rounded-lg border-l-4 mb-4",
                                        config.color
                                    )}
                                >
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {config.label}
                                    </h2>
                                </div>

                                {/* Category Rows */}
                                <div className="space-y-2">
                                    {rows.map((row, rowIndex) => (
                                        <div
                                            key={`${category}-${rowIndex}`}
                                            className="grid gap-4 hover:bg-gray-50 py-3 px-2 rounded-lg transition-colors"
                                            style={{ gridTemplateColumns: `250px repeat(${selectedCompetitors.length + 1}, 1fr)` }}
                                        >
                                            {/* Criteria Label */}
                                            <div className="flex items-center gap-2 font-semibold text-gray-700">
                                                <span>{row.label}</span>
                                                {row.insight && <Tooltip content={row.insight} />}
                                            </div>

                                            {/* Segmento Value */}
                                            <div className="flex items-center p-3 rounded-md bg-primary-50/40 border border-primary-200">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {row.segmentoValue}
                                                </span>
                                            </div>

                                            {/* Competitor Values */}
                                            {selectedCompetitors.map((competitorId) => (
                                                <div
                                                    key={competitorId}
                                                    className="flex items-center p-3 rounded-md bg-gray-50 border border-gray-200"
                                                >
                                                    <span className="text-sm text-gray-700">
                                                        {row.competitorValues[competitorId] || "N/A"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
