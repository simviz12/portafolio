"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D tilt with a moving specular glare. Children can use
 * `style={{ transform: "translateZ(40px)" }}` to float above the surface.
 */
export default function TiltCard({
  children,
  className = "",
  max = 10,
  glare = true,
  cursor,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  cursor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, var(--glass-hi), transparent 45%)`;
  const glowBg = useMotionTemplate`radial-gradient(380px circle at ${gx} ${gy}, var(--glow), transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      data-cursor={cursor}
      className={`group relative preserve-3d will-change-transform ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
      {glare && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-60 transition-opacity duration-500 mix-blend-soft-light"
            style={{ background: glareBg }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-35 transition-opacity duration-500 -z-10 blur-2xl"
            style={{ background: glowBg }}
          />
        </>
      )}
    </motion.div>
  );
}
