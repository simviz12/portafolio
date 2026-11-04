"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

export const springIn = { type: "spring", stiffness: 90, damping: 18, mass: 0.9 } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: springIn },
};

/** Fade + slide + un-blur on enter. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "p";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ ...springIn, delay }}
    >
      {children}
    </Comp>
  );
}

/** Staggered container: children should be <RevealItem>. */
export function Stagger({
  children,
  className = "",
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/** Masked word-by-word reveal: each word rises out of its own clip box. */
export function SplitWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const words = text.split(" ");
  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-10% 0px" } };
  return (
    <motion.span
      className={`inline ${className}`}
      aria-label={text}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: { y: "110%", rotate: 6 },
              show: { y: "0%", rotate: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
