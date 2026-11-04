import type { CSSProperties } from "react";

/**
 * Font-size that guarantees the longest word fits its container (needs an `@container` ancestor).
 * `display` words use the wide uppercase display face (~1.15em per char), `serif` words the italic accent (~0.42em).
 */
export function fitStyle(max: string, display: string, serif = "", perChar = 1.2): CSSProperties {
  const longest = (s: string) => s.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0);
  const fit = Math.max(longest(display) * perChar, longest(serif) * 0.45, 1);
  return {
    fontSize: `min(${max}, calc(100cqi / ${fit.toFixed(2)}))`,
  };
}
