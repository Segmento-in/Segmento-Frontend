import { FeatureCard } from "@/app/(main)/components/features/FeatureCard"

const features = [
    {
        iconName: "BarChart3" as const,
        title: "Real-time Analytics",
        description: "Process 1M+ data points per second with sub-100ms latency",
        stat: "99.99% Uptime",
    },
    {
        iconName: "Brain" as const,
        title: "AI Predictions",
        description: "Machine learning models predict customer churn & revenue trends",
        stat: "95% Accuracy",
    },
    {
        iconName: "RefreshCcw" as const,
        title: "Auto-scaling",
        description: "Handle traffic spikes from 1K to 1M users automatically",
        stat: "Zero Downtime",
    },
    {
        iconName: "LayoutDashboard" as const,
        title: "Data Visualization",
        description: "Interactive dashboards with drag & drop metrics builder",
        stat: "50+ Widgets",
    },
    {
        iconName: "Lock" as const,
        title: "Enterprise Security",
        description: "SOC2, GDPR compliant with end-to-end encryption",
        stat: "Zero Breaches",
    },
    {
        iconName: "Globe" as const,
        title: "Global CDN",
        description: "Edge computing across 200+ data centers worldwide",
        stat: "<50ms Latency",
    },
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Advanced Features
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Powerful tools built for modern data enterprises
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </div>
    )
}
