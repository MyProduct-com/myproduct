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

        /* Footer — mobile-first: single column, then 2-up, then the full 4-up desktop layout */
        .footer-pad { padding: 40px 20px 24px; }
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 32px; }
        .footer-bottom { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
        @media (min-width: 640px) {
          .footer-pad { padding: 52px 24px 28px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
          .footer-bottom { flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: wrap; }
        }
        @media (min-width: 1024px) {
          .footer-pad { padding: 60px 24px 32px; }
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
        }

        /* Marketplace section — duotone photo mosaic on the right, text on the left */
        .market-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
        .market-mosaic {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-auto-rows: 80px;
          grid-auto-flow: dense;
          gap: 0;
          overflow: hidden;
        }
        .market-mosaic-tile { position: relative; overflow: hidden; }
        .market-mosaic-tile img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: grayscale(1) contrast(1.05);
        }
        .market-mosaic-tile .market-tint { position: absolute; inset: 0; mix-blend-mode: color; }
        .market-mosaic-tile.span-2 { grid-row: span 2; }
        .market-mosaic-tile.span-3 { grid-row: span 3; }
        @media (min-width: 641px) {
          .market-mosaic { grid-auto-rows: 100px; }
        }
        @media (min-width: 1025px) {
          .market-grid { grid-template-columns: 0.9fr 1.25fr; gap: 60px; }
          .market-mosaic {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 150px;
            width: 116%;
            margin-right: -16%;
          }
        }
        @media (max-width: 640px) {
          .market-mosaic { display: none; }
        }

        /* Trust bar — infinite marquee of brand-name pills, pauses on hover */
        .trust-marquee-viewport {
          flex: 1; min-width: 0; overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%);
        }
        .trust-marquee-track { display: flex; gap: 12px; width: max-content; animation: trustMarquee 28s linear infinite; }
        .trust-marquee-viewport:hover .trust-marquee-track { animation-play-state: paused; }
        @keyframes trustMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* How-it-works steps — mobile-first, no ghost auto-fill columns */
        .how-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
        @media (min-width: 640px) {
          .how-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
        }
        @media (min-width: 1025px) {
          .how-grid { grid-template-columns: repeat(4, 1fr); gap: 0; }
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