"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity, useReducedMotion } from "framer-motion";

/** Subtle skew/stretch driven by scroll velocity — the page "bends" as it moves. */
export default function ScrollSkew({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewY = useTransform(smooth, [-3000, 0, 3000], [1.6, 0, -1.6], { clamp: true });
  const scaleY = useTransform(smooth, [-3000, 0, 3000], [1.012, 1, 1.012], { clamp: true });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ skewY, scaleY, transformOrigin: "50% 50%" }}>
      {children}
    </motion.div>
  );
}
