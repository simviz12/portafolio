"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { Mail } from "lucide-react";
import Logo from "@/components/Logo";
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

  return (
    <footer className="w-full bg-[#070b10] border-t border-[#00f5d4]/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <div className="max-w-sm">
            <a href="#inicio" className="flex items-center gap-3 mb-4">
              <Logo size={44} />
              <div>
                <h4 className="font-valorant-title text-xl text-[#ece8e1] tracking-wide leading-none">
                  Carlos Benavides
                </h4>
                <p className="font-valorant-mono text-xs text-[#00f5d4] mt-1 font-semibold">
                  Product Engineer &bull; Full Stack &bull; Unity VR
                </p>
              </div>
            </a>
            <p className="font-valorant-hud text-sm text-[#8b9bb4] leading-relaxed">
              {isEnglish
                ? "Full Stack software development and Unity VR. Independent product developer since 2024, UCC research seedbeds, and former competitive athlete."
                : "Desarrollo de software Full Stack y Unity VR. Desarrollo de producto independiente desde 2024, semilleros UCC y ex-atleta de alto rendimiento."}
            </p>
          </div>

          <nav aria-label="Navegación del pie">
            <p className="font-valorant-mono text-[11px] tracking-[0.2em] text-[#00f5d4] mb-3 uppercase">
              {isEnglish ? "Navigation" : "Navegación"}
            </p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-valorant-hud text-sm text-[#ece8e1] hover:text-[#00f5d4] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:pt-1 lg:text-right">
            <p className="font-valorant-mono text-[11px] tracking-[0.2em] text-[#00f5d4] mb-3 uppercase">
              {isEnglish ? "Contact" : "Contacto"}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="font-valorant-hud text-sm text-[#ece8e1] hover:text-[#00f5d4] transition-colors inline-block mb-4"
            >
              {EMAIL}
            </a>
            <div className="flex items-center gap-2.5 lg:justify-end">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-10 h-10 rounded-xl bg-[#121c26] hover:bg-[#00f5d4] text-[#ece8e1] hover:text-[#090e14] border border-white/10 hover:border-[#00f5d4] flex items-center justify-center transition-all"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-10 h-10 rounded-xl bg-[#121c26] hover:bg-[#00f5d4] text-[#ece8e1] hover:text-[#090e14] border border-white/10 hover:border-[#00f5d4] flex items-center justify-center transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                title="Email"
                className="w-10 h-10 rounded-xl bg-[#121c26] hover:bg-[#00f5d4] text-[#ece8e1] hover:text-[#090e14] border border-white/10 hover:border-[#00f5d4] flex items-center justify-center transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="font-valorant-mono text-xs text-[#8b9bb4] text-center">
            &copy; 2026 Carlos Julián Benavides Burbano.{" "}
            {isEnglish ? "All rights reserved." : "Todos los derechos reservados."}
          </p>
        </div>
      </div>
    </footer>
  );
}
