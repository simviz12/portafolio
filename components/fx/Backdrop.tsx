"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePortfolio } from "@/context/PortfolioContext";

const Scene3D = dynamic(() => import("@/components/fx/Scene3D"), { ssr: false });

/** Every fixed visual layer behind / above the content. */
export default function Backdrop() {
  const { theme } = usePortfolio();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <>
      <div className="aurora" aria-hidden>
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>
      <div className="fixed inset-0 z-0 grid-lines pointer-events-none" aria-hidden />
      <Scene3D theme={theme} />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] z-[120] origin-left"
        style={{
          scaleX: progress,
          background: "linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3))",
          boxShadow: "0 0 18px var(--glow)",
        }}
      />
    </>
  );
}
