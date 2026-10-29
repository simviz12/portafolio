"use client";

import { Award, Trophy, GraduationCap, Sparkles } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Experience() {
  const { isEnglish } = usePortfolio();

  const items = [
    {
      period: isEnglish ? "JAN 2024 • PRESENT" : "ENE 2024 • PRESENTE",
      role: isEnglish ? "INDEPENDENT PRODUCT DEVELOPER" : "DESARROLLADOR DE PRODUCTO INDEPENDIENTE",
      entity: isEnglish ? "SOFTWARE & VR DEVELOPMENT" : "SOFTWARE & DESARROLLO VR",
      badge: isEnglish ? "PRODUCT" : "PRODUCTO",
      color: "border-[#00f5d4] text-[#00f5d4]",
      icon: <Sparkles className="w-5 h-5 text-[#00f5d4]" />,
      desc: isEnglish
        ? "Cross-platform Android and React/Express web apps. Robust backends with Django and Spring Boot. Unity VR environments focused on fluent UX. SQL database design and optimization for high-performance persistence."
        : "Apps Android y web dinámica con React y Express. Backends robustos con Django y Spring Boot. Entornos y juegos de Realidad Virtual en Unity, priorizando fluidez y UX. Diseño y optimización de bases SQL de alto rendimiento.",
    },
    {
      period: isEnglish ? "2024 • PRESENT (5TH SEMESTER)" : "2024 • PRESENTE (5° SEMESTRE)",
      role: isEnglish ? "SOFTWARE ENGINEERING DEGREE" : "INGENIERÍA DE SOFTWARE",
      entity: "UNIVERSIDAD COOPERATIVA DE COLOMBIA (SEDE PASTO)",
      badge: isEnglish ? "UNDERGRADUATE" : "PREGRADO EN CURSO",
      color: "border-[#00f5d4] text-[#00f5d4]",
      icon: <GraduationCap className="w-5 h-5 text-[#00f5d4]" />,
      desc: isEnglish
        ? "Started the degree in 2024 and currently in the 5th semester at 19. Focus on distributed systems and advanced development: Clean Architecture, web & mobile engineering, data structures, design patterns and Git Flow delivery."
        : "Inicié la carrera en 2024 y curso 5° semestre con 19 años. Enfoque en sistemas distribuidos y desarrollo avanzado: Clean Architecture, ingeniería web y móvil, estructuras de datos, patrones de diseño y entrega con Git Flow.",
    },
    {
      period: isEnglish ? "2024 • PRESENT" : "2024 • PRESENTE",
      role: isEnglish ? "JUNIOR RESEARCHER" : "INVESTIGADOR JUNIOR",
      entity: isEnglish ? "UNIVERSITY RESEARCH SEEDBEDS · UCC" : "SEMILLEROS DE INVESTIGACIÓN UNIVERSITARIA · UCC",
      badge: isEnglish ? "RESEARCH SEEDBED" : "SEMILLERO DE INVESTIGACIÓN",
      color: "border-emerald-400 text-emerald-400",
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      desc: isEnglish
        ? "Exploring new development methodologies and prototyping innovative solutions under scientific rigor. Git Flow and GitHub as the delivery standard. Applied AI, full-stack software, and extra analytical precision for technical interfaces."
        : "Exploración de nuevas metodologías de desarrollo y prototipado de soluciones innovadoras bajo rigor científico. Git Flow y GitHub como estándar de entrega. IA aplicada, software full-stack y precisión analítica extra para interfaces técnicas.",
    },
    {
      period: "2024 • 2026",
      role: isEnglish ? "INNOVATION HACKATHONS (3 PARTICIPATIONS)" : "HACKATHONS DE INNOVACIÓN (3 PARTICIPACIONES)",
      entity: isEnglish ? "UNIVERSITY & REGIONAL HACKATHONS" : "HACKATHONS UNIVERSITARIAS Y NACIONALES",
      badge: isEnglish ? "5TH PLACE DISTINCTION" : "5° PUESTO DESTACADO",
      color: "border-teal-300 text-teal-300",
      icon: <Trophy className="w-5 h-5 text-teal-300" />,
      desc: isEnglish
        ? "Participated in three high-intensity hackathons between 2024 and 2026, earning 5th place in one of them. Built and defended working end-to-end software prototypes under pressure within 48 continuous hours."
        : "Participación en tres hackathons de alta exigencia entre 2024 y 2026, logrando el 5° puesto en una de ellas. Creación y sustentación de prototipos funcionales completos bajo presión en menos de 48 horas continuas.",
    },
    {
      period: isEnglish ? "2023 • COMPLETED" : "2023 • CULMINADO",
      role: isEnglish ? "HIGH SCHOOL DIPLOMA" : "BACHILLER ACADÉMICO",
      entity: isEnglish ? "SECONDARY EDUCATION" : "COLEGIO • EDUCACIÓN MEDIA",
      badge: isEnglish ? "GRADUATED 2023" : "GRADUADO 2023",
      color: "border-[#8b9bb4] text-[#8b9bb4]",
      icon: <Award className="w-5 h-5 text-[#8b9bb4]" />,
      desc: isEnglish
        ? "Graduated with comprehensive academic marks in 2023, while sustaining top-tier athletic training as a competitive amateur boxer."
        : "Graduado con formación académica integral en 2023, complementada con disciplina física de alto rendimiento como boxeador competitivo.",
    },
  ];

  return (
    <section id="experiencia" className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center bg-tactical-grid">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col items-center text-center gap-2 mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] font-valorant-mono text-xs font-semibold">
          <span>{isEnglish ? "TIMELINE • PRODUCT, RESEARCH & ACADEMIC PATH" : "HISTORIAL • PRODUCTO, INVESTIGACIÓN Y ACADEMIA"}</span>
        </div>
        <h3 className="font-valorant-title text-4xl sm:text-5xl text-[#ece8e1] tracking-wide uppercase leading-none">
          {isEnglish ? "EXPERIENCE & TRAJECTORY" : "TRAYECTORIA & HISTORIAL"}
        </h3>
        <p className="text-base text-[#8b9bb4] font-valorant-hud max-w-2xl">
          {isEnglish
            ? "Independent product work in software and VR since 2024, plus university research seedbeds, engineering studies and competitive hackathons."
            : "Producto independiente en software y VR desde 2024, más semilleros de investigación, ingeniería de software y hackathons competitivos."}
        </p>
      </div>

      {/* Árbol central alternado */}
      <div className="w-full max-w-4xl relative">
        {/* Línea central vertical continua con resplandor esmeralda */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#00f5d4] via-[#00f5d4]/50 to-emerald-500/20 shadow-[0_0_15px_rgba(0,245,212,0.4)] hidden md:block" />

        <div className="flex flex-col gap-10">
          {items.map((item, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={idx}
                className="relative flex flex-col md:flex-row items-center justify-between w-full"
              >
                {/* Lado Izquierdo */}
                <div className={`w-full md:w-[45%] ${isLeft ? "md:text-right" : "md:order-last md:text-left"}`}>
                  <div className="p-6 rounded-3xl bg-[#0f1923]/95 border border-white/10 hover:border-[#00f5d4] hover:shadow-[0_0_25px_rgba(0,245,212,0.25)] transition-all shadow-xl group">
                    <div className={`flex items-center gap-2 mb-2 ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
                      <span className="font-valorant-mono text-xs font-bold px-3 py-1 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30">
                        {item.period}
                      </span>
                    </div>

                    <h4 className="font-valorant-title text-xl sm:text-2xl text-[#ece8e1] tracking-wide mb-1 group-hover:text-[#00f5d4] transition-colors">
                      {item.role}
                    </h4>

                    <div className="font-valorant-mono text-xs text-[#00f5d4] font-semibold mb-3">
                      {item.entity}
                    </div>

                    <p className="text-sm text-[#8b9bb4] font-valorant-hud leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Círculo central en el árbol */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#090e14] border-2 border-[#00f5d4] items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.6)] z-10">
                  {item.icon}
                </div>

                {/* Espaciador del otro lado */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
