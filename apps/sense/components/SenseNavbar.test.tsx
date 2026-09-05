"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { SenseNavbar } from "./SenseNavbar";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
    default: ({ children, href, ...props }: any) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock("framer-motion", async () => {
    const actual = (await vi.importActual("framer-motion")) as any;
    return {
        ...actual,
        motion: {
            div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
            button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
            span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

vi.mock("./ThemeToggle", () => ({
    default: () => <button>Theme</button>,
}));

// Default: unauthenticated
const mockUseAuth = vi.fn(() => ({ isLoggedIn: false, user: null }));
vi.mock("@/lib/authContext", () => ({
    useAuth: () => mockUseAuth(),
}));

// ── T1: Logo path ──────────────────────────────────────────────────────────────────

describe("SenseNavbar — logo", () => {
    it("renders logo with correct src (not the broken /sense/ prefix)", () => {
        render(<SenseNavbar />);
        const logo = screen.getByRole("img", { name: /logo/i });
        // The plain img tag uses the full basePath-aware path
        expect(logo).toHaveAttribute("src", "/sense/images/logo_transparent.png");
    });

    it("logo has no scale-150 distortion class", () => {
        render(<SenseNavbar />);
        const logo = screen.getByRole("img", { name: /logo/i });
        // RED: will fail — current className contains "scale-150"
        expect(logo.className).not.toContain("scale-150");
    });
});

// ── T3-A: Mobile drawer — unauthenticated ─────────────────────────────────

describe("SenseNavbar — mobile auth entry (unauthenticated)", () => {
    it("shows Sign In link pointing to /profile after hamburger click", () => {
        mockUseAuth.mockReturnValue({ isLoggedIn: false, user: null });
        render(<SenseNavbar />);

        const hamburger = screen.getByLabelText("Toggle mobile menu");
        fireEvent.click(hamburger);

        // RED: will fail — drawer has no auth entry yet
        const signInLink = screen.getByRole("link", { name: /sign in/i });
        expect(signInLink).toHaveAttribute("href", "/profile");
    });
});

// ── T3-B: Mobile drawer — authenticated ───────────────────────────────────

describe("SenseNavbar — mobile auth entry (authenticated)", () => {
    it("shows user first name with link to /profile after hamburger click", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { name: "Arjun Kumar" },
        } as any);
        render(<SenseNavbar />);

        const hamburger = screen.getByLabelText("Toggle mobile menu");
        fireEvent.click(hamburger);

        // RED: will fail — drawer has no auth entry yet
        const profileLink = screen.getByRole("link", { name: /arjun/i });
        expect(profileLink).toHaveAttribute("href", "/profile");
    });
});

// ── Surface 1: Connectors nav pill role gating ────────────────────────────

describe("SenseNavbar — Connectors nav pill gating", () => {
    it("hides Connectors nav link for support role in desktop and mobile menu", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: "usr-sup", email: "support@acme.com", name: "Support Tech", role: "support" },
        } as any);

        render(<SenseNavbar />);

        // Desktop and mobile Connectors links should not be present
        expect(screen.queryByRole("link", { name: /connectors/i })).not.toBeInTheDocument();

        // Open mobile drawer and check again
        const hamburger = screen.getByLabelText("Toggle mobile menu");
        fireEvent.click(hamburger);
        expect(screen.queryByRole("link", { name: /connectors/i })).not.toBeInTheDocument();
    });

    it("shows Connectors nav link for admin role", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: "usr-adm", email: "admin@acme.com", name: "Admin Boss", role: "admin" },
        } as any);

        render(<SenseNavbar />);
        expect(screen.getAllByRole("link", { name: /connectors/i }).length).toBeGreaterThanOrEqual(1);
    });

    it("shows Connectors nav link for null role (Individual account)", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: "usr-ind", email: "ind@personal.com", name: "Solo User", role: null },
        } as any);

        render(<SenseNavbar />);
        expect(screen.getAllByRole("link", { name: /connectors/i }).length).toBeGreaterThanOrEqual(1);
    });
});

// ── Surface 2: Model Lab / AI Engine nav entry role gating ────────────────

describe("SenseNavbar — Model Lab / AI Engine nav entry gating", () => {
    it("hides AI Engine nav link for support role in desktop and mobile menu", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: "usr-sup", email: "support@acme.com", name: "Support Tech", role: "support" },
        } as any);

        render(<SenseNavbar />);

        // Desktop and mobile AI Engine links should not be present
        expect(screen.queryByRole("link", { name: /ai engine/i })).not.toBeInTheDocument();

        // Open mobile drawer and check again
        const hamburger = screen.getByLabelText("Toggle mobile menu");
        fireEvent.click(hamburger);
        expect(screen.queryByRole("link", { name: /ai engine/i })).not.toBeInTheDocument();
    });

    it("shows AI Engine nav link for admin role", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: "usr-adm", email: "admin@acme.com", name: "Admin Boss", role: "admin" },
        } as any);

        render(<SenseNavbar />);
        expect(screen.getAllByRole("link", { name: /ai engine/i }).length).toBeGreaterThanOrEqual(1);
    });

    it("shows AI Engine nav link for null role (Individual account)", () => {
        mockUseAuth.mockReturnValue({
            isLoggedIn: true,
            user: { id: "usr-ind", email: "ind@personal.com", name: "Solo User", role: null },
        } as any);

        render(<SenseNavbar />);
        expect(screen.getAllByRole("link", { name: /ai engine/i }).length).toBeGreaterThanOrEqual(1);
    });
});
