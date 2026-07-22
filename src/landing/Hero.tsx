import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { C } from "./Constants";

const SLIDES = [
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600&h=1000&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=1000&fit=crop&q=80",
  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1600&h=1000&fit=crop&q=80",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&h=1000&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=1600&h=1000&fit=crop&q=80",
];

function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden px-5"
      style={{ background: C.forest, paddingTop: "clamp(6.5rem, 18vw, 11rem)", paddingBottom: "clamp(3.5rem, 10vw, 7rem)" }}
    >
      {/* Background image carousel */}
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${src})`, opacity: i === slide ? 0.55 : 0 }}
        />
      ))}
      {/* Vignette overlay — darkest behind the text (now left-aligned), lighter toward the right so the slides stay visible */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 55% 65% at 28% 45%, ${C.forest}CC 0%, ${C.forest}80 55%, ${C.forest}40 100%)` }}
      />
      {/* Background texture dots */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-300 mx-auto w-full">
        <div className="max-w-2xl w-full text-left flex flex-col items-start">
        <h1
          className="m-0 mb-6 leading-[1.1] tracking-[-0.03em]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          <span className="block font-bold text-white text-[clamp(34px,7vw,58px)]">
            Your shop. Online.
          </span>
          <span className="block font-bold italic text-[clamp(34px,7vw,58px)]" style={{ color: C.mint }}>
            In one afternoon.
          </span>
        </h1>

        <p className="text-[16px] sm:text-[18px] leading-[1.7] mb-10 max-w-xl" style={{ color: "rgba(255,255,255,.85)", textShadow: "0 1px 12px rgba(0,0,0,.5)" }}>
          MyProduct gives Kenyan businesses everything to sell online — products, orders, POS, M-Pesa payments,
          and a shared marketplace — in one platform, from KSh 999/month.
        </p>

        <div className="flex gap-3.5 flex-wrap justify-start mb-14">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 no-underline px-7 py-3.5 rounded-xl font-extrabold text-[16px] text-white transition-all hover:-translate-y-0.5"
            style={{ background: C.action }}
          >
            Start free — no credit card <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/market"
            className="inline-flex items-center gap-2 no-underline px-6 py-3.5 rounded-xl font-semibold text-[16px] text-white transition-colors hover:bg-white/[0.18]"
            style={{ background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.25)" }}
          >
            Discover Shops
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="flex gap-2 justify-start">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 22 : 8,
                background: i === slide ? "#fff" : "rgba(255,255,255,.4)",
              }}
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

export default Hero;
