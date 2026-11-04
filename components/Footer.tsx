"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { ArrowUp, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import Magnetic from "@/components/fx/Magnetic";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/social";

export default function Footer() {
  const { isEnglish } = usePortfolio();

  const links = [
    { href: "#inicio", label: isEnglish ? "Home" : "Inicio" },
    { href: "#sobre-mi", label: isEnglish ? "About" : "Sobre mí" },
    { href: "#proyectos", label: isEnglish ? "Projects" : "Proyectos" },
    { href: "#habilidades", label: isEnglish ? "Skills" : "Habilidades" },
    { href: "#contacto", label: isEnglish ? "Contact" : "Contacto" },
  ];

  const socials = [
    { href: GITHUB_URL, label: "GitHub", icon: <GithubIcon className="w-4 h-4" />, external: true },
    { href: LINKEDIN_URL, label: "LinkedIn", icon: <LinkedinIcon className="w-4 h-4" />, external: true },
    { href: `mailto:${EMAIL}`, label: "Email", icon: <Mail className="w-4 h-4" />, external: false },
  ];

  return (
    <footer className="relative z-10 w-full overflow-hidden border-t border-glass-border glass-strong">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <a href="#inicio" className="flex items-center gap-3 mb-5">
              <Logo size={44} />
              <div>
                <div className="font-display font-bold text-lg text-ink leading-none">Carlos Benavides</div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-muted mt-1.5 uppercase">
                  Product Engineer · Full Stack · Unity VR
                </div>
              </div>
            </a>
            <p className="text-muted leading-relaxed max-w-sm">
              {isEnglish
                ? "Full Stack software development and Unity VR. Independent product developer since 2024, UCC research seedbeds, and former competitive athlete."
                : "Desarrollo de software Full Stack y Unity VR. Desarrollo de producto independiente desde 2024, semilleros UCC y ex-atleta de alto rendimiento."}
            </p>
          </div>

          <nav aria-label={isEnglish ? "Footer navigation" : "Navegación del pie"} className="md:col-span-3">
            <p className="font-mono text-[10.5px] tracking-[0.25em] text-accent-ink mb-4 uppercase">
              {isEnglish ? "Navigation" : "Navegación"}
            </p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="group inline-flex items-center gap-2 text-ink hover:text-accent-ink transition-colors">
                    <span className="h-px w-0 bg-accent group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4 md:text-right">
            <p className="font-mono text-[10.5px] tracking-[0.25em] text-accent-ink mb-4 uppercase">
              {isEnglish ? "Contact" : "Contacto"}
            </p>
            <a href={`mailto:${EMAIL}`} className="text-ink hover:text-accent-ink transition-colors inline-block mb-5 break-all">
              {EMAIL}
            </a>
            <div className="flex items-center gap-2.5 md:justify-end">
              {socials.map((s) => (
                <Magnetic key={s.label} strength={0.45}>
                  <a
                    href={s.href}
                    {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    title={s.label}
                    className="btn-ghost w-11 h-11 rounded-full flex items-center justify-center hover:border-accent hover:text-accent-ink transition-colors"
                  >
                    {s.icon}
                  </a>
                </Magnetic>
              ))}
              <Magnetic strength={0.45}>
                <a
                  href="#inicio"
                  title={isEnglish ? "Back to top" : "Volver arriba"}
                  className="btn-neon w-11 h-11 rounded-full flex items-center justify-center"
                >
                  <ArrowUp className="w-4 h-4" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-muted">
          <p>
            &copy; 2026 Carlos Julián Benavides Burbano. {isEnglish ? "All rights reserved." : "Todos los derechos reservados."}
          </p>
          <p>Pasto · Colombia</p>
        </div>
      </div>
    </footer>
  );
}
