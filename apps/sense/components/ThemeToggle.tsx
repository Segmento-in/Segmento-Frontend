"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;

    if (root.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;

    if (theme === "light") {
      root.classList.add("dark");
      setTheme("dark");
    } else {
      root.classList.remove("dark");
      setTheme("light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        w-11
        h-11
        rounded-xl
        border
        border-slate-300
        dark:border-cyan-400/20
        bg-white
        dark:bg-slate-800
        flex
        items-center
        justify-center
        transition-all
        duration-300
        hover:bg-slate-100
        dark:hover:bg-slate-700
      "
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-cyan-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  );
}