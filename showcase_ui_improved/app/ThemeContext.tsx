"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "gateway-os" | "neon-tokyo";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  crtEnabled: boolean;
  toggleCrt: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("gateway-os");
  const [crtEnabled, setCrtEnabled] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme;
    if (savedTheme === "gateway-os" || savedTheme === "neon-tokyo") {
      setTheme(savedTheme);
    }
    const savedCrt = localStorage.getItem("crt-enabled");
    if (savedCrt === "true") {
      setCrtEnabled(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "neon-tokyo") {
      root.classList.add("theme-neon-tokyo");
    } else {
      root.classList.remove("theme-neon-tokyo");
    }
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    const body = window.document.body;
    if (crtEnabled) {
      body.classList.add("crt-screen");
    } else {
      body.classList.remove("crt-screen");
    }
    localStorage.setItem("crt-enabled", String(crtEnabled));
  }, [crtEnabled]);

  const toggleTheme = () => {
    // Trigger the glitch animation when switching themes
    const root = window.document.documentElement;
    root.classList.add("glitch-effect");
    setTimeout(() => {
      root.classList.remove("glitch-effect");
    }, 250);

    setTheme((prev) => (prev === "gateway-os" ? "neon-tokyo" : "gateway-os"));
  };

  const toggleCrt = () => {
    setCrtEnabled((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, crtEnabled, toggleCrt }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
