/**
 * NewsletterCTA — Client Component
 * Requires "use client" for the email input onChange and the
 * onMouseEnter/onMouseLeave decorative link effects.
 *
 * PRD §Phase 4.5:
 *   Container: dark #1A1A1A, 8px border-radius
 *   Layout: Flexbox — text+input left, geometric illustration right
 *   Input Group: inline flex (borderless input + PrimaryActionButton)
 */

"use client";

import { useState } from "react";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";
import NewsletterHub from "../NewsletterHub";

export function NewsletterCTA() {
    const [isNewsletterHubOpen, setIsNewsletterHubOpen] = useState(false);

    return (
        <section style={{
            paddingBlock: "72px",
            background: "var(--pulse-color-bg-surface-tint)",
        }}>
            <div className="pulse-container">
                <div style={{
                    background: "var(--pulse-color-bg-surface-dark)",
                    borderRadius: "var(--pulse-radius-card)",
                    padding: "56px 64px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "48px",
                    overflow: "hidden",
                    position: "relative",
                }}>
                    {/* Decorative background orbs */}
                    <div style={{ position: "absolute", top: "-60px", right: "320px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.3) 0%,transparent 70%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-80px", right: "180px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />

                    {/* Left — text + form */}
                    <div style={{ flex: 1, maxWidth: "520px", position: "relative" }}>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "9999px", padding: "4px 14px", marginBottom: "20px",
                        }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#9CA3AF" }}>Newsletter · 3× Daily</span>
                        </div>

                        <h2 style={{
                            color: "var(--pulse-color-text-inverse)",
                            fontSize: "32px", fontWeight: 800,
                            letterSpacing: "-0.02em", lineHeight: "1.2",
                            marginBottom: "12px",
                        }}>
                            Get the weekly Pulse digest delivered straight to your inbox.
                        </h2>

                        <p style={{ color: "#9CA3AF", fontSize: "15px", marginBottom: "32px", lineHeight: "1.6" }}>
                            Curated AI, Cloud, and Data intelligence from Segmento Pulse.
                        </p>

                        <div>
                            <PrimaryActionButton
                                onClick={() => setIsNewsletterHubOpen(true)}
                                style={{ borderRadius: "var(--pulse-radius-pill)", margin: "4px 4px 4px 0", flexShrink: 0, fontSize: "16px", padding: "16px 24px" }}
                                size="lg"
                            >
                                Choose Subscription Schedule
                            </PrimaryActionButton>
                            <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "16px" }}>
                                We offer Morning, Midday, Evening, Weekly, and Monthly options.
                            </p>
                        </div>
                    </div>

                    {/* Right — geometric illustration */}
                    <div style={{
                        flexShrink: 0, width: "280px", height: "220px",
                        position: "relative",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <div style={{ position: "absolute", width: "160px", height: "160px", border: "2px solid rgba(139,92,246,0.4)", borderRadius: "50%" }} />
                        <div style={{ position: "absolute", width: "100px", height: "100px", border: "2px solid rgba(59,130,246,0.3)", borderRadius: "12px", transform: "rotate(45deg)" }} />
                        <div style={{ position: "absolute", width: "60px", height: "60px", border: "2px solid rgba(16,185,129,0.4)", borderRadius: "50%", top: "30px", right: "60px" }} />
                        <div style={{
                            width: "56px", height: "56px",
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            backdropFilter: "blur(4px)",
                        }}>
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Newsletter Hub Overlay */}
            {isNewsletterHubOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsNewsletterHubOpen(false)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800"
                    >
                        <button
                            onClick={() => setIsNewsletterHubOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 z-10 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="pt-4">
                            <NewsletterHub />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
