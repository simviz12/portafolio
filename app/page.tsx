"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
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
import Backdrop from "@/components/fx/Backdrop";
import Cursor from "@/components/fx/Cursor";
import SmoothScroll from "@/components/fx/SmoothScroll";
import ScrollSkew from "@/components/fx/ScrollSkew";
import { PortfolioProvider } from "@/context/PortfolioContext";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <PortfolioProvider>
      <SmoothScroll />
      <Backdrop />
      <Cursor />
      <AnimatePresence>{loading && <Preloader onComplete={() => setLoading(false)} />}</AnimatePresence>

      <Navbar />

      <div className="relative w-full overflow-x-clip">
      <ScrollSkew className="relative z-10">
        <main className="relative w-full flex flex-col">
          <Hero ready={!loading} />
          <About />
          <Projects />
          <Testimonials />
          <Experience />
          <Skills />
          <Contact />
        </main>
      </ScrollSkew>

      <Footer />
      </div>
    </PortfolioProvider>
  );
}
