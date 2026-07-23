import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C , HOW_IT_WORKS} from "./Constants";

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "96px 24px", background: C.surface }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Simple from day one</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>
            From signup to first sale<br />in one day
          </h2>
        </div>

        <div className="how-grid" style={{ position: "relative" }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} style={{ padding: "32px 28px", position: "relative" }}>
              {i < HOW_IT_WORKS.length - 1 && (
                <div style={{ position: "absolute", top: 52, right: 0, width: "50%", height: 2, background: `linear-gradient(90deg, ${C.mint}, transparent)`, display: "none" }} className="connector" />
              )}
              <div style={{ fontSize: 11, fontWeight: 900, color: C.action, letterSpacing: "0.1em", marginBottom: 14 }}>{step.step}</div>
              <div style={{ marginBottom: 14 }}><step.icon style={{ width: 32, height: 32, color: C.action }} /></div>
              <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: C.ink }}>{step.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: C.slate, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <Link href="/auth/signup" style={{
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 12, background: C.forest, color: "#fff",
            fontWeight: 700, fontSize: 16, boxShadow: "0 4px 16px rgba(26,107,60,.3)",
            transition: "transform .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
            Open my shop today <ArrowRight className="inline" style={{ width: 16, height: 16, verticalAlign: "middle" }} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;