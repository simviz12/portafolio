"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { projects } from "@/data/projects";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function Projects() {
  const { isEnglish } = usePortfolio();

  return (
    <section id="proyectos" className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center bg-tactical-grid">
      <div className="w-full max-w-7xl flex flex-col gap-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] font-valorant-mono text-xs self-start font-semibold">
          <span>{isEnglish ? "OPERATIONS & PROJECTS • RESEARCH • HACKATHONS" : "OPERACIONES Y PROYECTOS • SEMILLERO • HACKATHONS"}</span>
        </div>
        <h3 className="font-valorant-title text-4xl sm:text-5xl text-[#ece8e1] tracking-wide uppercase leading-none">
          {isEnglish ? "FEATURED PROJECTS" : "PROYECTOS DESTACADOS"}
        </h3>
        <p className="text-base text-[#8b9bb4] font-valorant-hud max-w-3xl">
          {isEnglish
            ? "Built with research methodologies, Clean Architecture, artificial intelligence, and cross-platform paradigms (Mobile, Desktop, and Web)."
            : "Desarrollados con metodologías de investigación, Clean Architecture, inteligencia artificial y arquitecturas multiplataforma (Mobile, Desktop y Web)."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl">
        {projects.map((proj, index) => {
          const badgeText = isEnglish ? proj.badge.en : proj.badge.es;
          const subtitleText = isEnglish ? proj.subtitle.en : proj.subtitle.es;
          const descriptionText = isEnglish ? proj.description.en : proj.description.es;
          const metrics = isEnglish ? proj.impactMetrics.en : proj.impactMetrics.es;

          return (
            <div
              key={proj.title}
              className="relative p-7 rounded-3xl bg-[#0f1923]/95 border border-white/10 hover:border-[#00f5d4] hover:shadow-[0_0_30px_rgba(0,245,212,0.2)] shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1.5 overflow-hidden"
            >
              <div className="absolute -top-3 -right-2 font-valorant-title text-7xl text-[#00f5d4]/10 pointer-events-none select-none">
                0{index + 1}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-valorant-mono text-xs font-bold px-3 py-1 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30">
                    {badgeText}
                  </span>
                </div>

                <h4 className="font-valorant-title text-2xl sm:text-3xl text-[#ece8e1] tracking-wide mb-2 leading-tight">
                  {proj.title}
                </h4>

                <div className="font-valorant-mono text-xs text-[#00f5d4] mb-4 font-semibold">
                  {subtitleText}
                </div>

                <p className="text-sm text-[#8b9bb4] leading-relaxed mb-5 font-valorant-hud">
                  {descriptionText}
                </p>

                <div className="space-y-2 mb-6 p-4 rounded-2xl bg-[#16222f]/80 border border-white/5">
                  <div className="text-xs font-bold text-[#00f5d4] uppercase tracking-wider mb-1">
                    {isEnglish ? "KEY HIGHLIGHTS" : "IMPACTO TÉCNICO"}
                  </div>
                  {metrics.map((h, i) => (
                    <div key={i} className="text-xs text-[#ece8e1] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-valorant-mono bg-black/40 text-[#00f5d4] rounded-lg border border-[#00f5d4]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-10 rounded-xl bg-black/40 border border-white/10 hover:border-[#00f5d4] text-[#ece8e1] hover:text-[#00f5d4] font-valorant-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-10 rounded-xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 hover:bg-[#00f5d4] hover:text-[#090e14] text-[#00f5d4] font-valorant-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {isEnglish ? "Open" : "Abrir"}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
