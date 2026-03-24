"use client"

import * as React from "react"
import { ChevronDown, Filter, CheckCircle2, XCircle, Trash2, Plus, Search } from "lucide-react"
import { cn } from "@/shared/utils"

// ============================================================================
// TYPE DEFINITIONS & DATA SCHEMA
// ============================================================================

type ColumnGroup = "deployment" | "detection" | "performance" | "pricing"

interface Column {
    id: string
    label: string
    group: ColumnGroup
    visible: boolean
}

interface PlatformData {
    id: string
    name: string
    tagline: string
    isHero?: boolean
    isPinned?: boolean
    deployment: {
        hostingType: string
        connectors: string
        compliance: string
    }
    detection: {
        aiModel: string
        contextAware: boolean
        ocrSupport: boolean
    }
    performance: {
        falsePositiveRate: string
        scanSpeed: string
        realTimeMasking: boolean
    }
    pricing: {
        billingModel: string
        baseCost: string
    }
}

// ============================================================================
// COLUMN DEFINITIONS (FIXED - THESE ARE THE FEATURES)
// ============================================================================

const COLUMN_GROUPS: Record<ColumnGroup, { label: string; color: string }> = {
    deployment: {
        label: "Deployment",
        color: "bg-blue-50 text-blue-900",
    },
    detection: {
        label: "Detection Engine",
        color: "bg-purple-50 text-purple-900",
    },
    performance: {
        label: "Performance",
        color: "bg-green-50 text-green-900",
    },
    pricing: {
        label: "Pricing",
        color: "bg-orange-50 text-orange-900",
    },
}

const COLUMNS: Column[] = [
    // Deployment Group
    { id: "hostingType", label: "Hosting Type", group: "deployment", visible: true },
    { id: "connectors", label: "Connectors", group: "deployment", visible: true },
    { id: "compliance", label: "Compliance", group: "deployment", visible: true },

    // Detection Engine Group
    { id: "aiModel", label: "AI Model Architecture", group: "detection", visible: true },
    { id: "contextAware", label: "Context Awareness", group: "detection", visible: true },
    { id: "ocrSupport", label: "OCR Support", group: "detection", visible: true },

    // Performance Group
    { id: "falsePositiveRate", label: "False Positive Rate", group: "performance", visible: true },
    { id: "scanSpeed", label: "Scan Speed", group: "performance", visible: true },
    { id: "realTimeMasking", label: "Real-time Masking", group: "performance", visible: true },

    // Pricing Group
    { id: "billingModel", label: "Billing Model", group: "pricing", visible: true },
    { id: "baseCost", label: "Base Cost", group: "pricing", visible: true },
]

// ============================================================================
// PLATFORM DATABASE (DYNAMIC - THESE ARE THE ROWS/PLATFORMS)
// ============================================================================

