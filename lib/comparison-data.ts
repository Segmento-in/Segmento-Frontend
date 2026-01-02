/**
 * Competitive Comparison Data
 * Based on proprietary market research document
 * Research Source: "Data classification Research and improvements"
 */

export type ComparisonCategory = "Architecture" | "Performance" | "Cost";

export interface ComparisonRow {
    category: ComparisonCategory;
    label: string;
    insight?: string; // Tooltip content explaining the significance
    segmentoValue: string;
    competitorValues: Record<string, string>;
}

export interface Competitor {
    id: string;
    name: string;
    tagline: string;
    category: "enterprise" | "cloud" | "local";
}

// Available competitors for selection
export const COMPETITORS: Competitor[] = [
    {
        id: "spirion",
        name: "Spirion",
        tagline: "Agent-based Enterprise Software",
        category: "enterprise",
    },
    {
        id: "bigid",
        name: "BigID",
        tagline: "Enterprise Platform with Heavy Infrastructure",
        category: "enterprise",
    },
    {
        id: "aws-macie",
        name: "AWS Macie",
        tagline: "Cloud-Native AWS-Only Solution",
        category: "cloud",
    },
    {
        id: "varonis",
        name: "Varonis",
        tagline: "Black Box Enterprise Platform",
        category: "enterprise",
    },
    {
        id: "symantec",
        name: "Symantec (Broadcom)",
        tagline: "Agent-based Enterprise Suite",
        category: "enterprise",
    },
    {
        id: "trellix",
        name: "Trellix (McAfee)",
        tagline: "Agent-based Security Suite",
        category: "enterprise",
    },
    {
        id: "netwrix",
        name: "Netwrix",
        tagline: "Server-based File & Cloud Scanner",
        category: "enterprise",
    },
    {
        id: "cyera",
        name: "Cyera",
        tagline: "Cloud-Native DSPM Platform",
        category: "cloud",
    },
    {
        id: "nightfall",
        name: "Nightfall",
        tagline: "SaaS & Cloud API-based Detection",
        category: "cloud",
    },
    {
        id: "strac",
        name: "Strac",
        tagline: "SaaS PII Detection & Redaction",
        category: "cloud",
    },
    {
        id: "dataguise",
        name: "Dataguise (Thales)",
        tagline: "Enterprise Platform for DBs & Cloud",
        category: "enterprise",
    },
    {
        id: "private-ai",
        name: "Private AI",
        tagline: "Containerized AI-first Detection",
        category: "local",
    },
];

/**
 * Research-Driven Comparison Criteria
 * Data extracted from market analysis of PII detection tools
 */
