"use client";

import { motion } from "framer-motion";
import { SplitWords } from "@/components/fx/Reveal";
import { fitStyle } from "@/components/fx/fit";

/** Asymmetric section header: index · eyebrow, giant title, serif accent, side note. */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  note,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent?: string;
  note?: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-14 sm:mb-20 ${
        align === "right" ? "lg:text-right" : ""
      }`}
    >
      <div className={`@container min-w-0 lg:col-span-8 ${align === "right" ? "lg:col-start-5 lg:order-2" : ""}`}>
        <motion.div
          initial={{ opacity: 0, x: align === "right" ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className={`flex items-center gap-3 mb-6 font-mono text-[11px] tracking-[0.3em] uppercase text-muted ${
            align === "right" ? "lg:justify-end" : ""
          }`}
        >
          <span className="text-accent-ink">{index}</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
          <span className="min-w-0 break-words">{eyebrow}</span>
        </motion.div>
        <h2
          className="font-display font-extrabold uppercase leading-[0.88] text-ink"
          style={fitStyle("clamp(2.6rem,7.5vw,7rem)", title, accent)}
        >
          <SplitWords text={title} />
          {accent && (
            <>
              {" "}
              <span className="font-serif-i normal-case font-normal text-gradient text-[0.9em]">
                <SplitWords text={accent} delay={0.15} />
              </span>
            </>
          )}
        </h2>
      </div>
      {note && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
          className={`lg:col-span-4 text-base sm:text-lg text-muted leading-relaxed max-w-md ${
            align === "right" ? "lg:order-1 lg:text-left" : "lg:justify-self-end"
          }`}
        >
          {note}
        </motion.p>
      )}
    </div>
  );
}
