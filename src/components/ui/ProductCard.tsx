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

  const HeartIcon = isWishlisted ? IconHeartFilled : IconHeart;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block aspect-3/4 rounded-4xl bg-white border border-black/5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.28)]"
    >
      {/* Image — insets on all sides and shrinks up on hover, revealing the white card behind it */}
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
          {discount && (
            <span className="bg-[#E8500A] text-white text-org-xs font-medium px-2.5 py-0.75 rounded-full">
              -{discount}%
            </span>
          )}
          {product.isNew && !discount && (
            <span className="bg-border-mint text-[#1A6B3C] text-org-xs font-medium px-2.5 py-0.75 rounded-full">
              NEW
            </span>
          )}
          {product.isFlashDeal && !discount && !product.isNew && (
            <span className="bg-ember-surface text-[#B84000] text-org-xs font-medium px-2.5 py-0.75 rounded-full">
              DEAL
            </span>
          )}
        </div>

        {/* Wishlist — floats over the photo at rest, fades out on hover (reappears beside the CTA below) */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/25 backdrop-blur-sm rounded-full border border-white/40 flex items-center justify-center transition-opacity duration-300 hover:bg-white/40 group-hover:opacity-0"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          tabIndex={-1}
        >
          <HeartIcon size={14} className={isWishlisted ? "text-[#E8500A]" : "text-white"} />
        </button>

        {/* Out of stock */}
        {product.status === "out_of_stock" && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
            <span className="text-org-xs font-medium text-gray-500 bg-white px-2.5 py-0.75 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content — pinned to the bottom slice the image reveals on hover; color-inverts */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex h-49 flex-col justify-center gap-1 px-5 py-4">
        <p className="text-org-xs font-medium text-white/70 group-hover:text-gray-500 transition-colors duration-300">
          {product.brand}
        </p>
        <h3 className="text-org-lg font-semibold text-white group-hover:text-gray-900 line-clamp-2 leading-[1.3] transition-colors duration-300">
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
                    : "fill-white/30 text-white/30 group-hover:fill-gray-200 group-hover:text-gray-200 transition-colors duration-300"
                }
              />
            ))}
          </div>
          <span className="text-org-xs text-white/70 group-hover:text-gray-400 transition-colors duration-300">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-org-md font-semibold text-white group-hover:text-[#25A55A] transition-colors duration-300">
            KES {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-org-xs text-white/60 line-through group-hover:text-[#E8500A] transition-colors duration-300">
              KES {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* CTA row — button always dark; wishlist circle grows in beside it on hover */}
        {product.status !== "out_of_stock" && (
          <div className="mt-1.5 flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 min-w-0 py-3.5 rounded-full text-org-base font-bold transition-all flex items-center justify-center gap-1.5 ${
                addedToCart ? "bg-border-mint text-[#1A6B3C]" : "bg-gray-900 text-white"
              }`}
            >
              <IconShoppingCart size={14} />
              {addedToCart ? "Added!" : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="w-0 opacity-0 group-hover:w-11 group-hover:opacity-100 h-11 shrink-0 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden transition-all duration-300"
            >
              <HeartIcon size={16} className={isWishlisted ? "text-[#E8500A]" : "text-gray-400"} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
