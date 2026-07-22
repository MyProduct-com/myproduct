"use client";
import { useEffect, useState } from "react";
import { C } from "./Constants";
import Nav from "./Nav";
import Hero from "./Hero";
import TrustBar from "./Trust";
import Features from "./Features";
import HowItWorks from "./How";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import MarketplacePreview from "./Market";
import About from "./About";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";



function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}



export default function LandingPage() {
  const scrolled = useScrolled(60);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .mobile-nav-toggle { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          button.mobile-nav-toggle { display: flex !important; }
          div.mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.canvas, color: C.charcoal, overflowX: "hidden" }}>
        <Nav scrolled={scrolled} />
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <MarketplacePreview />
        <About />
        <FinalCTA />
        <Footer />
        <ChatWidget />
      </div>
    </>
  );
}