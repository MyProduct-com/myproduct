import { useState } from "react";
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

const CONTENT_HEIGHT = 172;

export default function ProductCard({
  product, theme, cartItem, onAdd, onIncrease, onDecrease, onClick,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative aspect-3/4 overflow-hidden cursor-pointer transition-shadow duration-300 active:scale-[0.98]"
      style={{
        background: theme.bg,
        border: `1.5px solid ${hovered ? theme.primaryLight : theme.border}`,
        borderRadius: theme.radiusCard,
        boxShadow: hovered ? "0 20px 45px -12px rgba(0,0,0,0.28)" : "0 1px 2px rgba(0,0,0,0.06)",
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Image — insets and shrinks up on hover, revealing the card background behind it */}
      <div
        className="absolute overflow-hidden transition-all duration-500 ease-out"
        style={{
          top: hovered ? 8 : 0,
          left: hovered ? 8 : 0,
          right: hovered ? 8 : 0,
          bottom: hovered ? CONTENT_HEIGHT : 0,
          borderRadius: theme.radiusCard,
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />

        {/* Scrim for the rest-state text, fades away on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.2) 55%, transparent)",
            opacity: hovered ? 0 : 1,
          }}
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

      {/* Content — pinned to the bottom slice the image reveals on hover; color-inverts */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-center px-3.5 py-3"
        style={{ height: CONTENT_HEIGHT }}
      >
        <p
          className="font-semibold text-[13px] sm:text-sm leading-snug line-clamp-2 mb-1 transition-colors duration-300"
          style={{ color: hovered ? theme.black : "#ffffff" }}
        >
          {product.name}
        </p>
        <p
          className="text-[11px] sm:text-xs leading-relaxed line-clamp-2 mb-2.5 transition-colors duration-300"
          style={{ color: hovered ? theme.textMuted : "rgba(255,255,255,0.8)" }}
        >
          {shortDesc(product.description)}
          <span
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="ml-1 font-semibold cursor-pointer hover:underline"
            style={{ color: hovered ? theme.primary : "#ffffff" }}
          >
            more
          </span>
        </p>

        {/* Price + cart control */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span
            className="font-bold text-sm sm:text-base transition-colors duration-300"
            style={{ color: hovered ? theme.accent : "#ffffff" }}
          >
            {fmt(product.price)}
          </span>

          {product.stock === 0 ? null : !cartItem ? (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-bold transition-all active:scale-95 shrink-0"
              style={{
                background: hovered ? theme.black : "rgba(255,255,255,0.92)",
                color: hovered ? theme.textOnPrimary : theme.black,
              }}
            >
              + Add
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 rounded-full shrink-0 transition-colors duration-300"
              style={{
                background: hovered ? theme.surface : "rgba(255,255,255,0.18)",
                border: `1.5px solid ${hovered ? theme.border : "rgba(255,255,255,0.45)"}`,
                padding: "3px 6px",
              }}
            >
              <button
                onClick={onDecrease}
                className="w-6 h-6 flex items-center justify-center rounded-full font-bold text-lg leading-none transition-colors"
                style={{ color: hovered ? theme.primary : "#ffffff", background: "none", border: "none", cursor: "pointer" }}
              >
                −
              </button>
              <span
                className="w-5 text-center font-bold text-sm transition-colors duration-300"
                style={{ color: hovered ? theme.black : "#ffffff" }}
              >
                {cartItem.qty}
              </span>
              <button
                onClick={onIncrease}
                className="w-6 h-6 flex items-center justify-center rounded-full font-bold text-lg leading-none transition-colors"
                style={{ color: hovered ? theme.primary : "#ffffff", background: "none", border: "none", cursor: "pointer" }}
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
