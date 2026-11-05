"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Crosshair,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Trophy,
  Target,
  Timer,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { projects } from "@/data/projects";
import { GithubIcon } from "@/components/Icons";
import RangeScene from "./RangeScene";
import { RangeAudio } from "./rangeAudio";
import { GAME_PALETTES, MAG_SIZE, MAX_HP, type DroneDef, type DroneId, type SceneApi, type Shared } from "./types";

const FULL_HP: Record<DroneId, number> = { about: MAX_HP, skills: MAX_HP, projects: MAX_HP };
const RELOAD_MS = 1100;
const BEST_KEY = "data-range-best";

type Summary = { time: number; acc: number; crits: number; rank: string; best: number; newBest: boolean };

function subscribeCoarse(cb: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function rankFor(time: number, acc: number) {
  if (time < 10 && acc >= 0.75) return "S";
  if (time < 18 && acc >= 0.5) return "A";
  if (time < 30) return "B";
  return "C";
}

/* Live timer that updates its own DOM node (no React re-render per frame). */
function LiveTimer({ startRef, running }: { startRef: React.RefObject<number>; running: boolean }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (el.current) {
        const t = startRef.current ? (performance.now() - startRef.current) / 1000 : 0;
        el.current.textContent = t.toFixed(2);
      }
      if (running) raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [running, startRef]);
  return <span ref={el}>0.00</span>;
}

