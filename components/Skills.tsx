"use client";

import { Award, Trophy, Code2, Cpu, Database, Sparkles } from "lucide-react";
import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Skills() {
  const { isEnglish } = usePortfolio();
  const [tab, setTab] = useState<"skills" | "langs" | "sports">("skills");

  const skillCategories = [
    {
      category: isEnglish ? "WEB & FRONTEND DEVELOPMENT" : "DESARROLLO WEB & FRONTEND",
      icon: <Code2 className="w-5 h-5 text-[#00f5d4]" />,
      skills: [
        { name: "React", level: isEnglish ? "Advanced" : "Avanzado", focus: isEnglish ? "Modular components, hooks, global state, custom architectures" : "Componentes modulares, hooks, estado global, arquitecturas limpias" },
        { name: "Next.js", level: isEnglish ? "In Production" : "En Producción", focus: isEnglish ? "App Router, SSR, Server Components, performance tuning" : "App Router, SSR, Server Components, optimización de velocidad" },
        { name: "Express.js", level: isEnglish ? "Active" : "Activo", focus: isEnglish ? "Node APIs and dynamic web platforms alongside React" : "APIs Node y plataformas web dinámicas junto a React" },
        { name: "TypeScript / JavaScript", level: isEnglish ? "Core" : "Núcleo", focus: isEnglish ? "Strict typing, ES6+, async architecture, product delivery" : "Tipado estricto, ES6+, asincronía y entrega de producto" },
      ],
    },
    {
      category: isEnglish ? "BACKEND & DATABASES" : "BACKEND & BASES DE DATOS",
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      skills: [
        { name: "Spring Boot & Java", level: isEnglish ? "Enterprise" : "Empresarial", focus: isEnglish ? "Multilayer architecture, dependency injection, RESTful APIs" : "Arquitectura multicapa, inyección de dependencias, APIs RESTful" },
        { name: "Django & Python", level: isEnglish ? "Active" : "Activo", focus: isEnglish ? "Robust server logic, admin workflows and product backends" : "Lógica de servidor robusta, paneles admin y backends de producto" },
        { name: "SQL / PostgreSQL", level: isEnglish ? "Advanced" : "Avanzado", focus: isEnglish ? "Relational modeling, query optimization, high-performance persistence" : "Modelado relacional, optimización de consultas y persistencia de alto rendimiento" },
        { name: "Git Flow", level: isEnglish ? "Expert" : "Experto", focus: isEnglish ? "Collaborative version control, on-time high-quality delivery" : "Control de versiones colaborativo y entrega a tiempo de alta calidad" },
      ],
    },
    {
      category: isEnglish ? "AI, LLMs & MULTI-AGENTS" : "IA, LLMs & MULTI-AGENTES",
      icon: <Sparkles className="w-5 h-5 text-[#00f5d4]" />,
      skills: [
        { name: "Multi-Agent Systems", level: isEnglish ? "Applied" : "Aplicado", focus: isEnglish ? "Agent orchestration, tool-calling loops, specialized roles and coordinated workflows" : "Orquestación de agentes, tool-calling, roles especializados y flujos coordinados" },
        { name: "LLM Applications", level: isEnglish ? "Production-ready" : "Listo para producción", focus: isEnglish ? "OpenAI / Claude / Gemini APIs, structured outputs, function calling and evals" : "APIs de OpenAI, Claude y Gemini, salidas estructuradas, function calling y evaluación" },
        { name: "RAG & Context Engineering", level: isEnglish ? "Active" : "Activo", focus: isEnglish ? "Retrieval-augmented generation, embeddings, vector search and grounded answers" : "Generación aumentada con recuperación, embeddings, búsqueda vectorial y respuestas fundamentadas" },
        { name: "AI-Assisted Engineering", level: isEnglish ? "Daily practice" : "Práctica diaria", focus: isEnglish ? "Agentic coding (Cursor), MCP tools, prompt/context design and automated reviews" : "Coding agéntico (Cursor), herramientas MCP, diseño de prompts/contexto y revisiones automatizadas" },
      ],
    },
    {
      category: isEnglish ? "MOBILE, ML & ENGINEERING" : "MOBILE, ML & INGENIERÍA",
      icon: <Cpu className="w-5 h-5 text-teal-300" />,
      skills: [
        { name: "Unity VR / AR", level: isEnglish ? "Product" : "Producto", focus: isEnglish ? "Immersive environments and games with high-precision, fluent UX" : "Entornos inmersivos y juegos con UX fluida y de alta precisión" },
        { name: "Android / Mobile", level: isEnglish ? "Cross-platform" : "Multiplataforma", focus: isEnglish ? "Native and Flutter apps (The Guardian) plus product interfaces" : "Apps nativas y Flutter (The Guardian) más interfaces de producto" },
        { name: "Python & Machine Learning", level: isEnglish ? "Research" : "Semillero", focus: isEnglish ? "Data processing, model training, intelligent automation scripts" : "Tratamiento de datos, entrenamiento de modelos, scripts de IA" },
        { name: "Clean Architecture", level: isEnglish ? "Core Standard" : "Pilar Clave", focus: isEnglish ? "SOLID principles, modular layers, maintainable technical debt" : "Principios SOLID, separación en capas, código limpio y mantenible" },
      ],
    },
  ];

  return (
    <section id="habilidades" className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col gap-2 mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] font-valorant-mono text-xs self-center sm:self-start font-semibold">
          <span>{isEnglish ? "TECHNICAL TELEMETRY • PRACTICAL MASTERY" : "PARÁMETROS TÉCNICOS • TELEMETRÍA Y DOMINIO PRÁCTICO"}</span>
        </div>
        <h3 className="font-valorant-title text-4xl sm:text-5xl tracking-wide uppercase leading-none">
          {isEnglish ? "SKILLS & COMPETENCIES" : "HABILIDADES & COMPETENCIAS"}
        </h3>
        <p className="text-sm sm:text-base opacity-75 font-valorant-hud max-w-3xl">
          {isEnglish
            ? "Hands-on capabilities across full-stack engineering, applied AI, multi-agent systems, research seedbeds and production code."
            : "Capacidades comprobadas en ingeniería full-stack, IA aplicada, sistemas multi-agente, semillero de investigación y código en producción."}
        </p>
      </div>

      {/* Contenedor principal sin fondos grises: Blanco en claro, oscuro táctico en oscuro */}
      <div className="w-full max-w-7xl rounded-3xl bg-white dark:bg-[#0f1923]/95 border border-slate-200 dark:border-[#00f5d4]/25 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-8 p-1.5 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5">
          <button
            onClick={() => setTab("skills")}
            className={`py-3 text-xs sm:text-sm font-valorant-mono font-bold tracking-wider uppercase transition-all rounded-xl cursor-pointer ${
              tab === "skills" ? "bg-[#00f5d4] text-[#090e14] shadow-[0_0_20px_rgba(0,245,212,0.4)]" : "text-slate-600 dark:text-[#8b9bb4] hover:text-[#00f5d4]"
            }`}
          >
            {isEnglish ? "STACK & SKILLS" : "STACK & HABILIDADES"}
          </button>
          <button
            onClick={() => setTab("langs")}
            className={`py-3 text-xs sm:text-sm font-valorant-mono font-bold tracking-wider uppercase transition-all rounded-xl cursor-pointer ${
              tab === "langs" ? "bg-[#00f5d4] text-[#090e14] shadow-[0_0_20px_rgba(0,245,212,0.4)]" : "text-slate-600 dark:text-[#8b9bb4] hover:text-[#00f5d4]"
            }`}
          >
            {isEnglish ? "LANGUAGES" : "IDIOMAS"}
          </button>
          <button
            onClick={() => setTab("sports")}
            className={`py-3 text-xs sm:text-sm font-valorant-mono font-bold tracking-wider uppercase transition-all rounded-xl cursor-pointer ${
              tab === "sports" ? "bg-[#00f5d4] text-[#090e14] shadow-[0_0_20px_rgba(0,245,212,0.4)]" : "text-slate-600 dark:text-[#8b9bb4] hover:text-[#00f5d4]"
            }`}
          >
            {isEnglish ? "ACHIEVEMENTS" : "DEPORTE & LOGROS"}
          </button>
        </div>

        {/* Content */}
        {tab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {skillCategories.map((group) => (
              <div
                key={group.category}
                className="p-6 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 flex flex-col justify-between hover:border-[#00f5d4]/40 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5 border-b border-slate-200 dark:border-white/10 pb-3">
                    <div className="p-2 rounded-xl bg-[#00f5d4]/10 border border-[#00f5d4]/30">
                      {group.icon}
                    </div>
                    <h4 className="font-valorant-title text-base sm:text-lg text-slate-900 dark:text-[#ece8e1] tracking-wider">
                      {group.category}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {group.skills.map((s) => (
                      <div key={s.name} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-sm font-valorant-mono">
                          <span className="font-bold text-slate-800 dark:text-[#ece8e1]">{s.name}</span>
                          <span className="text-[#00f5d4] text-xs px-2 py-0.5 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/20 font-bold">
                            {s.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-[#8b9bb4] font-valorant-hud">
                          {s.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "langs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-[#00f5d4]/30 shadow-md">
              <div className="font-valorant-title text-2xl text-slate-900 dark:text-[#ece8e1] mb-1">
                {isEnglish ? "SPANISH" : "ESPAÑOL"}
              </div>
              <div className="font-valorant-mono text-xs text-[#00f5d4] mb-3 font-bold">
                {isEnglish ? "NATIVE SPEAKER" : "LENGUA MATERNA"}
              </div>
              <p className="font-valorant-hud text-sm text-slate-600 dark:text-[#8b9bb4]">
                {isEnglish
                  ? "Native proficiency. Precise technical communication, report writing, and leadership across software projects and research seedbeds."
                  : "Dominio nativo. Comunicación técnica clara, sustentación en semilleros, redacción de documentación y liderazgo de equipos."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 hover:border-[#00f5d4]/30 transition-all shadow-md">
              <div className="font-valorant-title text-2xl text-slate-900 dark:text-[#ece8e1] mb-1">
                {isEnglish ? "ENGLISH" : "INGLÉS"}
              </div>
              <div className="font-valorant-mono text-xs text-[#00f5d4] mb-3 font-bold">
                {isEnglish ? "PROFICIENCY: B1 (CERTIFIED)" : "NIVEL: B1 (CERTIFICADO)"}
              </div>
              <p className="font-valorant-hud text-sm text-slate-600 dark:text-[#8b9bb4]">
                {isEnglish
                  ? "Daily technical reading of official documentation, RFCs, GitHub issues, and developer communities. Continuous active speaking practice."
                  : "Lectura técnica fluida de documentación oficial, RFCs, issues en GitHub y comunidades globales. En proceso activo de fortalecimiento comunicativo."}
              </p>
            </div>
          </div>
        )}

        {tab === "sports" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-[#00f5d4]/40 flex flex-col shadow-md overflow-hidden">
              <div className="relative h-56 sm:h-64 bg-slate-100">
                <img
                  src="/img/boxeo.jpg"
                  alt="Subcampeón nacional de boxeo"
                  className="absolute inset-0 w-full h-full object-cover object-[center_18%]"
                />
              </div>
              <div className="p-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-[#00f5d4]" />
                </div>
                <h4 className="font-valorant-title text-xl text-slate-900 dark:text-[#ece8e1] mb-1">
                  {isEnglish ? "NATIONAL BOXING RUNNER-UP" : "SUBCAMPEÓN NACIONAL DE BOXEO"}
                </h4>
                <div className="font-valorant-mono text-xs text-[#00f5d4] mb-3 font-bold">
                  {isEnglish ? "HIGH PERFORMANCE ATHLETE (RETIRED)" : "DEPORTE DE ALTO RENDIMIENTO (RETIRADO)"}
                </div>
                <p className="font-valorant-hud text-sm text-slate-600 dark:text-[#8b9bb4] leading-relaxed">
                  {isEnglish
                    ? "Years of intense physical and mental conditioning in competitive boxing, cultivating absolute self-discipline, resilience under pressure, and strategic composure."
                    : "Años de formación en boxeo competitivo. Aprendizaje profundo sobre perseverancia, enfoque en momentos de máxima presión, respeto y disciplina diaria."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-emerald-400/40 flex flex-col shadow-md overflow-hidden">
              <div className="relative h-56 sm:h-64 bg-slate-100">
                <img
                  src="/img/relconsid.jpeg"
                  alt="Evaluación REDCOLSI"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-valorant-title text-xl text-slate-900 dark:text-[#ece8e1] mb-1">
                  {isEnglish ? "REDCOLSI RESEARCH EVALUATION" : "EVALUADO EN REDCOLSI"}
                </h4>
                <div className="font-valorant-mono text-xs text-emerald-500 mb-3 font-bold">
                  {isEnglish ? "COLOMBIAN SEEDBED NETWORK" : "RED COLOMBIANA DE SEMILLEROS DE INVESTIGACIÓN"}
                </div>
                <p className="font-valorant-hud text-sm text-slate-600 dark:text-[#8b9bb4] leading-relaxed">
                  {isEnglish
                    ? "Evaluated and endorsed by REDCOLSI for scientific rigour and practical technical execution within university software research."
                    : "Participación y evaluación oficial en REDCOLSI sustentando avances científicos y desarrollo aplicado de software en el semillero institucional UCC."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-teal-300/40 flex flex-col shadow-md overflow-hidden">
              <div className="relative h-56 sm:h-64 bg-slate-100">
                <img
                  src="/img/hackathon.jpg"
                  alt="Hackathon quinto puesto"
                  className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
                />
              </div>
              <div className="p-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-teal-300/10 border border-teal-300/30 flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-teal-300" />
                </div>
                <h4 className="font-valorant-title text-xl text-slate-900 dark:text-[#ece8e1] mb-1">
                  {isEnglish ? "5TH PLACE IN HACKATHON" : "5° PUESTO EN HACKATHON"}
                </h4>
                <div className="font-valorant-mono text-xs text-teal-500 mb-3 font-bold">
                  {isEnglish ? "3 TOTAL COMPETITIVE HACKATHONS" : "3 PARTICIPACIONES ENTRE 2024 Y 2026"}
                </div>
                <p className="font-valorant-hud text-sm text-slate-600 dark:text-[#8b9bb4] leading-relaxed">
                  {isEnglish
                    ? "Secured 5th position developing a functional prototype in less than 48 hours. Proven endurance and teamwork solving complex architectural challenges."
                    : "5° lugar diseñando y codificando un prototipo tecnológico funcional en 48 horas continuas. Experiencia comprobada trabajando en equipo contrarreloj."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
