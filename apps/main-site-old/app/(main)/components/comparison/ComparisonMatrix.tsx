"use client"

import * as React from "react"
import { Plus, X, Search, Info } from "lucide-react"
import { cn } from "@/shared/utils"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type FeatureCategory = "deployment" | "detection" | "coverage" | "governance"

interface Feature {
    id: string
    label: string
    category: FeatureCategory
    description?: string
}

interface PlatformFeatures {
    [featureId: string]: string  // Feature ID -> Descriptive text value
}

interface Platform {
    id: string
    name: string
    type: "open-source" | "commercial"
    tagline: string
    domain?: string  // Domain for logo fetching via Google Favicon API
    logoUrl?: string  // Custom logo URL (overrides domain-based fetching)
    isHero?: boolean
    isPinned?: boolean
    features: PlatformFeatures
}

// ============================================================================
// FEATURE DEFINITIONS (ROWS)
// ============================================================================

const FEATURE_CATEGORIES: Record<FeatureCategory, { label: string; color: string }> = {
    deployment: {
        label: "Deployment & Core",
        color: "bg-blue-50 text-blue-900 border-l-4 border-l-blue-500",
    },
    detection: {
        label: "Detection Technology",
        color: "bg-purple-50 text-purple-900 border-l-4 border-l-purple-500",
    },
    coverage: {
        label: "Data Source Coverage",
        color: "bg-green-50 text-green-900 border-l-4 border-l-green-500",
    },
    governance: {
        label: "Governance & Remediation",
        color: "bg-orange-50 text-orange-900 border-l-4 border-l-orange-500",
    },
}

const FEATURES: Feature[] = [
    // Deployment & Core
    { id: "hosting", label: "Hosting Model", category: "deployment" },
    { id: "agentType", label: "Agent Architecture", category: "deployment" },
    { id: "primaryRole", label: "Primary Role", category: "deployment" },

    // Detection Technology
    { id: "regex", label: "Regex/Pattern Matching", category: "detection" },
    { id: "mlNlp", label: "ML/NLP (NER)", category: "detection" },
    { id: "ocr", label: "OCR (Images/PDFs)", category: "detection" },
    { id: "contextAwareness", label: "Context Awareness", category: "detection" },
    { id: "identityLinking", label: "Identity Linking", category: "detection" },

    // Coverage
    { id: "structuredDbs", label: "Structured Databases", category: "coverage" },
    { id: "unstructuredFiles", label: "Unstructured Files", category: "coverage" },
    { id: "cloudStorage", label: "Cloud Storage (S3/Azure)", category: "coverage" },
    { id: "saasApps", label: "SaaS Apps (Slack/Drive)", category: "coverage" },

    // Governance
    { id: "masking", label: "Masking/Redaction", category: "governance" },
    { id: "quarantine", label: "Data Quarantine", category: "governance" },
    { id: "aclChanges", label: "ACL Modifications", category: "governance" },
    { id: "policyEngine", label: "Policy Engine", category: "governance" },
]

// ============================================================================
// PLATFORM DATABASE (COLUMNS)
// ============================================================================

