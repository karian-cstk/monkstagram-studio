"use client";

import { useEffect, useState } from "react";

// Tracks the same data-theme attribute ThemeToggle sets on <html>, for
// pages (leaderboard, dashboard) that use their own inline color constants
// rather than the Tailwind CSS-var tokens — so they stay in sync with the
// global toggle without a full retrofit to Tailwind classes.
export function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("storage", read);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", read);
    };
  }, []);

  return theme;
}
