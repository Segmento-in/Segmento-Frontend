import { Button } from "@/ui/button"

export function CTASection() {
    return (
        <section className="py-20 bg-linear-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                        Get started in minutes.
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join thousands of teams protecting their data with Segmento Sense.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/products/data-classification/demo">
                            <Button size="lg" className="text-base px-8">
                                Try for free
                            </Button>
                        </a>
                        <a href="/contact">
                            <Button size="lg" variant="outline" className="text-base px-8">
                                Request a demo
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
