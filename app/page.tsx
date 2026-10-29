"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageEffects from "@/components/PageEffects";
import { PortfolioProvider } from "@/context/PortfolioContext";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <PortfolioProvider>
      <div className="min-h-screen scroll-smooth selection:bg-[#00f5d4] selection:text-[#090e14] relative transition-colors duration-300">
        <div className="noise-overlay" />
        <PageEffects />
        {loading && <Preloader onComplete={() => setLoading(false)} />}

        <Navbar />
        
        <main className="flex-1 flex flex-col relative w-full pt-6 sm:pt-8 z-10">
          <Hero />
          <About />
          <Projects />
          <Testimonials />
          <Experience />
          <Skills />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </PortfolioProvider>
  );
}
