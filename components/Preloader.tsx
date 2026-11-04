"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Logo from "@/components/Logo";

/** Count-up loader that exits with a spring curtain wipe. */
export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const barWidth = useTransform(count, (v) => `${v}%`);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [count]);

  const status = useTransform(count, (v): string =>
    v < 40 ? "BOOTING IDENTITY MARK" : v < 80 ? "SYNCING ARCHITECTURE" : "PORTFOLIO READY",
  );

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between p-6 sm:p-10 bg-[#030407] text-[#f3f1ec] select-none overflow-hidden"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={done ? { clipPath: "inset(0% 0% 100% 0%)" } : undefined}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      onAnimationComplete={() => done && onComplete()}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full bg-[#00f5d4]/15 blur-[120px]" />
        <div className="absolute right-[10%] top-[15%] w-[40vmin] h-[40vmin] rounded-full bg-[#7c4dff]/15 blur-[120px]" />
      </div>

      <div className="relative flex items-center justify-between font-mono text-[11px] tracking-[0.3em] uppercase text-[#8a93a6]">
        <span>CJ Benavides</span>
        <motion.span>{status}</motion.span>
      </div>

      <div className="relative flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="drop-shadow-[0_0_60px_rgba(0,245,212,0.5)]"
        >
          <Logo size={140} />
        </motion.div>
      </div>

      <div className="relative flex items-end justify-between gap-6">
        <div className="font-serif-i text-2xl sm:text-4xl text-[#8a93a6] max-w-xs leading-tight">
          Product Engineer
          <br />
          <span className="text-[#f3f1ec]">Full Stack &amp; Immersive</span>
        </div>
        <motion.div className="font-display font-extrabold text-[22vw] sm:text-[16vw] leading-[0.8] tabular-nums text-[#f3f1ec]">
          {rounded}
        </motion.div>
      </div>

      <motion.div
        className="absolute left-0 bottom-0 h-[3px] bg-gradient-to-r from-[#00f5d4] via-[#b388ff] to-[#ff3d81] shadow-[0_0_20px_#00f5d4]"
        style={{ width: barWidth }}
      />
    </motion.div>
  );
}
