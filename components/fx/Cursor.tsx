"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

function subscribeFinePointer(cb: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Two-layer cursor: an instant dot + a spring-lagged ring that
 * swells over interactive elements and gets "sucked" into magnetic ones.
 */
export default function Cursor() {
  const enabled = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const magnetic = target?.closest<HTMLElement>("[data-magnetic]");
      if (magnetic) {
        // Suction: the ring is pulled toward the element's center.
        const r = magnetic.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        x.set(cx + (e.clientX - cx) * 0.35);
        y.set(cy + (e.clientY - cy) * 0.35);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
      }
      const interactive = target?.closest("a, button, [data-cursor], input, textarea, label");
      setHover(Boolean(interactive));
      setLabel(target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
      const inGame = Boolean(target?.closest("[data-game-viewport]")) && !target?.closest("[data-game-ui]");
      setHidden(Boolean(target?.closest("[data-native-cursor]")) || inGame);
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 96 : hover ? 64 : 34;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[200] pointer-events-none rounded-full flex items-center justify-center"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: hidden ? 0 : 1,
          scale: down ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <div
          className="absolute inset-0 rounded-full border transition-colors duration-300"
          style={{
            borderColor: "var(--accent)",
            background: hover ? "color-mix(in oklab, var(--accent) 14%, transparent)" : "transparent",
            boxShadow: hover ? "0 0 30px var(--glow)" : "none",
            backdropFilter: hover ? "blur(2px)" : "none",
          }}
        />
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-ink"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[201] pointer-events-none w-1.5 h-1.5 rounded-full"
        style={{ x, y, translateX: "-50%", translateY: "-50%", background: "var(--accent)", boxShadow: "0 0 12px var(--glow)" }}
        animate={{ opacity: hidden || label ? 0 : 1 }}
      />
    </>
  );
}
