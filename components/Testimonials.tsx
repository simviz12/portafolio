"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { CheckCircle2, Quote } from "lucide-react";

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
    <section id="testimonios" className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center bg-tactical-grid">
      <div className="w-full max-w-5xl flex flex-col items-center text-center gap-2 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] font-valorant-mono text-xs font-semibold">
          <span>{isEnglish ? "PEER REVIEW • TECHNICAL VERIFICATION" : "OPINIONES • EVALUACIONES DE LÍDERES TÉCNICOS"}</span>
        </div>
        <h3 className="font-valorant-title text-4xl sm:text-5xl text-[#ece8e1] tracking-wide uppercase leading-none">
          {isEnglish ? "LEADER & MENTOR REVIEWS" : "OPINIONES Y EVALUACIONES DE LÍDERES"}
        </h3>
        <p className="text-base text-[#8b9bb4] font-valorant-hud max-w-2xl">
          {isEnglish
            ? "Direct feedback from mentors and engineering leaders on code quality, technical execution, and teamwork dynamics."
            : "Valoraciones de mentores y líderes técnicos sobre calidad de código, disciplina y entrega en entornos de alta exigencia."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="group relative p-8 rounded-3xl review-card border hover:border-[#00f5d4] shadow-xl hover:shadow-[0_15px_35px_rgba(0,245,212,0.2)] transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="review-avatar w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-valorant-title text-base tracking-wider">
                      {rev.avatarLetters}
                    </span>
                  </div>

                  <div>
                    <div className="font-valorant-title text-xl text-[#ece8e1] tracking-wide flex items-center gap-2">
                      <span>{rev.author}</span>
                      <CheckCircle2 className="w-4 h-4 text-[#00f5d4]" />
                    </div>
                    <div className="font-valorant-mono text-xs text-[#00f5d4] font-semibold">
                      {rev.role}
                    </div>
                    <div className="font-valorant-hud text-xs text-[#8b9bb4]">
                      {rev.relation}
                    </div>
                  </div>
                </div>

                <Quote className="w-8 h-8 text-[#00f5d4]/40 group-hover:text-[#00f5d4] transition-colors" />
              </div>

              <p className="font-valorant-hud text-base text-[#ece8e1] italic leading-relaxed mb-6">
                &ldquo;{rev.review}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              {rev.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-valorant-mono rounded-full review-tag"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
