"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { BadgeCheck } from "lucide-react";
import SectionHeading from "@/components/fx/SectionHeading";
import TiltCard from "@/components/fx/TiltCard";
import { Reveal } from "@/components/fx/Reveal";

export default function Testimonials() {
  const { isEnglish } = usePortfolio();

  const reviews = [
    {
      author: "Carlos Mendoza",
      role: isEnglish ? "Technical Lead • Distributed Systems" : "Líder Técnico • Sistemas Distribuidos",
      relation: isEnglish ? "Project Mentor & Research Evaluator" : "Mentor de Proyecto y Evaluador de Semillero",
      avatarLetters: "CM",
      review: isEnglish
        ? "Carlos demonstrates extraordinary discipline and architectural rigour. In our research projects, his implementations in Clean Architecture and Spring Boot stood out for their modularity and thorough testing."
        : "Carlos demuestra una disciplina y rigor arquitectónico extraordinario. En los proyectos de investigación, sus implementaciones en Clean Architecture y Spring Boot sobresalieron por su modularidad y cobertura.",
      tags: ["Clean Architecture", "Spring Boot", "Rigor Técnico"],
    },
    {
      author: "Ing. Alejandro Torres",
      role: isEnglish ? "Research Seedbed Coordinator • UCC" : "Coordinador de Semillero UCC",
      relation: isEnglish ? "Academic Supervisor 2024 - 2026" : "Supervisor Académico 2024 - 2026",
      avatarLetters: "AT",
      review: isEnglish
        ? "His background as a competitive athlete reflects in every line of code: resilience under deadline pressure, high stamina during hackathons, and relentless autonomy to master complex stacks like Flutter and ML."
        : "Su formación de atleta competitivo se nota en cada línea de código: templanza bajo presión, gran resistencia en hackathons y una autonomía impresionante para dominar tecnologías como Flutter y ML.",
      tags: ["Machine Learning", "Autonomía", "REDCOLSI"],
    },
  ];

  return (
    <section id="testimonios" className="relative w-full px-5 sm:px-8 lg:px-12 py-28 sm:py-40">
      <div className="w-full max-w-7xl mx-auto">
        <SectionHeading
          index="03"
          eyebrow={isEnglish ? "Peer review · Technical verification" : "Opiniones · Evaluaciones de líderes técnicos"}
          title={isEnglish ? "Mentor" : "Lo que"}
          accent={isEnglish ? "reviews" : "dicen"}
          note={
            isEnglish
              ? "Direct feedback from mentors and engineering leaders on code quality, technical execution, and teamwork dynamics."
              : "Valoraciones de mentores y líderes técnicos sobre calidad de código, disciplina y entrega en entornos de alta exigencia."
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {reviews.map((rev, idx) => (
            <Reveal
              key={rev.author}
              delay={idx * 0.12}
              className={idx === 0 ? "lg:col-span-7" : "lg:col-span-6 lg:col-start-7 lg:-mt-24"}
            >
              <TiltCard max={7} className="rounded-[2.2rem]">
                <figure className="glass glow-border rounded-[2.2rem] p-8 sm:p-12 relative overflow-hidden">
                  <span
                    aria-hidden
                    className="absolute -top-10 left-6 font-serif-i text-[12rem] leading-none text-gradient opacity-40 select-none pointer-events-none"
                  >
                    &ldquo;
                  </span>
                  <blockquote
                    className="relative mt-16 font-serif-i text-2xl sm:text-3xl leading-[1.25] text-ink"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {rev.review}
                  </blockquote>

                  <figcaption className="relative mt-10 pt-6 border-t border-glass-border flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-[#030407] bg-gradient-to-br from-accent to-accent-2 shadow-[0_0_30px_-6px_var(--glow)]">
                        {rev.avatarLetters}
                      </div>
                      <div>
                        <div className="font-display font-bold text-lg text-ink flex items-center gap-1.5">
                          {rev.author}
                          <BadgeCheck className="w-4 h-4 text-accent-ink" />
                        </div>
                        <div className="font-mono text-[11px] text-accent-ink tracking-wide">{rev.role}</div>
                        <div className="text-xs text-muted mt-0.5">{rev.relation}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rev.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 font-mono text-[10.5px] rounded-full border border-glass-border text-muted">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </figcaption>
                </figure>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
