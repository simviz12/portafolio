"use client";

import { useEffect, useState } from "react";
import { FileText, Menu, X, Globe, Sun, Moon } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isEnglish, toggleLanguage, theme, toggleTheme } = usePortfolio();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const navLinks = isEnglish
    ? [
        { label: "Home", href: "#inicio" },
        { label: "About", href: "#sobre-mi" },
        { label: "Projects", href: "#proyectos" },
        { label: "Reviews", href: "#testimonios" },
        { label: "Path", href: "#experiencia" },
        { label: "Skills", href: "#habilidades" },
        { label: "Contact", href: "#contacto" },
      ]
    : [
        { label: "Inicio", href: "#inicio" },
        { label: "Sobre mí", href: "#sobre-mi" },
        { label: "Proyectos", href: "#proyectos" },
        { label: "Opiniones", href: "#testimonios" },
        { label: "Ruta", href: "#experiencia" },
        { label: "Skills", href: "#habilidades" },
        { label: "Contacto", href: "#contacto" },
      ];

  return (
    <header
      className={`fixed top-0 w-full z-50 pt-safe transition-all duration-300 nav-glass ${
        scrolled ? "nav-scrolled shadow-[0_8px_32px_rgba(0,0,0,0.12)]" : ""
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.25rem] gap-3">
          <a href="#inicio" className="flex items-center gap-2.5 group shrink-0">
            <Logo size={40} className="relative group-hover:scale-105 transition-transform" />
            <div className="flex flex-col leading-none">
              <span className="font-valorant-title text-base sm:text-lg tracking-wider text-[#ece8e1] group-hover:text-[#00f5d4] transition-colors">
                CJ BENAVIDES
              </span>
              <span className="hidden sm:block font-valorant-mono text-[10px] text-[#8b9bb4] tracking-[0.16em] mt-1">
                PRODUCT ENGINEER
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 mx-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link px-2.5 xl:px-3 py-1.5 rounded-full font-valorant-hud text-[13px] xl:text-sm font-semibold whitespace-nowrap transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLanguage}
              title={isEnglish ? "Cambiar idioma a Español" : "Switch language to English"}
              className="nav-chip h-9 px-2.5 rounded-full font-valorant-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-[#00f5d4]" />
              <span>{isEnglish ? "EN" : "ES"}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to Tactical Dark Mode" : "Cambiar a Modo Claro"}
              title={theme === "light" ? "Switch to Tactical Dark Mode" : "Cambiar a Modo Claro"}
              className="nav-chip h-9 w-9 rounded-full flex items-center justify-center cursor-pointer active:scale-95 relative z-50"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-[#00f5d4]" />
              ) : (
                <Sun className="w-4 h-4 text-[#00f5d4]" />
              )}
            </button>

            <a
              href="/cv.pdf"
              download="Carlos_Julian_Benavides_CV.pdf"
              className="hidden sm:flex h-9 px-3.5 rounded-full bg-gradient-to-r from-[#00f5d4] to-[#00c4a7] text-[#090e14] font-valorant-title text-sm tracking-wider items-center gap-1.5 shadow-[0_0_16px_rgba(0,245,212,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden nav-chip h-9 w-9 rounded-full flex items-center justify-center"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5 text-[#00f5d4]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="mobile-drawer rounded-2xl p-3">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="mobile-link font-valorant-hud text-sm font-semibold"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/cv.pdf"
                download="Carlos_Julian_Benavides_CV.pdf"
                onClick={() => setIsOpen(false)}
                className="mt-2 py-3 rounded-xl bg-[#00f5d4] text-[#090e14] font-valorant-title text-center text-sm font-bold flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{isEnglish ? "DOWNLOAD CV" : "DESCARGAR CV"}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
