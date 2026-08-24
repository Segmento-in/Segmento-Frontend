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

// ── T1: Logo path ──────────────────────────────────────────────────────────

describe("SenseNavbar — logo", () => {
    it("renders logo with correct src (not the broken /sense/ prefix)", () => {
        render(<SenseNavbar />);
        const logo = screen.getByRole("img", { name: /logo/i });
        // RED: will fail — current src is "/sense/images/logo.png"
        expect(logo).toHaveAttribute("src", "/images/segmento_logo_clean.png");
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
