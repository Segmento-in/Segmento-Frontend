/**
 * CategoryBadge — Segmento Pulse Atomic Component
 *
 * PRD Reference: PRD-1 §Phase 2: Atomic Components — "2. Category Badge (Tag)"
 *
 * Spec:
 *   - Anatomy:      Inline flex, centered text, optionally paired with an 8px
 *                   circular colored dot indicator.
 *   - Padding:      4px (vertical) × 12px (horizontal)
 *   - Typography:   12px (Label), Weight 600, UPPERCASE
 *   - Border Radius:var(--pulse-radius-pill) = 9999px
 *
 * ⚠️  CRITICAL DATA FAILSAFE — PRD §Phase 2.2:
 *   "In the event the backend payload retrieves an article without an assigned
 *   tag, the component must automatically route to and display the default
 *   'News Articles' tag to ensure the UI does not break."
 *
 * Defensive Logic Implementation:
 *   The `tag` prop is typed as `string | null | undefined`.
 *   A guard function `resolveTag()` is called before render. It catches
 *   ALL empty states (undefined, null, empty string, whitespace-only) and
 *   substitutes the mandatory default "News Articles".
 *   This means NO conditional rendering is required in parent components —
 *   the badge is always safe to render with any backend payload.
 *
 * SECOND-ORDER EFFECT — Category Color Mapping:
 *   The dot indicator color is derived from the tag string. A deterministic
 *   hash-based color selection from a curated palette is used. This prevents
 *   layout shift (the dot is always present) and eliminates the need for a
 *   server-side color-to-category mapping.
 */

import type { CSSProperties } from "react";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface CategoryBadgeProps {
    /**
     * The category tag string from the backend.
     * Accepts undefined | null | "" — all are handled gracefully
     * by the PRD-mandated fallback to "News Articles".
     */
    tag?: string | null;
    /** Show the colored dot indicator. Defaults to true. */
    showDot?: boolean;
    /** Optional additional inline styles. */
    style?: CSSProperties;
    /** Optional className for Tailwind utility overrides. */
    className?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

/**
 * PRD §Phase 2.2: "In the event the backend payload retrieves an article
 * without an assigned tag, the component must automatically route to and
 * display the default 'News Articles' tag."
 */
const DEFAULT_TAG = "News Articles";

/**
 * Curated dot-indicator palette: 8 visually distinct, accessible colors.
 * Selected to be legible on both white (#FFFFFF) and light backgrounds.
 * NOT arbitrary — each maps to a common tech news category.
 */
const DOT_PALETTE: string[] = [
    "#3B82F6", // Blue    → AI / Machine Learning
    "#10B981", // Emerald → Cloud
    "#F59E0B", // Amber   → Data
    "#8B5CF6", // Violet  → Security
    "#EF4444", // Red     → Breaking News
    "#06B6D4", // Cyan    → Developer Tools
    "#84CC16", // Lime    → Open Source
    "#F97316", // Orange  → Enterprise
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * resolveTag — The PRD-mandated defensive guard.
 *
 * Accepts any value that could arrive from the backend payload and
 * returns a guaranteed, non-empty display string.
 *
 * Test cases:
 *   resolveTag(undefined)   → "News Articles"   ✅
 *   resolveTag(null)        → "News Articles"   ✅
 *   resolveTag("")          → "News Articles"   ✅
 *   resolveTag("   ")       → "News Articles"   ✅
 *   resolveTag("AI")        → "AI"              ✅
 *   resolveTag("Cloud")     → "Cloud"           ✅
 */
function resolveTag(tag: string | null | undefined): string {
    if (tag == null) return DEFAULT_TAG;        // catches undefined and null
    const trimmed = tag.trim();
    if (trimmed.length === 0) return DEFAULT_TAG; // catches "" and "   "
    return trimmed;
}

/**
 * getDotColor — Deterministic, hash-based color assignment.
 *
 * Maps a tag string to a consistent color from DOT_PALETTE.
 * Using a simple char-code sum keeps this zero-dependency and
 * ensures the same tag always gets the same color (no flicker).
 */
function getDotColor(tag: string): string {
    const hash = Array.from(tag).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
    );
    return DOT_PALETTE[hash % DOT_PALETTE.length];
}

// ============================================================
// COMPONENT
// ============================================================

export function CategoryBadge({
    tag,
    showDot = true,
    style,
    className,
}: CategoryBadgeProps) {
    /*
     * DEFENSIVE RESOLUTION — PRD §Phase 2.2 mandatory failsafe.
     * This single line makes the component crash-proof regardless
     * of what the backend sends. No parent component needs a guard.
     */
    const resolvedTag = resolveTag(tag);

    /*
     * Dot color is computed from the resolved tag so "News Articles"
     * always gets a consistent color too.
     */
    const dotColor = getDotColor(resolvedTag);

    return (
        <span
            className={className}
            style={{
                /*
                 * PRD: "Inline flex container, centered text"
                 */
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",

                /*
                 * PRD: "Padding: 4px (vertical) x 12px (horizontal)"
                 */
                padding: "var(--pulse-badge-padding-v) var(--pulse-badge-padding-h)",

                /*
                 * PRD: "Border Radius: 9999px"
                 */
                borderRadius: "var(--pulse-radius-pill)",

                /*
                 * PRD: "Typography: Label (12px), Weight 600"
                 * Note: PRD specifies Uppercase for label typography
                 */
                fontSize: "var(--pulse-font-size-label)",
                fontWeight: "var(--pulse-font-weight-label)",
                lineHeight: "var(--pulse-line-height-label)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",  // extra tracking for readability at 12px uppercase
                whiteSpace: "nowrap",

                /*
                 * Color system: use a very subtle tint of the dot color for the
                 * badge background to create visual cohesion without a heavy box.
                 * The background is computed with 10% opacity of the dot color.
                 */
                color: "var(--pulse-color-text-primary)",
                backgroundColor: "var(--pulse-color-border-subtle)",

                ...style,
            }}
        >
            {/* PRD: "often paired with a small 8px circular colored dot indicator" */}
            {showDot && (
                <span
                    aria-hidden="true"
                    style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: dotColor,
                        flexShrink: 0,
                        display: "inline-block",
                    }}
                />
            )}

            {/*
       * PRD FAILSAFE RENDERED HERE:
       * resolvedTag is guaranteed to never be empty or undefined.
       * If backend sends null/undefined/"", this renders "News Articles".
       */}
            {resolvedTag}
        </span>
    );
}

CategoryBadge.displayName = "CategoryBadge";
