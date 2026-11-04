"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Award, Trophy, GraduationCap, Sparkles, FlaskConical } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import SectionHeading from "@/components/fx/SectionHeading";
import TiltCard from "@/components/fx/TiltCard";
import { fitStyle } from "@/components/fx/fit";

export default function Experience() {
  const { isEnglish } = usePortfolio();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const items = [
    {
      period: isEnglish ? "JAN 2024 • PRESENT" : "ENE 2024 • PRESENTE",
      role: isEnglish ? "Independent Product Developer" : "Desarrollador de Producto Independiente",
      entity: isEnglish ? "SOFTWARE & VR DEVELOPMENT" : "SOFTWARE & DESARROLLO VR",
      badge: isEnglish ? "PRODUCT" : "PRODUCTO",
      icon: Sparkles,
      hue: "var(--accent)",
      desc: isEnglish
        ? "Cross-platform Android and React/Express web apps. Robust backends with Django and Spring Boot. Unity VR environments focused on fluent UX. SQL database design and optimization for high-performance persistence."
        : "Apps Android y web dinámica con React y Express. Backends robustos con Django y Spring Boot. Entornos y juegos de Realidad Virtual en Unity, priorizando fluidez y UX. Diseño y optimización de bases SQL de alto rendimiento.",
    },
    {
      period: isEnglish ? "2024 • PRESENT (5TH SEMESTER)" : "2024 • PRESENTE (5° SEMESTRE)",
      role: isEnglish ? "Software Engineering Degree" : "Ingeniería de Software",
      entity: "UNIVERSIDAD COOPERATIVA DE COLOMBIA (SEDE PASTO)",
      badge: isEnglish ? "UNDERGRADUATE" : "PREGRADO EN CURSO",
      icon: GraduationCap,
      hue: "var(--accent-2)",
      desc: isEnglish
        ? "Started the degree in 2024 and currently in the 5th semester at 19. Focus on distributed systems and advanced development: Clean Architecture, web & mobile engineering, data structures, design patterns and Git Flow delivery."
        : "Inicié la carrera en 2024 y curso 5° semestre con 19 años. Enfoque en sistemas distribuidos y desarrollo avanzado: Clean Architecture, ingeniería web y móvil, estructuras de datos, patrones de diseño y entrega con Git Flow.",
    },
    {
      period: isEnglish ? "2024 • PRESENT" : "2024 • PRESENTE",
      role: isEnglish ? "Junior Researcher" : "Investigador Junior",
      entity: isEnglish ? "UNIVERSITY RESEARCH SEEDBEDS · UCC" : "SEMILLEROS DE INVESTIGACIÓN UNIVERSITARIA · UCC",
      badge: isEnglish ? "RESEARCH SEEDBED" : "SEMILLERO DE INVESTIGACIÓN",
      icon: FlaskConical,
      hue: "var(--accent)",
      desc: isEnglish
        ? "Exploring new development methodologies and prototyping innovative solutions under scientific rigor. Git Flow and GitHub as the delivery standard. Applied AI, full-stack software, and extra analytical precision for technical interfaces."
        : "Exploración de nuevas metodologías de desarrollo y prototipado de soluciones innovadoras bajo rigor científico. Git Flow y GitHub como estándar de entrega. IA aplicada, software full-stack y precisión analítica extra para interfaces técnicas.",
    },
    {
      period: "2024 • 2026",
      role: isEnglish ? "Innovation Hackathons (3)" : "Hackathons de Innovación (3)",
      entity: isEnglish ? "UNIVERSITY & REGIONAL HACKATHONS" : "HACKATHONS UNIVERSITARIAS Y NACIONALES",
      badge: isEnglish ? "5TH PLACE DISTINCTION" : "5° PUESTO DESTACADO",
      icon: Trophy,
      hue: "var(--accent-3)",
      desc: isEnglish
        ? "Participated in three high-intensity hackathons between 2024 and 2026, earning 5th place in one of them. Built and defended working end-to-end software prototypes under pressure within 48 continuous hours."
        : "Participación en tres hackathons de alta exigencia entre 2024 y 2026, logrando el 5° puesto en una de ellas. Creación y sustentación de prototipos funcionales completos bajo presión en menos de 48 horas continuas.",
    },
    {
      period: isEnglish ? "2023 • COMPLETED" : "2023 • CULMINADO",
      role: isEnglish ? "High School Diploma" : "Bachiller Académico",
      entity: isEnglish ? "SECONDARY EDUCATION" : "COLEGIO • EDUCACIÓN MEDIA",
      badge: isEnglish ? "GRADUATED 2023" : "GRADUADO 2023",
      icon: Award,
      hue: "var(--muted)",
      desc: isEnglish
        ? "Graduated with comprehensive academic marks in 2023, while sustaining top-tier athletic training as a competitive amateur boxer."
        : "Graduado con formación académica integral en 2023, complementada con disciplina física de alto rendimiento como boxeador competitivo.",
    },
  ];

  return (
    <section id="experiencia" className="relative w-full px-5 sm:px-8 lg:px-12 py-28 sm:py-40">
      <div className="w-full max-w-7xl mx-auto">
        <SectionHeading
          index="04"
          align="right"
          eyebrow={isEnglish ? "Timeline · Product, research & academic path" : "Historial · Producto, investigación y academia"}
          title={isEnglish ? "Trajectory" : "Trayectoria"}
          accent={isEnglish ? "so far" : "hasta hoy"}
          note={
            isEnglish
              ? "Independent product work in software and VR since 2024, plus university research seedbeds, engineering studies and competitive hackathons."
              : "Producto independiente en software y VR desde 2024, más semilleros de investigación, ingeniería de software y hackathons competitivos."
          }
        />

        <div ref={ref} className="relative max-w-5xl mx-auto">
          {/* Track + scroll-drawn beam */}
          <div className="absolute left-3.5 sm:left-5 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-glass-border" />
          <motion.div
            className="absolute left-3.5 sm:left-5 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 origin-top"
            style={{
              scaleY: line,
              background: "linear-gradient(to bottom, var(--accent), var(--accent-2), var(--accent-3))",
              boxShadow: "0 0 20px var(--glow)",
            }}
          />

          <div className="flex flex-col gap-14 md:gap-20">
            {items.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={item.role} className="relative grid grid-cols-[28px_minmax(0,1fr)] sm:grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 items-start">
                  <motion.div
                    className="absolute left-3.5 sm:left-5 md:left-1/2 top-8 -translate-x-1/2 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full glass-strong flex items-center justify-center"
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-30% 0px" }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    style={{ boxShadow: `0 0 0 4px var(--bg), 0 0 30px -4px ${item.hue}` }}
                  >
                    <item.icon className="w-4.5 h-4.5" style={{ color: item.hue }} />
                  </motion.div>

                  <motion.div
                    className={`col-start-2 ${isLeft ? "md:col-start-1" : "md:col-start-2"}`}
                    initial={{ opacity: 0, x: isLeft ? -80 : 80, rotateY: isLeft ? 20 : -20, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ type: "spring", stiffness: 70, damping: 16 }}
                    style={{ transformPerspective: 1200 }}
                  >
                    <TiltCard max={6} className="rounded-[1.8rem]">
                      <div className={`@container glass glow-border rounded-[1.8rem] p-4 sm:p-9 ${isLeft ? "md:text-right" : ""}`}>
                        <div className={`flex flex-wrap items-center gap-2 mb-5 ${isLeft ? "md:justify-end" : ""}`}>
                          <span className="font-mono text-[10.5px] tracking-[0.2em] text-muted">{item.period}</span>
                          <span className="h-px w-6 bg-glass-border" />
                          <span className="font-mono text-[10px] tracking-[0.2em] px-2.5 py-1 rounded-full border" style={{ color: item.hue, borderColor: item.hue }}>
                            {item.badge}
                          </span>
                        </div>
                        <h3
                          className="font-display font-extrabold text-ink leading-tight tracking-tight"
                          style={fitStyle("clamp(1.25rem,3vw,1.875rem)", item.role, "", 0.82)}
                        >
                          {item.role}
                        </h3>
                        <div className="mt-1.5 font-mono text-[10px] sm:text-[11px] tracking-wide text-accent-ink break-words">{item.entity}</div>
                        <p className="mt-5 text-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </TiltCard>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
