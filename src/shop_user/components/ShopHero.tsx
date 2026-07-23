"use client";

import { useEffect, useState } from "react";
import type { Theme } from "../types/index";
import type { HeroSlide } from "@/store/storefrontContentStore";

interface ShopHeroProps {
  theme: Theme;
  slides: HeroSlide[];
  title: string;
  ctaText: string;
}

const SLIDE_INTERVAL_MS = 6500; // total time a slide is on screen before the next one slides in
const SLIDE_UP_MS = 1200; // portion of that spent on the slide-up entrance
const SLIDE_UP_PCT = Math.round((SLIDE_UP_MS / SLIDE_INTERVAL_MS) * 100);

// Request a larger, higher-quality render of the same photo so it
// stays crisp at full hero size instead of a thumbnail-sized version.
function heroImage(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("w", "1600");
    u.searchParams.set("q", "80");
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return url;
  }
}

export default function ShopHero({ theme, slides, title, ctaText }: ShopHeroProps) {
  const [slide, setSlide] = useState(0);
  const prevSlide = slides.length > 0 ? (slide - 1 + slides.length) % slides.length : 0;

  useEffect(() => {
    if (slide >= slides.length) setSlide(0);
  }, [slides.length, slide]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-5"
      style={{ background: theme.primary }}
    >
      <style>{`
        @keyframes shopHeroSlideZoom {
          0%    { transform: translateY(100%) scale(1.1); animation-timing-function: cubic-bezier(0.22,1,0.36,1); }
          ${SLIDE_UP_PCT}%   { transform: translateY(0%) scale(1.1); animation-timing-function: linear; }
          100%  { transform: translateY(0%) scale(1); }
        }
      `}</style>

      {/* Settled layer — previous slide, already at rest, sits underneath while the next one slides up over it */}
      {slides.length > 0 && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage(slides[prevSlide].image)})` }}
        />
      )}

      {/* Active layer — slides up from the bottom, then slowly zooms out from 1.1x to 1x while on screen */}
      {slides.length > 0 && (
        <div
          key={slides[slide]?.id ?? slide}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage(slides[slide].image)})`,
            animation: slides.length > 1 ? `shopHeroSlideZoom ${SLIDE_INTERVAL_MS}ms forwards` : undefined,
          }}
        />
      )}

      {/* Vignette overlay for legibility — dark, low intensity so the photo still shows through */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 65% at 50% 45%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.32) 55%, rgba(0,0,0,0.15) 100%)` }}
      />

      <div className="relative z-20 max-w-2xl mx-auto w-full text-center py-16">
        <h1
          className="font-bold text-white leading-[1.1] tracking-tight mb-4"
          style={{ fontFamily: theme.fontFamily, fontSize: "clamp(30px, 5vw, 48px)" }}
        >
          {title}
        </h1>
        {theme.shopTagline && (
          <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
            {theme.shopTagline}
          </p>
        )}
        <a
          href="#products"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all hover:-translate-y-0.5"
          style={{ background: "#fff", color: theme.primary }}
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}
