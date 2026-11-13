"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin reading-progress bar pinned to the top edge of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 inset-x-0 h-[2px] z-[120] origin-left pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3))",
      }}
    />
  );
}
