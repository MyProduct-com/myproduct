"use client";
import Link from "next/link";
import { useState } from "react";
import { IconHeart, IconHeartFilled, IconShoppingCart, IconStar } from "@tabler/icons-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const isWishlisted = inWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/products/${product.id}`);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block aspect-3/4 rounded-[28px] bg-white border border-black/5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.28)]"
    >
      {/* Image — insets on all sides and shrinks up on hover, revealing the white card behind it */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-[28px] transition-all duration-500 ease-out group-hover:top-2 group-hover:left-2 group-hover:right-2 group-hover:bottom-43 group-hover:rounded-2xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Scrim for the rest-state text, fades away on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {discount && (
            <span className="bg-[#E8500A] text-white text-[11px] font-[500] px-[10px] py-[3px] rounded-full">
              -{discount}%
            </span>
          )}
          {product.isNew && !discount && (
            <span className="bg-[#D4F0E2] text-[#1A6B3C] text-[11px] font-[500] px-[10px] py-[3px] rounded-full">
              NEW
            </span>
          )}
          {product.isFlashDeal && !discount && !product.isNew && (
            <span className="bg-[#FFF0E8] text-[#B84000] text-[11px] font-[500] px-[10px] py-[3px] rounded-full">
              DEAL
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/25 backdrop-blur-sm rounded-full border border-white/40 flex items-center justify-center transition-colors hover:bg-white/40"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <IconHeartFilled size={14} className="text-[#E8500A]" />
          ) : (
            <IconHeart size={14} className="text-white" />
          )}
        </button>

        {/* Out of stock */}
        {product.status === "out_of_stock" && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
            <span className="text-[11px] font-[500] text-[#6B7280] bg-white px-[10px] py-[3px] rounded-full border border-[#E5E7EB]">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content — pinned to the bottom slice the image reveals on hover; color-inverts */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex h-43 flex-col justify-center gap-1 px-4 py-3">
        <p className="text-[11px] font-[500] text-white/70 group-hover:text-[#6B7280] transition-colors duration-300">
          {product.brand}
        </p>
        <h3 className="text-[13px] font-[500] text-white group-hover:text-[#111827] line-clamp-2 leading-[1.4] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex gap-px">
            {[1, 2, 3, 4, 5].map((s) => (
              <IconStar
                key={s}
                size={10}
                className={
                  s <= Math.round(product.rating)
                    ? "fill-white text-white group-hover:fill-[#E8500A] group-hover:text-[#E8500A] transition-colors duration-300"
                    : "fill-white/30 text-white/30 group-hover:fill-[#E5E7EB] group-hover:text-[#E5E7EB] transition-colors duration-300"
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-white/70 group-hover:text-[#9CA3AF] transition-colors duration-300">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[13px] font-[600] text-white group-hover:text-[#25A55A] transition-colors duration-300">
            KES {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-white/60 line-through group-hover:text-[#E8500A] transition-colors duration-300">
              KES {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart */}
        {product.status !== "out_of_stock" && (
          <button
            onClick={handleAddToCart}
            className={`mt-1 w-full py-[9px] rounded-full text-[13px] font-[500] transition-all flex items-center justify-center gap-1.5 ${
              addedToCart
                ? "bg-[#D4F0E2] text-[#1A6B3C]"
                : "bg-white/90 text-[#111827] group-hover:bg-[#111827] group-hover:text-white"
            }`}
          >
            <IconShoppingCart size={14} />
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>
        )}
      </div>
    </Link>
  );
}
