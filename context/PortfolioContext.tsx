"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "light" | "dark";
export type Language = "en" | "es";

interface PortfolioContextType {
  isEnglish: boolean;
  setIsEnglish: (val: boolean) => void;
  toggleLanguage: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Requisitos explícitos del usuario:
  // 1. "la página cuando se inicia, inicia en inglés."
  // 2. "siempre la página debe iniciar en modo claro, nunca en modo oscuro."
  //    El modo oscuro es la versión cinematográfica (OLED + neón) y solo se activa con el toggle.
  const [isEnglish, setIsEnglish] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>("light");

  // Los tokens de color viven en CSS variables bajo .theme-light / .theme-dark en <html>.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-light", theme === "light");
    root.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = isEnglish ? "en" : "es";
  }, [isEnglish]);

  const toggleLanguage = () => setIsEnglish((prev) => !prev);
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <PortfolioContext.Provider
      value={{
        isEnglish,
        setIsEnglish,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
