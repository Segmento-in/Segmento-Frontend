import React from "react";
import { NavBar } from "@/components/layout/NavBar";
import { RepoCard } from "@/components/views/RepoCard";
import { fetchTopRepos } from "@/lib/reposApi";

export const revalidate = 300; // Static ISR pattern

export default async function TopGitRepositoriesPage() {
    const repos = await fetchTopRepos();

    return (
        <>
            <NavBar />
            <main style={{ minHeight: "100vh", paddingBottom: "80px" }}>
                {/* ── HERO BANNER ── */}
                <section
                    style={{
                        background: "#F4EAFF",
                        padding: "64px 24px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: "48px", height: "48px", background: "rgba(255,255,255,0.4)",
                            borderRadius: "12px", display: "flex", alignItems: "center",
                            justifyContent: "center", marginBottom: "16px", color: "#111827",
                        }}
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <h1
                        style={{
                            fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 800, color: "#111827",
                            letterSpacing: "-0.03em", marginBottom: "16px",
                        }}
                    >
                        TOP REPOSITORIES
                    </h1>
                    <p
                        style={{
                            fontSize: "16px", color: "#4B5563", maxWidth: "500px", lineHeight: 1.6,
                        }}
                    >
                        The most starred open-source software repositories on GitHub.
                    </p>
                </section>

                {/* ── CONTENT CONTAINER ── */}
                <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
                    {repos.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 20px" }}>
                            <svg style={{ margin: "0 auto 16px", width: "48px", height: "48px", color: "#D1D5DB" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p style={{ color: "#6B7280", fontSize: "16px", fontWeight: 500 }}>No repositories found</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                            {repos.map((repo, idx) => (
                                <RepoCard key={repo.$id} repo={repo} idx={idx} variant="list" />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
