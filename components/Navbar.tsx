"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FileText, Menu, X, Sun, Moon } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import Logo from "@/components/Logo";
import Magnetic from "@/components/fx/Magnetic";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#inicio");
  const { isEnglish, toggleLanguage, theme, toggleTheme } = usePortfolio();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 400 && !isOpen);
  });

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

  useEffect(() => {
    const ids = ["inicio", "sobre-mi", "proyectos", "testimonios", "experiencia", "habilidades", "contacto"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const onResize = () => window.innerWidth >= 1024 && setIsOpen(false);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <motion.header
      className="fixed top-0 inset-x-0 z-[100] px-3 sm:px-6 pt-3 sm:pt-4"
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 24 }}
    >
      <div
        className={`mx-auto max-w-7xl rounded-full transition-all duration-500 ${
          scrolled ? "glass-strong shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]" : "bg-transparent border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 pl-2 pr-2 sm:pl-3">
          <a href="#inicio" className="flex items-center gap-2.5 group shrink-0" data-cursor="Top">
            <motion.span whileHover={{ rotate: 180 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
              <Logo size={38} />
            </motion.span>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-bold text-sm tracking-tight text-ink">CJ Benavides</span>
              <span className="font-mono text-[9px] text-muted tracking-[0.22em] mt-1 uppercase">Product Engineer</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-full">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors duration-300 ${
                    isActive ? "text-[#030407]" : "text-muted hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent shadow-[0_0_24px_var(--glow)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleLanguage}
              title={isEnglish ? "Cambiar idioma a Español" : "Switch language to English"}
              className="btn-ghost h-10 px-3 rounded-full font-mono text-[11px] font-bold tracking-widest flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span className={isEnglish ? "text-accent-ink" : "text-muted"}>EN</span>
              <span className="text-muted">/</span>
              <span className={!isEnglish ? "text-accent-ink" : "text-muted"}>ES</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Cambiar a modo claro"}
              title={theme === "light" ? "Switch to dark mode" : "Cambiar a modo claro"}
              className="btn-ghost h-10 w-10 rounded-full flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: 20, rotate: -90, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={{ y: -20, rotate: 90, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-accent" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Magnetic className="hidden sm:inline-flex">
              <a
                href="/cv.pdf"
                download="Carlos_Julian_Benavides_CV.pdf"
                className="btn-neon h-10 px-5 rounded-full font-display font-bold text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>CV</span>
              </a>
            </Magnetic>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden btn-ghost h-10 w-10 rounded-full flex items-center justify-center"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden mx-auto max-w-7xl mt-2 glass-strong rounded-3xl p-3 overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <motion.div
              className="flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                  className="flex items-baseline justify-between px-4 py-3 rounded-2xl hover:bg-faint"
                >
                  <span className="font-display font-bold text-2xl text-ink">{link.label}</span>
                  <span className="font-mono text-[10px] text-muted">0{i + 1}</span>
                </motion.a>
              ))}
              <a
                href="/cv.pdf"
                download="Carlos_Julian_Benavides_CV.pdf"
                onClick={() => setIsOpen(false)}
                className="btn-neon mt-2 py-3.5 rounded-2xl font-display font-bold text-center text-sm flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{isEnglish ? "DOWNLOAD CV" : "DESCARGAR CV"}</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
