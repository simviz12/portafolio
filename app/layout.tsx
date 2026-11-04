import type { Metadata, Viewport } from "next";
import { Syne, Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const syne = Syne({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
});

const interTight = Inter_Tight({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Carlos Julián Benavides Burbano · Product Engineer",
  description:
    "Product Engineer | Full Stack & Immersive Technologies. Python, TypeScript, Java, Unity VR, Django, Spring Boot y sistemas multi-agente. Pasto, Colombia.",
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#030407" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="theme-light">
      <body
        className={`${syne.variable} ${interTight.variable} ${jetbrains.variable} ${instrument.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
