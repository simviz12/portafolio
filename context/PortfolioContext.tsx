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
  const [isEnglish, setIsEnglish] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>("light");

  // Sincronizar clases en el elemento HTML y body para garantizar que TODO cambie
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === "light") {
      root.classList.add("theme-light");
      root.classList.remove("theme-dark");
      body.classList.add("theme-light");
      body.classList.remove("theme-dark");
    } else {
      root.classList.add("theme-dark");
      root.classList.remove("theme-light");
      body.classList.add("theme-dark");
      body.classList.remove("theme-light");
    }
  }, [theme]);

  const toggleLanguage = () => setIsEnglish((prev) => !prev);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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
      <div className={`portfolio-root ${theme === "light" ? "theme-light" : "theme-dark"} min-h-screen transition-colors duration-200`}>
        {children}
      </div>
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
