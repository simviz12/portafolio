"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Trophy, Code2, Cpu, Database, Sparkles } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import SectionHeading from "@/components/fx/SectionHeading";
import TiltCard from "@/components/fx/TiltCard";

type Tab = "skills" | "langs" | "sports";

const panel = {
  initial: { opacity: 0, y: 40, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, filter: "blur(10px)" },
  transition: { type: "spring", stiffness: 120, damping: 20 },
} as const;

const item = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 110, damping: 16 } },
} as const;

export default function Skills() {
  const { isEnglish } = usePortfolio();
  const [tab, setTab] = useState<Tab>("skills");

  const skillCategories = [
    {
      category: isEnglish ? "Web & Frontend" : "Web & Frontend",
      icon: Code2,
      hue: "var(--accent)",
      skills: [
        { name: "React", level: isEnglish ? "Advanced" : "Avanzado", focus: isEnglish ? "Modular components, hooks, global state, custom architectures" : "Componentes modulares, hooks, estado global, arquitecturas limpias" },
        { name: "Next.js", level: isEnglish ? "In Production" : "En Producción", focus: isEnglish ? "App Router, SSR, Server Components, performance tuning" : "App Router, SSR, Server Components, optimización de velocidad" },
        { name: "Express.js", level: isEnglish ? "Active" : "Activo", focus: isEnglish ? "Node APIs and dynamic web platforms alongside React" : "APIs Node y plataformas web dinámicas junto a React" },
        { name: "TypeScript / JavaScript", level: isEnglish ? "Core" : "Núcleo", focus: isEnglish ? "Strict typing, ES6+, async architecture, product delivery" : "Tipado estricto, ES6+, asincronía y entrega de producto" },
      ],
    },
    {
      category: isEnglish ? "Backend & Databases" : "Backend & Bases de datos",
      icon: Database,
      hue: "var(--accent-2)",
      skills: [
        { name: "Spring Boot & Java", level: isEnglish ? "Enterprise" : "Empresarial", focus: isEnglish ? "Multilayer architecture, dependency injection, RESTful APIs" : "Arquitectura multicapa, inyección de dependencias, APIs RESTful" },
        { name: "Django & Python", level: isEnglish ? "Active" : "Activo", focus: isEnglish ? "Robust server logic, admin workflows and product backends" : "Lógica de servidor robusta, paneles admin y backends de producto" },
        { name: "SQL / PostgreSQL", level: isEnglish ? "Advanced" : "Avanzado", focus: isEnglish ? "Relational modeling, query optimization, high-performance persistence" : "Modelado relacional, optimización de consultas y persistencia de alto rendimiento" },
        { name: "Git Flow", level: isEnglish ? "Expert" : "Experto", focus: isEnglish ? "Collaborative version control, on-time high-quality delivery" : "Control de versiones colaborativo y entrega a tiempo de alta calidad" },
      ],
    },
    {
      category: isEnglish ? "AI, LLMs & Multi-Agents" : "IA, LLMs & Multi-Agentes",
      icon: Sparkles,
      hue: "var(--accent-3)",
      skills: [
        { name: "Multi-Agent Systems", level: isEnglish ? "Applied" : "Aplicado", focus: isEnglish ? "Agent orchestration, tool-calling loops, specialized roles and coordinated workflows" : "Orquestación de agentes, tool-calling, roles especializados y flujos coordinados" },
        { name: "LLM Applications", level: isEnglish ? "Production-ready" : "Listo para producción", focus: isEnglish ? "OpenAI / Claude / Gemini APIs, structured outputs, function calling and evals" : "APIs de OpenAI, Claude y Gemini, salidas estructuradas, function calling y evaluación" },
        { name: "RAG & Context Engineering", level: isEnglish ? "Active" : "Activo", focus: isEnglish ? "Retrieval-augmented generation, embeddings, vector search and grounded answers" : "Generación aumentada con recuperación, embeddings, búsqueda vectorial y respuestas fundamentadas" },
        { name: "AI-Assisted Engineering", level: isEnglish ? "Daily practice" : "Práctica diaria", focus: isEnglish ? "Agentic coding (Cursor), MCP tools, prompt/context design and automated reviews" : "Coding agéntico (Cursor), herramientas MCP, diseño de prompts/contexto y revisiones automatizadas" },
      ],
    },
    {
      category: isEnglish ? "Mobile, ML & Engineering" : "Mobile, ML & Ingeniería",
      icon: Cpu,
      hue: "var(--accent)",
      skills: [
        { name: "Unity VR / AR", level: isEnglish ? "Product" : "Producto", focus: isEnglish ? "Immersive environments and games with high-precision, fluent UX" : "Entornos inmersivos y juegos con UX fluida y de alta precisión" },
        { name: "Android / Mobile", level: isEnglish ? "Cross-platform" : "Multiplataforma", focus: isEnglish ? "Native and Flutter apps (The Guardian) plus product interfaces" : "Apps nativas y Flutter (The Guardian) más interfaces de producto" },
        { name: "Python & Machine Learning", level: isEnglish ? "Research" : "Semillero", focus: isEnglish ? "Data processing, model training, intelligent automation scripts" : "Tratamiento de datos, entrenamiento de modelos, scripts de IA" },
        { name: "Clean Architecture", level: isEnglish ? "Core Standard" : "Pilar Clave", focus: isEnglish ? "SOLID principles, modular layers, maintainable technical debt" : "Principios SOLID, separación en capas, código limpio y mantenible" },
      ],
    },
  ];

  const achievements = [
    {
      img: "/img/boxeo.jpg",
      pos: "center 18%",
      alt: "Subcampeón nacional de boxeo",
      icon: Trophy,
      hue: "var(--accent)",
      title: isEnglish ? "National Boxing Runner-up" : "Subcampeón Nacional de Boxeo",
      sub: isEnglish ? "HIGH PERFORMANCE ATHLETE (RETIRED)" : "DEPORTE DE ALTO RENDIMIENTO (RETIRADO)",
      desc: isEnglish
        ? "Years of intense physical and mental conditioning in competitive boxing, cultivating absolute self-discipline, resilience under pressure, and strategic composure."
        : "Años de formación en boxeo competitivo. Aprendizaje profundo sobre perseverancia, enfoque en momentos de máxima presión, respeto y disciplina diaria.",
    },
    {
      img: "/img/relconsid.jpeg",
      pos: "center",
      alt: "Evaluación REDCOLSI",
      icon: Award,
      hue: "var(--accent-2)",
      title: isEnglish ? "REDCOLSI Research Evaluation" : "Evaluado en REDCOLSI",
      sub: isEnglish ? "COLOMBIAN SEEDBED NETWORK" : "RED COLOMBIANA DE SEMILLEROS DE INVESTIGACIÓN",
      desc: isEnglish
        ? "Evaluated and endorsed by REDCOLSI for scientific rigour and practical technical execution within university software research."
        : "Participación y evaluación oficial en REDCOLSI sustentando avances científicos y desarrollo aplicado de software en el semillero institucional UCC.",
    },
    {
      img: "/img/hackathon.jpg",
      pos: "center 35%",
      alt: "Hackathon quinto puesto",
      icon: Trophy,
      hue: "var(--accent-3)",
      title: isEnglish ? "5th Place in Hackathon" : "5° Puesto en Hackathon",
      sub: isEnglish ? "3 TOTAL COMPETITIVE HACKATHONS" : "3 PARTICIPACIONES ENTRE 2024 Y 2026",
      desc: isEnglish
        ? "Secured 5th position developing a functional prototype in less than 48 hours. Proven endurance and teamwork solving complex architectural challenges."
        : "5° lugar diseñando y codificando un prototipo tecnológico funcional en 48 horas continuas. Experiencia comprobada trabajando en equipo contrarreloj.",
    },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "skills", label: isEnglish ? "Stack & Skills" : "Stack & Habilidades" },
    { id: "langs", label: isEnglish ? "Languages" : "Idiomas" },
    { id: "sports", label: isEnglish ? "Achievements" : "Deporte & Logros" },
  ];

  return (
    <section id="habilidades" className="relative w-full px-5 sm:px-8 lg:px-12 py-28 sm:py-40">
      <div className="w-full max-w-7xl mx-auto">
        <SectionHeading
          index="05"
          eyebrow={isEnglish ? "Technical telemetry · Practical mastery" : "Telemetría técnica · Dominio práctico"}
          title={isEnglish ? "Skills &" : "Skills &"}
          accent={isEnglish ? "competencies" : "competencias"}
          note={
            isEnglish
              ? "Hands-on capabilities across full-stack engineering, applied AI, multi-agent systems, research seedbeds and production code."
              : "Capacidades comprobadas en ingeniería full-stack, IA aplicada, sistemas multi-agente, semillero de investigación y código en producción."
          }
        />

        {/* Segmented control with a spring-shared pill */}
        <div className="glass-strong inline-flex flex-wrap gap-1 p-1.5 rounded-full mb-12">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-5 sm:px-7 py-3 rounded-full font-mono text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase transition-colors ${
                tab === t.id ? "text-[#030407]" : "text-muted hover:text-ink"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="skills-tab"
                  className="absolute inset-0 rounded-full bg-accent shadow-[0_0_30px_var(--glow)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "skills" && (
            <motion.div key="skills" {...panel}>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              >
                {skillCategories.map((group, gi) => (
                  <motion.div key={group.category} variants={item} style={{ transformPerspective: 1000 }}>
                    <TiltCard max={6} className="h-full rounded-[2rem]">
                      <div className="glass glow-border h-full rounded-[2rem] p-7 sm:p-9">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                              style={{ borderColor: group.hue, boxShadow: `0 0 26px -8px ${group.hue}` }}
                            >
                              <group.icon className="w-5 h-5" style={{ color: group.hue }} />
                            </span>
                            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-ink tracking-tight">
                              {group.category}
                            </h3>
                          </div>
                          <span className="font-mono text-[10px] text-muted">0{gi + 1}</span>
                        </div>
                        <ul className="divide-y divide-[var(--glass-border)]">
                          {group.skills.map((s) => (
                            <li key={s.name} className="py-4 first:pt-0 last:pb-0 group/skill">
                              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                                <span className="font-display font-bold text-ink group-hover/skill:translate-x-1 transition-transform duration-300">
                                  {s.name}
                                </span>
                                <span className="shrink-0 font-mono text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border border-glass-border text-accent-ink">
                                  {s.level}
                                </span>
                              </div>
                              <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.focus}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {tab === "langs" && (
            <motion.div key="langs" {...panel} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  name: isEnglish ? "Spanish" : "Español",
                  level: isEnglish ? "NATIVE SPEAKER" : "LENGUA MATERNA",
                  pct: 100,
                  code: "ES",
                  desc: isEnglish
                    ? "Native proficiency. Precise technical communication, report writing, and leadership across software projects and research seedbeds."
                    : "Dominio nativo. Comunicación técnica clara, sustentación en semilleros, redacción de documentación y liderazgo de equipos.",
                },
                {
                  name: isEnglish ? "English" : "Inglés",
                  level: isEnglish ? "PROFICIENCY: B1 (CERTIFIED)" : "NIVEL: B1 (CERTIFICADO)",
                  pct: 55,
                  code: "EN",
                  desc: isEnglish
                    ? "Daily technical reading of official documentation, RFCs, GitHub issues, and developer communities. Continuous active speaking practice."
                    : "Lectura técnica fluida de documentación oficial, RFCs, issues en GitHub y comunidades globales. En proceso activo de fortalecimiento comunicativo.",
                },
              ].map((l) => (
                <TiltCard key={l.code} max={8} className="rounded-[2rem]">
                  <div className="glass glow-border rounded-[2rem] p-8 sm:p-10 overflow-hidden">
                    <div className="absolute right-6 top-2 font-display font-extrabold text-[8rem] leading-none text-outline opacity-15 select-none">
                      {l.code}
                    </div>
                    <h3 className="relative font-display font-extrabold text-4xl text-ink">{l.name}</h3>
                    <div className="relative mt-2 font-mono text-[11px] tracking-[0.2em] text-accent-ink">{l.level}</div>
                    <div className="relative mt-8 h-1.5 rounded-full bg-faint overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))", boxShadow: "0 0 16px var(--glow)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${l.pct}%` }}
                        transition={{ type: "spring", stiffness: 40, damping: 14, delay: 0.2 }}
                      />
                    </div>
                    <p className="relative mt-8 text-muted leading-relaxed">{l.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </motion.div>
          )}

          {tab === "sports" && (
            <motion.div
              key="sports"
              {...panel}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {achievements.map((a, i) => (
                <TiltCard key={a.title} max={9} className={`rounded-[2rem] ${i === 1 ? "md:mt-12" : ""}`}>
                  <div className="glass glow-border h-full rounded-[2rem] p-3 flex flex-col overflow-hidden">
                    <div className="relative h-64 sm:h-72 rounded-[1.5rem] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.img}
                        alt={a.alt}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                        style={{ objectPosition: a.pos }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                      <span
                        className="absolute bottom-4 left-4 w-11 h-11 rounded-2xl glass-strong flex items-center justify-center"
                        style={{ transform: "translateZ(50px)" }}
                      >
                        <a.icon className="w-5 h-5" style={{ color: a.hue }} />
                      </span>
                    </div>
                    <div className="p-5 sm:p-6 flex-1">
                      <div className="font-mono text-[10px] tracking-[0.2em] mb-2" style={{ color: a.hue }}>
                        {a.sub}
                      </div>
                      <h3 className="font-display font-extrabold text-2xl text-ink leading-tight mb-3">{a.title}</h3>
                      <p className="text-sm text-muted leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
