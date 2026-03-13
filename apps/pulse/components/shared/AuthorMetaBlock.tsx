/**
 * AuthorMetaBlock — Segmento Pulse Atomic Component
 *
 * PRD Reference: PRD-1 §Phase 2: Atomic Components — "3. Author Meta Block"
 *
 * Spec:
 *   - Anatomy:    24px × 24px circular avatar image adjacent to Author Name.
 *   - Gap:        8px between avatar and text.
 *   - Typography: 14px (Meta/Small), Weight 500, color-text-secondary.
 *
 * Engineering Notes:
 *   - Uses Next.js <Image> component for automatic optimization (WebP/AVIF
 *     conversion, lazy loading, LCP optimization).
 *   - DEFENSIVE FALLBACK: If the avatarUrl prop is missing/null/undefined,
 *     the component renders a deterministic SVG initial-based avatar instead
 *     of a broken <img>. This prevents layout shift and avoids broken image
 *     icons appearing on cards.
 *   - DEFENSIVE FALLBACK: If authorName is missing, renders "Unknown Author"
 *     to prevent empty author meta blocks.
 *   - The date prop is optional; if provided, it is formatted as a relative
 *     or absolute date using the Intl.DateTimeFormat API (no date-fns import
 *     needed for this atom — native API reduces bundle size).
 *
 * SECOND-ORDER EFFECT — Avatar Image Domains:
 *   next.config.ts sets remotePatterns: [{ protocol:"https", hostname:"**" }]
 *   for the parallel build, allowing any avatar URL to load during testing.
 *   This must be tightened to a domain allowlist before production swap.
 */

"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface AuthorMetaBlockProps {
    /** Author's display name. Falls back to "Unknown Author" if missing. */
    authorName?: string | null;
    /** URL to the author's avatar image. Falls back to initials avatar if missing. */
    avatarUrl?: string | null;
    /**
     * Optional publication date string or Date object.
     * Rendered as a formatted date string (e.g. "Mar 5, 2026").
     * If omitted, the date section is not rendered.
     */
    date?: string | Date | null;
    /** Optional additional inline styles for the root container. */
    style?: CSSProperties;
    /** Optional className. */
    className?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_AUTHOR = "Unknown Author";

/**
 * Colors for the initials avatar background.
 * Deterministically assigned from author name — same author always
 * gets the same color (prevents color flicker between renders).
 */
const AVATAR_BG_PALETTE: string[] = [
    "#3B82F6",  // Blue
    "#8B5CF6",  // Violet
    "#10B981",  // Emerald
    "#F59E0B",  // Amber
    "#EF4444",  // Red
    "#06B6D4",  // Cyan
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function resolveAuthorName(name: string | null | undefined): string {
    if (name == null) return DEFAULT_AUTHOR;
    const trimmed = name.trim();
    return trimmed.length > 0 ? trimmed : DEFAULT_AUTHOR;
}

/**
 * Returns the first character of the first two words of the author name
 * to use as the initials avatar label (e.g. "John Doe" → "JD").
 */
function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
}

/**
 * Deterministic background color for the initials avatar.
 */
function getAvatarBg(name: string): string {
    const hash = Array.from(name).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
    );
    return AVATAR_BG_PALETTE[hash % AVATAR_BG_PALETTE.length];
}

/**
 * Formats a date value to a locale-friendly string.
 * Uses the native Intl.DateTimeFormat API (no external library needed).
 * Example output: "Mar 5, 2026"
 */
export function formatDate(date: string | Date | null | undefined): string | null {
    if (date == null) return null;
    try {
        const d = typeof date === "string" ? new Date(date) : date;
        if (isNaN(d.getTime())) return null;
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(d);
    } catch {
        return null;
    }
}

// ============================================================
// SUB-COMPONENT: InitialsAvatar
// Rendered when avatarUrl is missing — prevents broken img icons.
// ============================================================

function InitialsAvatar({ name }: { name: string }) {
    const initials = getInitials(name);
    const bg = getAvatarBg(name);

    return (
        <span
            aria-hidden="true"
            style={{
                /* PRD: "24px x 24px circular avatar" */
                width: "var(--pulse-avatar-size)",
                height: "var(--pulse-avatar-size)",
                minWidth: "var(--pulse-avatar-size)",
                borderRadius: "50%",
                background: bg,
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.03em",
                lineHeight: 1,
                userSelect: "none",
            }}
        >
            {initials}
        </span>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function AuthorMetaBlock({
    authorName,
    avatarUrl,
    date,
    style,
    className,
}: AuthorMetaBlockProps) {
    const resolvedName = resolveAuthorName(authorName);
    const formattedDate = formatDate(date);
    const hasAvatar = avatarUrl != null && avatarUrl.trim().length > 0;

    return (
        <div
            className={className}
            style={{
                /*
                 * PRD: "24px × 24px circular avatar image adjacent to Author Name"
                 * Layout: horizontal flex
                 */
                display: "inline-flex",
                alignItems: "center",
                /* PRD: "8px gap between avatar and text" */
                gap: "var(--pulse-avatar-gap)",
                ...style,
            }}
        >
            {/* ---- AVATAR ---- */}
            {hasAvatar ? (
                /*
                 * Next.js <Image> for performance (web-design-guidelines: "Use WebP/AVIF,
                 * use lazy loading for images below the fold").
                 * width/height match the PRD spec of 24px × 24px.
                 */
                <Image
                    src={avatarUrl!}
                    alt={`${resolvedName} avatar`}
                    width={24}
                    height={24}
                    style={{
                        /* PRD: "24px × 24px circular avatar image" */
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                    }}
                />
            ) : (
                /*
                 * DEFENSIVE FALLBACK: avatarUrl missing/null/undefined.
                 * Renders a smooth initials avatar using the author's name.
                 * UI never shows a broken image icon.
                 */
                <InitialsAvatar name={resolvedName} />
            )}

            {/* ---- TEXT BLOCK ---- */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span
                    style={{
                        /*
                         * PRD: "Author Name. Typography: Meta / Small (14px), color-text-secondary"
                         * PRD: "Weight: 500" (Meta/Small weight)
                         */
                        fontSize: "var(--pulse-font-size-meta)",
                        fontWeight: "var(--pulse-font-weight-meta)",
                        lineHeight: "var(--pulse-line-height-meta)",
                        color: "var(--pulse-color-text-secondary)",
                    }}
                >
                    {resolvedName}
                </span>

                {/* Optional date — rendered only when provided */}
                {formattedDate && (
                    <time
                        dateTime={
                            typeof date === "string"
                                ? date
                                : date instanceof Date
                                    ? date.toISOString()
                                    : undefined
                        }
                        style={{
                            fontSize: "11px",
                            fontWeight: 400,
                            color: "var(--pulse-color-text-secondary)",
                            opacity: 0.75,
                        }}
                    >
                        {formattedDate}
                    </time>
                )}
            </div>
        </div>
    );
}

AuthorMetaBlock.displayName = "AuthorMetaBlock";
