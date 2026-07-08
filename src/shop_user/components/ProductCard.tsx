import type { Product, CartItem, Theme } from "../types/index";
import { fmt, shortDesc } from "../utils/helpers";

interface ProductCardProps {
  product: Product;
  theme: Theme;
  cartItem: CartItem | undefined;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onClick: () => void;
}

export default function ProductCard({
  product, theme, cartItem, onAdd, onIncrease, onDecrease, onClick,
}: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
      style={{
        background: theme.bg,
        border: `1.5px solid ${theme.border}`,
        borderRadius: theme.radiusCard,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        fontFamily: theme.fontFamily,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(22,163,74,0.15)";
        (e.currentTarget as HTMLDivElement).style.borderColor = theme.primaryLight;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLDivElement).style.borderColor = theme.border;
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className="absolute top-2 right-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ background: theme.primary }}
        >
          {product.unit}
        </span>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3">
        <p className="font-semibold text-[13px] sm:text-sm leading-snug line-clamp-2 mb-1"
          style={{ color: theme.black }}>
          {product.name}
        </p>
        <p className="text-[11px] sm:text-xs leading-relaxed flex-1 mb-2.5"
          style={{ color: theme.textMuted }}>
          {shortDesc(product.description)}
          <span
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="ml-1 font-semibold cursor-pointer hover:underline"
            style={{ color: theme.primary }}
          >
            more
          </span>
        </p>

        {/* Price + cart control */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="font-bold text-sm sm:text-base" style={{ color: theme.accent }}>
            {fmt(product.price)}
          </span>

          {product.stock === 0 ? null : !cartItem ? (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="px-3 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-bold text-white transition-all active:scale-95 shrink-0"
              style={{ background: theme.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.background = theme.primary)}
            >
              + Add
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 rounded-lg shrink-0"
              style={{ background: theme.surface, border: `1.5px solid ${theme.border}`, padding: "3px 6px" }}
            >
              <button
                onClick={onDecrease}
                className="w-6 h-6 flex items-center justify-center rounded font-bold text-lg leading-none transition-colors hover:bg-red-50"
                style={{ color: theme.primary, background: "none", border: "none", cursor: "pointer" }}
              >
                −
              </button>
              <span className="w-5 text-center font-bold text-sm" style={{ color: theme.black }}>
                {cartItem.qty}
              </span>
              <button
                onClick={onIncrease}
                className="w-6 h-6 flex items-center justify-center rounded font-bold text-lg leading-none transition-colors hover:bg-green-50"
                style={{ color: theme.primary, background: "none", border: "none", cursor: "pointer" }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}