import { MediaCard } from "@/app/(main)/components/media/MediaCard"

const mediaItems = [
    {
        iconName: "Newspaper" as const,
        publication: "TechCrunch",
        headline: "Segmento revolutionizes enterprise data processing with sub-second analytics",
        link: "#",
    },
    {
        iconName: "Tv" as const,
        publication: "Forbes",
        headline: "How Segmento's AI platform handles 1M+ data points per second",
        link: "#",
    },
    {
        iconName: "Video" as const,
        publication: "CNBC",
        headline: "Data startup Segmento raises $15M for real-time analytics expansion",
        link: "#",
    },
    {
        iconName: "Smartphone" as const,
        publication: "VentureBeat",
        headline: "Segmento's big data platform powers Fortune 500 real-time decisions",
        link: "#",
    },
    {
        iconName: "Laptop" as const,
        publication: "ZDNet",
        headline: "Why enterprises choose Segmento for scalable data infrastructure",
        link: "#",
    },
    {
        iconName: "Flame" as const,
        publication: "ProductHunt",
        headline: "#1 Product of the Day: Segmento's AI Data Platform launches",
        link: "#",
    },
]

export default function MediaPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Media Coverage
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Featured in top publications and industry leaders
                    </p>
                </div>

                {/* Media Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {mediaItems.map((item) => (
                        <MediaCard key={item.publication} {...item} />
                    ))}
                </div>
            </div>
        </div>
    )
}
