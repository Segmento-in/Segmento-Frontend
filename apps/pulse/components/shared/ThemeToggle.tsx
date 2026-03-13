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
      className="relative w-12 h-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* icons at ends */}
      <div className="absolute inset-0 flex items-center justify-between px-1 text-xs text-white pointer-events-none">
        <Sun className="w-4 h-4" />
        <Moon className="w-4 h-4" />
      </div>
      {/* sliding knob */}
      <div
        className={`relative w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}