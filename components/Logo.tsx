"use client";

import { useId } from "react";

type LogoProps = {
  className?: string;
  size?: number;
};

export default function Logo({ className = "", size = 48 }: LogoProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      aria-label="Carlos Benavides"
      role="img"
    >
      <defs>
        <linearGradient id={`${uid}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7fffe8" />
          <stop offset="100%" stopColor="#00b89a" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="58" fill="#d9fff6" stroke={`url(#${uid}-ring)`} strokeWidth="7" />
      <circle cx="64" cy="64" r="48" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeOpacity="0.35" />
      <g fill="#0b3d3a">
        <path d="M50 34c-15 0-26 12.4-26 30s11 30 26 30c7.8 0 14.2-2.5 19.2-7.8l-8-8.1c-3 3-6.6 4.7-11 4.7-8 0-13.4-7-13.4-18.8S42 42.2 50 42.2c4.4 0 8 1.7 11 4.7l8-8.1C64.2 36.5 57.8 34 50 34z" />
        <path
          fillRule="evenodd"
          d="M74 34h22c9.6 0 17.2 6.4 17.2 15.6 0 5.8-3.2 10.4-8.4 13 6.6 2.3 11 7.8 11 15.4C115.8 89.6 107 97 95.4 97H74V34zm13.2 21.2h8.4c4 0 6.6-2.4 6.6-5.8s-2.6-5.6-6.6-5.6h-8.4v11.4zm0 31.2h10c4.8 0 8-3 8-7.4s-3.2-7.4-8-7.4h-10v14.8z"
        />
      </g>
      <circle cx="64" cy="18" r="4" fill="#00c4a7" />
    </svg>
  );
}
