import Image from "next/image"

export function TrustBar() {
    return (
        <section className="py-12 border-y bg-background">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground mb-8">
                    Trusted by enterprises worldwide
                </p>
                <div className="flex justify-center items-center">
                    <Image
                        src="/logos/partners.png"
                        alt="Partner companies"
                        width={1200}
                        height={100}
                        className="w-full max-w-5xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    />
                </div>
            </div>
        </section>
    )
}