export default function RangeGame() {
  const { isEnglish, theme } = usePortfolio();
  const palette = GAME_PALETTES[theme];
  const coarse = useSyncExternalStore(subscribeCoarse, () => window.matchMedia("(pointer: coarse)").matches, () => false);

  const container = useRef<HTMLDivElement>(null);
  const crosshair = useRef<HTMLDivElement>(null);
  const api = useRef<SceneApi | null>(null);
  const audio = useRef<RangeAudio | null>(null);
  const shared = useRef<Shared>({ aimX: 0, aimY: 0, keys: {}, turn: 0, paused: true, reloading: 0, kills: 0, hover: null, labels: {} });
  const stats = useRef({ shots: 0, hits: 0, crits: 0, kills: 0 });
  const startedAt = useRef(0);
  const ammoRef = useRef(MAG_SIZE);
  const reloadingRef = useRef(false);
  const active = useRef(false);
  const modalOpenedAt = useRef(0);

  const [started, setStarted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [hp, setHp] = useState<Record<DroneId, number>>(FULL_HP);
  const [ammo, setAmmo] = useState(MAG_SIZE);
  const [reloading, setReloading] = useState(false);
  const [modal, setModal] = useState<DroneId | null>(null);
  const [banner, setBanner] = useState<{ text: string; sub: string; color: string; key: number } | null>(null);
  const [hover, setHover] = useState<DroneId | null>(null);
  const [kick, setKick] = useState(0);
  const [hitmarker, setHitmarker] = useState<{ crit: boolean; key: number } | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pendingSummary, setPendingSummary] = useState<Summary | null>(null);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [kills, setKills] = useState(0);

  const t = useMemo(
    () =>
      isEnglish
        ? {
            title: "Data Range",
            protocol: "Decrypt protocol · WebGL",
            objective: "Shoot the 3 cores to decrypt each dossier",
            deploy: "Deploy",
            kills: "Cores",
            time: "Time",
            acc: "Accuracy",
            ammo: "Energy",
            reload: "Recharging",
            crit: "CRITICAL",
            hit: "HIT",
            decrypted: "decrypted",
            all: "All dossiers decrypted",
            controls: [
              ["Mouse", "Aim"],
              ["Click", "Shoot"],
              ["WASD", "Move"],
              ["Q / E", "Turn"],
              ["R", "Recharge"],
            ],
            touch: [
              ["Tap", "Aim & shoot"],
              ["Pad", "Move & turn"],
            ],
            tipCrit: "Hit the inner core for double damage.",
            close: "Continue",
            verified: "Dossier verified",
            summaryTitle: "Mission complete",
            best: "Best",
            newBest: "New record",
            replay: "Play again",
            rank: "Rank",
          }
        : {
            title: "Data Range",
            protocol: "Protocolo de desencriptado · WebGL",
            objective: "Dispara a los 3 núcleos para desencriptar cada expediente",
            deploy: "Iniciar",
            kills: "Núcleos",
            time: "Tiempo",
            acc: "Precisión",
            ammo: "Energía",
            reload: "Recargando",
            crit: "CRÍTICO",
            hit: "IMPACTO",
            decrypted: "desencriptado",
            all: "Todos los expedientes desencriptados",
            controls: [
              ["Mouse", "Apuntar"],
              ["Click", "Disparar"],
              ["WASD", "Moverse"],
              ["Q / E", "Girar"],
              ["R", "Recargar"],
            ],
            touch: [
              ["Toca", "Apuntar y disparar"],
              ["Pad", "Moverse y girar"],
            ],
            tipCrit: "Acierta al núcleo interior para hacer doble daño.",
            close: "Continuar",
            verified: "Expediente verificado",
            summaryTitle: "Misión completada",
            best: "Récord",
            newBest: "Nuevo récord",
            replay: "Jugar de nuevo",
            rank: "Rango",
          },
    [isEnglish],
  );

  const drones: DroneDef[] = useMemo(
    () => [
      { id: "about", tag: isEnglish ? "PROFILE" : "PERFIL", name: "Carlos Benavides" },
      { id: "skills", tag: "STACK", name: isEnglish ? "Tech arsenal" : "Arsenal técnico" },
      { id: "projects", tag: isEnglish ? "OPS" : "OPERACIONES", name: isEnglish ? "Projects" : "Proyectos" },
    ],
    [isEnglish],
  );

  /* ---------- lifecycle ---------- */
  useEffect(() => {
    audio.current = new RangeAudio();
    return () => audio.current?.dispose();
  }, []);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    shared.current.paused = !started || modal !== null || summary !== null;
  }, [started, modal, summary]);

  /* Freeze the decorative background scene while a round is played: two live WebGL loops halve the frame budget. */
  useEffect(() => {
    const busy = visible && started;
    window.dispatchEvent(new CustomEvent("bg3d:pause", { detail: busy }));
    return () => {
      if (busy) window.dispatchEvent(new CustomEvent("bg3d:pause", { detail: false }));
    };
  }, [visible, started]);

  /* ---------- actions ---------- */
  const startReload = useCallback(() => {
    if (reloadingRef.current || ammoRef.current === MAG_SIZE) return;
    reloadingRef.current = true;
    setReloading(true);
    audio.current?.reload();
    const t0 = performance.now();
    const step = () => {
      const p = Math.min(1, (performance.now() - t0) / RELOAD_MS);
      shared.current.reloading = p;
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        shared.current.reloading = 0;
        reloadingRef.current = false;
        ammoRef.current = MAG_SIZE;
        setAmmo(MAG_SIZE);
        setReloading(false);
      }
    };
    requestAnimationFrame(step);
  }, []);

  const finishRun = useCallback((): Summary => {
    const time = (performance.now() - startedAt.current) / 1000;
    const acc = stats.current.shots ? stats.current.hits / stats.current.shots : 0;
    const prev = Number(window.localStorage.getItem(BEST_KEY) || 0);
    const newBest = !prev || time < prev;
    if (newBest) window.localStorage.setItem(BEST_KEY, String(time));
    return { time, acc, crits: stats.current.crits, rank: rankFor(time, acc), best: newBest ? time : prev, newBest };
  }, []);

  const fire = useCallback(() => {
    if (shared.current.paused || !api.current) return;
    if (reloadingRef.current) {
      audio.current?.empty();
      return;
    }
    if (ammoRef.current <= 0) {
      audio.current?.empty();
      startReload();
      return;
    }
    if (!startedAt.current) {
      startedAt.current = performance.now();
      setTimerRunning(true);
    }
    ammoRef.current -= 1;
    setAmmo(ammoRef.current);
    stats.current.shots += 1;
    audio.current?.shot();
    setKick((k) => k + 1);

    const res = api.current.fire();
    if (res) {
      stats.current.hits += 1;
      if (res.crit) {
        stats.current.crits += 1;
        audio.current?.crit();
      } else {
        audio.current?.hit();
      }
      setHitmarker({ crit: res.crit, key: performance.now() });
      setHp((h) => ({ ...h, [res.id]: res.hp }));

      if (res.killed) {
        stats.current.kills += 1;
        const k = stats.current.kills;
        shared.current.kills = k;
        setKills(k);
        audio.current?.kill(k);
        const def = drones.find((d) => d.id === res.id)!;
        setBanner({
          text: k === 3 ? t.all : `${def.name} · ${t.decrypted}`,
          sub: `${String(k).padStart(2, "0")} / 03`,
          color: palette.drones[res.id],
          key: performance.now(),
        });
        if (k === 3) {
          setTimerRunning(false);
          setPendingSummary(finishRun());
        }
        window.setTimeout(() => {
          modalOpenedAt.current = performance.now();
          setTimerRunning(false);
          setModal(res.id);
        }, 700);
      }
    }
    if (ammoRef.current === 0) window.setTimeout(startReload, 180);
  }, [drones, finishRun, palette, startReload, t]);

  const closeModal = useCallback(() => {
    audio.current?.ui();
    setModal(null);
    // Reading a dossier does not count against the clock.
    if (stats.current.kills < 3 && startedAt.current) {
      startedAt.current += performance.now() - modalOpenedAt.current;
      setTimerRunning(true);
    }
    if (pendingSummary) {
      setSummary(pendingSummary);
      setPendingSummary(null);
      audio.current?.victory();
    }
  }, [pendingSummary]);

  const reset = useCallback(() => {
    audio.current?.ui();
    stats.current = { shots: 0, hits: 0, crits: 0, kills: 0 };
    shared.current.kills = 0;
    startedAt.current = 0;
    ammoRef.current = MAG_SIZE;
    reloadingRef.current = false;
    shared.current.reloading = 0;
    setKills(0);
    setAmmo(MAG_SIZE);
    setReloading(false);
    setHp(FULL_HP);
    setModal(null);
    setSummary(null);
    setPendingSummary(null);
    setBanner(null);
    setTimerRunning(false);
    setResetKey((k) => k + 1);
  }, []);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const MOVE = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const down = (e: KeyboardEvent) => {
      if (!active.current || !started) return;
      if (MOVE.includes(e.code)) {
        e.preventDefault();
        shared.current.keys[e.code] = true;
      } else if (e.code === "KeyR") {
        e.preventDefault();
        startReload();
      } else if (e.code === "Escape" && modal) {
        closeModal();
      } else if (e.code === "KeyM") {
        setMuted((m) => !m);
      }
    };
    const up = (e: KeyboardEvent) => {
      shared.current.keys[e.code] = false;
    };
    const clear = () => {
      shared.current.keys = {};
      shared.current.turn = 0;
    };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [closeModal, modal, startReload, started]);

  useEffect(() => {
    audio.current?.setMuted(muted);
  }, [muted]);

  /* ---------- pointer ---------- */
  const aimAt = (clientX: number, clientY: number) => {
    const el = container.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    shared.current.aimX = (x / r.width) * 2 - 1;
    shared.current.aimY = -((y / r.height) * 2 - 1);
    if (crosshair.current) crosshair.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onUi = (e: React.PointerEvent) => Boolean((e.target as HTMLElement).closest("[data-game-ui]"));

  /* ---------- modal content (real portfolio data) ---------- */
  const dossier = (id: DroneId) => {
    if (id === "about") {
      const facts = isEnglish
        ? [
            ["Education", "5th sem. Software Engineering", "UCC Pasto · 19 yrs"],
            ["Research", "Junior researcher", "UCC seedbeds · REDCOLSI"],
            ["Product", "Independent since 2024", "Web · Mobile · Unity VR"],
            ["Discipline", "National boxing runner-up", "Retired · running daily"],
          ]
        : [
            ["Educación", "5° sem. Ing. de Software", "UCC Pasto · 19 años"],
            ["Investigación", "Investigador junior", "Semilleros UCC · REDCOLSI"],
            ["Producto", "Independiente desde 2024", "Web · Mobile · Unity VR"],
            ["Disciplina", "Subcampeón nacional de boxeo", "Retirado · trote diario"],
          ];
      return {
        title: isEnglish ? "Professional profile" : "Perfil profesional",
        body: (
          <div className="space-y-5">
            <p className="font-serif-i text-lg sm:text-2xl leading-snug text-ink">
              {isEnglish
                ? "19-year-old Product Engineer building immersive, scalable products with Python, TypeScript and Java — with the discipline of a former competitive boxer."
                : "Product Engineer de 19 años que construye productos inmersivos y escalables con Python, TypeScript y Java — con la disciplina de un ex-boxeador competitivo."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facts.map(([k, v, s]) => (
                <div key={k} className="rounded-2xl border border-glass-border p-4">
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent-ink">{k}</div>
                  <div className="mt-1 font-display font-bold text-ink">{v}</div>
                  <div className="text-xs text-muted">{s}</div>
                </div>
              ))}
            </div>
          </div>
        ),
        link: { href: "#sobre-mi", label: isEnglish ? "Full bio" : "Biografía completa" },
      };
    }
    if (id === "skills") {
      const groups = [
        { k: "Frontend", items: ["React", "Next.js", "TypeScript", "Express.js"] },
        { k: "Backend & Data", items: ["Spring Boot · Java", "Django · Python", "PostgreSQL", "Git Flow"] },
        { k: isEnglish ? "AI & Agents" : "IA & Agentes", items: ["Multi-Agent Systems", "LLM Apps", "RAG", "MCP"] },
        { k: isEnglish ? "Immersive & Mobile" : "Inmersivo & Mobile", items: ["Unity VR / AR", "Flutter", "Android", "ML"] },
      ];
      return {
        title: isEnglish ? "Tech arsenal" : "Arsenal técnico",
        body: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groups.map((g) => (
              <div key={g.k} className="rounded-2xl border border-glass-border p-4">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent-ink mb-3">{g.k}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium text-ink border border-glass-border">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ),
        link: { href: "#habilidades", label: isEnglish ? "All skills" : "Todas las habilidades" },
      };
    }
    return {
      title: isEnglish ? "Featured operations" : "Operaciones destacadas",
      body: (
        <div className="space-y-2.5">
          {projects.slice(0, 4).map((p) => (
            <a
              key={p.title}
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-glass-border p-4 hover:border-accent transition-colors"
            >
              <div className="min-w-0">
                <div className="font-display font-bold text-ink truncate">{p.title}</div>
                <div className="text-xs text-muted truncate">{isEnglish ? p.subtitle.en : p.subtitle.es}</div>
                <div className="mt-1.5 font-mono text-[10px] tracking-wide text-accent-ink truncate">{p.tags.slice(0, 4).join(" · ")}</div>
              </div>
              <GithubIcon className="w-5 h-5 shrink-0 text-muted group-hover:text-accent-ink transition-colors" />
            </a>
          ))}
        </div>
      ),
      link: { href: "#proyectos", label: isEnglish ? `All ${projects.length} projects` : `Los ${projects.length} proyectos` },
    };
  };

  const current = modal ? dossier(modal) : null;
  const hoverColor = hover ? palette.drones[hover] : null;
  const showCrosshair = started && !modal && !summary && !coarse;

  const padDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { code, turn } = e.currentTarget.dataset;
    if (code) shared.current.keys[code] = true;
    shared.current.turn = Number(turn || 0);
  };
  const padUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const { code } = e.currentTarget.dataset;
    if (code) shared.current.keys[code] = false;
    shared.current.turn = 0;
  };
  const pad = { onPointerDown: padDown, onPointerUp: padUp, onPointerLeave: padUp };

  return (
    <div
      ref={container}
      data-game-viewport
      className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] rounded-[1.8rem] overflow-hidden select-none border border-glass-border touch-none"
      style={{ boxShadow: palette.dark ? "0 0 0 1px rgba(0,245,212,0.15), 0 40px 120px -40px rgba(0,245,212,0.35)" : "var(--shadow-card)" }}
      onPointerEnter={() => (active.current = true)}
      onPointerLeave={() => {
        active.current = false;
        shared.current.keys = {};
        shared.current.turn = 0;
      }}
      onPointerMove={(e) => {
        if (!onUi(e)) aimAt(e.clientX, e.clientY);
      }}
      onPointerDown={(e) => {
        active.current = true;
        if (onUi(e) || e.button !== 0) return;
        aimAt(e.clientX, e.clientY);
        fire();
      }}
    >
      {/* 3D */}
      <Canvas
        key={resetKey}
        shadows="percentage"
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ fov: 68, near: 0.05, far: 200, position: [0, 1.62, 4.2] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <RangeScene palette={palette} shared={shared} apiRef={api} drones={drones} onHover={setHover} />
      </Canvas>

      {/* Drone labels (positioned by the render loop) */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {drones.map((def, i) => {
          const color = palette.drones[def.id];
          return (
            <div
              key={def.id}
              ref={(el) => {
                shared.current.labels[def.id] = el;
              }}
              className="absolute left-0 top-0 origin-bottom transition-opacity duration-300"
              style={{ opacity: 0, willChange: "transform" }}
            >
              <div className="glass-strong rounded-xl px-3 py-2 whitespace-nowrap text-center" style={{ borderColor: color }}>
                <div className="font-mono text-[10px] tracking-[0.25em]" style={{ color }}>
                  {def.tag} · 0{i + 1}
                </div>
                <div className="font-display font-bold text-sm text-ink leading-tight">{def.name}</div>
                <div className="mt-1.5 flex justify-center gap-1">
                  {Array.from({ length: MAX_HP }, (_, k) => (
                    <span
                      key={k}
                      className="h-1.5 w-5 rounded-full transition-all duration-300"
                      style={{
                        background: k < hp[def.id] ? color : "var(--faint)",
                        boxShadow: k < hp[def.id] ? `0 0 8px ${color}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crosshair */}
      {showCrosshair && (
        <div ref={crosshair} className="pointer-events-none absolute left-0 top-0 z-30" style={{ transform: "translate3d(-100px,-100px,0)" }}>
          <motion.div
            key={kick}
            className="relative -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 1.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            style={{ color: hoverColor ?? "var(--accent)" }}
          >
            <motion.div
              className="w-10 h-10 rounded-full border-2 border-current"
              animate={{ scale: hover ? 0.75 : 1, opacity: hover ? 1 : 0.5, rotate: hover ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{ boxShadow: hover ? `0 0 18px ${hoverColor}` : "none" }}
            />
            <span className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
            {[0, 90, 180, 270].map((r) => (
              <span
                key={r}
                className="absolute left-1/2 top-1/2 w-[2px] h-2.5 bg-current rounded-full"
                style={{ transform: `translate(-50%,-50%) rotate(${r}deg) translateY(-${hover ? 12 : 16}px)`, transition: "transform .2s" }}
              />
            ))}
            <AnimatePresence>
              {hitmarker && (
                <motion.div
                  key={hitmarker.key}
                  className="absolute left-1/2 top-1/2"
                  initial={{ opacity: 1, scale: 0.6 }}
                  animate={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.35 }}
                  onAnimationComplete={() => setHitmarker(null)}
                >
                  {[45, 135, 225, 315].map((r) => (
                    <span
                      key={r}
                      className="absolute w-[2.5px] h-3 rounded-full"
                      style={{
                        background: hitmarker.crit ? "var(--accent-3)" : palette.dark ? "#fff" : "#0a0c11",
                        transform: `translate(-50%,-50%) rotate(${r}deg) translateY(-14px)`,
                      }}
                    />
                  ))}
                  {hitmarker.crit && (
                    <span className="absolute left-4 -top-8 font-mono text-[10px] font-bold tracking-widest text-accent-3">{t.crit}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Top HUD */}
      <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-20 flex items-start justify-between gap-3 pointer-events-none">
        <div className="glass-strong rounded-2xl px-4 py-2.5 max-w-[60%]">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-accent-ink">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-accent" />
            </span>
            <span className="truncate">{t.protocol}</span>
          </div>
          <div className="hidden sm:block mt-1 font-display font-bold text-sm text-ink leading-tight">{t.objective}</div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto" data-game-ui>
          <div className="glass-strong rounded-2xl px-3 sm:px-4 py-2 flex items-center gap-3 sm:gap-5">
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted">{t.kills}</div>
              <div className="font-display font-extrabold text-lg leading-none text-ink tabular-nums">
                {kills}
                <span className="text-muted text-sm">/3</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted">{t.time}</div>
              <div className="font-display font-extrabold text-lg leading-none text-ink tabular-nums">
                <LiveTimer startRef={startedAt} running={timerRunning} />s
              </div>
            </div>
          </div>
          <button
            onClick={() => setMuted((m) => !m)}
            className="glass-strong w-10 h-10 rounded-full flex items-center justify-center text-ink hover:text-accent-ink transition-colors"
            title={muted ? "Unmute (M)" : "Mute (M)"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={reset}
            className="glass-strong w-10 h-10 rounded-full flex items-center justify-center text-ink hover:text-accent-ink transition-colors"
            title={isEnglish ? "Restart" : "Reiniciar"}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 z-20 flex items-end justify-between gap-3 pointer-events-none">
        {coarse ? (
          <div className="grid grid-cols-3 gap-1.5 pointer-events-auto" data-game-ui>
            <span />
            <button {...pad} data-code="KeyW" className="glass-strong w-12 h-12 rounded-xl flex items-center justify-center text-ink" aria-label="Forward">
              <ChevronUp className="w-5 h-5" />
            </button>
            <span />
            <button {...pad} data-turn="1" className="glass-strong w-12 h-12 rounded-xl flex items-center justify-center text-ink" aria-label="Turn left">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button {...pad} data-code="KeyS" className="glass-strong w-12 h-12 rounded-xl flex items-center justify-center text-ink" aria-label="Back">
              <ChevronDown className="w-5 h-5" />
            </button>
            <button {...pad} data-turn="-1" className="glass-strong w-12 h-12 rounded-xl flex items-center justify-center text-ink" aria-label="Turn right">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="glass-strong rounded-2xl px-4 py-3 hidden md:flex items-center gap-4">
            {t.controls.map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md border border-glass-border font-mono text-[10px] text-ink">{k}</kbd>
                <span className="text-[11px] text-muted">{v}</span>
              </div>
            ))}
          </div>
        )}

        <div className="glass-strong rounded-2xl px-4 py-2.5 min-w-[150px] ml-auto">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted">{reloading ? t.reload : t.ammo}</span>
            <span className="font-display font-extrabold text-2xl leading-none text-ink tabular-nums">
              {ammo}
              <span className="text-sm text-muted">/{MAG_SIZE}</span>
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-faint overflow-hidden">
            {reloading ? (
              <motion.div
                key="reload"
                className="h-full rounded-full bg-accent-2"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: RELOAD_MS / 1000, ease: "linear" }}
              />
            ) : (
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))", boxShadow: "0 0 10px var(--glow)" }}
                animate={{ width: `${(ammo / MAG_SIZE) * 100}%` }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </div>
          {coarse && (
            <button
              data-game-ui
              onClick={startReload}
              className="pointer-events-auto mt-2 w-full rounded-lg border border-glass-border py-1 font-mono text-[10px] tracking-widest text-ink"
            >
              R · {t.reload.toUpperCase()}
            </button>
          )}
        </div>
      </div>

      {/* Kill banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            key={banner.key}
            className="absolute left-1/2 top-[22%] z-30 -translate-x-1/2 pointer-events-none text-center"
            initial={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            onAnimationComplete={() => window.setTimeout(() => setBanner((b) => (b?.key === banner.key ? null : b)), 1200)}
          >
            <div className="font-mono text-[11px] tracking-[0.35em]" style={{ color: banner.color }}>
              {banner.sub}
            </div>
            <div
              className="mt-1 font-display font-extrabold uppercase text-2xl sm:text-4xl text-ink whitespace-nowrap"
              style={{ textShadow: palette.dark ? `0 0 30px ${banner.color}` : "none" }}
            >
              {banner.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start screen */}
      <AnimatePresence>
        {!started && (
          <motion.div
            data-game-ui
            className="absolute inset-0 z-40 flex items-center justify-center p-5"
            style={{ background: "color-mix(in oklab, var(--bg) 55%, transparent)", backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
            transition={{ duration: 0.45 }}
          >
            <motion.div
              className="glass rounded-[2rem] p-7 sm:p-10 max-w-lg w-full text-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center shadow-[0_0_30px_-6px_var(--glow)]">
                <Crosshair className="w-6 h-6 text-accent-ink" />
              </div>
              <h4 className="mt-5 font-display font-extrabold uppercase text-4xl sm:text-5xl text-ink tracking-tight">{t.title}</h4>
              <p className="mt-2 text-muted">{t.objective}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(coarse ? t.touch : t.controls).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-glass-border px-3 py-1.5 text-xs">
                    <kbd className="font-mono font-bold text-ink">{k}</kbd>
                    <span className="text-muted">{v}</span>
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">{t.tipCrit}</p>
              <button
                onClick={() => {
                  audio.current?.ui();
                  setStarted(true);
                }}
                className="btn-neon mt-7 h-14 px-10 rounded-full font-display font-bold text-lg inline-flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                {t.deploy}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dossier modal */}
      <AnimatePresence>
        {current && modal && (
          <motion.div
            data-game-ui
            className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            style={{ background: "color-mix(in oklab, var(--bg) 45%, transparent)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              className="glass-strong relative w-full max-w-2xl max-h-full overflow-y-auto overflow-x-hidden rounded-[2rem] p-5 sm:p-9"
              style={{ boxShadow: `0 0 0 1px ${palette.drones[modal]}, 0 30px 80px -20px ${palette.drones[modal]}66` }}
              initial={{ y: 60, scale: 0.92, rotateX: 18, opacity: 0 }}
              animate={{ y: 0, scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ y: 40, scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: palette.drones[modal] }}>
                    {drones.find((d) => d.id === modal)?.tag} · {t.decrypted}
                  </div>
                  <h4 className="mt-1 font-display font-extrabold text-2xl sm:text-4xl text-ink tracking-tight break-words">{current.title}</h4>
                </div>
                <button
                  onClick={closeModal}
                  className="shrink-0 w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-ink hover:text-accent-ink hover:border-accent transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {current.body}
              <div className="mt-7 pt-5 border-t border-glass-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <a
                  href={current.link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-ink hover:underline underline-offset-4"
                >
                  {current.link.label}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button onClick={closeModal} className="btn-neon h-12 px-7 rounded-full font-display font-bold">
                  {t.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission summary */}
      <AnimatePresence>
        {summary && (
          <motion.div
            data-game-ui
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "color-mix(in oklab, var(--bg) 50%, transparent)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-[2rem] p-7 sm:p-10 w-full max-w-lg text-center"
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
            >
              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-accent-ink">{t.summaryTitle}</div>
              <motion.div
                className="mt-3 font-display font-extrabold text-8xl leading-none text-gradient"
                initial={{ scale: 2.5, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              >
                {summary.rank}
              </motion.div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted">{t.rank}</div>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[
                  { icon: Timer, k: t.time, v: `${summary.time.toFixed(2)}s` },
                  { icon: Target, k: t.acc, v: `${Math.round(summary.acc * 100)}%` },
                  { icon: Trophy, k: t.best, v: `${summary.best.toFixed(2)}s` },
                ].map((s) => (
                  <div key={s.k} className="rounded-2xl border border-glass-border p-3">
                    <s.icon className="w-4 h-4 mx-auto text-accent-ink" />
                    <div className="mt-1.5 font-display font-extrabold text-base sm:text-xl text-ink tabular-nums">{s.v}</div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted">{s.k}</div>
                  </div>
                ))}
              </div>
              {summary.newBest && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase text-accent-ink">
                  <Trophy className="w-3 h-3" /> {t.newBest}
                </div>
              )}
              <div className="mt-7">
                <button onClick={reset} className="btn-neon h-14 px-9 rounded-full font-display font-bold text-lg inline-flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  {t.replay}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
