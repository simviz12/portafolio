"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatDuration, type Project, type ProjectVideo } from "@/data/projects";
import { GithubIcon } from "@/components/Icons";

type VideoProject = Project & { video: ProjectVideo };

const noopSubscribe = () => () => {};

/**
 * Full-screen viewer for projects that have a recorded walkthrough:
 * the video, a clickable chapter list and the project details.
 */
export default function ProjectViewer({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: VideoProject[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  // Portals need `document`, so render nothing on the server.
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {index !== null && items[index] && (
        <Dialog key="project-viewer" items={items} index={index} onClose={onClose} onNavigate={onNavigate} />
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Dialog({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: VideoProject[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const { isEnglish } = usePortfolio();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const project = items[index];
  const many = items.length > 1;

  // Lock page scroll, trap focus, close on Escape, and hand focus back on close.
  useEffect(() => {
    const root = document.documentElement;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - root.clientWidth;
    const prevOverflow = root.style.overflow;
    const prevPadding = root.style.paddingRight;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, a[href], video[controls]");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPadding;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const go = (step: number) => onNavigate((index + step + items.length) % items.length);

  return (
    <motion.div
      // data-lenis-prevent: the smooth-scroll library must not move the page under the dialog.
      data-lenis-prevent
      className="fixed inset-0 z-[150] overflow-y-auto overscroll-contain backdrop-blur-md"
      style={{ background: "color-mix(in oklab, var(--bg) 78%, transparent)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-10"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-viewer-title"
          className="relative w-full max-w-6xl rounded-[1.5rem] sm:rounded-[2rem] border border-glass-border p-4 sm:p-6 lg:p-8"
          style={{
            background: "color-mix(in oklab, var(--bg) 94%, transparent)",
            boxShadow: "var(--shadow-card), 0 0 80px -30px var(--glow)",
          }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        >
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
            <div className="min-w-0 flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-muted">
              <span className="w-2 h-2 shrink-0 rounded-full bg-accent shadow-[0_0_12px_var(--glow)]" />
              <span className="truncate">{isEnglish ? project.badge.en : project.badge.es}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {many && (
                <>
                  <span className="hidden sm:inline font-mono text-[11px] text-muted mr-1.5 tabular-nums">
                    {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                  <IconButton label={isEnglish ? "Previous project" : "Proyecto anterior"} onClick={() => go(-1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </IconButton>
                  <IconButton label={isEnglish ? "Next project" : "Proyecto siguiente"} onClick={() => go(1)}>
                    <ChevronRight className="w-4 h-4" />
                  </IconButton>
                </>
              )}
              <IconButton ref={closeRef} label={isEnglish ? "Close" : "Cerrar"} onClick={onClose}>
                <X className="w-4 h-4" />
              </IconButton>
            </div>
          </div>

          {/* Keyed so the player and its chapter state reset when switching project. */}
          <Stage key={project.slug} project={project} isEnglish={isEnglish} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function IconButton({
  label,
  onClick,
  children,
  ref,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="btn-ghost w-10 h-10 rounded-full flex items-center justify-center hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
    >
      {children}
    </button>
  );
}

function Stage({ project, isEnglish }: { project: VideoProject; isEnglish: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const { video } = project;
  const chapters = video.chapters;

  let active = 0;
  for (let i = 0; i < chapters.length; i++) if (time >= chapters[i].t) active = i;

  const seek = (t: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = t;
    setTime(t);
    el.play().catch(() => {});
  };

  const metrics = isEnglish ? project.impactMetrics.en : project.impactMetrics.es;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17.5rem] gap-x-7 gap-y-4 lg:gap-y-6">
      {/* DOM order is video, chapters, details so phones get the chapters right under the player. */}
      <div className="min-w-0">
        <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black ring-1 ring-glass-border">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
            src={video.src}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          >
            {isEnglish ? "Your browser cannot play this video." : "Tu navegador no puede reproducir este video."}
          </video>
        </div>
      </div>

      <nav aria-label={isEnglish ? "Video chapters" : "Capítulos del video"} className="min-w-0 lg:row-span-2">
        <div className="hidden lg:flex items-baseline justify-between mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
          <span>{isEnglish ? "Chapters" : "Capítulos"}</span>
          <span className="tabular-nums tracking-normal">{formatDuration(video.duration)}</span>
        </div>
        <ol className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1">
          {chapters.map((c, i) => {
            const isActive = i === active;
            const end = chapters[i + 1]?.t ?? video.duration;
            const fill = isActive ? Math.min(1, Math.max(0, (time - c.t) / (end - c.t))) : 0;
            return (
              <li key={c.t} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => seek(c.t)}
                  className={`relative w-full overflow-hidden text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isActive ? "border-accent text-ink" : "border-glass-border text-muted hover:text-ink hover:border-accent/60"
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-full origin-left bg-accent/15"
                    style={{ transform: `scaleX(${fill})` }}
                  />
                  <span className="relative font-mono text-[10.5px] tabular-nums text-accent-ink">{formatDuration(c.t)}</span>
                  <span className="relative text-sm whitespace-nowrap lg:whitespace-normal leading-snug">
                    {isEnglish ? c.label.en : c.label.es}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {isEnglish && (
          <p className="hidden lg:block mt-3 text-xs text-muted">The on-screen text of this walkthrough is in Spanish.</p>
        )}
      </nav>

      <div className="min-w-0">
        <h2
          id="project-viewer-title"
          className="font-display font-extrabold text-ink tracking-tight leading-[0.95] text-3xl sm:text-4xl"
        >
          {project.title}
        </h2>
        <p className="mt-2 font-serif-i text-xl text-accent-ink leading-snug">
          {isEnglish ? project.subtitle.en : project.subtitle.es}
        </p>
        <p className="mt-4 text-muted leading-relaxed max-w-3xl">
          {isEnglish ? project.description.en : project.description.es}
        </p>

        <ul className="mt-5 space-y-2.5">
          {metrics.map((m, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink/85">
              <span className="font-mono text-[10px] text-muted pt-0.5">0{i + 1}</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-5 border-t border-glass-border flex flex-wrap items-center gap-x-4 gap-y-4 justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tech) => (
              <span key={tech} className="px-2.5 py-1 font-mono text-[10.5px] rounded-full border border-glass-border text-muted">
                {tech}
              </span>
            ))}
          </div>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost h-11 px-5 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2 hover:border-accent transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            {isEnglish ? "View code" : "Ver código"}
          </a>
        </div>
      </div>
    </div>
  );
}