const ALL_PLATFORMS: Platform[] = [
    // HERO PLATFORM (Commercial)
    {
        id: "segmento",
        name: "Segmento Sense",
        type: "commercial",
        tagline: "AI-Powered PII Detection Platform",
        domain: "segmento.in",
        logoUrl: "/images/segmento_logo.png",
        isHero: true,
        isPinned: true,
        features: {
            hosting: "Hybrid Cloud",
            agentType: "Agentless (API-Based)",
            primaryRole: "Discovery + Governance",
            regex: "Advanced Pattern Library",
            mlNlp: "DeBERTa V3 Transformer",
            ocr: "Native (Tesseract + Custom)",
            contextAwareness: "Semantic Analysis",
            identityLinking: "Cross-Source Correlation",
            structuredDbs: "100+ Native Connectors",
            unstructuredFiles: "Recursive File Scanning",
            cloudStorage: "S3, Azure Blob, GCS",
            saasApps: "OAuth-Based Integration",
            masking: "API Proxy Masking",
            quarantine: "Automated Quarantine",
            aclChanges: "Policy-Driven ACL",
            policyEngine: "Visual Policy Builder",
        },
    },

    // COMMERCIAL PLATFORMS
    {
        id: "bigid",
        name: "BigID",
        type: "commercial",
        tagline: "Enterprise Data Intelligence Platform",
        domain: "bigid.com",
        features: {
            hosting: "SaaS Only",
            agentType: "Agent-Based",
            primaryRole: "Discovery Focused",
            regex: "Pattern Matching",
            mlNlp: "Basic ML Classifiers",
            ocr: "Via 3rd Party Integration",
            contextAwareness: "Limited",
            identityLinking: "Via Graph Database",
            structuredDbs: "80+ Connectors",
            unstructuredFiles: "File-Level Scanning",
            cloudStorage: "S3, Azure (Premium Tier)",
            saasApps: "50+ Apps via API",
            masking: "Post-Process Only",
            quarantine: "Manual Workflow",
            aclChanges: "Recommendation Only",
            policyEngine: "Template-Based",
        },
    },
    {
        id: "onetrust",
        name: "OneTrust",
        type: "commercial",
        tagline: "Privacy & Data Governance Platform",
        domain: "onetrust.com",
        features: {
            hosting: "SaaS + On-Premise",
            agentType: "Hybrid (Agent + Agentless)",
            primaryRole: "Governance Focused",
            regex: "Rule-Based Engine",
            mlNlp: "NLP for Classification",
            ocr: "Not Available",
            contextAwareness: "Metadata-Based",
            identityLinking: "Identity Graph",
            structuredDbs: "120+ Connectors",
            unstructuredFiles: "Network Share Scanning",
            cloudStorage: "Multi-Cloud Support",
            saasApps: "100+ Pre-Built Integrations",
            masking: "Tokenization",
            quarantine: "Consent Management",
            aclChanges: "Automated ACL Updates",
            policyEngine: "Compliance Templates",
        },
    },
    {
        id: "securiti",
        name: "Securiti.ai",
        type: "commercial",
        tagline: "Unified Data Controls Platform",
        domain: "securiti.ai",
        features: {
            hosting: "SaaS + Private Cloud",
            agentType: "Agentless",
            primaryRole: "Discovery + Privacy",
            regex: "Pattern Recognition",
            mlNlp: "Deep Learning Models",
            ocr: "Native OCR",
            contextAwareness: "Context-Aware Scanning",
            identityLinking: "PII Correlation",
            structuredDbs: "90+ Data Sources",
            unstructuredFiles: "Content-Aware Scanning",
            cloudStorage: "S3, Azure, GCS",
            saasApps: "SaaS Discovery",
            masking: "Dynamic Masking",
            quarantine: "Automated Isolation",
            aclChanges: "Policy-Based",
            policyEngine: "AI-Driven Policies",
        },
    },
    {
        id: "spirion",
        name: "Spirion",
        type: "commercial",
        tagline: "Sensitive Data Discovery",
        domain: "spirion.com",
        features: {
            hosting: "On-Premise + Cloud",
            agentType: "Agent-Based",
            primaryRole: "Discovery",
            regex: "Advanced Regex",
            mlNlp: "Pattern Matching Only",
            ocr: "Not Available",
            contextAwareness: "Rule-Based",
            identityLinking: "Not Available",
            structuredDbs: "50+ Databases",
            unstructuredFiles: "File System Crawling",
            cloudStorage: "Limited Cloud Support",
            saasApps: "Not Available",
            masking: "Redaction to File",
            quarantine: "Move to Secure Location",
            aclChanges: "Manual Only",
            policyEngine: "Custom Rules",
        },
    },
    {
        id: "cyera",
        name: "Cyera",
        type: "commercial",
        tagline: "Data Security Posture Management",
        domain: "cyera.io",
        features: {
            hosting: "SaaS",
            agentType: "Agentless (API)",
            primaryRole: "Discovery + Security",
            regex: "Pattern Matching",
            mlNlp: "ML Classification",
            ocr: "Via Partners",
            contextAwareness: "Data Context Analysis",
            identityLinking: "Identity Mapping",
            structuredDbs: "Cloud Database Focus",
            unstructuredFiles: "Object Storage",
            cloudStorage: "AWS, Azure, GCP",
            saasApps: "SaaS Connectors",
            masking: "Not Available",
            quarantine: "Data Tagging",
            aclChanges: "Recommendations",
            policyEngine: "Risk-Based Policies",
        },
    },
    {
        id: "nightfall",
        name: "Nightfall",
        type: "commercial",
        tagline: "Cloud DLP Platform",
        domain: "nightfall.ai",
        features: {
            hosting: "SaaS",
            agentType: "API-Based",
            primaryRole: "DLP + Discovery",
            regex: "Custom Detectors",
            mlNlp: "ML-Based Detection",
            ocr: "Image Scanning",
            contextAwareness: "Limited",
            identityLinking: "Not Available",
            structuredDbs: "SaaS Databases",
            unstructuredFiles: "Cloud Files Only",
            cloudStorage: "S3, Box, Dropbox",
            saasApps: "Slack, GitHub, Jira",
            masking: "Real-Time Redaction",
            quarantine: "Alerting Only",
            aclChanges: "Not Available",
            policyEngine: "Webhook-Based",
        },
    },
    {
        id: "varonis",
        name: "Varonis",
        type: "commercial",
        tagline: "Data Security Platform",
        domain: "varonis.com",
        features: {
            hosting: "On-Premise + SaaS",
            agentType: "Agent-Based",
            primaryRole: "Access Governance",
            regex: "Pattern Matching",
            mlNlp: "Behavioral Analytics",
            ocr: "Not Available",
            contextAwareness: "Activity-Based",
            identityLinking: "Identity Analytics",
            structuredDbs: "Windows/Linux Focus",
            unstructuredFiles: "File Server Scanning",
            cloudStorage: "Box, OneDrive",
            saasApps: "Limited",
            masking: "Not Available",
            quarantine: "Access Revocation",
            aclChanges: "Automated Remediation",
            policyEngine: "Least Privilege Model",
        },
    },
    {
        id: "dataguise",
        name: "Dataguise",
        type: "commercial",
        tagline: "Data Security & Compliance",
        domain: "dataguise.com",
        features: {
            hosting: "On-Premise",
            agentType: "Agent-Based",
            primaryRole: "Discovery + Masking",
            regex: "Pattern Library",
            mlNlp: "Dictionary-Based",
            ocr: "Not Available",
            contextAwareness: "Column-Level",
            identityLinking: "Not Available",
            structuredDbs: "Database-Centric",
            unstructuredFiles: "Hadoop/HDFS",
            cloudStorage: "Roadmap Only",
            saasApps: "Not Available",
            masking: "Database Masking",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "SQL-Based Policies",
        },
    },
    {
        id: "symantec",
        name: "Symantec DLP",
        type: "commercial",
        tagline: "Enterprise Data Loss Prevention",
        domain: "broadcom.com",
        features: {
            hosting: "On-Premise + Cloud",
            agentType: "Endpoint Agents",
            primaryRole: "DLP",
            regex: "Regex + Fingerprinting",
            mlNlp: "Basic NLP",
            ocr: "Document Scanning",
            contextAwareness: "Content-Aware",
            identityLinking: "Directory Integration",
            structuredDbs: "Database Monitoring",
            unstructuredFiles: "Network Scanning",
            cloudStorage: "Cloud Access Control",
            saasApps: "Email/Web Gateway",
            masking: "Encryption",
            quarantine: "Endpoint Quarantine",
            aclChanges: "Blocking Only",
            policyEngine: "Enterprise Policies",
        },
    },
    {
        id: "privateai",
        name: "Private AI",
        type: "commercial",
        tagline: "Privacy-Preserving NLP",
        domain: "private-ai.com",
        features: {
            hosting: "On-Premise + API",
            agentType: "API Service",
            primaryRole: "PII Redaction",
            regex: "Regex Support",
            mlNlp: "Transformer Models",
            ocr: "Document OCR",
            contextAwareness: "Contextual NER",
            identityLinking: "Cross-Document",
            structuredDbs: "API Integration",
            unstructuredFiles: "Document Processing",
            cloudStorage: "Via API",
            saasApps: "Via API",
            masking: "Anonymization",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Redaction Policies",
        },
    },

    // OPEN SOURCE PLATFORMS
    {
        id: "presidio",
        name: "Presidio",
        type: "open-source",
        tagline: "Microsoft Open Source PII Detection",
        domain: "microsoft.com",
        features: {
            hosting: "Self-Hosted",
            agentType: "Library/API",
            primaryRole: "Detection",
            regex: "Custom Patterns",
            mlNlp: "spaCy NER Models",
            ocr: "Not Available",
            contextAwareness: "Limited",
            identityLinking: "Not Available",
            structuredDbs: "Custom Integration",
            unstructuredFiles: "Text Processing",
            cloudStorage: "Custom Integration",
            saasApps: "Not Available",
            masking: "Anonymization Functions",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Config-Based",
        },
    },
    {
        id: "piicatcher",
        name: "PiiCatcher",
        type: "open-source",
        tagline: "Database PII Scanner",
        domain: "github.com",
        features: {
            hosting: "Self-Hosted",
            agentType: "CLI Tool",
            primaryRole: "Database Discovery",
            regex: "Pattern Matching",
            mlNlp: "Not Available",
            ocr: "Not Available",
            contextAwareness: "Column Name Analysis",
            identityLinking: "Not Available",
            structuredDbs: "MySQL, Postgres, Redshift",
            unstructuredFiles: "Not Available",
            cloudStorage: "S3 Metadata",
            saasApps: "Not Available",
            masking: "Not Available",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Not Available",
        },
    },
    {
        id: "octopii",
        name: "Octopii",
        type: "open-source",
        tagline: "Personal Data Discovery",
        domain: "github.com",
        features: {
            hosting: "Self-Hosted",
            agentType: "Scanning Tool",
            primaryRole: "Discovery",
            regex: "Regex Library",
            mlNlp: "Not Available",
            ocr: "Not Available",
            contextAwareness: "Not Available",
            identityLinking: "Not Available",
            structuredDbs: "Manual Query",
            unstructuredFiles: "File Scanning",
            cloudStorage: "Not Available",
            saasApps: "Not Available",
            masking: "Not Available",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Not Available",
        },
    },
    {
        id: "hawkeye",
        name: "HawkEye",
        type: "open-source",
        tagline: "Entropy-Based Scanner",
        domain: "github.com",
        features: {
            hosting: "Self-Hosted",
            agentType: "Git Scanner",
            primaryRole: "Secret Detection",
            regex: "Entropy Analysis",
            mlNlp: "Not Available",
            ocr: "Not Available",
            contextAwareness: "Not Available",
            identityLinking: "Not Available",
            structuredDbs: "Not Available",
            unstructuredFiles: "Git Repositories",
            cloudStorage: "Not Available",
            saasApps: "Not Available",
            masking: "Not Available",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Not Available",
        },
    },
    {
        id: "datafog",
        name: "DataFog",
        type: "open-source",
        tagline: "Lightweight PII Detection",
        domain: "github.com",
        features: {
            hosting: "Self-Hosted",
            agentType: "Python Library",
            primaryRole: "Text Analysis",
            regex: "Custom Regex",
            mlNlp: "Transformer Support",
            ocr: "Not Available",
            contextAwareness: "Token-Based",
            identityLinking: "Not Available",
            structuredDbs: "Pandas Integration",
            unstructuredFiles: "Text Files",
            cloudStorage: "Not Available",
            saasApps: "Not Available",
            masking: "Text Replacement",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Not Available",
        },
    },
    {
        id: "piiranha",
        name: "Piiranha",
        type: "open-source",
        tagline: "Fast PII Scanner",
        domain: "github.com",
        features: {
            hosting: "Self-Hosted",
            agentType: "CLI Scanner",
            primaryRole: "File Scanning",
            regex: "Pattern Library",
            mlNlp: "Not Available",
            ocr: "Not Available",
            contextAwareness: "Not Available",
            identityLinking: "Not Available",
            structuredDbs: "CSV/JSON Files",
            unstructuredFiles: "Local Files",
            cloudStorage: "Not Available",
            saasApps: "Not Available",
            masking: "Not Available",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Not Available",
        },
    },
    {
        id: "ranger",
        name: "Apache Ranger",
        type: "open-source",
        tagline: "Hadoop Security Framework",
        domain: "apache.org",
        features: {
            hosting: "Self-Hosted",
            agentType: "Framework",
            primaryRole: "Access Control",
            regex: "Tag-Based",
            mlNlp: "Not Available",
            ocr: "Not Available",
            contextAwareness: "Metadata Tags",
            identityLinking: "Not Available",
            structuredDbs: "Hadoop Ecosystem",
            unstructuredFiles: "HDFS",
            cloudStorage: "Not Available",
            saasApps: "Not Available",
            masking: "Row-Level Masking",
            quarantine: "Not Available",
            aclChanges: "Policy-Based ACL",
            policyEngine: "Fine-Grained Policies",
        },
    },
    {
        id: "openmetadata",
        name: "OpenMetadata",
        type: "open-source",
        tagline: "Unified Metadata Platform",
        domain: "open-metadata.org",
        features: {
            hosting: "Self-Hosted",
            agentType: "Metadata Service",
            primaryRole: "Data Cataloging",
            regex: "Column Profiling",
            mlNlp: "Not Available",
            ocr: "Not Available",
            contextAwareness: "Schema Analysis",
            identityLinking: "Lineage Tracking",
            structuredDbs: "Multi-DB Support",
            unstructuredFiles: "File Metadata",
            cloudStorage: "S3, GCS Profiling",
            saasApps: "Via Connectors",
            masking: "PII Tagging",
            quarantine: "Not Available",
            aclChanges: "Not Available",
            policyEngine: "Classification Rules",
        },
    },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ComparisonMatrix() {
    const [visiblePlatformIds, setVisiblePlatformIds] = React.useState<string[]>(['segmento', 'bigid', 'onetrust'])
    const [showPlatformDropdown, setShowPlatformDropdown] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [expandedCategories, setExpandedCategories] = React.useState<Set<FeatureCategory>>(
        new Set(['deployment', 'detection', 'coverage', 'governance'])
    )

    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Computed values
    const visiblePlatforms = ALL_PLATFORMS.filter(p => visiblePlatformIds.includes(p.id))
    const availablePlatforms = ALL_PLATFORMS.filter(p =>
        !visiblePlatformIds.includes(p.id) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Group features by category
    const groupedFeatures = React.useMemo(() => {
        const groups: Record<FeatureCategory, Feature[]> = {
            deployment: [],
            detection: [],
            coverage: [],
            governance: [],
        }

        FEATURES.forEach(feature => {
            groups[feature.category].push(feature)
        })

        return groups
    }, [])

    // Handlers
    const addPlatform = (platformId: string) => {
        if (!visiblePlatformIds.includes(platformId) && visiblePlatformIds.length < 6) {
            setVisiblePlatformIds([...visiblePlatformIds, platformId])
            setSearchQuery("")
            setShowPlatformDropdown(false)
        }
    }

    const removePlatform = (platformId: string) => {
        const platform = ALL_PLATFORMS.find(p => p.id === platformId)
        if (platform?.isPinned) return
        setVisiblePlatformIds(visiblePlatformIds.filter(id => id !== platformId))
    }

    const toggleCategory = (category: FeatureCategory) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(category)) {
            newExpanded.delete(category)
        } else {
            newExpanded.add(category)
        }
        setExpandedCategories(newExpanded)
    }

    // Click outside handler
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowPlatformDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* CONTROL BAR */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Left Section: Search & Add Platform */}
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative" ref={dropdownRef}>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search & Add Platform..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setShowPlatformDropdown(true)
                                    }}
                                    onFocus={() => setShowPlatformDropdown(true)}
                                    className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    disabled={visiblePlatformIds.length >= 6}
                                />
                            </div>

                            {/* Platform Dropdown */}
                            {showPlatformDropdown && availablePlatforms.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                                    {availablePlatforms.map(platform => {
                                        const isAlreadyAdded = visiblePlatformIds.includes(platform.id)

                                        return (
                                            <button
                                                key={platform.id}
                                                onClick={() => addPlatform(platform.id)}
                                                disabled={isAlreadyAdded}
                                                className={cn(
                                                    "w-full px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0",
                                                    isAlreadyAdded
                                                        ? "bg-gray-50 opacity-50 cursor-not-allowed"
                                                        : "hover:bg-primary-50 cursor-pointer"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Platform Logo in Dropdown */}
                                                    {(platform.logoUrl || platform.domain) && (
                                                        <img
                                                            src={platform.logoUrl || `https://www.google.com/s2/favicons?domain=${platform.domain}&sz=128`}
                                                            alt={`${platform.name} logo`}
                                                            className="w-8 h-8 rounded object-contain bg-white flex-shrink-0 mt-0.5"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-sm text-gray-900">
                                                            {platform.name}
                                                            {isAlreadyAdded && (
                                                                <span className="ml-2 text-xs text-gray-500">(Added)</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">{platform.tagline}</div>
                                                        <span className={cn(
                                                            "inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium",
                                                            platform.type === "commercial"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-green-100 text-green-700"
                                                        )}>
                                                            {platform.type === "commercial" ? "Commercial" : "Open Source"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Stats */}
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-lg border border-primary-200">
                            <span className="font-semibold text-primary-900">
                                {visiblePlatforms.length}
                            </span>
                            <span className="text-primary-700">
                                platform{visiblePlatforms.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">
                            {availablePlatforms.length} more available
                        </span>
                    </div>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    {/* STICKY HEADER ROW (Platform Names) */}
                    <thead className="sticky top-0 z-30 bg-white shadow-sm">
                        <tr>
                            {/* Sticky Corner Cell (Feature Label) */}
                            <th className="sticky left-0 z-40 bg-gradient-to-br from-gray-100 to-gray-50 border-b-2 border-r-2 border-gray-300 px-4 py-4 text-left font-bold text-gray-900 min-w-[240px]">
                                <div className="flex items-center gap-2">
                                    <span>Feature / Platform</span>
                                    <Info className="w-4 h-4 text-gray-400" />
                                </div>
                            </th>

                            {/* Platform Header Cells (Dynamic Columns) */}
                            {visiblePlatforms.map((platform, idx) => (
                                <th
                                    key={platform.id}
                                    className={cn(
                                        "border-b-2 border-gray-300 px-4 py-3 text-center min-w-[180px] max-w-[220px] relative",
                                        idx < visiblePlatforms.length - 1 && "border-r border-gray-100",
                                        platform.isHero
                                            ? "bg-gradient-to-br from-primary-100 to-primary-50 border-b-primary-500"
                                            : "bg-gray-50"
                                    )}
                                >
                                    <div className="space-y-1.5">
                                        {/* Logo + Platform Name */}
                                        <div className="flex items-center justify-center gap-2.5">
                                            {/* Platform Logo */}
                                            {(platform.logoUrl || platform.domain) && (
                                                <img
                                                    src={platform.logoUrl || `https://www.google.com/s2/favicons?domain=${platform.domain}&sz=128`}
                                                    alt={`${platform.name} logo`}
                                                    className="w-6 h-6 rounded object-contain bg-white p-0.5"
                                                    onError={(e) => {
                                                        // Fallback to a default icon if logo fails to load
                                                        e.currentTarget.style.display = 'none'
                                                    }}
                                                />
                                            )}

                                            <span className="font-bold text-sm leading-tight">
                                                {platform.name}
                                            </span>

                                            {!platform.isPinned && (
                                                <button
                                                    onClick={() => removePlatform(platform.id)}
                                                    className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                                                    aria-label={`Remove ${platform.name}`}
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Tagline */}
                                        <div className="text-xs text-gray-500 font-normal leading-tight px-2">
                                            {platform.tagline}
                                        </div>

                                        {/* Badges */}
                                        <div className="flex items-center justify-center gap-1.5">
                                            <span className={cn(
                                                "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                                                platform.type === "commercial"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                            )}>
                                                {platform.type === "commercial" ? "Commercial" : "Open Source"}
                                            </span>
                                            {platform.isHero && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-600 text-white">
                                                    Your Selection
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </th>
                            ))}

                            {/* Add Platform Button Column */}
                            <th className="border-b-2 border-gray-300 bg-gradient-to-br from-primary-50 to-white px-4 py-3 min-w-[180px]">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <button
                                        onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm w-full"
                                        disabled={visiblePlatformIds.length >= 6}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Platform
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        {availablePlatforms.length} available
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* BODY: Feature Rows (Grouped by Category) */}
                    <tbody>
                        {Object.entries(groupedFeatures).map(([categoryKey, features]) => {
                            const category = categoryKey as FeatureCategory
                            const categoryConfig = FEATURE_CATEGORIES[category]
                            const isExpanded = expandedCategories.has(category)

                            return (
                                <React.Fragment key={category}>
                                    {/* Category Header Row */}
                                    <tr className={cn("cursor-pointer hover:bg-gray-100 transition-colors", categoryConfig.color)}>
                                        <td
                                            colSpan={visiblePlatforms.length + 1}
                                            className="sticky left-0 z-20 px-4 py-3 font-bold text-sm"
                                            onClick={() => toggleCategory(category)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={isExpanded ? "rotate-90" : ""}>▶</span>
                                                {categoryConfig.label}
                                                <span className="text-xs font-normal opacity-75">
                                                    ({features.length} features)
                                                </span>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Feature Rows (if expanded) */}
                                    {isExpanded && features.map((feature, featureIdx) => (
                                        <tr
                                            key={feature.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Sticky Feature Name Cell (Left Column) */}
                                            <td className="sticky left-0 z-20 bg-white border-b border-r-2 border-gray-200 px-4 py-2.5 font-medium text-sm text-gray-900">
                                                {feature.label}
                                            </td>

                                            {/* Platform Values (Dynamic Columns) */}
                                            {visiblePlatforms.map((platform, platformIdx) => {
                                                const value = platform.features[feature.id] || "Not Available"
                                                const isNotAvailable = value === "Not Available" || value === "Roadmap Only"

                                                return (
                                                    <td
                                                        key={platform.id}
                                                        className={cn(
                                                            "border-b border-gray-100 px-4 py-2.5 text-center text-sm leading-tight",
                                                            platformIdx < visiblePlatforms.length - 1 && "border-r border-gray-100",
                                                            platform.isHero && "bg-primary-50/10",
                                                            isNotAvailable && "text-gray-400 italic"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "inline-block",
                                                            !isNotAvailable && "font-medium text-gray-900"
                                                        )}>
                                                            {value}
                                                        </span>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-primary-500 rounded"></div>
                        <span>Your Selection (Segmento Sense)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium">Commercial</span>
                        <span>Commercial Platform</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-green-100 text-green-800 font-medium">Open Source</span>
                        <span>Open Source Platform</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="italic text-gray-400">Not Available</span>
                        <span>Feature not supported</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
