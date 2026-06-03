"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const STORAGE_KEY = "cursor-india-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitial(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Sync with the value already applied by the boot script in <head>.
  useEffect(() => {
    setThemeState(readInitial());
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {
        // ignore — localStorage unavailable (incognito, etc.)
      }
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback so the hook can be safely used in SSR-rendered components
    // before the provider has mounted on the client.
    return {
      theme: "dark",
      setTheme: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}
