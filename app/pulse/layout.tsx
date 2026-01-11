import PulseNavbar from "@/components/pulse/Navbar";

export default function PulseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PulseNavbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    © 2026 SegmentoPulse
                </div>
            </footer>
        </div>
    );
}
