"use client";

import EmbeddedValorantRange from "@/components/valorant/EmbeddedValorantRange";
import { Zap, Target, Layers, MapPin, GraduationCap, Dumbbell, Languages } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function About() {
  const { isEnglish } = usePortfolio();

  const pillars = [
    {
      icon: <Layers className="w-6 h-6 text-[#00f5d4]" />,
      title: isEnglish ? "Clean Architecture & SOLID" : "Clean Architecture & Principios SOLID",
      tag: isEnglish ? "FOCUS 01" : "ENFOQUE 01",
      desc: isEnglish
        ? "Strict separation of concerns, dependency injection, and decoupled domain logic ensuring testability and high maintainability."
        : "Separación estricta de responsabilidades, inyección de dependencias y código desacoplado que facilita el mantenimiento y pruebas unitarias.",
      accent: "border-[#00f5d4]/40 hover:border-[#00f5d4]",
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: isEnglish ? "Full Stack & Immersive Tech" : "Full Stack & Tech Inmersiva",
      tag: isEnglish ? "FOCUS 02" : "ENFOQUE 02",
      desc: isEnglish
        ? "Cross-platform products with React, Express, Django and Spring Boot, plus Unity VR/AR environments designed for fluid, high-precision UX."
        : "Productos multiplataforma con React, Express, Django y Spring Boot, más entornos Unity VR/AR diseñados para una UX fluida y de alta precisión.",
      accent: "border-emerald-400/40 hover:border-emerald-400",
    },
    {
      icon: <Target className="w-6 h-6 text-teal-300" />,
      title: isEnglish ? "Fast Learning & Autonomy" : "Aprendizaje Rápido & Autonomía",
      tag: isEnglish ? "FOCUS 03" : "ENFOQUE 03",
      desc: isEnglish
        ? "Demonstrated capacity across 2.5 years of university research and hackathons to adopt new technologies and frameworks in record time."
        : "Capacidad demostrada en 2.5 años de semillero de investigación y hackathons para incorporar nuevas librerías, stacks y paradigmas en tiempo récord.",
      accent: "border-teal-300/40 hover:border-teal-300",
    },
  ];

  const quickFacts = [
    {
      icon: <MapPin className="w-5 h-5 text-[#00f5d4]" />,
      label: isEnglish ? "LOCATION" : "UBICACIÓN",
      val: "Pasto, Nariño, Colombia",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-[#00f5d4]" />,
      label: isEnglish ? "EDUCATION" : "EDUCACIÓN",
      val: isEnglish ? "5th Sem. Software Eng. (UCC Pasto)" : "5° Semestre Ing. de Software (UCC Pasto)",
    },
    {
      icon: <Dumbbell className="w-5 h-5 text-[#00f5d4]" />,
      label: isEnglish ? "DISCIPLINES" : "DISCIPLINAS",
      val: isEnglish
        ? "Ex-boxer (National Runner-up), Running & Books"
        : "Ex-boxeador (Subcampeón Nal.), Trotar & Lectura",
    },
    {
      icon: <Languages className="w-5 h-5 text-[#00f5d4]" />,
      label: isEnglish ? "LANGUAGES" : "IDIOMAS",
      val: isEnglish ? "Spanish (Native) · English B1 (Certified)" : "Español (Nativo) · Inglés B1 (Certificado)",
    },
  ];

  const techArsenal = [
    { name: "TypeScript / JavaScript", cat: "LANGUAGE", status: "CORE" },
    { name: "Python", cat: "LANGUAGE", status: "CORE" },
    { name: "Java", cat: "LANGUAGE", status: "ENTERPRISE" },
    { name: "React & Next.js", cat: "FRONTEND", status: "CORE" },
    { name: "Express.js", cat: "NODE / APIS", status: "ACTIVE" },
    { name: "Django", cat: "BACKEND", status: "ACTIVE" },
    { name: "Spring Boot", cat: "BACKEND", status: "ENTERPRISE" },
    { name: "Unity VR / AR", cat: "IMMERSIVE", status: "PRODUCT" },
    { name: "Multi-Agent Systems", cat: "IA / AGENTS", status: "APPLIED" },
    { name: "LLMs · RAG · MCP", cat: "IA / PRODUCT", status: "ACTIVE" },
    { name: "SQL / PostgreSQL", cat: "DATA", status: "CORE" },
    { name: "Git Flow", cat: "DELIVERY", status: "EXPERT" },
  ];

  return (
    <section id="sobre-mi" className="w-full px-4 sm:px-8 lg:px-12 py-20 flex flex-col items-center relative overflow-hidden bg-tactical-grid">
      
      {/* Background Ambience Blobs */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-[#00f5d4]/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-7xl rounded-3xl bg-[#0f1923]/95 border border-[#00f5d4]/30 p-6 sm:p-10 lg:p-14 shadow-2xl relative">
        
        {/* Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <span className="font-valorant-mono text-xs sm:text-sm text-[#00f5d4] tracking-widest uppercase font-bold">
              {isEnglish
                ? "PROFILE DOSSIER • CARLOS JULIÁN BENAVIDES BURBANO • 19 YRS OLD"
                : "EXPEDIENTE • CARLOS JULIÁN BENAVIDES BURBANO • 19 AÑOS"}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/40 text-[#ece8e1] text-xs sm:text-sm font-valorant-mono">
            <span>{isEnglish ? "SOCIABLE • TEAMWORK • ATHLETIC MINDSET" : "SOCIABLE • COMPAÑERISMO • ALTO RENDIMIENTO"}</span>
          </div>
        </div>

        {/* Narrative & Profile */}
        <div className="mb-12">
          <div className="space-y-5 max-w-5xl">
            <h3 className="font-valorant-title text-4xl sm:text-5xl lg:text-6xl text-[#ece8e1] tracking-wide uppercase leading-none">
              {isEnglish ? "ABOUT ME" : "SOBRE MÍ"} <span className="text-[#00f5d4]">·</span> {isEnglish ? "BIOGRAPHY" : "BIOGRAFÍA"}
            </h3>

            <p className="font-valorant-hud text-lg sm:text-xl text-[#ece8e1] leading-relaxed">
              {isEnglish ? (
                <>
                  I am a 19-year-old <span className="text-[#00f5d4] font-bold">Product Engineer</span> in my <span className="text-[#00f5d4] font-bold">5th semester</span> of Software Engineering at Universidad Cooperativa de Colombia (Pasto). I build immersive, scalable digital products with <span className="text-[#00f5d4] font-bold">Python, JavaScript, TypeScript and Java</span>, and I ship on time with Git Flow.
                </>
              ) : (
                <>
                  Soy un <span className="text-[#00f5d4] font-bold">Product Engineer</span> de 19 años, en <span className="text-[#00f5d4] font-bold">5° semestre</span> de Ingeniería de Software en la Universidad Cooperativa de Colombia (Sede Pasto). Creo experiencias digitales inmersivas y escalables con <span className="text-[#00f5d4] font-bold">Python, JavaScript, TypeScript y Java</span>, y entrego con rigor de Git Flow.
                </>
              )}
            </p>

            <p className="font-valorant-hud text-base text-[#8b9bb4] leading-relaxed">
              {isEnglish ? (
                <>
                  Independent product developer since January 2024: Android and React/Express web, Django and Spring Boot backends, SQL performance, and Unity VR environments. University research seedbeds add analytical precision to technical interfaces. Former competitive boxer (<span className="text-[#00f5d4] font-bold">National Runner-Up</span>) — discipline under pressure, then psychology, spirituality and running off the clock.
                </>
              ) : (
                <>
                  Desarrollador de producto independiente desde enero 2024: apps Android y web con React/Express, backends en Django y Spring Boot, SQL de alto rendimiento y entornos de Realidad Virtual en Unity. Los semilleros de investigación me dan precisión analítica extra para interfaces técnicas. Ex-boxeador competitivo (<span className="text-[#00f5d4] font-bold">Subcampeón Nacional</span>) — disciplina bajo presión; fuera de código, psicología, espiritualidad y trote.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickFacts.map((fact, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-4 hover:border-[#00f5d4]/40 transition-all shadow-md"
            >
              <div className="p-3 rounded-xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 shrink-0">
                {fact.icon}
              </div>
              <div>
                <div className="font-valorant-mono text-xs text-[#00f5d4] font-semibold tracking-wider">
                  {fact.label}
                </div>
                <div className="font-valorant-hud text-sm sm:text-base text-[#ece8e1] font-bold mt-0.5">
                  {fact.val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pillars / Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-black/30 border ${p.accent} transition-all shadow-lg flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    {p.icon}
                  </div>
                  <span className="font-valorant-mono text-xs px-2.5 py-1 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30 font-bold">
                    {p.tag}
                  </span>
                </div>
                <h4 className="font-valorant-title text-xl text-[#ece8e1] mb-2">{p.title}</h4>
                <p className="font-valorant-hud text-sm text-[#8b9bb4] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-14">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <span className="font-valorant-mono text-xs text-[#00f5d4] tracking-widest uppercase font-bold">
                {isEnglish ? "LIVE STACK" : "STACK ACTIVO"}
              </span>
              <h4 className="font-valorant-title text-2xl text-[#ece8e1] tracking-wide">
                {isEnglish ? "TECH ARSENAL" : "ARSENAL TÉCNICO"}
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {techArsenal.map((tech) => (
              <div
                key={tech.name}
                className="tech-chip p-3.5 rounded-2xl border hover:border-[#00f5d4] transition-all hover:-translate-y-0.5"
              >
                <div className="tech-cat font-valorant-mono text-[10px] tracking-wider">{tech.cat}</div>
                <div className="tech-name font-valorant-hud text-sm font-bold mt-1">{tech.name}</div>
                <div className="tech-status font-valorant-mono text-[10px] mt-1">{tech.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Valorant Range Interactive Section */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-valorant-mono text-xs text-[#00f5d4] tracking-widest uppercase font-bold">
                {isEnglish ? "INTERACTIVE SIMULATION • THREE.JS WEBGL" : "SIMULACIÓN INTERACTIVA • THREE.JS WEBGL"}
              </span>
              <h4 className="font-valorant-title text-2xl sm:text-3xl text-[#ece8e1] tracking-wide">
                {isEnglish ? "TACTICAL FIELD & INTERACTIVE TARGET RANGE" : "CAMPO TÁCTICO & CAMPO DE TIRO INTERACTIVO"}
              </h4>
            </div>
            <div className="text-xs font-valorant-mono text-[#8b9bb4] bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              WASD: {isEnglish ? "Move" : "Moverse"} &bull; Q/E: {isEnglish ? "Turn 360°" : "Giro 360°"} &bull; Click: {isEnglish ? "Shoot" : "Disparar"}
            </div>
          </div>

          <EmbeddedValorantRange />
        </div>

      </div>
    </section>
  );
}
