"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  // Avoid hydration flash — don't render until mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder button of same size to avoid layout shift
    return (
      <div className="h-8 w-8 rounded-lg border border-slate-700/60 bg-slate-800/50" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const cycleTheme = () => {
    if (theme === "dark")   return setTheme("light");
    if (theme === "light")  return setTheme("system");
    return setTheme("dark");
  };

  const label =
    theme === "dark"   ? "Switch to Light"
    : theme === "light" ? "Switch to System"
    : "Switch to Dark";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={label}
      aria-label={label}
      className="
        group relative flex h-8 w-8 items-center justify-center
        overflow-hidden rounded-lg border
        border-slate-200 bg-white text-slate-700
        shadow-sm transition-all duration-300
        hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-indigo-200/50
        dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-400
        dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
      "
    >
      {/* Animated icon container */}
      <span
        className="
          absolute flex items-center justify-center
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        "
        style={{
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(0.8)",
          opacity: isDark ? 1 : 0,
        }}
      >
        <Sun className="h-4 w-4" strokeWidth={2} />
      </span>

      <span
        className="
          absolute flex items-center justify-center
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        "
        style={{
          transform: isDark ? "rotate(-180deg) scale(0.8)" : "rotate(0deg) scale(1)",
          opacity: isDark ? 0 : 1,
        }}
      >
        {theme === "system" ? (
          <Monitor className="h-4 w-4" strokeWidth={2} />
        ) : (
          <Moon className="h-4 w-4" strokeWidth={2} />
        )}
      </span>

      {/* Glow ring on hover */}
      <span className="absolute inset-0 rounded-lg opacity-0 ring-1 ring-inset ring-indigo-500/20 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
}
