import type { Theme } from "../types/index";

interface HowItWorksProps {
  theme: Theme;
  title: string;
  subtitle: string;
  steps: { title: string; desc: string }[];
}

export default function HowItWorks({ theme, title, subtitle, steps }: HowItWorksProps) {
  return (
    <section className="py-16 sm:py-20" style={{ background: theme.black }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-md mb-12 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">{title}</h2>
          <p className="text-sm sm:text-base text-white/65">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 relative">
          <div className="hidden sm:block absolute top-5 left-[8%] right-[8%] h-px bg-white/20" />
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white mb-5"
                style={{ background: theme.primary }}
              >
                {i + 1}
              </div>
              <h3 className="text-base font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed max-w-70 text-white/65">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
