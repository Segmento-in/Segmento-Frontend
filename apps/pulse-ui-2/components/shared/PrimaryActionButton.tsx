/**
 * PrimaryActionButton — Segmento Pulse Atomic Component
 *
 * PRD Reference: PRD-1 §Phase 2: Atomic Components — "1. Primary Action Button"
 *
 * Spec:
 *   - Padding:      12px (vertical) × 24px (horizontal)
 *   - Background:   var(--pulse-color-text-primary) = #111827
 *   - Text color:   var(--pulse-color-text-inverse) = #FFFFFF
 *   - Border Radius:var(--pulse-radius-pill) = 9999px (fully rounded)
 *   - Typography:   14px, Weight 600
 *   - Hover:        transform scale(0.98), 200ms ease-out
 *
 * Engineering Notes:
 *   - Uses CSS custom properties exclusively (no hard-coded hex values).
 *   - Polymorphic via `asChild` pattern using Radix UI Slot, allowing the
 *     button to render as an <a> tag for links without DOM nesting issues.
 *   - Active state scales to 0.96 for tactile click feedback
 *     (ui-ux-pro-max skill: "Buttons should scale down slightly on click").
 *   - Focus ring provided via global :focus-visible rule in globals.css.
 *   - Minimum touch target: 44px (web-design-guidelines: WCAG AA).
 */

"use client";

import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface PrimaryActionButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** If true, renders as the child element (e.g. <a>) instead of <button>. */
    asChild?: boolean;
    /** Optional size variant. Defaults to "md". */
    size?: "sm" | "md" | "lg";
}

const SIZE_STYLES: Record<
    NonNullable<PrimaryActionButtonProps["size"]>,
    React.CSSProperties
> = {
    sm: {
        padding: "8px 16px",
        fontSize: "12px",
    },
    md: {
        /* PRD: "Padding: 12px (vertical) x 24px (horizontal)" */
        padding: "var(--pulse-btn-padding-v) var(--pulse-btn-padding-h)",
        /* PRD: "14px" */
        fontSize: "var(--pulse-font-size-meta)",
    },
    lg: {
        padding: "16px 32px",
        fontSize: "16px",
    },
};

/**
 * The base style object for the button.
 * All values reference --pulse-* CSS custom properties.
 */
const BASE_STYLES: React.CSSProperties = {
    /* PRD: "Background: color-text-primary (#111827)" */
    background: "var(--pulse-color-text-primary)",
    /* PRD: "Text: color-text-inverse" */
    color: "var(--pulse-color-text-inverse)",
    /* PRD: "Border Radius: 9999px (Fully rounded)" */
    borderRadius: "var(--pulse-radius-pill)",
    /* PRD: "Weight 600" */
    fontWeight: "var(--pulse-font-weight-label)",
    fontFamily: "inherit",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    /* PRD: "200ms ease-out transition" — applied to transform and background */
    transition: "transform var(--pulse-btn-transition), background var(--pulse-btn-transition), box-shadow var(--pulse-btn-transition)",
    /* WCAG AA: minimum touch target (web-design-guidelines skill) */
    minHeight: "44px",
    lineHeight: "1",
    textDecoration: "none",
    whiteSpace: "nowrap",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
};

export const PrimaryActionButton = forwardRef<
    HTMLButtonElement,
    PrimaryActionButtonProps
>(function PrimaryActionButton(
    { asChild = false, size = "md", style, children, disabled, ...props },
    ref
) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            ref={ref}
            disabled={disabled}
            style={{
                ...BASE_STYLES,
                ...SIZE_STYLES[size],
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? "none" : "auto",
                ...style,
            }}
            /* Inline event handlers are the only cross-framework way to apply
             * hover/active transforms without adding a CSS class dependency.
             * The alternative (a .module.css file) would also be acceptable. */
            onMouseEnter={(e) => {
                /* PRD: "Hover state scales down slightly (scale: 0.98)" */
                (e.currentTarget as HTMLElement).style.transform = "var(--pulse-btn-hover-scale)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--pulse-shadow-hover)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
            onMouseDown={(e) => {
                /* ui-ux-pro-max skill: "scale down slightly on click" */
                (e.currentTarget as HTMLElement).style.transform = "scale(0.96)";
            }}
            onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "var(--pulse-btn-hover-scale)";
            }}
            {...props}
        >
            {children}
        </Comp>
    );
});

PrimaryActionButton.displayName = "PrimaryActionButton";
