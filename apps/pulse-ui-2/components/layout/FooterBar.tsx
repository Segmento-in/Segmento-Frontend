/**
 * FooterBar — Client Component
 * Requires "use client" for onMouseEnter/onMouseLeave on footer links.
 */
"use client";

const FOOTER_COLUMNS = [
    { heading: "Platform", links: ["Pulse Digest", "Segmento Sense", "Analytics", "Archive", "Authors"] },
    { heading: "Topics", links: ["Artificial Intelligence", "Cloud Infrastructure", "Data Engineering", "Developer Tools", "Cybersecurity"] },
    { heading: "Resources", links: ["API Reference", "Integration Guides", "Community Forum", "Submit Article", "Newsletter"] },
    { heading: "Company", links: ["About Segmento", "Careers", "Press Kit", "Contact Us", "Brand Assets"] },
    { heading: "Reach Us", links: ["Twitter", "LinkedIn", "GitHub", "YouTube", "Discord"] },
];

export function FooterBar() {
    return (
        <footer style={{
            background: "var(--pulse-color-bg-surface-dark)",
            paddingBlock: "64px 32px",
            color: "var(--pulse-color-text-muted)",
        }}>
            <div className="pulse-container">
                {/* Top grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "200px repeat(5, 1fr)",
                    gap: "40px",
                    marginBottom: "64px",
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--pulse-color-text-primary)", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                            Segmento Pulse
                        </div>
                        <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--pulse-color-text-muted)" }}>
                            Real-time enterprise tech news aggregator. AI, Cloud &amp; Data intelligence.
                        </p>
                        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                            {["Twitter", "GitHub", "LinkedIn"].map(s => (
                                <a key={s} href="#" style={{
                                    fontSize: "12px", fontWeight: 600, color: "var(--pulse-color-text-muted)",
                                    border: "1px solid var(--pulse-color-border-subtle)", borderRadius: "6px", padding: "6px 10px",
                                    textDecoration: "none", transition: "color 150ms, border-color 150ms",
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-primary)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-muted)"; }}>
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map(col => (
                        <div key={col.heading}>
                            <div style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--pulse-color-text-primary)", marginBottom: "16px" }}>
                                {col.heading}
                            </div>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                                {col.links.map(link => (
                                    <li key={link}>
                                        <a href="#" style={{ fontSize: "14px", color: "var(--pulse-color-text-muted)", textDecoration: "none", transition: "color 150ms" }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-primary)"}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-muted)"}>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    paddingTop: "24px",
                    borderTop: "1px solid var(--pulse-color-border-subtle)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: "12px",
                }}>
                    <span style={{ fontSize: "13px" }}>
                        © {new Date().getFullYear()} Segmento Pulse. All rights reserved.
                    </span>
                    <div style={{ display: "flex", gap: "24px" }}>
                        {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(link => (
                            <a key={link} href="#" style={{ fontSize: "13px", color: "var(--pulse-color-text-muted)", textDecoration: "none", transition: "color 150ms" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-primary)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--pulse-color-text-muted)"}>
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
