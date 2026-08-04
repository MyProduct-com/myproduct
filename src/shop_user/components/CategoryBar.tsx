import type { Theme } from "../types/index";

interface CategoryBarProps {
  theme: Theme;
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryBar({ theme, categories, active, onChange }: CategoryBarProps) {
  return (
    <div
      className="sticky top-16 z-30"
      style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}
    >
      <style>{`.shop-category-track::-webkit-scrollbar{display:none;}`}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="shop-category-track flex gap-2.5 py-3.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {["All", ...categories].map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className="shrink-0 px-4.5 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: isActive ? theme.black : theme.surface,
                  color: isActive ? "#fff" : theme.textMuted,
                  border: `1px solid ${isActive ? theme.black : theme.border}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
