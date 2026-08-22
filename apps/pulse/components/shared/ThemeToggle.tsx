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

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative w-14 h-7 flex items-center rounded-full p-1
        transition-all duration-300
        ${isDark ? "bg-cyan-500" : "bg-slate-300"}
      `}
    >
      {/* SUN ICON */}
      <Sun
        className={`
          absolute left-1 w-4 h-4 text-yellow-500
          transition-all duration-300
          ${isDark ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* MOON ICON */}
      <Moon
        className={`
          absolute right-1 w-4 h-4 text-white
          transition-all duration-300
          ${isDark ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* TOGGLE BALL */}
      <div
        className={`
          w-5 h-5 bg-white rounded-full shadow-md
          transform transition-all duration-300
          ${isDark ? "translate-x-7" : "translate-x-0"}
        `}
      />
    </button>
  );
}