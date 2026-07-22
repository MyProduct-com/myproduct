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
      className="group relative block aspect-3/4 overflow-hidden cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.28)]"
      style={{
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radiusCard,
        fontFamily: theme.fontFamily,
        // Bridge the shop's dynamic theme colors into CSS variables so the
        // group-hover: utilities below can reference them without JS state —
        // same mechanism the marketplace ProductCard uses.
        ["--card-black" as string]: theme.black,
        ["--card-muted" as string]: theme.textMuted,
        ["--card-primary" as string]: theme.primary,
        ["--card-accent" as string]: theme.accent,
        ["--card-surface" as string]: theme.surface,
        ["--card-border" as string]: theme.border,
        ["--card-on-primary" as string]: theme.textOnPrimary,
      } as React.CSSProperties}
    >
      {/* Image — insets on all sides and shrinks up on hover, revealing the card background behind it */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden transition-all duration-500 ease-out group-hover:top-2 group-hover:left-2 group-hover:right-2 group-hover:bottom-43"
        style={{ borderRadius: theme.radiusCard }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Scrim for the rest-state text, fades away on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[11px] font-medium px-2.5 py-0.75 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Unit badge (this shop's equivalent of a wishlist/heart slot) */}
        <span
          className="absolute top-3 right-3 z-10 text-[11px] font-medium px-2.5 py-0.75 rounded-full text-white"
          style={{ background: theme.primary }}
        >
          {product.unit}
        </span>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
            <span className="text-[11px] font-medium text-gray-500 bg-white px-2.5 py-0.75 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content — pinned to the bottom slice the image reveals on hover; color-inverts */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex h-43 flex-col justify-center gap-1 px-4 py-3">
        <p className="text-org-sm font-medium text-white line-clamp-2 leading-[1.4] transition-colors duration-300 group-hover:text-(--card-black)">
          {product.name}
        </p>
        <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-(--card-muted)">
          {shortDesc(product.description)}
          <span
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="ml-1 font-medium cursor-pointer hover:underline text-white transition-colors duration-300 group-hover:text-(--card-primary)"
          >
            more
          </span>
        </p>

        {/* Price + cart control */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="font-mono text-org-sm font-semibold text-white transition-colors duration-300 group-hover:text-(--card-accent)">
            {fmt(product.price)}
          </span>

          {product.stock === 0 ? null : !cartItem ? (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="px-3.5 py-1.5 rounded-full text-org-sm font-medium transition-all active:scale-95 shrink-0 bg-white/90 text-gray-900 group-hover:bg-(--card-black) group-hover:text-(--card-on-primary)"
            >
              + Add
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 rounded-full shrink-0 transition-colors duration-300 bg-white/18 border border-white/45 group-hover:bg-(--card-surface) group-hover:border-(--card-border)"
              style={{ padding: "3px 6px" }}
            >
              <button
                onClick={onDecrease}
                className="w-6 h-6 flex items-center justify-center rounded-full font-bold text-lg leading-none bg-transparent border-0 cursor-pointer text-white transition-colors group-hover:text-(--card-primary)"
              >
                &minus;
              </button>
              <span className="w-5 text-center font-bold text-sm text-white transition-colors duration-300 group-hover:text-(--card-black)">
                {cartItem.qty}
              </span>
              <button
                onClick={onIncrease}
                className="w-6 h-6 flex items-center justify-center rounded-full font-bold text-lg leading-none bg-transparent border-0 cursor-pointer text-white transition-colors group-hover:text-(--card-primary)"
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
