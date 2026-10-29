"use client";

import { useState } from "react";
import { Download, ArrowDownRight, User } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Hero() {
  const { isEnglish } = usePortfolio();
  const [photoOk, setPhotoOk] = useState(false);

  return (
    <section
      id="inicio"
      className="w-full min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 relative overflow-hidden bg-tactical-grid pt-24 sm:pt-28 pb-16"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[550px] bg-gradient-to-r from-[#00f5d4]/18 via-[#00f5d4]/5 to-emerald-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#00f5d4]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16222f]/90 border border-[#00f5d4]/40 text-[#ece8e1] shadow-[0_0_20px_rgba(0,245,212,0.15)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
            <span className="font-valorant-mono text-[11px] sm:text-xs tracking-widest uppercase text-[#00f5d4] font-bold">
              {isEnglish
                ? "ONLINE · 5TH SEMESTER · UCC PASTO · 19"
                : "EN LÍNEA · 5° SEMESTRE · UCC PASTO · 19"}
            </span>
          </div>

          <p className="font-valorant-mono text-xs tracking-[0.28em] text-[#8b9bb4] mb-3 uppercase">
            {isEnglish
              ? "Product Engineer · Full Stack & Immersive Technologies"
              : "Product Engineer · Full Stack & Tecnologías Inmersivas"}
          </p>

          <h1 className="font-valorant-title text-5xl sm:text-7xl md:text-8xl lg:text-[86px] xl:text-[96px] tracking-wider text-[#ece8e1] uppercase leading-[0.9] mb-5 select-none">
            CARLOS JULIÁN
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-[#2dd4bf] to-[#0d9488]">
              BENAVIDES
            </span>
          </h1>

          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 flex-wrap">
            <span className="font-valorant-title text-xl sm:text-2xl lg:text-3xl text-[#00f5d4] tracking-wide drop-shadow-[0_0_15px_rgba(0,245,212,0.4)]">
              FULL STACK
            </span>
            <span className="text-[#00f5d4]/40 text-2xl font-light">/</span>
            <span className="font-valorant-title text-xl sm:text-2xl lg:text-3xl text-emerald-400 tracking-wide">
              UNITY VR
            </span>
          </div>

          <p className="text-lg sm:text-2xl text-[#ece8e1] mb-5 italic font-valorant-hud leading-relaxed">
            {isEnglish ? (
              <>
                &ldquo;Software is{" "}
                <span className="text-[#00f5d4] font-bold underline decoration-[#00f5d4]/50 underline-offset-8">
                  the vehicle that transforms ideas into reality
                </span>
                .&rdquo;
              </>
            ) : (
              <>
                &ldquo;El software es{" "}
                <span className="text-[#00f5d4] font-bold underline decoration-[#00f5d4]/50 underline-offset-8">
                  la herramienta para que los sueños se hagan realidad
                </span>
                .&rdquo;
              </>
            )}
          </p>

          <p className="text-sm sm:text-base text-[#8b9bb4] max-w-2xl mb-8 font-valorant-hud leading-relaxed">
            {isEnglish ? (
              <>
                Software engineer in formation focused on immersive, scalable digital products. Full stack with{" "}
                <strong className="text-[#00f5d4]">Python, JavaScript, TypeScript and Java</strong>
                , plus Unity / VR interfaces. Independent product developer since 2024, junior researcher at UCC Pasto, and former competitive boxer (
                <strong className="text-[#00f5d4]">National Runner-up</strong>
                ).
              </>
            ) : (
              <>
                Ingeniero de software en formación, enfocado en experiencias digitales inmersivas y escalables. Full stack con{" "}
                <strong className="text-[#00f5d4]">Python, JavaScript, TypeScript y Java</strong>
                , más interfaces de alta precisión en Unity / VR. Desarrollador de producto independiente desde 2024, investigador junior en UCC Pasto y ex-boxeador (
                <strong className="text-[#00f5d4]">Subcampeón Nacional</strong>
                ).
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
            <a
              href="/cv.pdf"
              download="Carlos_Julian_Benavides_CV.pdf"
              className="btn-glow w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00f5d4] to-emerald-400 text-[#090e14] font-valorant-title text-lg tracking-wider rounded-full shadow-[0_0_30px_rgba(0,245,212,0.4)] hover:shadow-[0_0_45px_rgba(0,245,212,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 font-bold"
            >
              <Download className="w-5 h-5 text-[#090e14]" />
              <span>{isEnglish ? "DOWNLOAD CV" : "DESCARGAR CV"}</span>
            </a>
            <a
              href="#proyectos"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#00f5d4]/40 text-[#ece8e1] hover:border-[#00f5d4] hover:text-[#00f5d4] font-valorant-title text-lg tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <span>{isEnglish ? "VIEW WORK" : "VER PROYECTOS"}</span>
              <ArrowDownRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] xl:w-[480px] xl:h-[480px] animate-float-y">
            <div className="absolute inset-[-14px] rounded-full border border-dashed border-[#00f5d4]/40 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-[-28px] rounded-full border border-[#00f5d4]/15 animate-spin-reverse pointer-events-none" />
            <div className="absolute inset-0 rounded-full animate-pulse-ring border border-[#00f5d4]/40 pointer-events-none" />

            <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-[#00f5d4] via-emerald-500/30 to-transparent shadow-[0_0_50px_rgba(0,245,212,0.25)] flex items-center justify-center">
              <div className="photo-frame w-full h-full rounded-full overflow-hidden relative flex flex-col items-center justify-center shadow-inner border-2 border-[#00f5d4]/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/perfil.jpg"
                  alt="Carlos Julián Benavides"
                  className={`absolute inset-0 w-full h-full object-cover z-10 scale-[1.25] ${photoOk ? "opacity-100" : "opacity-0"}`}
                  style={{ objectPosition: "center 80%" }}
                  onLoad={() => setPhotoOk(true)}
                  onError={() => setPhotoOk(false)}
                />

                {!photoOk && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 photo-placeholder relative hero-scan">
                    <div className="w-32 h-32 rounded-full bg-[#00f5d4]/15 border border-[#00f5d4]/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,245,212,0.2)]">
                      <User className="w-16 h-16 text-[#00f5d4]" />
                    </div>
                    <div className="font-valorant-title text-2xl text-[#ece8e1]">CARLOS BENAVIDES</div>
                    <div className="font-valorant-mono text-xs text-[#00f5d4] mt-1 font-bold">
                      {isEnglish ? "PROFILE PHOTO" : "FOTO DE PERFIL"}
                    </div>
                    <span className="font-valorant-mono text-[10px] text-[#8b9bb4] mt-2 max-w-[200px]">
                      {isEnglish ? "(Place your picture in public/foto.jpg)" : "(Coloca tu foto en public/foto.jpg)"}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-5 z-20 px-4 py-1.5 rounded-full bg-[#090e14]/90 border border-[#00f5d4] text-[#00f5d4] font-valorant-mono text-xs font-bold shadow-lg">
                  UCC PASTO &bull; 19 {isEnglish ? "YRS" : "AÑOS"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
