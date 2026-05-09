"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const DARK = "dark";
  const LIGHT = "light";

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // ALWAYS START WITH LIGHT MODE
    setIsDark(false);
    document.documentElement.dataset.theme = LIGHT;
  }, []);

  const toggle = () => {
    const newDark = !isDark;

    setIsDark(newDark);

    const theme = newDark ? DARK : LIGHT;

    document.documentElement.dataset.theme = theme;
  };

  return (
    <button
      onClick={toggle}
      className={`
        relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300
        ${isDark ? "bg-[var(--color-brand)]" : "bg-slate-300"}
      `}
    >
      {/* ICONS */}
      <Sun className="absolute left-1 w-4 h-4 text-yellow-500 transition-opacity duration-300" />
      <Moon className="absolute right-1 w-4 h-4 text-white transition-opacity duration-300" />

      {/* TOGGLE BALL */}
      <div
        className={`
          w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300
          ${isDark ? "translate-x-7" : "translate-x-0"}
        `}
      />
    </button>
  );
}