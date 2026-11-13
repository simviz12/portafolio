"use client";

import { useCallback, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { projects, formatDuration, type Project, type ProjectVideo } from "@/data/projects";
import { ArrowUpRight, Play } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import SectionHeading from "@/components/fx/SectionHeading";
import TiltCard from "@/components/fx/TiltCard";
import { Reveal } from "@/components/fx/Reveal";
import ProjectViewer from "@/components/ProjectViewer";

const HUES = ["var(--accent)", "var(--accent-2)", "var(--accent-3)"];

type VideoProject = Project & { video: ProjectVideo };

const videoProjects = projects.filter((p): p is VideoProject => Boolean(p.video));
const otherProjects = projects.filter((p) => !p.video);

export default function Projects() {
  const { isEnglish } = usePortfolio();
  const [viewing, setViewing] = useState<number | null>(null);
  const closeViewer = useCallback(() => setViewing(null), []);

  return (
    <section id="proyectos" className="relative w-full px-5 sm:px-8 lg:px-12 py-28 sm:py-40">
      <div className="w-full max-w-7xl mx-auto">
        <SectionHeading
          index="02"
          align="right"
          eyebrow={isEnglish ? "Operations · Research · Hackathons" : "Operaciones · Semillero · Hackathons"}
          title={isEnglish ? "Featured" : "Proyectos"}
          accent={isEnglish ? "projects" : "destacados"}
          note={
            isEnglish
              ? "Built with research methodologies, Clean Architecture, artificial intelligence, and cross-platform paradigms (Mobile, Desktop, and Web)."
              : "Desarrollados con metodologías de investigación, Clean Architecture, inteligencia artificial y arquitecturas multiplataforma (Mobile, Desktop y Web)."
          }
        />

        <GroupLabel
          title={isEnglish ? "Video walkthroughs" : "Recorridos en video"}
          hint={isEnglish ? "Select a project to watch it" : "Elige un proyecto para verlo"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {videoProjects.map((proj, index) => (
            <Reveal
              key={proj.slug}
              delay={(index % 3) * 0.08}
              className={index === 0 && videoProjects.length % 2 === 1 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <VideoCard
                project={proj}
                hue={HUES[index % HUES.length]}
                isEnglish={isEnglish}
                onOpen={() => setViewing(index)}
              />
            </Reveal>
          ))}
        </div>

        <GroupLabel title={isEnglish ? "More projects" : "Más proyectos"} className="mt-16 sm:mt-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {otherProjects.map((proj, index) => {
            // First and last cards are wide, so four cards fill two rows of three columns.
            const featured = index % 3 === 0;
            return (
              <Reveal key={proj.slug} delay={(index % 3) * 0.08} className={featured ? "md:col-span-2" : ""}>
                <ProjectCard
                  project={proj}
                  number={videoProjects.length + index + 1}
                  featured={featured}
                  hue={HUES[index % HUES.length]}
                  isEnglish={isEnglish}
                />
              </Reveal>
            );
          })}
        </div>
      </div>

      <ProjectViewer items={videoProjects} index={viewing} onClose={closeViewer} onNavigate={setViewing} />
    </section>
  );
}

