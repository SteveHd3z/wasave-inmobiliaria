"use client";

import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer"
      style={{
        backgroundColor: theme === "dark" ? "var(--primary)" : "var(--border-color)",
      }}
      aria-label="Cambiar tema"
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center text-xs"
        style={{
          transform: theme === "dark" ? "translateX(28px)" : "translateX(0)",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
