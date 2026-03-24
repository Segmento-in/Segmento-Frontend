"use client"

import { useState, useMemo, Fragment } from "react"
import { motion } from "framer-motion"
import {
    Shield,
    Zap,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Info,
    Check,
} from "lucide-react"
import {
    COMPETITORS,
    COMPARISON_DATA,
    getComparisonForCompetitors,
    type Competitor,
    type ComparisonCategory,
} from "@/lib/comparison-data"

// --- Category metadata ---
const CATEGORY_META: Record<
    ComparisonCategory,
    { icon: typeof Shield; color: string; bg: string; border: string }
> = {
    Architecture: {
        icon: Shield,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
    Performance: {
        icon: Zap,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
    },
    Cost: {
        icon: DollarSign,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
    },
}

// --- Default competitors ---
const DEFAULT_SELECTED = ["spirion", "bigid", "aws-macie"]
const MAX_COMPETITORS = 3

export function SenseComparisonTable() {
    const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED)
    const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
    const [showPicker, setShowPicker] = useState(false)

    // Filtered data based on selection
    const filteredData = useMemo(
        () => getComparisonForCompetitors(selected),
        [selected]
    )

    // Resolve competitor objects
    const selectedCompetitors = useMemo(
        () =>
            selected
                .map((id) => COMPETITORS.find((c) => c.id === id))
                .filter(Boolean) as Competitor[],
        [selected]
    )

    // Group rows by category
    const groupedData = useMemo(() => {
        const groups: Record<ComparisonCategory, typeof filteredData> = {
            Architecture: [],
            Performance: [],
            Cost: [],
        }
        filteredData.forEach((row) => {
            groups[row.category].push(row)
        })
        return groups
    }, [filteredData])

    const toggleCompetitor = (id: string) => {
        setSelected((prev) => {
            if (prev.includes(id)) {
                // Don't allow deselecting below 1
                if (prev.length <= 1) return prev
                return prev.filter((s) => s !== id)
            }
            // Don't allow more than MAX
            if (prev.length >= MAX_COMPETITORS) return prev
            return [...prev, id]
        })
    }

    return (
        <section
            id="comparison-table"
            className="relative py-20 xl:py-32 bg-[#F8FAFF] overflow-hidden"
        >
            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/50 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/40 blur-[100px] pointer-events-none" />

            <div className="container relative mx-auto px-6 z-10 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-12 xl:mb-16"
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className="h-[2.5px] w-10 bg-blue-600" />
                    </div>
                    <h2 className="text-4xl xl:text-7xl font-black text-[#0F172A] leading-[0.95] tracking-tighter mb-8">
                        See Why Engineering Teams  <br />
                        <span className="text-blue-600">Choose Sense</span>
                    </h2>
                    <p className="text-lg xl:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Commercial PII tools hide their logic and charge extra for essential features like OCR. Discover how our Consensus Engine and Explainable AI outperform traditional platforms by giving you total control over the "False Positive vs. Missed Data" trade-off.
                    </p>
                </motion.div>

                {/* Competitor Picker */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="mb-10"
                >
                    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 xl:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                                  Compare Sense vs. Legacy Platforms
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Choose up to {MAX_COMPETITORS} competitors
                                    for a side-by-side comparison
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPicker((p) => !p)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-colors self-start"
                            >
                                {showPicker ? "Hide" : "Change"} Competitors
                                {showPicker ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Expanded Picker */}
                        {showPicker && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6"
                            >
                                {COMPETITORS.map((comp) => {
                                    const isSelected = selected.includes(
                                        comp.id
                                    )
                                    const isDisabled =
                                        !isSelected &&
                                        selected.length >= MAX_COMPETITORS
                                    return (
                                        <button
                                            key={comp.id}
                                            onClick={() =>
                                                toggleCompetitor(comp.id)
                                            }
                                            disabled={isDisabled}
                                            className={`
                                                relative text-left p-4 rounded-xl border-2 transition-all duration-200
                                                ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                                        : isDisabled
                                                          ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                                                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer"
                                                }
                                            `}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                            <div className="font-bold text-sm text-[#0F172A]">
                                                {comp.name}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                {comp.tagline}
                                            </div>
                                        </button>
                                    )
                                })}
                            </motion.div>
                        )}

                        {/* Selected chips */}
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 bg-blue-600 text-white text-xs font-black rounded-lg tracking-wide">
                                SEGMENTO SENSE
                            </span>
                            <span className="text-slate-400 font-bold text-sm self-center">
                                vs
                            </span>
                            {selectedCompetitors.map((comp) => (
                                <span
                                    key={comp.id}
                                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200"
                                >
                                    {comp.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        delay: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            {/* Table Head */}
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[200px]">
                                        Criteria
                                    </th>
                                    <th className="py-5 px-4 text-center min-w-[160px]">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                                            <Zap className="w-4 h-4 fill-white" />
                                            <span className="text-xs font-black tracking-wide">
                                                SEGMENTO
                                            </span>
                                        </div>
                                    </th>
                                    {selectedCompetitors.map((comp) => (
                                        <th
                                            key={comp.id}
                                            className="py-5 px-4 text-center min-w-[140px]"
                                        >
                                            <div className="text-sm font-bold text-[#0F172A]">
                                                {comp.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                                {comp.tagline}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {(
                                    Object.keys(groupedData) as ComparisonCategory[]
                                ).map((category) => {
                                    const meta = CATEGORY_META[category]
                                    const Icon = meta.icon
                                    const rows = groupedData[category]

                                    if (rows.length === 0) return null

                                    return (
                                        <Fragment key={category}>
                                            {/* Category Header Row */}
                                            <tr>
                                                <td
                                                    colSpan={
                                                        2 +
                                                        selectedCompetitors.length
                                                    }
                                                    className="pt-8 pb-3 px-6"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${meta.bg} ${meta.border} border`}
                                                        >
                                                            <Icon
                                                                className={`w-4 h-4 ${meta.color}`}
                                                            />
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                                                            {category}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Data Rows */}
                                            {rows.map((row, idx) => {
                                                const isExpanded =
                                                    expandedInsight ===
                                                    `${category}-${idx}`
                                                return (
                                                    <tr
                                                        key={`${category}-${idx}`}
                                                        className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                                                    >
                                                        {/* Criteria Label */}
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-sm font-bold text-[#0F172A]">
                                                                    {row.label}
                                                                </span>
                                                                {row.insight && (
                                                                    <button
                                                                        onClick={() =>
                                                                            setExpandedInsight(
                                                                                isExpanded
                                                                                    ? null
                                                                                    : `${category}-${idx}`
                                                                            )
                                                                        }
                                                                        className="flex-shrink-0 mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                                                                        aria-label="Show insight"
                                                                    >
                                                                        <Info className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {isExpanded &&
                                                                row.insight && (
                                                                    <motion.p
                                                                        initial={{
                                                                            opacity: 0,
                                                                            height: 0,
                                                                        }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            height: "auto",
                                                                        }}
                                                                        className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[220px]"
                                                                    >
                                                                        {
                                                                            row.insight
                                                                        }
                                                                    </motion.p>
                                                                )}
                                                        </td>

                                                        {/* Segmento Value (highlighted) */}
                                                        <td className="py-4 px-4 text-center bg-blue-50/50">
                                                            <span className="text-sm font-bold text-blue-700">
                                                                {
                                                                    row.segmentoValue
                                                                }
                                                            </span>
                                                        </td>

                                                        {/* Competitor Values */}
                                                        {selectedCompetitors.map(
                                                            (comp) => (
                                                                <td
                                                                    key={
                                                                        comp.id
                                                                    }
                                                                    className="py-4 px-4 text-center"
                                                                >
                                                                    <span className="text-sm text-slate-600">
                                                                        {row
                                                                            .competitorValues[
                                                                            comp
                                                                                .id
                                                                        ] ||
                                                                            "—"}
                                                                    </span>
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                )
                                            })}
                                        </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
