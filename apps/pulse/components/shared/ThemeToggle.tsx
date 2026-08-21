"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center w-12 h-8 rounded-full border border-[var(--pulse-color-border-subtle)] bg-transparent hover:bg-[var(--pulse-color-bg-hover)] px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pulse-color-brand-accent)] transition-colors duration-200"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[var(--pulse-color-text-tertiary)] pointer-events-none">
        <Sun className="w-4 h-4" strokeWidth={2} />
        <Moon className="w-4 h-4" strokeWidth={2} />
      </div>
      <div
        className={`relative z-10 w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 bg-[var(--pulse-color-text-secondary)] ${
          theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}