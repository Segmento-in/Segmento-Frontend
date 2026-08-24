"use client";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { HeroSection } from "./HeroSection";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("framer-motion", async () => {
    const actual = (await vi.importActual("framer-motion")) as any;
    return {
        ...actual,
        motion: {
            div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

// recharts renders SVG — stub it to avoid jsdom SVG errors
vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    PieChart: ({ children }: any) => <div>{children}</div>,
    Pie: () => <div />,
    Cell: () => <div />,
    Sector: () => <div />,
}));

vi.mock("@/ui/button", () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// ── T2: Hero top padding clears the fixed navbar ───────────────────────────

describe("HeroSection — navbar offset", () => {
    it("root section has mobile top-padding class that clears the 64px fixed navbar", () => {
        const { container } = render(<HeroSection />);
        const section = container.querySelector("section");

        // RED: fails — current section only has py-24 (96px), no explicit mobile offset class
        // After fix: section must carry pt-20 (80px) as a mobile-specific class
        expect(section?.className).toContain("pt-20");
    });

    it("root section uses min-h-[100dvh] instead of min-h-screen (iOS Safari fix)", () => {
        const { container } = render(<HeroSection />);
        const section = container.querySelector("section");

        // RED: fails — current class is min-h-screen
        expect(section?.className).toContain("min-h-[100dvh]");
        expect(section?.className).not.toContain("min-h-screen");
    });
});