export const COMPARISON_DATA: ComparisonRow[] = [
    // ========== ARCHITECTURE CATEGORY ==========
    {
        category: "Architecture",
        label: "Discovery Methodology",
        insight:
            "Agent-based systems require installing software on every endpoint, consuming CPU resources and creating infrastructure friction. Agentless approaches scan via APIs without local installations.",
        segmentoValue: "Agentless API Scanning",
        competitorValues: {
            spirion: "Agent & Agentless Hybrid",
            bigid: "Enterprise Scanner + Agents",
            "aws-macie": "Cloud-Native Scanner (AWS Only)",
            varonis: "Agent-based File System Monitors",
            symantec: "Agent-based (Endpoint) + Network",
            trellix: "Agent-based + Network",
            netwrix: "Agentless (Network/API)",
            cyera: "Agentless (API-based)",
            nightfall: "Agentless (API-based)",
            strac: "Agentless (API-based)",
            dataguise: "Mostly Agentless (Scanner)",
            "private-ai": "Agentless (Containerized)",
        },
    },
    {
        category: "Architecture",
        label: "Unstructured Data Intelligence",
        insight:
            "Modern transformer models (like DeBERTa) understand semantic context and relationships. Traditional regex/rules miss nuanced PII in unstructured text. Explainable AI (XAI) shows WHY something was flagged.",
        segmentoValue: "DeBERTa-v3 AI Engine + XAI (Explainable AI)",
        competitorValues: {
            spirion: "Regex + AI-driven (AnyFind)",
            bigid: "ML Classification (Black Box)",
            "aws-macie": "Managed ML (Black Box)",
            varonis: "Pattern Matching + Heuristics",
            symantec: "Regex + VML (Vectorization)",
            trellix: "Regex + Heuristics",
            netwrix: "Regex + Statistical",
            cyera: "Generative AI (AI-first)",
            nightfall: "Deep Learning",
            strac: "Regex + ML",
            dataguise: "Regex + ML",
            "private-ai": "Pure Transformer Models (AI-only)",
        },
    },
    {
        category: "Architecture",
        label: "Infrastructure Impact",
        insight:
            "Air-gapped deployments run 100% offline for maximum security. Docker containers are lightweight and portable. Enterprise servers require dedicated hardware and complex networking.",
        segmentoValue: "Private Docker Container (Air-Gapped Capable)",
        competitorValues: {
            spirion: "Enterprise Software Install",
            bigid: "Enterprise Server + Database",
            "aws-macie": "AWS-Only (Cloud Lock-in)",
            varonis: "Enterprise Server Infrastructure",
            symantec: "Enterprise Suite (Heavy)",
            trellix: "Enterprise Suite",
            netwrix: "Server-based (On-prem focus)",
            cyera: "Cloud-Native (SaaS)",
            nightfall: "Cloud-Native (SaaS)",
            strac: "Cloud-Native (SaaS)",
            dataguise: "Enterprise Platform",
            "private-ai": "Docker Container (Private VPC)",
        },
    },
    {
        category: "Architecture",
        label: "Deployment Flexibility",
        insight:
            "Multi-cloud and on-premises support avoids vendor lock-in. Cloud-only solutions restrict where you can process sensitive data.",
        segmentoValue: "Multi-Cloud + On-Premises",
        competitorValues: {
            spirion: "Hybrid (On-prem + Cloud)",
            bigid: "Multi-Cloud + On-Premises",
            "aws-macie": "AWS Only (Severe Lock-in)",
            varonis: "Hybrid",
            symantec: "Hybrid",
            trellix: "Hybrid",
            netwrix: "Hybrid (On-prem focus)",
            cyera: "Cloud-Native Only",
            nightfall: "Cloud-Native Only",
            strac: "Cloud-Native Only",
            dataguise: "Hybrid",
            "private-ai": "On-Prem / VPC (Private)",
        },
    },

    // ========== PERFORMANCE CATEGORY ==========
    {
        category: "Performance",
        label: "False Positive Rate",
        insight:
            "Consensus Engines use multiple AI models voting together (ensemble learning) to reduce false alarms. Rule-based systems generate high noise, requiring manual review. XAI helps quickly verify true positives.",
        segmentoValue: "Low (<1%) via Consensus Engine + XAI",
        competitorValues: {
            spirion: "Moderate-High (AI-driven reduces some)",
            bigid: "Moderate (~5-10%) - Black Box ML",
            "aws-macie": "Moderate (~5-10%) - Managed ML",
            varonis: "High - Pattern Matching",
            symantec: "Moderate (VML helps)",
            trellix: "Moderate-High",
            netwrix: "Moderate (Statistical scoring)",
            cyera: "Low (AI + Identity Graph)",
            nightfall: "Low (Deep Learning)",
            strac: "Low-Moderate",
            dataguise: "Moderate",
            "private-ai": "Low (Pure AI)",
        },
    },
    {
        category: "Performance",
        label: "Setup Velocity",
        insight:
            "Enterprise platforms require weeks/months for connectors, integrations, and training. Simple Docker deployments are operational in minutes.",
        segmentoValue: "Minutes (<15 min Docker Deploy)",
        competitorValues: {
            spirion: "Weeks (Agent Rollout)",
            bigid: "Months (Platform Integration)",
            "aws-macie": "Instant (AWS Only)",
            varonis: "Weeks",
            symantec: "Weeks-Months (Enterprise Suite)",
            trellix: "Weeks (Enterprise)",
            netwrix: "Days-Weeks",
            cyera: "Days (Cloud API)",
            nightfall: "Hours-Days (SaaS)",
            strac: "Hours-Days (SaaS)",
            dataguise: "Weeks-Months",
            "private-ai": "Minutes (Docker)",
        },
    },
    {
        category: "Performance",
        label: "Transparency & Explainability",
        insight:
            "Explainable AI shows the exact reasoning behind each detection (e.g., 'Detected due to NLTK PERSON entity'). Black box systems give no visibility into why something was flagged.",
        segmentoValue: "Full XAI - Shows Detection Logic",
        competitorValues: {
            spirion: "Partial (AnyFind Match Shown)",
            bigid: "None - Black Box",
            "aws-macie": "None - Black Box",
            varonis: "Minimal",
            symantec: "Partial (Match Highlighting)",
            trellix: "Partial (Evidence File)",
            netwrix: "Partial (Keywords Shown)",
            cyera: "Good (Semantic Context)",
            nightfall: "Partial (Snippet Masked)",
            strac: "Partial (Redacted View)",
            dataguise: "Partial (Tag Info)",
            "private-ai": "Full (Entity Types)",
        },
    },
    {
        category: "Performance",
        label: "Detection Coverage",
        insight:
            "Comprehensive coverage includes structured (databases) and unstructured (documents, emails) data. Limited coverage misses critical PII sources.",
        segmentoValue: "Structured + Unstructured (Full Coverage)",
        competitorValues: {
            spirion: "Structured + Unstructured",
            bigid: "Structured + Unstructured + Cloud Storage",
            "aws-macie": "S3 Only (Limited Scope)",
            varonis: "File Systems + Structured Data",
        },
    },

    // ========== COST CATEGORY ==========
    {
        category: "Cost",
        label: "Pricing Model",
        insight:
            "Per-GB and per-endpoint pricing creates unpredictable 'cloud tax' as data grows. Flat licensing offers budget certainty and cost control.",
        segmentoValue: "Flat License (Predictable)",
        competitorValues: {
            spirion: "Per-Endpoint (Scales with Devices)",
            bigid: "Platform Fee + Connector Fees",
            "aws-macie": "Per-GB (Expensive at Scale)",
            varonis: "Per-Server/User Licensing",
        },
    },
    {
        category: "Cost",
        label: "Hidden Costs",
        insight:
            "Enterprise platforms often charge extra for connectors, support tiers, and professional services. Open architecture avoids lock-in fees.",
        segmentoValue: "None - All-Inclusive",
        competitorValues: {
            spirion: "Support Tiers + Professional Services",
            bigid: "Connector Fees + Premium Support",
            "aws-macie": "Data Transfer Fees + S3 Costs",
            varonis: "Professional Services Required",
        },
    },
    {
        category: "Cost",
        label: "Total Cost of Ownership (3-Year)",
        insight:
            "TCO includes software licenses, infrastructure, professional services, and ongoing support. Hidden costs compound over time in enterprise platforms.",
        segmentoValue: "$50K - $150K (All-Inclusive)",
        competitorValues: {
            spirion: "$200K - $500K (+ Services)",
            bigid: "$500K - $2M (Platform + Connectors)",
            "aws-macie": "$100K - $1M (Data-Dependent)",
            varonis: "$300K - $800K (+ Infrastructure)",
        },
    },
];

/**
 * Get comparison data for specific competitors
 */
export function getComparisonForCompetitors(
    competitorIds: string[]
): ComparisonRow[] {
    return COMPARISON_DATA.map((row) => ({
        ...row,
        competitorValues: Object.fromEntries(
            Object.entries(row.competitorValues).filter(([key]) =>
                competitorIds.includes(key)
            )
        ),
    }));
}

/**
 * Get competitor details by ID
 */
export function getCompetitorById(id: string): Competitor | undefined {
    return COMPETITORS.find((c) => c.id === id);
}
