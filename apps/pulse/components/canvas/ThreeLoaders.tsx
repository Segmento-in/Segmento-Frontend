/**
 * ThreeLoaders.tsx — "use client" dynamic loaders for Three.js scenes
 *
 * `next/dynamic` with `ssr:false` is ONLY permitted inside Client Components.
 * This file acts as the boundary: it is a client component that lazy-loads
 * the WebGL canvas components and exposes them as re-exports safe to use
 * from Server Components (page.tsx).
 *
 * Architecture:
 *   Server Component (page.tsx)
 *     └─ imports HeroSceneLoader, CardSceneLoader (client components)
 *           └─ each uses next/dynamic(ssr:false) to load the WebGL canvas
 */
"use client";

import dynamic from "next/dynamic";
import type { CardSceneVariant } from "@/components/canvas/CardScene";

// ── HeroScene dynamic loader ──────────────────────────────────

const HeroSceneDynamic = dynamic(
    () => import("@/components/canvas/HeroScene"),
    {
        ssr: false,
        loading: () => (
            <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(160deg,#dbeafe 0%,#ede9fe 50%,#e0f2fe 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    border: "3px solid #93c5fd", borderTopColor: "#3b82f6",
                    animation: "spin 0.8s linear infinite",
                }} />
            </div>
        ),
    }
);

export function HeroSceneLoader({ style }: { style?: React.CSSProperties }) {
    return <HeroSceneDynamic style={style} />;
}

// ── CardScene dynamic loader ──────────────────────────────────

const CardSceneDynamic = dynamic(
    () => import("@/components/canvas/CardScene"),
    {
        ssr: false,
        loading: () => (
            <div style={{
                width: "100%", height: "100%",
                background: "var(--pulse-color-bg-canvas)",
            }} />
        ),
    }
);

export function CardSceneLoader({
    variant,
    style,
}: {
    variant: CardSceneVariant;
    style?: React.CSSProperties;
}) {
    return <CardSceneDynamic variant={variant} style={style} />;
}
