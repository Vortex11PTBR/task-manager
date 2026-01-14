"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita erro de hidratação (SSR vs Client)
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-10 w-10" />;

  const current = resolvedTheme || theme;

  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:scale-110 transition-all group overflow-hidden"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
    </button>
  );
}