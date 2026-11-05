"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type Variants } from "framer-motion";
import { Download, ArrowDownRight, User, Sparkles } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import Magnetic from "@/components/fx/Magnetic";
import TiltCard from "@/components/fx/TiltCard";
import { fitStyle } from "@/components/fx/fit";

const letter: Variants = {
  hidden: { y: "115%", rotateX: -80, opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    rotateX: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 110, damping: 14, delay: 0.15 + i * 0.035 },
  }),
};

function Letters({ word, offset = 0, className = "" }: { word: string; offset?: number; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden pb-[0.06em] ${className}`} style={{ perspective: 800 }} aria-label={word}>
      {word.split("").map((ch, i) => (
        <motion.span key={i} custom={i + offset} variants={letter} className="inline-block origin-bottom" aria-hidden>
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

const STACK = [
  "TypeScript",
  "Python",
  "Java",
  "React",
  "Next.js",
  "Spring Boot",
  "Django",
  "Express",
  "Unity VR",
  "PostgreSQL",
  "Multi-Agent AI",
  "RAG · MCP",
  "Flutter",
  "Git Flow",
];

export default function Hero({ ready = true }: { ready?: boolean }) {
  const { isEnglish } = usePortfolio();
  const [photoError, setPhotoError] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const titleY = useTransform(p, [0, 1], ["0%", "-35%"]);
  const titleOpacity = useTransform(p, [0, 0.75], [1, 0]);
  const photoY = useTransform(p, [0, 1], ["0%", "-70%"]);
  const photoRotate = useTransform(p, [0, 1], [-4, 8]);
  const outlineX = useTransform(p, [0, 1], ["0%", "18%"]);

  const fade = (delay: number): Variants => ({
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18, delay } },
  });

  return (
    <motion.section
      ref={ref}
      id="inicio"
      initial="hidden"
      animate={ready ? "show" : "hidden"}
      className="relative w-full min-h-[100svh] flex flex-col justify-center px-5 sm:px-8 lg:px-12 pt-28 pb-10 overflow-hidden"
    >
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
        {/* ---------- Copy ---------- */}
        <motion.div className="@container min-w-0 lg:col-span-8 relative z-10" style={{ y: titleY, opacity: titleOpacity }}>
          <motion.div variants={fade(0)} className="flex flex-wrap items-center gap-3 mb-8">
            <span className="glass inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full">
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-70" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--glow)]" />
              </span>
              <span className="font-mono text-[10.5px] sm:text-[11px] tracking-[0.22em] uppercase text-ink">
                {isEnglish ? "Online · 5th semester · UCC Pasto · 19" : "En línea · 5° semestre · UCC Pasto · 19"}
              </span>
            </span>
          </motion.div>

          <motion.p
            variants={fade(0.1)}
            className="font-mono text-[11px] sm:text-xs tracking-[0.3em] text-muted mb-5 uppercase"
          >
            {isEnglish
              ? "Product Engineer · Full Stack & Immersive Technologies"
              : "Product Engineer · Full Stack & Tecnologías Inmersivas"}
          </motion.p>

          <h1
            className="font-display font-extrabold uppercase leading-[0.82] text-ink select-none"
            style={fitStyle("clamp(3rem,11vw,9rem)", "Benavides")}
          >
            <Letters word="Carlos" />
            <br />
            <motion.span style={{ x: outlineX }} className="inline-block pl-[8%] sm:pl-[14%]">
              <Letters word="Julián" offset={6} className="text-outline" />
            </motion.span>
            <br />
            <Letters word="Benavides" offset={12} className="text-gradient text-glow" />
          </h1>

          <motion.p
            variants={fade(0.75)}
            className="mt-8 font-serif-i text-[clamp(1.5rem,2.8vw,2.4rem)] leading-[1.15] text-ink max-w-3xl"
          >
            {isEnglish ? (
              <>
                &ldquo;Software is <span className="text-accent-ink">the vehicle that transforms ideas into reality</span>.&rdquo;
              </>
            ) : (
              <>
                &ldquo;El software es{" "}
                <span className="text-accent-ink">la herramienta para que los sueños se hagan realidad</span>.&rdquo;
              </>
            )}
          </motion.p>

          <motion.p variants={fade(0.85)} className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            {isEnglish ? (
              <>
                Software engineer in formation focused on immersive, scalable digital products. Full stack with{" "}
                <strong className="text-ink font-semibold">Python, JavaScript, TypeScript and Java</strong>, plus Unity / VR
                interfaces. Independent product developer since 2024, junior researcher at UCC Pasto, and former competitive
                boxer (<strong className="text-ink font-semibold">National Runner-up</strong>).
              </>
            ) : (
              <>
                Ingeniero de software en formación, enfocado en experiencias digitales inmersivas y escalables. Full stack con{" "}
                <strong className="text-ink font-semibold">Python, JavaScript, TypeScript y Java</strong>, más interfaces de
                alta precisión en Unity / VR. Desarrollador de producto independiente desde 2024, investigador junior en UCC
                Pasto y ex-boxeador (<strong className="text-ink font-semibold">Subcampeón Nacional</strong>).
              </>
            )}
          </motion.p>

          <motion.div variants={fade(0.95)} className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Magnetic>
              <a
                href="/cv.pdf"
                download="Carlos_Julian_Benavides_CV.pdf"
                className="btn-neon group w-full sm:w-auto h-14 px-8 rounded-full font-display font-bold text-base flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                <span>{isEnglish ? "Download CV" : "Descargar CV"}</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#proyectos"
                className="btn-ghost group w-full sm:w-auto h-14 px-8 rounded-full font-display font-bold text-base flex items-center justify-center gap-3 hover:border-accent transition-colors"
              >
                <span>{isEnglish ? "View work" : "Ver proyectos"}</span>
                <ArrowDownRight className="w-5 h-5 transition-transform duration-500 group-hover:rotate-[-45deg]" />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ---------- Photo, layered in Z over the 3D sculpture ---------- */}
        <motion.div
          className="lg:col-span-4 relative flex justify-center lg:justify-end"
          style={{ y: photoY, rotate: photoRotate }}
        >
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8, rotate: -10, y: 80 },
            show: { opacity: 1, scale: 1, rotate: 0, y: 0, transition: { type: "spring", stiffness: 70, damping: 14, delay: 0.5 } },
          }}
        >
          <TiltCard max={14} cursor={isEnglish ? "Hi!" : "¡Hola!"} className="rounded-[2.2rem]">
            <div className="glass glow-border rounded-[2.2rem] p-3 w-[260px] sm:w-[320px] lg:w-[340px]">
              <div className="relative aspect-[4/5] rounded-[1.7rem] overflow-hidden bg-base-2">
                {!photoError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/img/perfil.webp"
                    width={720}
                    height={1280}
                    fetchPriority="high"
                    decoding="async"
                    alt="Carlos Julián Benavides"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.35] transition-transform duration-700 group-hover:scale-[1.42]"
                    style={{ objectPosition: "center 45%" }}
                    onError={() => setPhotoError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <User className="w-16 h-16 text-accent" />
                    <span className="font-display font-bold text-ink">CARLOS BENAVIDES</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.25em] opacity-70">BASED IN</div>
                    <div className="font-display font-bold text-lg leading-tight">Pasto, CO</div>
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.2em] opacity-80">N 1.21° W 77.28°</div>
                </div>
              </div>
            </div>

            <motion.div
              className="glass absolute -left-3 sm:-left-14 top-10 rounded-2xl px-4 py-3"
              style={{ transform: "translateZ(70px)" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="font-mono text-[9px] tracking-[0.25em] text-muted">UCC PASTO</div>
              <div className="font-display font-extrabold text-2xl text-ink leading-none mt-1">
                19 <span className="text-sm font-bold text-accent-ink">{isEnglish ? "YRS" : "AÑOS"}</span>
              </div>
            </motion.div>

            <motion.div
              className="glass absolute -right-2 sm:-right-8 bottom-24 rounded-2xl px-4 py-3 flex items-center gap-2.5"
              style={{ transform: "translateZ(90px)" }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <span className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-ink" />
              </span>
              <div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-muted">{isEnglish ? "BOXING" : "BOXEO"}</div>
                <div className="font-display font-bold text-sm text-ink">
                  {isEnglish ? "National Runner-up" : "Subcampeón Nacional"}
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </motion.div>
        </motion.div>
      </div>

      {/* ---------- Stack ticker + scroll cue ---------- */}
      <motion.div variants={fade(1.1)} className="relative w-full max-w-7xl mx-auto mt-16 lg:mt-20 flex items-center gap-6">
        <a
          href="#sobre-mi"
          className="hidden sm:flex shrink-0 w-14 h-14 rounded-full btn-ghost items-center justify-center"
          aria-label="Scroll"
          data-cursor="Scroll"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block w-1 h-4 rounded-full bg-accent"
          />
        </a>
        <div className="marquee overflow-hidden flex-1">
          <div className="marquee-track gap-10 py-2">
            {[...STACK, ...STACK].map((s, i) => (
              <span key={i} className="flex items-center gap-10 font-display font-bold text-xl sm:text-2xl text-muted whitespace-nowrap">
                {s}
                <span className="w-1.5 h-1.5 rotate-45 bg-accent" />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
