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
      className="group relative block aspect-3/4 rounded-4xl overflow-hidden cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.28)]"
      style={{
        background: theme.bg,
        border: `1px solid ${theme.border}`,
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
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-4xl transition-all duration-500 ease-out group-hover:top-2 group-hover:left-2 group-hover:right-2 group-hover:bottom-49">
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
            <span className="bg-orange-500 text-white text-org-xs font-medium px-2.5 py-0.75 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Unit badge — floats over the photo at rest, fades out on hover */}
        <span
          className="absolute top-3 right-3 z-10 text-org-xs font-medium px-2.5 py-1 rounded-full text-white transition-opacity duration-300 group-hover:opacity-0"
          style={{ background: theme.primary }}
        >
          {product.unit}
        </span>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
            <span className="text-org-xs font-medium text-gray-500 bg-white px-2.5 py-0.75 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content — pinned to the bottom slice the image reveals on hover; color-inverts */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex h-49 flex-col justify-center gap-1.5 px-5 py-4">
        <p className="text-org-lg font-semibold text-white line-clamp-2 leading-[1.3] transition-colors duration-300 group-hover:text-(--card-black)">
          {product.name}
        </p>
        <p className="text-org-xs text-white/80 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-(--card-muted)">
          {shortDesc(product.description)}
          <span
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="ml-1 font-medium cursor-pointer hover:underline text-white transition-colors duration-300 group-hover:text-(--card-primary)"
          >
            more
          </span>
        </p>

        <span className="font-mono text-org-md font-semibold text-white transition-colors duration-300 group-hover:text-(--card-accent) mt-0.5">
          {fmt(product.price)}
        </span>

        {/* CTA — full-width pill, same dark styling at rest and on hover */}
        {product.stock === 0 ? null : !cartItem ? (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="mt-1.5 w-full py-3.5 rounded-full text-org-base font-bold transition-all active:scale-95 shrink-0 bg-gray-900 text-white"
          >
            + Add to Cart
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-1.5 w-full flex items-center justify-between rounded-full shrink-0 bg-gray-900 py-1.5 px-2"
          >
            <button
              onClick={onDecrease}
              className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-lg leading-none bg-white/15 border-0 cursor-pointer text-white"
            >
              &minus;
            </button>
            <span className="font-bold text-org-base text-white">
              {cartItem.qty} in cart
            </span>
            <button
              onClick={onIncrease}
              className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-lg leading-none bg-white/15 border-0 cursor-pointer text-white"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
