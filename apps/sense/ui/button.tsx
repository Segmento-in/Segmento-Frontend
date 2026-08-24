import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    children?: React.ReactNode;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
}
