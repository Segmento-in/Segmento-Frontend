'use client';

import * as React from "react";

export interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}

export interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> { }
export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> { }
export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}
export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    placeholder?: string;
}

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

export function Select({ value, onValueChange, children }: SelectProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
}

export function SelectTrigger({ className = "", children, ...props }: SelectTriggerProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within Select");

    return (
        <button
            type="button"
            className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-950 ${className}`}
            onClick={() => context.setOpen(!context.open)}
            {...props}
        >
            {children}
            <svg
                className={`h-4 w-4 opacity-50 transition-transform ${context.open ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
}

export function SelectValue({ placeholder = "Select...", ...props }: SelectValueProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectValue must be used within Select");

    return (
        <span {...props}>
            {context.value || placeholder}
        </span>
    );
}

export function SelectContent({ className = "", children, ...props }: SelectContentProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectContent must be used within Select");

    if (!context.open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40"
                onClick={() => context.setOpen(false)}
            />
            <div
                className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}
                {...props}
            >
                {children}
            </div>
        </>
    );
}

export function SelectItem({ className = "", value, children, ...props }: SelectItemProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectItem must be used within Select");

    return (
        <div
            className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700 ${context.value === value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${className}`}
            onClick={() => {
                context.onValueChange(value);
                context.setOpen(false);
            }}
            {...props}
        >
            {children}
        </div>
    );
}
