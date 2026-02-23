import "./globals.css";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <main className="grow">{children}</main>
            </body>
        </html>
    );
}
