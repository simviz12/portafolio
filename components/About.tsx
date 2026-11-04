"use client";

import dynamic from "next/dynamic";
import { Zap, Target, Layers, MapPin, GraduationCap, Dumbbell, Languages, Crosshair } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import SectionHeading from "@/components/fx/SectionHeading";
import ScrollText from "@/components/fx/ScrollText";
import TiltCard from "@/components/fx/TiltCard";
import { Reveal, Stagger, RevealItem } from "@/components/fx/Reveal";

const RangeGame = dynamic(() => import("@/components/game/RangeGame"), {
  ssr: false,
  loading: () => <div className="glass rounded-[1.8rem] h-[540px] sm:h-[620px] lg:h-[680px] animate-pulse" />,
});

export default function About() {
  const { isEnglish } = usePortfolio();

  const pillars = [
    {
      icon: Layers,
      title: isEnglish ? "Clean Architecture & SOLID" : "Clean Architecture & Principios SOLID",
      tag: isEnglish ? "FOCUS 01" : "ENFOQUE 01",
      desc: isEnglish
        ? "Strict separation of concerns, dependency injection, and decoupled domain logic ensuring testability and high maintainability."
        : "Separación estricta de responsabilidades, inyección de dependencias y código desacoplado que facilita el mantenimiento y pruebas unitarias.",
      hue: "var(--accent)",
    },
    {
      icon: Zap,
      title: isEnglish ? "Full Stack & Immersive Tech" : "Full Stack & Tech Inmersiva",
      tag: isEnglish ? "FOCUS 02" : "ENFOQUE 02",
      desc: isEnglish
        ? "Cross-platform products with React, Express, Django and Spring Boot, plus Unity VR/AR environments designed for fluid, high-precision UX."
        : "Productos multiplataforma con React, Express, Django y Spring Boot, más entornos Unity VR/AR diseñados para una UX fluida y de alta precisión.",
      hue: "var(--accent-2)",
    },
    {
      icon: Target,
      title: isEnglish ? "Fast Learning & Autonomy" : "Aprendizaje Rápido & Autonomía",
      tag: isEnglish ? "FOCUS 03" : "ENFOQUE 03",
      desc: isEnglish
        ? "Demonstrated capacity across 2.5 years of university research and hackathons to adopt new technologies and frameworks in record time."
        : "Capacidad demostrada en 2.5 años de semillero de investigación y hackathons para incorporar nuevas librerías, stacks y paradigmas en tiempo récord.",
      hue: "var(--accent-3)",
    },
  ];

  const quickFacts = [
    { icon: MapPin, label: isEnglish ? "LOCATION" : "UBICACIÓN", val: "Pasto, Nariño, Colombia" },
    {
      icon: GraduationCap,
      label: isEnglish ? "EDUCATION" : "EDUCACIÓN",
      val: isEnglish ? "5th Sem. Software Eng. (UCC Pasto)" : "5° Semestre Ing. de Software (UCC Pasto)",
    },
    {
      icon: Dumbbell,
      label: isEnglish ? "DISCIPLINES" : "DISCIPLINAS",
      val: isEnglish ? "Ex-boxer (National Runner-up), Running & Books" : "Ex-boxeador (Subcampeón Nal.), Trotar & Lectura",
    },
    {
      icon: Languages,
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

  const statement = isEnglish
    ? [
        { t: "I am a 19-year-old" },
        { t: "Product Engineer", hl: true },
        { t: "in my" },
        { t: "5th semester", hl: true },
        { t: "of Software Engineering at Universidad Cooperativa de Colombia (Pasto). I build immersive, scalable digital products with" },
        { t: "Python, JavaScript, TypeScript and Java,", hl: true },
        { t: "and I ship on time with Git Flow." },
      ]
    : [
        { t: "Soy un" },
        { t: "Product Engineer", hl: true },
        { t: "de 19 años, en" },
        { t: "5° semestre", hl: true },
        { t: "de Ingeniería de Software en la Universidad Cooperativa de Colombia (Sede Pasto). Creo experiencias digitales inmersivas y escalables con" },
        { t: "Python, JavaScript, TypeScript y Java,", hl: true },
        { t: "y entrego con rigor de Git Flow." },
      ];

  return (
    <section id="sobre-mi" className="relative w-full px-5 sm:px-8 lg:px-12 py-28 sm:py-40">
      <div className="w-full max-w-7xl mx-auto">
        <SectionHeading
          index="01"
          eyebrow={isEnglish ? "Profile dossier · 19 yrs old" : "Expediente · 19 años"}
          title={isEnglish ? "About me" : "Sobre mí"}
          accent={isEnglish ? "biography" : "biografía"}
          note={isEnglish ? "Sociable · Teamwork · Athletic mindset" : "Sociable · Compañerismo · Alto rendimiento"}
        />

        <ScrollText
          segments={statement}
          className="font-display font-bold text-[clamp(1.7rem,3.6vw,3.4rem)] leading-[1.12] tracking-tight text-ink max-w-6xl"
        />

        <div className="mt-20 sm:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Narrative card — offset for asymmetry */}
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <TiltCard max={5} className="h-full rounded-[2rem]">
              <div className="glass glow-border h-full rounded-[2rem] p-8 sm:p-12 flex flex-col justify-between gap-10">
                <span className="font-mono text-[11px] tracking-[0.3em] text-muted uppercase">
                  Carlos Julián Benavides Burbano
                </span>
                <p className="text-lg sm:text-xl text-ink/85 leading-relaxed">
                  {isEnglish ? (
                    <>
                      Independent product developer since January 2024: Android and React/Express web, Django and Spring Boot
                      backends, SQL performance, and Unity VR environments. University research seedbeds add analytical
                      precision to technical interfaces. Former competitive boxer (
                      <span className="text-accent-ink font-semibold">National Runner-Up</span>) — discipline under pressure,
                      then psychology, spirituality and running off the clock.
                    </>
                  ) : (
                    <>
                      Desarrollador de producto independiente desde enero 2024: apps Android y web con React/Express, backends
                      en Django y Spring Boot, SQL de alto rendimiento y entornos de Realidad Virtual en Unity. Los semilleros
                      de investigación me dan precisión analítica extra para interfaces técnicas. Ex-boxeador competitivo (
                      <span className="text-accent-ink font-semibold">Subcampeón Nacional</span>) — disciplina bajo presión;
                      fuera de código, psicología, espiritualidad y trote.
                    </>
                  )}
                </p>
                <div className="font-serif-i text-4xl sm:text-5xl text-gradient leading-none">
                  {isEnglish ? "discipline → craft" : "disciplina → oficio"}
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* Quick facts */}
          <Stagger className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5" gap={0.07}>
            {quickFacts.map((fact) => (
              <RevealItem key={fact.label}>
                <TiltCard max={12} className="h-full rounded-3xl">
                  <div className="glass h-full rounded-3xl p-6 flex flex-col gap-6">
                    <span className="w-11 h-11 rounded-2xl bg-accent/12 border border-accent/30 flex items-center justify-center shadow-[0_0_24px_-6px_var(--glow)]">
                      <fact.icon className="w-5 h-5 text-accent-ink" />
                    </span>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.25em] text-muted">{fact.label}</div>
                      <div className="mt-1.5 font-display font-bold text-base text-ink leading-snug">{fact.val}</div>
                    </div>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </Stagger>
        </div>

        {/* Pillars */}
        <Stagger className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5" gap={0.1}>
          {pillars.map((p, i) => (
            <RevealItem key={p.tag} className={i === 1 ? "md:translate-y-10" : ""}>
              <TiltCard max={10} className="h-full rounded-[2rem]">
                <div className="glass glow-border h-full rounded-[2rem] p-8 overflow-hidden">
                  <div
                    className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ background: p.hue }}
                  />
                  <div className="flex items-center justify-between mb-14" style={{ transform: "translateZ(30px)" }}>
                    <span
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                      style={{ borderColor: p.hue, boxShadow: `0 0 30px -8px ${p.hue}` }}
                    >
                      <p.icon className="w-5 h-5" style={{ color: p.hue }} />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.25em] text-muted">{p.tag}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink leading-tight mb-3" style={{ transform: "translateZ(40px)" }}>
                    {p.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{p.desc}</p>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </Stagger>

        {/* Tech arsenal */}
        <div className="mt-32">
          <Reveal className="flex items-end justify-between gap-6 mb-8">
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] text-accent-ink uppercase mb-2">
                {isEnglish ? "Live stack" : "Stack activo"}
              </div>
              <h3 className="font-display font-extrabold text-4xl sm:text-5xl text-ink uppercase tracking-tight">
                {isEnglish ? "Tech arsenal" : "Arsenal técnico"}
              </h3>
            </div>
            <div className="hidden sm:block font-mono text-xs text-muted">[{String(techArsenal.length).padStart(2, "0")}]</div>
          </Reveal>
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" gap={0.04}>
            {techArsenal.map((tech, i) => (
              <RevealItem key={tech.name}>
                <div className="group glass glow-border rounded-2xl p-5 h-full transition-transform duration-500 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-muted">{tech.cat}</span>
                    <span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-6 font-display font-bold text-lg text-ink leading-tight group-hover:text-accent-ink transition-colors">
                    {tech.name}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-accent-ink">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--glow)]" />
                    {tech.status}
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>

        {/* Interactive range */}
        <div className="mt-32">
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-accent-ink uppercase">
                <Crosshair className="w-3.5 h-3.5" />
                {isEnglish ? "Interactive simulation · WebGL" : "Simulación interactiva · WebGL"}
              </div>
              <h3 className="mt-3 font-display font-extrabold text-4xl sm:text-5xl text-ink uppercase tracking-tight">
                {isEnglish ? "Decrypt my " : "Desencripta mi "}
                <span className="font-serif-i normal-case font-normal text-gradient">{isEnglish ? "dossier" : "expediente"}</span>
              </h3>
            </div>
            <p className="max-w-sm text-muted">
              {isEnglish
                ? "A tiny shooting range: each core you destroy unlocks a piece of my profile."
                : "Un pequeño campo de tiro: cada núcleo que destruyes desbloquea una parte de mi perfil."}
            </p>
          </Reveal>
          <Reveal>
            <RangeGame />
          </Reveal>
        </div>

      </div>
    </section>
  );
}
