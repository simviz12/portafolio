import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const shareTech = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share",
});

export const metadata: Metadata = {
  title: "Carlos Julián Benavides Burbano · Product Engineer",
  description:
    "Product Engineer | Full Stack & Immersive Technologies. Python, TypeScript, Java, Unity VR, Django, Spring Boot y sistemas multi-agente. Pasto, Colombia.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${rajdhani.variable} ${shareTech.variable} antialiased selection:bg-[#ff4655] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
