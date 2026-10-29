"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onComplete, 700);
          }, 280);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + step, 100);
      });
    }, 55);

    return () => clearInterval(interval);
  }, [onComplete]);

  const status =
    progress < 40
      ? "BOOTING IDENTITY MARK..."
      : progress < 80
        ? "SYNCING ARCHITECTURE..."
        : "PORTFOLIO READY";

  return (
    <div
      className={`preloader-root fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090e14] transition-all duration-700 select-none ${
        isFading ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#00f5d4_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#00f5d4]/15 blur-[120px] pointer-events-none" />

      <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center mb-10">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#00f5d4]/30 animate-spin-slow" />
        <Logo
          size={220}
          className="relative z-10 drop-shadow-[0_0_40px_rgba(0,245,212,0.55)]"
        />
        <div
          className="absolute inset-8 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(0,245,212,${(progress / 100) * 0.28}) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-4 w-80 sm:w-96 max-w-[90vw]">
        <div className="flex items-center justify-between w-full font-valorant-mono text-sm text-[#8b9bb4]">
          <span className="tracking-[4px] text-[#00f5d4] uppercase font-bold">CJ BENAVIDES</span>
          <span className="font-valorant-title text-2xl text-[#ece8e1]">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-[#16222f] rounded-full overflow-hidden p-0.5 border border-[#00f5d4]/20">
          <div
            className="h-full bg-gradient-to-r from-[#00f5d4] to-emerald-300 rounded-full shadow-[0_0_18px_#00f5d4] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-valorant-mono text-xs text-[#8b9bb4] tracking-[3px] uppercase mt-1">
          {status}
        </span>
      </div>
    </div>
  );
}
