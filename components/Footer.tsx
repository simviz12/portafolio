"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PHONE, PHONE_TEL } from "@/data/social";

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
                <p className="font-valorant-mono text-[11px] text-[#00f5d4] mt-1.5 tracking-wider">
                  {isEnglish ? "PRODUCT ENGINEER" : "PRODUCT ENGINEER"}
                </p>
              </div>
            </a>
            <p className="font-valorant-hud text-sm text-[#8b9bb4] leading-relaxed">
              {isEnglish
                ? "Full stack and immersive technologies — software, VR and applied AI from Pasto, Nariño."
                : "Full stack y tecnologías inmersivas — software, VR e IA aplicada desde Pasto, Nariño."}
            </p>
          </div>

          <nav aria-label={isEnglish ? "Footer" : "Pie de página"} className="lg:pt-1">
            <p className="font-valorant-mono text-[11px] tracking-[0.2em] text-[#00f5d4] mb-3 uppercase">
              {isEnglish ? "Navigate" : "Navegar"}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
              className="font-valorant-hud text-sm text-[#ece8e1] hover:text-[#00f5d4] transition-colors inline-block"
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="font-valorant-hud text-sm text-[#ece8e1] hover:text-[#00f5d4] transition-colors inline-block mb-4 mt-1"
            >
              {PHONE}
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
