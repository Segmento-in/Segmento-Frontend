"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const DARK = "dark";
  const LIGHT = "light";

  const [isDark, setIsDark] = useState(false);

  // LOAD SESSION THEME
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("theme");

    if (savedTheme === DARK) {
      setIsDark(true);
      document.documentElement.dataset.theme = DARK;
    } else {
      setIsDark(false);
      document.documentElement.dataset.theme = LIGHT;
    }
  }, []);

  const toggle = () => {
    const newDark = !isDark;

    setIsDark(newDark);

    const theme = newDark ? DARK : LIGHT;

    // APPLY THEME
    document.documentElement.dataset.theme = theme;

    // SAVE ONLY FOR CURRENT SESSION
    sessionStorage.setItem("theme", theme);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle Theme"
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