"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import SectionHeading from "@/components/fx/SectionHeading";
import TiltCard from "@/components/fx/TiltCard";
import { Reveal } from "@/components/fx/Reveal";

const HUES = ["var(--accent)", "var(--accent-2)", "var(--accent-3)"];

export default function Projects() {
  const { isEnglish } = usePortfolio();

  return (
    <section id="proyectos" className="relative w-full px-5 sm:px-8 lg:px-12 py-28 sm:py-40">
      <div className="w-full max-w-7xl mx-auto">
        <SectionHeading
          index="02"
          align="right"
          eyebrow={isEnglish ? "Operations · Research · Hackathons" : "Operaciones · Semillero · Hackathons"}
          title={isEnglish ? "Featured" : "Proyectos"}
          accent={isEnglish ? "projects" : "destacados"}
          note={
            isEnglish
              ? "Built with research methodologies, Clean Architecture, artificial intelligence, and cross-platform paradigms (Mobile, Desktop, and Web)."
              : "Desarrollados con metodologías de investigación, Clean Architecture, inteligencia artificial y arquitecturas multiplataforma (Mobile, Desktop y Web)."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((proj, index) => {
            const featured = index % 5 === 0;
            const hue = HUES[index % HUES.length];
            const metrics = isEnglish ? proj.impactMetrics.en : proj.impactMetrics.es;

            return (
              <Reveal
                key={proj.title}
                delay={(index % 3) * 0.08}
                className={featured ? "md:col-span-2" : ""}
              >
                <TiltCard max={featured ? 6 : 9} className="h-full rounded-[2rem]">
                  <article className="glass glow-border relative h-full rounded-[2rem] p-7 sm:p-9 flex flex-col overflow-hidden">
                    <div
                      aria-hidden
                      className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full blur-3xl opacity-20 group-hover:opacity-45 transition-opacity duration-700 pointer-events-none"
                      style={{ background: hue }}
                    />
                    <div
                      aria-hidden
                      className="absolute top-2 right-6 font-display font-extrabold text-[7rem] sm:text-[9rem] leading-none text-outline opacity-[0.12] group-hover:opacity-30 transition-opacity duration-500 select-none pointer-events-none"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="relative flex items-center gap-2 mb-8" style={{ transform: "translateZ(30px)" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: hue, boxShadow: `0 0 12px ${hue}` }} />
                      <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-muted uppercase">
                        {isEnglish ? proj.badge.en : proj.badge.es}
                      </span>
                    </div>

                    <div className={`relative ${featured ? "md:grid md:grid-cols-5 md:gap-10" : ""} flex-1`}>
                      <div className={featured ? "md:col-span-3" : ""} style={{ transform: "translateZ(45px)" }}>
                        <h3
                          className={`font-display font-extrabold text-ink tracking-tight leading-[0.95] mb-3 ${
                            featured ? "text-4xl sm:text-5xl" : "text-3xl"
                          }`}
                        >
                          {proj.title}
                        </h3>
                        <p className="font-serif-i text-xl text-accent-ink mb-4 leading-snug">
                          {isEnglish ? proj.subtitle.en : proj.subtitle.es}
                        </p>
                        <p className="text-muted leading-relaxed mb-6">
                          {isEnglish ? proj.description.en : proj.description.es}
                        </p>
                      </div>

                      <ul className={`space-y-2.5 mb-8 ${featured ? "md:col-span-2 md:pt-2" : ""}`}>
                        {metrics.map((h, i) => (
                          <li key={i} className="flex gap-3 text-sm text-ink/85">
                            <span className="font-mono text-[10px] text-muted pt-0.5">0{i + 1}</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative pt-6 border-t border-glass-border flex flex-col gap-5" style={{ transform: "translateZ(25px)" }}>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tags.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 font-mono text-[10.5px] rounded-full border border-glass-border text-muted">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost flex-1 h-11 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2 hover:border-accent transition-colors"
                        >
                          <GithubIcon className="w-4 h-4" />
                          GitHub
                        </a>
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn btn-neon flex-1 h-11 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2"
                        >
                          {isEnglish ? "Open" : "Abrir"}
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
