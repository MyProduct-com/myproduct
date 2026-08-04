"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Theme } from "../types/index";
import type { TestimonialCard as TestimonialCardData } from "@/store/storefrontContentStore";

interface TestimonialsProps {
  theme: Theme;
  testimonials: TestimonialCardData[];
}

function TestimonialCard({ t, theme }: { t: TestimonialCardData; theme: Theme }) {
  const textColor = t.textColor || theme.text;
  return (
    <div
      className="flex flex-col gap-5 shrink-0 w-75 sm:w-85 p-6"
      style={{
        background: t.bg || theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: t.borderRadius,
      }}
    >
      <p className="text-sm leading-relaxed" style={{ color: textColor }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        {t.avatar ? (
          <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
            style={{ background: theme.primary }}
          >
            {t.name.charAt(0) || "?"}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold" style={{ color: textColor }}>{t.name}</div>
          <div className="text-xs" style={{ color: theme.textMuted }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ theme, testimonials }: TestimonialsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (testimonials.length === 0) return null;

  const scrollByCard = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="py-16 sm:py-20">
      <style>{`
        .shop-testimonial-marquee { animation: shopTestimonialScroll 34s linear infinite; }
        .shop-testimonial-marquee:hover { animation-play-state: paused; }
        @keyframes shopTestimonialScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .shop-testimonial-scroller::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-end justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.black }}>
          What customers are saying
        </h2>

        {/* Mobile-only manual controls — no auto-scroll on small screens */}
        <div className="flex md:hidden gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Previous testimonial"
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
            style={{ borderColor: theme.border, color: theme.black }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Next testimonial"
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
            style={{ borderColor: theme.border, color: theme.black }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop — infinite auto-scrolling marquee, pauses while the pointer is over it */}
      {testimonials.length > 1 ? (
        <div
          className="hidden md:block overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0, black 96px, black calc(100% - 96px), transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0, black 96px, black calc(100% - 96px), transparent 100%)",
          }}
        >
          <div className="shop-testimonial-marquee flex gap-5 w-max px-4 sm:px-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} t={t} theme={theme} />
            ))}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex max-w-6xl mx-auto px-4 sm:px-6">
          <TestimonialCard t={testimonials[0]} theme={theme} />
        </div>
      )}

      {/* Mobile — static, swipe or use the arrow buttons above */}
      <div
        ref={scrollerRef}
        className="shop-testimonial-scroller flex md:hidden gap-4 overflow-x-auto px-4 sm:px-6"
        style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
      >
        {testimonials.map((t) => (
          <div key={t.id} style={{ scrollSnapAlign: "start" }}>
            <TestimonialCard t={t} theme={theme} />
          </div>
        ))}
      </div>
    </section>
  );
}
