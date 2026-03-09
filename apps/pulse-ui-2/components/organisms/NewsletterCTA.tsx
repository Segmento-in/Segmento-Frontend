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
import { PrimaryActionButton } from "@/components/atoms/PrimaryActionButton";

export function NewsletterCTA() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError("");

        try {
            const API_BASE = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE}/api/subscription/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    name: 'Pulse Frontend',
                    topics: ['news', 'ai', 'cloud', 'data']
                })
            });

            const data = await response.json();

            if (response.ok && data.success !== false) {
                setSubmitted(true);
            } else {
                setError(data.message || "Failed to subscribe. Please try again.");
            }
        } catch (err) {
            setError("Network error. Check your connection.");
        } finally {
            setLoading(false);
        }
    }

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
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--pulse-color-text-muted)" }}>Newsletter · 3× Daily</span>
                        </div>

                        <h2 style={{
                            color: "var(--pulse-color-text-inverse)",
                            fontSize: "32px", fontWeight: 800,
                            letterSpacing: "-0.02em", lineHeight: "1.2",
                            marginBottom: "12px",
                        }}>
                            Get the weekly Pulse digest delivered straight to your inbox.
                        </h2>

                        <p style={{ color: "var(--pulse-color-text-muted)", fontSize: "15px", marginBottom: "32px", lineHeight: "1.6" }}>
                            Curated AI, Cloud, and Data intelligence from Segmento Pulse.
                        </p>

                        {submitted ? (
                            <div style={{
                                padding: "16px 24px",
                                background: "rgba(16,185,129,0.15)",
                                borderRadius: "var(--pulse-radius-card)",
                                border: "1px solid rgba(16,185,129,0.3)",
                                color: "var(--pulse-color-accent-green)",
                                fontSize: "14px", fontWeight: 600,
                            }}>
                                ✓ You&apos;re on the list! Check your inbox for the next edition.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* PRD: "Inline flex combining text input + PrimaryActionButton" */}
                                <div style={{
                                    display: "flex",
                                    background: "#fff",
                                    borderRadius: "var(--pulse-radius-pill)",
                                    overflow: "hidden",
                                    maxWidth: "440px",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                                }}>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        style={{
                                            flex: 1, padding: "14px 20px",
                                            border: "none", outline: "none",
                                            fontSize: "14px", color: "#111827",
                                            background: "transparent", minWidth: 0,
                                        }}
                                        aria-label="Email address for newsletter"
                                    />
                                    <PrimaryActionButton
                                        type="submit"
                                        style={{ borderRadius: "var(--pulse-radius-pill)", margin: "4px 4px 4px 0", flexShrink: 0, opacity: loading ? 0.7 : 1 }}
                                        size="md"
                                        disabled={loading}
                                    >
                                        {loading ? "Submitting..." : "Subscribe"}
                                    </PrimaryActionButton>
                                </div>
                                {error && (
                                    <p style={{ fontSize: "13px", color: "var(--pulse-color-accent-red)", marginTop: "8px", fontWeight: 500 }}>
                                        {error}
                                    </p>
                                )}
                                <p style={{ fontSize: "12px", color: "var(--pulse-color-text-muted)", marginTop: "12px" }}>
                                    No spam, ever. Unsubscribe in one click.
                                </p>
                            </form>
                        )}
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
        </section>
    );
}