const ALL_PLATFORMS: PlatformData[] = [
    {
        id: "segmento",
        name: "Segmento Sense",
        tagline: "AI-Powered PII Detection Platform",
        isHero: true,
        isPinned: true,
        deployment: {
            hostingType: "Hybrid Cloud",
            connectors: "100+ (Databases, APIs, Cloud Storage)",
            compliance: "GDPR, CCPA, HIPAA, SOC 2",
        },
        detection: {
            aiModel: "DeBERTa V3 (Transformer)",
            contextAware: true,
            ocrSupport: true,
        },
        performance: {
            falsePositiveRate: "<1% (Ultra Low)",
            scanSpeed: "500 GB/Hour",
            realTimeMasking: true,
        },
        pricing: {
            billingModel: "Usage-Based",
            baseCost: "$$$",
        },
    },
    {
        id: "bigid",
        name: "BigID",
        tagline: "Enterprise Data Intelligence Platform",
        deployment: {
            hostingType: "SaaS Only",
            connectors: "80+ (Structured Data Focus)",
            compliance: "GDPR, CCPA, LGPD",
        },
        detection: {
            aiModel: "Pattern Matching + ML",
            contextAware: false,
            ocrSupport: true,
        },
        performance: {
            falsePositiveRate: "3-5% (Moderate)",
            scanSpeed: "200 GB/Hour",
            realTimeMasking: false,
        },
        pricing: {
            billingModel: "Seat-Based Licensing",
            baseCost: "$$$$$ (High)",
        },
    },
    {
        id: "onetrust",
        name: "OneTrust",
        tagline: "Privacy & Data Governance Platform",
        deployment: {
            hostingType: "SaaS + On-Premise",
            connectors: "120+ (Broad Integration)",
            compliance: "GDPR, CCPA, ISO 27001",
        },
        detection: {
            aiModel: "Rule-Based + NLP",
            contextAware: true,
            ocrSupport: false,
        },
        performance: {
            falsePositiveRate: "2-4% (Moderate)",
            scanSpeed: "300 GB/Hour",
            realTimeMasking: true,
        },
        pricing: {
            billingModel: "Enterprise Licensing",
            baseCost: "$$$$ (Premium)",
        },
    },
    {
        id: "securiti",
        name: "Securiti.ai",
        tagline: "Unified Data Controls Platform",
        deployment: {
            hostingType: "SaaS + Private Cloud",
            connectors: "90+ (Multi-Cloud Focus)",
            compliance: "GDPR, CCPA, LGPD, APPI",
        },
        detection: {
            aiModel: "Deep Learning + Regex",
            contextAware: true,
            ocrSupport: true,
        },
        performance: {
            falsePositiveRate: "2-3% (Low-Moderate)",
            scanSpeed: "350 GB/Hour",
            realTimeMasking: true,
        },
        pricing: {
            billingModel: "Hybrid (Data Volume + Users)",
            baseCost: "$$$$",
        },
    },
    {
        id: "spirion",
        name: "Spirion",
        tagline: "Sensitive Data Discovery & Protection",
        deployment: {
            hostingType: "On-Premise + Cloud",
            connectors: "50+ (File Systems Focus)",
            compliance: "GDPR, CCPA, PCI DSS",
        },
        detection: {
            aiModel: "Pattern Matching",
            contextAware: false,
            ocrSupport: false,
        },
        performance: {
            falsePositiveRate: "5-7% (Moderate-High)",
            scanSpeed: "180 GB/Hour",
            realTimeMasking: false,
        },
        pricing: {
            billingModel: "Perpetual License",
            baseCost: "$$$",
        },
    },
    {
        id: "datagrail",
        name: "DataGrail",
        tagline: "Privacy Management Automation",
        deployment: {
            hostingType: "SaaS Only",
            connectors: "1000+ (SaaS Apps Focus)",
            compliance: "GDPR, CCPA, PIPEDA",
        },
        detection: {
            aiModel: "ML + Graph Analysis",
            contextAware: false,
            ocrSupport: false,
        },
        performance: {
            falsePositiveRate: "4-6% (Moderate)",
            scanSpeed: "250 GB/Hour",
            realTimeMasking: false,
        },
        pricing: {
            billingModel: "Per-Request Pricing",
            baseCost: "$$",
        },
    },
]

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const BooleanCell = ({ value }: { value: boolean }) => (
    <div className="flex items-center justify-center">
        {value ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
            <XCircle className="w-5 h-5 text-gray-300" />
        )}
    </div>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CompetitiveComparisonTable() {
    // ========== STATE MANAGEMENT ==========
    const [visiblePlatformIds, setVisiblePlatformIds] = React.useState<string[]>(['segmento', 'bigid'])
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(
        Object.fromEntries(COLUMNS.map(col => [col.id, col.visible]))
    )
    const [showFilterDropdown, setShowFilterDropdown] = React.useState(false)
    const [showPlatformDropdown, setShowPlatformDropdown] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const filterDropdownRef = React.useRef<HTMLDivElement>(null)
    const platformDropdownRef = React.useRef<HTMLDivElement>(null)

    // ========== HANDLERS ==========
    const addPlatform = (platformId: string) => {
        if (!visiblePlatformIds.includes(platformId)) {
            setVisiblePlatformIds([...visiblePlatformIds, platformId])
            setSearchQuery("")
            setShowPlatformDropdown(false)
        }
    }

    const removePlatform = (platformId: string) => {
        const platform = ALL_PLATFORMS.find(p => p.id === platformId)
        // Don't allow removing pinned platforms
        if (platform?.isPinned) return

        setVisiblePlatformIds(visiblePlatformIds.filter(id => id !== platformId))
    }

    const toggleColumn = (columnId: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnId]: !prev[columnId]
        }))
    }

    const toggleGroup = (group: ColumnGroup) => {
        const groupColumns = COLUMNS.filter(col => col.group === group)
        const allVisible = groupColumns.every(col => columnVisibility[col.id])

        const updates: Record<string, boolean> = {}
        groupColumns.forEach(col => {
            updates[col.id] = !allVisible
        })

        setColumnVisibility(prev => ({ ...prev, ...updates }))
    }

    // ========== COMPUTED VALUES ==========
    const visiblePlatforms = ALL_PLATFORMS.filter(platform =>
        visiblePlatformIds.includes(platform.id)
    )

    const availablePlatforms = ALL_PLATFORMS.filter(platform =>
        !visiblePlatformIds.includes(platform.id) &&
        platform.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const visibleColumns = COLUMNS.filter(col => columnVisibility[col.id])

    const groupedColumns = React.useMemo(() => {
        const groups: Record<ColumnGroup, Column[]> = {
            deployment: [],
            detection: [],
            performance: [],
            pricing: [],
        }

        visibleColumns.forEach(col => {
            groups[col.group].push(col)
        })

        return groups
    }, [visibleColumns])

    const getCellValue = (platform: PlatformData, columnId: string): React.ReactNode => {
        switch (columnId) {
            case "hostingType": return platform.deployment.hostingType
            case "connectors": return platform.deployment.connectors
            case "compliance": return platform.deployment.compliance
            case "aiModel": return platform.detection.aiModel
            case "contextAware": return <BooleanCell value={platform.detection.contextAware} />
            case "ocrSupport": return <BooleanCell value={platform.detection.ocrSupport} />
            case "falsePositiveRate": return platform.performance.falsePositiveRate
            case "scanSpeed": return platform.performance.scanSpeed
            case "realTimeMasking": return <BooleanCell value={platform.performance.realTimeMasking} />
            case "billingModel": return platform.pricing.billingModel
            case "baseCost": return platform.pricing.baseCost
            default: return "N/A"
        }
    }

    // ========== CLICK OUTSIDE HANDLERS ==========
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setShowFilterDropdown(false)
            }
            if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node)) {
                setShowPlatformDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // ========== RENDER ==========
    return (
        <div className="w-full relative">
            {/* ==================== CONTROL BAR ==================== */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Add Platform Control */}
                <div className="relative w-full sm:w-96" ref={platformDropdownRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search and add platforms..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setShowPlatformDropdown(true)
                            }}
                            onFocus={() => setShowPlatformDropdown(true)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Platform Dropdown */}
                    {showPlatformDropdown && availablePlatforms.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                            {availablePlatforms.map(platform => (
                                <button
                                    key={platform.id}
                                    onClick={() => addPlatform(platform.id)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                            <Plus className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900">{platform.name}</div>
                                            <div className="text-xs text-gray-500">{platform.tagline}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filter Columns Control */}
                <div className="relative" ref={filterDropdownRef}>
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filter Columns
                        <ChevronDown className={cn("w-4 h-4 transition-transform", showFilterDropdown && "rotate-180")} />
                    </button>

                    {showFilterDropdown && (
                        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-semibold text-sm text-gray-900">Column Visibility</h3>
                            </div>

                            {Object.entries(COLUMN_GROUPS).map(([groupKey, groupConfig]) => {
                                const group = groupKey as ColumnGroup
                                const groupColumns = COLUMNS.filter(col => col.group === group)
                                const allVisible = groupColumns.every(col => columnVisibility[col.id])

                                return (
                                    <div key={group} className="border-b border-gray-100 last:border-b-0">
                                        <button
                                            onClick={() => toggleGroup(group)}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                                        >
                                            <span className="font-medium text-sm text-gray-700">{groupConfig.label}</span>
                                            <input
                                                type="checkbox"
                                                checked={allVisible}
                                                onChange={() => { }}
                                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                            />
                                        </button>

                                        <div className="px-4 pb-2">
                                            {groupColumns.map(col => (
                                                <label
                                                    key={col.id}
                                                    className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                                >
                                                    <span className="text-sm text-gray-600">{col.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={columnVisibility[col.id]}
                                                        onChange={() => toggleColumn(col.id)}
                                                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Platform Count Indicator */}
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Comparing {visiblePlatforms.length} platform{visiblePlatforms.length !== 1 ? 's' : ''}</span>
                <span className="text-gray-400">•</span>
                <span>{availablePlatforms.length} more available</span>
            </div>

            {/* ==================== COMPARISON TABLE ==================== */}
            <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse text-sm">
                    {/* HEADER ROW 1: Group Headers */}
                    <thead>
                        <tr className="bg-gray-50">
                            {/* Sticky Platform Name Column */}
                            <th
                                className="sticky left-0 z-20 bg-gray-50 border-b-2 border-r-2 border-gray-200 px-4 py-3 text-left font-bold text-gray-900"
                                rowSpan={2}
                            >
                                Platform Name
                            </th>

                            {/* Group Headers */}
                            {Object.entries(groupedColumns).map(([groupKey, columns]) => {
                                if (columns.length === 0) return null
                                const group = groupKey as ColumnGroup
                                const config = COLUMN_GROUPS[group]

                                return (
                                    <th
                                        key={group}
                                        colSpan={columns.length}
                                        className={cn(
                                            "border-b border-r border-gray-200 px-4 py-3 text-center font-bold text-sm",
                                            config.color
                                        )}
                                    >
                                        {config.label}
                                    </th>
                                )
                            })}
                        </tr>

                        {/* HEADER ROW 2: Metric Headers */}
                        <tr className="bg-white">
                            {visibleColumns.map((col, idx) => (
                                <th
                                    key={col.id}
                                    className={cn(
                                        "border-b-2 border-gray-200 px-4 py-3 text-center font-semibold text-xs text-gray-700",
                                        idx < visibleColumns.length - 1 && "border-r border-gray-200"
                                    )}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* BODY: Platform Rows (DYNAMIC) */}
                    <tbody>
                        {visiblePlatforms.map((platform, platformIdx) => (
                            <tr
                                key={platform.id}
                                className={cn(
                                    "transition-colors group",
                                    platform.isHero
                                        ? "bg-primary-50/30 hover:bg-primary-50/50 border-l-4 border-l-primary-500"
                                        : "hover:bg-gray-50"
                                )}
                            >
                                {/* Sticky Platform Name Cell with Remove Button */}
                                <td
                                    className={cn(
                                        "sticky left-0 z-10 border-b border-r-2 border-gray-200 px-4 py-4 font-bold",
                                        platform.isHero
                                            ? "bg-primary-50/40 text-primary-900"
                                            : "bg-white text-gray-900"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate">{platform.name}</span>
                                                {platform.isHero && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-600 text-white whitespace-nowrap">
                                                        Current
                                                    </span>
                                                )}
                                                {platform.isPinned && !platform.isHero && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700 whitespace-nowrap">
                                                        Pinned
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5 truncate">{platform.tagline}</div>
                                        </div>

                                        {/* Remove Button (Hidden for Pinned Platforms) */}
                                        {!platform.isPinned && (
                                            <button
                                                onClick={() => removePlatform(platform.id)}
                                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-600"
                                                aria-label={`Remove ${platform.name}`}
                                                title={`Remove ${platform.name}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>

                                {/* Data Cells */}
                                {visibleColumns.map((col, idx) => (
                                    <td
                                        key={col.id}
                                        className={cn(
                                            "border-b px-4 py-4 text-gray-700",
                                            idx < visibleColumns.length - 1 && "border-r border-gray-200",
                                            platform.isHero && "bg-primary-50/20"
                                        )}
                                    >
                                        <div className="text-center">
                                            {getCellValue(platform, col.id)}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {visiblePlatforms.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                    <div className="text-gray-400 mb-2">
                        <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 font-medium">No platforms selected</p>
                    <p className="text-sm text-gray-500 mt-1">Use the search bar above to add platforms</p>
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-300" />
                        <span>Not Supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-primary-500 rounded"></div>
                        <span>Segmento Sense (Current Platform)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                        <span>Hover over platform name to remove</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