function GroupLabel({ title, hint, className = "" }: { title: string; hint?: string; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 font-mono text-[11px] tracking-[0.25em] uppercase ${className}`}>
      <span className="text-ink">{title}</span>
      <span className="h-px flex-1 min-w-8 bg-gradient-to-r from-glass-border to-transparent" />
      {hint && <span className="text-muted tracking-[0.18em]">{hint}</span>}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tech) => (
        <span key={tech} className="px-2.5 py-1 font-mono text-[10.5px] rounded-full border border-glass-border text-muted">
          {tech}
        </span>
      ))}
    </div>
  );
}

function VideoCard({
  project,
  hue,
  isEnglish,
  onOpen,
}: {
  project: VideoProject;
  hue: string;
  isEnglish: boolean;
  onOpen: () => void;
}) {
  const { video } = project;
  const watch = isEnglish ? "Watch walkthrough" : "Ver recorrido";

  return (
    <TiltCard max={5} className="h-full rounded-[2rem]">
      {/* The whole card opens the viewer; the two buttons inside rely on that same click bubbling up. */}
      <article
        onClick={onOpen}
        className="glass glow-border relative h-full rounded-[2rem] flex flex-col overflow-hidden cursor-pointer"
      >
        <button
          type="button"
          aria-label={`${watch}: ${project.title}`}
          data-cursor="Play"
          className="group/media relative block w-full aspect-video overflow-hidden bg-black focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.poster}
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span
            aria-hidden
            className="btn-neon absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          >
            <Play className="w-6 h-6 translate-x-0.5" fill="currentColor" />
          </span>
          <span className="absolute left-4 bottom-3.5 right-4 flex items-center justify-between font-mono text-[10.5px] tracking-[0.18em] uppercase text-white">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: hue, boxShadow: `0 0 10px ${hue}` }} />
              Video · {formatDuration(video.duration)}
            </span>
            <span className="text-white/75">
              {video.chapters.length} {isEnglish ? "chapters" : "capítulos"}
            </span>
          </span>
        </button>

        <div className="relative flex flex-col flex-1 p-7 sm:p-8">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-muted uppercase mb-4">
            {isEnglish ? project.badge.en : project.badge.es}
          </span>
          <h3 className="font-display font-extrabold text-ink tracking-tight leading-[0.95] text-3xl mb-3">{project.title}</h3>
          <p className="font-serif-i text-xl text-accent-ink mb-4 leading-snug">
            {isEnglish ? project.subtitle.en : project.subtitle.es}
          </p>
          <p className="text-muted leading-relaxed mb-7">{isEnglish ? project.description.en : project.description.es}</p>

          <div className="mt-auto pt-6 border-t border-glass-border flex flex-col gap-5">
            <Tags tags={project.tags} />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-neon flex-1 h-11 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" fill="currentColor" />
                {watch}
              </button>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-ghost h-11 px-5 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2 hover:border-accent transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

function ProjectCard({
  project,
  number,
  featured,
  hue,
  isEnglish,
}: {
  project: Project;
  number: number;
  featured: boolean;
  hue: string;
  isEnglish: boolean;
}) {
  const metrics = isEnglish ? project.impactMetrics.en : project.impactMetrics.es;
  // Most projects have no live demo yet: avoid two buttons that open the same page.
  const hasDemo = project.demoUrl !== project.githubUrl;

  return (
    <TiltCard max={featured ? 6 : 9} className="h-full rounded-[2rem]">
      <article className="glass glow-border relative h-full rounded-[2rem] p-7 sm:p-9 flex flex-col overflow-hidden">
        <div
          aria-hidden
          className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full blur-3xl opacity-20 group-hover:opacity-45 transition-opacity duration-700 pointer-events-none"
          style={{ background: hue }}
        />
        <div
          aria-hidden
          className="absolute top-2 right-6 font-display font-extrabold text-[7rem] sm:text-[9rem] leading-none text-outline opacity-[0.12] group-hover:opacity-30 transition-opacity duration-500 select-none pointer-events-none"
          style={{ transform: "translateZ(20px)" }}
        >
          {String(number).padStart(2, "0")}
        </div>

        <div className="relative flex items-center gap-2 mb-8" style={{ transform: "translateZ(30px)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: hue, boxShadow: `0 0 12px ${hue}` }} />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-muted uppercase">
            {isEnglish ? project.badge.en : project.badge.es}
          </span>
        </div>

        <div className={`relative ${featured ? "md:grid md:grid-cols-5 md:gap-10" : ""} flex-1`}>
          <div className={featured ? "md:col-span-3" : ""} style={{ transform: "translateZ(45px)" }}>
            <h3
              className={`font-display font-extrabold text-ink tracking-tight leading-[0.95] mb-3 ${
                featured ? "text-4xl sm:text-5xl" : "text-3xl"
              }`}
            >
              {project.title}
            </h3>
            <p className="font-serif-i text-xl text-accent-ink mb-4 leading-snug">
              {isEnglish ? project.subtitle.en : project.subtitle.es}
            </p>
            <p className="text-muted leading-relaxed mb-6">{isEnglish ? project.description.en : project.description.es}</p>
          </div>

          <ul className={`space-y-2.5 mb-8 ${featured ? "md:col-span-2 md:pt-2" : ""}`}>
            {metrics.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/85">
                <span className="font-mono text-[10px] text-muted pt-0.5">0{i + 1}</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative pt-6 border-t border-glass-border flex flex-col gap-5" style={{ transform: "translateZ(25px)" }}>
          <Tags tags={project.tags} />
          <div className="flex items-center gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex-1 h-11 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2 hover:border-accent transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              {hasDemo ? "GitHub" : isEnglish ? "View code on GitHub" : "Ver código en GitHub"}
              {!hasDemo && <ArrowUpRight className="w-4 h-4" />}
            </a>
            {hasDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn btn-neon flex-1 h-11 rounded-full font-mono text-xs font-bold flex items-center justify-center gap-2"
              >
                {isEnglish ? "Open" : "Abrir"}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
