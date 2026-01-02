"use client"

import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface TooltipProps {
    content: string
    children?: React.ReactNode
}

/**
 * Simple tooltip implementation using CSS hover
 * Alternative to Radix Popover for showing insight information
 */
export function Tooltip({ content, children }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false)

    return (
        <div className="relative inline-block">
            <button
                type="button"
                className="inline-flex items-center justify-center rounded-full p-0.5 text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                aria-label="More information"
            >
                {children || <Info className="h-4 w-4" />}
            </button>

            <div
                role="tooltip"
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-200",
                    "before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:top-full before:border-4 before:border-transparent before:border-t-gray-900",
                    isVisible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
            >
                {content}
            </div>
        </div>
    )
}
