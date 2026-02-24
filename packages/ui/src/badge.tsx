import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "destructive";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-blue-600 text-white",
        secondary: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
        outline: "border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300",
        destructive: "bg-red-600 text-white",
    };

    return (
        <div
            className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
            {...props}
        />
    );
}
