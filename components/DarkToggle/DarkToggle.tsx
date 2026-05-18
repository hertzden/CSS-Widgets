"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import styles from "./DarkToggle.module.css";

export function DarkToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const current = mounted ? (theme === "system" ? "system" : resolvedTheme) : "system";
  const isDark = current === "dark";

  function cycle() {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }

  const label =
    theme === "system" ? "Auto mode" : isDark ? "Dark mode" : "Light mode";

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={`Switch theme (currently ${label})`}
      onClick={cycle}
      title={label}
    >
      <span className={styles.icon} aria-hidden="true">
        {mounted ? (theme === "system" ? "◐" : isDark ? "🌙" : "☀") : "◐"}
      </span>
    </button>
  );
}
