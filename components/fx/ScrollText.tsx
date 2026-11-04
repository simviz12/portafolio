"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type Segment = { t: string; hl?: boolean };

function Word({ word, hl, range, progress }: { word: string; hl?: boolean; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block mr-[0.25em] ${hl ? "text-gradient" : ""}`}>
      {word}
    </motion.span>
  );
}

/** Paragraph whose words light up one by one as it travels through the viewport. */
export default function ScrollText({ segments, className = "" }: { segments: Segment[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.3"] });

  const words = segments.flatMap((s) => s.t.split(" ").filter(Boolean).map((w) => ({ w, hl: s.hl })));
  const total = words.length;

  return (
    <p ref={ref} className={className}>
      {words.map((item, i) => (
        <Word key={i} word={item.w} hl={item.hl} progress={scrollYProgress} range={[i / total, (i + 1) / total]} />
      ))}
    </p>
  );
}
